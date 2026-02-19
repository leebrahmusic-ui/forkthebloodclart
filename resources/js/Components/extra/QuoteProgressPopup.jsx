import { useEffect, useState, useMemo, useRef } from "react";
import {
    FiCheck,
    FiChevronRight,
    FiZap,
    FiClock,
    FiCpu,
    FiHome,
    FiTool,
    FiX,
} from "react-icons/fi";
import { router } from "@inertiajs/react";
import { buildBoilerQuote } from "@/lib/quoteEngine";
import { SERVICE_QUESTIONS } from "./boilerSteps";

export default function QuoteProcessingModal({
    open,
    answers,
    onComplete,
    onClose,
}) {
    const STEP_DURATION_MS = 1200;
    const REDIRECT_DELAY_MS = 650;

    const [activeStep, setActiveStep] = useState(0);
    const [waveOffset, setWaveOffset] = useState(0);
    const [displayProgress, setDisplayProgress] = useState(0);
    const canvasRef = useRef(null);

    const [quote, setQuote] = useState(null);

    useEffect(() => {
        if (!open) return;

        const q = buildBoilerQuote({
            answers,
            questions: SERVICE_QUESTIONS.new,
        });

        console.log("Built quote:", q);

        const postcode =
            answers?.details?.postcode ||
            new URLSearchParams(window.location.search).get("postcode") ||
            "";

        setQuote({
            ...q,
            inputs: { ...(q?.inputs || {}), postcode },
        });
    }, [open, answers]);

    const steps = useMemo(
        () => [
            {
                id: 1,
                text: buildQuoteText(answers),
                icon: FiHome,
                frequency: 120,
                waveColor: "rgb(54, 193, 255)",
            },
            {
                id: 2,
                text: buildCompatibilityText(answers),
                icon: FiTool,
                frequency: 180,
                waveColor: "rgb(30, 151, 230)",
            },
            {
                id: 3,
                text: "Verifying installer availability & warranty options",
                icon: PoundIcon,
                frequency: 240,
                waveColor: "rgb(0, 171, 219)",
            },
        ],
        [answers]
    );

    /* ================= ANIMATIONS ================= */

    useEffect(() => {
        if (!open) return;

        let raf;
        let start;

        const animate = (t) => {
            if (!start) start = t;
            setWaveOffset(((t - start) * 0.001) % 1);
            raf = requestAnimationFrame(animate);
        };

        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [open, activeStep]);

    useEffect(() => {
        if (!open) {
            setDisplayProgress(0);
            return;
        }

        const totalDuration = steps.length * STEP_DURATION_MS;
        let raf;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const pct = Math.min(100, (elapsed / totalDuration) * 100);
            setDisplayProgress(pct);

            if (pct < 100) {
                raf = requestAnimationFrame(tick);
            }
        };

        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [open, steps.length]);

    useEffect(() => {
        if (!canvasRef.current || !open) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const step = steps[activeStep];
        if (!step) return;

        ctx.beginPath();
        ctx.strokeStyle = step.waveColor
            .replace("rgb", "rgba")
            .replace(")", ",0.35)");
        ctx.lineWidth = 3;

        for (let x = 0; x < canvas.width; x++) {
            const y =
                canvas.height / 2 +
                Math.sin((x + waveOffset * canvas.width) * 0.02) * 40;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.stroke();
    }, [waveOffset, activeStep, steps, open]);

    useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setDisplayProgress(0);
            return;
        }

        if (activeStep >= steps.length) return;

        const timer = setTimeout(
            () => setActiveStep((s) => s + 1),
            STEP_DURATION_MS
        );
        return () => clearTimeout(timer);
    }, [open, activeStep, steps.length, STEP_DURATION_MS]);

    // Prevent background scroll on mobile while modal open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const completed = activeStep >= steps.length;
    const currentStep = steps[Math.min(activeStep, steps.length - 1)];
    const progressPercent = Math.min(100, Math.round(displayProgress));
    const ringRadius = 52;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringDashOffset =
        ringCircumference - (progressPercent / 100) * ringCircumference;

    useEffect(() => {
        if (!open || !completed || !quote) return;

        const timer = setTimeout(() => {
            const csrfToken = document.head.querySelector(
                'meta[name="csrf-token"]'
            )?.content;
            const payload = csrfToken ? { ...quote, _token: csrfToken } : quote;

            router.post(`/book/quote/new/results`, payload, {
                preserveScroll: true,
            });
        }, REDIRECT_DELAY_MS);

        return () => clearTimeout(timer);
    }, [open, completed, quote, REDIRECT_DELAY_MS]);

    if (!open) return null;

    return (
        <div
            id="quote-processing-modal"
            className="fixed inset-0 z-50 bg-[#00ABDB]/32 backdrop-blur-[2px] quote-processing-overlay"
            role="dialog"
            aria-modal="true"
        >
            <style>{`
                #quote-processing-modal,
                #quote-processing-modal * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                #quote-processing-modal .modal-card,
                #quote-processing-modal .modal-left,
                #quote-processing-modal .modal-right {
                    background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 22px 60px rgba(0, 63, 85, 0.28) !important;
                }

                #quote-processing-modal .modal-soft-chip,
                #quote-processing-modal .modal-soft-block {
                    background: rgba(255, 255, 255, 0.10) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                }

                #quote-processing-modal [class*="text-"],
                #quote-processing-modal .text-dark,
                #quote-processing-modal .text-muted-foreground,
                #quote-processing-modal p,
                #quote-processing-modal h2,
                #quote-processing-modal h3,
                #quote-processing-modal span,
                #quote-processing-modal button,
                #quote-processing-modal svg {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                #quote-processing-modal .modal-soft-text {
                    color: rgba(255, 255, 255, 0.86) !important;
                    -webkit-text-fill-color: rgba(255, 255, 255, 0.86) !important;
                }

                #quote-processing-modal .modal-track {
                    background-color: rgba(255, 255, 255, 0.24) !important;
                }

                #quote-processing-modal .modal-progress {
                    background: linear-gradient(90deg, #8bdfff 0%, #36c1ff 100%) !important;
                }

                @media (max-width: 640px) {
                    #quote-processing-modal {
                        background: rgba(0, 171, 219, 0.38) !important;
                    }
                }

                @media (max-width: 640px) and (prefers-color-scheme: dark) {
                    #quote-processing-modal,
                    #quote-processing-modal * {
                        color-scheme: light !important;
                        forced-color-adjust: none !important;
                    }

                    #quote-processing-modal {
                        background: rgba(0, 171, 219, 0.40) !important;
                    }
                }
            `}</style>
            {/* Layout: mobile = full-height sheet with sticky footer, desktop = centered card */}
            <div className="h-[100dvh] w-full flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="relative w-full sm:max-w-5xl">
                    <div className="absolute -top-12 left-6 h-40 w-40 rounded-full bg-[#36C1FF]/30 blur-3xl" />
                    <div className="absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-[#00ABDB]/30 blur-3xl" />
                    {/* Card / Sheet */}
                    <div className="relative modal-card rounded-t-3xl sm:rounded-3xl border">
                        {/* Canvas (hidden on small screens to avoid overflow + performance) */}
                        <canvas
                            ref={canvasRef}
                            className="hidden sm:block absolute inset-0 w-full h-full rounded-3xl opacity-30 pointer-events-none"
                            width={900}
                            height={500}
                        />

                        {/* Wrapper with sticky footer on mobile */}
                        <div className="relative w-full h-[100dvh] sm:h-auto sm:rounded-3xl sm:overflow-hidden">
                            {/* Header bar for mobile (close button) */}
                            <div className="sm:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 modal-soft-block border-b">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                                        <FiClock className="text-white w-5 h-5" />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="text-[13px] font-bold text-dark">
                                            Preparing your quote
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Almost there…
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-10 w-10 rounded-xl bg-white border border-dark/10 flex items-center justify-center text-dark"
                                    aria-label="Close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Content area: scrollable on mobile */}
                            <div className="px-4 pb-36 sm:pb-4 sm:px-0 sm:grid sm:grid-cols-1 lg:grid-cols-5 sm:gap-6 sm:p-4 lg:p-0 overflow-y-auto sm:overflow-visible thin-scroll h-full sm:h-auto">
                                {/* LEFT PANEL */}
                                <div className="lg:col-span-2 modal-left rounded-3xl border p-5 sm:p-8 mt-4 sm:mt-0">
                                    <div className="flex items-start justify-between">
                                        <div className="inline-flex items-center gap-2 rounded-full border modal-soft-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                                            Instant estimate
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 text-xs modal-soft-text">
                                            <FiClock className="text-primary" />
                                            Live checks
                                        </div>
                                    </div>

                                    <h2 className="mt-4 text-[20px] sm:text-[22px] font-extrabold text-dark">
                                        Preparing your quote
                                    </h2>
                                    <p className="mt-2 text-[14px] modal-soft-text">
                                        We’re matching the best boiler options to your home
                                        in seconds.
                                    </p>

                                    <div className="mt-6 rounded-2xl border modal-soft-block p-5">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <svg width="120" height="120" viewBox="0 0 120 120">
                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r={ringRadius}
                                                        stroke="rgba(15, 23, 42, 0.12)"
                                                        strokeWidth="10"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r={ringRadius}
                                                        stroke="url(#progressGradient)"
                                                        strokeWidth="10"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeDasharray={ringCircumference}
                                                        strokeDashoffset={ringDashOffset}
                                                        transform="rotate(-90 60 60)"
                                                    />
                                                    <defs>
                                                        <linearGradient id="progressGradient" x1="0" x2="1" y1="0" y2="1">
                                                            <stop offset="0%" stopColor="#36C1FF" />
                                                            <stop offset="100%" stopColor="#1E97E6" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                {completed ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                                            <FiCheck className="text-white w-6 h-6" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-2xl font-extrabold text-dark">
                                                            {progressPercent}%
                                                        </span>
                                                        <span className="text-[11px] modal-soft-text">
                                                            Complete
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-[12px] uppercase tracking-[0.2em] modal-soft-text">
                                                    Now checking
                                                </p>
                                                <h3 className="mt-2 text-[16px] sm:text-[18px] font-semibold text-dark break-words">
                                                    {currentStep?.text}
                                                </h3>
                                                <p className="mt-2 text-[12px] modal-soft-text">
                                                    Fast, accurate, and tailored to your answers.
                                                </p>
                                                {completed && (
                                                    <p className="mt-2 text-[12px] font-semibold text-primary">
                                                        Redirecting to your results…
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3 text-[12px] modal-soft-text">
                                        <div className="rounded-xl border modal-soft-chip px-3 py-2">
                                            Fixed price options
                                        </div>
                                        <div className="rounded-xl border modal-soft-chip px-3 py-2">
                                            Trusted brands only
                                        </div>
                                        <div className="rounded-xl border modal-soft-chip px-3 py-2">
                                            Clear install timeline
                                        </div>
                                        <div className="rounded-xl border modal-soft-chip px-3 py-2">
                                            No hidden extras
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT PANEL */}
                                <div className="lg:col-span-3 flex flex-col space-y-6 mt-4 sm:mt-0">
                                    <div className="flex-1 modal-right backdrop-blur-xl rounded-3xl border p-5 sm:p-6">
                                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                                            <h3 className="text-[16px] sm:text-lg font-semibold text-dark">
                                                Live checks
                                            </h3>
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] modal-soft-text">
                                                Real-time
                                            </span>
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            {steps.map((step, i) => {
                                                const Icon = step.icon;
                                                const active = i === activeStep;
                                                const done = i < activeStep;

                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`rounded-2xl p-4 border transition ${
                                                            active
                                                                ? "border-white/55 bg-white/18"
                                                                : done
                                                                ? "border-white/45 bg-white/14"
                                                                : "border-white/30 bg-white/10"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                                                                    active
                                                                        ? "bg-gradient-to-br from-secondary to-primary"
                                                                        : done
                                                                        ? "bg-primary"
                                                                        : "bg-white/25"
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`${active ? "animate-spin" : ""} inline-flex items-center justify-center`}
                                                                >
                                                                    <Icon
                                                                        className={`w-4 h-4 ${
                                                                            active || done
                                                                                ? "text-white"
                                                                                : "text-white"
                                                                        }`}
                                                                    />
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[12px] sm:text-[14px] font-semibold modal-soft-text">
                                                                    Step {i + 1}
                                                                </p>
                                                                {/* clamp to avoid overflow on mobile */}
                                                                <p className="text-[13px] text-dark line-clamp-2">
                                                                    {step.text}
                                                                </p>
                                                            </div>

                                                            {done && (
                                                                <FiCheck className="text-primary shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-xs modal-soft-text mb-1">
                                                <span>Finishing up</span>
                                                <span>{progressPercent}%</span>
                                            </div>
                                            <div className="h-1.5 modal-track rounded-full overflow-hidden">
                                                <div
                                                    className="h-full modal-progress transition-[width] duration-300 ease-out"
                                                    style={{
                                                        width: `${progressPercent}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop button removed: auto-redirects */}
                                </div>
                            </div>

                            {/* Mobile button removed: auto-redirects */}

                            {/* Desktop close (optional) */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="hidden sm:flex absolute top-4 right-4 h-11 w-11 rounded-2xl modal-soft-chip border items-center justify-center text-white hover:bg-white/20 transition"
                                aria-label="Close"
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PoundIcon({ className = "" }) {
    return (
        <span
            className={`${className} inline-flex items-center justify-center w-4 h-4 text-[16px] font-extrabold leading-none tracking-tight`}
            aria-hidden="true"
        >
            £
        </span>
    );
}

/* ================= TEXT BUILDERS ================= */

function buildQuoteText(answers) {
    const flue = answers?.flue_type?.label;
    return `Reviewing your boiler requirements${
        flue ? ` (${flue.toLowerCase()} flue)` : ""
    }`;
}

function buildCompatibilityText(answers) {
    const rads = answers?.radiator_count?.label;
    const baths = answers?.bathrooms?.label;

    const info = [];
    if (rads) info.push(`${rads.toLowerCase()} radiators`);
    if (baths) info.push(`${baths.toLowerCase()} bathrooms`);

    return info.length
        ? `Sizing the system for your home (${info.join(", ")})`
        : "Sizing the system for your home";
}
