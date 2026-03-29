import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const STEPS = ["Choose", "Customise", "Book", "Complete"];

export function PageHeader({ variant = "default", currentStep = 4, theme = "light" }) {
    const waHref = "https://wa.me/447454796398";
    const waNumber = "+447454796398";
    const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
    const shouldForceBlueByPath =
        pathname === "/book/quote/new/install" ||
        pathname === "/book/quote/new/results" ||
        pathname === "/book/quote/service/checkout";
    const isBlue = theme === "blue" || shouldForceBlueByPath;

    return (
        <header
            className={`page-header-clean ${isBlue ? "page-header-blue" : "border-b border-slate-200 bg-white"}`}
            style={{
                backgroundColor: isBlue ? "transparent" : "#ffffff",
                backgroundImage: "none",
                borderBottomColor: isBlue ? "transparent" : "#e2e8f0",
                boxShadow: isBlue ? "none" : undefined,
            }}
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="flex h-[75px] items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="w-[120px]">
                        <img src="/images/logo%20FIXED.png" alt="MD Gas Leeds" />
                    </Link>

                    {variant === "results" && (
                        <div className="hidden md:flex items-center gap-3">
                            {STEPS.map((label, i) => {
                                const step = i + 1;
                                const active = step === currentStep;
                                const done = step < currentStep;

                                return (
                                    <div
                                        key={label}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                                                ${
                                                    done
                                                        ? "bg-primary text-white"
                                                        : active
                                                        ? isBlue
                                                            ? "border-2 border-white text-white"
                                                            : "border-2 border-primary text-primary"
                                                        : isBlue
                                                            ? "border border-white/50 text-white/70"
                                                            : "border border-gray-300 text-gray-400"
                                                }
                                            `}
                                        >
                                            {step}
                                        </div>

                                        <span
                                            className={`text-sm ${
                                                active
                                                    ? isBlue
                                                        ? "font-semibold text-white"
                                                        : "font-semibold text-slate-900"
                                                    : isBlue
                                                        ? "text-white/75"
                                                        : "text-gray-400"
                                            }`}
                                        >
                                            {label}
                                        </span>

                                        {i !== STEPS.length - 1 && (
                                            <ChevronRight className={`mx-1 h-4 w-4 ${isBlue ? "text-white/60" : "text-gray-300"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* WhatsApp button */}
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 ${isBlue ? "bg-white text-cyan-700 hover:bg-cyan-50 focus-visible:ring-white/40" : "bg-primary text-white hover:opacity-90 focus-visible:ring-primary/30"}`}
                        aria-label={`Chat on WhatsApp ${waNumber}`}
                    >
                        <FaWhatsapp className="h-4 w-4" />
                        <span>WhatsApp 24/7</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
