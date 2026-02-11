<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentSetting;
use App\Models\AppointmentBlackout;
use Carbon\Carbon;

class AppointmentBlockService
{
    public function blockedForDay(string $date, string $type, ?string $timezone = null): array
    {
        $tz = $timezone ?: config('app.timezone');

        $configRules = config('appointment.rules');
        $rule = $configRules[$type] ?? null;

        $dbRule = AppointmentSetting::where('service_key', $type)->first();

        $defaultSlot = config('appointment.slot_minutes', 60);
        $gap = (int) ($dbRule?->gap_minutes ?? $rule['gap_minutes'] ?? 0);
        $max = (int) ($dbRule?->max_per_day ?? $rule['max_per_day'] ?? 5);
        $slotMinutes = (int) ($dbRule?->slot_minutes ?? $defaultSlot);

        // Cache per-service slot lengths so cross-type blocks respect each booking's duration
        $slotMinutesByType = AppointmentSetting::all()
            ->keyBy('service_key')
            ->map(fn($s) => (int) ($s->slot_minutes ?? $defaultSlot));

        $day = Carbon::parse($date, $tz)->startOfDay();
        $startHour = (int) ($dbRule?->start_hour ?? config('appointment.start_hour'));
        $endHour   = (int) ($dbRule?->end_hour   ?? config('appointment.end_hour'));
        $workStart = $day->copy()->setTime($startHour, 0);
        $workEnd   = $day->copy()->setTime($endHour, 0);

        $activeStatuses = ['pending', 'confirmed', 'completed'];

        $appointments = Appointment::query()
            ->whereDate('appointment_date', $day->toDateString())
            ->whereIn('status', $activeStatuses)
            ->get(['type','starts_at','status']);

        // Rule: max per day (type-specific)
        $countType = $appointments->where('type', $type)->count();
        if ($countType >= $max) {
            return [
                'date' => $day->toDateString(),
                'type' => $type,
                'blocked' => [[
                    'from' => $workStart->toDateTimeString(),
                    'to'   => $workEnd->toDateTimeString(),
                    'reason' => "Daily limit reached ({$max})",
                ]],
            ];
        }

        // No gap → block the booked slot window (any type)
        if ($gap <= 0) {
            if ($appointments->isEmpty()) {
                return ['date' => $day->toDateString(), 'type' => $type, 'blocked' => []];
            }

            $blocked = [];
            foreach ($appointments as $a) {
                $start = Carbon::parse($a->starts_at)->timezone($tz);
                if ($start->toDateString() !== $day->toDateString()) continue;

                $appointmentSlot = $slotMinutesByType[$a->type] ?? $defaultSlot;

                $blocked[] = [
                    'from' => $start->toDateTimeString(),
                    'to' => $start->copy()->addMinutes($appointmentSlot)->toDateTimeString(),
                    'reason' => 'Slot already booked',
                ];
            }

            return [
                'date' => $day->toDateString(),
                'type' => $type,
                'blocked' => $this->mergeRanges($blocked),
            ];
        }

        // Gap applies against all appointments; block duration plus configured gap buffer.
        $blocked = [];

        // Add manual blackouts (admin-marked)
        $blackouts = AppointmentBlackout::query()
            ->where(function ($q) use ($type) {
                $q->whereNull('service_key')->orWhere('service_key', $type);
            })
            ->whereDate('starts_at', '<=', $day->toDateString())
            ->whereDate('ends_at', '>=', $day->toDateString())
            ->get();

        foreach ($blackouts as $b) {
            $from = Carbon::parse($b->starts_at, $tz);
            $to   = Carbon::parse($b->ends_at, $tz);

            if ($to->lte($workStart) || $from->gte($workEnd)) continue;

            $blocked[] = [
                'from' => max($from, $workStart)->toDateTimeString(),
                'to'   => min($to, $workEnd)->toDateTimeString(),
                'reason' => $b->reason ?? 'Blackout',
            ];
        }

        foreach ($appointments as $a) {
            $start = Carbon::parse($a->starts_at)->timezone($tz);

            if ($start->toDateString() !== $day->toDateString()) continue;

            $appointmentSlot = $slotMinutesByType[$a->type] ?? $defaultSlot;

            // Block appointment duration plus gap buffer
            $from = $start->copy()->subMinutes($gap);
            $to   = $start->copy()->addMinutes($appointmentSlot + $gap);

            // clamp to working hours
            if ($to->lte($workStart) || $from->gte($workEnd)) continue;

            $blocked[] = [
                'from' => max($from, $workStart)->toDateTimeString(),
                'to'   => min($to, $workEnd)->toDateTimeString(),
                'reason' => "Within {$gap} mins of appointment at ".$start->format('H:i'),
            ];
        }

        return [
            'date' => $day->toDateString(),
            'type' => $type,
            'blocked' => $this->mergeRanges($blocked),
        ];
    }

    private function mergeRanges(array $ranges): array
    {
        if (empty($ranges)) return [];

        usort($ranges, fn($a,$b) => strcmp($a['from'], $b['from']));
        $out = [$ranges[0]];

        foreach (array_slice($ranges,1) as $r) {
            $last = &$out[count($out)-1];
            if ($r['from'] <= $last['to']) {
                if ($r['to'] > $last['to']) $last['to'] = $r['to'];
                $last['reason'] = 'Merged blocks';
            } else {
                $out[] = $r;
            }
        }

        return $out;
    }
}

