import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

const codes = [
    ["F.22", "Low water pressure / dry fire protection", "Repressurise if safe. If recurring, check for leak/internal fault."],
    ["F.23", "Temperature rise too fast (flow/return issue)", "Possible low circulation, pump, or sensor mismatch."],
    ["F.24", "Rapid temperature rise", "Circulation restriction, pump or heat exchanger issue."],
    ["F.25", "Flue gas temperature high", "Combustion/flue safety fault. Engineer required."],
    ["F.26", "Gas valve stepper motor current fault", "Gas valve/electrical control issue."],
    ["F.27", "Flame signal with gas off", "Ionisation/PCB or gas valve anomaly."],
    ["F.28", "Ignition failed", "No flame established. Gas supply, ignition or combustion issue."],
    ["F.29", "Flame lost during operation", "Intermittent combustion failure."],
    ["F.32", "Fan speed / air pressure fault", "Fan, venturi, air pressure proving or flue-related issue."],
    ["F.49", "eBUS low voltage/communication", "Controls/electrical communication problem."],
    ["F.54", "Gas supply interruption", "Supply pressure interruption or valve issue."],
    ["F.61", "Gas valve control fault", "Gas valve electronics/wiring fault."],
    ["F.62", "Gas valve delayed close", "Valve/control safety fault."],
    ["F.64", "Electronics/sensor plausibility fault", "Sensor or PCB processing fault."],
    ["F.65", "Electronics overheat", "PCB overheating or cooling issue."],
    ["F.67", "Flame signal plausibility fault", "Combustion sensing inconsistency."],
    ["F.68", "Unstable flame signal", "Ignition/combustion instability."],
    ["F.70", "Invalid appliance code", "Configuration/PCB replacement coding issue."],
    ["F.71", "Flow sensor stuck", "Flow NTC not changing as expected."],
    ["F.72", "Flow/return NTC mismatch", "Thermistor/wiring/flow-rate related issue."],
    ["F.73", "Water pressure sensor signal too low", "Pressure sensor/wiring fault."],
    ["F.74", "Water pressure sensor out of range", "Sensor plausibility issue."],
    ["F.75", "No pressure change when pump starts", "Commonly pressure sensor, pump, or system leak."],
    ["F.76", "Primary heat exchanger overheat safety", "Overheat safety lockout."],
    ["F.77", "Flue gas flap/condensate pump fault (model dependent)", "Auxiliary safety device fault."],
    ["F.83", "Flow/return sensor temperature no change", "Poor circulation or sensor issue."],
];

export default function VaillantFaultCodesPage() {
    return (
        <>
            <Head title="Vaillant Boiler Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Vaillant Fault Codes" />

                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Vaillant fault codes explained (F.22 to F.83)
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        Based on widely seen UK Vaillant domestic code families
                        including common faults like F75 and F72. Exact
                        interpretation can vary by model and firmware.
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

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="/book/quote/service" className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700">Book a Boiler Service</a>
                        <a href="/book/quote/repair" className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50">Book a Boiler Repair</a>
                        <a href="/advice/vaillant-boiler-help" className="inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold">Back to Vaillant help</a>
                    </div>

                    <NewBoilerQuoteCta />

                    <p className="mt-6 text-sm text-gray-700">
                        Legal warning: recurring combustion or lockout faults should not be handled with internal DIY
                        work. Under the Gas Safety (Installation and Use) Regulations 1998 (Regulation 3), gas work
                        must be completed by a Gas Safe registered engineer. Illegal gas work can lead to
                        prosecution, significant fines, and possible imprisonment.
                    </p>
                </main>

                <Footer />
            </div>
        </>
    );
}
