<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppointmentBlackout;
use App\Models\AppointmentSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class SchedulingController extends Controller
{
    private array $services = [
        'boiler_service' => 'Boiler Service',
        'boiler_repair' => 'Boiler Repair',
        'power_flush' => 'Power Flush',
        'new_boiler_quote' => 'New Boiler Quote',
    ];

    public function index()
    {
        $settings = AppointmentSetting::all()->keyBy('service_key');

        $defaults = config('appointment');
        $rules = $defaults['rules'];

        $prepared = [];
        foreach ($this->services as $key => $label) {
            $row = $settings[$key] ?? null;
            $rule = $rules[$key] ?? ['max_per_day' => 5, 'gap_minutes' => 0];

            $prepared[] = [
                'service_key' => $key,
                'service_label' => $label,
                'slot_minutes' => $row?->slot_minutes ?? $defaults['slot_minutes'],
                'start_hour' => $row?->start_hour ?? $defaults['start_hour'],
                'end_hour' => $row?->end_hour ?? $defaults['end_hour'],
                'max_per_day' => $row?->max_per_day ?? $rule['max_per_day'],
                'gap_minutes' => $row?->gap_minutes ?? $rule['gap_minutes'],
                'last_slot_time' => $row?->last_slot_time,
            ];
        }

        $blackouts = AppointmentBlackout::orderByDesc('starts_at')->limit(100)->get();

        return Inertia::render('Admin/Scheduling', [
            'settings' => $prepared,
            'blackouts' => $blackouts,
            'services' => $this->services,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $serviceKeys = array_keys($this->services);
        $defaults = config('appointment');
        $rules = $defaults['rules'];

        // Normalize optional fields so empty strings validate as null and trim seconds if provided
        $normalizedSettings = collect($request->input('settings', []))->map(function ($row) {
            if (array_key_exists('last_slot_time', $row) && $row['last_slot_time'] === '') {
                $row['last_slot_time'] = null;
            } elseif (array_key_exists('last_slot_time', $row) && $row['last_slot_time'] !== null) {
                $row['last_slot_time'] = substr($row['last_slot_time'], 0, 5);
            }
            return $row;
        })->all();

        $request->merge(['settings' => $normalizedSettings]);

        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.service_key' => ['required', Rule::in($serviceKeys)],
            'settings.*.slot_minutes' => 'nullable|integer|min:15|max:240',
            'settings.*.start_hour' => 'nullable|integer|min:0|max:23',
            'settings.*.end_hour' => 'nullable|integer|min:1|max:24',
            'settings.*.max_per_day' => 'nullable|integer|min:0|max:50',
            'settings.*.gap_minutes' => 'nullable|integer|min:0|max:480',
            'settings.*.last_slot_time' => ['nullable', 'regex:/^\d{2}:\d{2}$/'],
        ]);

        foreach ($data['settings'] as $row) {
            $rule = $rules[$row['service_key']] ?? ['max_per_day' => 5, 'gap_minutes' => 0];

            $slotMinutes = $row['slot_minutes'] ?? $defaults['slot_minutes'];
            $startHour   = $row['start_hour']   ?? $defaults['start_hour'];
            $endHour     = $row['end_hour']     ?? $defaults['end_hour'];
            $maxPerDay   = $row['max_per_day']  ?? $rule['max_per_day'];
            $gapMinutes  = $row['gap_minutes']  ?? $rule['gap_minutes'] ?? 0;

            AppointmentSetting::updateOrCreate(
                ['service_key' => $row['service_key']],
                [
                    'slot_minutes' => $slotMinutes,
                    'start_hour' => $startHour,
                    'end_hour' => $endHour,
                    'max_per_day' => $maxPerDay,
                    'gap_minutes' => $gapMinutes,
                    'last_slot_time' => $row['last_slot_time'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Scheduling settings updated.');
    }

    public function addBlackout(Request $request)
    {
        $serviceKeys = array_keys($this->services);

        $data = $request->validate([
            'service_key' => ['nullable', Rule::in($serviceKeys)],
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'reason' => 'nullable|string|max:255',
        ]);

        $startsAt = Carbon::parse($data['date'] . ' ' . ($data['start_time'] ?? '00:00:00'));
        $endsAt = Carbon::parse($data['date'] . ' ' . ($data['end_time'] ?? '23:59:59'));

        AppointmentBlackout::create([
            'service_key' => $data['service_key'] ?: null,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'reason' => $data['reason'] ?? null,
        ]);

        return back()->with('success', 'Blackout added.');
    }

    public function deleteBlackout(AppointmentBlackout $blackout)
    {
        $blackout->delete();
        return back()->with('success', 'Blackout removed.');
    }
}

