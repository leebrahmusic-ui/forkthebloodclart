import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head, Link, usePage } from "@inertiajs/react";
import { adviceBySlug, adviceArticles } from "./adviceArticles";

const titleCase = (value = "") =>
    value
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const extractFaultCode = (slug = "") => {
    const match = slug.match(/fault-code-([a-z0-9]+)/i);
    return match ? match[1].toUpperCase() : null;
};

const profileForSlug = (slug = "", article = {}) => {
    const isResetGuide = slug.includes("reset-guide");
    const isFaultCodeGuide = slug.includes("fault-code");
    const code = extractFaultCode(slug);
    const subject = article?.title || titleCase(slug.replace(/^guide-/, ""));

    const resetSteps = [
        "Wait 3 to 5 minutes after lockout so components cool and controls stabilise.",
        "Check system pressure is in your normal range and confirm gas/electrical supply is available.",
        "Use the manufacturer reset procedure once only (button or menu depending on model).",
        "Run hot water or heating demand and observe whether the fault returns.",
        "If the same code returns, stop resetting repeatedly and book an engineer diagnosis.",
    ];

    if (isResetGuide || isFaultCodeGuide) {
        return {
            heading: code
                ? `How to safely handle ${code} before booking`
                : "How to safely handle this fault before booking",
            steps: resetSteps,
            legalLead:
                "Resetting is only a temporary user action. Internal diagnostics, combustion checks, gas train work, and component replacement are engineer-only tasks.",
        };
    }

    return {
        heading: `Step-by-step checks for ${subject}`,
        steps: [
            "Confirm the exact symptom pattern (startup only, hot-water demand, heating demand, or constant).",
            "Check pressure and controls safely without removing casing or touching internal components.",
            "Look for external clues like discharge pipe dripping, uneven radiator heat, or recurring lockout codes.",
            "Book service for full-condition diagnosis, or repair-first if the same hard fault is repeating.",
        ],
        legalLead:
            "Homeowner checks should stay external and non-invasive. Internal gas appliance work is restricted by law.",
    };
};

export default function AdviceArticlePage() {
    const { props } = usePage();
    const slug = props?.articleSlug;
    const article = adviceBySlug[slug];
    const profile = profileForSlug(slug, article);

    if (!article) {
        return (
            <>
                <Head title="Boiler Advice" />
                <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                    <Header title="Boiler Advice" />
                    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                        <h1 className="text-3xl font-extrabold">Advice page not found</h1>
                        <p className="mt-4 text-gray-700">
                            This advice page is not available. Browse all guides below.
                        </p>
                        <Link href="/advice/boiler-problems" className="inline-flex mt-6 rounded-lg bg-primary px-5 py-3 text-white font-semibold">
                            View Boiler Advice Hub
                        </Link>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={article.title} />

            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title={article.title} />

                <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <article className="max-w-4xl">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            {article.title}
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">{article.excerpt}</p>

                        <section className="mt-8 rounded-xl border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold">What this usually means</h2>
                            <p className="mt-3 text-gray-700 leading-7">{article.summary}</p>
                        </section>

                        <section className="mt-6 rounded-xl border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold">Common causes</h2>
                            <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                                {article.causes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="mt-6 rounded-xl border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold">Checks you can do safely</h2>
                            <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                                {article.checks.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="mt-6 rounded-xl border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold">{profile.heading}</h2>
                            <ol className="mt-3 list-decimal pl-5 space-y-2 text-gray-700">
                                {profile.steps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ol>
                        </section>

                        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <svg
                                        className="h-6 w-6 animate-spin text-red-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.35" />
                                        <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-blue-900">Legal and safety warning</h2>
                            </div>
                            <p className="mt-3 text-blue-900 leading-7">
                                {profile.legalLead} Under the Gas Safety (Installation and Use) Regulations 1998
                                (Regulation 3), gas work must be carried out by a Gas Safe registered engineer.
                                Illegal gas work can lead to prosecution, substantial fines, and potential
                                imprisonment. If fault codes persist, stop DIY attempts and book a qualified engineer.
                            </p>
                        </section>

                        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
                            <h2 className="text-xl font-bold text-blue-900">Book service or repair</h2>
                            <p className="mt-3 text-blue-900 leading-7">
                                Book a boiler service first if you want full-condition checks. A service may resolve some
                                issues and also help identify whether a repair is needed. If you prefer, you can book a
                                repair directly.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <a
                                    href="/book/quote/service"
                                    className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700"
                                >
                                    Book a Boiler Service
                                </a>
                                <a
                                    href="/book/quote/repair"
                                    className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50"
                                >
                                    Book a Boiler Repair
                                </a>
                            </div>
                        </section>
                        <NewBoilerQuoteCta />

                        <section className="mt-6 rounded-xl border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold">Frequently asked questions</h2>
                            <div className="mt-4 space-y-4">
                                {article.faqs.map((faq) => (
                                    <div key={faq.q}>
                                        <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                                        <p className="mt-1 text-gray-700">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </article>

                    <section className="mt-12">
                        <h2 className="text-2xl font-bold">More boiler help</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {adviceArticles
                                .filter((x) => x.slug !== article.slug)
                                .slice(0, 8)
                                .map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/advice/${item.slug}`}
                                        className="rounded-lg border border-gray-200 p-4 hover:shadow-sm"
                                    >
                                        <p className="font-semibold text-gray-900">{item.title}</p>
                                        <p className="mt-1 text-sm text-gray-600">{item.excerpt}</p>
                                    </Link>
                                ))}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
