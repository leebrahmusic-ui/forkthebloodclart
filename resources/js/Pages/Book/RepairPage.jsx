import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

const STEPS = [
    // {
    //     id: "fixed_price",
    //     question: "Typical Fixed Part Prices?",
    //     type: "select",
    //     options: [
    //         { label: "Sensor" },
    //         { label: "Electrodes" },
    //         {
    //             label: "Plate heat exchanger",
    //         },
    //         { label: "Fan" },
    //         {
    //             label: "Room thermostat",
    //         },
    //     ],
    // },

    {
        id: "boiler_type",
        question: "What type of boiler do you have?",
        type: "select",
        options: ["Combi", "System", "Heat Only"],
    },

    {
        id: "boiler_model",
        question: "What is the boiler brand & model?",
        type: "text",
        placeholder: "e.g. Worcester Bosch Greenstar 30i",
    },

    {
        id: "boiler_age",
        question: "How old is your boiler?",
        type: "select",
        options: [
            "Under 5 years",
            "5–10 years",
            "10–15 years",
            "15+ years / Not sure",
        ],
    },

    {
        id: "fault_type",
        question: "What issue are you experiencing?",
        type: "select",
        options: [
            { label: "No heating" },
            { label: "No hot water" },
            { label: "Leaking" },
            { label: "Error code", requiresText: true },
        ],
    },

    {
        id: "issue_start",
        question: "When did the issue start?",
        type: "select",
        options: [
            "Today",
            "1–3 days ago",
            "1–2 weeks ago",
            "More than 2 weeks ago",
        ],
    },

    {
        id: "previous_work",
        question: "Has anyone worked on it recently?",
        type: "select",
        options: [{ label: "No" }, { label: "Yes", requiresText: true }],
    },

    {
        id: "media",
        question: "Upload photos or videos (optional)",
        type: "upload",
    },

    {
        id: "access",
        question: "Where is your boiler located?",
        type: "select",
        options: [
            "Easy access",
            "Cupboard / boxed in",
            "Loft",
            { label: "Other", requiresText: true },
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

export default function RepairQuote() {
    const { basePrice, symbol, title } = usePage().props;

    const onSubmit = () => {
        console.log();
    };
    return (
        <>
            <Head title={title} />
            <Stepper
                title="Boiler Repair Quote"
                basePrice={basePrice}
                steps={STEPS}
                serviceKey={SERVICES_KEY_VALUE.BOILER_REPAIR}
                currency={symbol}
                onSubmit={onSubmit}
            />
            ;
        </>
    );
}
