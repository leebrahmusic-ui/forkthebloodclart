import { GoogleReview } from "../GoogleReview";
import { HeroServices } from "../HeroService";

export function HeroSection() {
    return (
        <section
            id="services"
            className="relative overflow-hidden py-20 rounded-b-[45px] bg-slate-50 pt-40"
        >
            <div className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-0">
                <div className="relative mb-12">
                    {/* Background decorative element */}
                    <div className="absolute -top-8 left-0 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200 via-emerald-100/40 to-transparent blur-2xl" />

                    <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            <h2 className="text-4xl sm:text-[40px] lg:text-[52px] font-semibold tracking-tight text-slate-900">
                                New boiler installs in Leeds & Surrounding — fixed price, no sales visit.
                                <span className="mt-3 block text-xl sm:text-2xl font-medium text-slate-600">
                                    Book this week. Next‑day installs available when ordered before 3pm.
                                </span>
                            </h2>


                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href="/book"
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Get a fixed quote
                                </a>
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700">
                                    See services below
                                </span>
                            </div>

                            <p className="text-xs text-slate-500">
                                Big blue prices? Not here. Local engineers, fixed quotes.
                            </p>

                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/511-5113277-gas-safe-register-logo-symbol-gas-safe-logo.png"
                                        alt="Gas Safe Register"
                                        className="h-9 w-9"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            Gas Safe Register 636354
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Certified engineers
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                                    <span className="text-sm font-semibold text-slate-900">Order before 3pm</span>
                                    <span className="text-xs font-semibold text-emerald-600">Next‑day installs</span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                            Fully insured
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            Work protected
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            Insurance details available on request
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                            Trusted brand installer
                                        </div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <img
                                                src="/images/idealheating.png"
                                                alt="Ideal Heating"
                                                className="h-6 w-16 object-contain"
                                            />
                                            <span className="text-xs text-slate-500">Ideal Heating</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                                    WhatsApp chat 24/7 or request a callback from an engineer.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <HeroServices />

                <GoogleReview />
            </div>
        </section>
    );
}
