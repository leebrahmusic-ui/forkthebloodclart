<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuoteCheckoutRequest;
use App\Models\{Booking, Transaction};
use App\Services\QuoteCheckoutService;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Services\BookingNotificationService;
use Illuminate\Support\Facades\Cache;

class QuoteCheckoutController extends Controller
{
    public function store(QuoteCheckoutRequest $request, QuoteCheckoutService $svc)
    {
        $data = $svc->checkout($request->validated());

        return response()->json(['data' => $data], 201);
    }

    public function success(Request $request)
    {
        $bookingId = (int) $request->query('booking');
        $txId      = (int) $request->query('tx');
        $sessionId = (string) $request->query('session_id', '');

        if (!$bookingId || !$txId || !$sessionId) {
            throw ValidationException::withMessages([
                'payment' => ['Missing booking/tx/session details.'],
            ]);
        }

        $booking = Booking::findOrFail($bookingId);
        $tx = Transaction::where('id', $txId)
            ->where('booking_id', $bookingId)
            ->firstOrFail();

        $stripe = new StripeClient(config('services.stripe.secret'));
        $session = $stripe->checkout->sessions->retrieve($sessionId);

        // ✅ Trust but verify:
        // Ensure the session is for this booking
        $sessionBookingId = (int) ($session->client_reference_id ?? 0);
        $metaBookingId = (int) ($session->metadata['booking_id'] ?? 0);

        if ($sessionBookingId !== (int)$booking->id && $metaBookingId !== (int)$booking->id) {
            return redirect()->route('booking.failed', ['booking' => $booking->id]);
        }

        if ($session->payment_status === 'paid') {
            $tx->update([
                'status' => 'succeeded',
                'succeeded_at' => now(),
                'provider_payload' => array_merge($tx->provider_payload ?? [], [
                    'success_session' => $session->toArray(),
                ]),
            ]);

            $booking->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'status' => 'confirmed',
            ]);

            if (method_exists($booking, 'appointment') && $booking->appointment) {
                $booking->appointment()->update(['status' => 'confirmed']);
            }
            \Log::info('Stripe success hit', [
                'booking' => $request->query('booking'),
                'tx' => $request->query('tx'),
                'session_id' => $request->query('session_id'),
            ]);
            // app(BookingNotificationService::class)->sendConfirmed($booking);
            try {
                \Log::info('About to send booking emails', ['booking_id' => $booking->id]);

                app(\App\Services\BookingNotificationService::class)->sendConfirmed($booking);

                \Log::info('Booking emails sent', ['booking_id' => $booking->id]);
            } catch (\Throwable $e) {
                \Log::error('Booking email send failed', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                ]);
            }

            \Log::info('Email targets', [
                'customer_email' => $booking->customer?->email,
                'admin_emails' => config('mail.admin_emails'),
                'from' => config('mail.from.address'),
            ]);

            if ($request->session()->has('quote_session_id')) {
                Cache::forget('quote:new:results:' . $request->session()->get('quote_session_id'));
                $request->session()->forget('quote_session_id');
            }

            return redirect()->route('booking.confirmed', ['booking' => $booking->id]);
        }

        return redirect()->route('booking.failed', ['booking' => $booking->id]);
    }

    public function cancel(Request $request)
    {
        $bookingId = (int) $request->query('booking');
        $txId      = (int) $request->query('tx');

        $booking = Booking::findOrFail($bookingId);

        $booking->update([
            'payment_status' => 'failed',
            'status' => 'submitted',
        ]);

        Transaction::where('id', $txId)
            ->where('booking_id', $bookingId)
            ->update(['status' => 'cancelled']);

        return redirect()->route('booking.cancelled', ['booking' => $booking->id]);
    }

    public function confirmIntent(Request $request)
    {
        $data = $request->validate([
            'booking_id' => ['required', 'integer'],
            'tx_id' => ['required', 'integer'],
            'payment_intent_id' => ['required', 'string'],
        ]);

        $isPaid = $this->finalizePaymentIntent(
            (int) $data['booking_id'],
            (int) $data['tx_id'],
            (string) $data['payment_intent_id']
        );

        return response()->json([
            'data' => [
                'redirect_url' => $isPaid
                    ? route('booking.confirmed', ['booking' => (int) $data['booking_id']])
                    : route('booking.failed', ['booking' => (int) $data['booking_id']]),
            ],
        ]);
    }

    public function successIntent(Request $request)
    {
        $bookingId = (int) $request->query('booking');
        $txId = (int) $request->query('tx');
        $paymentIntentId = (string) $request->query('payment_intent', '');

        if (!$bookingId || !$txId || !$paymentIntentId) {
            throw ValidationException::withMessages([
                'payment' => ['Missing booking/transaction/payment details.'],
            ]);
        }

        $isPaid = $this->finalizePaymentIntent($bookingId, $txId, $paymentIntentId);

        return $isPaid
            ? redirect()->route('booking.confirmed', ['booking' => $bookingId])
            : redirect()->route('booking.failed', ['booking' => $bookingId]);
    }

    private function finalizePaymentIntent(int $bookingId, int $txId, string $paymentIntentId): bool
    {
        $booking = Booking::findOrFail($bookingId);
        $tx = Transaction::where('id', $txId)
            ->where('booking_id', $bookingId)
            ->firstOrFail();

        if ($tx->status === 'succeeded' && $booking->payment_status === 'paid') {
            return true;
        }

        $stripe = new StripeClient(config('services.stripe.secret'));
        $intent = $stripe->paymentIntents->retrieve($paymentIntentId);

        $metaBookingId = (int) ($intent->metadata['booking_id'] ?? 0);
        if ($metaBookingId !== $booking->id) {
            return false;
        }

        if ($intent->status !== 'succeeded') {
            return false;
        }

        $tx->update([
            'status' => 'succeeded',
            'succeeded_at' => now(),
            'provider_payment_intent_id' => $intent->id,
            'provider_payload' => array_merge($tx->provider_payload ?? [], [
                'success_payment_intent' => $intent->toArray(),
            ]),
        ]);

        $booking->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
            'status' => 'confirmed',
        ]);

        if (method_exists($booking, 'appointment') && $booking->appointment) {
            $booking->appointment()->update(['status' => 'confirmed']);
        }

        try {
            app(BookingNotificationService::class)->sendConfirmed($booking);
        } catch (\Throwable $e) {
            \Log::error('Booking email send failed (payment intent)', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }

        return true;
    }



    public function confirmed(Booking $booking)
    {
        return Inertia::render('Book/Payment/Confirmed', [
            'booking' => $booking->only([
                'id','status','payment_status','paid_at','total','currency'
            ]),
        ]);
    }

    public function failed(Booking $booking)
    {
        return Inertia::render('Book/Payment/Failed', [
            'booking' => $booking->only([
                'id','status','payment_status','total','currency'
            ]),
        ]);
    }

    public function cancelled(Booking $booking)
    {
        return Inertia::render('Book/Payment/Cancelled', [
            'booking' => $booking->only([
                'id','status','payment_status','total','currency'
            ]),
        ]);
    }
}
