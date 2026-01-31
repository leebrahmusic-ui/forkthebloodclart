<?php

namespace App\Services;

use Carbon\Carbon;

class AppointmentAvailabilityService
{
    public function __construct(private AppointmentBlockService $blocker) {}

    public function month(string $type, string $month, ?string $timezone = null): array
    {
        $tz = $timezone ?: config('app.timezone');

        $slotMinutes = (int) config('appointment.slot_minutes', 60);
        $startHour   = (int) config('appointment.start_hour', 8);
        $endHour     = (int) config('appointment.end_hour', 18);

        if (in_array($type, ['power_flush', 'new_boiler_quote'], true)) {
            $startHour = 9;
            $endHour   = 10;
        }

        $start = Carbon::createFromFormat('Y-m-d', $month . '-01', $tz)->startOfMonth()->startOfDay();
        $end   = $start->copy()->endOfMonth()->startOfDay();

        $out = [];

        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $date = $d->toDateString();

            $blockedInfo = $this->blocker->blockedForDay($date, $type, $tz);
            $blocked = $blockedInfo['blocked'] ?? [];

            $workStart = $d->copy()->setTime($startHour, 0);
            $workEnd   = $d->copy()->setTime($endHour, 0);

            $times = [];

            for ($t = $workStart->copy(); $t->lt($workEnd); $t->addMinutes($slotMinutes)) {
                // no past time
                if ($t->lt(Carbon::now($tz))) continue;

                if ($this->isBlocked($t, $blocked, $tz)) continue;

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
}
