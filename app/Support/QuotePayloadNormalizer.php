<?php

namespace App\Support;

use Carbon\Carbon;

class QuotePayloadNormalizer
{
    public static function serviceKey(mixed $service): string
    {
        // Accept {key,value} or string
        if (is_array($service) && isset($service['key'])) return (string) $service['key'];
        return (string) $service;
    }

    public static function customer(array $form): array
    {
        // Your payload has customer_details + duplicate inside visit_time
        $c = $form['customer_details'] ?? [];
        $v = $form['visit_time'] ?? [];

        return [
            'full_name' => $c['full_name'] ?? $c['name'] ?? $v['full_name'] ?? $v['name'] ?? null,
            'email' => $c['email'] ?? $v['email'] ?? null,
            'phone' => $c['phone'] ?? $v['phone'] ?? null,
            'postcode' => $c['postcode'] ?? $v['postcode'] ?? null,
            'address_line1' => $c['address_line1'] ?? $c['address'] ?? $v['address_line1'] ?? $v['address'] ?? null,
            'address_line2' => $c['address_line2'] ?? $v['address_line2'] ?? null,
            'city' => $c['city'] ?? $v['city'] ?? null,
            'county' => $c['county'] ?? $v['county'] ?? null,
            'country' => $c['country'] ?? $v['country'] ?? 'United Kingdom',
            'address_full' => $c['address_full'] ?? $c['address'] ?? $v['address_full'] ?? $v['address'] ?? null,
        ];
    }

    public static function appointment(array $form): array
    {
        $dt = $form['visit_time']['datetime'] ?? null;

        $date = is_array($dt) ? ($dt['date'] ?? null) : null;
        $time = is_array($dt) ? ($dt['time'] ?? null) : null;

        return [
            'date' => $date,             // "2026-02-27"
            'time' => $time,             // "11:00 AM" or "11:00"
        ];
    }

    public static function product(array $form): array
    {
        $dt = $form['product'] ?? [];

        return $dt;
    }

    public static function addOns(array $form): array{
        $dt = $form['addOns'] ?? [];

        return $dt;
    }

    /**
     * Converts your nested select objects into key => value suitable for BookingCreate.
     * Example:
     *  fixed_price: {label:"Sensor", extraText:""} -> "Sensor"
     *  previous_work: {label:"Yes", extraText:"..."} -> "Yes" + sets previous_work_extraText
     */
    public static function answers(array $form): array
    {
        $out = [];

        foreach ($form as $key => $val) {
            if (in_array($key, ['customer_details', 'visit_time', 'product', 'addOns'], true)) continue;

            // dd($form['answers']);
            // upload/media fields can be array later
            if ($key === 'media') {
                $out[$key] = is_array($val) ? $val : [];
                continue;
            }

            // Text field: { value: "..." }
            if (is_array($val) && array_key_exists('value', $val)) {
                $out[$key] = $val['value'];
                continue;
            }

            // Select field: { label: "...", extraText: "..." }
            if (is_array($val) && array_key_exists('label', $val)) {
                $out[$key] = $val['label'];

                // if extraText is present, store conventional companion key
                if (!empty($val['extraText'])) {
                    $out[$key . '_extraText'] = $val['extraText'];
                }

                continue;
            }

            // Primitive fallback
            $out[$key] = $val;
        }

        return $out;
    }

    public static function parseStartsAt(string $date, string $time, string $tz): Carbon
    {
        $time = trim($time);

        // Normalize "15:00 PM" -> "15:00"
        if (preg_match('/^(1[3-9]|2[0-3]):\d{2}\s*(AM|PM)$/i', $time)) {
            $time = preg_replace('/\s*(AM|PM)$/i', '', $time);
        }

        // "HH:mm"
        if (preg_match('/^\d{2}:\d{2}$/', $time)) {
            return Carbon::createFromFormat('Y-m-d H:i', "{$date} {$time}", $tz);
        }

        // "h:mm AM/PM"
        if (preg_match('/^\d{1,2}:\d{2}\s*(AM|PM)$/i', $time)) {
            return Carbon::createFromFormat('Y-m-d g:i A', "{$date} {$time}", $tz);
        }

        // "h AM/PM"
        if (preg_match('/^\d{1,2}\s*(AM|PM)$/i', $time)) {
            return Carbon::createFromFormat('Y-m-d g A', "{$date} {$time}", $tz);
        }

        return Carbon::parse("{$date} {$time}", $tz);
    }

}
