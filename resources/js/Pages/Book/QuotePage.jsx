import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageHeader } from "@/Components/ui/page-header";
import { GoogleReview } from "@/Components/GoogleReview";
import { TechnicianButton } from "@/Components/TechnicianButton";

const pageTitle = "Get a Quote";

const SERVICE_KEYS = {
    REPAIR: "repair",
    NEW: "new",
    POWERFLUSH: "powerflush",
    SERVICE: "service",
};

const SERVICE_CONTENT = {
    [SERVICE_KEYS.REPAIR]: {
        slug: SERVICE_KEYS.REPAIR,
        heroTitle:
            "Fast boiler repair — same-day engineers, transparent pricing.",
        heroDesc:
            "Emergency diagnosis and on-site fixes. Fixed labour rates, clear parts pricing — we prioritise safety and speed.",
        badge: "Boiler Repair",
        cta: "Get your personalised quote",

        pricingType: "table",
        pricingTable: [
            { item: "Sensor", category: "Boiler", price: "£120" },
            { item: "Electrodes", category: "Boiler", price: "£130" },
            { item: "Plate heat exchanger", category: "Boiler", price: "£260" },
            { item: "Fan", category: "Boiler", price: "£300" },
            {
                item: "Thermostat (not smart controls)",
                category: "Controls",
                price: "£180",
            },
        ],
        inspectionNote: "These prices exclude your £89 inspection",
    },

    [SERVICE_KEYS.NEW]: {
        slug: SERVICE_KEYS.NEW,
        heroTitle: "New boiler installations — efficient, tested, guaranteed.",
        heroDesc:
            "Supply & install modern, high-efficiency boilers. Full removal, install, commissioning and certificates included.",
        badge: "New Boiler",
        sampleJobLabel: "New Boiler • From £1,200",
        estimateLabel: "Install estimate",
        labour: "£600",
        parts: "£600",
        gaugeLabel: "Install success",
        gaugeValueText: "95%",
        cta: "Get installation quote",
        pricingType: "estimate",
    },

    [SERVICE_KEYS.POWERFLUSH]: {
        slug: SERVICE_KEYS.POWERFLUSH,
        heroTitle: "Power flush — deep clean for radiators & pipework.",
        heroDesc:
            "Remove sludge and improve circulation to restore performance and reduce breakdowns.",
        badge: "Power Flush",
        sampleJobLabel: "Power Flush • From £180",
        estimateLabel: "System clean",
        labour: "£120",
        parts: "—",
        gaugeLabel: "Flow restored",
        gaugeValueText: "88%",
        cta: "Book a power flush",
        pricingType: "estimate",
    },

    [SERVICE_KEYS.SERVICE]: {
        slug: SERVICE_KEYS.SERVICE,
        heroTitle: "Annual boiler service — safety checks & reliability.",
        heroDesc:
            "Annual safety inspection, combustion check and preventative maintenance.",
        badge: "Boiler Service",
        sampleJobLabel: "Boiler Service • From £65",
        estimateLabel: "Annual check",
        labour: "£65",
        parts: "—",
        gaugeLabel: "Pass rate",
        gaugeValueText: "99%",
        cta: "Schedule service",
        pricingType: "estimate",

        // ✅ CORRECT PLACE
        serviceNote:
            "If a manufacturer service kit (gaskets, seals, electrodes, etc.) is required during the service, it will be supplied and fitted at an additional fixed cost of £25, chargeable by card.",
    },
};

function getServiceFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("service");
        if (q) return q.toLowerCase();
    } catch {}
    return SERVICE_KEYS.REPAIR;
}

