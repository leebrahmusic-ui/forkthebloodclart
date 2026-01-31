<?php

namespace App\Services;

use App\Models\{Appointment, Booking, Customer, Question, BookingDetail, Transaction};
use App\Support\QuotePayloadNormalizer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Stripe\StripeClient;
use App\Models\CustomerOrderProduct;
use App\Models\CustomerOrderProductAddOn;


class QuoteCheckoutService
{
    public function __construct(
        private AppointmentBlockService $blocker
    ) {}

    public function checkout(array $payload): array
    {
        $tz = config('app.timezone');
        // dd($payload);

        $serviceType = QuotePayloadNormalizer::serviceKey($payload['service']);
        $form = $payload['form'];
        $amount = $payload['amount'];
        // dd($amount);

        $customerData = QuotePayloadNormalizer::customer($form);
        $apptData = QuotePayloadNormalizer::appointment($form);
        $answers = QuotePayloadNormalizer::answers($form);
        $product = QuotePayloadNormalizer::product($form);
        $addonsPayload = QuotePayloadNormalizer::addOns($form);
        // dd($products);

        if (empty($customerData['email'])) {
            throw ValidationException::withMessages(['email' => ['Email is required.']]);
        }
        if (empty($apptData['date']) || empty($apptData['time'])) {
            throw ValidationException::withMessages(['visit_time' => ['Visit date and time are required.']]);
        }

        $startsAtLocal = QuotePayloadNormalizer::parseStartsAt($apptData['date'], $apptData['time'], $tz);
        $appointmentDate = $startsAtLocal->toDateString();

        return DB::transaction(function () use ($serviceType, $customerData, $answers, $startsAtLocal, $appointmentDate, $tz, $amount, $product, $addonsPayload) {

            // 1) Customer by email
            $customer = Customer::query()->updateOrCreate(
                ['email' => $customerData['email']],
                [
                    'full_name' => $customerData['full_name'] ?? 'Customer',
                    'phone' => $customerData['phone'] ?? null,
                    'postcode' => $customerData['postcode'] ?? null,
                    'address_full' => $customerData['address_full'] ?? null,
                ]
            );

            // dd($customer);


            // 2) Availability re-check (no hold system, but race-safe on submit)
            $blockedInfo = $this->blocker->blockedForDay($appointmentDate, $serviceType, $tz);
            foreach (($blockedInfo['blocked'] ?? []) as $r) {
                $from = Carbon::parse($r['from'], $tz);
                $to = Carbon::parse($r['to'], $tz);

                if ($startsAtLocal->gte($from) && $startsAtLocal->lt($to)) {
                    throw ValidationException::withMessages([
                        'visit_time' => ['Selected time is not available.'],
                    ]);
                }
            }

            // 3) Create Appointment
            $appointment = Appointment::create([
                'customer_id' => $customer->id, // if you want null until paid, set null here
                'type' => $serviceType,
                'starts_at' => $startsAtLocal->copy()->timezone('UTC'),
                'appointment_date' => $appointmentDate,
                'status' => 'pending',
            ]);
            // dd($appointment);

            // 4) Create Booking
            $booking = Booking::create([
                'customer_id' => $customer->id,
                'appointment_id' => $appointment->id,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => $amount,
                'currency' => config('services.currency.code'),
                'status' => 'submitted',
                'payment_status' => 'pending',
            ]);

            $productDetails = CustomerOrderProduct::query()->updateOrCreate(
                [
                    'booking_id' => $booking->id,
                    'boiler_id'  => $product['boiler_id'] ?? null,
                ],
                [
                    'brand'          => $product['brand'] ?? null,
                    'model'          => $product['model'] ?? null,
                    'kw'             => $product['kw'] ?? null,
                    'warranty_years' => $product['warrantyYears'] ?? null,
                    'amount'         => (int) ($product['amount'] ?? 0),
                    'includes'       => $product['includes'] ?? [],
                    'images'         => $product['images'] ?? [],
                    'meta'           => $product, // optional but recommended
                ]
            );


            $derived = $addonsPayload['derived'] ?? null;
            $items   = $addonsPayload['items'] ?? [];

            foreach ($items as $item) {
                CustomerOrderProductAddOn::updateOrCreate(
                    [
                        'booking_id' => $booking->id,
                        'customer_order_product_id' => $productDetails->id,
                        'key' => $item['key'],
                    ],
                    [
                        'label' => $item['label'] ?? $item['key'],
                        'qty' => (int) ($item['qty'] ?? 1),
                        'unit_price' => (int) ($item['unitPrice'] ?? 0),
                        'total' => (int) ($item['total'] ?? ((int)($item['qty'] ?? 1) * (int)($item['unitPrice'] ?? 0))),
                        'derived' => $derived['flueType'] ?? null, // can be null
                    ]
                );
            }


            // 5) Create BookingDetails from Questions table
            $questions = Question::query()
                ->where('type', $serviceType)
                ->get()
                ->keyBy('frontend_key');

            if ($questions->isEmpty()) {
                throw ValidationException::withMessages([
                    'service' => ['No questions configured for this service.'],
                ]);
            }

            // dd($answers);
            // reject unknown answer keys (optional but recommended)
            foreach ($answers as $k => $_) {
                if (!$questions->has($k)) {
                    // allow *_extraText if master exists for that key too
                    if (!$questions->has($k)) {
                        // if your questions table includes access_extraText etc then it will pass.
                        throw ValidationException::withMessages(["answers.$k" => ["Invalid question key."]]);
                    }
                }
            }

            foreach ($answers as $k => $v) {
                $q = $questions->get($k);
                if (!$q) continue; // ignore keys not defined (if you prefer strict, throw above)

                [$answerText, $answerJson, $media] = $this->normalize($k, $v);

                BookingDetail::create([
                    'booking_id' => $booking->id,
                    'question_id' => $q->id,
                    'frontend_key' => $k,
                    'question_snapshot' => $q->question,
                    'answer_text' => $answerText,
                    'answer_json' => $answerJson,
                    'media' => $media,
                    'amount' => $q->price_adjustment,
                ]);
            }

            // Optional: compute totals (for now use base quote price from frontend modal)
            // Better: compute from fixed_price selection + adjustments.
            $total = $this->computeTotal($booking);
            $booking->update([
                'subtotal' => $total,
                'total' => $total,
            ]);

            // 6) Initiate Transaction + Stripe Checkout
            $tx = Transaction::create([
                'booking_id' => $booking->id,
                'provider' => 'stripe',
                'amount' => $booking->total,
                'currency' => $booking->currency,
                'kind' => 'payment',
                'status' => 'initiated',
            ]);

            $checkoutUrl = $this->createStripeCheckout($booking, $tx);

            return [
                'booking_id' => $booking->id,
                'transaction_id' => $tx->id,
                'checkout_url' => $checkoutUrl,
            ];
        });
    }

