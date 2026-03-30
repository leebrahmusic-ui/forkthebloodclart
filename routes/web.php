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
use Illuminate\Support\Str;


$xmlEscape = static fn (string $value): string => htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');

$absoluteUrl = static function (string $path): string {
    $base = rtrim(config('app.url') ?: url('/'), '/');
    $normalizedPath = '/' . ltrim($path, '/');
    return $base . $normalizedPath;
};

$sitemapResponse = static function (string $xml) {
    return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
};

$readAdviceSlugs = static function (): array {
    $file = resource_path('data/advice-slugs.json');
    if (!is_file($file)) {
        return [];
    }

    $decoded = json_decode(file_get_contents($file), true);
    if (!is_array($decoded) || !isset($decoded['slugs']) || !is_array($decoded['slugs'])) {
        return [];
    }

    return array_values(array_filter($decoded['slugs'], static fn ($slug) => is_string($slug) && $slug !== ''));
};

Route::get('/sitemap.xml', function () use ($xmlEscape, $absoluteUrl, $sitemapResponse) {
    $items = [
        $absoluteUrl('/sitemap-pages.xml'),
        $absoluteUrl('/sitemap-advice.xml'),
    ];

    $lastmod = now()->toAtomString();
    $body = collect($items)
        ->map(static fn ($loc) => "  <sitemap>\n    <loc>{$xmlEscape($loc)}</loc>\n    <lastmod>{$lastmod}</lastmod>\n  </sitemap>")
        ->implode("\n");

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n"
        . $body
        . "\n</sitemapindex>\n";

    return $sitemapResponse($xml);
})->name('sitemap.index');

Route::get('/sitemap-pages.xml', function () use ($xmlEscape, $absoluteUrl, $sitemapResponse) {
    $paths = [
        '/',
        '/advice',
        '/about',
        '/privacy-policy',
        '/terms-conditions',
        '/book/quote/new',
        '/book/quote/repair',
        '/book/quote/service',
        '/book/quote/powerflush',
        '/advice/boiler-problems',
        '/advice/ideal-boiler-making-a-noise',
        '/advice/boiler-pressure-keeps-increasing',
        '/advice/boiler-pressure-keeps-dropping',
        '/advice/ideal-boiler-help',
        '/advice/ideal-boiler-fault-codes',
        '/advice/vaillant-boiler-help',
        '/advice/vaillant-boiler-fault-codes',
        '/advice/worcester-boiler-help',
        '/advice/worcester-boiler-fault-codes',
    ];

    $lastmod = now()->toAtomString();
    $body = collect($paths)
        ->unique()
        ->values()
        ->map(static fn ($path) => "  <url>\n    <loc>{$xmlEscape($absoluteUrl($path))}</loc>\n    <lastmod>{$lastmod}</lastmod>\n  </url>")
        ->implode("\n");

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n"
        . $body
        . "\n</urlset>\n";

    return $sitemapResponse($xml);
})->name('sitemap.pages');

