import { GoogleReview } from "../GoogleReview";
import { HeroServices } from "../HeroService";
import { BadgeCheck, ShieldCheck, Clock4, PhoneCall } from "lucide-react";

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
                        <div className="space-y-6 text-center flex flex-col items-center">
                            <h2 className="text-4xl sm:text-[40px] lg:text-[52px] font-semibold tracking-tight text-slate-900">
                                <span className="uppercase">New boiler installation in Leeds & Surrounding</span>{" "}
                                <img
                                    src="/images/yorkshire%20rose.png"
                                    alt="Yorkshire rose"
                                    className="inline-block h-10 w-10 sm:h-16 sm:w-16 align-middle"
                                />
                                <span className="mt-3 block text-xl sm:text-2xl font-medium text-slate-600">
                                    Booking slots are available seven days a week, subject to demand.
                                </span>
                            </h2>


                            <div className="flex flex-wrap items-center justify-center gap-3">
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

                            <p className="text-xs text-slate-500 mx-auto">
                                Big blue prices? Not here. Local engineers, fixed quotes.
                            </p>

                        </div>

                        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-4 sm:p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
                            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />
                            <div className="flex flex-col items-center gap-2 text-center">
                                <img
                                    src="/images/gas%20safe%20logo%20mega.png"
                                    alt="Gas Safe Register"
                                    className="h-10 w-10"
                                />
                                <div>
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                        Gas Safe Register 636354
                                    </div>
                                    <div className="text-lg font-semibold text-slate-900">
                                        Certified local engineers
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-3 py-2">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-semibold text-slate-900">Order before 3pm</span>
                                    <span className="text-xs font-semibold text-emerald-700">Next‑day installs available</span>
                                </div>
                                <div className="mt-2 text-xs text-slate-600">
                                    We will contact you with confirmation.
                                </div>
                            </div>

                            <div className="mt-3 grid gap-2">
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Fully insured workmanship</div>
                                            <div className="text-xs text-slate-500">Public liability & workmanship protection on every job.</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Approved brand installer</div>
                                            <div className="mt-1 flex items-center justify-center gap-2">
                                                <img
                                                    src="/images/idealheating.png"
                                                    alt="Ideal Heating"
                                                    className="h-6 w-16 object-contain"
                                                />
                                                <span className="text-xs text-slate-500">Ideal Heating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                                        <Clock4 className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Fast booking</div>
                                            <div className="text-xs text-slate-500">Slots for this week with real‑time availability.</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                                        <PhoneCall className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Engineer support</div>
                                            <div className="text-xs text-slate-500">WhatsApp 24/7 or request a callback.</div>
                                        </div>
                                    </div>
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
