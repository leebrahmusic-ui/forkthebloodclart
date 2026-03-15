import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
// import { route } from "ziggy";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const cn = (...c) => c.filter(Boolean).join(" ");

function money(amount, currency = "GBP") {
    const n = Number(amount || 0);
    try {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(n);
    } catch {
        return `${currency} ${n.toFixed(2)}`;
    }
}

function formatUkDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

function formatUkDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

function Spinner({ className }) {
    return (
        <svg
            className={cn("h-4 w-4 animate-spin text-slate-600", className)}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}

function Badge({ children, tone = "slate" }) {
    const map = {
        slate: "bg-slate-100 text-slate-700 border-slate-200",
        green: "bg-green-100 text-green-700 border-green-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
        red: "bg-red-100 text-red-700 border-red-200",
        blue: "bg-blue-100 text-blue-700 border-blue-200",
        purple: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                map[tone] || map.slate
            )}
        >
            {children}
        </span>
    );
}

function SmallButton({ children, className, ...props }) {
    return (
        <button
            {...props}
            className={cn(
                "rounded-xl border px-3.5 py-2 text-sm font-semibold transition",
                "bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
            {children}
        </button>
    );
}

function CopyText({ value }) {
    const [ok, setOk] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value || "");
            setOk(true);
            setTimeout(() => setOk(false), 900);
        } catch {
            // silent
        }
    };

    if (!value) return <span className="text-slate-400">—</span>;

    return (
        <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">{value}</span>
            <button
                type="button"
                onClick={copy}
                className={cn(
                    "rounded-lg border px-2 py-0.5 text-xs font-semibold transition",
                    ok ? "bg-green-50 border-green-200 text-green-700" : "hover:bg-slate-50"
                )}
                title="Copy"
            >
                {ok ? "Copied" : "Copy"}
            </button>
        </div>
    );
}

/**
 * Normalizes pagination across different Inertia/Laravel shapes:
 * - links array: [{label,url,active}]
 * - links object: {first,last,prev,next}
 */
function normalizePagination(paginated) {
    const meta = paginated?.meta || null;

    const arrLinks = Array.isArray(paginated?.links) ? paginated.links : null;
    const objLinks =
        !arrLinks && paginated?.links && typeof paginated.links === "object"
            ? paginated.links
            : null;

    let links = arrLinks;

    if (!links && objLinks) {
        links = [
            { url: objLinks.prev || null, label: "Previous", active: false },
            { url: objLinks.next || null, label: "Next", active: false },
        ];
    }

    return { meta, links };
}

