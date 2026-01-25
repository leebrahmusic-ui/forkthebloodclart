// lib/kwScoring.js
export function scoreBathrooms(label) {
    // expected labels: "1 bathroom", "2 bathrooms", "3 bathrooms", "4+ bathrooms"
    if (!label) return 2; // default mid band if missing
    if (label.startsWith("1")) return 1;
    if (label.startsWith("2")) return 2;
    if (label.startsWith("3")) return 3;
    return 3; // 4+ stays in the top band
}

export function scoreRadiators(label) {
    // expected labels: "0–5", "6–9", "7–12", "10–12", "13–16", "17–20", "21–24", "25+" (accepts hyphen or en dash)
    if (!label) return 2; // default mid band if missing

    const normalized = String(label).replace("\u2013", "-").trim();

    // Low load
    if (["0-5", "6-9", "0–5", "6–9"].includes(normalized)) return 1;

    // Medium load
    if (["7-12", "7–12", "10-12", "10–12", "13-16", "13–16"].includes(normalized)) return 2;

    // Higher load (kept in top band)
    if (["17-20", "21-24", "17–20", "21–24", "25+"].includes(normalized)) return 3;

    return 2; // fallback to mid band for unexpected labels
}

export function kwBandFromScore(score) {
    // Score -> kW band
    if (score === 1) return { score: 1, kw: 24, label: "24-25 kW" };
    if (score === 2) return { score: 2, kw: 30, label: "30 kW" };
    return { score: 3, kw: 35, label: "35 kW" };
}

export function computeKw(answers) {
    const bScore = scoreBathrooms(answers?.bathrooms?.label);
    const rScore = scoreRadiators(answers?.radiators?.label);

    const finalScore = Math.max(bScore, rScore);
    const band = kwBandFromScore(finalScore);

    console.log("computeKw:", {
        bathrooms: answers?.bathrooms?.label,
        radiators: answers?.radiators?.label,
        bathroomScore: bScore,
        radiatorScore: rScore,
        finalScore,
        band,
    });

    return {
        bathroomScore: bScore,
        radiatorScore: rScore,
        finalScore,
        band,
    };
}
