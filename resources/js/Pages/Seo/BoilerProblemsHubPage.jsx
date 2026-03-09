import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";
import React from "react";

const cards = [
    {
        title: "Ideal boiler making a noise",
        description:
            "Banging, whistling, humming, or vibrating noises often indicate scale build-up, pump issues, or trapped air.",
        href: "/advice/ideal-boiler-making-a-noise",
    },
    {
        title: "Boiler pressure keeps increasing",
        description:
            "Rising pressure can indicate a faulty filling loop, expansion vessel problem, or internal leak path.",
        href: "/advice/boiler-pressure-keeps-increasing",
    },
    {
        title: "Boiler pressure keeps dropping",
        description:
            "Pressure loss is commonly caused by small leaks, bleeding radiators, or component faults.",
        href: "/advice/boiler-pressure-keeps-dropping",
    },
];

export default function BoilerProblemsHubPage() {
    return (
        <>
            <Head title="Boiler Problems Advice Leeds" />

            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Boiler Problems Advice" />

                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <section className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            Boiler problem guides for Leeds homeowners
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Quick fault guides for common symptoms. If the issue
                            remains, book a boiler service first, then a repair
                            visit if required.
                        </p>
                    </section>

                    <section className="grid gap-6 md:grid-cols-3 mt-12">
                        {cards.map((card) => (
                            <article
                                key={card.href}
                                className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
                            >
                                <h2 className="text-xl font-bold text-gray-900">
                                    {card.title}
                                </h2>
                                <p className="mt-3 text-gray-600 text-sm leading-6">
                                    {card.description}
                                </p>
                                <a
                                    href={card.href}
                                    className="inline-flex mt-6 text-primary font-semibold hover:underline"
                                >
                                    Read guide →
                                </a>
                            </article>
                        ))}
                    </section>

                    <section className="mt-14 rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold">Need an engineer now?</h2>
                        <p className="mt-3 text-gray-600">
                            If your heating or hot water is unreliable, book a
                            service to diagnose system condition. If a fault is
                            confirmed, book a repair appointment.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="/book/quote/service"
                                className="inline-flex items-center rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700"
                            >
                                Book a Boiler Service
                            </a>
                            <a
                                href="/book/quote/repair"
                                className="inline-flex items-center rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50"
                            >
                                Book a Boiler Repair
                            </a>
                        </div>
                    </section>
                    <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
