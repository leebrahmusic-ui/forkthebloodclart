import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import Stepper from "@/Components/extra/Stepper";
import { usePage, Head } from "@inertiajs/react";
import React from "react";

const STEPS = [
    {
        id: "boiler_type",
        question: "What type of boiler do you have?",
        type: "select",
        options: [
            { label: "Combi", image: "/images/stepper/combi_boiler.png" },
            { label: "System", image: "/images/stepper/system_boiler.png" },
            {
                label: "Heat Only",
                image: "/images/stepper/regular_boiler.png",
            },
        ],
    },

    {
        id: "boiler_model",
        question: "What boiler make and model do you have?",
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
                return [
                    { label: "Not sure" },
                    { label: "Other" },
                ];
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
                Viessmann: [
                    "Vitodens 050",
                    "Vitodens 100",
                    "Vitodens 111",
                ],
                "Glow-worm": [
                    "Energy 25",
                    "Energy 30",
                    "Energy 35",
                    "Compact 24",
                    "Compact 28",
                ],
                Potterton: [
                    "Gold 24",
                    "Gold 28",
                    "Gold 33",
                    "Gold 40",
                ],
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
                "Saunier Duval": [
                    "Thema Classic 25",
                    "Thema Classic 30",
                ],
                Grant: ["Vortex 26", "Vortex 36"],
                Buderus: ["Logamax plus 24", "Logamax plus 28"],
            };

            const models = modelsByBrand[brand] || [];
            return [
                ...models.map((label) => ({ label })),
                { label: "Other" },
                { label: "Not sure" },
            ];
        },
    },

    {
        id: "boiler_age",
        question: "How old is your boiler?",
        type: "select",
        options: [
            {
                label: "Under 5 years",
                image: "/images/stepper/option-yes.svg",
            },
            {
                label: "5–10 years",
                image: "/images/stepper/option-yes.svg",
            },
            {
                label: "10–15 years",
                image: "/images/stepper/option-yes.svg",
            },
            {
                label: "15+ years / Not sure",
                image: "/images/stepper/option-yes.svg",
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
                label: "Tight cupboard",
                image: "/images/stepper/location-cupboard.svg",
            },
            { label: "Loft", image: "/images/stepper/location-loft.svg" },
            {
                label: "Other",
                requiresText: true,
                image: "/images/stepper/location-other-room.svg",
            },
        ],
    },

    {
        id: "any_issue",
        question: "Any known issues?",
        type: "select",
        options: [
            { label: "No", image: "/images/stepper/option-no.svg" },
            {
                label: "Yes",
                requiresText: true,
                image: "/images/stepper/option-yes.svg",
            },
        ],
    },

    // {
    //     id: "summary",
    //     question: "Review & pricing",
    //     type: "summary",
    // },
];

export default function ServiceQuote() {
    const { basePrice, symbol, title } = usePage().props;
    return (
        <>
            <Head title={title} />
            <Stepper
                title="Annual Boiler Service"
                basePrice={basePrice}
                steps={STEPS}
                currency={symbol}
                serviceKey={SERVICES_KEY_VALUE.BOILER_SERVICE}
                autoAdvance
            />
        </>
    );
}
