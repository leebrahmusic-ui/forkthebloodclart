<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RadiatorPrice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RadiatorPriceController extends Controller
{
    public function index()
    {
        // Auto-populate defaults if table is empty so the admin UI never renders blank
        if (RadiatorPrice::count() === 0) {
            RadiatorPrice::insert($this->defaultRows());
        }

        return Inertia::render('Admin/RadiatorPrice', [
            'radiators' => RadiatorPrice::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        RadiatorPrice::findOrFail($id)->update([
            'price' => $validated['price'],
        ]);

        return back()->with('success', 'Radiator price updated successfully.');
    }

    protected function defaultRows(): array
    {
        return [
            ['label' => 'Up to 5 radiators', 'price' => 75],
            ['label' => '6-8 radiators', 'price' => 125],
            ['label' => '9-12 radiators', 'price' => 75],
            ['label' => '13-15 radiators', 'price' => 100],
            ['label' => '16-20 radiators', 'price' => 75],
            ['label' => '21+ radiators', 'price' => 125],
        ];
    }
}
