import React from "react";
import {
    FiAward,
    FiHeart,
    FiTag,
    FiStar,
    FiShield,
    FiZap,
} from "react-icons/fi";

const BENEFITS = [
    {
        title: "Leeds specialists.",
        description:
            "Local engineers who know Leeds homes and install cleanly.",
        icon: FiAward,
        iconColor: "text-emerald-500",
    },
    {
        title: "WhatsApp-first support.",
        description:
            "Chat 24/7 on WhatsApp or request a callback.",
        icon: FiHeart,
        iconColor: "text-emerald-500",
    },
    {
        title: "Transparent pricing.",
        description:
            "Fixed‑price quotes with no hidden extras.",
        icon: FiTag,
        iconColor: "text-emerald-500",
    },
    {
        title: "Engineer callbacks.",
        description:
            "Need a call? A local engineer will call you back.",
        icon: FiStar,
        iconColor: "text-emerald-500",
    },
    {
        title: "Efficiency focused.",
        description:
            "Modern options that improve efficiency and reduce waste.",
        icon: FiShield,
        iconColor: "text-emerald-500",
    },
    {
        title: "Certified engineers.",
        description: "Fully qualified for boiler and heating work.",
        icon: FiZap,
        iconColor: "text-emerald-500",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="relative bg-white py-16 sm:py-20">
            {/* background fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                {/* heading */}
                <header className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                            Why choose us
                        </span>
                    </div>

                    <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
                        Built for Leeds & Surrounding homeowners
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-slate-600">
                        Clear pricing, direct contact, and tidy installs.
                    </p>
                </header>

                {/* cards grid */}
                <div className="mt-14 grid gap-6 md:grid-cols-2 items-stretch">
                    {BENEFITS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article
                                key={item.title}
                                className="
                                    relative flex h-full flex-col items-center gap-4 text-center
                                    rounded-2xl border border-slate-200 
                                    bg-white
                                    p-5 sm:p-6 
                                    shadow-[0_10px_30px_rgba(15,23,42,0.08)] 
                                    transition-colors duration-300 
                                    hover:border-emerald-300
                                "
                            >
                                {/* Accent bar that always matches card height */}
                                <span
                                    className="
                                        pointer-events-none
                                        absolute inset-y-2 left-0
                                        w-[3px]
                                        rounded-full 
                                        bg-emerald-400
                                        shadow-[0_0_8px_rgba(16,185,129,0.35)]
                                    "
                                />

                                {/* Icon tile */}
                                <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-emerald-100">
                                        <Icon
                                            className={`h-6 w-6 ${item.iconColor}`}
                                        />
                                    </div>
                                </div>

                                {/* Text area */}
                                <div className="flex flex-col flex-1 items-center">
                                    <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-[13px] sm:text-sm leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>

                                    {/* filler to help equalize height */}
                                    <div className="flex-1" />
                                </div>
                            </article>
                        );
                    })}
                </div>

                <p className="mt-10 text-center text-base text-slate-500">
                    Local, transparent, and engineer‑led.
                </p>
            </div>
        </section>
    );
}