export default function QuotePage() {
    const radius = 14;
    const [serviceKey, setServiceKey] = useState(getServiceFromUrl());
    const { title } = usePage().props;

    useEffect(() => {
        const onChange = () => setServiceKey(getServiceFromUrl());
        window.addEventListener("popstate", onChange);
        return () => window.removeEventListener("popstate", onChange);
    }, []);

    const content = useMemo(
        () =>
            SERVICE_CONTENT[serviceKey] || SERVICE_CONTENT[SERVICE_KEYS.REPAIR],
        [serviceKey]
    );

    const gaugePercent = parseInt(content.gaugeValueText || "75") / 100;
    const circumference = 2 * Math.PI * radius;
    const dash = circumference * gaugePercent;
    const gap = circumference - dash;

    return (
        <>
            <Head title={title} />

            {/* ✅ FIXED: no black bottom gap */}
            <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
                <PageHeader title={pageTitle} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                        {/* LEFT */}
                        <div className="md:col-span-7">
                            {/* Modern Badge with icon and animation */}
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-blue-100 border border-primary/20">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-primary">
                                    {content.badge}
                                </span>
                            </div>

                            {/* Hero Title with modern typography */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                                <span className="bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent">
                                    {content.heroTitle
                                        .split(" ")
                                        .slice(0, 2)
                                        .join(" ")}
                                </span>{" "}
                                <span className="text-slate-900">
                                    {content.heroTitle
                                        .split(" ")
                                        .slice(2)
                                        .join(" ")}
                                </span>
                            </h1>

                            {/* Description with modern styling */}
                            <div className="relative mt-6">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-full"></div>
                                <p className="pl-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                                    {content.heroDesc}
                                </p>
                            </div>

                            {/* Modern Buttons matching right side design */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route(`book.quote.${content.slug}`)}
                                    className="group/primary relative inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <span className="relative z-10">
                                        {content.cta}
                                    </span>
                                    <span className="relative z-10 transition-transform group-hover/primary:translate-x-1">
                                        →
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-700 rounded-xl opacity-0 group-hover/primary:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                <TechnicianButton />
                            </div>

                            {/* Trust indicators matching right side design */}
                            <div className="mt-12 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex items-center justify-center">
                                        <span className="text-green-600">
                                            ✓
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Same-day service
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Emergency response
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                                        <span className="text-blue-600">
                                            💰
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Fixed pricing
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            No hidden fees
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="md:col-span-5">
                            {content.pricingType === "table" ? (
                                /* ✅ REDESIGNED PRICING CARD */
                                <div className="relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden">
                                    {/* Header */}
                                    <div className="px-6 pt-6 pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    Common Repair Costs
                                                </h3>
                                                <p className="text-slate-600 text-sm mt-1">
                                                    Transparent pricing with no
                                                    hidden fees
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <span className="text-blue-600">
                                                    💰
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Grid - 2 items per row */}
                                    <div className="px-6 pb-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Item 1 */}
                                            <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 mb-1">
                                                            Senior
                                                        </p>
                                                        <p className="font-medium text-slate-900">
                                                            Boiler Electrodes
                                                        </p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                        Common
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            £120
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Fixed price
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item 2 */}
                                            <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 mb-1">
                                                            Boiler
                                                        </p>
                                                        <p className="font-medium text-slate-900">
                                                            Electrodes
                                                        </p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                        Common
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            £130
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Fixed price
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item 3 */}
                                            <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 mb-1">
                                                            Boiler
                                                        </p>
                                                        <p className="font-medium text-slate-900">
                                                            Fan
                                                        </p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                                        Complex
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            £260
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Fixed price
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item 4 */}
                                            <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 mb-1">
                                                            Boiler
                                                        </p>
                                                        <p className="font-medium text-slate-900">
                                                            Fan
                                                        </p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                                        Complex
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            £300
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Fixed price
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item 5 - Full width */}
                                            <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors sm:col-span-2">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500 mb-1">
                                                            Controls
                                                        </p>
                                                        <p className="font-medium text-slate-900">
                                                            Thermostat (not
                                                            smart controls)
                                                        </p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                                                        Advanced
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900">
                                                            £180
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Fixed price
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 text-xs">
                                                            ✓
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer - Compact */}
                                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
                                        {/* Note */}
                                        <div className="flex items-start gap-2 mb-4">
                                            <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-600 text-xs">
                                                    ℹ️
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700">
                                                <span className="font-medium text-slate-900">
                                                    Note:
                                                </span>{" "}
                                                These prices exclude your £89
                                                inspection
                                            </p>
                                        </div>

                                        {/* Trust badges and CTA in one line */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full">
                                                Get your personalised quote
                                                <span>→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ESTIMATE CARD (unchanged) */
                                <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 p-6 shadow-[0_18px_40px_rgba(6,34,20,0.06)]">
                                    {/* header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-md bg-primary/10 p-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5 text-primary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden
                                                >
                                                    <path
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 12h18"
                                                    />
                                                </svg>
                                            </div>

                                            <div>
                                                <div className="text-xs text-dark/60">
                                                    {content.estimateLabel}
                                                </div>
                                                <div className="text-lg font-bold text-dark leading-tight">
                                                    {content.sampleJobLabel}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-dark/60">
                                            Demo • No obligation
                                        </div>
                                    </div>

                                    {/* visual + gauge */}
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                        <div className="rounded-lg bg-white p-3 border border-white/30 flex items-center justify-center">
                                            <svg
                                                viewBox="0 0 220 140"
                                                className="w-full h-24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden
                                            >
                                                <defs>
                                                    {/* Blue gradient */}
                                                    <linearGradient
                                                        id="accentGrad2"
                                                        x1="0"
                                                        x2="1"
                                                    >
                                                        <stop
                                                            offset="0"
                                                            stopColor="#0067ff"
                                                            stopOpacity="0.85"
                                                        />
                                                        <stop
                                                            offset="1"
                                                            stopColor="#0067ff40"
                                                            stopOpacity="0.65"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                {/* White card */}
                                                <rect
                                                    x="20"
                                                    y="62"
                                                    width="180"
                                                    height="44"
                                                    rx="8"
                                                    fill="#ffffff"
                                                    stroke="#d9e2f1"
                                                    strokeWidth="1"
                                                />

                                                {/* Top gradient shape */}
                                                <path
                                                    d="M20 62 L110 20 L200 62 Z"
                                                    fill="url(#accentGrad2)"
                                                    opacity="0.95"
                                                    stroke="#c7d8f5"
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-end">
                                            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-white/60 border border-white/30 p-2">
                                                <svg
                                                    width="84"
                                                    height="84"
                                                    viewBox="0 0 36 36"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden
                                                >
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#f6fdf8"
                                                        strokeWidth="3"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="url(#g3)"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${dash.toFixed(
                                                            2
                                                        )} ${gap.toFixed(2)}`}
                                                        transform="rotate(-90 18 18)"
                                                    />
                                                    <defs>
                                                        <linearGradient
                                                            id="g3"
                                                            x1="0"
                                                            x2="1"
                                                        >
                                                            <stop
                                                                offset="0"
                                                                stopColor="#0067ff"
                                                            />
                                                            <stop
                                                                offset="1"
                                                                stopColor="#0067ff40"
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <text
                                                        x="18"
                                                        y="16.6"
                                                        textAnchor="middle"
                                                        fontSize="5"
                                                        fill="#065f46"
                                                        fontWeight="700"
                                                    >
                                                        {content.gaugeValueText}
                                                    </text>
                                                    <text
                                                        x="18"
                                                        y="21.4"
                                                        textAnchor="middle"
                                                        fontSize="4"
                                                        fill="#065f46"
                                                    >
                                                        {content.gaugeLabel}
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* cost row */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-md bg-white p-3 border border-gray-100 text-sm">
                                            <div className="text-xs text-slate-500">
                                                Labour
                                            </div>
                                            <div className="text-sm font-medium text-slate-900">
                                                {content.labour}
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-white p-3 border border-gray-100 text-sm">
                                            <div className="text-xs text-slate-500">
                                                Parts
                                            </div>
                                            <div className="text-sm font-medium text-slate-900">
                                                {content.parts}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service-specific note */}
                                    {content.serviceNote && (
                                        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/2 px-4 py-3">
                                            <p className="text-[15px] text-dark leading-6">
                                                <span className="font-bold text-[18px]">
                                                    Important :
                                                </span>{" "}
                                                {content.serviceNote}
                                            </p>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="mt-5">
                                        <Link
                                            href={route(
                                                `book.quote.${content.slug}`
                                            )}
                                            className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary/80 via-primary/70 via-primary/40 to-secondary/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(23,42,68,0.12)] focus:outline-none "
                                        >
                                            {content.cta}
                                        </Link>
                                        <div className="mt-4 text-center text-xs text-slate-500">
                                            No obligation — booking in 2 mins
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ✅ FIXED: controlled bottom spacing */}
                    <div className="mt-20 pb-12">
                        <GoogleReview />
                    </div>
                </main>
            </div>
        </>
    );
}
