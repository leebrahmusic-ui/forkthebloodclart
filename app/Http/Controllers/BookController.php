<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BasePrice;
use App\Models\RadiatorPrice;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class BookController extends Controller
{
    //


    //For storing new quote key
    private function quoteCacheKey(Request $request): string
    {
        $qid = $request->query('qid') ?? $request->input('qid');

        if ($qid) {
            $request->session()->put('quote_session_id', $qid);
            return 'quote:new:results:' . $qid;
        }

        if (!$request->session()->has('quote_session_id')) {
            $request->session()->put('quote_session_id', (string) Str::uuid());
        }

        return 'quote:new:results:' . $request->session()->get('quote_session_id');
    }


    public function index(){
        return Inertia::render('Book/Home', [
            'title' => 'Book a Service',
        ]);
    }

    public function quote(){
        $basePrices = BasePrice::all()
            ->mapWithKeys(fn ($p) => [$p->service_key => $p->price]);

        return Inertia::render('Book/QuotePage', [
            'title' => 'Get a Quote',
            'basePrices' => $basePrices,
            'symbol' => config('services.currency.symbol'),
        ]);
    }

 // GET /book/quote/repair
    public function repairStepper()
    {
        // renders resources/js/Pages/Book/RepairPage.jsx
        $basePrice = BasePrice::boilerRepair()->value('price');
        $symbol = config('services.currency.symbol');
        return Inertia::render('Book/RepairPage', [
            'basePrice' => $basePrice,
            'symbol' => $symbol,
            'title' => 'Boiler Repair Quote',
        ]);
    }

    // GET /book/quote/new
    public function newStepper(Request $request)
    {
        // renders resources/js/Pages/Book/NewBoilerPage.jsx
        $this->reset($request);
        return Inertia::render('Book/NewBoilerPage', [
            'title' => 'New Boiler Installation Quote',
        ]);
    }

    // GET /book/quote/powerflush

    public function powerflushStepper()
    {
        $basePrice = BasePrice::powerFlush()->value('price');
        $symbol = config('services.currency.symbol');

        $radiatorPrices = RadiatorPrice::orderBy('id')->get();

        return Inertia::render('Book/PowerFlushPage', [
            'basePrice' => $basePrice,
            'symbol' => $symbol,
            'radiatorPrices' => $radiatorPrices,
            'title' => 'Power Flush Quote',
        ]);
    }


    // GET /book/quote/service
    public function serviceStepper()
    {
        // renders resources/js/Pages/Book/ServicePage.jsx
        $basePrice = BasePrice::boilerService()->value('price');
        $symbol = config('services.currency.symbol');
        return Inertia::render('Book/ServicePage', [
            'basePrice' => $basePrice,
            'symbol' => $symbol,
            'title' => 'Boiler Service Quote',
        ]);
    }

    public function serviceResults(Request $request)
    {
        $key = $this->quoteCacheKey($request);

        if ($request->isMethod('post')) {
            $quote = $request->all();

            if (empty($quote)) {
                return back()->withErrors(['quote' => 'Quote payload missing.']);
            }

            Cache::put($key, $quote, now()->addMinutes(60));

            // Option A (recommended with Inertia): force a GET visit (best refresh behavior)
            return Inertia::location(
                route('book.quote.new.results', [
                    'qid' => $request->session()->get('quote_session_id'),
                ])
            );

            // Option B (also works): normal redirect
            // return redirect()->route('book.quote.new.results');
        }

        $quote = Cache::get($key);

        if (!$quote) {
            // MUST be a redirect response, not route() string
            return redirect()
                ->route('book.quote.new')
                ->with('message', 'Your quote expired. Please start again.');
        }

        return Inertia::render('Book/ServiceResults', [
            'answers' => $quote,
            'title' => 'Installation Results',
        ]);
    }

    public function serviceCheckout(Request $request)
    {
        $key = $this->quoteCacheKey($request);
        $basePrice = BasePrice::boilerService()->value('price');
        $symbol = config('services.currency.symbol');

        if ($request->isMethod('post')) {
            $answers = $request->all();

            if (empty($answers)) {
                return back()->withErrors(['quote' => 'Quote payload missing.']);
            }

            Cache::put($key, $answers, now()->addMinutes(60));

            return Inertia::location(route('book.quote.service.checkout'));
        }

        $answers = Cache::get($key);

        if (!$answers) {
            return redirect()
                ->route('book.quote.service')
                ->with('message', 'Your session expired. Please start again.');
        }

        return Inertia::render('Book/ServiceCheckout', [
            'answers' => $answers,
            'basePrice' => $basePrice,
            'symbol' => $symbol,
            'title' => 'Boiler Service Checkout',
        ]);
    }

    public function repairCheckout(Request $request)
    {
        $key = $this->quoteCacheKey($request);
        $basePrice = BasePrice::boilerRepair()->value('price');
        $symbol = config('services.currency.symbol');

        if ($request->isMethod('post')) {
            $answers = $request->all();

            if (empty($answers)) {
                return back()->withErrors(['quote' => 'Quote payload missing.']);
            }

            Cache::put($key, $answers, now()->addMinutes(60));

            return Inertia::location(route('book.quote.repair.checkout'));
        }

        $answers = Cache::get($key);

        if (!$answers) {
            return redirect()
                ->route('book.quote.repair')
                ->with('message', 'Your session expired. Please start again.');
        }

        return Inertia::render('Book/RepairCheckout', [
            'answers' => $answers,
            'basePrice' => $basePrice,
            'symbol' => $symbol,
            'title' => 'Boiler Repair Checkout',
        ]);
    }

    public function install(Request $request)
    {
        $symbol = config('services.currency.symbol');
        $key = $this->quoteCacheKey($request);

        if ($request->isMethod('post')) {
            $data = $request->validate([
                'boiler_id'     => 'required|string',
                'brand'         => 'required|string',
                'model'         => 'required|string',
                'kw'            => 'required|numeric',
                'warrantyYears' => 'required|numeric',
                'price'         => 'required|numeric',
                'includes'      => 'array',
                'includes.*'    => 'string',
                'images'        => 'array',
                'images.*'      => 'string',
                'power'         => 'required|string',
                'answers'        => 'required'
            ]);

            $data['includes'] = $data['includes'] ?? [];
            $data['images']   = $data['images'] ?? [];

            Cache::put($key, $data, now()->addMinutes(60));

            // Force a clean GET visit so refresh works and no resubmission prompt
            return Inertia::location(route('book.quote.install'));
            // return redirect()->route('book.quote.install');
        }

        // GET: load from cache
        $data = Cache::get($key);

        if (!$data) {
            // If install cache is missing, fall back to results (or quote start)
            return redirect()
                ->route('book.quote.new.results')
                ->with('message', 'Session expired. Please re-select your boiler.');
        }

        return Inertia::render('Book/InstallPage', [
            'booking' => $data,
            'symbol' => $symbol,
            'title' => 'Select Your Boiler',
            // 'answers' => $data
        ]);
    }











    private function reset(Request $request)
    {
        if ($request->session()->has('quote_session_id')) {
            Cache::forget('quote:new:results:' . $request->session()->get('quote_session_id'));
            $request->session()->forget('quote_session_id');
        }

        return response()->json(['ok' => true]);
    }

    // public function bookingSuccess(Request $request)
    // {
    //     $key = $this->quoteCacheKey($request);

    //     Cache::forget($key);
    //     $request->session()->forget('quote_session_id');

    //     return response()->json(['ok' => true]);
    // }

}
