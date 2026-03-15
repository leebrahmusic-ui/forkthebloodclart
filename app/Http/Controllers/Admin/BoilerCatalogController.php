<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PricingOverrideService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class BoilerCatalogController extends Controller
{
    public function index()
    {
        $overrides = PricingOverrideService::groupedActive();

        return Inertia::render('Admin/BoilerCatalog', [
            'catalogOverride' => data_get($overrides, 'catalog.products'),
        ]);
    }

    public function save(Request $request)
    {
        $data = $request->validate([
            'products' => ['required', 'array', 'min:1'],
            'products.*.id' => ['required', 'string', 'max:120'],
            'products.*.type' => ['required', Rule::in(['combi', 'system', 'heat_only'])],
            'products.*.brand' => ['required', 'string', 'max:120'],
            'products.*.model' => ['required', 'string', 'max:160'],
            'products.*.warrantyYears' => ['required', 'integer', 'min:0', 'max:25'],
            'products.*.kw' => ['required', 'numeric', 'min:1', 'max:100'],
            'products.*.priceType' => ['required', Rule::in(['fixed', 'variable', 'cost_plus'])],
            'products.*.basePrice' => ['nullable', 'numeric', 'min:0'],
            'products.*.boilerCost' => ['nullable', 'numeric', 'min:0'],
            'products.*.minMargin' => ['nullable', 'numeric', 'min:0'],
            'products.*.images' => ['nullable', 'array'],
            'products.*.images.*' => ['string', 'max:500'],
            'products.*.includes' => ['nullable', 'array'],
            'products.*.includes.*' => ['string', 'max:300'],
            'products.*.notes' => ['nullable', 'array'],
            'products.*.notes.*' => ['string', 'max:300'],
        ]);

        $normalized = collect($data['products'])
            ->map(function (array $p) {
                $p['id'] = trim((string) $p['id']);
                $p['brand'] = trim((string) $p['brand']);
                $p['model'] = trim((string) $p['model']);
                $p['warrantyYears'] = (int) $p['warrantyYears'];
                $p['kw'] = (float) $p['kw'];

                $p['basePrice'] = $p['basePrice'] === null ? null : (float) $p['basePrice'];
                $p['boilerCost'] = $p['boilerCost'] === null ? null : (float) $p['boilerCost'];
                $p['minMargin'] = $p['minMargin'] === null ? null : (float) $p['minMargin'];

                $p['images'] = array_values(array_filter($p['images'] ?? [], fn ($v) => trim((string) $v) !== ''));
                $p['includes'] = array_values(array_filter($p['includes'] ?? [], fn ($v) => trim((string) $v) !== ''));
                $p['notes'] = array_values(array_filter($p['notes'] ?? [], fn ($v) => trim((string) $v) !== ''));

                return $p;
            })
            ->values()
            ->all();

        $ids = collect($normalized)->pluck('id')->map(fn ($v) => strtolower((string) $v));
        abort_if($ids->count() !== $ids->unique()->count(), 422, 'Each boiler id must be unique.');

        PricingOverrideService::upsert('catalog', 'products', $normalized, true);

        return back()->with('success', 'Boiler catalogue saved.');
    }

    public function reset()
    {
        PricingOverrideService::resetToDefault('catalog', 'products');

        return back()->with('success', 'Boiler catalogue reset to defaults.');
    }

    public function uploadImage(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:5120'],
        ]);

        $file = $data['image'];

        $dir = public_path('uploads/boilers');
        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        $name = now()->format('YmdHis') . '-' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $name);

        return response()->json([
            'data' => [
                'url' => '/uploads/boilers/' . $name,
            ],
        ]);
    }
}
