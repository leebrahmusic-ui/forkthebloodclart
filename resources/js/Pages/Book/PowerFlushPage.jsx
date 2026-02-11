import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { usePage, Head } from "@inertiajs/react";
import React from "react";

export default function PowerflushQuote() {
    const { basePrice, symbol, radiatorPrices, title } = usePage().props;

    const yesIcon =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23ecfdf3' stroke='%2322c55e' stroke-width='3'/><path d='M22 32l8 8 12-16' stroke='%2322c55e' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>";
    const noIcon =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff1f2' stroke='%23ef4444' stroke-width='3'/><path d='M24 24l16 16m0-16L24 40' stroke='%23ef4444' stroke-width='4' stroke-linecap='round'/></svg>";
    const radiatorIcon =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='14' width='44' height='36' rx='8' fill='%23eff6ff' stroke='%233b82f6' stroke-width='3'/><path d='M18 20v24M26 20v24M34 20v24M42 20v24M50 20v24' stroke='%233b82f6' stroke-width='3' stroke-linecap='round'/><path d='M18 44h28' stroke='%23a5b4fc' stroke-width='3' stroke-linecap='round'/></svg>";

    const radiatorRows = Array.isArray(radiatorPrices)
        ? radiatorPrices
        : Array.isArray(radiatorPrices?.data)
            ? radiatorPrices.data
            : [];

    const baseValue = Number(basePrice || 525);
    const basePriceForStepper = 0;

    const radiatorOptions = radiatorRows.length
        ? radiatorRows.map((item) => ({
              label: item.label,
              // Use the admin-set per-range price directly; fall back to baseValue if missing
              price: Number(item.price) || baseValue,
              image: radiatorIcon,
          }))
        : [
              { label: "1–5 radiators", price: baseValue, image: radiatorIcon },
              { label: "6–10 radiators", price: baseValue, image: radiatorIcon },
              { label: "11–15 radiators", price: baseValue, image: radiatorIcon },
              { label: "16–20 radiators", price: baseValue, image: radiatorIcon },
              { label: "21+ radiators", price: baseValue, image: radiatorIcon },
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
            options: [
                { label: "Combi", image: "/images/stepper/combi_boiler.png" },
                { label: "System", image: "/images/stepper/system_boiler.png" },
                { label: "Heat Only", image: "/images/stepper/regular_boiler.png" },
            ],
        },
        {
            id: "any_cold_spots",
            question: "Any cold spots?",
            type: "select",
            options: [
                { label: "No", image: noIcon },
                { label: "Yes", image: yesIcon },
            ],
        },
        {
            id: "any_sludge",
            question: "Any sludge/dirty water?",
            type: "select",
            options: [
                { label: "No", image: noIcon },
                { label: "Yes", image: yesIcon },
            ],
        },

        {
            id: "flush_before",
            question: " Has system ever been flushed before?",
            type: "select",
            options: [
                { label: "No", image: noIcon },
                { label: "Yes", image: yesIcon },
                {
                    label: "Not Sure",
                    image:
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23eef2ff' stroke='%234f46e5' stroke-width='3'/><path d='M28 26a4 4 0 1 1 6 3.2c-1.2.9-2 2-2 3.3V34' stroke='%234f46e5' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><circle cx='32' cy='42' r='2' fill='%234f46e5'/></svg>",
                },
            ],
        },
        {
            id: "leaking_radiators",
            question: " Any leaking radiators or valves?",
            type: "select",
            options: [
                { label: "No", image: noIcon },
                { label: "Yes", image: yesIcon },
            ],
        },

        {
            id: "access_flush",
            question: "Access type",
            type: "select",
            options: [
                {
                    label: "Easy access",
                    image: "/images/stepper/location-same-room.svg",
                },
                {
                    label: "Cupboard / boxed in",
                    image: "/images/stepper/location-cupboard.svg",
                },
                {
                    label: "Loft",
                    image: "/images/stepper/location-loft.svg",
                },
            ],
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
                autoAdvance
            />
        </>
    );
}
