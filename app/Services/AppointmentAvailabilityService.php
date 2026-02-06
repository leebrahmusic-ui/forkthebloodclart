<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\AppointmentSetting;
use App\Models\AppointmentBlackout;

class AppointmentAvailabilityService
{
    public function __construct(private AppointmentBlockService $blocker) {}

    public function month(string $type, string $month, ?string $timezone = null): array
    {
        $tz = $timezone ?: config('app.timezone');

        $settings = $this->settingsFor($type);

        $slotMinutes = (int) ($settings['slot_minutes'] ?? config('appointment.slot_minutes', 60));
        $startHour   = (int) ($settings['start_hour'] ?? config('appointment.start_hour', 8));
        $endHour     = (int) ($settings['end_hour'] ?? config('appointment.end_hour', 18));
        $lastSlot    = $settings['last_slot_time'] ?? null;

        $start = Carbon::createFromFormat('Y-m-d', $month . '-01', $tz)->startOfMonth()->startOfDay();
        $end   = $start->copy()->endOfMonth()->startOfDay();

        $out = [];

        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $date = $d->toDateString();

            $blockedInfo = $this->blocker->blockedForDay($date, $type, $tz);
            $blocked = $blockedInfo['blocked'] ?? [];

            $workStart = $d->copy()->setTime($startHour, 0);
            $workEnd   = $d->copy()->setTime($endHour, 0);

            // Apply last-slot cutoff if provided
            if ($lastSlot) {
                [$h, $m] = explode(':', $lastSlot);
                $cutoff = $d->copy()->setTime((int) $h, (int) $m);
                if ($cutoff->lt($workEnd)) {
                    $workEnd = $cutoff;
                }
            }

            $times = [];

            $blackouts = $this->blackoutsForDay($date, $type, $tz);

            for ($t = $workStart->copy(); $t->lt($workEnd); $t->addMinutes($slotMinutes)) {
                // no past time
                if ($t->lt(Carbon::now($tz))) continue;

                if ($this->isBlocked($t, $blocked, $tz)) continue;

                if ($this->isBlocked($t, $blackouts, $tz)) continue;

                $times[] = $t->format('H:i A');
            }

            if (!empty($times)) {
                $out[$date] = $times;
            }
        }

        return $out;
    }

    private function isBlocked(Carbon $slotStart, array $blockedRanges, string $tz): bool
    {
        foreach ($blockedRanges as $r) {
            $from = Carbon::parse($r['from'], $tz);
            $to   = Carbon::parse($r['to'], $tz);

            if ($slotStart->gte($from) && $slotStart->lt($to)) {
                return true;
            }
        }
        return false;
    }

    private function settingsFor(string $type): array
    {
        $row = AppointmentSetting::where('service_key', $type)->first();
        if (!$row) return [];

        return [
            'slot_minutes'   => $row->slot_minutes,
            'start_hour'     => $row->start_hour,
            'end_hour'       => $row->end_hour,
            'max_per_day'    => $row->max_per_day,
            'gap_minutes'    => $row->gap_minutes,
            'last_slot_time' => $row->last_slot_time,
        ];
    }

    private function blackoutsForDay(string $date, string $type, string $tz): array
    {
        return AppointmentBlackout::query()
            ->whereDate('starts_at', '<=', $date)
            ->whereDate('ends_at', '>=', $date)
            ->where(function ($q) use ($type) {
                $q->whereNull('service_key')->orWhere('service_key', $type);
            })
            ->get()
            ->map(function ($b) use ($tz) {
                return [
                    'from' => $b->starts_at->timezone($tz)->toDateTimeString(),
                    'to'   => $b->ends_at->timezone($tz)->toDateTimeString(),
                    'reason' => $b->reason ?? 'Blackout',
                ];
            })
            ->all();
    }
}
