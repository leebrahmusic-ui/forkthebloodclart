import { useEffect, useState } from "react";
import {
    FiInfo,
    FiX,
    FiChevronRight,
    FiShield,
    FiChevronDown,
    FiCheck,
} from "react-icons/fi";
import { AiOutlineQuestion } from "react-icons/ai";
import { router } from "@inertiajs/react";
import DetailsQuoteSidebar from "./QuoteResultPage/DetailsQuote";

export default function QuoteResultsPage({ answers }) {
    // 1. Extract products safely from the Inertia props
    const products = answers?.products || [];
    const recommendedProductId = answers?.recommendedProductId;

    const [activeQuote, setActiveQuote] = useState(null);
    const [detailsQuote, setDetailsQuote] = useState(null);
    const [selectedPower, setSelectedPower] = useState("25");
    const [visibleCount, setVisibleCount] = useState(3);

    const [productDetails, setProductDetails] = useState({});

    // --- Helpers for Dynamic Data ---

    // Generate gradients based on index so api data doesn't need style info
    const getCardStyle = (index) => {
        const styles = [
            {
                gradient: "from-slate-50 to-white",
                accent: "bg-slate-100",
            },
            {
                gradient: "from-blue-50 to-white",
                accent: "bg-blue-100",
            },
            {
                gradient: "from-emerald-50 to-white",
                accent: "bg-emerald-100",
            },
        ];

        return styles[index % styles.length];
    };

    // Calculate Price: Handle nulls from your screenshot (base + margin + addons)
    const calculatePrice = (product) => {
        if (product.pricing?.total) return product.pricing.total;

        const base = parseFloat(product.pricing?.base || 0);
        const margin = parseFloat(product.pricing?.marginApplied || 0);
        const addons = parseFloat(product.pricing?.addOnsTotal || 0);
        return base + margin + addons;
    };

    const getTierLabel = (index) => {
        if (index === 0) return "Budget";
        if (index === 1) return "Best seller";
        if (index === 2) return "Premium";
        return "";
    };

    const calculateMonthlyFrom = (totalPrice) => {
        if (!totalPrice || Number.isNaN(Number(totalPrice))) return null;
        const principal = Number(totalPrice);
        const annualRate = 0.099;
        const monthlyRate = annualRate / 12;
        const months = 120;
        const monthly =
            (principal * monthlyRate) /
            (1 - Math.pow(1 + monthlyRate, -months));
        return Math.ceil(monthly);
    };

    return (
        <div className="min-h-screen bg-light-background px-4 py-12 md:px-6 md:py-16">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-14">
                <div className="relative">
                    <div className="relative ">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                                    Installation packages
                                </div>
                                <h1 className="text-3xl font-bold text-dark">
                                    Your Personalized Quotes
                                </h1>
                                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                                    <span>Gas Safe registered engineers</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Fixed price, no hidden extras</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Warranty included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUOTE CARDS GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.slice(0, visibleCount).map((product, index) => {
                    const style = getCardStyle(index);
                    const finalPrice = calculatePrice(product);
                    const tierLabel = getTierLabel(index);
                    const monthlyFrom = calculateMonthlyFrom(finalPrice);

                    return (
                        <div
                            key={product.id || index}
                            className={`relative rounded-3xl bg-gradient-to-b ${style.gradient} shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-foreground hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300`}
                        >
                            {/* Header Section */}
                            <div
                                className={`h-40 ${style.accent} relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />

                                <div className="relative p-6 flex justify-between items-start">
                                    {tierLabel && (
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-slate-800 shadow-sm border border-slate-200">
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
                            <div className="flex justify-center -mt-28 relative z-10 px-6">
                                <div className="relative">
                                    <div className="absolute inset-10 bg-gradient-to-r from-dark/40 to-transparent blur-2xl" />
                                    <img
                                        // Use the first image from API or fallback
                                        src={product.images?.[0]}
                                        alt={`${product.brand} ${product.model}`}
                                        className="h-60 object-contain drop-shadow-2xl"
                                        onError={(e) => {
                                            e.target.src =
                                                "/images/ideal-20logic.png";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="relative my-7">
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                                <div className="absolute inset-x-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm" />
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

                                {/* Warranty */}
                                <div className="mt-5 flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <FiShield className="text-emerald-600" />
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

                                {/* Expert Opinion (Generic or from notes if available) */}
                                {Array.isArray(product.notes) &&
                                    product.notes.length > 0 && (
                                        <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-4 border border-blue-100">
                                            <div className="flex gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <FiInfo className="text-blue-600" />
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
                                <div className="mt-6 rounded-2xl bg-gradient-to-r from-dark to-dark text-white p-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />

                                    {/* 'What's Included' Button */}
                                    <div className="absolute top-2 right-2 group z-30">
                                        <button
                                            onClick={() =>
                                                setActiveQuote({
                                                    ...product,
                                                    price: finalPrice,
                                                })
                                            }
                                            aria-label="What's included in my installation"
                                            className="h-8 w-8 rounded-full bg-white/10 cursor-pointer hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
                                        >
                                            <AiOutlineQuestion className="h-3 w-3 text-white transition-transform group-hover:scale-110" />
                                        </button>
                                        <div className="pointer-events-none absolute right-0 mt-2 w-max max-w-[220px] rounded-lg bg-white px-3 py-1.5 text-xs text-dark opacity-0 translate-y-1 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                            What's included in my installation?
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-sm opacity-80 flex items-center gap-2">
                                            Total Price
                                        </div>

                                        <div className="flex justify-between items-end mt-3">
                                            {/* Full Price */}
                                            <div>
                                                <div className="text-3xl font-bold tracking-tight">
                                                    £
                                                    {finalPrice.toLocaleString()}
                                                </div>
                                            </div>

                                            {monthlyFrom && (
                                                <div className="text-right">
                                                    <div className="text-xs uppercase tracking-wider text-white/70">
                                                        Finance
                                                    </div>
                                                    <div className="text-lg font-semibold">
                                                        from £{monthlyFrom}/mo
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-white/70">
                                            Includes installation, materials & certification
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
                                            })
                                        }

                                        }
                                        className="w-full rounded-xl border-2 cursor-pointer border-primary/25 hover:border-primary hover:bg-primary/5 py-3.5 text-primary font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        View Full Breakdown
                                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
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
                                        className="w-full rounded-xl cursor-pointer bg-gradient-to-r from-primary/90 to-secondary/80 hover:from-primary hover:to-secondary text-white py-3.5 font-semibold shadow-lg hover:shadow-dark/20 hover:shadow-lg transition-colors duration-300"
                                    >
                                        Select This Boiler
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {products.length > 3 && (
                <div
                    className="max-w-7xl mx-auto mt-12 flex justify-center transition-all duration-300 ease-out
"
                >
                    {visibleCount < products.length ? (
                        <button
                            onClick={() =>
                                setVisibleCount((prev) =>
                                    Math.min(prev + 3, products.length)
                                )
                            }
                            className="px-8 py-3 rounded-xl bg-dark cursor-pointer text-white font-semibold hover:bg-dark transition-all shadow-lg"
                        >
                            View more options
                        </button>
                    ) : (
                        <button
                            onClick={() => setVisibleCount(3)}
                            className="px-8 py-3 rounded-xl bg-slate-200 cursor-pointer text-dark font-semibold hover:bg-slate-300 transition-all shadow"
                        >
                            View less
                        </button>
                    )}
                </div>
            )}

            {/* WHAT'S INCLUDED SIDEBAR */}
            {activeQuote && (
                <>
                    <div
                        onClick={() => setActiveQuote(null)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
                    />

                    <aside className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl animate-slideFromRight">
                        <div className="h-full flex flex-col">
                            {/* Sidebar Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                                <div>
                                    <h2 className="text-xl font-bold text-dark">
                                        What's Included
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Full breakdown of {activeQuote.brand}{" "}
                                        {activeQuote.model} package
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveQuote(null)}
                                    className="h-10 w-10 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                >
                                    <FiX className="text-slate-600" />
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
                                                className="flex gap-4 items-start p-4 rounded-2xl border border-slate-100 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                            >
                                                <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                                                    <FiCheck size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-dark pt-3">
                                                        {itemString}
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Price Summary in Sidebar */}
                                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-dark/80 to-dark text-white">
                                    <h3 className="font-bold text-lg mb-4">
                                        Total Value Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-sm opacity-80">
                                                Boiler & Installation
                                            </span>
                                            <span className="font-semibold">
                                                £
                                                {activeQuote.price?.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-sm opacity-80">
                                                Warranty (
                                                {activeQuote.warrantyYears}{" "}
                                                Years)
                                            </span>
                                            <span className="text-primary">
                                                Included
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-bold">
                                                Total Package Value
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
