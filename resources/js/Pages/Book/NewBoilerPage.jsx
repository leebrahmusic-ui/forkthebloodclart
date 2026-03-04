import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { SERVICE_QUESTIONS } from "@/Components/extra/boilerSteps";
import BlueQuoteSkin from "@/Components/extra/BlueQuoteSkin";
import { GoogleReview } from "@/Components/GoogleReview";
import { useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";

/* -----------------------------
   Read postcode only
----------------------------- */
function getInitialData() {
    const params = new URLSearchParams(window.location.search);

    return {
        postcode: params.get("postcode") || "",
    };
}

export default function NewBoilerQuote() {
    const { postcode } = getInitialData();
    const { title } = usePage().props;

    const baseSteps = SERVICE_QUESTIONS?.new || [];

    const steps = useMemo(() => {
        return [...baseSteps];
    }, [postcode]);

    if (!baseSteps.length) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-2xl font-bold">Configuration error</h2>
                <p className="text-slate-500 mt-2">
                    No questions configured for new boiler
                </p>
            </div>
        );
    }

    return (
        <>
            <Head title={title} />
            <BlueQuoteSkin>
                <Stepper
                    title="New boiler quote"
                    steps={steps}
                    basePrice={0}
                    serviceKey={SERVICES_KEY_VALUE.NEW_BOILER_QUOTE}
                    autoAdvance
                />
                <GoogleReview theme="blue" />
            </BlueQuoteSkin>
        </>
    );
}
