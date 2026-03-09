import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HELP_ADVICE_MEGA_CARDS } from "@/data/helpAdviceLinks";

// Content for each tab's mega section
const MEGA_SECTIONS = {
    services: [
        {
            title: "New boiler quote",
            description:
                "Start your fixed-price new boiler quote in a few quick steps.",
            href: "/book/quote/new",
        },
        {
            title: "Boiler servicing",
            description:
                "Book an annual boiler service with clear local pricing.",
            href: "/book/quote/service",
        },
        {
            title: "Boiler repairs",
            description:
                "Report your fault and book a repair visit from a local engineer.",
            href: "/book/quote/repair",
        },
        {
            title: "Powerflush",
            description:
                "Get a powerflush quote to improve system performance.",
            href: "/book/quote/powerflush",
        },
    ],
    about: [
        {
            title: "Why choose MD Gas?",
            description:
                "Local engineers focused on safety, clarity and care.",
            href: "/about",
        },
        {
            title: "Our qualifications",
            description:
                "Gas Safe Register 636354. Fully certified and insured.",
            href: "/about#qualification",
        },
        {
            title: "Our service areas",
            description:
                "Leeds & Surrounding areas only — fast local support.",
            href: "/about#services-area",
        },
    ],
    contact: [
        {
            title: "Engineer callback",
            description:
                "Request a callback and a local engineer will phone you back.",
            href: "/#contact",
        },
        {
            title: "WhatsApp chat 24/7",
            description:
                "Message us any time on WhatsApp for quick, clear help.",
            href: "/#contact",
        },
        {
            title: "Fixed-price quotes",
            description:
                "Simple questions, clear pricing, no pushy sales visits.",
            href: "/#contact",
        },
    ],
    advice: HELP_ADVICE_MEGA_CARDS,
};

// Pills in the centre of the header
const NAV_ITEMS = [
    { id: "services", label: "Services" },
    { id: "advice", label: "Help & Advice" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
];

export default function Header({
    textColor = "text-slate-900",
    buttonBg = "bg-dark",
    buttonText = "text-white",
    navInactive = "bg-white/80 text-slate-800",
    navActive = "bg-black text-white",
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    const isMegaOpen = !!openMenu;

    const toggleMenu = (id) => {
        setOpenMenu((prev) => (prev === id ? null : id));
    };

    const closeMega = () => setOpenMenu(null);

    // Close mega with Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeMega();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const currentCards = openMenu ? MEGA_SECTIONS[openMenu] : [];

    return (
        <header className="absolute top-4 w-full z-50">
            <div className="relative">
                {/* Top bar */}
                <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-2 lg:px-6">
                    {/* Logo */}
                    <Link href="/" className="w-[170px]">
                        <img src="/images/logo%20FIXED.png" alt="MD Gas Leeds" />
                    </Link>

                    {/* Centre nav (desktop) */}
                    <nav className="hidden flex-1 items-center justify-center gap-3 md:flex z-50">
                        {NAV_ITEMS.map((item) => {
                            const active = openMenu === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleMenu(item.id)}
                                    className={`rounded-full px-6 py-2 text-sm font-medium transition shadow-sm cursor-pointer ${
                                        active ? navActive : navInactive
                                    }
                                        `}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-4">

                        {/* Call button */}
                        <button
                            type="button"
                            onClick={() =>
                                window.open(
                                    "https://wa.me/447454796398",
                                    "_blank"
                                )
                            }
                            className={`hidden gap-2 items-center rounded-full px-4 py-2 text-sm font-medium cursor-pointer ${buttonBg} ${buttonText} hover:opacity-80 transition sm:flex`}
                        >
                            <AiOutlineWhatsApp className="h-4 w-4" />
                            <span>WhatsApp 24/7</span>
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden rounded-full p-2 text-slate-700 hover:bg-white/60"
                            onClick={() => {
                                setMobileMenuOpen((open) => !open);
                                closeMega();
                            }}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ===== Dark overlay when ANY mega menu is open ===== */}
                {isMegaOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[1px]"
                        onClick={closeMega}
                    />
                )}

                {/* Mega menu (desktop only) */}
                {isMegaOpen && (
                    <div className="pointer-events-auto hidden md:block">
                        {/* absolute is relative to the .relative wrapper above */}
                        <div className="absolute left-1/2 top-0 z-30 w-full max-w-3xl -translate-x-1/2 px-4 pb-6 sm:px-6 lg:px-8">
                            <div className="mt-2 rounded-3xl bg-white shadow-xl">
                                <div className={`grid grid-cols-1 gap-6 p-6 md:p-8 !pt-20 ${openMenu === "services" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                                    {currentCards.map((card) => (
                                        <Link
                                            key={card.title}
                                            href={card.href}
                                            onClick={closeMega}
                                            className="group flex flex-col justify-between rounded-2xl bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-slate-100 hover:shadow-md"
                                        >
                                            <div>
                                                <h3 className="mb-2 text-base font-semibold text-slate-900">
                                                    {card.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {card.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-1">
                                                    <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile menu (simple, no mega) */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
                        <nav className="flex flex-col space-y-2 px-4 py-4">
                            <Link
                                href="/#services"
                                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                href="/about"
                                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/advice"
                                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Help & Advice
                            </Link>
                            <Link
                                href="/#contact"
                                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
