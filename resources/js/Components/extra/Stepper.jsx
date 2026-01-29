import {
    FiCheck,
    FiChevronLeft,
    FiChevronRight,
    FiRefreshCcw,
    FiTool,
    FiHome,
    FiClock,
    FiStar,
    FiPhoneCall,
} from "react-icons/fi";
import { PageHeader } from "../ui/page-header";
import AppointmentDateTimePicker from "./AppointmentDateTimePicker";
import { useEffect, useRef, useState, useMemo } from "react";
import QuoteProcessingModal from "./QuoteProgressPopup";
import { Link } from "@inertiajs/react";
import InstantQuoteModal from "./InstantQuoteModal";

const formatPrice = (value) => {
    const num = Number(value);
    return Number.isInteger(num) ? num : num.toFixed(2);
};

const SERVICES_WITH_INSTANT_QUOTE = [
    "boiler_repair",
    "boiler_service",
    "power_flush",
];

export default function Stepper({
    title = "Boiler Repair Quote",
    steps = [],
    basePrice = 0,
    currency = "£",
    onSubmit,
    serviceKey,
    autoAdvance = false,
}) {
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownTriggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [openUpwards, setOpenUpwards] = useState(false);
    const [showInstantQuote, setShowInstantQuote] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });
    const lastAutoAdvanceRef = useRef(null);
    const skipAutoAdvanceRef = useRef(false);

    /* -------------------------------------------------------
       dropdown positioning
    ------------------------------------------------------- */

    // debug for answers state

    // useEffect(() => {
    //     console.log("ANSWERS UPDATED:", answers);
    // }, [answers]);

    // different type of login

    const visibleSteps = useMemo(() => {
        return steps.filter((step) => {
            if (!step.showIf) return true;
            return step.showIf(answers);
        });
    }, [steps, answers]);

    const current = visibleSteps[index] || null;

    useEffect(() => {
        Object.keys(answers).forEach((key) => {
            const step = steps.find((s) => s.id === key);
            if (step?.showIf && !step.showIf(answers)) {
                setAnswers((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                });
            }
        });
    }, [answers, steps]);

    useEffect(() => {
        if (!isDropdownOpen || !dropdownTriggerRef.current) return;

        const rect = dropdownTriggerRef.current.getBoundingClientRect();
        const dropdownHeight = 320;
        const viewportHeight = window.innerHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        setOpenUpwards(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }, [isDropdownOpen]);

    /* -------------------------------------------------------
       normalize options
    ------------------------------------------------------- */
    const displayOptions = useMemo(() => {
        if (!current?.options) return [];

        return current.options.map((opt) =>
            typeof opt === "string"
                ? { label: opt, price: 0 }
                : {
                    ...opt,
                    requiresText: opt.requiresText || false,
                }
        );
    }, [current]);

    const answeredCount = Object.keys(answers).length;
    // const progress = Math.round(
    //     (index / Math.max(1, visibleSteps.length - 1)) * 100
    // );

    useEffect(() => {
        steps.forEach((step) => {
            if (step.preset && !answers[step.id]) {
                setAnswers((s) => ({
                    ...s,
                    [step.id]: step.preset,
                }));
            }
        });
    }, [steps]);

    /* -------------------------------------------------------
       handlers
    ------------------------------------------------------- */
    function choose(option) {
        if (!current) return;

        const shouldAutoAdvance =
            autoAdvance &&
            ["select", "dropdown"].includes(current.type) &&
            !option.requiresText;

        setAnswers((s) => {
            const updated = {
                ...s,
                [current.id]: {
                    ...option,
                    price: option.price || 0,
                    extraText: "",
                },
            };

            console.log("All answers state:", updated); // ✅ FULL STATE

            if (shouldAutoAdvance) {
                const key = `${current.id}:${option.label ?? option.value ?? JSON.stringify(option)}`;
                lastAutoAdvanceRef.current = key;

                const nextVisibleSteps = steps.filter((step) => {
                    if (!step.showIf) return true;
                    return step.showIf(updated);
                });

                const currentIndex = nextVisibleSteps.findIndex(
                    (step) => step.id === current.id
                );

                if (currentIndex >= 0) {
                    if (currentIndex >= nextVisibleSteps.length - 1) {
                        if (
                            SERVICES_WITH_INSTANT_QUOTE.includes(
                                serviceKey?.key
                            )
                        ) {
                            setShowInstantQuote(true);
                            setShowProcessing(false);
                        } else {
                            setShowProcessing(true);
                            setShowInstantQuote(false);
                        }
                    } else {
                        setIndex(currentIndex + 1);
                    }
                }
            }

            return updated;
        });

    }

    useEffect(() => {
        if (!autoAdvance || !current) return;
        if (skipAutoAdvanceRef.current) {
            skipAutoAdvanceRef.current = false;
            return;
        }

        if (!["select", "dropdown"].includes(current.type)) return;

        const ans = answers[current.id];
        if (!ans || ans.requiresText) return;

        const key = `${current.id}:${ans.label ?? ans.value ?? JSON.stringify(ans)}`;
        if (lastAutoAdvanceRef.current === key) return;
        lastAutoAdvanceRef.current = key;

        setIndex((i) => Math.min(i + 1, visibleSteps.length - 1));
    }, [autoAdvance, current, answers, visibleSteps.length]);


    function updateText(value) {
        // console.log(value)
        setAnswers((s) => ({
            ...s,
            [current.id]: {
                ...(s[current.id] || {}),
                value,
            },
        }));
    }

    function updateExtraText(value) {
        setAnswers((s) => ({
            ...s,
            [current.id]: {
                ...s[current.id],
                extraText: value,
            },
        }));
    }

    function next() {
        if (!canProceed) return;

        // if (index === steps.length - 1) {
        //     setShowQuotePopup(true);
        //     return;
        // }

        setIndex((i) => i + 1);
    }

    function back() {
        if (autoAdvance) {
            skipAutoAdvanceRef.current = true;
            lastAutoAdvanceRef.current = null;
        }
        setIndex((i) => Math.max(0, i - 1));
    }

    function restart() {
        setIndex(0);
        setAnswers({});
    }

    /* -------------------------------------------------------
       pricing (BASE ONLY)
    ------------------------------------------------------- */
    const pricing = useMemo(() => {
        const radiatorPrice = answers.radiators?.price || 0;

        return {
            base: Number(basePrice) || 0,
            radiator: Number(radiatorPrice),
            total: Number(basePrice || 0) + Number(radiatorPrice),
        };
    }, [answers, basePrice]);

    /* -------------------------------------------------------
       can proceed logic
    ------------------------------------------------------- */
    const canProceed = useMemo(() => {
        if (!current) return false;

        const ans = answers[current.id];

        if (current.type === "upload") return true;

        if (current.type === "text") {
            return !!ans?.value?.trim();
        }

        if (current.type === "info") return false;

        if (current.type === "select") {
            if (!ans) return false;
            if (ans.requiresText) {
                return !!ans.extraText?.trim();
            }
            return true;
        }

        if (current.type === "dropdown") {
            return !!ans?.label;
        }

        if (current.type === "checkbox_quantity") {
            return true;
        }

        if (current.type === "details") {
            return (
                !!ans?.name?.trim() &&
                !!ans?.phone?.trim() &&
                !!ans?.email?.trim() &&
                !!ans?.postcode?.trim()
            );
        }

        if (current.type === "datetime") {
            return !!ans?.datetime?.date && !!ans?.datetime?.time;
        }

        return false;
    }, [current, answers]);

    // ===============================
    // ENTER KEY → NEXT STEP
    // ===============================
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (!canProceed) return;

            // Same behavior as Next button
            if (index === visibleSteps.length - 1) {
                if (SERVICES_WITH_INSTANT_QUOTE.includes(serviceKey?.key)) {
                    setShowInstantQuote(true);
                    setShowProcessing(false);
                } else {
                    setShowProcessing(true);
                    setShowInstantQuote(false);
                }
            } else {
                setIndex((i) => i + 1);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canProceed, index, visibleSteps.length, serviceKey]);

    return (
        <>
            <div className="fixed inset-0 bg-light-grey -z-10"></div>
            <div className="min-h-screen bg-light-grey overflow-hidden">
                <PageHeader />

                {/* Hidden service identifiers */}
                <input type="hidden" name="service_key" value={serviceKey} />
                <input type="hidden" name="service_name" value={title} />

                <div className="max-w-7xl mx-auto space-y-10 py-16 px-4 sm:px-6 lg:px-0">
                    {/* TITLE */}
                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-dark">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Answer a few quick questions to get a clear,
                                fixed-price estimate.
                            </p>
                        </div>
                        {/* RIGHT: Trust Rail */}
                        <div className="group relative flex items-center gap-4 px-5 py-3 rounded-2xl bg-white border border-primary/50 shadow-sm overflow-hidden">
                            {/* animated edge accent */}
                            <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary to-dark/90" />

                            {/* icon */}
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/80 text-foreground shrink-0">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>

                            {/* text */}
                            <div className="leading-tight">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Certified Engineers
                                </p>
                                <p className="text-sm font-semibold text-dark">
                                    Gas Safe Registered
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        {/* ================= LEFT ================= */}
                        <aside className="order-2 md:order-none md:col-span-4 glass-dark p-8 rounded-3xl overflow-hidden h-full flex flex-col relative">
                            <div className="sheen absolute inset-0 pointer-events-none rounded-3xl" />
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-primary">
                                    Why choose us
                                </h3>

                                {/* <button
                                    onClick={restart}
                                    className="inline-flex items-center gap-2 text-xs bg-foreground text-dark px-3 py-1.5 rounded-full cursor-pointer"
                                >
                                    <FiRefreshCcw /> Reset
                                </button> */}
                            </div>

                            <ul className="space-y-5 text-sm text-foreground/90">
                                <li>✓ Certified & trusted engineers</li>
                                <li>✓ Transparent pricing</li>
                                <li>✓ Warranty included</li>
                            </ul>

                            {/* PRICE */}
                            {pricing.total > 0 && (
                                <div className="mt-8 rounded-2xl bg-foreground p-4">
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Your price
                                    </p>

                                    <p className="mt-1 text-3xl font-extrabold text-dark">
                                        {currency}
                                        {formatPrice(pricing.total)}
                                    </p>

                                    {/* <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        <p>Base price: {currency}{formatPrice(pricing.base)}</p>
                                        {pricing.radiator > 0 && (
                                            <p>Radiators: {currency}{formatPrice(pricing.radiator)}</p>
                                        )}
                                    </div> */}

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Fixed price · No hidden extras
                                    </p>
                                </div>
                            )}

                            {/* PROGRESS */}
                            {/* <div className="mt-auto pt-8">
                                <div className="text-xs text-foreground/70 mb-2">
                                    Progress
                                </div>
                                <div className="progress-track w-full rounded-full">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-xs text-foreground/60">
                                    {answeredCount}/{steps.length} answered •{" "}
                                    {progress}%
                                </div>
                            </div> */}

                            {/* RESET BUTTON — bottom aligned */}
                            <div className="mt-auto pt-10">
                                <button
                                    onClick={restart}
                                    className="
                                            inline-flex items-center gap-3
                                            text-sm font-medium
                                            bg-foreground text-dark
                                            px-6 py-3
                                            rounded-full
                                            cursor-pointer
                                            shadow-sm
                                            hover:bg-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.25)]

                                            transition-all"
                                >
                                    <FiRefreshCcw className="text-base" />
                                    Reset
                                </button>
                            </div>
                        </aside>

                        {/* ================= RIGHT ================= */}
                        <section className="order-1 md:order-none md:col-span-8 h-full flex">
                            <div className="glass-root p-8 rounded-3xl w-full flex flex-col relative">
                                <div className="radial-highlight absolute inset-0 pointer-events-none" />

                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Question
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Step {index + 1} of{" "}
                                        {visibleSteps.length}
                                    </p>
                                </div>

                                <h2 className="text-2xl font-extrabold text-center text-dark mb-8">
                                    {current?.question}
                                </h2>

                                {/* ========= TRV CHECKBOX + QUANTITY ========= */}
                                {current?.type === "checkbox_quantity" && (
                                    <div className="max-w-2xl mx-auto w-full">
                                        <div
                                            className={`flex items-center justify-between rounded-2xl border px-6 py-5 transition ${answers[current.id]?.enabled
                                                ? "border-primary bg-primary/5"
                                                : "border-dark/20 bg-white"
                                                }`}
                                        >
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        answers[current.id]
                                                            ?.enabled || false
                                                    }
                                                    onChange={(e) => {
                                                        const enabled =
                                                            e.target.checked;

                                                        setAnswers((s) => ({
                                                            ...s,
                                                            [current.id]:
                                                                enabled
                                                                    ? {
                                                                        enabled: true,
                                                                        qty: 1,
                                                                        unitPrice:
                                                                            current.price,
                                                                        price: current.price,
                                                                    }
                                                                    : {
                                                                        enabled: false,
                                                                        qty: 0,
                                                                        unitPrice:
                                                                            current.price,
                                                                        price: 0,
                                                                    },
                                                        }));
                                                    }}
                                                    className="h-5 w-5 accent-primary"
                                                />

                                                <div>
                                                    <p className="text-lg font-semibold text-dark">
                                                        {current.label}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* photo upload */}

                                {current?.type === "upload" && (
                                    <div className="w-full flex justify-center">
                                        <div className="w-full max-w-4xl">
                                            <label className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 transition hover:border-primary hover:bg-white">
                                                {/* Hidden input */}
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*"
                                                    onChange={(e) =>
                                                        setAnswers((s) => ({
                                                            ...s,
                                                            [current.id]:
                                                                Array.from(
                                                                    e.target
                                                                        .files
                                                                ),
                                                        }))
                                                    }
                                                    className="sr-only"
                                                />

                                                {/* Icon */}
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 16v-8m0 0l-4 4m4-4l4 4" />
                                                        <path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                                                    </svg>
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-dark">
                                                        Upload photos or videos
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Optional, but helpful
                                                        for diagnosis
                                                    </p>
                                                </div>

                                                {/* Action */}
                                                <div className="ml-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-dark transition group-hover:border-primary group-hover:text-primary">
                                                    Choose files
                                                </div>
                                            </label>

                                            {/* Helper */}
                                            <p className="mt-2 text-xs text-slate-400">
                                                JPG, PNG supported
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* ========= TEXT INPUT ========= */}
                                {current?.type === "text" && (
                                    <div className="max-w-xl mx-auto w-full">
                                        <input
                                            type="text"
                                            placeholder={current.placeholder}
                                            value={
                                                answers[current.id]?.value || ""
                                            }
                                            onChange={(e) =>
                                                updateText(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                )}

                                {/* ========= INFO / SPECIALIST HELP ========= */}
                                {current?.type === "info" && (
                                    <div className="mt-5 w-full lg:max-w-5xl mx-auto">
                                        {/* Unique side-by-side with perfect bridge */}
                                        <div className="w-full relative flex flex-col lg:flex-row gap-8">
                                            {/* WhatsApp */}
                                            <div className="flex-1 group w-full">
                                                <a
                                                    href="https://wa.me/447454796398"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                    relative flex flex-col sm:flex-row sm:items-center gap-4
                    p-4 sm:p-5
                    rounded-2xl bg-gradient-to-br from-white to-green-50/30
                    border-l-4 border-green-400 hover:border-green-500
                    transition-all duration-300 hover:shadow-lg
                    group-hover:shadow-green-100/50 overflow-hidden
                    "
                                                // 🔴 CHANGE: flex-col sm:flex-row + p-4 sm:p-5
                                                >
                                                    {/* Background accent */}
                                                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-green-400/5 to-transparent"></div>
                                                    <div className="flex flex-row gap-2 items-center ">
                                                        {/* Icon */}
                                                        <div className="relative z-10">
                                                            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                                                                {/* 🔴 CHANGE: smaller icon on mobile */}
                                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 shadow-md flex items-center justify-center">
                                                                    <svg
                                                                        className="h-6 w-6 text-green-600"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                </div>

                                                                {/* Status ring */}
                                                                <div className="absolute -inset-2 rounded-full border-2 border-green-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 relative z-10">
                                                            <span className="block text-[16px] font-bold text-gray-800">
                                                                WhatsApp
                                                            </span>
                                                            <span className="block text-xs text-gray-500">
                                                                Chat with an
                                                                engineer
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Action button */}
                                                    <div className="relative z-10 w-full sm:w-auto">
                                                        {/* 🔴 CHANGE: w-full sm:w-auto */}
                                                        <div className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 sm:group-hover:translate-x-1">
                                                            Start chat
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            {/* Engineer callback */}
                                            <div className="flex-1 group w-full">
                                                <Link
                                                    href="/#contact"
                                                    className="
                    relative flex flex-col sm:flex-row sm:items-center gap-4
                    p-4 sm:p-5
                    rounded-2xl bg-gradient-to-br from-white to-blue-50/30
                    border-r-4 border-blue-400 hover:border-blue-500
                    transition-all duration-300 hover:shadow-lg
                    group-hover:shadow-blue-100/50 overflow-hidden
                "
                                                // 🔴 CHANGE: flex-col sm:flex-row + p-4 sm:p-5
                                                >
                                                    {/* Background accent */}
                                                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-400/5 to-transparent"></div>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        {/* Icon */}
                                                        <div className="relative z-10">
                                                            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                                                                {/* 🔴 CHANGE */}
                                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300 shadow-md flex items-center justify-center">
                                                                    <svg
                                                                        className="h-6 w-6 text-primary"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                </div>

                                                                <div className="absolute -inset-2 rounded-full border-2 border-blue-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 relative z-10">
                                                            <span className="block text-[14px] font-bold text-gray-800">
                                                                Engineer callback
                                                            </span>
                                                            <span className="block text-xs text-gray-500">
                                                                No phone queues
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Phone number */}
                                                    <div className="relative z-10 w-full sm:w-auto">
                                                        {/* 🔴 CHANGE */}
                                                        <div className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 sm:group-hover:-translate-x-1">
                                                            Request callback
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ===== Visual guidance - Unique Minimal Design ===== */}
                                {current?.helperImages &&
                                    current.helperImages.length >= 2 && (
                                        <div className="w-full flex flex-col items-center mb-10 mt-4">
                                            {/* Images */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                                {current.helperImages
                                                    .slice(0, 2)
                                                    .map((img, index) => (
                                                        <div
                                                            key={index}
                                                            onMouseEnter={() =>
                                                                setHoveredIndex(
                                                                    index
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                setHoveredIndex(
                                                                    null
                                                                )
                                                            }
                                                            onMouseMove={(
                                                                e
                                                            ) => {
                                                                const rect =
                                                                    e.currentTarget.getBoundingClientRect();
                                                                setMouse({
                                                                    x:
                                                                        ((e.clientX -
                                                                            rect.left) /
                                                                            rect.width) *
                                                                        100,
                                                                    y:
                                                                        ((e.clientY -
                                                                            rect.top) /
                                                                            rect.height) *
                                                                        100,
                                                                });
                                                            }}
                                                            className="relative w-[240px] md:w-[350px] aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md cursor-zoom-in"
                                                        >
                                                            {/* Base image */}
                                                            <img
                                                                src={img.src}
                                                                alt={img.alt}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />

                                                            {/* Internal zoom layer */}
                                                            <div
                                                                className={`absolute inset-0 transition-opacity duration-300 ${hoveredIndex ===
                                                                    index
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            >
                                                                <img
                                                                    src={
                                                                        img.src
                                                                    }
                                                                    alt=""
                                                                    className="absolute inset-0 w-full h-full object-cover scale-[1.5]"
                                                                    style={{
                                                                        transformOrigin: `${mouse.x}% ${mouse.y}%`,
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Focus frame */}
                                                            <div
                                                                className={`pointer-events-none absolute inset-5 rounded-2xl border border-white/70 transition-opacity duration-300 ${hoveredIndex ===
                                                                    index
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />

                                                            {/* Label */}
                                                            <div className="absolute bottom-3 inset-x-0 flex justify-center">
                                                                <div className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur text-xs font-medium text-white">
                                                                    Example{" "}
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                {/* dropdown */}
                                {current?.type === "dropdown" && (
                                    <div className="max-w-2xl mx-auto w-full overflow-x-clip">
                                        <div className="relative">
                                            <button
                                                ref={dropdownTriggerRef}
                                                type="button"
                                                onClick={() =>
                                                    setIsDropdownOpen((s) => !s)
                                                }
                                                className={`
                    w-full px-5 py-4 bg-white border-2 rounded-xl
                    flex items-center justify-between text-left
                    transition-all duration-200
                    ${isDropdownOpen ? "border-blue-500" : "border-gray-200"}
                `}
                                            >
                                                {answers[current.id] ? (
                                                    <div className="flex items-center justify-between w-full pr-2">
                                                        <div className="min-w-0">
                                                            <div className="text-lg font-semibold text-gray-900 truncate">
                                                                {
                                                                    answers[
                                                                        current
                                                                            .id
                                                                    ].label
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1 truncate">
                                                                System size
                                                                based pricing
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 ml-4">
                                                            <span className="text-xl font-bold text-gray-900">
                                                                £
                                                                {
                                                                    answers[
                                                                        current
                                                                            .id
                                                                    ].price
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-lg">
                                                        Select an option...
                                                    </span>
                                                )}
                                            </button>

                                            {isDropdownOpen && (
                                                <div
                                                    ref={dropdownRef}
                                                    className={`absolute inset-x-0 z-50 ${openUpwards
                                                        ? "bottom-full mb-2"
                                                        : "top-full mt-2"
                                                        }`}
                                                >
                                                    <div className="bg-white border-2 border-dark/20 rounded-xl overflow-hidden">
                                                        <div className="max-h-80 overflow-y-auto">
                                                            {current.options.map(
                                                                (opt) => (
                                                                    <button
                                                                        key={
                                                                            opt.value
                                                                        }
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setAnswers(
                                                                                (
                                                                                    s
                                                                                ) => ({
                                                                                    ...s,
                                                                                    [current.id]:
                                                                                        opt,
                                                                                })
                                                                            );
                                                                            setIsDropdownOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                        className="w-full px-5 py-4 text-left hover:bg-gray-50 flex justify-between"
                                                                    >
                                                                        <span className="font-semibold">
                                                                            {
                                                                                opt.label
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ========= Customer Details ========= */}
                                {current?.type === "details" && (
                                    <div className="w-full flex justify-center">
                                        <div className="w-full max-w-4xl px-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {[
                                                    {
                                                        key: "name",
                                                        label: "Full name",
                                                    },
                                                    {
                                                        key: "phone",
                                                        label: "Phone number",
                                                    },
                                                    {
                                                        key: "email",
                                                        label: "Email address",
                                                    },
                                                    {
                                                        key: "postcode",
                                                        label: "Postcode",
                                                    },
                                                    {
                                                        key: "address",
                                                        label: "Address (Optional)",
                                                        full: true,
                                                    },
                                                ].map(
                                                    ({ key, label, full }) => (
                                                        <div
                                                            key={key}
                                                            className={`relative ${full
                                                                ? "md:col-span-2"
                                                                : ""
                                                                }`}
                                                        >
                                                            <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs font-medium text-slate-500">
                                                                {label}
                                                            </label>

                                                            <input
                                                                value={
                                                                    answers[
                                                                    current
                                                                        .id
                                                                    ]?.[key] ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    setAnswers(
                                                                        (
                                                                            s
                                                                        ) => ({
                                                                            ...s,
                                                                            [current.id]:
                                                                            {
                                                                                ...s[
                                                                                current
                                                                                    .id
                                                                                ],
                                                                                [key]: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                        })
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-dark/20 bg-white px-5 py-4 text-sm text-dark
                                   focus:border-primary focus:ring-1 focus:ring-primary/10
                                   transition"
                                                            />
                                                        </div>
                                                    )
                                                )}

                                                {/* Address */}
                                                {/* <div className="relative sm:col-span-2">
                                                    <label className="absolute -top-2 left-5 z-10 bg-white px-1 text-xs font-medium text-slate-500">
                                                        Address (optional)
                                                    </label>

                                                    <input
                                                        className="w-full rounded-2xl border border-dark/20 bg-white px-5 py-4 text-sm text-dark
                               focus:border-primary focus:ring-1 focus:ring-primary/10
                               transition"
                                                    />
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ========= Date Time ========= */}

                                {current?.type === "datetime" && (
                                    <div className="">
                                        <AppointmentDateTimePicker
                                            value={
                                                answers[current.id]?.datetime ||
                                                null
                                            }
                                            type={serviceKey} // ✅ string supported now
                                            onChange={(payload) => {
                                                console.log(
                                                    "Datetime Payloaad",
                                                    payload
                                                );
                                                setAnswers((s) => ({
                                                    ...s,
                                                    [current.id]: {
                                                        ...s[current.id],
                                                        datetime: payload, // ✅ stores {date,time}
                                                    },
                                                }));
                                            }}
                                        />
                                    </div>
                                )}

                                {/* ========= SELECT OPTIONS ========= */}
                                {current?.type === "select" && (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
                                            {displayOptions.map((opt, i) => {
                                                const active =
                                                    answers[current?.id]
                                                        ?.label === opt.label;
                                                // const Icon =
                                                //     ICONS[i % ICONS.length];

                                                return (
                                                    <div
                                                        key={opt.label}
                                                        className={`option-card ${active
                                                            ? "option-active sheen"
                                                            : "option-inactive"
                                                            }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="p-4 rounded-2xl w-full cursor-pointer"
                                                            onClick={() =>
                                                                choose(opt)
                                                            }
                                                        >
                                                            <div className="flex items-center gap-5">
                                                                <div
                                                                    className={`radial-dot ${active
                                                                        ? "radial-dot-active"
                                                                        : "radial-dot-inactive"
                                                                        }`}
                                                                >
                                                                    <span className="radial-dot-core" />
                                                                </div>
                                                                {opt.image && (
                                                                    <img
                                                                        src={
                                                                            opt.image
                                                                        }
                                                                        alt={
                                                                            opt.label
                                                                        }
                                                                        className="w-14 h-14 object-contain rounded-lg"
                                                                    />
                                                                )}

                                                                <div className="flex-1 text-left flex gap-4">
                                                                    <div>
                                                                        <p className="font-semibold text-dark">
                                                                            {
                                                                                opt.label
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                                            {active
                                                                                ? "Selected"
                                                                                : "Tap to select"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {active && (
                                                                    <FiCheck className="text-primary text-lg" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {answers[current?.id]?.requiresText && (
                                            <div className="max-w-lg mx-auto mt-6 w-full">
                                                <input
                                                    type="text"
                                                    placeholder="Please provide details"
                                                    value={
                                                        answers[current.id]
                                                            ?.extraText || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateExtraText(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {current?.infoBox && (
                                    <div className="mt-14 max-w-4xl mx-auto">
                                        <div className="flex items-start gap-6">
                                            {/* Soft expert badge */}
                                            <div className="shrink-0">
                                                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/10 to-dark/10 flex items-center justify-center">
                                                    <span className="text-dark text-sm font-semibold">
                                                        {current.infoBox
                                                            .badge ?? "Tip"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Editorial content */}
                                            <div className="space-y-4">
                                                {/* Main text */}
                                                <p className="text-[16px] leading-relaxed text-slate-700 max-w-2xl whitespace-pre-line">
                                                    {current.infoBox.text}
                                                </p>

                                                {/* Optional phone CTA */}
                                                {current.infoBox.phone &&
                                                    current.infoBox
                                                        .phoneLabel && (
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className="text-slate-400">
                                                                {current.infoBox
                                                                    .helperLabel ??
                                                                    "Not sure?"}
                                                            </span>

                                                            <a
                                                                href={`tel:${current.infoBox.phone.replace(
                                                                    /\s/g,
                                                                    ""
                                                                )}`}
                                                                className="
                                relative font-semibold text-slate-900
                                after:absolute after:left-0 after:-bottom-1
                                after:h-[2px] after:w-full
                                after:bg-gradient-to-r after:from-dark/20 after:to-dark/10
                                after:scale-x-0 hover:after:scale-x-100
                                after:origin-left after:transition-transform
                            "
                                                            >
                                                                {
                                                                    current
                                                                        .infoBox
                                                                        .phoneLabel
                                                                }
                                                            </a>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CONTROLS */}
                                <div className="mt-auto pt-6 md:pt-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 md:justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {answers[current?.id]
                                            ? "Answer recorded"
                                            : "Please choose an option"}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={back}
                                            disabled={index === 0}
                                            className={`btn-pill flex gap-1 items-center cursor-pointer ${index === 0
                                                ? "btn-disabled"
                                                : ""
                                                }`}
                                        >
                                            <FiChevronLeft /> Back
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (
                                                    index ===
                                                    visibleSteps.length - 1
                                                ) {
                                                    if (
                                                        SERVICES_WITH_INSTANT_QUOTE.includes(
                                                            serviceKey?.key
                                                        )
                                                    ) {
                                                        setShowInstantQuote(
                                                            true
                                                        );
                                                        setShowProcessing(
                                                            false
                                                        ); // safety
                                                    } else {
                                                        setShowProcessing(true);
                                                        setShowInstantQuote(
                                                            false
                                                        ); // safety
                                                    }
                                                } else {
                                                    next();
                                                }
                                            }}
                                            disabled={!canProceed}
                                            className={`btn-gloss flex gap-1 items-center cursor-pointer ${!canProceed
                                                ? "btn-disabled"
                                                : ""
                                                }`}
                                        >
                                            Next <FiChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <QuoteProcessingModal
                open={showProcessing}
                answers={answers}
                onComplete={() => {
                    setShowProcessing(false);
                    console.log("READY TO SHOW QUOTES", answers);
                }}
                onClose={() => setShowProcessing(false)}
            />

            <InstantQuoteModal
                answers={answers}
                open={showInstantQuote}
                price={pricing.total}
                onClose={() => setShowInstantQuote(false)}
                serviceKey={serviceKey}
            />
        </>
    );
}