Route::get('/sitemap-advice.xml', function () use ($xmlEscape, $absoluteUrl, $sitemapResponse, $readAdviceSlugs) {
    $slugs = collect($readAdviceSlugs())
        ->map(static fn ($slug) => trim($slug))
        ->filter(static fn ($slug) => $slug !== '')
        ->unique()
        ->values();

    $lastmod = now()->toAtomString();
    $body = $slugs
        ->map(static fn ($slug) => "  <url>\n    <loc>{$xmlEscape($absoluteUrl('/advice/' . $slug))}</loc>\n    <lastmod>{$lastmod}</lastmod>\n  </url>")
        ->implode("\n");

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n"
        . $body
        . "\n</urlset>\n";

    return $sitemapResponse($xml);
})->name('sitemap.advice');


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
        Route::get('/', [BookController::class, 'index'])->name('quote.index');
        //Route::get('/new-boiler', [BookController::class, 'index'])->name('quote.new');
    }
    else{
        Route::get('/', [BookController::class, 'index'])->name('quote.index');
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

Route::get('/advice', function () use ($readAdviceSlugs) {
    $slugs = collect($readAdviceSlugs())
        ->map(static fn ($slug) => trim((string) $slug))
        ->filter(static fn ($slug) => $slug !== '')
        ->unique()
        ->values();

    return Inertia::render('Seo/AdviceIndexPage', [
        'adviceSlugs' => $slugs,
        'adviceCount' => $slugs->count(),
    ]);
})->name('seo.advice.index');

Route::inertia('/advice/boiler-problems', 'Seo/BoilerProblemsHubPage', [
    'pageTitle' => 'Boiler Problems Advice Leeds',
])->name('seo.boiler.problems');

Route::inertia('/advice/ideal-boiler-making-a-noise', 'Seo/IdealBoilerNoisePage', [
    'pageTitle' => 'Ideal Boiler Making a Noise',
])->name('seo.ideal.boiler.noise');

Route::inertia('/advice/boiler-pressure-keeps-increasing', 'Seo/BoilerPressureIncreasingPage', [
    'pageTitle' => 'Boiler Pressure Keeps Increasing',
])->name('seo.boiler.pressure.increasing');

Route::inertia('/advice/boiler-pressure-keeps-dropping', 'Seo/BoilerPressureDroppingPage', [
    'pageTitle' => 'Boiler Pressure Keeps Dropping',
])->name('seo.boiler.pressure.dropping');


$seoAdviceArticles = [
    'boiler-losing-pressure' => 'Boiler Losing Pressure: Causes and Next Steps',
    'boiler-pressure-too-high' => 'Boiler Pressure Too High: Why It Happens',
    'vaillant-f75-error-code' => 'Vaillant F75 Error Code: Common Causes',
    'vaillant-f72-error-code' => 'Vaillant F72 Error Code: Sensor Mismatch Guide',
    'ideal-f2-error-code' => 'Ideal F2 Error Code: Flame Loss Explained',
    'worcester-ea-fault-code' => 'Worcester EA Fault Code: What It Usually Means',
    'boiler-ticking-noise' => 'Boiler Ticking Noise: Normal or Fault?',
    'boiler-kettling-noise' => 'Boiler Kettling Noise: Why It Happens',
    'boiler-fan-not-working' => 'Boiler Fan Not Working: Signs and Action',
    'boiler-no-hot-water' => 'Boiler Working But No Hot Water',
    'radiators-not-heating-up' => 'Radiators Not Heating Up Properly',
    'boiler-overflow-pipe-leaking' => 'Boiler Overflow / Discharge Pipe Leaking',
    'expansion-vessel-fault' => 'Expansion Vessel Fault Symptoms',
    'filling-loop-left-open' => 'Filling Loop Left Open: Pressure Problems',
    'frozen-condensate-pipe' => 'Frozen Condensate Pipe: Boiler Not Firing',
    'boiler-ignition-lockout' => 'Boiler Ignition Lockout: What to Do',
    'boiler-keeps-needing-reset' => 'Boiler Keeps Needing Reset',
    'boiler-short-cycling' => 'Boiler Short Cycling: Causes and Fixes',
    'air-in-heating-system' => 'Air in Heating System: Symptoms and Action',
    'boiler-service-vs-repair' => 'Boiler Service vs Boiler Repair: Which One to Book?',
    'how-often-service-boiler' => 'How Often Should You Service a Boiler?',
    'leeds-boiler-service-guide' => 'Boiler Service in Leeds: What to Expect',
    'leeds-boiler-repair-guide' => 'Boiler Repair in Leeds: Fault-First Booking Guide',
    'vaillant-fan-fault' => 'Vaillant Fan Fault Symptoms',
    'ideal-low-water-pressure' => 'Ideal Low Water Pressure Faults',
    'worcester-c6-c7-faults' => 'Worcester C6 / C7 Faults Explained',
    'boiler-pressure-guide-1-to-1-5-bar' => 'Boiler Pressure Guide: Why 1 to 1.5 Bar Matters',
];

foreach ($seoAdviceArticles as $slug => $title) {
    Route::inertia("/advice/{$slug}", 'Seo/AdviceArticlePage', [
        'pageTitle' => $title,
        'articleSlug' => $slug,
    ]);
}


Route::inertia('/advice/ideal-boiler-help', 'Seo/IdealBoilerHelpPage', [
    'pageTitle' => 'Ideal Boiler Problems & Fault Codes',
])->name('seo.ideal.help');

Route::inertia('/advice/ideal-boiler-fault-codes', 'Seo/IdealFaultCodesPage', [
    'pageTitle' => 'Ideal Boiler Fault Codes',
])->name('seo.ideal.codes');

Route::inertia('/advice/vaillant-boiler-help', 'Seo/VaillantBoilerHelpPage', [
    'pageTitle' => 'Vaillant Boiler Problems & Fault Codes',
])->name('seo.vaillant.help');

Route::inertia('/advice/vaillant-boiler-fault-codes', 'Seo/VaillantFaultCodesPage', [
    'pageTitle' => 'Vaillant Boiler Fault Codes',
])->name('seo.vaillant.codes');

Route::inertia('/advice/worcester-boiler-help', 'Seo/WorcesterBoilerHelpPage', [
    'pageTitle' => 'Worcester Boiler Problems & Fault Codes',
])->name('seo.worcester.help');

Route::inertia('/advice/worcester-boiler-fault-codes', 'Seo/WorcesterFaultCodesPage', [
    'pageTitle' => 'Worcester Boiler Fault Codes',
])->name('seo.worcester.codes');


Route::get('/advice/{slug}', function (string $slug) {
    return Inertia::render('Seo/AdviceArticlePage', [
        'pageTitle' => Str::of($slug)->replace('-', ' ')->title()->toString(),
        'articleSlug' => $slug,
    ]);
})->where('slug', '[a-z0-9-]+')->name('seo.advice.article.dynamic');


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

        Route::delete('/order/management/{booking}', [OrderManagementController::class, 'destroy'])
            ->name('orders.management.destroy');

        Route::get('/pricing', [PricingOverridesController::class, 'index'])->name('pricing.index');
        Route::post('/pricing/save', [PricingOverridesController::class, 'save'])->name('pricing.save');
        Route::post('/pricing/reset', [PricingOverridesController::class, 'reset'])->name('pricing.reset');

        Route::get('/boilers', [BoilerCatalogController::class, 'index'])->name('boilers.index');
        Route::post('/boilers/save', [BoilerCatalogController::class, 'save'])->name('boilers.save');
        Route::post('/boilers/reset', [BoilerCatalogController::class, 'reset'])->name('boilers.reset');
        Route::post('/boilers/upload-image', [BoilerCatalogController::class, 'uploadImage'])->name('boilers.uploadImage');

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
