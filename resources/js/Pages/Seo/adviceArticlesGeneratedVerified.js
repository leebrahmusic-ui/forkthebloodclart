const generatedBrands = ["Ideal", "Vaillant", "Worcester"];

const generatedIssueLibrary = [
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
    "boiler-overheating-warning",
    "boiler-pressure-drops-overnight",
    "boiler-pressure-rises-when-hot",
    "boiler-noisy-pump-symptoms",
    "boiler-stops-during-hot-water",
    "boiler-cycles-every-few-minutes",
    "boiler-lockout-in-cold-weather",
    "one-radiator-not-heating",
    "all-radiators-lukewarm",
    "zone-valve-not-switching",
    "programmer-not-following-schedule",
    "heating-not-reaching-setpoint",
    "prv-discharge-pipe-dripping",
    "boiler-condensate-backup",
    "boiler-magnetic-filter-sludge-signs",
];

const brandFaultCodes = {
    ideal: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f9", "l2", "l5", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "0"],
    vaillant: ["f22", "f23", "f24", "f25", "f26", "f27", "f28", "f29", "f32", "f49", "f54", "f61", "f62", "f64", "f65", "f67", "f68", "f70", "f71", "f72", "f73", "f74", "f75", "f76", "f77", "f83"],
    worcester: ["ea", "c6", "c7", "a1", "e9", "d1", "d5", "227", "229", "232", "233", "286", "295", "296", "297", "298", "1017", "1021"],
};

const brandModels = {
    ideal: ["logic-combi", "logic-plus", "logic-max", "vogue-max", "independent-c", "esprit-eco", "mexi-he", "icos", "mini-c24", "isar-he", "exclusive-2", "instinct-combi"],
    vaillant: ["ecotec-pro", "ecotec-plus", "ecotec-exclusive", "ecofit-pure", "turbomax", "atmomax", "ecotec-plus-825", "ecotec-plus-832", "ecotec-plus-837", "ecotec-pro-28", "ecotec-pro-30", "ecotec-plus-630"],
    worcester: ["greenstar-25i", "greenstar-30i", "greenstar-4000", "greenstar-8000", "greenstar-cdi", "greenstar-ri", "greenstar-heatslave", "greenstar-junior", "greenstar-si", "greenstar-cdi-classic", "greenstar-compact", "greenstar-system"],
};

const homeScenarios = [
    "new-boiler-making-noise", "boiler-after-power-cut", "boiler-after-radiator-bleed", "boiler-after-repressurising", "heating-upstairs-not-downstairs", "heating-downstairs-not-upstairs",
    "morning-heating-slow-to-start", "hot-water-runs-cold-then-hot", "boiler-lockout-in-cold-weather", "boiler-overheating-warning", "boiler-whistling-when-firing", "boiler-humming-at-night",
    "pipe-banging-when-heating-on", "radiator-cold-at-bottom", "radiator-cold-at-top", "one-radiator-not-heating", "all-radiators-lukewarm", "zone-valve-not-switching",
    "programmer-not-following-schedule", "boiler-pressure-rises-when-hot", "boiler-pressure-drops-overnight", "prv-discharge-pipe-dripping", "boiler-condensate-backup", "boiler-relight-after-gas-work",
    "boiler-noisy-pump-symptoms", "boiler-flame-failure-intermittent", "boiler-stops-during-hot-water", "heating-turns-off-before-temperature", "boiler-needs-frequent-top-up", "boiler-magnetic-filter-sludge-signs",
    "thermostatic-radiator-valve-stuck", "heating-pump-running-constantly", "boiler-after-system-flush", "new-thermostat-not-controlling-boiler", "boiler-cycles-every-few-minutes", "boiler-loses-hot-water-at-peak-time",
    "hot-water-delay-at-taps", "boiler-freezes-in-loft-pipework", "boiler-noise-after-service", "boiler-fault-after-long-idle-period", "heating-not-reaching-setpoint", "boiler-restarts-when-windy",
    "boiler-safety-lockout-explained", "boiler-neutraliser-or-condensate-issues", "gas-boiler-annual-checklist",
];

const leedsAreas = ["city-centre", "headingley", "chapeltown", "roundhay", "meanwood", "armley", "burley", "horsforth", "guiseley", "otley", "morley", "beeston", "crossgates", "garforth", "rothwell", "pudsey", "farsley", "york-road", "kirkstall", "seacroft", "harehills", "hyde-park", "adel", "alwoodley", "churwell", "east-end-park", "halton", "hunslet", "middleton", "oakwood", "whinmoor", "woodlesford", "yeadon", "pool-in-wharfedale", "shadwell", "wetherby"];

