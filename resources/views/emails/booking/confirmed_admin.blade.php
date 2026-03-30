@php
  $c = $booking->customer;
  $a = $booking->appointment;
  $currency = $booking->currency ?: 'GBP';
  $paidAmount = number_format((float)$booking->total, 2);

  $startsAt = null;
  if ($a && ($a->getRawOriginal('starts_at') || $a->starts_at)) {
      $rawStartsAt = $a->getRawOriginal('starts_at') ?: $a->starts_at;
      $startsAt = \Carbon\Carbon::parse($rawStartsAt, 'UTC')->timezone(config('app.timezone'))->format('D, d M Y • h:i A');
  }
  $type = $a?->type ? str_replace('_',' ', $a->type) : 'Service';

  $tx = $booking->transactions?->sortByDesc('id')->first();

  $details = $booking->details?->keyBy('frontend_key') ?? collect();
  $getDetail = fn ($key) => $details->get($key)?->answer_text ?? null;
  $qaRows = ($booking->details ?? collect())
    ->filter(fn ($d) => !empty($d->question_snapshot) || !empty($d->frontend_key))
    ->values();

  $products = $booking->products ?? collect();
  $primaryProduct = $products->first();
  $addOns = $primaryProduct?->addOns ?? ($booking->productAddOns ?? collect());

  $boilerName = trim(($primaryProduct?->brand ?? '') . ' ' . ($primaryProduct?->model ?? ''));
  $boilerMeta = array_filter([
    $primaryProduct?->kw ? $primaryProduct->kw . 'kW' : null,
    $primaryProduct?->warranty_years ? $primaryProduct->warranty_years . '-year warranty' : null,
  ]);
  $boilerSummary = $boilerName ?: null;
  if ($boilerSummary && !empty($boilerMeta)) {
    $boilerSummary .= ' • ' . implode(' • ', $boilerMeta);
  } elseif (!$boilerSummary && !empty($boilerMeta)) {
    $boilerSummary = implode(' • ', $boilerMeta);
  }

  $trvAddon = $addOns?->first(function ($addon) {
    $label = strtolower((string) ($addon?->label ?? ''));
    return ($addon?->key === 'trv') || str_contains($label, 'trv');
  });

  $flueType = null;
  if ($addOns && $addOns->count()) {
    $derived = $addOns->firstWhere('derived', '!=', null)?->derived ?? null;
    if (is_array($derived)) {
      $flueType = $derived['flueType'] ?? $derived['flue_type'] ?? null;
    } elseif (is_string($derived)) {
      $flueType = $derived;
    }
  }

  if (!$flueType) {
    $flueWall = $getDetail('flue_wall');
    if ($flueWall) {
      $flueLower = strtolower($flueWall);
      $flueType = (str_starts_with($flueLower, 'no') || str_contains($flueLower, 'roof'))
        ? 'Vertical'
        : 'Horizontal';
    }
  }

  $relocation = $getDetail('boiler_move_location');
  $preferredLocation = $getDetail('preferred_location');
@endphp

<x-mail::message>
<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;padding:18px 16px;margin:10px 0 14px;color:#fff;">
  <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.8;">MD Gas Services · Admin notification</div>
  <div style="margin-top:6px;font-size:21px;font-weight:800;line-height:1.2;">New paid booking</div>
  <div style="margin-top:4px;font-size:13px;opacity:.9;">Reference #{{ $booking->id }} · {{ strtoupper($booking->payment_status) }} · {{ $currency }} {{ $paidAmount }}</div>
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:12px 0;">
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:#0f172a;">Appointment</td>
  </tr>
  <tr>
    <td style="padding:12px 16px;font-size:13px;color:#334155;line-height:1.55;">
      <div><strong>Service:</strong> {{ ucwords($type) }}</div>
      <div><strong>Booked for:</strong> {{ $startsAt ?: '—' }}</div>
      <div><strong>Status:</strong> {{ $a?->status ?: '—' }}</div>
    </td>
  </tr>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:12px 0;">
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:#0f172a;">Customer</td>
  </tr>
  <tr>
    <td style="padding:12px 16px;font-size:13px;color:#334155;line-height:1.55;">
      <div><strong>Name:</strong> {{ $c?->full_name ?: '—' }}</div>
      <div><strong>Email:</strong> {{ $c?->email ?: '—' }}</div>
      <div><strong>Phone:</strong> {{ $c?->phone ?: '—' }}</div>
      <div><strong>Postcode:</strong> {{ $c?->postcode ?: '—' }}</div>
      <div><strong>Address:</strong> {{ $c?->address_full ?: '—' }}</div>
    </td>
  </tr>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:12px 0;">
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:#0f172a;">Installation summary</td>
  </tr>
  <tr>
    <td style="padding:12px 16px;font-size:13px;color:#334155;line-height:1.55;">
      <div><strong>Boiler:</strong> {{ $boilerSummary ?: '—' }}</div>
      <div><strong>TRVs:</strong>
        @if($trvAddon)
          {{ $trvAddon->qty ? $trvAddon->qty . ' × ' : '' }}{{ $trvAddon->label ?: 'TRV supply & fit' }}
        @else
          No additional TRVs
        @endif
      </div>
      <div><strong>Flue type:</strong> {{ $flueType ? ucfirst($flueType) : '—' }}</div>
      <div><strong>Boiler relocation:</strong> {{ $relocation ?: '—' }}</div>
      @if(($relocation === 'Yes' || $relocation === 'yes') && $preferredLocation)
        <div><strong>Preferred location:</strong> {{ $preferredLocation }}</div>
      @endif

      @if($addOns && $addOns->count())
        <div style="margin-top:8px;font-weight:700;color:#0f172a;">Add-ons included</div>
        @foreach($addOns as $addOn)
          <div>• {{ $addOn->label ?: $addOn->key }}@if($addOn->qty) (x{{ $addOn->qty }})@endif</div>
        @endforeach
      @endif
    </td>
  </tr>
</table>

@if($qaRows->count())
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:12px 0;">
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:#0f172a;">Booking answers</td>
  </tr>
  @foreach($qaRows as $row)
  <tr>
    <td style="padding:10px 16px;border-bottom:1px solid #f8fafc;font-size:13px;color:#334155;line-height:1.5;">
      <div style="font-weight:700;color:#0f172a;">{{ $row->question_snapshot ?: $row->frontend_key }}</div>
      <div style="margin-top:2px;">
        {{ $row->answer_text ?? (is_array($row->answer_json) ? json_encode($row->answer_json) : ($row->answer_json ?: (is_array($row->media) ? json_encode($row->media) : ($row->media ?: '—')))) }}
      </div>
    </td>
  </tr>
  @endforeach
</table>
@endif

<div style="background:#0f172a;color:#fff;border-radius:14px;padding:14px 16px;margin:12px 0;">
  <div style="font-size:13px;font-weight:700;">Transaction</div>
  <div style="margin-top:6px;font-size:13px;opacity:.95;line-height:1.5;">
    <div><strong>Status:</strong> {{ $tx?->status ?: '—' }}</div>
    <div><strong>Session:</strong> {{ $tx?->provider_checkout_session_id ?: '—' }}</div>
    <div><strong>Intent:</strong> {{ $tx?->provider_payment_intent_id ?: '—' }}</div>
  </div>
</div>

<x-mail::button :url="url('/admin/order/management')">
Open Admin Orders
</x-mail::button>

</x-mail::message>
