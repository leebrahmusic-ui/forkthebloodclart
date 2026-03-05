<?php

use App\Http\Controllers\Admin\BasePriceController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Services\AppointmentAvailabilityService;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Http\Controllers\QuoteCheckoutController;
use App\Http\Controllers\Admin\OrderManagementController;
use App\Http\Controllers\Admin\BoilerCatalogController;
use App\Http\Controllers\Admin\CheckoutCouponController;
use App\Http\Controllers\Admin\RadiatorPriceController;
use App\Http\Controllers\Admin\PricingOverridesController;
use App\Http\Controllers\Admin\SchedulingController;
use App\Http\Controllers\GoogleReviewController;


Route::get('/health', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/google-reviews', [GoogleReviewController::class, 'index'])->name('google.reviews');


//Extra Routes

Route::get('/appointments/availability', function (Request $request, AppointmentAvailabilityService $svc) {
    $data = $request->validate([
        'type'  => ['required', Rule::in(['boiler_repair','boiler_service','power_flush','new_boiler_quote'])],
        'month' => ['required', 'date_format:Y-m'],
    ]);

    return response()->json([
        'data' => [
            'month' => $data['month'],
            'days'  => $svc->month($data['type'], $data['month']),
        ],
    ]);
});

Route::post('/quote/checkout', [QuoteCheckoutController::class, 'store']);
Route::post('/quote/checkout/coupon-preview', [QuoteCheckoutController::class, 'couponPreview']);
Route::post('/quote/checkout/coupon-update', [QuoteCheckoutController::class, 'couponUpdate']);
Route::post('/quote/checkout/confirm-intent', [QuoteCheckoutController::class, 'confirmIntent']);
Route::get('/checkout/success', [QuoteCheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/success-intent', [QuoteCheckoutController::class, 'successIntent'])->name('checkout.success.intent');
Route::get('/checkout/cancel', [QuoteCheckoutController::class, 'cancel'])->name('checkout.cancel');
Route::get('/booking/{booking}/confirmed', [QuoteCheckoutController::class, 'confirmed'])
    ->name('booking.confirmed');

Route::get('/booking/{booking}/failed', [QuoteCheckoutController::class, 'failed'])
    ->name('booking.failed');

Route::get('/booking/{booking}/cancelled', [QuoteCheckoutController::class, 'cancelled'])
    ->name('booking.cancelled');







//Guest Routes

Route::get('/', function () {
    return Inertia::render('Home');
})->name('landing');

Route::prefix('book')->name('book.')->group(function () {

    if(config('app.env') === 'production'){
        //ComingSoon/ComingSoon
        // Route::inertia('/', 'ComingSoon/ComingSoon', [
        //     'pageTitle' => 'Coming Soon',
        // ])->name('quote.new');
        Route::get('/', [BookController::class, 'index'])->name('quote.new');
        //Route::get('/new-boiler', [BookController::class, 'index'])->name('quote.new');
    }
    else{
        Route::get('/', [BookController::class, 'index'])->name('quote.new');
    }

    Route::get('/quote', [BookController::class, 'quote'])->name('quote');
    Route::get('/quote/repair', [BookController::class, 'repairStepper'])->name('quote.repair');
    Route::match(['get', 'post'], '/quote/repair/checkout', [BookController::class, 'repairCheckout'])
        ->name('quote.repair.checkout');



    Route::get('/quote/new', [BookController::class, 'newStepper'])->name('quote.new');
    Route::get('/quote/powerflush', [BookController::class, 'powerflushStepper'])->name('quote.powerflush');
    Route::get('/quote/service', [BookController::class, 'serviceStepper'])->name('quote.service');
    Route::match(['get', 'post'], '/quote/service/checkout', [BookController::class, 'serviceCheckout'])
        ->name('quote.service.checkout');


    Route::match(['get', 'post'],'/quote/new/results', [BookController::class, 'serviceResults'])
    ->name('quote.new.results');



    Route::match(['get', 'post'],'/quote/new/install', [BookController::class, 'install'])
        ->name('quote.install');
});


Route::get('/about', function () {
    return Inertia::render('About/AboutPage', [
        'pageTitle' => 'About Us',
    ]);
})->name('about');

Route::inertia('/privacy-policy', 'PrivacyPolicyPage', [
    'pageTitle' => 'Privacy Policy',
])->name('privacy.policy');

Route::inertia('/terms-conditions', 'TermsConditionsPage', [
    'pageTitle' => 'Terms & Conditions',
])->name('terms.conditions');


// Route::inertia('/order-success', 'OrderSuccess/OrderSuccess', [
//     'pageTitle' => 'Order Success',
// ])->name('order.success');

// Route::inertia('/order-failed', 'OrderFailed/OrderFailed', [
//     'pageTitle' => 'Order Failed',
// ])->name('order.failed');
Route::inertia('/order-summary', 'OrderSummary/OrderSummary', [
    'pageTitle' => 'Order Summary',
])->name('order.summary');
Route::inertia('/coming-soon', 'ComingSoon/ComingSoon', [
    'pageTitle' => 'Coming Soon',
])->name('coming.soon');


// Route::post('/repair/submit', [RepairController::class, 'store']);



//Authenticated Routes

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')
    ->prefix('pricing')
    ->name('pricing.')
    ->group(function () {
        Route::get('/base-price', [BasePriceController::class, 'index'])
            ->name('base');
            Route::post('/base-price/{id}/update', [BasePriceController::class, 'update'])
            ->name('update');

            Route::get('/quotation', [BasePriceController::class, 'quotation'])
            ->name('quotation');

             // Radiator Prices
        Route::get('/radiators', [RadiatorPriceController::class, 'index'])
            ->name('radiators');

        Route::post('/radiators/{id}/update', [RadiatorPriceController::class, 'update'])
            ->name('radiators.update');
    });

Route::middleware(['auth']) // add your admin middleware if you have one
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/order/management', [OrderManagementController::class, 'index'])
            ->name('orders.management');

        // Route::get('/order/management', [OrderManagementController::class, 'index'])
        //     ->name('orders.management.index');

        Route::put('/order/management/{booking}/status', [OrderManagementController::class, 'updateStatus'])
            ->name('orders.management.status');

        Route::get('/pricing', [PricingOverridesController::class, 'index'])->name('pricing.index');
        Route::post('/pricing/save', [PricingOverridesController::class, 'save'])->name('pricing.save');
        Route::post('/pricing/reset', [PricingOverridesController::class, 'reset'])->name('pricing.reset');

        Route::get('/boilers', [BoilerCatalogController::class, 'index'])->name('boilers.index');
        Route::post('/boilers/save', [BoilerCatalogController::class, 'save'])->name('boilers.save');
        Route::post('/boilers/reset', [BoilerCatalogController::class, 'reset'])->name('boilers.reset');

        Route::get('/coupons', [CheckoutCouponController::class, 'index'])->name('coupons.index');
        Route::post('/coupons', [CheckoutCouponController::class, 'store'])->name('coupons.store');
        Route::put('/coupons/{coupon}', [CheckoutCouponController::class, 'update'])->name('coupons.update');
        Route::delete('/coupons/{coupon}', [CheckoutCouponController::class, 'destroy'])->name('coupons.destroy');

        // Scheduling controls
        Route::get('/scheduling', [SchedulingController::class, 'index'])->name('scheduling.index');
        Route::post('/scheduling/settings', [SchedulingController::class, 'saveSettings'])->name('scheduling.settings');
        Route::post('/scheduling/blackouts', [SchedulingController::class, 'addBlackout'])->name('scheduling.blackouts.add');
        Route::delete('/scheduling/blackouts/{blackout}', [SchedulingController::class, 'deleteBlackout'])->name('scheduling.blackouts.delete');
});




Route::middleware('auth')->group(function () {
    Route::get('/admin', fn () => redirect('/dashboard'));
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
