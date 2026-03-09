import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

const codes = [
    ["EA", "No flame detected / ignition fault", "Combustion or gas/ignition issue. Common lockout code."],
    ["C6", "Fan speed too low / fan fault", "Fan, air pressure proving, or flue airflow issue."],
    ["C7", "Fan continues running unexpectedly", "Fan control or PCB/fan feedback issue."],
    ["A1", "Pump running dry / circulation issue", "Low flow or pump/circulation problem."],
    ["E9", "Overheat trip", "Over-temperature safety lockout, often circulation/sensor related."],
    ["D1", "Flow sensor fault (model dependent)", "Temperature sensor or wiring issue."],
    ["D5", "Return sensor fault (model dependent)", "Return NTC/wiring fault."],
    ["227", "Flame not detected after ignition", "Ignition sequence failed."],
    ["229", "Flame lost during burner operation", "Intermittent combustion issue."],
    ["232", "Air pressure/fan proving fault", "Fan or pressure proving device issue."],
    ["233", "No fan speed signal", "Fan hall-sensor/speed feedback fault."],
    ["295", "Internal electronics/PCB fault", "Control board fault condition."],
    ["296", "Electronics parameter/plausibility fault", "Control consistency fault."],
    ["297", "Gas valve control fault", "Gas valve actuation/control issue."],
    ["298", "Burner control fault", "Combustion control chain issue."],
    ["286", "Pump speed/control issue", "Pump operation outside expected range."],
    ["1017", "System pressure too low", "Repressurise and investigate for leaks if recurring."],
    ["1021", "System pressure too high", "Check filling loop and pressure control."],
];

export default function WorcesterFaultCodesPage() {
    return (
        <>
            <Head title="Worcester Boiler Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Worcester Fault Codes" />

                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Worcester fault codes: EA, C6, C7 and numeric codes
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        Worcester displays differ by appliance generation
                        (alphanumeric and numeric styles). Use this guide as a
                        practical first interpretation before booking diagnosis.
                    </p>

                    <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Code</th>
                                    <th className="px-4 py-3 font-semibold">Likely meaning</th>
                                    <th className="px-4 py-3 font-semibold">What to do</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map(([code, meaning, action]) => (
                                    <tr key={code} className="border-t border-gray-200 align-top">
                                        <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{code}</td>
                                        <td className="px-4 py-3 text-gray-800">{meaning}</td>
                                        <td className="px-4 py-3 text-gray-700">{action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-6 text-sm text-gray-700">
                        Note: exact code wording varies by model (e.g. Greenstar generations). Legal warning:
                        internal gas appliance work must be carried out by a Gas Safe registered engineer under the
                        Gas Safety (Installation and Use) Regulations 1998 (Regulation 3). Illegal gas work can lead
                        to prosecution, large fines, and possible imprisonment.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="/book/quote/service" className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700">Book a Boiler Service</a>
                        <a href="/book/quote/repair" className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50">Book a Boiler Repair</a>
                        <a href="/advice/worcester-boiler-help" className="inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold">Back to Worcester help</a>
                    </div>
                <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
