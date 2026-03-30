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
<div style="padding: 12px 0;">
  <div style="font-size:18px; font-weight:800; color:#0f172a;">
    New Paid Booking — #{{ $booking->id }}
  </div>
  <div style="margin-top:4px; font-size:13px; color:#475569;">
    {{ strtoupper($booking->payment_status) }} • {{ $currency }} {{ $paidAmount }}
  </div>
</div>

<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; font-weight:700; color:#0f172a;">Installation Summary</div>
  <div style="margin-top:8px; font-size:13px; color:#334155;">
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
  </div>

@if($addOns && $addOns->count())
<div style="margin-top:10px; font-size:12px; font-weight:700; color:#0f172a;">Add-ons included</div>
<div style="margin-top:6px; font-size:13px; color:#334155;">
@foreach($addOns as $addOn)
  <div>• {{ $addOn->label ?: $addOn->key }}@if($addOn->qty) (x{{ $addOn->qty }})@endif</div>
@endforeach
</div>
@endif
</div>

<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; font-weight:700; color:#0f172a;">Appointment</div>
  <div style="margin-top:8px; font-size:13px; color:#334155;">
    <div><strong>Service:</strong> {{ ucwords($type) }}</div>
    <div><strong>Booked for:</strong> {{ $startsAt ?: '—' }}</div>
    <div><strong>Appointment Status:</strong> {{ $a?->status ?: '—' }}</div>
  </div>
</div>

<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; font-weight:700; color:#0f172a;">Customer</div>
  <div style="margin-top:8px; font-size:13px; color:#334155;">
    <div><strong>Name:</strong> {{ $c?->full_name ?: '—' }}</div>
    <div><strong>Email:</strong> {{ $c?->email ?: '—' }}</div>
    <div><strong>Phone:</strong> {{ $c?->phone ?: '—' }}</div>
    <div><strong>Postcode:</strong> {{ $c?->postcode ?: '—' }}</div>
    <div><strong>Address:</strong> {{ $c?->address_full ?: '—' }}</div>
  </div>
</div>

<div style="background:#0f172a; color:#ffffff; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; font-weight:700;">Transaction</div>
  <div style="margin-top:8px; font-size:13px; opacity:.95;">
    <div><strong>Status:</strong> {{ $tx?->status ?: '—' }}</div>
    <div><strong>Session:</strong> {{ $tx?->provider_checkout_session_id ?: '—' }}</div>
    <div><strong>Intent:</strong> {{ $tx?->provider_payment_intent_id ?: '—' }}</div>
  </div>
</div>

<x-mail::button :url="url('/admin/order/management')">
Open Admin Orders
</x-mail::button>

</x-mail::message>
