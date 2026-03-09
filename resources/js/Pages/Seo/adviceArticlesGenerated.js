const generatedBrands = ["Ideal", "Vaillant", "Worcester"];

const generatedIssues = [
    "boiler-losing-pressure",
    "boiler-pressure-too-high",
    "boiler-ignition-lockout",
    "boiler-fan-fault",
    "boiler-kettling-noise",
    "boiler-ticking-noise",
    "boiler-no-hot-water",
    "radiators-not-heating",
    "boiler-resetting",
    "boiler-short-cycling",
    "frozen-condensate-pipe",
    "thermostat-not-responding",
    "pilot-or-flame-sensing-fault",
    "boiler-leak-near-case",
    "hot-water-temperature-fluctuating",
];

const generatedCodeFamilies = [
    "f1", "f2", "f4", "f5", "f9",
    "f22", "f23", "f24", "f28", "f29",
    "f32", "f49", "f61", "f72", "f74",
    "f75", "ea", "c6", "c7", "e9",
];

const generatedHomeScenarios = [
    "new-boiler-making-noise",
    "boiler-after-power-cut",
    "boiler-after-radiator-bleed",
    "boiler-after-repressurising",
    "heating-upstairs-not-downstairs",
    "heating-downstairs-not-upstairs",
    "morning-heating-slow-to-start",
    "hot-water-runs-cold-then-hot",
    "boiler-lockout-in-cold-weather",
    "boiler-overheating-warning",
    "boiler-whistling-when-firing",
    "boiler-humming-at-night",
    "pipe-banging-when-heating-on",
    "radiator-cold-at-bottom",
    "radiator-cold-at-top",
    "one-radiator-not-heating",
    "all-radiators-lukewarm",
    "zone-valve-not-switching",
    "programmer-not-following-schedule",
    "boiler-pressure-rises-when-hot",
    "boiler-pressure-drops-overnight",
    "prv-discharge-pipe-dripping",
    "boiler-condensate-backup",
    "boiler-relight-after-gas-work",
    "boiler-noisy-pump-symptoms",
    "boiler-flame-failure-intermittent",
    "boiler-stops-during-hot-water",
    "heating-turns-off-before-temperature",
    "boiler-needs-frequent-top-up",
    "boiler-magnetic-filter-sludge-signs",
    "thermostatic-radiator-valve-stuck",
    "heating-pump-running-constantly",
    "boiler-after-system-flush",
    "new-thermostat-not-controlling-boiler",
    "boiler-cycles-every-few-minutes",
    "boiler-loses-hot-water-at-peak-time",
    "hot-water-delay-at-taps",
    "boiler-freezes-in-loft-pipework",
    "boiler-noise-after-service",
    "boiler-fault-after-long-idle-period",
    "heating-not-reaching-setpoint",
    "boiler-restarts-when-windy",
    "boiler-safety-lockout-explained",
    "boiler-neutraliser-or-condensate-issues",
    "gas-boiler-annual-checklist",
];

const titleCase = (value) =>
    value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const buildGeneratedArticle = (slug, title, context) => ({
    slug,
    title,
    excerpt: `${context} Common causes, safe checks, and when to book an engineer.`,
    summary: `This guide explains ${context.toLowerCase()} for Leeds homeowners and gives practical next steps before booking service or repair.`,
    causes: [
        "Normal wear, circulation restrictions, or controls faults",
        "Pressure, sensor, or ignition-related behaviour depending on model",
        "System setup issues that need engineer-level diagnosis",
    ],
    checks: [
        "Note fault pattern and when it happens",
        "Check pressure and basic control settings safely",
        "Book a boiler service first, or book repair directly if the fault is persistent",
    ],
    faqs: [
        {
            q: "Can this be solved without parts?",
            a: "Sometimes. A full service may resolve setup or condition issues and confirm if repair parts are needed.",
        },
        {
            q: "Should I book service or repair first?",
            a: "Service-first is ideal for full-condition checks. Repair-first is suitable when the fault is recurring and obvious.",
        },
    ],
});

const generatedBrandIssueArticles = generatedBrands.flatMap((brand) =>
    generatedIssues.map((issue) =>
        buildGeneratedArticle(
            `guide-${brand.toLowerCase()}-${issue}`,
            `${brand} ${titleCase(issue)}: Causes and Fixes`,
            `${brand} ${titleCase(issue)}`
        )
    )
);

const generatedCodeFamilyArticles = generatedBrands.flatMap((brand) =>
    generatedCodeFamilies.map((code) =>
        buildGeneratedArticle(
            `guide-${brand.toLowerCase()}-fault-code-${code}`,
            `${brand} Fault Code ${code.toUpperCase()}: Meaning and Next Step`,
            `${brand} fault code ${code.toUpperCase()}`
        )
    )
);

const generatedHomeScenarioArticles = generatedHomeScenarios.map((scenario) =>
    buildGeneratedArticle(
        `guide-home-${scenario}`,
        `${titleCase(scenario)}: Boiler Advice Guide`,
        titleCase(scenario)
    )
);

export const generatedAdviceArticles = [
    ...generatedBrandIssueArticles,
    ...generatedCodeFamilyArticles,
    ...generatedHomeScenarioArticles,
];
