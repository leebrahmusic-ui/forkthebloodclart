import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const STEPS = ["Choose", "Customise", "Book", "Complete"];

export function PageHeader({ variant = "default", currentStep = 4 }) {
    const waHref = "https://wa.me/447454796398";
    const waNumber = "+447454796398";

    return (
        <header className="border border-b-dark/15 bg-foreground">
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
                                                        ? "border-2 border-primary text-primary"
                                                        : "border border-gray-300 text-gray-400"
                                                }
                                            `}
                                        >
                                            {step}
                                        </div>

                                        <span
                                            className={`text-sm ${
                                                active
                                                    ? "font-semibold text-dark"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {label}
                                        </span>

                                        {i !== STEPS.length - 1 && (
                                            <ChevronRight className="h-4 w-4 text-gray-300 mx-1" />
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
                        className="inline-flex items-center gap-2 rounded-full bg-dark text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
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
