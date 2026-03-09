import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

export default function IdealBoilerHelpPage() {
    return (
        <>
            <Head title="Ideal Boiler Problems & Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Ideal Boiler Help" />

                <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Ideal boiler problems in Leeds: what they usually mean
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        If your Ideal boiler is noisy, losing pressure, or
                        showing a fault code, the issue is often not user-fixable.
                        We focus on safe diagnosis first, then the right repair.
                    </p>

                    <section className="mt-8 grid gap-4 md:grid-cols-2">
                        <a href="/advice/ideal-boiler-making-a-noise" className="rounded-xl border border-gray-200 p-5 hover:shadow-sm">
                            <h2 className="font-bold text-xl">Ideal boiler making a noise</h2>
                            <p className="mt-2 text-sm text-gray-600">Ticking, kettling, vibrating and fan/pump sounds.</p>
                        </a>
                        <a href="/advice/boiler-pressure-keeps-dropping" className="rounded-xl border border-gray-200 p-5 hover:shadow-sm">
                            <h2 className="font-bold text-xl">Pressure keeps dropping</h2>
                            <p className="mt-2 text-sm text-gray-600">If no external leaks are visible, the fault is often internal.</p>
                        </a>
                    </section>

                    <section className="mt-8 rounded-xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold">Ideal fault codes</h2>
                        <p className="mt-3 text-gray-700">
                            We have a dedicated lookup with likely causes and
                            next-step advice for common Ideal codes.
                        </p>
                        <a href="/advice/ideal-boiler-fault-codes" className="inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold">
                            View Ideal Fault Code Guide
                        </a>
                    </section>

                    <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h2 className="text-xl font-bold text-blue-900">Service or repair?</h2>
                        <p className="mt-3 text-blue-900">
                            If your boiler still heats but behaves inconsistently,
                            a full service can restore performance and may resolve
                            minor issues. If a component fault is identified,
                            repair is then targeted and efficient.
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
