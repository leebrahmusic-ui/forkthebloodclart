<?php

namespace App\Services;

use App\Models\{Appointment, Booking, Customer, Question, BookingDetail, Transaction};
use App\Models\CheckoutCoupon;
use App\Support\QuotePayloadNormalizer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
        $embedded = (bool) ($payload['embedded'] ?? false);
        $paymentElement = (bool) ($payload['payment_element'] ?? false);
        $form = $payload['form'];
        $baseAmount = $this->normalizeAmount(
            $payload['amount']
                ?? ($payload['form']['product']['amount'] ?? null)
                ?? ($payload['form']['product']['price'] ?? 0)
        );
        $couponCode = trim((string) ($payload['coupon_code'] ?? ''));
        $pricing = $this->applyCoupon($baseAmount, $couponCode, $serviceType);
        $amount = $pricing['total'];
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

        if ($baseAmount <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['Invalid quote amount. Please refresh and try again.'],
            ]);
        }

        $startsAtLocal = QuotePayloadNormalizer::parseStartsAt($apptData['date'], $apptData['time'], $tz);
        $appointmentDate = $startsAtLocal->toDateString();

        return DB::transaction(function () use ($serviceType, $embedded, $paymentElement, $customerData, $answers, $startsAtLocal, $appointmentDate, $tz, $amount, $product, $addonsPayload, $pricing) {

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

            // 3) Guard against exact slot already taken
            $startsAtUtc = $startsAtLocal->copy()->timezone('UTC');
            $slotTaken = Appointment::query()
                ->where('appointment_date', $appointmentDate)
                ->where('starts_at', $startsAtUtc)
                ->whereIn('status', ['pending', 'confirmed', 'completed'])
                ->exists();

            if ($slotTaken) {
                throw ValidationException::withMessages([
                    'visit_time' => ['Selected time is no longer available. Please choose another slot.'],
                ]);
            }

            // 4) Create Appointment
            $appointment = Appointment::create([
                'customer_id' => $customer->id, // if you want null until paid, set null here
                'type' => $serviceType,
                'starts_at' => $startsAtUtc,
                'appointment_date' => $appointmentDate,
                'status' => 'pending',
            ]);
            // dd($appointment);

            // 4) Create Booking
            $booking = Booking::create([
                'customer_id' => $customer->id,
                'appointment_id' => $appointment->id,
                'subtotal' => $pricing['base'],
                'discount' => $pricing['discount'],
                'coupon_code' => $pricing['coupon']['code'] ?? null,
                'coupon_snapshot' => $pricing['coupon'],
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

            $hasQuestions = $questions->isNotEmpty();

            // dd($answers);
            if ($hasQuestions) {
                // reject unknown answer keys (optional but recommended)
                foreach ($answers as $k => $_) {
                    if (!$questions->has($k)) {
                        // allow *_extraText if master exists for that key too
                        if (!$questions->has($k)) {
                            throw ValidationException::withMessages(["answers.$k" => ["Invalid question key."]]);
                        }
                    }
                }
            }

            foreach ($answers as $k => $v) {
                $q = $questions->get($k);

                [$answerText, $answerJson, $media] = $this->normalize($k, $v);

                BookingDetail::create([
                    'booking_id' => $booking->id,
                    'question_id' => $q?->id,
                    'frontend_key' => $k,
                    'question_snapshot' => $q?->question ?? $k,
                    'answer_text' => $answerText,
                    'answer_json' => $answerJson,
                    'media' => $media,
                    'amount' => $q?->price_adjustment,
                ]);
            }

            // Preserve pre-computed subtotal/discount/total from coupon-adjusted quote.

            // 6) Initiate Transaction + Stripe Checkout
            $tx = Transaction::create([
                'booking_id' => $booking->id,
                'provider' => 'stripe',
                'amount' => $booking->total,
                'currency' => $booking->currency,
                'kind' => 'payment',
                'status' => 'initiated',
            ]);

            if ($paymentElement && in_array($serviceType, ['boiler_service', 'new_boiler_quote'], true)) {
                $checkout = $this->createStripePaymentElementIntent($booking, $tx);
            } else {
                $checkout = $this->createStripeCheckout(
                    $booking,
                    $tx,
                    $embedded && $serviceType === 'boiler_service'
                );
            }

            return [
                'booking_id' => $booking->id,
                'transaction_id' => $tx->id,
                'checkout_url' => $checkout['checkout_url'] ?? null,
                'checkout_client_secret' => $checkout['checkout_client_secret'] ?? null,
                'checkout_mode' => $checkout['checkout_mode'] ?? 'redirect',
                'payment_intent_id' => $checkout['payment_intent_id'] ?? null,
                'return_url' => $checkout['return_url'] ?? null,
                'pricing' => [
                    'base' => $pricing['base'],
                    'discount' => $pricing['discount'],
                    'total' => $pricing['total'],
                    'coupon' => $pricing['coupon'],
                ],
            ];
        });
    }

    public function previewCouponPricing(array $payload): array
    {
        $serviceType = QuotePayloadNormalizer::serviceKey($payload['service']);
        $baseAmount = $this->normalizeAmount($payload['amount'] ?? 0);
        $couponCode = trim((string) ($payload['coupon_code'] ?? ''));

        if ($baseAmount <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['Invalid quote amount. Please refresh and try again.'],
            ]);
        }

        return $this->applyCoupon($baseAmount, $couponCode, $serviceType);
    }

    public function updateCouponForPendingCheckout(array $payload): array
    {
        return DB::transaction(function () use ($payload) {
            $booking = Booking::query()
                ->with('appointment')
                ->findOrFail((int) $payload['booking_id']);

            $tx = Transaction::query()
                ->where('id', (int) $payload['tx_id'])
                ->where('booking_id', $booking->id)
                ->firstOrFail();

            if (($booking->appointment?->type ?? null) !== 'new_boiler_quote') {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Coupon updates are only available for new boiler checkout.'],
                ]);
            }

            if (! in_array($booking->payment_status, ['pending', 'unpaid'], true)) {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Checkout is already completed and cannot be changed.'],
                ]);
            }

            if (! $tx->provider_payment_intent_id) {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Secure payment is not initialized yet.'],
                ]);
            }

            $baseAmount = (float) ($booking->subtotal ?? 0);
            if ($baseAmount <= 0) {
                $baseAmount = (float) ($booking->total ?? 0) + (float) ($booking->discount ?? 0);
            }

            if ($baseAmount <= 0) {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Unable to update coupon for this booking.'],
                ]);
            }

            $couponCode = trim((string) ($payload['coupon_code'] ?? ''));
            $pricing = $this->applyCoupon($baseAmount, $couponCode, 'new_boiler_quote');

            $booking->update([
                'subtotal' => $pricing['base'],
                'discount' => $pricing['discount'],
                'coupon_code' => $pricing['coupon']['code'] ?? null,
                'coupon_snapshot' => $pricing['coupon'],
                'total' => $pricing['total'],
            ]);

            $tx->update([
                'amount' => $pricing['total'],
            ]);

            $stripe = new StripeClient(config('services.stripe.secret'));
            $stripe->paymentIntents->update($tx->provider_payment_intent_id, [
                'amount' => (int) round($pricing['total'] * 100),
                'metadata' => [
                    'booking_id' => (string) $booking->id,
                    'transaction_id' => (string) $tx->id,
                    'coupon_code' => (string) ($pricing['coupon']['code'] ?? ''),
                ],
            ]);

            return [
                'pricing' => $pricing,
            ];
        });
    }

    private function applyCoupon(float $baseAmount, string $couponCode, string $serviceType): array
    {
        if ($couponCode !== '' && $serviceType !== 'new_boiler_quote') {
            throw ValidationException::withMessages([
                'coupon_code' => ['Coupon codes are only valid for new boiler checkout.'],
            ]);
        }

        $result = [
            'base' => $baseAmount,
            'discount' => 0.0,
            'total' => $baseAmount,
            'coupon' => null,
        ];

        if ($couponCode === '') {
            return $result;
        }

        $now = now();
        $normalizedCode = Str::upper(trim($couponCode));

        $coupon = CheckoutCoupon::query()
            ->whereRaw('UPPER(code) = ?', [$normalizedCode])
            ->where('is_active', true)
            ->where(function ($q) use ($serviceType) {
                $q->whereNull('service')->orWhere('service', $serviceType);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->first();

        if (! $coupon) {
            throw ValidationException::withMessages([
                'coupon_code' => ['Invalid or inactive coupon code.'],
            ]);
        }

        $discount = 0.0;
        if ($coupon->discount_type === 'percent') {
            $discount = round($baseAmount * ((float) $coupon->discount_value / 100), 2);
        } else {
            $discount = round((float) $coupon->discount_value, 2);
        }

        if ($discount <= 0) {
            throw ValidationException::withMessages([
                'coupon_code' => ['Coupon discount is not valid.'],
            ]);
        }

        $discount = min($discount, $baseAmount);
        $total = max(0, round($baseAmount - $discount, 2));

        $result['discount'] = $discount;
        $result['total'] = $total;
        $result['coupon'] = [
            'code' => $coupon->code,
            'discount_type' => $coupon->discount_type,
            'discount_value' => (float) $coupon->discount_value,
        ];

        return $result;
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

    private function createStripeCheckout(Booking $booking, Transaction $tx, bool $embedded = false): array
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
        $sessionPayload = [
            'mode' => 'payment',
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
        ];

        if ($embedded) {
            $sessionPayload['ui_mode'] = 'embedded';
            $sessionPayload['return_url'] = $success . '&session_id={CHECKOUT_SESSION_ID}';
        } else {
            $sessionPayload['success_url'] = $success . '&session_id={CHECKOUT_SESSION_ID}';
            $sessionPayload['cancel_url'] = $cancel;
        }

        $session = $stripe->checkout->sessions->create($sessionPayload);

        // store provider ids in transactions (NOT bookings)
        $tx->update([
            'provider_checkout_session_id' => $session->id,
            'status' => 'processing',
            'provider_payload' => ['checkout_session' => $session->toArray()],
        ]);

        return [
            'checkout_mode' => $embedded ? 'embedded' : 'redirect',
            'checkout_url' => $session->url ?? null,
            'checkout_client_secret' => $session->client_secret ?? null,
        ];
    }

    private function createStripePaymentElementIntent(Booking $booking, Transaction $tx): array
    {
        $stripe = new StripeClient(config('services.stripe.secret'));

        $intent = $stripe->paymentIntents->create([
            'amount' => (int) round(((float) $booking->total) * 100),
            'currency' => strtolower($booking->currency),
            'automatic_payment_methods' => ['enabled' => true],
            'receipt_email' => $booking->customer->email,
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'transaction_id' => (string) $tx->id,
            ],
            'description' => 'MD Gas Booking',
        ]);

        $tx->update([
            'provider_payment_intent_id' => $intent->id,
            'status' => 'processing',
            'provider_payload' => [
                'payment_intent' => $intent->toArray(),
            ],
        ]);

        return [
            'checkout_mode' => 'payment_element',
            'checkout_client_secret' => $intent->client_secret,
            'payment_intent_id' => $intent->id,
            'return_url' => route('checkout.success.intent', [
                'booking' => $booking->id,
                'tx' => $tx->id,
            ]),
        ];
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

    private function normalizeAmount(mixed $amount): float
    {
        if (is_numeric($amount)) {
            return (float) $amount;
        }

        if (is_string($amount)) {
            $clean = preg_replace('/[^\d,.-]/', '', $amount) ?? '';

            if (str_contains($clean, ',') && str_contains($clean, '.')) {
                $clean = str_replace(',', '', $clean);
            } elseif (str_contains($clean, ',')) {
                $clean = str_replace(',', '.', $clean);
            }

            return is_numeric($clean) ? (float) $clean : 0.0;
        }

        return 0.0;
    }
}
