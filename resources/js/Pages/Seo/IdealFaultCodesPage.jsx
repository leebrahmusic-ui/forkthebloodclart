import Header from "@/Components/boiler/header";
import { Footer } from "@/Components/boiler/footer";
import NewBoilerQuoteCta from "@/Components/boiler/NewBoilerQuoteCta";
import { Head } from "@inertiajs/react";

const codes = [
    ["F1", "Low system pressure", "Check pressure and system for leaks. Internal issue likely if recurring."],
    ["F2", "Flame loss / ignition lockout", "Possible gas valve, fan, flue, ignition or gas supply issue."],
    ["L2", "Ignition lockout", "Repeated failed ignition. Engineer diagnosis required."],
    ["L5", "Too many resets / lockout", "Control lockout after repeated faults; needs root-cause fix."],
    ["F3", "Fan fault", "Fan or airflow proving issue."],
    ["F4", "Flow thermistor fault", "Temperature sensor reading abnormal."],
    ["F5", "Return thermistor fault", "Return NTC sensor/wiring issue."],
    ["F6", "Outside sensor fault", "External temperature sensor fault on compatible setups."],
    ["F7", "Low mains / flame signal fault", "Electrical or combustion signal issue."],
    ["F9", "Printed circuit board fault", "Control PCB fault likely."],
    ["FD", "Incorrect setup / code", "Commissioning or control parameter issue."],
    ["C0-C9", "Status codes", "Operational/status states. Some are normal, some indicate waiting or protection modes."],
    ["0", "Standby", "No active demand. Usually normal if heating/hot water off."],
];

export default function IdealFaultCodesPage() {
    return (
        <>
            <Head title="Ideal Boiler Fault Codes" />
            <div className="min-h-screen bg-white text-gray-900 rounded-b-3xl">
                <Header title="Ideal Fault Codes" />

                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Ideal boiler fault codes: likely causes and next steps
                    </h1>
                    <p className="mt-4 text-gray-700 leading-7">
                        This page covers common Ideal domestic fault and status
                        codes seen across Logic/Vogue-style ranges. Exact meaning
                        can vary by model generation and controller.
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
                        Legal warning: if a fault code returns repeatedly after reset, do not open the case or
                        attempt internal gas/appliance work. Under the Gas Safety (Installation and Use)
                        Regulations 1998 (Regulation 3), gas work must be done by a Gas Safe registered engineer.
                        Illegal gas work can result in prosecution, heavy fines, and potential imprisonment.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="/book/quote/service" className="inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700">Book a Boiler Service</a>
                        <a href="/book/quote/repair" className="inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50">Book a Boiler Repair</a>
                        <a href="/advice/ideal-boiler-help" className="inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold">Back to Ideal help</a>
                    </div>
                <NewBoilerQuoteCta />
                </main>

                <Footer />
            </div>
        </>
    );
}
