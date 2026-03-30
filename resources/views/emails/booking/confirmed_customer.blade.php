@php
  $c = $booking->customer;
  $a = $booking->appointment;
  $currency = $booking->currency ?: 'GBP';
  $paid = $booking->payment_status === 'paid';
  $paidAmount = number_format((float)$booking->total, 2);

  $startsAt = null;
  if ($a && ($a->getRawOriginal('starts_at') || $a->starts_at)) {
      $rawStartsAt = $a->getRawOriginal('starts_at') ?: $a->starts_at;
      $startsAt = \Carbon\Carbon::parse($rawStartsAt, 'UTC')->timezone(config('app.timezone'))->format('D, d M Y • h:i A');
  }
  $type = $a?->type ? str_replace('_',' ', $a->type) : 'Service';

  // Pull a compact “Booked for” summary from booking_details (optional)
  $bookedFor = $booking->details?->firstWhere('frontend_key','fault_type')?->answer_text
    ?? $booking->details?->firstWhere('frontend_key','boiler_type')?->answer_text
    ?? null;

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
{{-- Hero --}}
<div style="padding: 18px 18px 8px; text-align:center;">
  <div style="display:inline-block; width:52px; height:52px; border-radius:999px; background:#16a34a; line-height:52px; color:#fff; font-size:24px; font-weight:700;">✓</div>
  <div style="margin-top:10px; font-size:20px; font-weight:700; color:#0f172a;">
    Booking Confirmed
  </div>
  <div style="margin-top:4px; font-size:13px; color:#475569;">
    Reference <strong>#{{ $booking->id }}</strong>
  </div>
</div>

{{-- Summary card --}}
<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; color:#0f172a; font-weight:700;">Appointment</div>
  <div style="margin-top:8px; font-size:13px; color:#334155;">
    <div><strong>Service:</strong> {{ ucwords($type) }}</div>
    <div><strong>Booked for:</strong> {{ $startsAt ?: '—' }}</div>
    @if($bookedFor)
      <div><strong>Issue:</strong> {{ $bookedFor }}</div>
    @endif
  </div>
</div>

{{-- Installation Summary --}}
<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; color:#0f172a; font-weight:700;">Installation Summary</div>
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

{{-- Customer details --}}
<div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; color:#0f172a; font-weight:700;">Customer Details</div>
  <div style="margin-top:8px; font-size:13px; color:#334155;">
    <div><strong>Name:</strong> {{ $c?->full_name ?: '—' }}</div>
    <div><strong>Email:</strong> {{ $c?->email ?: '—' }}</div>
    <div><strong>Phone:</strong> {{ $c?->phone ?: '—' }}</div>
    <div><strong>Postcode:</strong> {{ $c?->postcode ?: '—' }}</div>
    <div><strong>Address:</strong> {{ $c?->address_full ?: '—' }}</div>
  </div>
</div>

{{-- Payment --}}
<div style="background:#0f172a; color:#ffffff; border-radius:16px; padding:16px; margin:12px 0;">
  <div style="font-size:14px; font-weight:700;">Payment</div>
  <div style="margin-top:8px; font-size:13px; opacity:.95;">
    <div><strong>Status:</strong> {{ strtoupper($booking->payment_status) }}</div>
    <div><strong>Paid Amount:</strong> {{ $currency }} {{ $paidAmount }}</div>
  </div>
</div>



{{-- CTA --}}
<x-mail::button :url="url('/')">
View Website
</x-mail::button>

<div style="font-size:12px; color:#64748b; margin-top:14px;">
  If you need to change your appointment, reply to this email or contact support.
</div>

Thanks,<br>
Amy<br>
Head of Planning
</x-mail::message>
