import { Phone } from "lucide-react";

export const SERVICE_QUESTIONS = {
    new: [
        {
            id: "mains_gas",
            question: "Does your boiler run on mains gas?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/fuel-mains-gas.svg" },
                { label: "No", image: "/images/stepper/fuel-no-gas.svg" },
            ],
            infoBox: {
                badge: "Tip",
                text:
                    "Most homes in the UK are connected to mains gas. If you receive a gas bill or have a gas meter installed, this is almost certainly the correct option for your home.",
                // helperLabel: "Not sure?",
                // phone: "0330 113 1333",
                // phoneLabel: "Speak to an engineer",
            },
        },

        {
            id: "boiler_fuel",
            question: "What fuel does your boiler run on?",
            type: "select",
            options: [
                { label: "LPG Gas", image: "/images/stepper/fuel-lpg.svg" },
                { label: "Other", image: "/images/stepper/fuel-other.svg" },
            ],
            showIf: (a) => a.mains_gas?.label === "No",
        },

        {
            id: "fuel_help",
            question:
                "Thanks — this setup needs a specialist review. One of our experts will help you.",
            type: "info",
            showIf: (a) =>
                a.mains_gas?.label === "No" && a.boiler_fuel?.label === "Other",
        },

        {
            id: "boiler_type_known",
            question: "Do you know the type of boiler currently installed?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            infoBox: {
                badge: "Tip",
                text:
                    "Common types: Combi boiler • System boiler • Regular/Standard boiler\n\nSelect Yes if you know. If you’re not sure, choose No and we’ll guide you through it in the next step — or you can speak with an engineer.",
                // helperLabel: "Not sure?",
                // phone: "0330 113 1333",
                // phoneLabel: "Speak to an expert",
            },
            showIf: (a) =>
                a.mains_gas?.label === "Yes" || a.boiler_fuel?.label === "LPG Gas",
        },

        {
            id: "current_boiler_type",
            question: "What kind of boiler do you have right now?",
            type: "select",
            options: [
                {
                    label: "Combi boiler",
                    image: "/images/stepper/combi_boiler.png",
                },
                {
                    label: "Regular / Standard boiler",
                    image: "/images/stepper/regular_boiler.png",
                },
                {
                    label: "System boiler",
                    image: "/images/stepper/system_boiler.png",
                },
                // {
                //     label: "Back boiler",
                //     image: "/images/stepper/back_boiler.png",
                // },
            ],
            showIf: (a) => a.boiler_type_known?.label === "Yes",
        },


        {
            id: "has_water_tank",
            question: "Does your home have a water tank or hot water cylinder?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            showIf: (a) => a.boiler_type_known?.label === "No",
        },

        {
            id: "pressure_gauge",
            question: "Can you see a pressure gauge on your boiler?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            showIf: (a) => a.has_water_tank?.label === "Yes",
        },

        {
            id: "move_to_combi",
            question: "Are you thinking about moving to a combi boiler?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            showIf: (a) =>
                ["Regular / Standard boiler", "System boiler"].includes(
                    a.current_boiler_type?.label
                ) || a.pressure_gauge?.label === "Yes" || (a.boiler_type_known?.label == 'No' && a.has_water_tank?.label == 'Yes' && a.pressure_gauge?.label == 'No'),
        },

        {
            id: "boiler_move_location",
            question: "Are you planning to move the boiler to a different location?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            showIf: (a) =>
                a.move_to_combi?.label ||
                a.has_water_tank?.label === "No" ||
                a.current_boiler_type?.label === "Combi boiler",
        },

        {
            id: "preferred_location",
            question: "What is the preferred location for the boiler?",
            type: "select",
            options: [
                {
                    label: "In the airing cupboard",
                    image: "/images/stepper/location-cupboard.svg",
                    priceNote: "+£800",
                },
                {
                    label: "New place within the same room",
                    image: "/images/stepper/location-same-room.svg",
                    priceNote: "+£800",
                },
                {
                    label: "Another room on the same floor",
                    image: "/images/stepper/location-other-room.svg",
                    priceNote: "+£800",
                },
                {
                    label: "Another floor or loft",
                    image: "/images/stepper/location-loft.svg",
                    priceNote: "+£800",
                },
            ],
            showIf: (a) =>
                a.boiler_move_location?.label === "Yes" ||
                a.current_boiler_type?.label === "Back boiler",
        },

        {
            id: "property_type",
            question: "What type of property do you live in?",
            type: "select",
            options: [
                { label: "House", image: "/images/stepper/property-house.svg" },
                { label: "Bungalow", image: "/images/stepper/property-bungalow.svg" },
                { label: "Flat / Apartment", image: "/images/stepper/property-flat.svg" },
            ],
            showIf: (a) =>
                a.boiler_move_location?.label === "No" || !!a.preferred_location,
        },

        {
            id: "flat_upper_floor",
            question: "Is the property on the second floor or higher?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/option-yes.svg" },
                { label: "No", image: "/images/stepper/option-no.svg" },
            ],
            showIf: (a) => a.property_type?.label === "Flat / Apartment",
        },

        {
            id: "flue_reachable",
            question: "Can the flue be reached from outside?",
            type: "select",
            options: [
                { label: "Yes", image: "/images/stepper/outside_wall.png" },
                { label: "No", image: "/images/stepper/flue_roof.jpg" },
            ],
            showIf: (a) => a.flat_upper_floor?.label === "Yes",
        },

        {
            id: "flue_help",
            question:
                "Thanks — this setup requires a specialist assessment. Our team will help you.",
            type: "info",
            showIf: (a) => a.flue_reachable?.label === "No",
        },

        // Spec buckets (keep)
        {
            id: "bathrooms",
            question: "How many bathrooms are in your property?",
            type: "select",
            options: [
                { label: "1", image: "/images/stepper/bath-1.svg" },
                { label: "1.5", image: "/images/stepper/bath-1-5.svg" },
                { label: "2", image: "/images/stepper/bath-2.svg" },
                { label: "3+", image: "/images/stepper/bath-3plus.svg" },
            ],
            showIf: (a) =>
                (a.property_type?.label === "House" ||
                    a.property_type?.label === "Bungalow" ||
                    a.flat_upper_floor?.label === "No" ||
                    a.flue_reachable?.label === "Yes") &&
                a.pressure_gauge?.label !== "No",
        },

        {
            id: "bedrooms",
            question: "How many bedrooms are in your property?",
            type: "select",
            options: [
                { label: "1", image: "/images/stepper/bed-1.svg" },
                { label: "2", image: "/images/stepper/bed-2.svg" },
                { label: "3", image: "/images/stepper/bed-3.svg" },
                { label: "4+", image: "/images/stepper/bed-4plus.svg" },
            ],
            showIf: (a) => !!a.bathrooms || a.pressure_gauge?.label === "No",
        },

        // ✅ show radiators always once bedrooms are known (even when moving to combi)
        {
            id: "radiators",
            question: "How many radiators are in your home?",
            type: "select",
            options: [
                { label: "Up to 6", image: "/images/stepper/rads-6.svg" },
                { label: "7–12", image: "/images/stepper/rads-7-12.svg" },
                { label: "13–20", image: "/images/stepper/rads-13-20.svg" },
                { label: "21+", image: "/images/stepper/rads-21plus.svg" },
            ],
            showIf: (a) => !!a.bedrooms,
        },

        // No flue_type needed. Engine: if flue_wall=No => +£300 vertical flue.
        {
            id: "flue_wall",
            question: "Does the flue come out the wall?",
            type: "select",
            options: [
                {
                    label: "Yes",
                    image: "/images/stepper/Is your flue coming out of the wall - YES.jpeg",
                },
                {
                    label: "No, it comes out the roof",
                    image: "/images/stepper/Is your flue coming out of the wall - NO.jpeg",
                }
            ],
            helperImages: [
                // {
                //     src: "/images/stepper/outside_wall.png",
                //     alt: "Boiler flue coming out of the wall",
                // },
                // {
                //     src: "/images/stepper/outside_wall2.png",
                //     alt: "External boiler flue example",
                // },
            ],
            showIf: (a) => a.boiler_move_location?.label === "No" && !!a.radiators || a.pressure_gauge?.label === "No" || a.current_boiler_type?.label == 'Back boiler',
        },


        {
            id: "thermostat_type",
            question: "Which thermostat do you require?",
            type: "select",
            infoBox: {
                badge: "Tip",
                text: `A smart thermostat allows you to control your heating remotely via iOS or Android, set schedules, and improve efficiency.

If you’re happy to keep your existing thermostat, please select Basic.
• Standard wireless thermostat (included)
`,
            },
            options: [
                {
                    label: "Basic",
                    image: "/images/stepper/STANDARD_room_thermostat-removebg-preview.png",

                },
                {
                    label: "Smart",
                    priceNote: "+£100",
                    image: "/images/stepper/SMART_room_thermostat-removebg-preview.png",
                }
            ],
            preset: { label: "Basic" },
            showIf: (a) => !!a.radiators,
        },

        {
            id: "trv_required",
            question: "Do you require new/additional TRVs?",
            type: "select",
            infoBox: {
                badge: "Tip",
                text: `Thermostatic Radiator Valves (TRVs)
                Required under current Building Regulations to allow individual room temperature control.

                Any missing or faulty TRVs will need to be replaced to ensure compliance with current standards.

                `
            },
            options: [
                { label: "No", image: "/images/stepper/option-no.svg" },
                { label: "Yes", priceNote: "+£35 each", image: "/images/stepper/TRV-removebg-preview.png" },
            ],
            preset: { label: "No" },
            showIf: (a) => !!a.thermostat_type,
        },

        {
            id: "trv_qty",
            question: "How many TRVs?",
            type: "dropdown",
            options: Array.from({ length: 13 }, (_, idx) => {
                const v = idx + 1;
                return { label: String(v), value: v };
            }),
            showIf: (a) => a.trv_required?.label === "Yes",
        },

        
    ],
};
