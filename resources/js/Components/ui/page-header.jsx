import { Link } from "@inertiajs/react";
import { Flame, MessageSquare, ChevronRight } from "lucide-react";
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

                    {/* Slim contact bar (relative so status-blink can be positioned) */}
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="slim-bar relative inline-flex items-center rounded-md px-3 pr-8 py-1.5 gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,103,255,0.16)]"
                        aria-label={`Chat on WhatsApp ${waNumber}`}
                    >
                        {/* icon tile */}
                        <span
                            className="icon-square inline-flex items-center justify-center h-8 w-8 rounded-sm"
                            style={{
                                background: "rgba(0,103,255,0.06)",
                                border: "1px solid rgba(0,103,255,0.06)",
                            }}
                        >
                            <FaWhatsapp className="h-4 w-4 text-primary" />
                        </span>

                        {/* divider */}
                        <span className="divider hidden sm:block" aria-hidden />

                        {/* label (hidden on very small screens) */}
                        <span className="hidden sm:block text-xs font-medium text-dark">
                            Chat now
                        </span>

                        <span
                            className="chev hidden sm:inline-flex items-center justify-center h-6 w-6 rounded-sm"
                            aria-hidden
                        >
                            <ChevronRight className="h-4 w-4 text-primary" />
                        </span>

                        {/* --- ONLINE STATUS: on the RIGHT side of the chat card --- */}
                        <span
                            className="status-blink"
                            aria-hidden="true"
                            title="Online"
                        />
                    </a>
                </div>
            </div>
        </header>
    );
}
