<?php

namespace App\Services;

use App\Mail\BookingConfirmedAdminMail;
use App\Mail\BookingConfirmedCustomerMail;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BookingNotificationService
{
    public function sendConfirmed(Booking $booking): void
    {
        $booking->loadMissing(['customer', 'appointment', 'details', 'transactions', 'products.addOns', 'productAddOns']);

        $customerEmail = $booking->customer?->email ?: null;
        $adminEmails = array_values(array_filter(array_map('trim', explode(',', (string) config('mail.admin_emails')))));

        Log::info('Booking email dispatch start', [
            'booking_id' => $booking->id,
            'customer_email' => $customerEmail,
            'admin_emails' => $adminEmails,
            'from' => [
                'address' => config('mail.from.address'),
                'name' => config('mail.from.name'),
            ],
            'mailer' => config('mail.default'),
        ]);

        // Customer
        if ($customerEmail) {
            try {
                Mail::to($customerEmail)->send(new BookingConfirmedCustomerMail($booking));
                Log::info('Booking customer email sent', [
                    'booking_id' => $booking->id,
                    'to' => $customerEmail,
                ]);
            } catch (\Throwable $e) {
                Log::error('Booking customer email FAILED', [
                    'booking_id' => $booking->id,
                    'to' => $customerEmail,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('Booking customer email skipped (no email)', ['booking_id' => $booking->id]);
        }

        // Admin
        if (!empty($adminEmails)) {
            try {
                Mail::to($adminEmails)->send(new BookingConfirmedAdminMail($booking));
                Log::info('Booking admin email sent', [
                    'booking_id' => $booking->id,
                    'to' => $adminEmails,
                ]);
            } catch (\Throwable $e) {
                Log::error('Booking admin email FAILED', [
                    'booking_id' => $booking->id,
                    'to' => $adminEmails,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('Booking admin email skipped (no admin emails configured)', ['booking_id' => $booking->id]);
        }

        Log::info('Booking email dispatch end', ['booking_id' => $booking->id]);
    }
}
