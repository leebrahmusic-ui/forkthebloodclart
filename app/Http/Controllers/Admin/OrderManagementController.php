<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class OrderManagementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(5, min(50, $perPage));

        // ✅ fix: read status from query, default "all"
        $appointmentStatus = (string) $request->query('status', 'all');

        // ✅ optional: only allow known values to avoid garbage filters
        $allowedAppointmentStatuses = ['all','pending','confirmed','completed','cancelled'];

        if (!in_array($appointmentStatus, $allowedAppointmentStatuses, true)) {
            $appointmentStatus = 'all';
        }

        $q = Booking::query()
            ->with([
                'customer:id,full_name,email,phone,postcode,address_line1,address_line2,city,county,country,address_full',
                'appointment:id,type,starts_at,appointment_date,status',
                'details:id,booking_id,frontend_key,question_snapshot,answer_text,answer_json,media,amount',
                'transactions:id,booking_id,provider,amount,currency,kind,status,provider_checkout_session_id,provider_payment_intent_id,provider_charge_id,provider_refund_id,created_at',

                'products:id,booking_id,boiler_id,brand,model,kw,warranty_years,amount,includes,images',
                'products.addOns:id,booking_id,customer_order_product_id,key,label,qty,unit_price,total,derived',
            ])
            ->latest('id');

        // ✅ Search (customer)
        if ($search = trim((string) $request->query('q', ''))) {
            $q->whereHas('customer', function ($qq) use ($search) {
                $qq->where('email', 'like', "%{$search}%")
                ->orWhere('full_name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // ✅ Appointment status filter
        if ($appointmentStatus !== 'all') {
            $q->whereHas('appointment', function ($qq) use ($appointmentStatus) {
                $qq->where('status', $appointmentStatus);
            });
        }

        $bookings = $q->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Orders/Management', [
            'bookings' => $bookings,
            'filters' => [
                'q' => $request->query('q', ''),
                'per_page' => $perPage,
                'status' => $appointmentStatus, // ✅ send back to UI
            ],
            // optional: pass allowed list so UI is always in sync
            'appointmentStatusOptions' => $allowedAppointmentStatuses,
        ]);
    }



    public function updateStatus(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'booking_status' => ['nullable', Rule::in(['draft','submitted','confirmed','cancelled'])],

            // ✅ align with UI
            'payment_status' => ['nullable', Rule::in(['unpaid','pending','paid','failed','refunded','cancelled'])],

            // ✅ align with UI
            'appointment_status' => ['nullable', Rule::in(['pending','confirmed','completed','cancelled','no_show'])],
        ]);

        return DB::transaction(function () use ($booking, $data) {

            if (!empty($data['booking_status'])) {
                $booking->status = $data['booking_status'];
            }

            if (!empty($data['payment_status'])) {
                $booking->payment_status = $data['payment_status'];

                if ($data['payment_status'] === 'paid' && empty($booking->paid_at)) {
                    $booking->paid_at = now();
                }
            }

            $booking->save();

            if (!empty($data['appointment_status']) && $booking->appointment) {
                $booking->appointment()->update([
                    'status' => $data['appointment_status'],
                ]);
            }

            $booking->loadMissing(['customer','appointment','details','transactions']);

            return back()->with('success', 'Status updated.');
        });
    }

}
