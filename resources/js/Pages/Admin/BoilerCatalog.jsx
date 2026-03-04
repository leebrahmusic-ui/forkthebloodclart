import React, { useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/lib/productsCatalog";

const TYPE_OPTIONS = [
    { value: "combi", label: "Combi" },
    { value: "system", label: "System" },
    { value: "heat_only", label: "Heat Only" },
];

const PRICE_TYPE_OPTIONS = [
    { value: "fixed", label: "Fixed" },
    { value: "variable", label: "Variable" },
    { value: "cost_plus", label: "Cost Plus" },
];

function slugify(v) {
    return String(v || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function listToText(v) {
    return Array.isArray(v) ? v.join("\n") : "";
}

function textToList(v) {
    return String(v || "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
}

function toNum(v) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function normalizeForSave(p) {
    const fallbackId = [p.brand, p.model, p.kw].map(slugify).filter(Boolean).join("_");
    return {
        id: (p.id || fallbackId || "new_boiler").trim(),
        type: p.type || "combi",
        brand: (p.brand || "").trim(),
        model: (p.model || "").trim(),
        warrantyYears: Number(p.warrantyYears || 0),
        kw: Number(p.kw || 0),
        priceType: p.priceType || "fixed",
        basePrice: toNum(p.basePrice),
        boilerCost: toNum(p.boilerCost),
        minMargin: toNum(p.minMargin),
        images: textToList(p.imagesText),
        includes: textToList(p.includesText),
        notes: textToList(p.notesText),
    };
}

function toEditorRow(p) {
    return {
        ...p,
        basePrice: p.basePrice ?? "",
        boilerCost: p.boilerCost ?? "",
        minMargin: p.minMargin ?? "",
        imagesText: listToText(p.images),
        includesText: listToText(p.includes),
        notesText: listToText(p.notes),
    };
}

function blankProduct() {
    return toEditorRow({
        id: "",
        type: "combi",
        brand: "",
        model: "",
        warrantyYears: 5,
        kw: 24,
        priceType: "fixed",
        basePrice: "",
        boilerCost: "",
        minMargin: "",
        images: [],
        includes: [],
        notes: [],
    });
}

function blankProductForType(type = "combi") {
    const kwByType = {
        combi: 24,
        system: 18,
        heat_only: 15,
    };

    return {
        ...blankProduct(),
        type,
        kw: kwByType[type] ?? 24,
        priceType: type === "combi" ? "fixed" : "cost_plus",
    };
}

function labelType(type) {
    return TYPE_OPTIONS.find((x) => x.value === type)?.label || type;
}

export default function BoilerCatalog() {
    const { catalogOverride } = usePage().props;

    const initial = useMemo(() => {
        const source = Array.isArray(catalogOverride) && catalogOverride.length
            ? catalogOverride
            : DEFAULT_PRODUCTS;
        return source.map(toEditorRow);
    }, [catalogOverride]);

    const [products, setProducts] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [openAdvanced, setOpenAdvanced] = useState({});

    const normalizedQuery = query.trim().toLowerCase();

    const filteredWithIndex = useMemo(() => {
        return products
            .map((p, idx) => ({ p, idx }))
            .filter(({ p }) => {
                if (typeFilter !== "all" && p.type !== typeFilter) return false;
                if (!normalizedQuery) return true;

                return [p.id, p.brand, p.model, p.type, p.kw]
                    .map((v) => String(v || "").toLowerCase())
                    .join(" ")
                    .includes(normalizedQuery);
            });
    }, [products, typeFilter, normalizedQuery]);

    const grouped = useMemo(() => {
        const map = new Map();
        for (const { p, idx } of filteredWithIndex) {
            const type = p.type || "other";
            const kw = Number(p.kw) || 0;
            if (!map.has(type)) map.set(type, new Map());
            if (!map.get(type).has(kw)) map.get(type).set(kw, []);
            map.get(type).get(kw).push({ p, idx });
        }

        const sorted = Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([type, kwMap]) => ({
                type,
                buckets: Array.from(kwMap.entries())
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([kw, items]) => ({
                        kw,
                        items: items.sort(({ p: x }, { p: y }) => `${x.brand} ${x.model}`.localeCompare(`${y.brand} ${y.model}`)),
                    })),
            }));

        return sorted;
    }, [filteredWithIndex]);

    const update = (idx, field, value) => {
        setProducts((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
    };

    const addProduct = (type = "combi") => {
        setProducts((prev) => [...prev, blankProductForType(type)]);
    };

    const removeProduct = (idx) => {
        setProducts((prev) => prev.filter((_, i) => i !== idx));
    };

    const saveCatalog = () => {
        setSaving(true);
        router.post(
            route("admin.boilers.save"),
            {
                products: products.map(normalizeForSave),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            }
        );
    };

    const resetCatalog = () => {
        router.post(route("admin.boilers.reset"), {}, { preserveScroll: true });
    };

    const toggleAdvanced = (idx) => {
        setOpenAdvanced((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Boiler Catalogue</h2>}
        >
            <Head title="Boiler Catalogue" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h1 className="text-2xl font-bold text-gray-900">Boiler Catalogue Management</h1>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Simple mode for day-to-day updates. Boilers are grouped by type and kW below.
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Total boilers</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">{products.length}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Showing</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">{filteredWithIndex.length}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Groups</div>
                            <div className="mt-1 text-xl font-bold text-slate-900">{grouped.length}</div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => addProduct("combi")}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                            + Add Combi
                        </button>
                        <button
                            type="button"
                            onClick={() => addProduct("system")}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                            + Add System
                        </button>
                        <button
                            type="button"
                            onClick={() => addProduct("heat_only")}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                            + Add Heat Only
                        </button>
                        <button
                            type="button"
                            onClick={saveCatalog}
                            disabled={saving}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save catalogue"}
                        </button>
                        <button
                            type="button"
                            onClick={resetCatalog}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                            Reset to defaults
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by brand/model/id"
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="all">All types</option>
                            {TYPE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setTypeFilter("all");
                            }}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {grouped.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                            No boilers found for this filter.
                        </div>
                    )}

                    {grouped.map((group) => (
                        <div key={group.type} className="rounded-2xl border border-gray-200 bg-white p-5">
                            <h3 className="text-lg font-bold text-gray-900 uppercase">{labelType(group.type)}</h3>

                            <div className="mt-3 space-y-4">
                                {group.buckets.map((bucket) => (
                                    <div key={`${group.type}-${bucket.kw}`}>
                                        <div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {bucket.kw} kW • {bucket.items.length} item{bucket.items.length === 1 ? "" : "s"}
                                        </div>

                                        <div className="space-y-3">
                                            {bucket.items.map(({ p, idx }) => {
                                                const showBasePrice = p.priceType === "fixed" || p.priceType === "variable";
                                                const showCostPlus = p.priceType === "cost_plus";

                                                return (
                                                    <div key={`${p.id || "new"}-${idx}`} className="rounded-xl border border-slate-200 p-4">
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {p.brand || "New brand"} {p.model || "New model"}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleAdvanced(idx)}
                                                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                                                >
                                                                    {openAdvanced[idx] ? "Hide advanced" : "Advanced"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProduct(idx)}
                                                                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                                            <select value={p.type} onChange={(e) => update(idx, "type", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                                                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                            </select>
                                                            <input value={p.brand} onChange={(e) => update(idx, "brand", e.target.value)} placeholder="brand" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                                            <input value={p.model} onChange={(e) => update(idx, "model", e.target.value)} placeholder="model" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                                            <input value={p.kw} type="number" min="1" onChange={(e) => update(idx, "kw", e.target.value)} placeholder="kW" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                                            <input value={p.warrantyYears} type="number" min="0" onChange={(e) => update(idx, "warrantyYears", e.target.value)} placeholder="warranty years" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                                                            <select value={p.priceType} onChange={(e) => update(idx, "priceType", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                                                {PRICE_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                            </select>
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <input
                                                                value={p.basePrice}
                                                                onChange={(e) => update(idx, "basePrice", e.target.value)}
                                                                placeholder={showBasePrice ? "base price (required)" : "base price (optional)"}
                                                                className={`rounded-lg border px-3 py-2 text-sm ${showBasePrice ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`}
                                                            />
                                                            <input
                                                                value={p.boilerCost}
                                                                onChange={(e) => update(idx, "boilerCost", e.target.value)}
                                                                placeholder={showCostPlus ? "boiler cost (required)" : "boiler cost (optional)"}
                                                                className={`rounded-lg border px-3 py-2 text-sm ${showCostPlus ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`}
                                                            />
                                                            <input
                                                                value={p.minMargin}
                                                                onChange={(e) => update(idx, "minMargin", e.target.value)}
                                                                placeholder={showCostPlus ? "min margin (required)" : "min margin (optional)"}
                                                                className={`rounded-lg border px-3 py-2 text-sm ${showCostPlus ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`}
                                                            />
                                                        </div>

                                                        {openAdvanced[idx] && (
                                                            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                    <input
                                                                        value={p.id}
                                                                        onChange={(e) => update(idx, "id", e.target.value)}
                                                                        placeholder="ID (leave blank to auto-generate)"
                                                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                                                    />
                                                                    <textarea value={p.imagesText} onChange={(e) => update(idx, "imagesText", e.target.value)} rows={4} placeholder="Image URLs (one per line)" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                                                                    <textarea value={p.includesText} onChange={(e) => update(idx, "includesText", e.target.value)} rows={4} placeholder="Includes (one per line)" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                                                                </div>
                                                                <textarea value={p.notesText} onChange={(e) => update(idx, "notesText", e.target.value)} rows={3} placeholder="Notes (one per line)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
