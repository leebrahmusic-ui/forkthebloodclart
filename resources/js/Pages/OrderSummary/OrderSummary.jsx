import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

export default function OrderSummary() {
    const { title } = usePage().props;
    const [mounted, setMounted] = useState(false);
    const [pulseIndex, setPulseIndex] = useState(0);
    const [particles, setParticles] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);

        // Create floating particles
        const newParticles = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 25 + 20,
            delay: Math.random() * 8,
        }));
        setParticles(newParticles);

        // Pulse effect
        const interval = setInterval(() => {
            setPulseIndex((prev) => (prev + 1) % 4);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setGlowPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const orderData = {
        id: "ORD-847392",
        date: "Dec 27, 2025",
        time: "2:34 PM",
        items: [
            { name: "Premium Wireless Headphones", qty: 1, price: 299.99 },
            { name: "Smart Watch Series X", qty: 1, price: 449.99 },
            { name: "Leather Laptop Bag", qty: 2, price: 89.99 },
        ],
        subtotal: 929.96,
        tax: 74.4,
        shipping: 0.0,
        total: 1004.36,
    };

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Animated mesh gradient background */}
            <div className="fixed inset-0 opacity-40">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.03) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 60%)
                        `,
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="fixed inset-0 pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute bg-black rounded-full"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: 0.15,
                            animation: `float ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Container */}
            <div className="relative min-h-screen flex items-center justify-center p-8">
                <div className="w-full max-w-7xl">
                    {/* Grid Layout */}
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        {/* Left Side - 5 columns */}
                        <div className="lg:col-span-5 space-y-12">
                            {/* Status with animated underline */}
                            <div
                                className={`transition-all duration-1200 ${
                                    mounted
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-16"
                                }`}
                            >
                                <div className="relative inline-block mb-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative w-2 h-2">
                                            <div className="absolute inset-0 bg-black rounded-full" />
                                            <div className="absolute inset-0 bg-black rounded-full animate-ping" />
                                        </div>
                                        <span className="text-xs font-medium tracking-[0.3em] uppercase text-gray-500">
                                            Confirmed
                                        </span>
                                    </div>
                                    <div
                                        className="absolute bottom-0 left-0 h-px bg-black transition-all duration-1000"
                                        style={{
                                            width: mounted ? "100%" : "0%",
                                        }}
                                    />
                                </div>

                                <h1 className="text-8xl font-extralight mb-8 leading-none tracking-tight text-black">
                                    Thank
                                    <br />
                                    <span className="font-semibold">You</span>
                                </h1>

                                <div className="space-y-6">
                                    <p className="text-xl text-gray-700 leading-relaxed font-light">
                                        Your payment has been processed
                                        successfully.
                                    </p>
                                    <p className="text-base text-gray-500 leading-relaxed">
                                        We've sent a confirmation email with
                                        your order details. You'll receive
                                        shipping updates as your order moves.
                                    </p>
                                </div>
                            </div>

                            {/* Order Meta with hover effect */}
                            <div
                                className={`relative border border-gray-200 p-10 transition-all duration-1200 delay-200 group hover:border-black ${
                                    mounted
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-16"
                                }`}
                                onMouseMove={handleMouseMove}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle 200px at ${glowPosition.x}px ${glowPosition.y}px, black, transparent)`,
                                    }}
                                />
                                <div className="relative space-y-6">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                                            Order Number
                                        </div>
                                        <div className="text-3xl font-mono font-bold text-black tracking-tight">
                                            {orderData.id}
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-200" />
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                                                Date
                                            </div>
                                            <div className="text-base font-medium text-black">
                                                {orderData.date}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                                                Time
                                            </div>
                                            <div className="text-base font-medium text-black">
                                                {orderData.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={` pt-5 transition-all duration-1200 delay-900 ${
                                    mounted
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                }`}
                            >
                                <p className="text-[13px] uppercase tracking-[0.3em] text-dark/90">
                                    Need Help?{" "}
                                    <span> Contact support@store.com </span>
                                </p>
                            </div>
                        </div>

                        {/* Right Side - 7 columns */}
                        <div className="lg:col-span-7 space-y-12">
                            {/* Items List with parallax hover */}
                            <div
                                className={`transition-all duration-1200 delay-300 ${
                                    mounted
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-16"
                                }`}
                            >
                                <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-10">
                                    Order Summary
                                </h2>

                                <div className="space-y-0 border border-gray-200">
                                    {orderData.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group"
                                            onMouseEnter={() =>
                                                setHoveredItem(idx)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredItem(null)
                                            }
                                        >
                                            <div
                                                className={`absolute inset-0 bg-black transition-all duration-500 ${
                                                    hoveredItem === idx
                                                        ? "opacity-[0.02]"
                                                        : "opacity-0"
                                                }`}
                                            />
                                            <div className="relative flex items-center justify-between p-8 transition-all duration-500">
                                                <div className="flex-1 space-y-2">
                                                    <div
                                                        className={`text-xl text-black font-light transition-all duration-500 ${
                                                            hoveredItem === idx
                                                                ? "translate-x-2"
                                                                : ""
                                                        }`}
                                                    >
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Quantity: {item.qty}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-8">
                                                    <div className="text-2xl font-mono font-medium text-black">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            {idx <
                                                orderData.items.length - 1 && (
                                                <div className="h-px bg-gray-200 mx-8" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Section with reveal animation */}
                            <div
                                className={`transition-all duration-1200 delay-500 ${
                                    mounted
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-16"
                                }`}
                            >
                                <div className="bg-black text-white p-12">
                                    <div className="space-y-8">
                                        <div className="space-y-5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                                    Subtotal
                                                </span>
                                                <span className="font-mono text-base">
                                                    $
                                                    {orderData.subtotal.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                                    Shipping
                                                </span>
                                                <span className="font-mono text-base">
                                                    {orderData.shipping === 0
                                                        ? "Free"
                                                        : `$${orderData.shipping.toFixed(
                                                              2
                                                          )}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                                    Tax
                                                </span>
                                                <span className="font-mono text-base">
                                                    ${orderData.tax.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/20" />

                                        <div className="flex justify-between items-end pt-4">
                                            <span className="text-2xl font-extralight">
                                                Total Paid
                                            </span>
                                            <span className="text-6xl font-mono font-bold tracking-tight">
                                                ${orderData.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    33% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    66% {
                        transform: translateY(10px) translateX(-10px);
                    }
                }
            `}</style>
            </div>
        </>
    );
}
