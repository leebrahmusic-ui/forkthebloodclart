import { useEffect, useMemo, useState } from "react";

const renderStars = (rating = 0) => {
    const safe = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★".repeat(Math.round(safe)) + "☆".repeat(5 - Math.round(safe));
};

const truncate = (text = "", max = 220) => {
    if (!text || text.length <= max) return text;
    return `${text.slice(0, max).trim()}…`;
};

const initialsFromName = (name = "") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "GU";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export function GoogleReview({ theme = "light" }) {
    const [loading, setLoading] = useState(true);
    const [payload, setPayload] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isBlue = theme === "blue";

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const res = await fetch("/google-reviews", {
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                });

                const data = await res.json();

                if (mounted) {
                    setPayload(data || null);
                }
            } catch {
                if (mounted) setPayload(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const reviews = useMemo(() => {
        const all = Array.isArray(payload?.reviews) ? payload.reviews : [];
        return [...all]
            .sort((a, b) => {
                const ta = a?.time ? new Date(a.time).getTime() : 0;
                const tb = b?.time ? new Date(b.time).getTime() : 0;
                return tb - ta;
            })
            .slice(0, 30);
    }, [payload]);

    useEffect(() => {
        setActiveIndex(0);
    }, [reviews.length]);

    useEffect(() => {
        if (reviews.length <= 1) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % reviews.length);
        }, 6500);

        return () => clearInterval(timer);
    }, [reviews.length]);

    const goPrev = () => {
        if (reviews.length <= 1) return;
        setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const goNext = () => {
        if (reviews.length <= 1) return;
        setActiveIndex((prev) => (prev + 1) % reviews.length);
    };

    if (loading) {
        return (
            <section
                className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12"}
                style={isBlue ? {
                    background: "#00ABDB",
                    backgroundImage: "radial-gradient(circle at top, rgba(255,255,255,0.07), rgba(255,255,255,0) 44%), linear-gradient(180deg, #0098c4 0%, #007ea3 100%)",
                } : undefined}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className={isBlue
                        ? "rounded-3xl border border-white/40 bg-[var(--qb-panel)] p-6 shadow-sm"
                        : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"}>
                        <p className={isBlue ? "text-sm text-white/90" : "text-sm text-slate-500"}>Loading Google reviews…</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!payload?.configured || reviews.length === 0) {
        return null;
    }

    return (
        <section
            className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12 no-auto-dark-surface"}
            style={isBlue ? {
                background: "#00ABDB",
                backgroundImage: "radial-gradient(circle at top, rgba(255,255,255,0.07), rgba(255,255,255,0) 44%), linear-gradient(180deg, #0098c4 0%, #007ea3 100%)",
            } : undefined}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className={isBlue
                    ? "rounded-3xl border border-white/35 bg-[var(--qb-panel)] p-6 shadow-sm"
                    : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm no-auto-dark-card"}>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className={isBlue
                                ? "text-xs font-semibold uppercase tracking-[0.15em] text-white/85"
                                : "text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"}>
                                Google Reviews
                            </p>
                            <h3 className={isBlue ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"} style={isBlue ? { color: "#ffffff" } : undefined}>
                                {payload.name || "Our customers on Google"}
                            </h3>
                            <p className={isBlue ? "mt-1 text-xs text-cyan-100 font-semibold" : "mt-1 text-xs text-emerald-700 font-semibold"}>
                                Latest Google profile reviews
                            </p>
                        </div>

                        <div className="text-right">
                            <p className={isBlue ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>
                                {renderStars(payload.rating)}
                            </p>
                            <p className={isBlue ? "text-sm text-cyan-100" : "text-sm text-slate-600"}>
                                {payload.rating?.toFixed?.(1) ?? "-"} from {payload.user_ratings_total ?? "-"} reviews
                            </p>
                        </div>
                    </div>

                    <div className={isBlue
                        ? "overflow-hidden rounded-2xl border border-white/35 bg-[var(--qb-deep)]"
                        : "overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50"}>
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {reviews.map((review, idx) => (
                                <article
                                    key={`${review.author_name || "review"}-${idx}`}
                                    className="w-full shrink-0 p-6 md:p-8"
                                >
                                    <div className="flex items-start gap-4">
                                        {review.profile_photo_url ? (
                                            <img
                                                src={review.profile_photo_url}
                                                alt={review.author_name || "Google reviewer"}
                                                className={isBlue
                                                    ? "h-12 w-12 shrink-0 rounded-full border border-white/40 object-cover"
                                                    : "h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className={isBlue
                                                ? "h-12 w-12 shrink-0 rounded-full border border-white/40 bg-white/20 text-xs font-bold text-white grid place-items-center"
                                                : "h-12 w-12 shrink-0 rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 grid place-items-center"}>
                                                {initialsFromName(review.author_name)}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className={isBlue ? "text-sm font-semibold text-white truncate" : "text-sm font-semibold text-slate-900 truncate"}>
                                                {review.author_name}
                                            </p>
                                            <p className={isBlue ? "text-xs text-cyan-100" : "text-xs text-slate-500"}>
                                                {review.relative_time_description}
                                            </p>
                                            <p className="mt-1 text-base leading-none text-amber-500">
                                                {renderStars(review.rating)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className={isBlue
                                        ? "mt-4 text-sm leading-relaxed text-white/95 md:text-base"
                                        : "mt-4 text-sm leading-relaxed text-slate-700 md:text-base"}>
                                        {truncate(review.text, 460)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>

                    {reviews.length > 1 ? (
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={goPrev}
                                className={isBlue
                                    ? "rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                                    : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"}
                                aria-label="Previous review"
                            >
                                ←
                            </button>

                            {reviews.map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2.5 w-2.5 rounded-full transition ${
                                        activeIndex === index
                                            ? isBlue
                                                ? "bg-white"
                                                : "bg-emerald-600"
                                            : isBlue
                                            ? "bg-white/40 hover:bg-white/60"
                                            : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                                    aria-label={`Go to review ${index + 1}`}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={goNext}
                                className={isBlue
                                    ? "rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                                    : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"}
                                aria-label="Next review"
                            >
                                →
                            </button>
                        </div>
                    ) : null}

                    {payload.maps_url ? (
                        <div className="mt-4 text-right">
                            <a
                                href={payload.maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className={isBlue
                                    ? "text-sm font-semibold text-white hover:text-cyan-100"
                                    : "text-sm font-semibold text-emerald-700 hover:text-emerald-800"}
                            >
                                View all on Google
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
