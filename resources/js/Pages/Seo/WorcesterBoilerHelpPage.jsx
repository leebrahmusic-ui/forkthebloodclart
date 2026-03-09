import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

export default function WorcesterBoilerHelpPage() {
    return (
        <>
            <Head title="Worcester Boiler Problems & Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Worcester Boiler Help" />

                <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Worcester boiler faults: practical homeowner guidance
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        Worcester faults are often shown as EA/C/A or numeric
                        code families depending on model and controller. Many are
                        linked to ignition, fan, sensor, pressure, or circulation issues.
                    </p>

                    <section className="mt-8 rounded-xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold">Worcester fault codes</h2>
                        <p className="mt-3 text-gray-700">
                            See our Worcester lookup for likely causes and what
                            to do next without risky DIY work.
                        </p>
                        <a href="/advice/worcester-boiler-fault-codes" className="inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold">
                            View Worcester Fault Codes
                        </a>
                    </section>

                    <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                        <h2 className="text-xl font-bold text-blue-900">Service first, repair if needed</h2>
                        <p className="mt-3 text-blue-900">
                            A full service can resolve performance issues and
                            reveal root causes early. If a hard component fault
                            is found, a repair appointment gets the boiler back
                            to reliable operation.
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
