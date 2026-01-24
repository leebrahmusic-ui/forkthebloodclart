import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

export default function ComingSoon() {
    const { title } = usePage().props;
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [waveOffset, setWaveOffset] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);

    useEffect(() => {
        setMounted(true);

        const waveInterval = setInterval(
            () => setWaveOffset((p) => (p + 1) % 360),
            30
        );
        const rotationInterval = setInterval(
            () => setRotationAngle((p) => (p + 0.5) % 360),
            20
        );
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 150);
            }
        }, 3000);

        return () => {
            clearInterval(waveInterval);
            clearInterval(rotationInterval);
            clearInterval(glitchInterval);
        };
    }, []);

    const handleMouseMove = (e) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
        });
    };

    const floatingElements = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 40,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * -20,
    }));

    return (
        <>
            <Head title={title} />
            <div
                className="min-h-screen relative overflow-hidden"
                style={{
                    "--primary": "#0067ff",
                    "--secondary": "#172a44",
                    background:
                        "linear-gradient(135deg, var(--secondary), #0f1f33, var(--secondary))",
                }}
                onMouseMove={handleMouseMove}
            >
            {/* Floating orbs */}
            {floatingElements.map((el) => (
                <div
                    key={el.id}
                    className="absolute rounded-full blur-3xl opacity-20"
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: `${el.size}px`,
                        height: `${el.size}px`,
                        background:
                            "radial-gradient(circle, rgba(0,103,255,0.35) 0%, rgba(0,103,255,0.15) 50%, transparent 100%)",
                        animation: `float ${el.duration}s ease-in-out infinite`,
                        animationDelay: `${el.delay}s`,
                    }}
                />
            ))}

            {/* Mouse glow */}
            <div
                className="fixed inset-0 pointer-events-none opacity-30 transition-all duration-500"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,103,255,0.35) 0%, transparent 50%)`,
                }}
            />

            {/* Scanlines */}
            <div
                className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
            />

            {/* Main */}
            <div className="relative min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    {/* Rotating frame */}
                    <div className="relative mb-12 flex justify-center">
                        <div
                            className="absolute w-32 h-32"
                            style={{
                                transform: `rotate(${rotationAngle}deg)`,
                            }}
                        >
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-1"
                                    style={{
                                        height: "120px",
                                        transform: `translate(-50%, -50%) rotate(${
                                            i * 45
                                        }deg) translateY(-60px)`,
                                        background:
                                            "linear-gradient(to bottom, var(--primary), transparent)",
                                        opacity: 0.35,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Logo */}
                        <div className="relative z-10">
                            <div
                                className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
                                    mounted
                                        ? "opacity-60 scale-150"
                                        : "opacity-0 scale-0"
                                }`}
                                style={{
                                    background: "var(--primary)",
                                }}
                            />
                            <div
                                className={`relative p-4 rounded-full border-4 transition-all duration-1000 ${
                                    mounted
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-0"
                                }`}
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--primary), #004bb8)",
                                    borderColor: "var(--primary)",
                                }}
                            >
                                <img
                                    src="/favicon.png"
                                    alt="MD Gas Logo"
                                    className="h-20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Glitch headline */}
                    <div className="relative mb-4">
                        <h1
                            className={`text-7xl md:text-9xl font-black transition-all duration-100 ${
                                glitchActive ? "translate-x-1" : "translate-x-0"
                            }`}
                            style={{
                                color: "white",
                                textShadow: glitchActive
                                    ? `2px 2px var(--primary), -2px -2px rgba(0,103,255,0.6)`
                                    : `4px 4px 20px rgba(0,103,255,0.6)`,
                                fontFamily: "Arial Black, sans-serif",
                            }}
                        >
                            NEW BOILER
                        </h1>
                    </div>

                    {/* Wave line */}
                    <div className="relative h-2 max-w-3xl mx-auto mb-8">
                        <svg
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            <path
                                d={`M 0 ${
                                    1 + Math.sin((waveOffset * Math.PI) / 180)
                                } Q 25 ${
                                    0.5 +
                                    Math.sin(
                                        ((waveOffset + 45) * Math.PI) / 180
                                    )
                                }, 50 ${
                                    1 + Math.sin((waveOffset * Math.PI) / 180)
                                } T 100 ${
                                    1 + Math.sin((waveOffset * Math.PI) / 180)
                                }`}
                                stroke="var(--primary)"
                                strokeWidth="3"
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* QUOTE */}
                    <h2
                        className={`text-5xl md:text-7xl font-bold transition-all duration-1000 ${
                            mounted ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, var(--primary), #3b82f6, var(--primary))",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            backgroundSize: "200% auto",
                            animation: "shine 3s linear infinite",
                        }}
                    >
                        QUOTE
                    </h2>

                    {/* Coming soon */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div
                            className={`h-px transition-all duration-1000 ${
                                mounted ? "w-32" : "w-0"
                            }`}
                            style={{ background: "var(--primary)" }}
                        />
                        <p className="text-2xl tracking-[0.4em] text-white/80">
                            COMING SOON
                        </p>
                        <div
                            className={`h-px transition-all duration-1000 ${
                                mounted ? "w-32" : "w-0"
                            }`}
                            style={{ background: "var(--primary)" }}
                        />
                    </div>

                    {/* Dots */}
                    <div className="mt-12 flex gap-3 justify-center">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{
                                    background: "var(--primary)",
                                    animationDelay: `${i * 0.3}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Corners */}
            {["tl", "tr", "bl", "br"].map((pos) => (
                <div
                    key={pos}
                    className={`fixed ${
                        pos.includes("t") ? "top-8" : "bottom-8"
                    } ${pos.includes("l") ? "left-8" : "right-8"} w-20 h-20`}
                    style={{
                        borderColor: "var(--primary)",
                        borderStyle: "solid",
                        borderWidth:
                            pos === "tl"
                                ? "2px 0 0 2px"
                                : pos === "tr"
                                ? "2px 2px 0 0"
                                : pos === "bl"
                                ? "0 0 2px 2px"
                                : "0 2px 2px 0",
                        opacity: 0.4,
                    }}
                />
            ))}

            <style>{`
                @keyframes float {
                    0%,100% { transform: translate(0,0); }
                    25% { transform: translate(20px,-20px); }
                    50% { transform: translate(-20px,20px); }
                    75% { transform: translate(20px,10px); }
                }
                @keyframes shine {
                    to { background-position: 200% center; }
                }
            `}</style>
            </div>
        </>
    );
}
