import React, { useMemo } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CheckoutCoupons() {
    const { coupons = [] } = usePage().props;

    const createForm = useForm({
        code: "",
        discount_type: "fixed",
        discount_value: "",
        is_active: true,
        starts_at: "",
        ends_at: "",
        notes: "",
    });

    const activeCount = useMemo(
        () => coupons.filter((c) => c.is_active).length,
        [coupons]
    );

    const saveNew = (e) => {
        e.preventDefault();
        createForm.post(route("admin.coupons.store"), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const updateCoupon = (coupon, patch) => {
        router.put(
            route("admin.coupons.update", coupon.id),
            {
                code: patch.code ?? coupon.code,
                discount_type: patch.discount_type ?? coupon.discount_type,
                discount_value: patch.discount_value ?? coupon.discount_value,
                is_active: patch.is_active ?? coupon.is_active,
                starts_at: patch.starts_at ?? coupon.starts_at,
                ends_at: patch.ends_at ?? coupon.ends_at,
                notes: patch.notes ?? coupon.notes,
            },
            { preserveScroll: true }
        );
    };

    const removeCoupon = (coupon) => {
        if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
        router.delete(route("admin.coupons.destroy", coupon.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    New Boiler Checkout Coupons
                </h2>
            }
        >
            <Head title="Checkout Coupons" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h1 className="text-2xl font-bold text-gray-900">Coupon Codes</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        These apply only to new boiler checkout.
                    </p>
                    <div className="mt-3 text-sm font-semibold text-slate-700">
                        Active: {activeCount} / Total: {coupons.length}
                    </div>
                </div>

                <form onSubmit={saveNew} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-gray-900">Add coupon</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            value={createForm.data.code}
                            onChange={(e) => createForm.setData("code", e.target.value.toUpperCase())}
                            placeholder="Code (e.g. SPRING150)"
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <select
                            value={createForm.data.discount_type}
                            onChange={(e) => createForm.setData("discount_type", e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="fixed">Fixed amount (£)</option>
                            <option value="percent">Percent (%)</option>
                        </select>
                        <input
                            value={createForm.data.discount_value}
                            onChange={(e) => createForm.setData("discount_value", e.target.value)}
                            placeholder={createForm.data.discount_type === "percent" ? "Discount %" : "Discount £"}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                            type="datetime-local"
                            value={createForm.data.starts_at}
                            onChange={(e) => createForm.setData("starts_at", e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                            type="datetime-local"
                            value={createForm.data.ends_at}
                            onChange={(e) => createForm.setData("ends_at", e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_active}
                                onChange={(e) => createForm.setData("is_active", e.target.checked)}
                            />
                            Active
                        </label>
                    </div>
                    <textarea
                        value={createForm.data.notes}
                        onChange={(e) => createForm.setData("notes", e.target.value)}
                        placeholder="Notes (optional)"
                        rows={2}
                        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />

                    {Object.values(createForm.errors).length > 0 && (
                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {Object.values(createForm.errors)[0]}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={createForm.processing}
                        className="mt-3 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {createForm.processing ? "Saving..." : "Create coupon"}
                    </button>
                </form>

                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900">Existing coupons</div>
                    <div className="divide-y">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                                    <input
                                        defaultValue={coupon.code}
                                        onBlur={(e) => updateCoupon(coupon, { code: e.target.value })}
                                        className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                                    />
                                    <select
                                        defaultValue={coupon.discount_type}
                                        onChange={(e) => updateCoupon(coupon, { discount_type: e.target.value })}
                                        className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                                    >
                                        <option value="fixed">Fixed</option>
                                        <option value="percent">Percent</option>
                                    </select>
                                    <input
                                        defaultValue={coupon.discount_value}
                                        onBlur={(e) => updateCoupon(coupon, { discount_value: e.target.value })}
                                        className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                                    />
                                    <input
                                        type="datetime-local"
                                        defaultValue={coupon.starts_at ? String(coupon.starts_at).slice(0, 16) : ""}
                                        onBlur={(e) => updateCoupon(coupon, { starts_at: e.target.value || null })}
                                        className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                                    />
                                    <input
                                        type="datetime-local"
                                        defaultValue={coupon.ends_at ? String(coupon.ends_at).slice(0, 16) : ""}
                                        onBlur={(e) => updateCoupon(coupon, { ends_at: e.target.value || null })}
                                        className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                                    />
                                    <div className="flex items-center gap-2">
                                        <label className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!coupon.is_active}
                                                onChange={(e) => updateCoupon(coupon, { is_active: e.target.checked })}
                                            />
                                            Active
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeCoupon(coupon)}
                                            className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    defaultValue={coupon.notes || ""}
                                    onBlur={(e) => updateCoupon(coupon, { notes: e.target.value })}
                                    placeholder="Notes"
                                    rows={1}
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs"
                                />
                            </div>
                        ))}
                        {coupons.length === 0 && (
                            <div className="p-4 text-sm text-slate-500">No coupons created yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
