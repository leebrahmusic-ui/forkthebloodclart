<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'customer_id',
        'appointment_id',
        'subtotal',
        'discount',
        'coupon_code',
        'coupon_snapshot',
        'tax',
        'total',
        'currency',
        'status',
        'payment_status',
        'paid_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'coupon_snapshot' => 'array',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function details()
    {
        return $this->hasMany(BookingDetail::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function latestTransaction()
    {
        return $this->hasOne(Transaction::class)->latestOfMany();
    }

    public function products()
    {
        return $this->hasMany(CustomerOrderProduct::class);
    }

    public function productAddOns()
    {
        return $this->hasMany(CustomerOrderProductAddOn::class);
    }
}