const titleCase = (value) =>
    value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const buildGeneratedArticle = (slug, title, context, category = "general") => ({
    slug,
    title,
    excerpt: `${context} Causes, safe checks, warning signs, and when to book service or repair.`,
    summary: `This guide covers ${context.toLowerCase()} for Leeds homeowners, including symptom pattern checks, escalation thresholds, and what a professional diagnosis typically includes.`,
    causes: [
        "Normal wear in circulation, ignition, sensing, or control components",
        "Pressure or flow instability across the wider heating system",
        "Setup, controls, or system condition issues that need engineer diagnosis",
    ],
    checks: [
        "Record exactly when the fault appears (startup, hot water, heating demand, or weather change)",
        "Check system pressure and control settings safely without removing boiler casing",
        "If the issue repeats, book service or repair rather than repeatedly resetting",
    ],
    dangerSigns: [
        "Recurring lockout codes after reset",
        "Rapid pressure swings or repeated discharge pipe dripping",
        "Persistent combustion/noise symptoms with reduced heating reliability",
    ],
    whatNotToDo: [
        "Do not remove the boiler case or attempt internal gas appliance work",
        "Do not rely on repeated resets as a long-term fix",
        "Do not keep topping up pressure repeatedly without diagnosis",
    ],
    diagnosisPath: [
        "Engineer confirms symptom pattern and appliance fault history",
        "System pressure, circulation, sensors, and controls are tested in sequence",
        "Root cause is confirmed and a targeted service/repair plan is provided",
    ],
    serviceVsRepair:
        "If the boiler is still operating but inconsistent, service-first is often efficient for full-condition checks. If the fault is persistent and obvious, repair-first can be faster.",
    prevention: [
        "Keep annual servicing consistent",
        "Act early on pressure/noise changes",
        "Maintain inhibitor/water quality and address circulation issues promptly",
    ],
    category,
    faqs: [
        {
            q: "Can this clear on its own?",
            a: "Intermittent symptoms can appear to clear, but recurring patterns usually indicate an underlying issue that should be diagnosed.",
        },
        {
            q: "Should I book service or repair first?",
            a: "Service-first gives full-condition context; repair-first is suitable when the same fault keeps returning.",
        },
        {
            q: "Is this safe for DIY internal repair?",
            a: "No. Gas appliance diagnostics and internal repairs should be completed by a qualified Gas Safe engineer.",
        },
    ],
});

const articles = [];

const pushArticle = (article) => {
    if (!articles.some((existing) => existing.slug === article.slug)) {
        articles.push(article);
    }
};

generatedBrands.forEach((brand) => {
    const brandKey = brand.toLowerCase();

    generatedIssueLibrary.forEach((issue) => {
        pushArticle(
            buildGeneratedArticle(
                `guide-${brandKey}-${issue}`,
                `${brand} ${titleCase(issue)}: Causes, Checks and Next Steps`,
                `${brand} ${titleCase(issue)}`,
                "brand-issue"
            )
        );
    });

    brandModels[brandKey].forEach((model) => {
        ["boiler-losing-pressure", "boiler-no-hot-water", "boiler-resetting", "boiler-fan-fault", "boiler-kettling-noise", "thermostat-not-responding", "boiler-short-cycling"].forEach((issue) => {
            pushArticle(
                buildGeneratedArticle(
                    `guide-${brandKey}-${model}-${issue}`,
                    `${brand} ${titleCase(model)} ${titleCase(issue)} Guide`,
                    `${brand} ${titleCase(model)} ${titleCase(issue)}`,
                    "model-issue"
                )
            );
        });
    });

    brandFaultCodes[brandKey].forEach((code) => {
        pushArticle(
            buildGeneratedArticle(
                `guide-${brandKey}-fault-code-${code}`,
                `${brand} Fault Code ${code.toUpperCase()}: Meaning and Next Steps`,
                `${brand} fault code ${code.toUpperCase()}`,
                "fault-code"
            )
        );

        ["reset-guide", "causes", "when-to-call-engineer"].forEach((angle) => {
            pushArticle(
                buildGeneratedArticle(
                    `guide-${brandKey}-fault-code-${code}-${angle}`,
                    `${brand} Fault Code ${code.toUpperCase()} ${titleCase(angle)} Guide`,
                    `${brand} fault code ${code.toUpperCase()} ${titleCase(angle)}`,
                    "fault-code-support"
                )
            );
        });
    });
});

homeScenarios.forEach((scenario) => {
    pushArticle(
        buildGeneratedArticle(
            `guide-home-${scenario}`,
            `${titleCase(scenario)}: Boiler Advice Guide`,
            titleCase(scenario),
            "home-scenario"
        )
    );
});

leedsAreas.forEach((area) => {
    ["boiler-service-advice", "boiler-repair-advice", "boiler-fault-guide"].forEach((intent) => {
        pushArticle(
            buildGeneratedArticle(
                `guide-leeds-${area}-${intent}`,
                `Leeds ${titleCase(area)} ${titleCase(intent)}: What to Check First`,
                `Leeds ${titleCase(area)} ${titleCase(intent)}`,
                "location-intent"
            )
        );
    });
});

export const generatedAdviceArticles = articles;
