import {
    FiX,
    FiCamera,
    FiCalendar,
    FiSave,
    FiArrowRight,
} from "react-icons/fi";
import ProductTabs from "./Tabs";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";



export default function DetailsQuoteSidebar({ detailsQuote, onClose, answers, product, selectedPower }) {
    if (!detailsQuote) return null;

    // 1. We create the reference here
    const scrollContainerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        brand = "",
        model = "",
        tier = "",
        kw = "",
        warrantyYears = "",
        includes = [],
        badge = "bg-slate-200 text-dark",
        price = 0,
        productImages = [],
    } = detailsQuote;

    console.log("details page include", detailsQuote);

    const safePrice = Number(price) || 0;

    // Calculate Price: Handle nulls from your screenshot (base + margin + addons)
    const calculatePrice = (product) => {
        console.log("Calculating price for product:", product);
        if (product.pricing?.total) return product.pricing.total;

        const base = parseFloat(product.pricing?.base || 0);
        const margin = parseFloat(product.pricing?.marginApplied || 0);
        const addons = parseFloat(product.pricing?.addOnsTotal || 0);
        return base + margin + addons;
    };

    const finalPrice = calculatePrice(product);

    const calculateMonthlyFrom = (totalPrice) => {
        if (!totalPrice || Number.isNaN(Number(totalPrice))) return null;
        const principal = Number(totalPrice);
        const annualRate = 0.099;
        const monthlyRate = annualRate / 12;
        const months = 48;
        const monthly =
            (principal * monthlyRate) /
            (1 - Math.pow(1 + monthlyRate, -months));
        return Math.ceil(monthly);
    };

    const monthlyFrom = calculateMonthlyFrom(finalPrice);

    const carouselImages = Array.isArray(productImages)
        ? productImages
        : productImages
        ? [productImages]
        : ["/images/ideal-20logic.png"];


    console.log("Detailed Quote", {
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

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <aside className="fixed right-0 top-0 h-full w-full overflow-y-auto lg:w-[1000px] bg-white z-50 border-l border-slate-200 shadow-2xl animate-slideFromRight">
                <div className="h-full flex flex-col">
                    {/* HEADER */}
                    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
                        <div className="px-8 py-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Full breakdown
                                </h2>
                                {tier && (
                                    <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
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

                    {/* BODY */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* LEFT: CAROUSEL */}
                        <div className="hidden lg:block w-[400px] p-6">
                            <div className="rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="px-6 py-4 border-b border-slate-200 flex justify-between">
                                    <div className="flex gap-3 items-center">
                                        <FiCamera className="text-slate-700" />
                                        <h3 className="text-slate-900 font-semibold">
                                            Visual overview
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
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT */}
                        {/* 2. CHANGE: Added 'ref' here and 'scroll-smooth'. This is the main scroll area. */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-6 scroll-smooth relative thin-scroll"
                        >
                            {/* STACKED CARD LAYOUT */}
                            <div className="space-y-4 mb-8">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] lg:items-center gap-6 lg:gap-8">
                                        <div className="lg:border-r border-slate-200 lg:pr-8">
                                            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                                                {model}
                                            </p>
                                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 break-words leading-tight">
                                                {brand}
                                            </h1>
                                        </div>
                                        <div className="text-left lg:text-right lg:min-w-[200px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                                                Total Package
                                            </div>
                                            <div className="text-4xl lg:text-5xl font-bold text-slate-900">
                                                £{safePrice.toLocaleString()}
                                            </div>
                                            {monthlyFrom && (
                                                <div className="mt-2 text-sm text-slate-700">
                                                    Finance from £{monthlyFrom}/mo
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                            router.post(
                                                "/book/quote/new/install",
                                                {
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
                                                }
                                            )
                                        }
                                    className="group relative cursor-pointer w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-900 hover:bg-slate-800 transition-all duration-300"
                                >
                                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm shrink-0">
                                        <FiCalendar className="text-2xl" />
                                    </div>
                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                        <span className="text-xs text-white/80 font-medium uppercase tracking-wider">
                                            Ready to book
                                        </span>
                                        <span className="text-white font-bold text-xl">
                                            Book now
                                        </span>
                                    </div>
                                    <FiArrowRight className="text-white group-hover:translate-x-1 transition-transform text-2xl shrink-0" />
                                </button>
                            </div>

                            {/* TABS */}
                            {/* 3. CHANGE: Removed the extra wrapper <div> that was causing the scroll issue. Passed ref directly. */}
                            <ProductTabs
                                containerRef={scrollContainerRef}
                                notes={detailsQuote.notes}
                                includes={detailsQuote.includes}
                                kw={detailsQuote.kw}
                                warranty={detailsQuote.warrantyYears}
                                brand={detailsQuote.brand}
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
