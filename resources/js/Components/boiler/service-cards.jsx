import {
    MessageCircleMore,
    Touchpad,
    Hammer,
    CheckCircle2,
} from "lucide-react";

export function ServiceCards() {
    const steps = [
        {
            title: "You answer",
            description:
                "Answer a few quick questions about your home.",
            icon: MessageCircleMore,
            badge: "Start here",
            step: "STEP 01",
        },
        {
            title: "You pick",
            description:
                "Choose a fixed‑price package with clear costs.",
            icon: Touchpad,
            badge: "Choose",
            step: "STEP 02",
        },
        {
            title: "We fit",
            description:
                "A qualified engineer installs it clean and on time.",
            icon: Hammer,
            badge: "Installation",
            step: "STEP 03",
        },
    ];

    return (
        <section
            id="service-cards"
            className="relative scroll-mt-24 overflow-hidden rounded-t-[45px] bg-slate-50 py-16 sm:py-24"
        >
            {/* soft background blobs */}
            <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-5">
                        {/* heading */}
                        <div className="max-w-3xl">
                            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-10">
                                A clear online quote, without a sales visit.
                                <br className="hidden sm:block" />
                                <span className="text-emerald-600">
                                    Local engineers, tidy installs, clear pricing.
                                </span>
                            </h2>
                            <p className="mt-3 text-lg text-slate-600">
                                Book this week. Next‑day installs available when ordered before 3pm.
                            </p>
                        </div>

                        {/* STEP CARDS + CENTER LINE */}
                        <div className="relative mt-3">
                            {/* horizontal line behind cards (desktop only) */}
                            <div className="relative grid gap-4 sm:grid-cols-3">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    return (
                                        <article
                                            key={step.title}
                                            className="relative z-[1] flex h-full flex-col rounded-[24px] bg-white px-4 py-5 sm:px-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-colors duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]"
                                        >
                                            {/* top row: icon + badge */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.35)]">
                                                        <Icon
                                                            className="h-5 w-5 text-white"
                                                            strokeWidth={2.2}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                                                    {step.badge}
                                                </span>
                                            </div>

                                            {/* title + description */}
                                            <h3 className="mt-4 text-[18px] font-semibold text-slate-900">
                                                {step.title}
                                            </h3>
                                            <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                                                {step.description}
                                            </p>

                                            {/* footer: centered pill + short line */}
                                            <div className="mt-4 flex items-center justify-start gap-3">
                                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-[5px] text-[11px] font-medium tracking-[0.16em] text-slate-600 uppercase">
                                                    {step.step}
                                                </span>
                                                <span className="h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-400/60 via-emerald-300/40 to-transparent" />
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FULL-HEIGHT INFO CARD */}
                    <div className="relative h-full">
                        <div className="relative flex h-full flex-col rounded-[30px] border border-dashed border-slate-200 bg-white p-6 sm:p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
                            {/* top-right badge */}
                            <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                WhatsApp or callback
                            </div>

                            {/* make inner content fill height to avoid empty bottom */}
                            <div className="mt-8 flex h-full flex-col gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-[15px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        How it works
                                    </h3>
                                    <p className="text-[17px] leading-relaxed text-slate-900">
                                        Simple steps with clear pricing and fast availability.
                                    </p>

                                    <ul className="mt-4 space-y-3 text-[16px] text-slate-700">
                                        <li className="flex gap-2">
                                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span>
                                                Fixed‑price quote, no hidden extras.
                                            </span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                            <span>
                                                Pick your package and preferred date.
                                            </span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                            <span>
                                                Order before 3pm for next‑day options.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* chips pinned towards bottom to fill space nicely */}
                                <div className="flex flex-wrap gap-3 text-[15px] text-slate-700">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5">
                                        No sales visit
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5">
                                        Local engineers
                                    </span>
                                </div>

                                {/* <span className="h-[2px] w-16 rounded-full bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
