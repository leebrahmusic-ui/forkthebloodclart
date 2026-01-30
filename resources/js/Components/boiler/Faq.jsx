"use client";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

const FAQ_LIST = [
    {
        q: "Who do you cover?",
        a: "Leeds and surrounding areas only, so we can keep response times fast and local.",
    },
    {
        q: "How can I contact you?",
        a: "WhatsApp chat 24/7 or request an engineer callback. We don’t use phone queues or email forms.",
    },
    {
        q: "What services do you provide?",
        a: "Boiler installation, servicing, repairs, power flushes, and heating upgrades.",
    },
    {
        q: "Are you Gas Safe registered?",
        a: "Yes — Gas Safe Register number 636354. All work is completed by qualified engineers.",
    },
    {
        q: "Do you offer fixed prices?",
        a: "Yes. Fixed‑price quotes with clear breakdowns and no hidden extras.",
    },
    {
        q: "How fast can you install?",
        a: "Often within days, depending on availability and boiler choice.",
    },
    {
        q: "Do you do emergency repairs?",
        a: "We’ll always try to help quickly. WhatsApp us and we’ll advise the fastest option.",
    },
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const displayedFaqs = showAll ? FAQ_LIST : FAQ_LIST.slice(0, 5);

    return (
        <section className="bg-slate-50 py-20 rounded-b-[45px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                {/* Header */}
                <div className="mb-16 max-w-3xl mx-auto text-center">
                    <span className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                        Leeds & Surrounding support
                    </span>
                    <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900">
                        Questions, answered
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="relative">
                    <div className="space-y-6">
                        {displayedFaqs.map((item, index) => {
                            const isOpen = openIndex === index;
                            const isNewItem = showAll && index >= 5;

                            return (
                                <div
                                    key={index}
                                    className="relative"
                                    style={
                                        isNewItem
                                            ? {
                                                  animation:
                                                      "faqFadeUp 0.45s ease-out forwards",
                                                  animationDelay: `${
                                                      (index - 5) * 70
                                                  }ms`,
                                              }
                                            : undefined
                                    }
                                >
                                    {/* Card */}
                                    <button
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : index)
                                        }
                                        className={`
                                            group relative w-full cursor-pointer
                                            border
                                            px-8 py-6
                                            flex flex-col items-center gap-3
                                            text-center
                                            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
                                            ${
                                                isOpen
                                                    ? "bg-white border-emerald-200 shadow-[0_22px_50px_-30px_rgba(0,0,0,0.2)]"
                                                    : "bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md"
                                            }
                                        `}
                                    >
                                        {/* Rail dot */}
                                        <span
                                            className={`
                                                absolute left-1/2 top-4 -translate-x-1/2
                                                h-3 w-3 rounded-full
                                                transition-all duration-300
                                                ${
                                                    isOpen
                                                        ? "bg-emerald-500 ring-4 ring-emerald-100"
                                                        : "bg-emerald-200"
                                                }
                                            `}
                                        />

                                        {/* Question */}
                                        <span
                                            className={`
                                                text-lg transition-colors
                                                ${
                                                    isOpen
                                                        ? "font-semibold text-slate-900"
                                                        : "font-medium text-slate-800"
                                                }
                                            `}
                                        >
                                            {item.q}
                                        </span>

                                        {/* Chevron */}
                                        <span
                                            className={`
                                                flex h-9 w-9 items-center justify-center
                                                rounded-full
                                                transition-all duration-300
                                                ${
                                                    isOpen
                                                        ? "bg-emerald-600 text-white rotate-180"
                                                        : "bg-emerald-50 text-emerald-700"
                                                }
                                            `}
                                        >
                                            <IoChevronDown className="text-lg" />
                                        </span>
                                    </button>

                                    {/* Answer */}
                                    <div
                                        className={`
                                            overflow-hidden transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
                                            ${
                                                isOpen
                                                    ? "max-h-[200px] opacity-100"
                                                    : "max-h-0 opacity-0"
                                            }
                                        `}
                                    >
                                        <div className="mt-3 rounded-sm bg-white px-6 py-5 text-[15px] leading-relaxed text-slate-600 text-center border border-slate-200 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)]">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* View all / Show less */}
                <div className="mt-14 flex justify-center">
                    <button
                        onClick={() => {
                            setShowAll((prev) => !prev);
                            setOpenIndex(0);
                        }}
                        className="
                            inline-flex items-center gap-3 cursor-pointer
                            rounded-full
                            border border-slate-300
                            bg-white
                            px-6 py-3
                            text-sm font-semibold text-slate-900
                            transition-all duration-300
                            hover:border-emerald-300 hover:shadow-md
                        "
                    >
                        {showAll ? "Show less questions" : "View all questions"}

                        <IoChevronDown
                            className={`transition-transform duration-300 ${
                                showAll ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}
