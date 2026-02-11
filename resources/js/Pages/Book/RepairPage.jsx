import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

const STEPS = [
    // Checkout collects details and visit time, so no pre-checkout duplicate steps here.
    //         {
    //             label: "Room thermostat",
    //         },
    //     ],
    // },

    {
        id: "boiler_type",
        question: "What type of boiler do you have?",
        type: "select",
        options: [
            {
                label: "Combi",
                image: "/images/stepper/combi_boiler.png",
            },
            {
                label: "System",
                image: "/images/stepper/system_boiler.png",
            },
            {
                label: "Heat Only",
                image: "/images/stepper/regular_boiler.png",
            },
        ],
    },

    {
        id: "boiler_model",
        question: "What is the boiler brand & model?",
        type: "make_model",
        brands: [
            "Worcester Bosch",
            "Vaillant",
            "Ideal",
            "Baxi",
            "Viessmann",
            "Glow-worm",
            "Potterton",
            "Vokera",
            "Ferroli",
            "Alpha",
            "Main",
            "Ariston",
            "Sime",
            "Remeha",
            "Ravenheat",
            "ATAG",
            "Intergas",
            "Navien",
            "Keston",
            "Saunier Duval",
            "Grant",
            "Buderus",
            "Other",
            "Not sure",
        ],
        getModels: (brand) => {
            if (!brand || brand === "Not sure") {
                return [{ label: "Not sure" }, { label: "Other" }];
            }

            const modelsByBrand = {
                "Worcester Bosch": [
                    "Greenstar 30i",
                    "Greenstar 25i",
                    "Greenstar 28i",
                    "Greenstar 30CDi",
                    "Greenstar 32CDi",
                    "Greenstar 35CDi",
                    "Greenstar 38CDi",
                ],
                Vaillant: [
                    "ecoTEC Plus 830",
                    "ecoTEC Plus 832",
                    "ecoTEC Plus 835",
                    "ecoTEC Plus 838",
                    "ecoTEC Pro 24",
                    "ecoTEC Pro 28",
                ],
                Ideal: [
                    "Logic+ 24",
                    "Logic+ 30",
                    "Logic+ 35",
                    "Logic Max 24",
                    "Logic Max 30",
                    "Logic Max 35",
                    "Vogue Max 26",
                    "Vogue Max 32",
                    "Vogue Max 40",
                ],
                Baxi: [
                    "Duo-tec 24",
                    "Duo-tec 28",
                    "Duo-tec 33",
                    "Duo-tec 40",
                    "Platinum 24",
                    "Platinum 28",
                    "Platinum 33",
                ],
                Viessmann: ["Vitodens 050", "Vitodens 100", "Vitodens 111"],
                "Glow-worm": [
                    "Energy 25",
                    "Energy 30",
                    "Energy 35",
                    "Compact 24",
                    "Compact 28",
                ],
                Potterton: ["Gold 24", "Gold 28", "Gold 33", "Gold 40"],
                Vokera: ["Easi-Heat 24", "Easi-Heat 29", "Easi-Heat 36"],
                Ferroli: ["Modena 32", "Modena 38", "Modena HE 25"],
                Alpha: ["E-Tec 28", "E-Tec 33", "E-Tec 38"],
                Main: ["Eco Compact 25", "Eco Compact 30"],
                Ariston: ["Clas ONE 24", "Clas ONE 30", "Clas ONE 35"],
                Sime: ["Murelle 25", "Murelle 30"],
                Remeha: ["Avanta 24", "Avanta 28", "Avanta 35"],
                Ravenheat: ["HE 80", "HE 85"],
                ATAG: ["iC 24", "iC 28", "iC 35"],
                Intergas: ["Kombi Compact HRE 24", "Kombi Compact HRE 36"],
                Navien: ["NCB 28", "NCB 33"],
                Keston: ["Combi 30", "Combi 35"],
                "Saunier Duval": ["Thema Classic 25", "Thema Classic 30"],
                Grant: ["Vortex 26", "Vortex 36"],
                Buderus: ["Logamax plus 24", "Logamax plus 28"],
            };

            const models = modelsByBrand[brand] || [];
            return [...models.map((label) => ({ label })), { label: "Other" }, { label: "Not sure" }];
        },
    },

    {
        id: "boiler_age",
        question: "How old is your boiler?",
        type: "select",
        options: [
            {
                label: "Under 5 years",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%2322c55e' opacity='0.12'/><path d='M22 32c0-6.6 5.4-12 12-12 1.7 0 3 .3 4 .7V18a2 2 0 1 1 4 0v5.5a12 12 0 0 1 4 8.5c0 6.6-5.4 12-12 12S22 38.6 22 32Z' stroke='%2322c55e' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "5–10 years",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23f59e0b' opacity='0.12'/><path d='M22 30c0-5 4-9 9-9 1.3 0 2.4.2 3.4.6l1.6-3.1a2 2 0 1 1 3.6 1.8l-1.6 3.1A9 9 0 0 1 42 30c0 5-4 9-9 9s-11-4-11-9Z' stroke='%23d97706' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "10–15 years",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23f97316' opacity='0.12'/><path d='M22 30c0-4.4 3.6-8 8-8 1.6 0 3 .5 4.3 1.3l1.4-2.3a2 2 0 1 1 3.4 2.1l-1.2 2c1.1 1.4 1.7 3.2 1.7 5.2 0 4.4-3.6 8-8 8s-9.6-3.6-9.6-8Z' stroke='%23ea580c' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "15+ years / Not sure",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23ef4444' opacity='0.12'/><path d='M22 30c0-3.3 2.7-6 6-6 1.5 0 2.8.6 3.9 1.5l2-3.5a2 2 0 1 1 3.4 2l-1.6 2.7a7 7 0 0 1 2.3 5.3c0 3.9-3.1 7-7 7s-9-3.1-9-7Z' stroke='%23b91c1c' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
        ],
    },

    {
        id: "fault_type",
        question: "What issue are you experiencing?",
        type: "select",
        options: [
            {
                label: "No heating",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='9' y='12' width='46' height='40' rx='6' fill='%23eff6ff' stroke='%233b82f6' stroke-width='3'/><path d='M18 20v24M26 20v24M34 20v24M42 20v24M50 20v24' stroke='%233b82f6' stroke-width='3' stroke-linecap='round'/><path d='M18 44h28' stroke='%23a5b4fc' stroke-width='3' stroke-linecap='round'/></svg>",
            },
            {
                label: "No hot water",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='12' y='22' width='40' height='16' rx='8' fill='%23fff1f2' stroke='%23ec4899' stroke-width='3'/><path d='M16 34h32M18 38h28' stroke='%23f472b6' stroke-width='3' stroke-linecap='round'/><circle cx='22' cy='22' r='4' stroke='%23ec4899' stroke-width='3'/></svg>",
            },
            {
                label: "Leaking",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='14' width='44' height='36' rx='10' fill='%23ecfeff' stroke='%23089' stroke-width='3'/><path d='M32 20c-2 5-7 10-7 14a7 7 0 1 0 14 0c0-4-5-9-7-14Z' fill='%23067' stroke='%23089' stroke-width='3'/></svg>",
            },
            {
                label: "Error code",
                requiresText: true,
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='10' width='44' height='44' rx='12' fill='%23fef9c3' stroke='%23eab308' stroke-width='3'/><path d='M32 18v14' stroke='%23eab308' stroke-width='4' stroke-linecap='round'/><circle cx='32' cy='40' r='2.5' fill='%23eab308'/></svg>",
            },
        ],
    },

    {
        id: "issue_start",
        question: "When did the issue start?",
        type: "select",
        options: [
            {
                label: "Today",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23ecfdf3' stroke='%2322c55e' stroke-width='3'/><path d='M32 18v14l10 6' stroke='%2322c55e' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "1–3 days ago",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23eef2ff' stroke='%234f46e5' stroke-width='3'/><path d='M32 18v10l8 6' stroke='%234f46e5' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "1–2 weeks ago",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff7ed' stroke='%23f97316' stroke-width='3'/><path d='M32 18v8l6 8' stroke='%23f97316' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
            {
                label: "More than 2 weeks ago",
                image:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff1f2' stroke='%23ef4444' stroke-width='3'/><path d='M32 18v6l5 10' stroke='%23ef4444' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
            },
        ],
    },

    {
        id: "access",
        question: "Where is your boiler located?",
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
            {
                label: "Other",
                requiresText: true,
                image: "/images/stepper/location-other-room.svg",
            },
        ],
    },

    // Checkout collects details and visit time, so no pre-checkout duplicate steps here.
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
                autoAdvance
            />
            ;
        </>
    );
}
