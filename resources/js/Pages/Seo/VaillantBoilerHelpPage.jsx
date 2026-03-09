import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

export default function VaillantBoilerHelpPage() {
    return (
        <>
            <Head title="Vaillant Boiler Problems & Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Vaillant Boiler Help" />

                <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Vaillant boiler issues and fault code guidance
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        Common Vaillant issues include pressure instability,
                        ignition lockouts, and sensor faults. Codes like F75 and
                        F72 often point to pressure sensing, pump, flow, or
                        thermistor problems that need professional diagnosis.
                    </p>

                    <section className="mt-8 rounded-xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold">Vaillant fault codes</h2>
                        <p className="mt-3 text-gray-700">
                            Use our Vaillant code page for likely causes,
                            urgency, and whether to book service first or go
                            straight to repair.
                        </p>
                        <a href="/advice/vaillant-boiler-fault-codes" className="inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold">
                            View Vaillant Fault Codes
                        </a>
                    </section>

                    <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h2 className="text-xl font-bold text-blue-900">Safe next step</h2>
                        <p className="mt-3 text-blue-900">
                            If the code returns after a reset or your heating/hot
                            water is unreliable, book an engineer visit. We can
                            service the appliance and diagnose underlying faults,
                            then carry out repair if required.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a href="/book/quote/service" className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700">Book a Boiler Service</a>
                            <a href="/book/quote/repair" className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50">Book a Boiler Repair</a>
                        </div>
                    </section>
                    <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
