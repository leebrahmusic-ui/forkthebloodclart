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

const formatRating = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "-";
    return n.toFixed(1);
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
                if (mounted) setPayload(data || null);
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
            <section className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12"}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className={isBlue
                        ? "rounded-3xl border border-white/35 bg-[var(--qb-panel)] p-6"
                        : "rounded-3xl border border-slate-200 bg-white p-6"}>
                        <div className="animate-pulse space-y-4">
                            <div className={isBlue ? "h-5 w-40 rounded bg-white/30" : "h-5 w-40 rounded bg-slate-200"} />
                            <div className={isBlue ? "h-28 rounded-2xl bg-white/20" : "h-28 rounded-2xl bg-slate-100"} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!payload?.configured || reviews.length === 0) return null;

    const active = reviews[activeIndex];

    return (
        <section className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12 no-auto-dark-surface"}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className={isBlue
                    ? "rounded-3xl border border-white/35 bg-[var(--qb-panel)] p-6 shadow-sm"
                    : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm no-auto-dark-card"}>

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className={isBlue
                                ? "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/35 bg-white/15 text-lg"
                                : "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg"}>
                                <span aria-hidden>⭐</span>
                            </span>
                            <div>
                                <p className={isBlue
                                    ? "text-xs font-semibold uppercase tracking-[0.15em] text-white/85"
                                    : "text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"}>
                                    Google Reviews
                                </p>
                                <h3 className={isBlue ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>
                                    {payload.name || "Our customers on Google"}
                                </h3>
                                <p className={isBlue ? "mt-1 text-xs font-semibold text-cyan-100" : "mt-1 text-xs font-semibold text-emerald-700"}>
                                    Rated by homeowners in Leeds and surrounding areas
                                </p>
                            </div>
                        </div>

                        <div className={isBlue
                            ? "rounded-2xl border border-white/35 bg-white/10 px-4 py-2 text-right"
                            : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right"}>
                            <p className={isBlue ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>
                                {renderStars(payload.rating)}
                            </p>
                            <p className={isBlue ? "text-sm text-cyan-100" : "text-sm text-slate-600"}>
                                {formatRating(payload.rating)} from {payload.user_ratings_total ?? "-"} reviews
                            </p>
                        </div>
                    </div>

                    <article className={isBlue
                        ? "rounded-2xl border border-white/35 bg-white/10 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
                        : "rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(2,6,23,0.12)]"}>
                        <div className="mb-2 text-xl leading-none text-amber-500/90">“</div>
                        <div className="flex items-start gap-4">
                            {active?.profile_photo_url ? (
                                <img
                                    src={active.profile_photo_url}
                                    alt={active.author_name || "Google reviewer"}
                                    className={isBlue
                                        ? "h-12 w-12 shrink-0 rounded-full border border-white/40 object-cover"
                                        : "h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className={isBlue
                                    ? "grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20 text-xs font-bold text-white"
                                    : "grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700"}>
                                    {initialsFromName(active?.author_name)}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className={isBlue ? "truncate text-sm font-semibold text-white" : "truncate text-sm font-semibold text-slate-900"}>
                                    {active?.author_name}
                                </p>
                                <p className={isBlue ? "text-xs text-cyan-100" : "text-xs text-slate-500"}>
                                    {active?.relative_time_description}
                                </p>
                                <p className="mt-1 text-base leading-none text-amber-500">
                                    {renderStars(active?.rating)}
                                </p>
                            </div>
                        </div>

                        <p className={isBlue
                            ? "mt-4 text-sm leading-relaxed text-white/95 md:text-base"
                            : "mt-4 text-sm leading-relaxed text-slate-700 md:text-base"}>
                            {truncate(active?.text || "", 460)}
                        </p>
                    </article>

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

                            {reviews.slice(0, 6).map((review, i) => {
                                const reviewIndex = i;
                                const isActive = reviewIndex === activeIndex;
                                return (
                                    <button
                                        key={`dot-${review.author_name || i}`}
                                        type="button"
                                        onClick={() => setActiveIndex(reviewIndex)}
                                        className={isBlue
                                            ? `rounded-full border px-3 py-1 text-xs font-semibold transition ${isActive ? "border-white bg-white text-cyan-700" : "border-white/40 bg-white/10 text-white hover:bg-white/20"}`
                                            : `rounded-full border px-3 py-1 text-xs font-semibold transition ${isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                                        aria-label={`Go to review ${reviewIndex + 1}`}
                                    >
                                        {review.author_name?.split(" ")[0] || `#${reviewIndex + 1}`}
                                    </button>
                                );
                            })}

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
                        <div className="mt-4 flex items-center justify-end gap-3">
                            <a
                                href={payload.maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className={isBlue
                                    ? "inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/20"
                                    : "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"}
                            >
                                View all on Google <span aria-hidden>↗</span>
                            </a>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
