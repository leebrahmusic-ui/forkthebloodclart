import { useEffect, useMemo, useState } from "react";

const renderStars = (rating = 0) => {
    const safe = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★".repeat(Math.round(safe)) + "☆".repeat(5 - Math.round(safe));
};

const truncate = (text = "", max = 320) => {
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

function GoogleMark() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.6v2.99h3.87c2.26-2.08 3.57-5.15 3.57-8.62Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-2.99c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.93H1.29v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.28 14.32A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.38-2.32v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.78 1.29 5.42l3.99-3.1Z" />
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.14 15.24 0 12 0A12 12 0 0 0 1.29 6.58l3.99 3.1c.95-2.83 3.6-4.93 6.72-4.93Z" />
        </svg>
    );
}

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

    const activeReview = reviews[activeIndex] ?? null;

    if (loading) {
        return (
            <section className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12"}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                    <div className={isBlue
                        ? "rounded-[32px] border border-white/30 bg-[var(--qb-panel)] p-6 shadow-sm"
                        : "rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"}>
                        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <div className="space-y-4">
                                <div className={isBlue ? "h-12 w-44 rounded-2xl bg-white/20" : "h-12 w-44 rounded-2xl bg-slate-100"} />
                                <div className={isBlue ? "h-32 rounded-[24px] bg-white/15" : "h-32 rounded-[24px] bg-slate-100"} />
                            </div>
                            <div className={isBlue ? "h-[320px] rounded-[28px] bg-white/10" : "h-[320px] rounded-[28px] bg-slate-100"} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!payload?.configured || reviews.length === 0 || !activeReview) return null;

    return (
        <section className={isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12 no-auto-dark-surface"}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className={isBlue
                    ? "overflow-hidden rounded-[32px] border border-white/30 bg-[var(--qb-panel)] shadow-sm"
                    : "overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] no-auto-dark-card"}>
                    <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <aside className={isBlue
                            ? "flex min-h-full flex-col border-b border-white/15 bg-white/8 p-6 lg:border-b-0 lg:border-r lg:border-r-white/15"
                            : "flex min-h-full flex-col border-b border-slate-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r lg:border-r-slate-200"}>
                            <div className="flex items-center gap-3">
                                <span className={isBlue
                                    ? "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"
                                    : "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white"}>
                                    <GoogleMark />
                                </span>
                                <div>
                                    <p className={isBlue
                                        ? "text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70"
                                        : "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"}>
                                        Google Reviews
                                    </p>
                                    <h3 className={isBlue ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"} style={isBlue ? { color: "#ffffff" } : undefined}>
                                        {payload.name || "MD Gas Leeds"}
                                    </h3>
                                </div>
                            </div>

                            <div className={isBlue
                                ? "mt-6 rounded-[24px] border border-white/20 bg-white/10 p-5"
                                : "mt-6 rounded-[24px] border border-slate-200 bg-white p-5"}>
                                <p className={isBlue ? "text-4xl font-bold text-white" : "text-4xl font-bold text-slate-900"}>
                                    {formatRating(payload.rating)}
                                </p>
                                <p className="mt-2 text-lg leading-none text-amber-500">
                                    {renderStars(payload.rating)}
                                </p>
                                <p className={isBlue ? "mt-3 text-sm leading-6 text-cyan-100" : "mt-3 text-sm leading-6 text-slate-600"}>
                                    Rated by homeowners in Leeds and surrounding areas.
                                </p>
                                <p className={isBlue ? "mt-2 text-xs font-medium text-white/70" : "mt-2 text-xs font-medium text-slate-500"}>
                                    Based on {payload.user_ratings_total ?? "-"} verified Google reviews
                                </p>
                            </div>


                            {reviews.length > 1 ? (
                                <div className="mt-6 flex items-center gap-2">
                                    {reviews.slice(0, Math.min(reviews.length, 5)).map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={`Go to review ${index + 1}`}
                                            className={index === activeIndex
                                                ? (isBlue
                                                    ? "h-2.5 w-8 rounded-full bg-white"
                                                    : "h-2.5 w-8 rounded-full bg-emerald-600")
                                                : (isBlue
                                                    ? "h-2.5 w-2.5 rounded-full bg-white/35"
                                                    : "h-2.5 w-2.5 rounded-full bg-slate-300")}
                                        />
                                    ))}
                                </div>
                            ) : null}

                            {payload.maps_url ? (
                                <a
                                    href={payload.maps_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={isBlue
                                        ? "mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 lg:mt-auto"
                                        : "mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 lg:mt-auto"}
                                >
                                    View all on Google <span aria-hidden>↗</span>
                                </a>
                            ) : null}
                        </aside>

                        <div className="p-6 lg:p-8">
                            <article className={isBlue
                                ? "flex min-h-[320px] flex-col rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] p-6"
                                : "flex min-h-[320px] flex-col rounded-[28px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6"}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        {activeReview.profile_photo_url ? (
                                            <img
                                                src={activeReview.profile_photo_url}
                                                alt={activeReview.author_name || "Google reviewer"}
                                                className={isBlue
                                                    ? "h-14 w-14 shrink-0 rounded-full border border-white/35 object-cover"
                                                    : "h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover"}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className={isBlue
                                                ? "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 text-sm font-bold text-white"
                                                : "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700"}>
                                                {initialsFromName(activeReview.author_name)}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className={isBlue ? "truncate text-lg font-semibold text-white" : "truncate text-lg font-semibold text-slate-900"}>
                                                {activeReview.author_name}
                                            </p>
                                            <p className={isBlue ? "mt-1 text-sm text-cyan-100" : "mt-1 text-sm text-slate-500"}>
                                                {activeReview.relative_time_description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={isBlue
                                        ? "rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white"
                                        : "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"}>
                                        {activeIndex + 1}/{reviews.length}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-2">
                                    <span className="text-lg leading-none text-amber-500">★</span>
                                    <span className="text-sm font-semibold tracking-[0.18em] text-amber-500">
                                        {renderStars(activeReview.rating)}
                                    </span>
                                </div>

                                <div className="mt-6 flex-1">
                                    <p className={isBlue
                                        ? "min-h-[168px] text-lg leading-8 text-white/95"
                                        : "min-h-[168px] text-lg leading-8 text-slate-700"}>
                                        “{truncate(activeReview.text, 320)}”
                                    </p>
                                </div>

                                <div
                                    className="mt-6 flex items-center justify-between gap-3 border-t pt-5"
                                    style={isBlue ? { borderColor: "rgba(255,255,255,0.18)" } : undefined}
                                >
                                    <p className={isBlue ? "text-sm text-cyan-100" : "text-sm text-slate-500"}>
                                        Real Google feedback helping customers choose with confidence.
                                    </p>

                                    {reviews.length > 1 ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={goPrev}
                                                className={isBlue
                                                    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                                                    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"}
                                                aria-label="Previous review"
                                            >
                                                ←
                                            </button>
                                            <button
                                                type="button"
                                                onClick={goNext}
                                                className={isBlue
                                                    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
                                                    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"}
                                                aria-label="Next review"
                                            >
                                                →
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