    private function normalize(string $key, mixed $value): array
    {
        if ($key === 'media') {
            return [null, null, is_array($value) ? array_values($value) : []];
        }

        if (is_array($value)) {
            return [null, $value, null];
        }

        if (is_bool($value)) {
            return [$value ? 'yes' : 'no', null, null];
        }

        if ($value === null) {
            return [null, null, null];
        }

        return [strval($value), null, null];
    }

    private function computeTotal(Booking $booking): float
    {
        // MVP: sum BookingDetail->amount if present, otherwise keep 0 and override from frontend
        $total = $booking->total;
        $sum = $total ? $total : $booking->details()->sum('amount');
        return (float) ($sum > 0 ? $sum : 0);
    }

    private function createStripeCheckout(Booking $booking, Transaction $tx): string
    {
        $stripe = new StripeClient(config('services.stripe.secret'));

        $success = route('checkout.success', ['booking' => $booking->id, 'tx' => $tx->id]);
        $cancel  = route('checkout.cancel',  ['booking' => $booking->id, 'tx' => $tx->id]);

        // dd([
        //     'mode' => 'payment',
        //     'success_url' => $success . '&session_id={CHECKOUT_SESSION_ID}',
        //     'cancel_url' => $cancel,
        //     // 'automatic_payment_methods' => ['enabled' => true],
        //     'client_reference_id' => (string) $booking->id,
        //     'customer_email' => $booking->customer->email,
        //     'metadata' => [
        //         'booking_id' => (string) $booking->id,
        //         'transaction_id' => (string) $tx->id,
        //     ],
        //     'line_items' => [[
        //         'quantity' => 1,
        //         'price_data' => [
        //             'currency' => strtolower($booking->currency),
        //             'unit_amount' => (int) round(((float) $booking->total) * 100),
        //             'product_data' => [
        //                 'name' => 'Service booking',
        //             ],
        //         ],
        //     ]],
        // ]);
        $session = $stripe->checkout->sessions->create([
            'mode' => 'payment',
            'success_url' => $success . '&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $cancel,
            // 'automatic_payment_methods' => ['enabled' => true],
            'client_reference_id' => (string) $booking->id,
            'customer_email' => $booking->customer->email,
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'transaction_id' => (string) $tx->id,
            ],
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => strtolower($booking->currency),
                    'unit_amount' => (int) round(((float) $booking->total) * 100),
                    'product_data' => [
                        'name' => 'MD Gas Booking',
                    ],
                ],
            ]],
        ]);

        // store provider ids in transactions (NOT bookings)
        $tx->update([
            'provider_checkout_session_id' => $session->id,
            'status' => 'processing',
            'provider_payload' => ['checkout_session' => $session->toArray()],
        ]);

        return $session->url;
    }



    public static function parseStartsAt(string $date, string $time, string $tz): Carbon
    {
        $time = trim($time);

        // Normalize weird combos like "15:00 PM" or "15:00AM"
        // If time starts with 13-23 hour, drop AM/PM suffix safely.
        if (preg_match('/^(1[3-9]|2[0-3]):\d{2}\s*(AM|PM)$/i', $time)) {
            $time = preg_replace('/\s*(AM|PM)$/i', '', $time);
        }

        // If it's 24h "HH:mm"
        if (preg_match('/^\d{2}:\d{2}$/', $time)) {
            return Carbon::createFromFormat('Y-m-d H:i', "{$date} {$time}", $tz);
        }

        // If it's 12h "h:mm AM/PM"
        if (preg_match('/^\d{1,2}:\d{2}\s*(AM|PM)$/i', $time)) {
            return Carbon::createFromFormat('Y-m-d g:i A', "{$date} {$time}", $tz);
        }

        // If it's "h AM/PM" (rare)
        if (preg_match('/^\d{1,2}\s*(AM|PM)$/i', $time)) {
            return Carbon::createFromFormat('Y-m-d g A', "{$date} {$time}", $tz);
        }

        // Last resort fallback
        return Carbon::parse("{$date} {$time}", $tz);
    }

}