function Pagination({ paginated }) {
    const { meta, links } = normalizePagination(paginated);
    // if (!meta || !links) return null;
    const current = paginated.current_page || 1;
    const last = paginated.last_page || 1;

    const prevUrl =
        links.find((l) => String(l.label || "").toLowerCase().includes("previous"))
            ?.url || null;

    const nextUrl =
        links.find((l) => String(l.label || "").toLowerCase().includes("next"))
            ?.url || null;

    return (
        <div className="flex flex-col gap-3 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{paginated.from || 0}</span>–{" "}
                <span className="font-semibold text-slate-900">{paginated.to || 0}</span> of{" "}
                <span className="font-semibold text-slate-900">{paginated.total || 0}</span>
            </div>

            {/* Mobile: Prev / Page / Next */}
            <div className="flex items-center justify-between gap-2 sm:hidden">
                <SmallButton disabled={!prevUrl} onClick={() => prevUrl && router.visit(prevUrl, { preserveScroll: true })}>
                    Previous
                </SmallButton>

                <div className="rounded-xl border bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    Page <span className="font-semibold">{current}</span> / {last}
                </div>

                <SmallButton disabled={!nextUrl} onClick={() => nextUrl && router.visit(nextUrl, { preserveScroll: true })}>
                    Next
                </SmallButton>
            </div>

            {/* Desktop: page pills */}
            <div className="hidden items-center gap-1 sm:flex">
                {links.map((l, idx) => {
                    const isDisabled = !l.url;
                    const isActive = !!l.active;

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={isDisabled}
                            onClick={() =>
                                l.url && router.visit(l.url, { preserveScroll: true })
                            }
                            className={cn(
                                "min-w-[40px] rounded-xl border px-3 py-2 text-sm font-semibold transition",
                                isActive && "bg-slate-900 text-white border-slate-900",
                                !isActive && "bg-white hover:bg-slate-50",
                                isDisabled && "cursor-not-allowed opacity-40"
                            )}
                            dangerouslySetInnerHTML={{ __html: l.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

const PAYMENT_OPTIONS = [
    { value: "unpaid", label: "Unpaid" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
    { value: "cancelled", label: "Cancelled" },
];

const APPOINTMENT_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    //   { value: "no_show", label: "No show" },
    { value: "cancelled", label: "Cancelled" },
];

export default function Management() {
    const { bookings, filters, flash } = usePage().props;

    const [openId, setOpenId] = useState(null);

    // saving state (row-level)
    const [saving, setSaving] = useState({ id: null, field: null });

    const rows = useMemo(() => bookings?.data || [], [bookings]);

    const onSearch = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        router.get(
            "/admin/order/management",
            {
                q: fd.get("q") || "",
                per_page: fd.get("per_page") || 10,
                status: fd.get("status") || filters?.status || "all",
            },
            { preserveScroll: true, preserveState: true, replace: true }
        );
    };

    const updateStatus = (bookingId, field, value) => {
        setSaving({ id: bookingId, field });

        router.put(route("admin.orders.management.status", bookingId), { [field]: value }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSaving({ id: null, field: null }),
        });
    };



    function JsonPill({ label, value }) {
        if (!value) return null;

        let text = "";
        try {
            text = typeof value === "string" ? value : JSON.stringify(value);
        } catch {
            text = String(value);
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="text-slate-500">{label}:</span>
                <span className="truncate max-w-[260px]">{text}</span>
            </span>
        );
    }

    function ProductSection({ booking }) {
        const products = booking?.products || [];
        if (!products.length) return null;

        return (
            <div className="rounded-2xl border bg-white p-4 sm:col-span-2">
                <div className="mb-2 text-sm font-extrabold text-slate-900">
                    Product
                </div>

                <div className="space-y-3">
                    {products.map((p) => {
                        const includes = Array.isArray(p.includes) ? p.includes : [];
                        const images = Array.isArray(p.images) ? p.images : [];
                        const addOns = Array.isArray(p.add_ons) ? p.add_ons : (Array.isArray(p.addOns) ? p.addOns : []);

                        // derived aggregation (same derived usually repeated per add-on; we show unique)
                        const derivedList = [];
                        const derivedSeen = new Set();
                        addOns.forEach((a) => {
                            const d = a?.derived;
                            if (!d) return;
                            const key = (() => {
                                try { return JSON.stringify(d); } catch { return String(d); }
                            })();
                            if (!derivedSeen.has(key)) {
                                derivedSeen.add(key);
                                derivedList.push(d);
                            }
                        });

                        const addOnsTotal = addOns.reduce((sum, a) => sum + Number(a?.total || 0), 0);

                        return (
                            <div key={p.id} className="rounded-2xl border bg-white overflow-hidden">
                                {/* Product header */}
                                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-sm font-extrabold text-slate-900">
                                                {p.brand ? `${p.brand} ` : ""}{p.model || p.boiler_id || "Product"}
                                            </div>

                                            {p.kw != null ? <Badge tone="blue">{p.kw} kW</Badge> : null}
                                            {p.warranty_years != null ? (
                                                <Badge tone="purple">{p.warranty_years} yr warranty</Badge>
                                            ) : null}

                                            {p.amount != null ? (
                                                <Badge tone="green">Base: {money(p.amount, booking.currency)}</Badge>
                                            ) : null}

                                            {addOnsTotal ? (
                                                <Badge tone="yellow">Add-ons: {money(addOnsTotal, booking.currency)}</Badge>
                                            ) : null}
                                        </div>

                                        <div className="mt-2 text-xs text-slate-500">
                                            Boiler ID: <span className="font-semibold text-slate-900">{p.boiler_id || "—"}</span>
                                        </div>
                                    </div>

                                    {/* Product image (first) */}
                                    <div className="flex items-center gap-3">
                                        {images?.[0] ? (
                                            <img
                                                src={images[0]}
                                                alt={p.model || p.boiler_id || "Product image"}
                                                className="h-14 w-14 rounded-xl border object-contain bg-white"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 rounded-xl border bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Includes */}
                                {includes.length ? (
                                    <div className="border-t bg-slate-50 p-4">
                                        <div className="text-xs font-extrabold text-slate-700 mb-2">
                                            Included
                                        </div>
                                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {includes.map((it, idx) => (
                                                <li key={idx} className="rounded-xl border bg-white px-3 py-2 text-sm text-slate-700">
                                                    {it}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {/* Add-ons */}
                                <div className="border-t bg-white p-4">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-xs font-extrabold text-slate-700">
                                                Add-ons
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Line items applied to this booking/product.
                                            </div>
                                        </div>

                                        {/* Derived pills */}
                                        <div className="flex flex-wrap gap-2">
                                            {derivedList.map((d, i) => (
                                                <JsonPill key={i} label="Flue Type" value={d} />
                                            ))}
                                        </div>
                                    </div>

                                    {!addOns.length ? (
                                        <div className="mt-3 text-sm text-slate-600">No add-ons.</div>
                                    ) : (
                                        <div className="mt-3 overflow-x-auto rounded-xl border">
                                            <table className="min-w-full text-left text-sm">
                                                <thead className="bg-slate-50 text-slate-600">
                                                    <tr>
                                                        <th className="px-3 py-2 whitespace-nowrap">Item</th>
                                                        <th className="px-3 py-2 whitespace-nowrap">Qty</th>
                                                        <th className="px-3 py-2 whitespace-nowrap">Unit</th>
                                                        <th className="px-3 py-2 whitespace-nowrap">Total</th>
                                                        {/* <th className="px-3 py-2 whitespace-nowrap">Key</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {addOns.map((a) => (
                                                        <tr key={a.id} className="border-t">
                                                            <td className="px-3 py-2 font-semibold text-slate-900">
                                                                {a.label || "—"}
                                                            </td>
                                                            <td className="px-3 py-2">{a.qty ?? 1}</td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                {money(a.unit_price, booking.currency)}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap font-extrabold text-slate-900">
                                                                {money(a.total, booking.currency)}
                                                            </td>
                                                            {/* <td className="px-3 py-2 text-xs text-slate-600">
                                                                {a.key || "—"}
                                                            </td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order Management
                    </h2>
                    {/* <div className="text-sm text-slate-500">
            Operational cockpit for bookings, appointments, and payments.
          </div> */}
                </div>
            }
        >
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-6">
                    {/* Top toast-like banner */}
                    {flash?.success ? (
                        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                                <span className="font-semibold">Updated:</span>
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    ) : null}

                    {/* Filters */}
                    <form onSubmit={onSearch} className="mb-5 rounded-2xl border bg-white p-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_180px_140px]">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Search
                                </label>
                                <input
                                    name="q"
                                    defaultValue={filters?.q || ""}
                                    placeholder="Customer name, email, phone…"
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Rows per page
                                </label>
                                <select
                                    name="per_page"
                                    defaultValue={filters?.per_page || 10}
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm"
                                >
                                    <option value={10}>10 rows</option>
                                    <option value={15}>15 rows</option>
                                    <option value={25}>25 rows</option>
                                    <option value={50}>50 rows</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Appointment status
                                </label>
                                <select
                                    name="status"
                                    defaultValue={filters?.status || "all"}
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="mt-0.5 rounded-xl bg-slate-900 px-2 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                Apply filters
                            </button>
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-4">
                        {rows.length === 0 ? (
                            <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
                                No bookings found.
                            </div>
                        ) : (
                            rows.map((b) => {
                                const isOpen = openId === b.id;
                                const isSavingRow = saving.id === b.id;

                                const paymentTone =
                                    b.payment_status === "paid"
                                        ? "green"
                                        : b.payment_status === "pending"
                                            ? "yellow"
                                            : b.payment_status === "failed"
                                                ? "red"
                                                : b.payment_status === "refunded"
                                                    ? "purple"
                                                    : b.payment_status === "cancelled"
                                                        ? "red"
                                                        : "slate";

                                const apptStatus = b.appointment?.status || "—";
                                const apptTone =
                                    apptStatus === "confirmed"
                                        ? "green"
                                        : apptStatus === "pending"
                                            ? "yellow"
                                            : apptStatus === "cancelled"
                                                ? "red"
                                                : apptStatus === "completed"
                                                    ? "blue"
                                                    : apptStatus === "no_show"
                                                        ? "purple"
                                                        : "slate";

                                const serviceName =
                                    b.appointment?.service?.service ||
                                    b.appointment?.type ||
                                    "—";

                                const basePrice = b.total;

                                const appointmentTime = b.appointment?.starts_at
                                    ? formatUkDateTime(b.appointment.starts_at)
                                    : b.appointment?.appointment_date
                                        ? formatUkDate(b.appointment.appointment_date)
                                        : "—";

                                return (
                                    <div key={b.id} className="rounded-2xl border bg-white overflow-hidden">
                                        {/* Header */}
                                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="text-sm font-extrabold text-slate-900">
                                                        Booking #{b.id}
                                                    </div>

                                                    <Badge tone={paymentTone}>
                                                        Payment:{" "}
                                                        {PAYMENT_OPTIONS.find((o) => o.value === b.payment_status)?.label ||
                                                            b.payment_status ||
                                                            "—"}
                                                    </Badge>

                                                    <Badge tone={apptTone}>
                                                        Appointment:{" "}
                                                        {APPOINTMENT_OPTIONS.find((o) => o.value === apptStatus)?.label ||
                                                            apptStatus ||
                                                            "—"}
                                                    </Badge>

                                                    <Badge tone="blue">
                                                        {serviceName}
                                                        {basePrice != null ? ` • ${money(basePrice, b.currency)}` : ""}
                                                    </Badge>

                                                    {isSavingRow ? (
                                                        <span className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                                            <Spinner className="h-3.5 w-3.5" />
                                                            Saving…
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-slate-600 sm:grid-cols-3">
                                                    <div className="truncate">
                                                        <span className="text-slate-500">Customer:</span>{" "}
                                                        <span className="font-semibold text-slate-900">
                                                            {b.customer?.full_name || "—"}
                                                        </span>{" "}
                                                        <span className="text-slate-400">
                                                            ({b.customer?.email || "—"})
                                                        </span>
                                                    </div>

                                                    <div className="truncate">
                                                        <span className="text-slate-500">Visit:</span>{" "}
                                                        <span className="font-semibold text-slate-900">{appointmentTime}</span>
                                                    </div>

                                                    <div>
                                                        <span className="text-slate-500">Total:</span>{" "}
                                                        <span className="font-extrabold text-slate-900">
                                                            {money(b.total, b.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <SmallButton
                                                    className={cn(
                                                        "min-w-[140px]",
                                                        isOpen
                                                            ? "bg-slate-900 hover:text-white border-slate-900 hover:bg-slate-800"
                                                            : ""
                                                    )}
                                                    onClick={() => setOpenId(isOpen ? null : b.id)}
                                                >
                                                    {isOpen ? "Hide details" : "View details"}
                                                </SmallButton>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        {isOpen && (
                                            <div className="border-t bg-slate-50 p-4">
                                                {/* Quick Actions */}
                                                <div className="mb-4 rounded-2xl border bg-white p-4">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                                        <div>
                                                            <div className="text-sm font-extrabold text-slate-900">
                                                                Quick Actions
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                Update statuses without leaving this screen.
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                                                                                        <div className="flex flex-col gap-1">
                                                                                                                                <label className="text-xs font-semibold text-slate-600">
                                                                                                                                        Payment status
                                                                                                                                </label>
                                                                                                                                <select
                                                                                                                                        value={b.payment_status || "pending"}
                                                                                                                                        className="w-full rounded-xl border px-3 py-2.5 text-sm sm:w-[220px]"
                                                                                                                                        disabled={isSavingRow}
                                                                                                                                        onChange={(e) =>
                                                                                                                                                updateStatus(b.id, "payment_status", e.target.value)
                                                                                                                                        }
                                                                                                                                >
                                                                                                                                        {PAYMENT_OPTIONS.map((o) => (
                                                                                                                                                <option key={o.value} value={o.value}>
                                                                                                                                                        {o.label}
                                                                                                                                                </option>
                                                                                                                                        ))}
                                                                                                                                </select>
                                                                                                                        </div>

                                                            {/* Appointment */}
                                                            <div className="flex flex-col gap-1">
                                                                <label className="text-xs font-semibold text-slate-600">
                                                                    Appointment status
                                                                </label>
                                                                <select
                                                                    value={apptStatus === "—" ? "pending" : apptStatus}
                                                                    className="w-full rounded-xl border px-3 py-2.5 text-sm sm:w-[240px]"
                                                                    disabled={isSavingRow || !b.appointment}
                                                                    onChange={(e) =>
                                                                        updateStatus(b.id, "appointment_status", e.target.value)
                                                                    }
                                                                >
                                                                    {APPOINTMENT_OPTIONS.map((o) => (
                                                                        <option key={o.value} value={o.value}>
                                                                            {o.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Inline loader */}
                                                            <div className="text-sm text-slate-600 flex items-center gap-2">
                                                                {isSavingRow ? (
                                                                    <>
                                                                        <Spinner />
                                                                        <span className="font-semibold">Saving changes…</span>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {/* Customer */}
                                                    <div className="rounded-2xl border bg-white p-4">
                                                        <div className="mb-2 text-sm font-extrabold text-slate-900">
                                                            Customer
                                                        </div>
                                                        <div className="space-y-1 text-sm text-slate-700">
                                                            <div>
                                                                <span className="text-slate-500">Name:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.full_name || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Email:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.email || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Phone:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.phone || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Street:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.address_line1 || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Address line 2:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.address_line2 || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Town / City:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.city || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">County:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.county || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Postcode:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.postcode || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Address:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.customer?.address_full || "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Appointment */}
                                                    <div className="rounded-2xl border bg-white p-4">
                                                        <div className="mb-2 text-sm font-extrabold text-slate-900">
                                                            Appointment
                                                        </div>
                                                        <div className="space-y-1 text-sm text-slate-700">
                                                            <div>
                                                                <span className="text-slate-500">Service:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {serviceName}
                                                                </span>
                                                                {basePrice != null ? (
                                                                    <span className="text-slate-500">
                                                                        {" "}
                                                                        • Base: {money(basePrice, b.currency)}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Service key:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.appointment?.service_key || "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Date:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.appointment?.appointment_date
                                                                        ? formatUkDate(b.appointment.appointment_date)
                                                                        : "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Starts at:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {b.appointment?.starts_at
                                                                        ? formatUkDateTime(b.appointment.starts_at)
                                                                        : "—"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Status:</span>{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {APPOINTMENT_OPTIONS.find((o) => o.value === apptStatus)?.label ||
                                                                        apptStatus ||
                                                                        "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <ProductSection booking={b} />

                                                    {/* Q/A */}
                                                    <div className="rounded-2xl border bg-white p-4 sm:col-span-2">
                                                        <div className="mb-2 text-sm font-extrabold text-slate-900">
                                                            Booking Details (Q/A)
                                                        </div>

                                                        {!b.details || b.details.length === 0 ? (
                                                            <div className="text-sm text-slate-600">
                                                                No details found.
                                                            </div>
                                                        ) : (
                                                            <div className="divide-y rounded-xl border bg-white">
                                                                {b.details.map((d) => {
                                                                    const answer =
                                                                        d.answer_text ??
                                                                        (d.answer_json ? JSON.stringify(d.answer_json) : null) ??
                                                                        (d.media ? JSON.stringify(d.media) : null);

                                                                    return (
                                                                        <div key={d.id} className="p-3">
                                                                            <div className="text-sm font-semibold text-slate-900">
                                                                                {d.question_snapshot || d.frontend_key}
                                                                            </div>
                                                                            <div className="mt-1 text-sm text-slate-700 break-words">
                                                                                {answer || "—"}
                                                                            </div>
                                                                            {d.amount ? (
                                                                                <div className="mt-1 text-xs text-slate-500">
                                                                                    Amount impact:{" "}
                                                                                    <span className="font-semibold text-slate-900">
                                                                                        {money(d.amount, b.currency)}
                                                                                    </span>
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Transactions */}
                                                    <div className="rounded-2xl border bg-white p-4 sm:col-span-2">
                                                        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="text-sm font-extrabold text-slate-900">
                                                                Transactions
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                Tip: copy IDs for support and debugging.
                                                            </div>
                                                        </div>

                                                        {!b.transactions || b.transactions.length === 0 ? (
                                                            <div className="text-sm text-slate-600">
                                                                No transactions found.
                                                            </div>
                                                        ) : (
                                                            <div className="overflow-x-auto rounded-xl border">
                                                                <table className="min-w-full text-left text-sm">
                                                                    <thead className="bg-slate-50 text-slate-600">
                                                                        <tr>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Status</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Amount</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Provider</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Kind</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Session</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Payment Intent</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Charge</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Refund</th>
                                                                            <th className="px-3 py-2 whitespace-nowrap">Created</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {b.transactions.map((t) => (
                                                                            <tr key={t.id} className="border-t align-top">
                                                                                <td className="px-3 py-2">
                                                                                    <Badge
                                                                                        tone={
                                                                                            t.status === "succeeded"
                                                                                                ? "green"
                                                                                                : t.status === "processing"
                                                                                                    ? "yellow"
                                                                                                    : t.status === "failed"
                                                                                                        ? "red"
                                                                                                        : "slate"
                                                                                        }
                                                                                    >
                                                                                        {t.status || "—"}
                                                                                    </Badge>
                                                                                </td>
                                                                                <td className="px-3 py-2 whitespace-nowrap">
                                                                                    {money(t.amount, t.currency)}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    {t.provider || "—"}
                                                                                </td>
                                                                                <td className="px-3 py-2">
                                                                                    {t.kind || "—"}
                                                                                </td>

                                                                                <td className="px-3 py-2 text-xs text-slate-700">
                                                                                    <CopyText value={t.provider_checkout_session_id} />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-xs text-slate-700">
                                                                                    <CopyText value={t.provider_payment_intent_id} />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-xs text-slate-700">
                                                                                    <CopyText value={t.provider_charge_id} />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-xs text-slate-700">
                                                                                    <CopyText value={t.provider_refund_id} />
                                                                                </td>

                                                                                <td className="px-3 py-2 text-xs text-slate-600 whitespace-nowrap">
                                                                                    {t.created_at ? formatUkDateTime(t.created_at) : "—"}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Bottom pagination */}
                    <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
                        <Pagination paginated={bookings} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
