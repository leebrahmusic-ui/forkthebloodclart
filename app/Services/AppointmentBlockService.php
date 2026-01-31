<?php

namespace App\Services;

use App\Models\Appointment;
use Carbon\Carbon;

class AppointmentBlockService
{
    public function blockedForDay(string $date, string $type, ?string $timezone = null): array
    {
        $tz = $timezone ?: config('app.timezone');

        $rules = config('appointment.rules');
        if (!isset($rules[$type])) {
            return ['date' => $date, 'type' => $type, 'blocked' => []];
        }

        $gap = (int) $rules[$type]['gap_minutes'];
        $max = (int) $rules[$type]['max_per_day'];

        $day = Carbon::parse($date, $tz)->startOfDay();
        $workStart = $day->copy()->setTime(config('appointment.start_hour'), 0);
        $workEnd   = $day->copy()->setTime(config('appointment.end_hour'), 0);

        $appointments = Appointment::query()
            ->whereDate('appointment_date', $day->toDateString())
            ->whereIn('status', ['pending','confirmed'])
            ->get(['type','starts_at']);
        // dd($date);

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

        // No gap → still block exact appointment start times (any type)
        if ($gap <= 0) {
            if ($appointments->isEmpty()) {
                return ['date' => $day->toDateString(), 'type' => $type, 'blocked' => []];
            }

            $blocked = [];
            foreach ($appointments as $a) {
                $start = Carbon::parse($a->starts_at)->timezone($tz);
                if ($start->toDateString() !== $day->toDateString()) continue;

                $blocked[] = [
                    'from' => $start->toDateTimeString(),
                    'to' => $start->copy()->addMinute()->toDateTimeString(),
                    'reason' => 'Slot already booked',
                ];
            }

            return [
                'date' => $day->toDateString(),
                'type' => $type,
                'blocked' => $this->mergeRanges($blocked),
            ];
        }

        // Gap applies against ALL appointments (operationally safest)
        $blocked = [];

        foreach ($appointments as $a) {
            $start = Carbon::parse($a->starts_at)->timezone($tz);

            if ($start->toDateString() !== $day->toDateString()) continue;

            $from = $start->copy()->subMinutes($gap);
            $to   = $start->copy()->addMinutes($gap);

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
