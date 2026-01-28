"use client";

import {
    Home,
    Building2,
    Castle,
    Building,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const homeTypes = [
    {
        name: "Terrace",
        icon: Home,
        tag: "Home type",
        description: "Compact, efficient boilers for Leeds terrace homes.",
    },
    {
        name: "Semi-detached",
        icon: Building2,
        tag: "Home type",
        description: "Balanced options for everyday family heating.",
    },
    {
        name: "Detached",
        icon: Castle,
        tag: "Home type",
        description: "High-capacity systems for larger Leeds properties.",
    },
    {
        name: "Flat",
        icon: Building,
        tag: "Home type",
        description: "Space‑saving installs for flats and apartments.",
    },
];

export function HomeTypesStrip() {
    const scrollRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);

    const scrollByStep = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const step = container.clientWidth / 2;
        const delta = direction === "left" ? -step : step;

        container.scrollBy({
            left: delta,
            behavior: "smooth",
        });
    };

    const handlePrev = () => scrollByStep("left");
    const handleNext = () => scrollByStep("right");

    const onMouseDown = (e) => {
        const container = scrollRef.current;
        if (!container) return;

        isDragging.current = true;
        container.classList.add("cursor-grabbing");
        startX.current = e.clientX;
        startScrollLeft.current = container.scrollLeft;
    };

    const onMouseMove = (e) => {
        const container = scrollRef.current;
        if (!container || !isDragging.current) return;

        e.preventDefault();
        const dx = e.clientX - startX.current;
        container.scrollLeft = startScrollLeft.current - dx;
    };

    const endDrag = () => {
        const container = scrollRef.current;
        if (!container) return;

        isDragging.current = false;
        container.classList.remove("cursor-grabbing");
    };

    useEffect(() => {
        const end = () => endDrag();
        window.addEventListener("mouseup", end);
        return () => window.removeEventListener("mouseup", end);
    }, []);

    return (
        <section className="bg-white py-20">
            {/* FLEX ROW ON DESKTOP — BOTH SIDES EXACT 50% */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 lg:flex lg:items-center lg:gap-16">
                {/* LEFT = 50% WIDTH */}
                <div className="w-full lg:w-[40%] flex flex-col justify-between gap-10 mb-12 lg:mb-0">
                    <div>
                        <p className="mb-4 text-sm font-semibold tracking-wide text-emerald-600">
                            Tailored for Leeds & Surrounding homes
                        </p>

                        <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            The right boiler for every Leeds & Surrounding home.
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600">
                            We match your home size, usage and budget with a
                            fixed‑price quote and a clean install.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePrev}
                            className="flex h-11 w-11 items-center cursor-pointer justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex h-11 w-11 items-center cursor-pointer justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* RIGHT = 50% WIDTH */}
                <div className="w-full lg:w-[60%] relative">
                    <div className="overflow-hidden">
                        <div
                            ref={scrollRef}
                            className="
                                flex gap-6 
                                overflow-x-auto 
                                scroll-smooth 
                                snap-x snap-mandatory 
                                cursor-grab 
                                no-scrollbar
                            "
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseLeave={endDrag}
                        >
                            {homeTypes.map((type) => (
                                <article
                                    key={type.name}
                                    className="
                                        snap-center
                                        shrink-0
                                        basis-[85%]
                                        sm:basis-[70%]
                                        lg:basis-1/2
                                        xl:basis-[45%]
                                    "
                                >
                                    <div className="flex h-full relative flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                                        <div>
                                            {/* Top-right badge */}
                                            <div className="absolute top-4 right-4 z-50 w-12 text-center h-12 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[8px] font-medium text-emerald-700 leading-2.5">
                                                {type.tag}
                                            </div>

                                            <div className="mb-5 flex items-center gap-4">
                                                {/* Icon wrapper – don't let it stretch */}
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                                                    <type.icon className="h-6 w-6 text-emerald-700" />
                                                </div>

                                                <h3 className="text-2xl font-bold leading-7 max-w-32 text-slate-900 sm:text-3xl">
                                                    {type.name} homes
                                                </h3>
                                            </div>

                                            <p className="max-w-md text-sm leading-relaxed text-slate-600">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
