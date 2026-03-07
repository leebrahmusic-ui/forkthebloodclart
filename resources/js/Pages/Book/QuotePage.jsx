import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageHeader } from "@/Components/ui/page-header";
import { GoogleReview } from "@/Components/GoogleReviewPremium";
import { TechnicianButton } from "@/Components/TechnicianButton";
import BlueQuoteSkin from "@/Components/extra/BlueQuoteSkin";

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
        heroTitle: "Magnacleanse — deep clean for radiators & pipework.",
        heroDesc:
            "A professional system clean using Magnacleanse equipment to lift sludge, improve heat flow, and protect your boiler.",
        badge: "System Clean",
        sampleJobLabel: "Magnacleanse • From £525 inc VAT",
        estimateLabel: "System clean",
        labour: "£525",
        parts: "—",
        gaugeLabel: "Flow restored",
        gaugeValueText: "88%",
        cta: "Get Magnacleanse quote",
        pricingType: "estimate",
    },

    [SERVICE_KEYS.SERVICE]: {
        slug: SERVICE_KEYS.SERVICE,
        heroTitle: "Boiler Servicing in Leeds & Surrounding",
        heroDesc:
            "Full strip-down service with safety checks, combustion analysis, and clean. If strip-down shows worn seals, gaskets, or electrodes, we’ll show you and price the required service parts for your boiler model before fitting.",
        badge: "Boiler Service",
        sampleJobLabel: "Boiler Service • £115 inc VAT",
        estimateLabel: "Annual check",
        labour: "£115",
        parts: "—",
        gaugeLabel: "Pass rate",
        gaugeValueText: "99%",
        cta: "Book a service",
        pricingType: "estimate",

        // ✅ CORRECT PLACE
        serviceNote:
            "A strip-down can reveal failed seals, gaskets, or electrodes. These are routine service parts that occasionally need replacing; we’ll confirm the requirement and cost based on your boiler model before fitting. If your boiler isn’t working or showing faults, please book a repair/diagnosis instead of a service.",
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
    const { title, basePrices = {}, symbol = "£" } = usePage().props;

    const mergedContent = useMemo(() => {
        const servicePrice = basePrices.boiler_service;
        const repairPrice = basePrices.boiler_repair;
        const powerFlushPrice = basePrices.power_flush;

        return {
            ...SERVICE_CONTENT,
            [SERVICE_KEYS.SERVICE]: {
                ...SERVICE_CONTENT[SERVICE_KEYS.SERVICE],
                labour: servicePrice ? `${symbol}${servicePrice}` : SERVICE_CONTENT[SERVICE_KEYS.SERVICE].labour,
                sampleJobLabel: servicePrice
                    ? `Boiler Service • ${symbol}${servicePrice} inc VAT`
                    : SERVICE_CONTENT[SERVICE_KEYS.SERVICE].sampleJobLabel,
            },
            [SERVICE_KEYS.REPAIR]: {
                ...SERVICE_CONTENT[SERVICE_KEYS.REPAIR],
                pricingTable: SERVICE_CONTENT[SERVICE_KEYS.REPAIR].pricingTable.map((row) =>
                    row.item === "Sensor"
                        ? { ...row, price: repairPrice ? `${symbol}${repairPrice}` : row.price }
                        : row
                ),
            },
            [SERVICE_KEYS.POWERFLUSH]: {
                ...SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH],
                labour: powerFlushPrice ? `${symbol}${powerFlushPrice}` : SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH].labour,
                sampleJobLabel: powerFlushPrice
                    ? `Magnacleanse • From ${symbol}${powerFlushPrice} inc VAT`
                    : SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH].sampleJobLabel,
            },
        };
    }, [basePrices, symbol]);

    useEffect(() => {
        const onChange = () => setServiceKey(getServiceFromUrl());
        window.addEventListener("popstate", onChange);
        return () => window.removeEventListener("popstate", onChange);
    }, []);

    const content = useMemo(
        () =>
            mergedContent[serviceKey] || mergedContent[SERVICE_KEYS.REPAIR],
        [serviceKey, mergedContent]
    );

    const gaugePercent = parseInt(content.gaugeValueText || "75") / 100;
    const circumference = 2 * Math.PI * radius;
    const dash = circumference * gaugePercent;
    const gap = circumference - dash;

    return (
        <>
            <Head title={title} />

            <BlueQuoteSkin>
            {/* ✅ FIXED: no black bottom gap */}
            <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-white overflow-x-hidden quote-page-bg">
                <PageHeader title={pageTitle} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                        {/* LEFT */}
                        <div className="md:col-span-7">
                            {content.slug === SERVICE_KEYS.SERVICE ? (
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 border border-slate-200 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                                    Boiler service • {content.sampleJobLabel.replace("Boiler Service • ", "")}
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-slate-800">
                                        {content.badge}
                                    </span>
                                </div>
                            )}

                            {/* Hero Title with modern typography */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900">
                                {content.heroTitle}
                            </h1>

                            {/* Description with modern styling */}
                            <div className="relative mt-6">
                                <p className="text-lg text-slate-700 max-w-xl leading-relaxed">
                                    {content.heroDesc}
                                </p>
                            </div>

                            {/* Modern Buttons matching right side design */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route(`book.quote.${content.slug}`)}
                                    className="group/primary relative inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-7 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <span className="relative z-10">
                                        {content.cta}
                                    </span>
                                    <span className="relative z-10 transition-transform group-hover/primary:translate-x-1">
                                        →
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-700 rounded-xl opacity-0 group-hover/primary:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                <TechnicianButton />
                            </div>

                            {/* Klarna banner */}
                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white font-black text-xl flex items-center justify-center">
                                    K
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">Spread the cost with Klarna</p>
                                    <p className="text-sm text-slate-600">Pay in 3 instalments, interest free. Subject to status. Choose Klarna at checkout.</p>
                                </div>
                            </div>

                            {/* Trust indicators */}
                            {content.slug === SERVICE_KEYS.SERVICE ? (
                                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                                    {["Full clean and combustion safety checks", "Strip-down inspection; service parts priced if worn", "Expansion vessel set and leak-checked", "Gas Safe engineers, tidy work"].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm"
                                        >
                                            <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                            <p className="text-sm font-semibold text-slate-900 leading-snug">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-12 flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                            <span className="text-emerald-600">✓</span>
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
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                            <span className="text-emerald-600">💷</span>
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
                            )}
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
                                                    How boiler repairs work
                                                </h3>
                                                <p className="text-slate-600 text-sm mt-1">
                                                    Simple, local, and clear — no jargon.
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <span className="text-emerald-600 animate-[spin_8s_linear_infinite]">
                                                    🔧
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3-step flow */}
                                    <div className="px-6 pb-6">
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            {[
                                                {
                                                    step: "STEP 01",
                                                    title: "Book your repair",
                                                    text: "Your booking covers a full inspection visit of up to 1 hour.",
                                                },
                                                {
                                                    step: "STEP 02",
                                                    title: "Engineer inspection",
                                                    text: "If it’s fixed within the hour with no parts, there are no further charges.",
                                                },
                                                {
                                                    step: "STEP 03",
                                                    title: "If parts are needed",
                                                    text: "We explain fixed parts pricing before doing any extra work. You choose how to proceed.",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.step}
                                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                                                            {item.step}
                                                        </span>
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    </div>
                                                    <h4 className="mt-4 text-base font-semibold text-slate-900">
                                                        {item.title}
                                                    </h4>
                                                    <p className="mt-2 text-sm text-slate-600">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
                                        If we can’t resolve the boiler issue after a full inspection, we’ll refund the inspection fee. If access is restricted or the fault is outside the boiler system, the inspection fee applies.
                                    </div>
                                    </div>

                                    {/* Footer - Compact */}
                                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-600">
                                                    Repair booking includes a full inspection visit for up to 1 hour.
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Book instantly online after the questions — no waiting, no calling, no callbacks unless you want one.
                                                </p>
                                            </div>
                                            <Link
                                                href={route(`book.quote.${content.slug}`)}
                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full"
                                            >
                                                Book a repair
                                                <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : content.slug === SERVICE_KEYS.SERVICE ? (
                                <div className="relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden">
                                    <div className="px-6 pt-6 pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    How boiler servicing works
                                                </h3>
                                                <p className="text-slate-600 text-sm mt-1">
                                                    Strip-down service; if service parts are needed, we price them clearly before fitting.
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <span className="text-emerald-600 animate-[spin_8s_linear_infinite]">🧰</span>
                                            </div>

                                            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
                                                <p className="font-semibold text-emerald-800">What we actually do on the strip-down:</p>
                                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                                    <li>Pump and set the expansion vessel, checking the Schrader valve</li>
                                                    <li>Clean the combustion chamber and burner area</li>
                                                    <li>Clean and flush the condensate trap</li>
                                                    <li>Check and replace worn service parts (gaskets/electrodes) if needed</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6">
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            {[
                                                {
                                                    step: "STEP 01",
                                                    title: "Book online in minutes",
                                                    text: "Answer the short questions and lock in your strip-down service instantly — no calls or back-and-forth.",
                                                },
                                                {
                                                    step: "STEP 02",
                                                    title: "We confirm your slot",
                                                    text: "You get the appointment time and a reminder. If anything needs tweaking, we’ll message you straight away.",
                                                },
                                                {
                                                    step: "STEP 03",
                                                    title: "Service + sign-off",
                                                    text: "We carry out the strip-down. If service parts are required, we’ll show you and price them before fitting; if your boiler has faults, we’ll recommend a repair visit instead.",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.step}
                                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                                                            {item.step}
                                                        </span>
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    </div>
                                                    <h4 className="mt-4 text-base font-semibold text-slate-900">
                                                        {item.title}
                                                    </h4>
                                                    <p className="mt-2 text-sm text-slate-600">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-600">
                                                    Fixed-price strip-down service. If worn service parts are needed, we price them clearly by boiler model before fitting.
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Service is for healthy or routine maintenance. If your boiler is showing faults or not working, please book a repair/diagnosis instead.
                                                </p>
                                            </div>
                                            <Link
                                                href={route(`book.quote.${content.slug}`)}
                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full"
                                            >
                                                Book a service
                                                <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : content.slug === SERVICE_KEYS.POWERFLUSH ? (
                                <div className="relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden">
                                    <div className="px-6 pt-6 pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    How Magnacleanse works
                                                </h3>
                                                <p className="text-slate-600 text-sm mt-1">
                                                    We use Magnacleanse, not a generic power flush.
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <span className="text-emerald-600 animate-[spin_8s_linear_infinite]">🧲</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6">
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            {[
                                                {
                                                    step: "STEP 01",
                                                    title: "Complete the questionnaire",
                                                    text: "We use your answers to size the job and give an accurate quote.",
                                                },
                                                {
                                                    step: "STEP 02",
                                                    title: "Magnacleanse clean",
                                                    text: "We remove sludge and restore heat flow across the system.",
                                                },
                                                {
                                                    step: "STEP 03",
                                                    title: "Protect with inhibitor",
                                                    text: "We treat the system with inhibitor to help prevent future build‑up.",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.step}
                                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                                                            {item.step}
                                                        </span>
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    </div>
                                                    <h4 className="mt-4 text-base font-semibold text-slate-900">
                                                        {item.title}
                                                    </h4>
                                                    <p className="mt-2 text-sm text-slate-600">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
                                            Prices start at £525 inc VAT and vary by system size and radiator count. If we believe the service won’t benefit you, we’ll let you know and cancel with a full refund.
                                        </div>
                                    </div>

                                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <p className="text-sm text-slate-600">
                                                Complete the multiple‑choice questionnaire to get your quote and book instantly online — no waiting, no calling, no callbacks unless you want one.
                                            </p>
                                            <Link
                                                href={route(`book.quote.${content.slug}`)}
                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full"
                                            >
                                                Get Magnacleanse quote
                                                <span>→</span>
                                            </Link>
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
            </BlueQuoteSkin>
        </>
    );
}
