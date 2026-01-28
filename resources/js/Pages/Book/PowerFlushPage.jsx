import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { usePage, Head } from "@inertiajs/react";
import React from "react";

export default function PowerflushQuote() {
    const { basePrice, symbol, radiatorPrices, title } = usePage().props;

    const radiatorRows = Array.isArray(radiatorPrices)
        ? radiatorPrices
        : Array.isArray(radiatorPrices?.data)
            ? radiatorPrices.data
            : [];

    const baseValue = Number(basePrice || 525);
    const basePriceForStepper = 0;

    const radiatorOptions = radiatorRows.length
        ? radiatorRows.map((item) => {
              const addOn = Number(item.price) || 0;
              return {
                  label: item.label,
                  price: baseValue + addOn,
              };
          })
        : [
              { label: "1–5 radiators", price: baseValue },
              { label: "6–10 radiators", price: baseValue },
              { label: "11–15 radiators", price: baseValue },
              { label: "16–20 radiators", price: baseValue },
              { label: "21+ radiators", price: baseValue },
          ];

    const STEPS = [
        {
            id: "radiators",
            type: "select",
            question: "How many radiators are in your property?",
            options: radiatorOptions,
        },

        {
            id: "boiler_flush_type",
            question: "What type of boiler system do you have?",
            type: "select",
            options: ["Combi", "System", "Heat Only"],
        },
        {
            id: "any_cold_spots",
            question: "Any cold spots?",
            type: "select",
            options: [{ label: "No" }, { label: "Yes" }],
        },
        {
            id: "any_sludge",
            question: "Any sludge/dirty water?",
            type: "select",
            options: [{ label: "No" }, { label: "Yes" }],
        },

        {
            id: "flush_before",
            question: " Has system ever been flushed before?",
            type: "select",
            options: [{ label: "No" }, { label: "Yes" }, { label: "Not Sure" }],
        },
        {
            id: "leaking_radiators",
            question: " Any leaking radiators or valves?",
            type: "select",
            options: [{ label: "No" }, { label: "Yes" }],
        },

        {
            id: "access_flush",
            question: "Access type",
            type: "select",
            options: ["Easy access", "Cupboard / boxed in", "Loft"],
        },

        {
            id: "customer_details",
            question: "Your details",
            type: "details",
        },

        {
            id: "visit_time",
            question: "Preferred visit date & time",
            type: "datetime",
        },
    ];

    return (
        <>
            <Head title={title} />
            <Stepper
                title="Power Flush"
                basePrice={basePriceForStepper}
                steps={STEPS}
                currency={symbol}
                serviceKey={SERVICES_KEY_VALUE.POWER_FLUSH}
            />
        </>
    );
}
