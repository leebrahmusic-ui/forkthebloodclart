import {
    FiX,
    FiCamera,
    FiCalendar,
    FiCheck,
    FiClock,
    FiInfo,
    FiArrowRight,
    FiShield,
    FiCheckCircle,
    FiFileText,
    FiMapPin,
} from "react-icons/fi";
import ProductTabs from "./Tabs";
import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

export default function DetailsQuoteSidebar({
    detailsQuote,
    onClose,
    answers,
    product,
    selectedPower,
}) {
    if (!detailsQuote) return null;

    const isCompatibilityDependentItem = (label = "") => {
        const normalized = String(label).toLowerCase();
        return ["shock arrestor", "scale reducer", "magnetic filter"].some(
            (term) => normalized.includes(term)
        );
    };

    const compatibilityTooltipText =
        "Installed subject to site suitability and compatibility with your existing system configuration.";

    const scrollContainerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const { body, documentElement } = document;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlOverflow = documentElement.style.overflow;
        const prevBodyPaddingRight = body.style.paddingRight;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        body.style.overflow = "hidden";
        documentElement.style.overflow = "hidden";

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = prevBodyOverflow;
            documentElement.style.overflow = prevHtmlOverflow;
            body.style.paddingRight = prevBodyPaddingRight;
        };
    }, []);

    const {
        brand = "",
        model = "",
        tier = "",
        kw = "",
        warrantyYears = "",
        includes = [],
        price = 0,
        productImages = [],
        selectedExtras = [],
        addOnsTotal = 0,
    } = detailsQuote;

    const safePrice = Number(price) || 0;

    const getCsrfToken = () => {
        if (typeof document === "undefined") return null;
        return document.head.querySelector('meta[name="csrf-token"]')?.content;
    };

    const withCsrf = (payload) => {
        const token = getCsrfToken();
        return token ? { ...payload, _token: token } : payload;
    };

    const calculatePrice = (productToPrice) => {
        if (productToPrice?.pricing?.total) return productToPrice.pricing.total;

        const base = parseFloat(productToPrice?.pricing?.base || 0);
        const margin = parseFloat(productToPrice?.pricing?.marginApplied || 0);
        const addons = parseFloat(productToPrice?.pricing?.addOnsTotal || 0);
        return base + margin + addons;
    };

    const finalPrice = calculatePrice(product);

    const carouselImages = Array.isArray(productImages)
        ? productImages
        : productImages
        ? [productImages]
        : ["/images/ideal-20logic.png"];

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

    return (
        <>
            <style>{`
                .spec-sheet-modal,
                .spec-sheet-modal * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                .spec-sheet-modal {
                    background-color: #00abdb !important;
                }

                .spec-sheet-overlay {
                    background: rgba(2, 6, 23, 0.65) !important;
                }

                /* Only the pop-up bar (sticky top header) gets the 00ABDB look */
                .spec-sheet-modal .sticky.top-0 {
                    background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                    border-bottom-color: rgba(255, 255, 255, 0.32) !important;
                }

                /* Keep the entire sidebar solid (not transparent) */
                .spec-sheet-modal [class*="bg-white"],
                .spec-sheet-modal [class*="bg-white/"],
                .spec-sheet-modal [class*="bg-slate-50"],
                .spec-sheet-modal [class*="bg-slate-50/"],
                .spec-sheet-modal [class*="bg-slate-100"],
                .spec-sheet-modal [class*="bg-slate-100/"],
                .spec-sheet-modal [class*="bg-slate-200"],
                .spec-sheet-modal [class*="bg-slate-200/"] {
                    background-color: #0098c4 !important;
                    background-image: none !important;
                }

                .spec-sheet-modal [class*="border-"] {
                    border-color: rgba(255, 255, 255, 0.35) !important;
                }

                .spec-sheet-modal [class*="text-slate-900"],
                .spec-sheet-modal [class*="text-slate-800"],
                .spec-sheet-modal [class*="text-slate-700"],
                .spec-sheet-modal [class*="text-slate-600"],
                .spec-sheet-modal [class*="text-slate-500"],
                .spec-sheet-modal [class*="text-dark"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }


                .spec-sheet-modal .cta-book-now {
                    background: linear-gradient(90deg, #fb923c 0%, #f97316 100%) !important;
                    border-color: #fdba74 !important;
                    color: #7c2d12 !important;
                    opacity: 1 !important;
                    box-shadow: 0 18px 46px rgba(249, 115, 22, 0.42) !important;
                }

                .spec-sheet-modal .cta-book-now:hover {
                    background: linear-gradient(90deg, #f97316 0%, #ea580c 100%) !important;
                    box-shadow: 0 24px 58px rgba(249, 115, 22, 0.56) !important;
                }

                .spec-sheet-modal .cta-book-now * {
                    color: #7c2d12 !important;
                    -webkit-text-fill-color: #7c2d12 !important;
                }

                .spec-sheet-modal .cta-book-now .cta-book-now-icon,
                .spec-sheet-modal .cta-book-now .cta-book-now-icon * {
                    color: #ea580c !important;
                    -webkit-text-fill-color: #ea580c !important;
                }
                .spec-sheet-modal .sticky.top-0 h2,
                .spec-sheet-modal .sticky.top-0 span,
                .spec-sheet-modal .sticky.top-0 p,
                .spec-sheet-modal .sticky.top-0 svg,
                .spec-sheet-modal .sticky.top-0 [class*="text-"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .spec-sheet-modal .sticky.top-0 button,
                .spec-sheet-modal .sticky.top-0 button * {
                    background-color: rgba(255, 255, 255, 0.14) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }
            `}</style>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/70 z-40 spec-sheet-overlay"
            />

            <aside
                className="fixed right-0 top-0 h-full w-full overflow-y-auto overscroll-contain [touch-action:pan-y] lg:w-[95vw] xl:w-[1200px] bg-slate-50 z-50 border-l border-slate-200 shadow-2xl animate-slideFromRight isolate spec-sheet-modal"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                <div className="h-full flex flex-col">
                    <div className="sticky top-0 z-30 bg-slate-50 border-b border-slate-200">
                        <div className="px-8 py-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Complete package breakdown
                                </h2>
                                {tier && (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold">
                                        {tier}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="h-9 w-9 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <FiX className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        <div className="hidden lg:block w-[360px] p-4 lg:p-6">
                            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                                <div className="px-6 py-4 border-b border-slate-200 flex justify-between bg-white">
                                    <div className="flex gap-3 items-center">
                                        <FiCamera className="text-slate-700" />
                                        <h3 className="text-slate-900 font-semibold">
                                            Package overview
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <img
                                        src={carouselImages[currentImageIndex]}
                                        alt={`${brand} ${model}`}
                                        className="mx-auto max-h-[300px] object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/images/ideal-20logic.png";
                                        }}
                                    />

                                    {carouselImages.length > 1 && (
                                        <div className="mt-5 grid grid-cols-4 gap-2">
                                            {carouselImages
                                                .slice(0, 4)
                                                .map((image, idx) => (
                                                    <button
                                                        type="button"
                                                        key={`${image}-${idx}`}
                                                        onClick={() =>
                                                            setCurrentImageIndex(
                                                                idx
                                                            )
                                                        }
                                                        className={`h-16 rounded-lg border overflow-hidden transition-all ${
                                                            currentImageIndex ===
                                                            idx
                                                                ? "border-primary ring-2 ring-primary/20"
                                                                : "border-slate-200 hover:border-slate-300"
                                                        }`}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${brand} ${model} ${idx + 1}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "/images/ideal-20logic.png";
                                                            }}
                                                        />
                                                    </button>
                                                ))}
                                        </div>
                                    )}

                                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                                            Why homeowners choose this package
                                        </div>
                                        <div className="space-y-2 text-sm text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <FiCheck className="text-emerald-600" />
                                                Clear scope, fixed price, no hidden extras
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiCheck className="text-emerald-600" />
                                                Installed and commissioned by Gas Safe engineers
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiCheck className="text-emerald-600" />
                                                Handover and warranty documentation included
                                            </div>
                                        </div>
                                    </div>

                                    {getBrandLogo(brand) && (
                                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                                                Manufacturer
                                            </div>
                                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 flex items-center justify-center">
                                                <img
                                                    src={getBrandLogo(brand)}
                                                    alt={`${brand} logo`}
                                                    className="h-7 object-contain"
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
                                                    {brand}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth relative thin-scroll"
                        >
                            <div className="space-y-3 mb-6">
                                <div className="lg:hidden rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                                    <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                        <FiCamera className="text-slate-700" />
                                        <h3 className="text-slate-900 font-semibold text-sm">
                                            Package overview
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <img
                                            src={carouselImages[currentImageIndex]}
                                            alt={`${brand} ${model}`}
                                            className="mx-auto max-h-[240px] object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/images/ideal-20logic.png";
                                            }}
                                        />

                                        {carouselImages.length > 1 && (
                                            <div className="mt-4 grid grid-cols-4 gap-2">
                                                {carouselImages
                                                    .slice(0, 4)
                                                    .map((image, idx) => (
                                                        <button
                                                            type="button"
                                                            key={`mobile-${image}-${idx}`}
                                                            onClick={() =>
                                                                setCurrentImageIndex(
                                                                    idx
                                                                )
                                                            }
                                                            className={`h-14 rounded-lg border overflow-hidden transition-all ${
                                                                currentImageIndex ===
                                                                idx
                                                                    ? "border-primary ring-2 ring-primary/20"
                                                                    : "border-slate-200 hover:border-slate-300"
                                                            }`}
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`${brand} ${model} ${idx + 1}`}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.src =
                                                                        "/images/ideal-20logic.png";
                                                                }}
                                                            />
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                                    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] lg:items-center gap-6 lg:gap-8">
                                        <div className="lg:border-r border-slate-200 lg:pr-8">
                                            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                                                {model}
                                            </p>
                                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 break-words leading-tight">
                                                {brand}
                                            </h1>
                                            {getBrandLogo(brand) && (
                                                <div className="mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2">
                                                    <img
                                                        src={getBrandLogo(brand)}
                                                        alt={`${brand} logo`}
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
                                                        {brand}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="mt-3 text-sm text-slate-600 max-w-xl leading-relaxed">
                                                Expertly matched to your survey details for strong comfort, efficient performance,
                                                and a smooth installation day.
                                            </p>
                                        </div>
                                        <div className="text-left lg:text-right lg:min-w-[200px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                                                Total Package
                                            </div>
                                            <div className="text-4xl lg:text-5xl font-bold text-slate-900">
                                                £{safePrice.toLocaleString()}
                                            </div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500 mt-2">
                                                (inc VAT)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                                        <FiShield className="text-emerald-700" />
                                        Gas Safe installation
                                    </div>
                                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs font-semibold text-sky-900 flex items-center gap-2">
                                        <FiCheckCircle className="text-sky-700" />
                                        Fixed quote with full visibility
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 flex items-center gap-2">
                                        <FiFileText className="text-slate-700" />
                                        Written itemised scope
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                            Boiler output
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-slate-900">
                                            {kw}kW
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                            Warranty
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-slate-900">
                                            {warrantyYears} years
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                            Typical install
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-slate-900 flex items-center gap-2">
                                            <FiClock className="text-primary" />
                                            1 day
                                        </div>
                                    </div>
                                </div>

                                {selectedExtras.length > 0 && (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-base font-bold text-slate-900">
                                                Your selected extras
                                            </h3>
                                            <div className="text-sm font-semibold text-slate-700">
                                                Add-ons total: £
                                                {Number(addOnsTotal || 0).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {selectedExtras.map((extra, idx) => (
                                                <div
                                                    key={`${extra.label}-${idx}`}
                                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                                                >
                                                    <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                                        <span>{extra.label}</span>
                                                        {isCompatibilityDependentItem(
                                                            extra.label
                                                        ) && (
                                                            <span
                                                                title={compatibilityTooltipText}
                                                                aria-label={compatibilityTooltipText}
                                                                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500"
                                                            >
                                                                <FiInfo className="h-3 w-3" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-700 text-right">
                                                        {extra.totalText || extra.value || "Included"}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Your selected extras above are carried directly into checkout.
                                        </p>
                                    </div>
                                )}

                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                                    <h3 className="text-base font-bold text-slate-900 mb-3">
                                        What happens after you continue
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                                <FiMapPin className="text-primary" />
                                                1. Confirm details
                                            </div>
                                            Review address, date, and selected options.
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                                <FiFileText className="text-primary" />
                                                2. Secure checkout
                                            </div>
                                            Complete payment through trusted hosted checkout.
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                                <FiCalendar className="text-primary" />
                                                3. Installation confirmed
                                            </div>
                                            Receive confirmation and appointment details.
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            "/book/quote/new/install",
                                            withCsrf({
                                                boiler_id: product.id,
                                                brand: product.brand,
                                                model: product.model,
                                                includes: product.includes ?? [],
                                                images: product.images ?? [],
                                                kw: product.kw,
                                                warrantyYears:
                                                    product.warrantyYears,
                                                price: finalPrice,
                                                power: selectedPower,
                                                answers: answers,
                                            })
                                        )
                                    }
                                    className="group relative cursor-pointer w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 cta-book-now"
                                >
                                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white shadow-sm shrink-0 cta-book-now-icon">
                                        <FiCalendar className="text-2xl" />
                                    </div>
                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                        <span className="text-xs text-orange-950/85 font-bold uppercase tracking-wider">
                                            Ready to book
                                        </span>
                                        <span className="text-orange-950 font-extrabold text-xl leading-tight">
                                            BOOK THIS PACKAGE NOW
                                        </span>
                                        <span className="text-[12px] text-orange-950/80 font-semibold mt-1">
                                            See live engineer availability next
                                        </span>
                                    </div>
                                    <FiArrowRight className="text-orange-950 group-hover:translate-x-1 transition-transform text-2xl shrink-0" />
                                </button>
                            </div>

                            <ProductTabs
                                containerRef={scrollContainerRef}
                                notes={detailsQuote.notes}
                                includes={detailsQuote.includes}
                                kw={detailsQuote.kw}
                                warranty={detailsQuote.warrantyYears}
                                brand={detailsQuote.brand}
                                selectedExtras={detailsQuote.selectedExtras}
                                addOnsTotal={detailsQuote.addOnsTotal}
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
