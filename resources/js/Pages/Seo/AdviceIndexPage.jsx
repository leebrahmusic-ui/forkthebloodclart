import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";

const STOP_WORDS = new Set(["guide"]);

function formatAdviceTitle(slug = "") {
    return slug
        .split("-")
        .filter((word) => word && !STOP_WORDS.has(word.toLowerCase()))
        .map((word) => {
            if (/^[a-z]*\d+[a-z\d]*$/i.test(word)) {
                return word.toUpperCase();
            }

            const lower = word.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function AdviceIndexPage({ adviceSlugs = [], adviceCount = 0 }) {
    const [query, setQuery] = useState("");

    const adviceItems = useMemo(
        () =>
            adviceSlugs.map((slug) => ({
                slug,
                title: formatAdviceTitle(slug),
            })),
        [adviceSlugs],
    );

    const filteredAdviceItems = useMemo(() => {
        const normalisedQuery = query.trim().toLowerCase();

        if (!normalisedQuery) return adviceItems;

        return adviceItems.filter(
            ({ slug, title }) =>
                slug.toLowerCase().includes(normalisedQuery) ||
                title.toLowerCase().includes(normalisedQuery),
        );
    }, [adviceItems, query]);

    const roundedCount = Math.floor(Number(adviceCount || 0) / 10) * 10;
    const displayCount = roundedCount >= 100 ? `${roundedCount}+` : `${roundedCount}`;

    return (
        <>
            <Head title="Help & Advice Hub" />

            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Help & Advice" />

                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <section className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            Help &amp; Advice for Homeowners
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Find straightforward answers for boiler faults, error codes, pressure problems, and brand-specific issues.
                        </p>
                        <p className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-700">
                            {displayCount} help articles
                        </p>
                    </section>

                    <section className="mt-10 rounded-2xl border border-slate-200 p-6 sm:p-8">
                        <div className="mb-5">
                            <label htmlFor="advice-search" className="sr-only">
                                Search help articles
                            </label>
                            <input
                                id="advice-search"
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search by fault code, brand, or problem"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        {filteredAdviceItems.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                No matches yet. Try a fault code (like F75), a boiler brand, or a common problem.
                            </p>
                        ) : null}

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredAdviceItems.map(({ slug, title }) => (
                                <Link
                                    key={slug}
                                    href={`/advice/${slug}`}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {title}
                                </Link>
                            ))}
                        </div>
                    </section>

                    <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
