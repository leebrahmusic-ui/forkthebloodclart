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
import { Link, router } from "@inertiajs/react";
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

        const rawOptions =
            typeof current.options === "function"
                ? current.options(answers)
                : current.options;

        return (rawOptions || []).map((opt) =>
            typeof opt === "string"
                ? { label: opt, price: 0 }
                : {
                    ...opt,
                    requiresText: opt.requiresText || false,
                }
        );
    }, [current, answers]);

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
            ["select", "dropdown", "make_model"].includes(current.type) &&
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
                        handleCompletion();
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

        if (!["select", "dropdown", "make_model"].includes(current.type)) return;

        const ans = answers[current.id];
        if (!ans || ans.requiresText) return;

        if (current.type === "make_model") {
            if (!ans.brand || !ans.model) return;
        }

        const key = `${current.id}:${ans.label ?? ans.value ?? JSON.stringify(ans)}`;
        if (lastAutoAdvanceRef.current === key) return;
        lastAutoAdvanceRef.current = key;

        setIndex((i) => Math.min(i + 1, visibleSteps.length - 1));
    }, [autoAdvance, current, answers, visibleSteps.length]);

    function updateMakeModel(next) {
        setAnswers((s) => ({
            ...s,
            [current.id]: {
                ...(s[current.id] || {}),
                ...next,
            },
        }));
    }


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

    const handleCompletion = () => {
        if (serviceKey?.key === "boiler_service") {
            router.post(route("book.quote.service.checkout"), answers, {
                preserveScroll: true,
            });
            return;
        }

        if (serviceKey?.key === "boiler_repair") {
            router.post(route("book.quote.repair.checkout"), answers, {
                preserveScroll: true,
            });
            return;
        }

        if (SERVICES_WITH_INSTANT_QUOTE.includes(serviceKey?.key)) {
            setShowInstantQuote(true);
            setShowProcessing(false);
        } else {
            setShowProcessing(true);
            setShowInstantQuote(false);
        }
    };

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

        if (current.type === "make_model") {
            if (!ans?.brand || !ans?.model) return false;
            if (ans.requiresText) return !!ans.extraText?.trim();
            return true;
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
                handleCompletion();
            } else {
                setIndex((i) => i + 1);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canProceed, index, visibleSteps.length, serviceKey, answers]);

    const optionGridColumns =
        displayOptions.length === 1
            ? "grid-cols-1"
            : displayOptions.length === 2
                ? "grid-cols-2 md:grid-cols-2"
                : "grid-cols-2 md:grid-cols-3";

    return (
        <>
            <div
                className="fixed inset-0 bg-light-grey -z-10 quote-page-bg"
                style={{
                    backgroundColor: "#f7faf9",
                    backgroundImage:
                        "radial-gradient(circle at top, rgba(16,185,129,0.30), transparent 45%)",
                }}
            ></div>
            <div
                className="min-h-screen bg-light-grey overflow-hidden quote-page-bg"
                style={{
                    backgroundColor: "#f7faf9",
                    backgroundImage:
                        "radial-gradient(circle at top, rgba(16,185,129,0.30), transparent 45%)",
                }}
            >
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
                        <div
                            className="group relative flex items-center gap-4 px-5 py-3 rounded-2xl bg-white border border-primary/50 shadow-sm overflow-hidden quote-trust-card"
                            style={{
                                backgroundColor: "#ffffff",
                                borderColor: "rgba(15,23,42,0.12)",
                                boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                            }}
                        >
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
                        {/* ================= RIGHT ================= */}
                        <section className="md:col-span-12 h-full flex">
                            <div
                                className="glass-root p-8 rounded-3xl w-full flex flex-col relative min-h-[75vh] sm:min-h-[640px] quote-question-shell"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,252,255,0.98))",
                                    border: "1px solid rgba(15,23,42,0.10)",
                                    boxShadow:
                                        "0 20px 48px rgba(0,0,0,0.10)",
                                }}
                            >
                                <div className="radial-highlight absolute inset-0 pointer-events-none" />

                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Question
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={restart}
                                            className="inline-flex items-center gap-2 text-xs bg-foreground text-dark px-3 py-1.5 rounded-full cursor-pointer shadow-sm hover:bg-white transition-colors"
                                        >
                                            <FiRefreshCcw className="text-sm" />
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-extrabold text-center text-dark mb-4">
                                    {current?.question}
                                </h2>

                                {current?.infoBox && (
                                    <div className="mb-8 max-w-3xl mx-auto text-center">
                                        <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
                                            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary mr-2 align-middle">
                                                {current.infoBox.badge ?? "Tip"}
                                            </span>
                                            {current.infoBox.text}
                                        </p>

                                        {current.infoBox.phone && current.infoBox.phoneLabel && (
                                            <div className="mt-3 text-sm text-slate-500">
                                                {current.infoBox.helperLabel ?? "Not sure?"}{" "}
                                                <a
                                                    href={`tel:${current.infoBox.phone.replace(/\s/g, "")}`}
                                                    className="font-semibold text-slate-900 hover:underline"
                                                >
                                                    {current.infoBox.phoneLabel}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

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

                                {/* make + model */}
                                {current?.type === "make_model" && (
                                    <div className="max-w-2xl mx-auto w-full space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-dark mb-2">
                                                    Brand
                                                </label>
                                                <select
                                                    className="w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                    value={
                                                        answers[current.id]?.brand ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        const brand = e.target.value;
                                                        updateMakeModel({
                                                            brand,
                                                            brandLabel: brand,
                                                            model: "",
                                                            modelLabel: "",
                                                            requiresText: false,
                                                            extraText: "",
                                                            label: brand || "",
                                                        });
                                                    }}
                                                >
                                                    <option value="">Select brand</option>
                                                    {(current.brands || []).map((label) => (
                                                        <option key={label} value={label}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-dark mb-2">
                                                    Model
                                                </label>
                                                <select
                                                    className="w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                    value={
                                                        answers[current.id]?.model ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        const modelOptions =
                                                            current.getModels?.(
                                                                answers[current.id]?.brand
                                                            ) || [];
                                                        const opt = modelOptions.find(
                                                            (o) => o.label === selected
                                                        );
                                                        const requiresText =
                                                            !!opt?.requiresText;

                                                        updateMakeModel({
                                                            model: selected,
                                                            modelLabel: selected,
                                                            requiresText,
                                                            extraText: "",
                                                            label: `${
                                                                answers[current.id]?.brand ||
                                                                ""
                                                            }${selected ? ` — ${selected}` : ""}`,
                                                        });
                                                    }}
                                                    disabled={!answers[current.id]?.brand}
                                                >
                                                    <option value="">
                                                        {answers[current.id]?.brand
                                                            ? "Select model"
                                                            : "Select brand first"}
                                                    </option>
                                                    {(current.getModels?.(
                                                        answers[current.id]?.brand
                                                    ) || []).map((opt) => (
                                                        <option key={opt.label} value={opt.label}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {answers[current.id]?.requiresText && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter model"
                                                    value={
                                                        answers[current.id]?.extraText ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        updateMakeModel({
                                                            extraText: e.target.value,
                                                            label: `${
                                                                answers[current.id]?.brand ||
                                                                ""
                                                            } — ${e.target.value}`,
                                                        })
                                                    }
                                                    className="w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        )}
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
                                                            {displayOptions.map(
                                                                (opt) => (
                                                                    <button
                                                                        key={
                                                                            opt.value ||
                                                                            opt.label
                                                                        }
                                                                        type="button"
                                                                        onClick={() => {
                                                                            choose(opt);
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
                                        <div
                                            className={`grid ${optionGridColumns} gap-5 max-w-5xl mx-auto w-full justify-items-stretch`}
                                        >
                                            {displayOptions.map((opt) => {
                                                const active =
                                                    answers[current?.id]
                                                        ?.label === opt.label;

                                                return (
                                                    <div
                                                        key={opt.label}
                                                        className={`option-card relative overflow-hidden ${active
                                                            ? "option-active sheen"
                                                            : "option-inactive"
                                                            }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="w-full aspect-square p-5 sm:p-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center gap-4"
                                                            onClick={() =>
                                                                choose(opt)
                                                            }
                                                        >
                                                            {active && (
                                                                <span className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow">
                                                                    <FiCheck className="text-sm" />
                                                                </span>
                                                            )}

                                                            {opt.image && (
                                                                <div
                                                                    className={`${
                                                                        current?.id === "flue_wall"
                                                                            ? "w-32 h-32 sm:w-36 sm:h-36"
                                                                            : "w-24 h-24 sm:w-28 sm:h-28"
                                                                    } flex items-center justify-center`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            opt.image
                                                                        }
                                                                        alt={
                                                                            opt.label
                                                                        }
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="font-semibold text-dark">
                                                                    {
                                                                        opt.label
                                                                    }
                                                                </p>
                                                                {opt.priceNote && (
                                                                    <p className="text-xs font-semibold text-primary mt-1">
                                                                        {opt.priceNote}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {active
                                                                        ? "Selected"
                                                                        : "Tap to choose"}
                                                                </p>
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
                                                    handleCompletion();
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
