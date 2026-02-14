import React, { useState } from "react";
import {
    FiX,
    FiThermometer,
    FiZap,
    FiHome,
    FiDroplet,
    FiCheckCircle,
    FiMessageCircle,
    FiThumbsUp,
    FiActivity,
    FiCheck,
} from "react-icons/fi";

export default function PowerModel({
    powerModal,
    selectedPower,
    setSelectedPower,
    onClose,
}) {
    return (
        <>
            {/* Simple overlay - allows scrolling */}
            <div
                onClick={() => onClose(null)}
                className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Scrollable modal container */}
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
                <div className="relative w-full max-w-4xl my-8">
                    {/* Main modal with architectural lines */}
                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-300/50 overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="sticky top-0 z-10 px-10 pt-8 pb-2 bg-white border-b border-slate-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                            <FiZap className="text-white text-lg" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                                            Power Configuration
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Select Boiler Output
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onClose(null)}
                                    className="h-10 w-10 rounded-full cursor-pointer border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center transition-all hover:scale-110 group"
                                >
                                    <FiX className="text-slate-500 group-hover:text-slate-700 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="">
                            <div className="p-8">
                                {/* Current selection */}
                                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-500">
                                                Selected Boiler
                                            </div>
                                            <div className="font-bold text-slate-900 text-lg">
                                                {powerModal.brand}
                                            </div>
                                            <div className="text-slate-600">
                                                {powerModal.name}
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-sm text-slate-500">
                                                Current Selection
                                            </div>
                                            <div className="text-3xl font-bold text-primary">
                                                {selectedPower}kW
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Power toggle */}
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-8 px-8 py-3 bg-slate-50 rounded-full border border-slate-100">
                                        <div
                                            className={`text-lg font-bold transition-all ${
                                                selectedPower === "25"
                                                    ? "text-primary"
                                                    : "text-dark/60"
                                            }`}
                                        >
                                            25kW
                                        </div>

                                        {/* Unique toggle switch */}
                                        <button
                                            onClick={() =>
                                                setSelectedPower((prev) =>
                                                    prev === "25" ? "30" : "25"
                                                )
                                            }
                                            className="relative w-16 h-8 cursor-pointer"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full" />
                                            <div
                                                className={`absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-lg transition-all duration-300 ${
                                                    selectedPower === "25"
                                                        ? "left-0.5"
                                                        : "left-8"
                                                }`}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div
                                                        className={`w-4 h-4 rounded-full transition-all ${
                                                            selectedPower ===
                                                            "25"
                                                                ? "bg-primary"
                                                                : "bg-dark"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </button>

                                        <div
                                            className={`text-lg font-bold transition-all ${
                                                selectedPower === "30"
                                                    ? "text-dark"
                                                    : "text-dark/60"
                                            }`}
                                        >
                                            30kW
                                        </div>
                                    </div>
                                </div>

                                {/* Power options with system load */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                    <div className="space-y-4">
                                        {/* 25kW Option */}
                                        <div
                                            className={`relative transition-all duration-300 ${
                                                selectedPower === "25"
                                                    ? "opacity-100"
                                                    : "opacity-60"
                                            }`}
                                        >
                                            <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-slate-300 rounded-tl-lg" />
                                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-slate-300 rounded-br-lg" />

                                            <div className="bg-white rounded-xl border-2 border-slate-100 p-6 h-full">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-3xl font-bold text-primary">
                                                            25kW
                                                        </div>
                                                        <div className="text-sm text-secondary/90">
                                                            Standard Power
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                            selectedPower ===
                                                            "25"
                                                                ? "bg-secondary/10 text-primary border border-emerald-100"
                                                                : "bg-slate-50 text-slate-600 border border-slate-100"
                                                        }`}
                                                    >
                                                        £
                                                        {powerModal.price.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 30kW Option */}
                                        <div
                                            className={`relative transition-all duration-300 ${
                                                selectedPower === "30"
                                                    ? "opacity-100"
                                                    : "opacity-60"
                                            }`}
                                        >
                                            <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-slate-300 rounded-tl-lg" />
                                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-slate-300 rounded-br-lg" />

                                            <div className="bg-white rounded-xl border-2 border-slate-100 p-6 h-full">
                                                <div className="flex items-center justify-between ">
                                                    <div>
                                                        <div className="text-3xl font-bold text-dark">
                                                            30kW
                                                        </div>
                                                        <div className="text-sm text-dark/60">
                                                            Premium Power
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                            selectedPower ===
                                                            "30"
                                                                ? "bg-dark text-white"
                                                                : "bg-slate-50 text-slate-600 border border-slate-100"
                                                        }`}
                                                    >
                                                        £
                                                        {(
                                                            powerModal.price +
                                                            100
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* System Load Component - Centered */}
                                    <div className="flex flex-col items-center justify-center lg:col-span-1">
                                        <div className="relative bg-white rounded-xl border-2 border-slate-100 p-6 w-full max-w-xs">
                                            {/* System Load Bar */}
                                            <div className="relative w-full flex flex-col items-center">
                                                <div className="relative w-16 h-[180px] rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                                    {/* Fill */}
                                                    <div
                                                        className={`absolute bottom-0 left-0 right-0 transition-all duration-700
                                                        ${
                                                            selectedPower ===
                                                            "25"
                                                                ? "h-[60%] bg-gradient-to-t from-primary to-seborder-secondary"
                                                                : "h-[45%] bg-gradient-to-t from-dark to-transparent"
                                                        }
                                                    `}
                                                    />

                                                    {/* Gradient overlay for depth */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                                                    {/* Scale markers */}
                                                    <div className="absolute inset-0 flex flex-col justify-between py-4 text-[10px] text-slate-400">
                                                        {[
                                                            "HIGH",
                                                            "NORMAL",
                                                            "LOW",
                                                        ].map(
                                                            (label, index) => (
                                                                <div
                                                                    key={label}
                                                                    className="flex items-center gap-2 px-1"
                                                                >
                                                                    <div className="flex-1 h-px bg-slate-300/70" />
                                                                    <span className="font-medium">
                                                                        {label}
                                                                    </span>
                                                                    <div className="flex-1 h-px bg-slate-300/70" />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    {/* Current indicator line */}
                                                    <div
                                                        className={`absolute left-0 right-0 border-t-2 border-dashed transition-all duration-700
                                                        ${
                                                            selectedPower ===
                                                            "25"
                                                                ? "border-secondary/50 bottom-[60%]"
                                                                : "border-slate-500/50 bottom-[45%]"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                                        <div>
                                            <div className="font-bold text-slate-900 mb-2">
                                                Expert Recommendation
                                            </div>
                                            <p className="text-slate-700">
                                                Based on your survey, the{" "}
                                                <span className="font-bold">
                                                    {selectedPower}kW
                                                </span>{" "}
                                                model is recommended.
                                                {selectedPower === "25"
                                                    ? " It provides optimal efficiency for your current home setup."
                                                    : " It offers future-proof capacity for potential home extensions or additional bathrooms."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendation */}
                            </div>
                        </div>

                        {/* Sticky footer with action buttons */}
                        <div className="sticky bottom-0 border-t border-slate-100 px-10 py-6 bg-white shadow-lg">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <div className="text-sm text-slate-500">
                                        Total Investment
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-4xl font-bold text-slate-900">
                                            £
                                            {selectedPower === "25"
                                                ? powerModal.price.toLocaleString()
                                                : (
                                                      powerModal.price + 100
                                                  ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="px-8 py-3.5 rounded-xl cursor-pointer border-2 border-dark/40 hover:border-dark/60 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                        <FiMessageCircle />
                                        <span>Speak with Expert</span>
                                    </button>

                                    <button className="px-10 py-3.5 rounded-xl cursor-pointer bg-gradient-to-r from-primary/70 to-secondary/70 hover:from-primary hover:to-secondary text-white font-bold shadow-lg hover:shadow-xl transition-colors duration-300 flex items-center justify-center gap-2">
                                        <FiCheckCircle />
                                        <span>Select {selectedPower}kW</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
