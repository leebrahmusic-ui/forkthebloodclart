import { generatedAdviceArticles } from "./adviceArticlesGeneratedVerified.js";

const baseAdviceArticles = [
    {
        slug: "boiler-losing-pressure",
        title: "Boiler Losing Pressure: Causes and Next Steps",
        excerpt:
            "If pressure keeps dropping, small leaks, valve issues, or internal boiler faults are common causes.",
        summary:
            "A sealed heating system should hold pressure fairly steadily. If you repeatedly top up your boiler, there is usually an underlying fault that needs identifying.",
        causes: [
            "Small leaks on radiator valves, joints, or hidden pipework",
            "Pressure relief valve (PRV) passing water",
            "Internal boiler component or expansion vessel issues",
        ],
        checks: [
            "Check visible radiator valves and pipe joints for moisture",
            "Look for discharge pipe drips outside",
            "Note pressure cold vs after heating cycle",
        ],
        faqs: [
            {
                q: "Can I keep topping up pressure?",
                a: "Topping up repeatedly is a temporary workaround and can hide a worsening fault.",
            },
            {
                q: "Should I book service or repair?",
                a: "A service may resolve some issues and can identify whether repair is required. You can also book repair directly.",
            },
        ],
    },
    {
        slug: "boiler-pressure-too-high",
        title: "Boiler Pressure Too High: Why It Happens",
        excerpt:
            "Over-pressurisation often points to a filling loop, expansion vessel, or pressure-control issue.",
        summary:
            "When pressure climbs well above normal, your system is under extra stress. This should be investigated before it causes repeated lockouts or valve discharge.",
        causes: [
            "Filling loop not fully closed",
            "Expansion vessel charge loss",
            "Pressure relief or control component fault",
        ],
        checks: [
            "Confirm filling loop valves are fully closed",
            "Check gauge readings with heating off and on",
            "Watch for discharge pipe dripping",
        ],
        faqs: [
            {
                q: "Is high pressure dangerous?",
                a: "It can strain parts and trigger protective shutdowns. Repeated high pressure should be diagnosed.",
            },
            {
                q: "Will a service help?",
                a: "A service may resolve performance-related issues and helps identify whether a targeted repair is needed.",
            },
        ],
    },
    {
        slug: "vaillant-f75-error-code",
        title: "Vaillant F75 Error Code: Common Causes",
        excerpt:
            "F75 usually means no detectable pressure change when the pump starts.",
        summary:
            "Vaillant F75 is commonly linked with pressure sensing, pump operation, or low circulation. It often needs engineer-level diagnosis.",
        causes: [
            "Faulty or blocked pressure sensor",
            "Pump performance issue",
            "System leak or low circulation",
        ],
        checks: [
            "Check system pressure on gauge",
            "Listen for pump start behaviour",
            "Look for visible leaks",
        ],
        faqs: [
            { q: "Can I just reset it?", a: "A reset may temporarily clear the lockout, but recurring F75 needs root-cause diagnosis." },
            { q: "Best booking route?", a: "Book a service first for full checks, or book repair directly if you want fault-first handling." },
        ],
    },
    {
        slug: "vaillant-f72-error-code",
        title: "Vaillant F72 Error Code: Sensor Mismatch Guide",
        excerpt:
            "F72 commonly indicates flow/return thermistor mismatch or circulation-related sensor issues.",
        summary:
            "This fault is often caused by NTC sensor reading differences, poor flow through the heat exchanger, or wiring/sensor issues.",
        causes: [
            "Flow and return NTC sensor discrepancy",
            "Poor circulation through heat exchanger",
            "Wiring or connector faults",
        ],
        checks: [
            "Check whether code returns after reset",
            "Monitor heating stability and hot water behaviour",
            "Book diagnostics if lockout recurs",
        ],
        faqs: [
            { q: "Is this DIY-fixable?", a: "Not safely in most cases. Sensor and electrical checks should be carried out by a Gas Safe engineer." },
            { q: "Service or repair?", a: "Service can help identify underlying causes; repair is appropriate if fault is already clear." },
        ],
    },
    {
        slug: "ideal-f2-error-code",
        title: "Ideal F2 Error Code: Flame Loss Explained",
        excerpt:
            "F2 usually indicates flame loss or ignition lockout on Ideal boilers.",
        summary:
            "Ideal F2 can be linked to combustion, airflow, gas supply, fan, or control faults. Recurring lockout should be assessed professionally.",
        causes: [
            "Ignition/flame sensing fault",
            "Fan or flue airflow problem",
            "Gas supply or gas valve issue",
        ],
        checks: [
            "Check if other gas appliances are operating normally",
            "Look for repeated lockout pattern",
            "Avoid repeated unsafe DIY resets",
        ],
        faqs: [
            { q: "Can a service fix F2?", a: "A service may resolve related performance issues and identify if a specific repair is required." },
            { q: "When to book repair directly?", a: "If F2 is persistent and heating is unreliable, repair booking is often the fastest route." },
        ],
    },
    {
        slug: "worcester-ea-fault-code",
        title: "Worcester EA Fault Code: What It Usually Means",
        excerpt:
            "EA typically points to ignition/flame detection problems.",
        summary:
            "Worcester EA is commonly associated with failed ignition or unstable flame detection. A proper combustion and controls check is recommended.",
        causes: [
            "Ignition or flame sensing issue",
            "Gas supply consistency problem",
            "Combustion airflow fault",
        ],
        checks: [
            "Check if code is persistent after reset",
            "Note if issue occurs only on hot water or heating",
            "Arrange professional diagnosis if recurring",
        ],
        faqs: [
            { q: "Is EA serious?", a: "It is a lockout condition and should be diagnosed promptly if it returns." },
            { q: "Service or repair booking?", a: "Both are valid: service for full condition checks, repair for direct fault handling." },
        ],
    },
    {
        slug: "boiler-ticking-noise",
        title: "Boiler Ticking Noise: Normal or Fault?",
        excerpt:
            "Ticking can be normal expansion, but can also indicate loose parts, trapped air, or scaling.",
        summary:
            "Some ticking is harmless pipe expansion. Persistent or worsening noise, especially with poor heating, should be checked.",
        causes: [
            "Pipe expansion/contraction",
            "Trapped air in radiators or pipework",
            "Loose components or limescale-related flow noise",
        ],
        checks: [
            "Check if noise only happens at startup",
            "Bleed radiators where needed",
            "Track pressure and heating performance together",
        ],
        faqs: [
            { q: "When is ticking a warning sign?", a: "If noise is louder, continuous, or paired with heating faults or pressure instability." },
            { q: "What should I book?", a: "Book a service first in most cases; book repair directly if fault symptoms are clear and persistent." },
        ],
    },
    {
        slug: "boiler-kettling-noise",
        title: "Boiler Kettling Noise: Why It Happens",
        excerpt:
            "Kettling often sounds like a whistling kettle and is linked with heat exchanger scaling or poor flow.",
        summary:
            "Kettling usually indicates restricted flow and local overheating in the heat exchanger. This can reduce efficiency and stress components.",
        causes: [
            "Limescale buildup in heat exchanger",
            "Poor circulation through system",
            "Debris/sludge restriction",
        ],
        checks: [
            "Check system pressure and flow consistency",
            "Note if noise increases under heat demand",
            "Book service to assess water quality and circulation",
        ],
        faqs: [
            { q: "Can inhibitor help?", a: "Inhibitor helps prevention, but existing restriction may still need professional treatment." },
            { q: "Is repair always needed?", a: "Not always. A service may resolve some causes and identify whether repair is required." },
        ],
    },
    {
        slug: "boiler-fan-not-working",
        title: "Boiler Fan Not Working: Signs and Action",
        excerpt:
            "Fan faults can trigger lockouts due to unsafe combustion airflow conditions.",
        summary:
            "The fan is safety-critical for combustion airflow. If it fails, the boiler often locks out to prevent unsafe operation.",
        causes: [
            "Fan motor wear/failure",
            "Air pressure proving issue",
            "Control board or wiring fault",
        ],
        checks: [
            "Check for repeated fault codes and lockouts",
            "Do not run repeated unsafe resets",
            "Arrange Gas Safe diagnosis promptly",
        ],
        faqs: [
            { q: "Can I keep using boiler with fan fault?", a: "No. Persistent fan-related lockouts should be professionally assessed." },
            { q: "Service vs repair?", a: "Repair is often appropriate for clear fan faults, though service can still provide full condition checks." },
        ],
    },
    {
        slug: "boiler-no-hot-water",
        title: "Boiler Working But No Hot Water",
        excerpt:
            "If heating works but hot water fails, diverter, plate exchanger, sensor or controls may be involved.",
        summary:
            "No hot water with partial boiler function often points to domestic hot water pathway faults rather than total appliance failure.",
        causes: [
            "Diverter valve issue",
            "Plate heat exchanger restriction",
            "Sensor or control fault",
        ],
        checks: [
            "Test heating and hot water separately",
            "Note any fault code on display",
            "Book service or repair based on urgency",
        ],
        faqs: [
            { q: "Could pressure be related?", a: "Yes, low pressure can affect operation on some systems." },
            { q: "Best first booking?", a: "Service may identify broader issues; repair is suitable for urgent fault-first resolution." },
        ],
    },
    {
        slug: "radiators-not-heating-up",
        title: "Radiators Not Heating Up Properly",
        excerpt:
            "Cold radiators can be caused by airlocks, balancing issues, low pressure, or circulation faults.",
        summary:
            "Uneven or cold radiators are usually a circulation issue in the wider system, not always the boiler core itself.",
        causes: [
            "Air trapped in radiators",
            "System balancing issues",
            "Low pressure or pump circulation problems",
        ],
        checks: [
            "Bleed affected radiators",
            "Check pressure after bleeding",
            "Compare heat output across rooms",
        ],
        faqs: [
            { q: "Do I need a boiler repair for one cold radiator?", a: "Not always. System balancing or venting may be enough." },
            { q: "When to escalate?", a: "If multiple radiators remain cold after basic checks, book a service or repair visit." },
        ],
    },
    {
        slug: "boiler-overflow-pipe-leaking",
        title: "Boiler Overflow / Discharge Pipe Leaking",
        excerpt:
            "A leaking discharge pipe often means pressure relief is activating due to overpressure or valve issues.",
        summary:
            "Water from the discharge pipe is a useful fault clue. It can indicate pressure control faults or a PRV that no longer seals correctly.",
        causes: [
            "Over-pressurised heating system",
            "Pressure relief valve not reseating",
            "Expansion vessel fault causing pressure spikes",
        ],
        checks: [
            "Track when dripping occurs (heating on/off)",
            "Monitor gauge behaviour",
            "Avoid repeated top-up cycles without diagnosis",
        ],
        faqs: [
            { q: "Is this an emergency?", a: "Not always, but persistent discharge should be checked quickly to avoid further faults." },
            { q: "Service first?", a: "Service may identify and sometimes resolve cause; repair may still be required." },
        ],
    },
    {
        slug: "expansion-vessel-fault",
        title: "Expansion Vessel Fault Symptoms",
        excerpt:
            "Pressure swings and discharge pipe leaks are common signs of an expansion vessel issue.",
        summary:
            "A failing expansion vessel can cause unstable pressure, frequent top-ups, and stress on safety components.",
        causes: [
            "Loss of vessel charge",
            "Internal diaphragm failure",
            "Long-term pressure cycling wear",
        ],
        checks: [
            "Observe pressure rise during heating",
            "Check for discharge pipe activity",
            "Arrange professional vessel assessment",
        ],
        faqs: [
            { q: "Can inhibitor fix this?", a: "No. This is usually a mechanical pressure-management fault." },
            { q: "Service or repair?", a: "Service can identify the issue; repair is required if vessel or related parts fail." },
        ],
    },
    {
        slug: "filling-loop-left-open",
        title: "Filling Loop Left Open: Pressure Problems",
        excerpt:
            "An open filling loop can cause gradual over-pressurisation and repeated discharge.",
        summary:
            "If system pressure keeps climbing unexpectedly, check filling loop valves first. Small valve seepage can mimic deeper faults.",
        causes: [
            "Valves not fully closed",
            "Valve seat wear allowing seepage",
            "Incorrect repressurisation process",
        ],
        checks: [
            "Confirm both loop valves are fully shut",
            "Recheck pressure trend over 24 hours",
            "Book service if pressure still rises",
        ],
        faqs: [
            { q: "Could this damage the boiler?", a: "Persistent overpressure can stress components and trigger safety discharge." },
            { q: "Should I book repair immediately?", a: "If pressure remains unstable after loop checks, repair booking is sensible." },
        ],
    },
    {
        slug: "frozen-condensate-pipe",
        title: "Frozen Condensate Pipe: Boiler Not Firing",
        excerpt:
            "In cold weather, frozen condensate can cause lockouts and no-heat symptoms.",
        summary:
            "A frozen condensate line can stop normal boiler operation, especially during winter cold spells.",
        causes: [
            "External condensate run freezing",
            "Insufficient insulation on pipework",
            "Poor route/fall for condensate line",
        ],
        checks: [
            "Inspect external condensate section",
            "Look for lockout code recurrence",
            "Book service for route/insulation improvement advice",
        ],
        faqs: [
            { q: "Will this keep happening?", a: "It can recur if pipe routing and insulation are not improved." },
            { q: "Service or repair?", a: "Service can address setup/prevention; repair may be needed if component damage occurred." },
        ],
    },
    {
        slug: "boiler-ignition-lockout",
        title: "Boiler Ignition Lockout: What to Do",
        excerpt:
            "Ignition lockout means the boiler failed to light safely and has shut down for protection.",
        summary:
            "Lockouts are protective. If the issue keeps returning after reset, there is usually an ignition, gas, airflow, or control fault.",
        causes: [
            "Ignition electrode/flame sensing issue",
            "Gas supply inconsistency",
            "Fan/airflow proving fault",
        ],
        checks: [
            "Note exact code and pattern",
            "Check if other gas appliances are normal",
            "Book service or repair for full diagnosis",
        ],
        faqs: [
            { q: "Can I keep resetting?", a: "Repeated resets without diagnosis are not recommended." },
            { q: "Best booking path?", a: "Service for broad checks; repair for direct fault-first approach." },
        ],
    },
    {
        slug: "boiler-keeps-needing-reset",
        title: "Boiler Keeps Needing Reset",
        excerpt:
            "Frequent resets indicate unresolved underlying faults, not a permanent fix.",
        summary:
            "A healthy boiler should not require regular manual resets. Recurrence points to a persistent safety or control issue.",
        causes: [
            "Intermittent sensor or wiring faults",
            "Combustion or ignition instability",
            "Pressure or circulation issues",
        ],
        checks: [
            "Track how often reset is needed",
            "Record displayed fault code",
            "Arrange professional investigation",
        ],
        faqs: [
            { q: "Does reset mean fixed?", a: "Usually temporary only when the fault condition returns." },
            { q: "Service or repair?", a: "Either can work; service may identify broader condition while repair targets immediate fault." },
        ],
    },
    {
        slug: "boiler-short-cycling",
        title: "Boiler Short Cycling: Causes and Fixes",
        excerpt:
            "Short cycling means the boiler turns on and off too frequently.",
        summary:
            "Frequent cycling can reduce efficiency and increase wear. Common causes include flow issues, controls setup, and sensor faults.",
        causes: [
            "Restricted system flow",
            "Thermostat/control setup mismatch",
            "Sensor feedback inconsistencies",
        ],
        checks: [
            "Observe burner run-time pattern",
            "Check radiator heat distribution",
            "Book service to assess setup and system health",
        ],
        faqs: [
            { q: "Can this increase bills?", a: "Yes, short cycling often reduces efficiency and increases component wear." },
            { q: "Is repair always needed?", a: "Not always. Service and controls optimisation may improve behaviour." },
        ],
    },
    {
        slug: "air-in-heating-system",
        title: "Air in Heating System: Symptoms and Action",
        excerpt:
            "Airlocks can cause gurgling, cold spots, weak circulation and unstable pressure readings.",
        summary:
            "Trapped air disrupts flow and can mimic boiler faults. Correct venting and system setup checks are important.",
        causes: [
            "Recent radiator bleeding without proper top-up",
            "Minor leaks allowing air ingress",
            "Poor system venting",
        ],
        checks: [
            "Bleed radiators in sequence",
            "Recheck system pressure afterward",
            "Monitor for recurring air symptoms",
        ],
        faqs: [
            { q: "Will bleeding fix everything?", a: "It can help, but recurring air suggests an underlying issue needing diagnosis." },
            { q: "Service useful here?", a: "Yes, service can review full system condition and identify root causes." },
        ],
    },
    {
        slug: "boiler-service-vs-repair",
        title: "Boiler Service vs Boiler Repair: Which One to Book?",
        excerpt:
            "Service is preventative/condition-focused, repair is fault-focused. Both can be valid first steps.",
        summary:
            "If your boiler still runs but behaves inconsistently, service is often a strong first option. If there is a clear persistent fault or lockout, repair-first can be faster.",
        causes: [
            "Service booking suits broad checks and maintenance",
            "Repair booking suits known fault symptoms",
            "Hybrid approach often works best: service findings followed by repair if required",
        ],
        checks: [
            "List your main symptom and frequency",
            "Check for any fault code",
            "Choose service-first or repair-first based on urgency",
        ],
        faqs: [
            { q: "Will a service always fix faults?", a: "No. A service may resolve some issues and can identify repair requirements." },
            { q: "Can I skip service and book repair?", a: "Yes, direct repair booking is available if you prefer." },
        ],
    },
    {
        slug: "how-often-service-boiler",
        title: "How Often Should You Service a Boiler?",
        excerpt:
            "Annual servicing is the standard recommendation for safety, reliability and warranty support.",
        summary:
            "Regular servicing helps keep performance stable, catches wear early, and supports safer operation over time.",
        causes: [
            "Combustion and safety checks drift over time",
            "System debris and minor faults can build gradually",
            "Warranty and reliability benefits from routine maintenance",
        ],
        checks: [
            "Book annual service reminders",
            "Track pressure/noise trends between visits",
            "Act early on recurring symptoms",
        ],
        faqs: [
            { q: "Can I service less often?", a: "Long gaps increase risk of avoidable faults and reduced efficiency." },
            { q: "What if fault appears before service date?", a: "Book a repair visit or service sooner depending on severity." },
        ],
    },
    {
        slug: "leeds-boiler-service-guide",
        title: "Boiler Service in Leeds: What to Expect",
        excerpt:
            "What happens during a local boiler service and when it should become a repair visit.",
        summary:
            "A professional service reviews combustion safety, pressure behaviour, controls, and overall system condition.",
        causes: [
            "Annual safety/performance checks",
            "Early detection of wear and pressure issues",
            "Clear recommendation on whether repair is needed",
        ],
        checks: [
            "Have fault notes/codes ready for engineer",
            "Confirm access to boiler and controls",
            "Discuss symptoms in order of priority",
        ],
        faqs: [
            { q: "Can service become repair on same journey?", a: "Sometimes, depending on fault, parts, and appointment scope." },
            { q: "Why service if I can book repair?", a: "Service offers full-condition context that can prevent repeat issues." },
        ],
    },
    {
        slug: "leeds-boiler-repair-guide",
        title: "Boiler Repair in Leeds: Fault-First Booking Guide",
        excerpt:
            "Repair visits are fault-focused and suitable for persistent lockouts or clear failures.",
        summary:
            "If you have a recurring fault code, no hot water, or repeated resets, repair-first booking is often appropriate.",
        causes: [
            "Persistent lockout/fault codes",
            "Loss of heating or hot water",
            "Recurring pressure or circulation failure",
        ],
        checks: [
            "Capture fault code and timing",
            "Note recent pressure/noise changes",
            "Provide model details if available",
        ],
        faqs: [
            { q: "Does repair include full service?", a: "Repair appointments are fault-focused and do not automatically include a full service." },
            { q: "Can I book service instead?", a: "Yes. Service can still be chosen first if you want full-condition checks." },
        ],
    },
    {
        slug: "vaillant-fan-fault",
        title: "Vaillant Fan Fault Symptoms",
        excerpt:
            "Fan and airflow proving faults can trigger lockouts and unstable combustion behaviour.",
        summary:
            "If a Vaillant boiler reports fan-related faults or repeatedly fails to light, airflow and fan operation should be professionally checked.",
        causes: [
            "Fan speed/proving anomaly",
            "Air pressure switch/proving chain issue",
            "Flue path resistance or control fault",
        ],
        checks: [
            "Track code recurrence",
            "Avoid repeated unsafe reset loops",
            "Book Gas Safe diagnosis",
        ],
        faqs: [
            { q: "Can weather affect this?", a: "External conditions can influence flue performance in some cases." },
            { q: "Service or repair?", a: "Repair-first is common for clear fan faults; service can still help evaluate whole system condition." },
        ],
    },
    {
        slug: "ideal-low-water-pressure",
        title: "Ideal Low Water Pressure Faults",
        excerpt:
            "Low pressure on Ideal systems often shows as reduced performance or lockout codes.",
        summary:
            "Persistent low pressure should be investigated rather than repeatedly topped up.",
        causes: [
            "External system leaks",
            "PRV or expansion vessel issues",
            "Internal boiler pressure-management faults",
        ],
        checks: [
            "Check gauge below normal range",
            "Inspect visible joints and valves",
            "Book service/repair if recurrence continues",
        ],
        faqs: [
            { q: "Is one top-up okay?", a: "Occasional top-up can happen, but frequent top-ups indicate a fault." },
            { q: "Best first booking?", a: "Service-first is common; repair-first is valid for persistent hard faults." },
        ],
    },
    {
        slug: "worcester-c6-c7-faults",
        title: "Worcester C6 / C7 Faults Explained",
        excerpt:
            "C6/C7 usually relate to fan speed/proving or fan control behaviour.",
        summary:
            "These faults are typically linked to airflow safety checks and fan response. They should be diagnosed professionally.",
        causes: [
            "Fan speed below expected range",
            "Fan control feedback issue",
            "Airflow proving chain anomaly",
        ],
        checks: [
            "Capture exact code and timing",
            "Check recurrence after reset",
            "Arrange engineer assessment",
        ],
        faqs: [
            { q: "Can I ignore intermittent C6/C7?", a: "Intermittent safety faults can become persistent and should be checked." },
            { q: "Service or repair?", a: "Repair-first is usually suitable for code-specific faults." },
        ],
    },
    {
        slug: "boiler-pressure-guide-1-to-1-5-bar",
        title: "Boiler Pressure Guide: Why 1 to 1.5 Bar Matters",
        excerpt:
            "Most sealed domestic systems operate best around 1 to 1.5 bar when cold.",
        summary:
            "Keeping pressure in the normal cold range supports stable circulation and fewer nuisance lockouts.",
        causes: [
            "Pressure below range can reduce circulation",
            "Pressure above range can stress safety components",
            "Frequent fluctuations suggest underlying faults",
        ],
        checks: [
            "Read gauge when system is cold",
            "Compare with reading when heating is active",
            "Investigate repeated deviations",
        ],
        faqs: [
            { q: "Is slight movement normal?", a: "Yes. Minor changes between cold and hot operation are expected." },
            { q: "When should I book?", a: "Book if pressure repeatedly drops below or rises above normal range." },
        ],
    },
];

const TARGET_TOTAL_ADVICE_PAGES = 461;
const mergedAdviceArticles = [...baseAdviceArticles, ...generatedAdviceArticles];

export const adviceArticles = mergedAdviceArticles.slice(0, TARGET_TOTAL_ADVICE_PAGES);

export const adviceBySlug = Object.fromEntries(
    adviceArticles.map((article) => [article.slug, article])
);
