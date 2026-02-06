<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_key',
        'slot_minutes',
        'start_hour',
        'end_hour',
        'max_per_day',
        'gap_minutes',
        'last_slot_time',
    ];
}
