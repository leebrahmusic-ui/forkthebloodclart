import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";
import React from "react";

export default function BoilerPressureDroppingPage() {
    return (
        <>
            <Head title="Boiler Pressure Keeps Dropping" />

            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Boiler Pressure Keeps Dropping" />

                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Boiler pressure keeps dropping: common causes
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        Repeated pressure loss usually points to a small system
                        leak, radiator bleed loss, PRV issues, or an internal
                        boiler component problem.
                    </p>

                    <section className="mt-8 rounded-xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold">What you can check</h2>
                        <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
                            <li>Inspect visible radiator valves and pipe joints.</li>
                            <li>Check if pressure drops after bleeding radiators.</li>
                            <li>Monitor if drops happen overnight when system is cold.</li>
                        </ul>
                    </section>

                    <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h2 className="text-xl font-bold text-blue-900">When to book</h2>
                        <p className="mt-3 text-blue-900">
                            If you are topping up pressure repeatedly, book a
                            boiler service first. A full service may
                            resolve some issues and also help identify whether you need a repair.
                            If you prefer, you can book a repair directly.
                        </p>
                    </section>

                    <section className="mt-8 flex flex-wrap gap-3">
                        <a href="/book/quote/service" className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700">
                            Book a Boiler Service
                        </a>
                        <a href="/book/quote/repair" className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50">
                            Book a Boiler Repair
                        </a>
                        <a href="/advice/boiler-problems" className="inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold">
                            More boiler problem guides
                        </a>
                    </section>
                    <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
