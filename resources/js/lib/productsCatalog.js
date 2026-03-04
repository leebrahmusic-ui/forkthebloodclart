// lib/productsCatalog.js

const COMBI_INCLUDES = [
    "Magnetic filter",
    "Scale reducer",
    "Shock arrestor",
    // "Standard horizontal flue",
    // "Basic wireless programmable thermostat",
    "Chemical flush + inhibitor",
    "Old boiler removal & disposal",
    "Commissioning + registration",
];

const COMBI_NOTES = [

];

const SYSTEM_HEAT_INCLUDES = [
    "Magnetic system filter",
    "Chemical system flush + inhibitor",
    "Old boiler removal & disposal",
    "Hot water cylinder connection (existing)",
    "System boiler commissioning",
    "Gas Safe registration",
    "Building Control compliance certificate",
    "Manufacturer warranty registration",
];


const SYSTEM_HEAT_NOTES = [

];

export const PRODUCTS = [
    // Ideal Atlantic (Combi) — keep fixed prices from your existing catalogue
    {
        id: "ideal_atlantic_24",
        type: "combi",
        brand: "Ideal",
        model: "Atlantic Combi",
        warrantyYears: 5,
        kw: 24,
        priceType: "fixed",
        basePrice: 1599,
        images: ["/assets/productImages/ideal-atlantic-combi.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },
    {
        id: "ideal_atlantic_30",
        type: "combi",
        brand: "Ideal",
        model: "Atlantic Combi",
        warrantyYears: 5,
        kw: 30,
        priceType: "fixed",
        basePrice: 1699,
        images: ["/assets/productImages/ideal-atlantic-combi.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },

    {
        id: "ideal_atlantic_35",
        type: "combi",
        brand: "Ideal",
        model: "Atlantic Combi",
        warrantyYears: 5,
        kw: 35,
        priceType: "fixed",
        basePrice: 1849,
        images: ["/assets/productImages/ideal-atlantic-combi.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },

    // Worcester Bosch Greenstar 1000 Combi — price unknown (null)
    {
        id: "wb_greenstar_1000_24",
        type: "combi",
        brand: "Worcester Bosch",
        model: "Greenstar 1000 Combi",
        warrantyYears: 5,
        kw: 24,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/greenstar-boiler.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },
    {
        id: "wb_greenstar_1000_30",
        type: "combi",
        brand: "Worcester Bosch",
        model: "Greenstar 1000 Combi",
        warrantyYears: 5,
        kw: 30,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/greenstar-boiler.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },
    {
        id: "wb_greenstar_1000_35",
        type: "combi",
        brand: "Worcester Bosch",
        model: "Greenstar 8000+",
        warrantyYears: 12,
        kw: 36,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/greenstar-boiler8000.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },

    // Ideal Logic Max Combi — price unknown (null)
    {
        id: "ideal_logic_max_24",
        type: "combi",
        brand: "Ideal",
        model: "Logic Max Combi",
        warrantyYears: 10,
        kw: 24,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/max-combi-image.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },
    {
        id: "ideal_logic_max_30",
        type: "combi",
        brand: "Ideal",
        model: "Logic Max Combi",
        warrantyYears: 10,
        kw: 30,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/max-combi-image.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },
    {
        id: "ideal_logic_max_35",
        type: "combi",
        brand: "Ideal",
        model: "Logic Max Combi",
        warrantyYears: 10,
        kw: 35,
        priceType: "variable",
        basePrice: null,
        images: ["/assets/productImages/max-combi-image.png"],
        includes: COMBI_INCLUDES,
        notes: COMBI_NOTES,
    },

    // Ideal Logic System2 — price unknown in your new list (null)
    // (Pricing engine will use boilerCost + margin when you provide costs)
    {
        id: "ideal_system2_15",
        type: "system",
        brand: "Ideal",
        model: "Logic System2",
        warrantyYears: 2,
        kw: 15,
        priceType: "cost_plus",
        boilerCost: null,
        minMargin: 750,
        images: ["/assets/productImages/system-image.png"],
        includes: SYSTEM_HEAT_INCLUDES,
        notes: SYSTEM_HEAT_NOTES,
    },
    {
        id: "ideal_system2_18",
        type: "system",
        brand: "Ideal",
        model: "Logic System2",
        warrantyYears: 2,
        kw: 18,
        priceType: "cost_plus",
        boilerCost: null,
        minMargin: 750,
        images: ["/assets/productImages/system-image.png"],
        includes: SYSTEM_HEAT_INCLUDES,
        notes: SYSTEM_HEAT_NOTES,
    },
    {
        id: "ideal_system2_24",
        type: "system",
        brand: "Ideal",
        model: "Logic System2",
        warrantyYears: 2,
        kw: 24,
        priceType: "cost_plus",
        boilerCost: null,
        minMargin: 750,
        images: ["/assets/productImages/system-image.png"],
        includes: SYSTEM_HEAT_INCLUDES,
        notes: SYSTEM_HEAT_NOTES,
    },

    // Baxi Heat Only 415 — price unknown (null) until trade list
    {
        id: "baxi_heat_415",
        type: "heat_only",
        brand: "Baxi",
        model: "415 Heat Only",
        warrantyYears: 5,
        kw: 15,
        priceType: "cost_plus",
        boilerCost: null,
        minMargin: 750,
        images: ["/assets/productImages/baxi-image.png"],
        includes: SYSTEM_HEAT_INCLUDES,
        notes: SYSTEM_HEAT_NOTES,
    },
];
