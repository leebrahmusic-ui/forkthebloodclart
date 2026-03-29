import { useEffect, useMemo, useRef, useState } from "react";
import {
    FiInfo,
    FiX,
    FiChevronRight,
    FiShield,
    FiAward,
    FiFileText,
    FiStar,
    FiClock,
    FiChevronDown,
    FiCheck,
} from "react-icons/fi";
import { AiOutlineQuestion } from "react-icons/ai";
import { router } from "@inertiajs/react";
import DetailsQuoteSidebar from "./QuoteResultPage/DetailsQuote";

const SORT_OPTIONS = [
    { value: "recommended", label: "Recommended" },
    { value: "price_low", label: "Price: Low to high" },
    { value: "price_high", label: "Price: High to low" },
    { value: "warranty_high", label: "Warranty: Longest first" },
    { value: "kw_low", label: "Output (kW): Low to high" },
    { value: "brand_az", label: "Brand: A to Z" },
];

export default function QuoteResultsPage({ answers }) {
    const isCompatibilityDependentItem = (label = "") => {
        const normalized = String(label).toLowerCase();
        return ["shock arrestor", "scale reducer", "magnetic filter"].some(
            (term) => normalized.includes(term)
        );
    };

    const compatibilityTooltipText =
        "Installed subject to site suitability and compatibility with your existing system configuration.";

    const getCsrfToken = () => {
        if (typeof document === "undefined") return null;
        return document.head.querySelector('meta[name="csrf-token"]')?.content;
    };

    const withCsrf = (payload) => {
        const token = getCsrfToken();
        return token ? { ...payload, _token: token } : payload;
    };

    // 1. Extract products safely from the Inertia props
    const products = answers?.products || [];
    const quoteAddOns = answers?.addOns || {};
    const quoteAddOnItems = Array.isArray(quoteAddOns?.items)
        ? quoteAddOns.items
        : [];
    const derivedFlueType = quoteAddOns?.derived?.flueType;
    const bathroomsLabel =
        answers?.inputs?.bathrooms ||
        answers?.answers?.raw?.bathrooms?.label ||
        answers?.bathrooms?.label ||
        null;

    const [activeQuote, setActiveQuote] = useState(null);
    const [detailsQuote, setDetailsQuote] = useState(null);
    const [selectedPower, setSelectedPower] = useState("25");
    const [showInstallTimeInfo, setShowInstallTimeInfo] = useState(false);
    const [showGasSafeInfo, setShowGasSafeInfo] = useState(false);
    const [showNextDayInfo, setShowNextDayInfo] = useState(false);
    const [showWarrantyInfo, setShowWarrantyInfo] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [openCompatibilityTip, setOpenCompatibilityTip] = useState(null);
    const [sortBy, setSortBy] = useState("recommended");
    const mobileCarouselRef = useRef(null);

    const [productDetails, setProductDetails] = useState({});

    // --- Helpers for Dynamic Data ---

    // Generate gradients based on index so api data doesn't need style info
    // Calculate Price: Handle nulls from your screenshot (base + margin + addons)
    const calculatePrice = (product) => {
        if (product.pricing?.total) return product.pricing.total;

        const base = parseFloat(product.pricing?.base || 0);
        const margin = parseFloat(product.pricing?.marginApplied || 0);
        const addons = parseFloat(product.pricing?.addOnsTotal || 0);
        return base + margin + addons;
    };

    const getTierLabel = (index) => {
        if (index === 0) return "Essential";
        if (index === 1) return "Most popular";
        if (index === 2) return "Premium";
        return "";
    };

    const getConfidenceLine = (index) => {
        if (index === 0) return "Great value with trusted essentials";
        if (index === 1) return "Balanced performance for most homes";
        if (index === 2) return "Maximum comfort and longer-term cover";
        return "Matched to your property answers";
    };

    const getBestFor = (index) => {
        if (index === 0) return "Value-first homeowners";
        if (index === 1) return "Most household setups";
        if (index === 2) return "Premium features and longer cover";
        return "Your selected property profile";
    };

    const getResultsContextLine = () => {
        const raw = String(bathroomsLabel || "").trim();
        if (!raw) return "Results for your home";

        const match = raw.match(/(\d+(?:\.\d+)?\+?)/);
        if (match?.[1]) return `Results for your ${match[1]}-bathroom home`;

        return "Results for your home";
    };

    const formatCurrency = (value) => {
        const amount = Number(value);
        if (Number.isNaN(amount)) return null;
        return `£${amount.toLocaleString()}`;
    };

    const selectedExtras = [
        ...(derivedFlueType
            ? [
                  {
                      label: "Flue type",
                      value:
                          String(derivedFlueType).charAt(0).toUpperCase() +
                          String(derivedFlueType).slice(1),
                  },
              ]
            : []),
        ...quoteAddOnItems.map((item) => {
            const qty = Number(item?.qty || 0);
            const unitPrice = Number(item?.unitPrice ?? item?.unit_price ?? 0);
            const total = Number(item?.total ?? 0);

            const quantityText =
                qty > 0 ? `${qty} × ${formatCurrency(unitPrice) || "£0"}` : null;

            return {
                label: item?.label || item?.key || "Selected extra",
                value: quantityText || "Included",
                totalText: total > 0 ? formatCurrency(total) : "Included",
            };
        }),
    ];

    const getBrandLogo = (brandName) => {
        const b = String(brandName || "").toLowerCase();

        if (b.includes("worcester"))
            return "/images/brands/worcester-bosch.svg";
        if (b.includes("ideal")) return "/images/idealheating.png";
        if (b.includes("vaillant")) return "/images/brands/vaillant.svg";
        if (b.includes("viessmann")) return "/images/brands/viessmann.svg";
        if (b.includes("baxi")) return "/images/brands/baxi.svg";
        if (b.includes("alpha")) return "/images/brands/alpha.svg";
        if (b.includes("glow")) return "/images/brands/glow-worm.svg";
        if (b.includes("vokera")) return "/images/brands/vokera.svg";
        if (b.includes("intergas")) return "/images/brands/intergas.svg";
        if (b.includes("atag")) return "/images/brands/atag.svg";

        return null;
    };

    const sortedProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        if (sortBy === "recommended") return products;

        const ranked = products.map((p, i) => ({ p, i }));

        ranked.sort((a, b) => {
            const pa = Number(calculatePrice(a.p) || 0);
            const pb = Number(calculatePrice(b.p) || 0);
            const wa = Number(a.p?.warrantyYears || 0);
            const wb = Number(b.p?.warrantyYears || 0);
            const ka = Number(a.p?.kw || 0);
            const kb = Number(b.p?.kw || 0);
            const ba = String(a.p?.brand || "");
            const bb = String(b.p?.brand || "");

            if (sortBy === "price_low") return pa - pb || a.i - b.i;
            if (sortBy === "price_high") return pb - pa || a.i - b.i;
            if (sortBy === "warranty_high") return wb - wa || a.i - b.i;
            if (sortBy === "kw_low") return ka - kb || a.i - b.i;
            if (sortBy === "brand_az") return ba.localeCompare(bb) || a.i - b.i;

            return a.i - b.i;
        });

        return ranked.map((x) => x.p);
    }, [products, sortBy]);

    const visibleProducts = sortedProducts;

    useEffect(() => {
        setActiveCardIndex(0);
        const container = mobileCarouselRef.current;
        if (!container) return;
        container.scrollTo({ left: 0, behavior: "smooth" });
    }, [sortBy]);

    useEffect(() => {
        if (activeCardIndex >= visibleProducts.length) {
            setActiveCardIndex(Math.max(0, visibleProducts.length - 1));
        }
    }, [activeCardIndex, visibleProducts.length]);

    const updateActiveCardFromScroll = () => {
        const container = mobileCarouselRef.current;
        if (!container) return;

        const cards = Array.from(
            container.querySelectorAll("[data-card-index]")
        );
        if (!cards.length) return;

        const containerCenter =
            container.scrollLeft + container.clientWidth / 2;

        let nearestIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, idx) => {
            const cardCenter = card.offsetLeft + card.clientWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                nearestIndex = idx;
            }
        });

        setActiveCardIndex(nearestIndex);
    };

    const scrollToProductCard = (index) => {
        const el = document.getElementById(`quote-product-card-${index}`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        setActiveCardIndex(index);
    };

    return (
        <div className="relative min-h-screen bg-transparent px-4 py-8 md:px-6 md:py-10 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
            {/* HEADER */}
            <div className="relative max-w-7xl mx-auto mb-8">
                <div className="rounded-3xl bg-white/85 p-6 md:p-8 shadow-[0_18px_48px_rgba(15,23,42,0.10)] ring-1 ring-slate-100/70 backdrop-blur-sm">
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                                <FiStar className="h-3.5 w-3.5" />
                                Personalised results
                            </div>

                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 leading-tight">
                                Boiler options matched to your home
                            </h1>

                            <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
                                Fixed-price packages based on your survey answers.
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    {getResultsContextLine()}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
                                    <FiCheck className="h-3.5 w-3.5" />
                                    Installation included
                                </span>
                            </div>

                            <div className="pt-1 flex flex-wrap items-center gap-2">
                                <p className="text-sm text-slate-600">
                                    Stay in touch on WhatsApp throughout the process.
                                </p>
                                <a
                                    href="https://wa.me/447454796398"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                                >
                                    WhatsApp 24/7
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative rounded-2xl bg-white/75 p-3 ring-1 ring-slate-100 group flex items-center justify-center text-center">
                                <div className="flex items-center justify-center gap-2">
                                <img
                                    src="/images/gas%20safe%20logo%20mega.png"
                                    alt="Gas Safe Register"
                                    className="h-6 w-auto object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/511-5113277-gas-safe-register-logo-symbol-gas-safe-logo.png";
                                    }}
                                />
                                <div className="min-w-0 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-600 font-semibold">
                                        Gas Safe Registered
                                        <button
                                            type="button"
                                            aria-label="Gas Safe verification details"
                                            onClick={() =>
                                                setShowGasSafeInfo(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700"
                                        >
                                            <FiInfo className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                                </div>

                                <div
                                    className={`quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-center text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${
                                        showGasSafeInfo
                                            ? "opacity-100"
                                            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                                    }`}
                                >
                                    Verify our registration on the official Gas Safe Register using business registration number <span className="font-semibold text-slate-800">636354</span>.{" "}
                                    <a
                                        href="https://www.gassaferegister.co.uk/find-an-engineer-or-check-the-register/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2"
                                    >
                                        Check the register
                                    </a>
                                    .
                                </div>
                            </div>

                            <div className="relative rounded-2xl bg-white/75 p-3 ring-1 ring-slate-100 group">
                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Estimated install time
                                    <button
                                        type="button"
                                        aria-label="Estimated install time details"
                                        onClick={() =>
                                            setShowInstallTimeInfo(
                                                (prev) => !prev
                                            )
                                        }
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700"
                                    >
                                        <FiInfo className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <FiClock className="text-primary" />
                                    1 day typical
                                </div>

                                <div
                                    className={`quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${
                                        showInstallTimeInfo
                                            ? "opacity-100"
                                            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                                    }`}
                                >
                                    A standard boiler replacement is usually completed in one day. More complex installations, system upgrades, or additional heating works may require extra time.
                                </div>
                            </div>

                            <div className="relative rounded-2xl bg-gradient-to-r from-white/90 to-emerald-50 p-3 ring-1 ring-emerald-100 group">
                                <div className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold">
                                    Delivery priority
                                </div>
                                <div className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
                                                    Next day installation when ordered before 4pm
                                </div>
                                <button
                                    type="button"
                                    aria-label="Delivery priority terms"
                                    onClick={() =>
                                        setShowNextDayInfo((prev) => !prev)
                                    }
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                                >
                                    <FiInfo className="h-3.5 w-3.5" />
                                    See terms
                                </button>

                                <div
                                    className={`quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${
                                        showNextDayInfo
                                            ? "opacity-100"
                                            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                                    }`}
                                >
                                    Next-day order slots apply to standard, in-stock products confirmed and paid before 4:00pm Monday to Friday. Subject to final survey checks, engineer availability, postcode coverage, and supplier cut-off times. Excludes weekends, bank holidays, special-order items, and complex upgrade works. Installation dates may be adjusted for safety, access, weather, or third-party supply delays.
                                    <a
                                        href="/terms-conditions#next-day"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block font-semibold text-emerald-700 underline underline-offset-2"
                                    >
                                        See full next-day installation terms
                                    </a>
                                </div>
                            </div>

                            <div className="relative rounded-2xl bg-white/75 p-3 ring-1 ring-slate-100 group">
                                <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold leading-snug">
                                    Warranty & workmanship cover
                                    <button
                                        type="button"
                                        aria-label="Warranty cover details"
                                        onClick={() =>
                                            setShowWarrantyInfo((prev) => !prev)
                                        }
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700"
                                    >
                                        <FiInfo className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div
                                    className={`quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${
                                        showWarrantyInfo
                                            ? "opacity-100"
                                            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                                    }`}
                                >
                                    All packages include at least a 5-year manufacturer-backed warranty. We also provide 12 months workmanship cover to support the quality of our installation and give you added peace of mind.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUOTE CARDS GRID */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-100">
                    <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            Packages
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                            {visibleProducts.length} options available
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">Sort by</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none rounded-full border border-slate-300 bg-white py-2 pl-3 pr-9 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                    {visibleProducts.map((product, index) => (
                        <button
                            key={`switch-${product.id || index}`}
                            type="button"
                            onClick={() => scrollToProductCard(index)}
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                activeCardIndex === index
                                    ? "border-primary/30 bg-primary/10 text-primary"
                                    : "border-slate-200 bg-white text-slate-700"
                            }`}
                        >
                            {getTierLabel(index) || `Option ${index + 1}`}
                        </button>
                    ))}
                </div>

                <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-slate-100 lg:hidden">
                    <button
                        type="button"
                        onClick={() => scrollToProductCard(Math.max(0, activeCardIndex - 1))}
                        disabled={activeCardIndex <= 0}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <span className="-ml-0.5">‹</span>
                        Prev
                    </button>

                    <div className="text-center">
                        <div className="text-sm font-semibold text-slate-900 tracking-wide">
                            {visibleProducts.length ? `${activeCardIndex + 1} / ${visibleProducts.length}` : "0 / 0"}
                        </div>
                        <div className="text-[11px] text-slate-500">Swipe or tap next</div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            scrollToProductCard(
                                Math.min(visibleProducts.length - 1, activeCardIndex + 1)
                            )
                        }
                        disabled={activeCardIndex >= visibleProducts.length - 1}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <span className="-mr-0.5">›</span>
                    </button>
                </div>

                <div
                    ref={mobileCarouselRef}
                    onScroll={updateActiveCardFromScroll}
                    className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible"
                >
                {visibleProducts.map((product, index) => {
                    const finalPrice = calculatePrice(product);
                    const tierLabel = getTierLabel(index);
                    const confidenceLine = getConfidenceLine(index);
                    const bestFor = getBestFor(index);
                    const brandLogo = getBrandLogo(product.brand);
                    const cardKey = product.id || index;
                    const remainingIncludes = Array.isArray(product.includes)
                        ? product.includes.slice(2)
                        : [];

                    return (
                        <div
                            key={cardKey}
                            id={`quote-product-card-${index}`}
                            data-card-index={index}
                            className="relative min-w-[88%] snap-center rounded-3xl bg-white/92 shadow-[0_16px_40px_rgba(15,23,42,0.10)] overflow-hidden ring-1 ring-slate-100 transition-all duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.16)] hover:-translate-y-1 sm:min-w-[72%] lg:min-w-0"
                        >
                            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />
                            {/* Header Section */}
                            <div className="h-28 bg-slate-50 relative overflow-hidden">

                                <div className="relative p-6 flex justify-between items-start">
                                    {tierLabel && (
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm ring-1 ring-slate-100">
                                            <span className="text-[14px] font-semibold tracking-wide">
                                                {tierLabel}
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-right">
                                        <span className="text-[14px] font-bold uppercase tracking-wider text-slate-600">
                                            {product.kw} kW
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="flex justify-center -mt-16 relative z-10 px-6">
                                <div className="relative">
                                    <div className="absolute inset-10 bg-gradient-to-r from-primary/25 to-secondary/20 blur-2xl" />
                                    <img
                                        // Use the first image from API or fallback
                                        src={product.images?.[0]}
                                        alt={`${product.brand} ${product.model}`}
                                        className="h-44 object-contain drop-shadow-2xl"
                                        onError={(e) => {
                                            e.target.src =
                                                "/images/ideal-20logic.png";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="px-7 pb-7">
                                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    {product.brand}
                                </p>

                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-dark">
                                        {product.model}{" "}
                                        <span className="text-lg font-bold uppercase tracking-wider text-dark/70">
                                            {product.kw}kW
                                        </span>
                                    </h3>
                                </div>

                                {brandLogo && (
                                    <div className="mt-3 rounded-lg bg-white px-3 py-2 inline-flex items-center ring-1 ring-slate-100">
                                        <img
                                            src={brandLogo}
                                            alt={`${product.brand} logo`}
                                            className="h-5 w-auto object-contain"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const fallback = e.currentTarget.nextElementSibling;
                                                if (fallback) fallback.style.display = "inline";
                                            }}
                                        />
                                        <span
                                            className="hidden text-xs font-semibold text-slate-600"
                                            style={{ display: "none" }}
                                        >
                                            {product.brand}
                                        </span>
                                    </div>
                                )}

                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                    {confidenceLine}
                                </p>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                            Best for
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-slate-800">
                                            {bestFor}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                            Warranty cover
                                        </div>
                                        <div className="mt-1 text-sm font-semibold text-slate-800">
                                            {product.warrantyYears} years included
                                        </div>
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="mt-5 flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                        <FiShield className="text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-dark">
                                            {product.warrantyYears} Year
                                            Warranty
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Included in price
                                        </div>
                                    </div>
                                </div>

                                {Array.isArray(product.includes) &&
                                    product.includes.length > 0 && (
                                        <div className="relative mt-4 flex flex-wrap items-center gap-2">
                                            {product.includes
                                                .slice(0, 2)
                                                .map((item, i) => (
                                                    <span
                                                        key={`${product.id}-inc-${i}`}
                                                        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                                                    >
                                                        <FiCheck className="h-3.5 w-3.5 text-primary" />
                                                        <span className="truncate max-w-[220px]">
                                                            {item}
                                                        </span>
                                                    </span>
                                                ))}

                                            {remainingIncludes.length > 0 && (
                                                <div className="relative group/moreIncludes">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                                                    >
                                                        +{remainingIncludes.length} more included
                                                        <FiChevronDown
                                                            className="h-3.5 w-3.5 transition-transform group-hover/moreIncludes:rotate-180 group-focus-within/moreIncludes:rotate-180"
                                                        />
                                                    </button>

                                                    <div className="quote-solid-popover pointer-events-none absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl opacity-0 translate-y-1 transition-all duration-200 group-hover/moreIncludes:pointer-events-auto group-hover/moreIncludes:opacity-100 group-hover/moreIncludes:translate-y-0 group-focus-within/moreIncludes:pointer-events-auto group-focus-within/moreIncludes:opacity-100 group-focus-within/moreIncludes:translate-y-0">
                                                        <div className="space-y-1.5">
                                                            {remainingIncludes.map(
                                                                (
                                                                    item,
                                                                    moreIndex
                                                                ) => (
                                                                    <div
                                                                        key={`${cardKey}-more-${moreIndex}`}
                                                                        className="flex items-start gap-2 text-xs text-slate-700"
                                                                    >
                                                                        <FiCheck className="mt-0.5 h-3.5 w-3.5 text-primary flex-shrink-0" />
                                                                        <span>
                                                                            {
                                                                                item
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Expert Opinion (Generic or from notes if available) */}
                                {Array.isArray(product.notes) &&
                                    product.notes.length > 0 && (
                                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                                            <div className="flex gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                    <FiInfo className="text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-dark">
                                                        Expert Opinion
                                                    </div>
                                                    <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-slate-700 leading-relaxed">
                                                        {product.notes &&
                                                            product.notes.map(
                                                                (
                                                                    note,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {note}
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Pricing Section */}
                                <div className="mt-6 rounded-2xl bg-slate-50 text-slate-900 p-5 relative overflow-hidden ring-1 ring-slate-100">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-16 translate-x-16" />

                                    {/* 'What's Included' Button */}
                                    <div className="absolute top-2 right-2 group z-30">
                                        <button
                                            onClick={() =>
                                                setActiveQuote({
                                                    ...product,
                                                    price: finalPrice,
                                                    selectedExtras,
                                                    addOnsTotal: Number(
                                                        product?.pricing
                                                            ?.addOnsTotal || 0
                                                    ),
                                                })
                                            }
                                            aria-label="What's included in my installation"
                                            className="h-8 w-8 rounded-full bg-white cursor-pointer hover:bg-emerald-50 border border-emerald-200 flex items-center justify-center transition"
                                        >
                                            <AiOutlineQuestion className="h-3 w-3 text-emerald-700 transition-transform group-hover:scale-110" />
                                        </button>
                                        <div className="quote-solid-popover pointer-events-none absolute right-0 mt-2 w-max max-w-[220px] rounded-lg bg-white px-3 py-1.5 text-xs text-dark opacity-0 translate-y-1 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                            What's included in my installation?
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-600 flex items-center gap-2">
                                            Total Price
                                        </div>

                                        <div className="flex justify-between items-end mt-3">
                                            {/* Full Price */}
                                            <div className="flex items-end gap-2">
                                                <div className="text-3xl font-bold tracking-tight">
                                                    £
                                                    {finalPrice.toLocaleString()}
                                                </div>
                                                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                                                    (inc VAT)
                                                </div>
                                            </div>

                                        </div>
                                        <div className="mt-2 text-xs text-slate-600">
                                            Includes labour, materials, commissioning & certification
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={() =>{
                                            setProductDetails(product);
                                            setDetailsQuote({
                                                id: product.id,

                                                // title
                                                brand: product.brand,
                                                model: product.model,

                                                productImages: product.images,
                                                kw: product.kw,
                                                warrantyYears:
                                                    product.warrantyYears,

                                                // badge / tier
                                                tier: tierLabel,
                                                badge: tierLabel
                                                    ? "bg-primary text-white"
                                                    : "",

                                                // pricing (VERY IMPORTANT)
                                                price: finalPrice,

                                                // extras
                                                notes: product.notes,
                                                includes: product.includes,
                                                selectedExtras,
                                                addOnsTotal: Number(
                                                    product?.pricing
                                                        ?.addOnsTotal || 0
                                                ),
                                            })
                                        }

                                        }
                                        className="w-full rounded-xl cursor-pointer bg-primary/10 hover:bg-primary/15 active:scale-[0.99] py-3.5 text-primary font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        See Full Specification
                                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            router.post(
                                                "/book/quote/new/install",
                                                withCsrf({
                                                    boiler_id: product.id,
                                                    brand: product.brand,
                                                    model: product.model,
                                                    includes:
                                                        product.includes ?? [],
                                                    images:
                                                        product.images ?? [],
                                                    kw: product.kw,
                                                    warrantyYears:
                                                        product.warrantyYears,
                                                    price: finalPrice,
                                                    power: selectedPower,
                                                    answers: answers,
                                                })
                                            )
                                        }
                                        className="w-full rounded-2xl cursor-pointer hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 active:scale-[0.99] text-white py-3.5 font-semibold shadow-lg transition-all duration-300 group"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, #fb923c 0%, #f97316 100%)",
                                            boxShadow:
                                                "0 20px 50px rgba(249, 115, 22, 0.30)",
                                        }}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            Continue With This Package
                                            <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="block text-[11px] font-medium text-white/85 mt-0.5">
                                            Secure checkout • takes ~2 minutes
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>

            {/* WHAT'S INCLUDED SIDEBAR */}
            {activeQuote && (
                <>
                    <style>{`
                        .question-include-sidebar {
                            background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                            border-left: 1px solid rgba(255, 255, 255, 0.32) !important;
                        }

                        .question-include-sidebar .sidebar-surface {
                            background: rgba(0, 143, 182, 0.92) !important;
                            border-color: rgba(255, 255, 255, 0.32) !important;
                        }

                        .question-include-sidebar,
                        .question-include-sidebar h1,
                        .question-include-sidebar h2,
                        .question-include-sidebar h3,
                        .question-include-sidebar p,
                        .question-include-sidebar span,
                        .question-include-sidebar div,
                        .question-include-sidebar [class*="text-"] {
                            color: #ffffff !important;
                            -webkit-text-fill-color: #ffffff !important;
                        }

                        .question-include-sidebar [class*="border-slate"],
                        .question-include-sidebar [class*="border-gray"] {
                            border-color: rgba(255, 255, 255, 0.30) !important;
                        }

                        .question-include-sidebar [class*="bg-white"],
                        .question-include-sidebar [class*="bg-slate"],
                        .question-include-sidebar [class*="bg-gray"] {
                            background-color: rgba(255, 255, 255, 0.10) !important;
                            background-image: none !important;
                        }

                        .question-include-sidebar .question-sidebar-close {
                            background: rgba(255, 255, 255, 0.14) !important;
                            border-color: rgba(255, 255, 255, 0.42) !important;
                            color: #ffffff !important;
                            -webkit-text-fill-color: #ffffff !important;
                        }
                    `}</style>
                    <div
                        onClick={() => setActiveQuote(null)}
                        className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-40 animate-fadeIn"
                    />

                    <aside className="question-include-sidebar quote-solid-sidebar fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-2xl animate-slideFromRight">
                        <div className="h-full flex flex-col">
                            {/* Sidebar Header */}
                            <div className="sidebar-surface p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                                <div>
                                    <h2 className="text-xl font-bold text-dark">
                                        Full package breakdown
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Everything included in your {activeQuote.brand}{" "}
                                        {activeQuote.model} installation
                                    </p>
                                    {getBrandLogo(activeQuote.brand) && (
                                        <div className="sidebar-surface mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2">
                                            <img
                                                src={getBrandLogo(activeQuote.brand)}
                                                alt={`${activeQuote.brand} logo`}
                                                className="h-5 w-auto object-contain"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    const fallback = e.currentTarget.nextElementSibling;
                                                    if (fallback) fallback.style.display = "inline";
                                                }}
                                            />
                                            <span
                                                className="hidden text-xs font-semibold text-slate-600"
                                                style={{ display: "none" }}
                                            >
                                                {activeQuote.brand}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveQuote(null)}
                                    className="question-sidebar-close h-10 sm:h-10 w-auto min-w-[2.75rem] px-3 rounded-xl cursor-pointer border-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <FiX className="text-white" />
                                    <span className="text-[11px] font-semibold text-white sm:hidden">Close</span>
                                </button>
                            </div>

                            {/* Sidebar List Content */}
                            <div className="flex-1 overflow-y-auto p-6 ">
                                <div className="space-y-4">
                                    {/* Map over the 'includes' array from the API */}
                                    {activeQuote.includes?.map(
                                        (itemString, i) => (
                                            <div
                                                key={i}
                                                className="sidebar-surface flex gap-4 items-start p-4 rounded-2xl border border-slate-100 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                            >
                                                <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors font-bold">
                                                    <FiCheck size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-dark pt-3 leading-snug flex items-center gap-1.5">
                                                        <span>{itemString}</span>
                                                        {isCompatibilityDependentItem(
                                                            itemString
                                                        ) && (
                                                            <span className="relative inline-flex items-center group">
                                                                <button
                                                                    type="button"
                                                                    aria-label={compatibilityTooltipText}
                                                                    onClick={() =>
                                                                        setOpenCompatibilityTip(
                                                                            openCompatibilityTip ===
                                                                                i
                                                                                ? null
                                                                                : i
                                                                        )
                                                                    }
                                                                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500"
                                                                >
                                                                    <FiInfo className="h-3 w-3" />
                                                                </button>
                                                                <div
                                                                    className={`quote-solid-popover absolute right-0 top-[calc(100%+0.35rem)] z-30 w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-lg transition-opacity ${
                                                                        openCompatibilityTip ===
                                                                        i
                                                                            ? "opacity-100"
                                                                            : "pointer-events-none opacity-0 group-hover:opacity-100"
                                                                    }`}
                                                                >
                                                                    {
                                                                        compatibilityTooltipText
                                                                    }
                                                                </div>
                                                            </span>
                                                        )}
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {Array.isArray(activeQuote.selectedExtras) &&
                                    activeQuote.selectedExtras.length > 0 && (
                                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                Carried-over extras from your answers
                                            </h3>
                                            <div className="mt-3 space-y-2.5">
                                                {activeQuote.selectedExtras.map(
                                                    (extra, index) => (
                                                        <div
                                                            key={`active-extra-${index}`}
                                                            className="flex items-start justify-between gap-3 text-sm"
                                                        >
                                                            <div>
                                                                <div className="font-medium text-slate-800">
                                                                    {extra.label}
                                                                </div>
                                                                {extra.value && (
                                                                    <div className="text-xs text-slate-500">
                                                                        {
                                                                            extra.value
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                                                                {extra.totalText ||
                                                                    "Included"}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Price Summary in Sidebar */}
                                <div className="sidebar-surface mt-8 p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 text-slate-900">
                                    <h3 className="font-bold text-lg mb-4">
                                        Price summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-sm text-slate-600">
                                                Boiler + installation
                                            </span>
                                            <span className="font-semibold">
                                                £
                                                {activeQuote.price?.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-sm text-slate-600">
                                                Warranty (
                                                {activeQuote.warrantyYears}{" "}
                                                Years)
                                            </span>
                                            <span className="text-primary">
                                                Included
                                            </span>
                                        </div>
                                        {Number(activeQuote.addOnsTotal || 0) >
                                            0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                                <span className="text-sm text-slate-600">
                                                    Selected extras
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    £
                                                    {Number(
                                                        activeQuote.addOnsTotal
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-bold">
                                                Total (inc VAT)
                                            </span>
                                            <span className="text-2xl font-bold">
                                                £
                                                {activeQuote.price?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* DETAIL SIDEBAR (Previous Component) */}
            {detailsQuote && (
                <DetailsQuoteSidebar
                    detailsQuote={detailsQuote}
                    onClose={() => setDetailsQuote(null)}
                    selectedPower={selectedPower}
                    answers={answers}
                    product={productDetails}
                />
            )}
        </div>
    );
}
