<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CheckoutCoupon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CheckoutCouponController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CheckoutCoupons', [
            'coupons' => CheckoutCoupon::query()
                ->orderByDesc('is_active')
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:80', 'unique:checkout_coupons,code'],
            'discount_type' => ['required', Rule::in(['fixed', 'percent'])],
            'discount_value' => ['required', 'numeric', 'gt:0'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $code = strtoupper(trim($data['code']));

        if ($data['discount_type'] === 'percent' && (float) $data['discount_value'] > 100) {
            return back()->withErrors(['discount_value' => 'Percent discount cannot exceed 100.']);
        }

        CheckoutCoupon::create([
            'code' => $code,
            'discount_type' => $data['discount_type'],
            'discount_value' => (float) $data['discount_value'],
            'is_active' => (bool) ($data['is_active'] ?? true),
            'starts_at' => $data['starts_at'] ?? null,
            'ends_at' => $data['ends_at'] ?? null,
            'service' => 'new_boiler_quote',
            'notes' => $data['notes'] ?? null,
        ]);

        return back()->with('success', 'Coupon created.');
    }

    public function update(Request $request, CheckoutCoupon $coupon)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:80', Rule::unique('checkout_coupons', 'code')->ignore($coupon->id)],
            'discount_type' => ['required', Rule::in(['fixed', 'percent'])],
            'discount_value' => ['required', 'numeric', 'gt:0'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        if ($data['discount_type'] === 'percent' && (float) $data['discount_value'] > 100) {
            return back()->withErrors(['discount_value' => 'Percent discount cannot exceed 100.']);
        }

        $coupon->update([
            'code' => strtoupper(trim($data['code'])),
            'discount_type' => $data['discount_type'],
            'discount_value' => (float) $data['discount_value'],
            'is_active' => (bool) ($data['is_active'] ?? false),
            'starts_at' => $data['starts_at'] ?? null,
            'ends_at' => $data['ends_at'] ?? null,
            'service' => 'new_boiler_quote',
            'notes' => $data['notes'] ?? null,
        ]);

        return back()->with('success', 'Coupon updated.');
    }

    public function destroy(CheckoutCoupon $coupon)
    {
        $coupon->delete();

        return back()->with('success', 'Coupon deleted.');
    }
}
