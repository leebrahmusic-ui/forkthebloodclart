<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutCoupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'is_active',
        'starts_at',
        'ends_at',
        'service',
        'notes',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];
}
