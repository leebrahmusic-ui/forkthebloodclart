// lib/quoteEngine.js
import { PRODUCTS as DEFAULT_PRODUCTS } from "./productsCatalog";
import { ADDONS as DEFAULT_ADDONS, RULES as DEFAULT_RULES } from "./quoteConfig";

const getOverrides = () => {
  if (typeof window === "undefined") return {};
  return window.__PRICING_OVERRIDES__ || {};
};

const numOr = (v, fallback) => {
  if (v === null || v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeLegacyProduct = (p) => {
    const next = { ...p };
    const brand = String(next.brand || "");
    const model = String(next.model || "").toLowerCase();

    if (
        (next.id === "wb_greenstar_1000_35" || model.includes("8000")) &&
        Number(next.kw) === 35
    ) {
        next.kw = 36;
    }

    if (/\b36\s*kw\b/i.test(brand)) {
        next.brand = brand.replace(/\s*36\s*kw\b/i, "").trim() || "Worcester Bosch";
    }

    return next;
};

const applyEffectiveConfig = () => {
  const o = getOverrides();
  const oRules = o.rules || {};
  const oAddons = o.addons || {};
  const oProducts = o.products || {};
    const catalogProducts = Array.isArray(o?.catalog?.products) && o.catalog.products.length
        ? o.catalog.products
        : DEFAULT_PRODUCTS;

  const RULES = {
    ...DEFAULT_RULES,
    MIN_MARGIN_SYSTEM_HEAT: numOr(oRules.MIN_MARGIN_SYSTEM_HEAT, DEFAULT_RULES.MIN_MARGIN_SYSTEM_HEAT),
    TRV_MAX_QTY: numOr(oRules.TRV_MAX_QTY, DEFAULT_RULES.TRV_MAX_QTY),
  };

  const ADDONS = JSON.parse(JSON.stringify(DEFAULT_ADDONS));
  Object.keys(ADDONS).forEach((k) => {
    const key = `${k}.unitPrice`;
    if (oAddons[key] !== undefined) {
      ADDONS[k].unitPrice = numOr(oAddons[key], ADDONS[k].unitPrice);
    }
  });

    const PRODUCTS = catalogProducts.map((p) => {
    const next = normalizeLegacyProduct(p);

    if (oProducts[`${p.id}.basePrice`] !== undefined) {
      const v = oProducts[`${p.id}.basePrice`];
      next.basePrice = v === null ? null : numOr(v, p.basePrice);
    }

    if (oProducts[`${p.id}.boilerCost`] !== undefined) {
      const v = oProducts[`${p.id}.boilerCost`];
      next.boilerCost = v === null ? null : numOr(v, p.boilerCost);
    }

    if (oProducts[`${p.id}.minMargin`] !== undefined) {
      next.minMargin = numOr(oProducts[`${p.id}.minMargin`], p.minMargin);
    }

    return next;
  });

  return { RULES, ADDONS, PRODUCTS };
};

const money = (n) => Math.round((Number(n) || 0) * 100) / 100;

function label(v) {
    return v?.label ?? null;
}

function isYes(v) {
    return (v?.label || "").toLowerCase() === "yes";
}

function clampInt(n, min, max) {
    const x = Number(n);
    if (Number.isNaN(x)) return min;
    return Math.max(min, Math.min(max, Math.trunc(x)));
}

function questionMap(questions = []) {
    const map = new Map();
    for (const q of questions) map.set(q.id, q.question);
    return map;
}

/* ===========================
  1) Parse spec buckets
=========================== */

function parseRadsBucket(lab) {
    if (!lab) return null;
    if (lab.includes("Up to")) return "UP_TO_6";
    if (lab.includes("7")) return "R7_12";
    if (lab.includes("13")) return "R13_20";
    if (lab.includes("21")) return "R21_PLUS";
    return null;
}

function parseBaths(lab) {
    if (!lab) return null;
    const n = parseFloat(lab);
    if (Number.isFinite(n)) return n;
    return null;
}

function bathsScore(baths) {
    if (baths == null) return null;
    if (baths <= 1.5) return 1;
    if (baths === 2) return 2;
    return 3;
}

/* ===========================
  2) Eligibility + sizing
=========================== */

function combiAllowed(baths) {
    const score = bathsScore(baths);
    if (score == null) return false;
    return score <= 3;
}

function combiTargetKw(baths) {
    const DEFAULT_KW = 35;
    const score = bathsScore(baths);
    if (score == null) return DEFAULT_KW;

    if (score === 1) return 24;
    if (score === 2) return 30;
    return 35;
}

function sysHeatBand(radsBucket) {
    if (!radsBucket) return { min: 18, max: 24 };
    if (radsBucket === "UP_TO_6") return { min: 15, max: 18 };
    if (radsBucket === "R7_12") return { min: 18, max: 24 };
    if (radsBucket === "R13_20") return { min: 24, max: 30 };
    return { min: 30, max: 60 };
}

function pickKwForSystemHeat(productsOfType, band) {
    const within = productsOfType
        .map((p) => p.kw)
        .filter((kw) => kw >= band.min && kw <= band.max)
        .sort((a, b) => b - a);
    if (within.length) return within[0];

    const aboveMin = productsOfType
        .map((p) => p.kw)
        .filter((kw) => kw > band.min)
        .sort((a, b) => a - b);
    if (aboveMin.length) return aboveMin[0];

    const belowMax = productsOfType
        .map((p) => p.kw)
        .filter((kw) => kw < band.max)
        .sort((a, b) => b - a);
    if (belowMax.length) return belowMax[0];

    return null;
}

/* ===========================
  3) Boiler type resolution
=========================== */

function resolveBoilerTypeFromAnswers(answers, { combiOk, combiKw }) {
    if (isYes(answers?.move_to_combi)) return "combi";

    const typeKnown = (answers?.boiler_type_known?.label || "").toLowerCase() === "yes";
    const currentType = (answers?.current_boiler_type?.label || "").toLowerCase();

    if (typeKnown) {
        if (currentType.includes("combi")) return "combi";
        if (currentType.includes("system")) return "system";
        if (currentType.includes("regular") || currentType.includes("standard") || currentType.includes("back")) {
            return "heat_only";
        }
    }

    const tank = (answers?.has_water_tank?.label || "").toLowerCase();
    const gauge = (answers?.pressure_gauge?.label || "").toLowerCase();

    if (tank === "yes") {
        if (gauge === "yes") return "system";
        if (gauge === "no") return "heat_only";
        return "system";
    }

    if (tank === "no") {
        if (combiOk && combiKw != null) return "combi";
        return "system";
    }

    return combiOk && combiKw != null ? "combi" : "system";
}

/* ===========================
  4) Flue logic
=========================== */

function resolveFlueType(answers) {
    const label = (answers?.flue_wall?.label || "").toLowerCase();
    const isVertical = label.startsWith("no") || label.includes("roof");
    return isVertical
        ? "vertical"
        : "horizontal";
}

/* ===========================
  5) Add-ons
=========================== */

function computeAddOns(answers, boilerType, { ADDONS, RULES }) {
    const items = [];

    if ((answers?.thermostat_type?.label || "Basic").toLowerCase() === "smart") {
        items.push({
            key: ADDONS.SMART_STAT.key,
            label: ADDONS.SMART_STAT.label,
            qty: 1,
            unitPrice: ADDONS.SMART_STAT.unitPrice,
            total: ADDONS.SMART_STAT.unitPrice,
        });
    }

    if ((answers?.trv_required?.label || "No") === "Yes") {
        const qty = clampInt(answers?.trv_qty?.value ?? 0, 0, RULES.TRV_MAX_QTY);
        if (qty > 0) {
            items.push({
                key: ADDONS.TRV.key,
                label: ADDONS.TRV.label,
                qty,
                unitPrice: ADDONS.TRV.unitPrice,
                total: money(qty * ADDONS.TRV.unitPrice),
            });
        }
    }

    const flue = resolveFlueType(answers);
    if (flue === "vertical") {
        const verticalKey =
            boilerType === "combi"
                ? ADDONS.COMBI_VERTICAL_FLUE
                : ADDONS.SYS_HEAT_VERTICAL_FLUE;

        items.push({
            key: verticalKey.key,
            label: verticalKey.label,
            qty: 1,
            unitPrice: verticalKey.unitPrice,
            total: verticalKey.unitPrice,
        });
    }

    if (isYes(answers?.boiler_move_location)) {
        items.push({
            key: ADDONS.BOILER_RELOCATION.key,
            label: ADDONS.BOILER_RELOCATION.label,
            qty: 1,
            unitPrice: ADDONS.BOILER_RELOCATION.unitPrice,
            total: ADDONS.BOILER_RELOCATION.unitPrice,
        });
    }

    const currentType = (answers?.current_boiler_type?.label || "").toLowerCase();
    const currentlyCombi = currentType.includes("combi");
    if (isYes(answers?.move_to_combi) && !currentlyCombi) {
        items.push({
            key: ADDONS.CONVERT_TO_COMBI.key,
            label: ADDONS.CONVERT_TO_COMBI.label,
            qty: 1,
            unitPrice: ADDONS.CONVERT_TO_COMBI.unitPrice,
            total: ADDONS.CONVERT_TO_COMBI.unitPrice,
        });
    }

    const total = money(items.reduce((s, x) => s + (x.total || 0), 0));
    return { items, total, derived: { flueType: flue } };
}

/* ===========================
  6) Product filtering
=========================== */

function combiKwMatch(productKw, targetKw) {
    if (targetKw === 24) return productKw === 24 || productKw === 25;
    if (targetKw === 30) return productKw === 30;
    if (targetKw === 35) return productKw === 35 || productKw === 36;
    return false;
}

/* ===========================
  7) Main builder
=========================== */

export function buildBoilerQuote({ answers, questions = [] }) {
    const { RULES, ADDONS, PRODUCTS } = applyEffectiveConfig();
    console.log("EFFECTIVE TRV:", ADDONS.TRV.unitPrice, "MAX:", RULES.TRV_MAX_QTY);
    const qMap = questionMap(questions);

    const radsBucket = parseRadsBucket(label(answers?.radiators));
    const baths = parseBaths(label(answers?.bathrooms));

    const combiOk = combiAllowed(baths);
    const combiKw = combiTargetKw(baths);

    const allowedBoilerTypes = {
        combi: combiOk && combiKw != null,
        system: true,
        heat_only: true,
    };

    const selectedBoilerType = resolveBoilerTypeFromAnswers(answers, { combiOk, combiKw });

    let sizing = null;
    if (selectedBoilerType === "combi") {
        sizing = { type: "combi", targetKw: combiKw };
    } else {
        const band = sysHeatBand(radsBucket);
        const typeProducts = PRODUCTS.filter((p) => p.type === selectedBoilerType);
        const chosenKw = pickKwForSystemHeat(typeProducts, band);
        sizing = { type: selectedBoilerType, band, targetKw: chosenKw };
    }

    const addOns = computeAddOns(answers, selectedBoilerType, { ADDONS, RULES });

    let products = PRODUCTS.filter((p) => p.type === selectedBoilerType);

    if (selectedBoilerType === "combi") {
        const wantsCombi = isYes(answers?.move_to_combi);
        const filtered = combiKw != null ? products.filter((p) => combiKwMatch(p.kw, combiKw)) : [];
        products = (wantsCombi && !filtered.length) ? products : (filtered.length ? filtered : products);
    } else {
        const band = sizing.band;
        const inBand = products.filter((p) => p.kw >= band.min && p.kw <= band.max);
        products = inBand.length ? inBand : products.sort((a, b) => a.kw - b.kw).slice(0, 3);
    }

    const pricedProducts = products.map((p) => {
        const base =
            selectedBoilerType === "combi"
                ? Number(p.baseInstallPrice || p.basePrice || 0)
                : money(Number(p.boilerCost || 0) + RULES.MIN_MARGIN_SYSTEM_HEAT);

        const marginApplied = selectedBoilerType === "combi" ? 0 : RULES.MIN_MARGIN_SYSTEM_HEAT;
        const pricingComplete = selectedBoilerType === "combi" ? true : p.boilerCost != null;
        const total = pricingComplete ? money(base + addOns.total) : null;

        return {
            ...p,
            pricing: {
                base,
                marginApplied,
                addOnsTotal: addOns.total,
                total,
                pricingComplete,
            },
        };
    });

    const recommended =
        pricedProducts.find((x) => x.pricing.pricingComplete) || pricedProducts[0] || null;

    const answersDetailed = Object.entries(answers || {}).map(([id, val]) => ({
        id,
        question: qMap.get(id) || id,
        answerLabel: val?.label ?? null,
        answerValue: val?.value ?? null,
        raw: val,
    }));

    const totals = {
        addOns: addOns.total,
        recommendedBase: recommended?.pricing?.base ?? null,
        recommendedTotal: recommended?.pricing?.total ?? null,
    };

    return {
        meta: {
            version: "3.2",
            generatedAt: new Date().toISOString(),
        },
        inputs: {
            radiators: label(answers?.radiators),
            bathrooms: label(answers?.bathrooms),
            thermostat: label(answers?.thermostat_type) || "Basic",
            flueType: addOns.derived.flueType,
            trvRequired: label(answers?.trv_required) || "No",
            trvQty: Number(answers?.trv_qty?.value ?? 0),
        },
        eligibility: {
            allowedBoilerTypes,
            selectedBoilerType,
            forcedToCombi: isYes(answers?.move_to_combi) && !(allowedBoilerTypes.combi),
        },
        sizing,
        answers: {
            raw: answers,
            detailed: answersDetailed,
        },
        addOns,
        products: pricedProducts,
        recommendedProductId: recommended?.id || null,
        totals,
    };
}
