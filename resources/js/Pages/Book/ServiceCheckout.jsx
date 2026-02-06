import AppointmentDateTimePicker from "@/Components/extra/AppointmentDateTimePicker";
import { PageHeader } from "@/Components/ui/page-header";
import { Head, usePage } from "@inertiajs/react";
import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiCreditCard, FiLoader, FiCheck, FiShield, FiCalendar, FiMapPin } from "react-icons/fi";
import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";

export default function ServiceCheckout() {
    const { answers, basePrice, symbol, title } = usePage().props;

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        postcode: "",
        address: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const dateRef = useRef(null);
    const titleRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const postcodeRef = useRef(null);
    const addressRef = useRef(null);

    const fieldOrder = useMemo(
        () => [
            { key: "appointment", ref: dateRef },
            { key: "title", ref: titleRef },
            { key: "firstName", ref: firstNameRef },
            { key: "lastName", ref: lastNameRef },
            { key: "email", ref: emailRef },
            { key: "phone", ref: phoneRef },
            { key: "postcode", ref: postcodeRef },
            { key: "address", ref: addressRef },
        ],
        []
    );

    const clearError = (key) => {
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    const validateAll = () => {
        const next = {};

        if (!selectedDate) next.appointment = "Please select a visit date.";
        else if (!selectedTime) next.appointment = "Please select a visit time.";

        if (!formData.title) next.title = "Please select a title.";
        if (!formData.firstName?.trim()) next.firstName = "First name is required.";
        if (!formData.lastName?.trim()) next.lastName = "Last name is required.";

        const email = (formData.email || "").trim();
        if (!email) next.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            next.email = "Please enter a valid email address.";

        const phone = (formData.phone || "").trim();
        if (!phone) next.phone = "Phone number is required.";
        else {
            const digits = phone.replace(/[^\d]/g, "");
            if (digits.length < 10)
                next.phone = "Please enter a valid phone number.";
        }

        if (!formData.postcode?.trim()) next.postcode = "Postcode is required.";
        if (!formData.address?.trim()) next.address = "Address is required.";

        return next;
    };

    const scrollToRef = (ref) => {
        const el = ref?.current;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof el.focus === "function") el.focus();
    };

    const showValidationErrors = (errorsObj) => {
        if (!errorsObj || typeof errorsObj !== "object") return;
        const messages = Object.values(errorsObj).flat().filter(Boolean);
        if (!messages.length) return;

        messages
            .slice(0, 4)
            .forEach((m) => toast.error(m, { duration: 5000, position: "top-center" }));
        if (messages.length > 4) {
            toast.error("Please review the highlighted fields and try again.", {
                duration: 5000,
                position: "top-center",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
        clearError(name);
    };

    const handleAppointmentChange = ({ date, time }) => {
        setSelectedDate(date);
        setSelectedTime(time);
        clearError("appointment");
    };

    const handlePayAndBook = async () => {
        if (processing) return;

        const nextErrors = validateAll();
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            const first = fieldOrder.find((f) => nextErrors[f.key]);
            if (first) scrollToRef(first.ref);
            return;
        }

        setProcessing(true);

        const customerName = `${formData.title} ${formData.firstName} ${formData.lastName}`.trim();

        const payload = {
            ...answers,
            customer_details: {
                name: customerName,
                email: formData.email,
                phone: formData.phone,
                postcode: formData.postcode,
                address: formData.address,
            },
            visit_time: {
                datetime: {
                    date: selectedDate,
                    time: selectedTime,
                },
                name: customerName,
                email: formData.email,
                phone: formData.phone,
                postcode: formData.postcode,
            },
            product: {},
            addOns: {},
        };

        try {
            const res = await axios.post(
                "/quote/checkout",
                {
                    service: SERVICES_KEY_VALUE.BOILER_SERVICE,
                    form: payload,
                    amount: basePrice,
                },
                { timeout: 15000 }
            );

            const checkoutUrl = res?.data?.data?.checkout_url;
            if (!checkoutUrl) throw new Error("Checkout URL missing from response.");

            window.location.assign(checkoutUrl);
        } catch (err) {
            const status = err?.response?.status;

            if (status === 422) {
                showValidationErrors(err?.response?.data?.errors);
            } else if (status >= 500) {
                toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
                    duration: 5000,
                    position: "top-center",
                });
            } else if (err?.code === "ECONNABORTED") {
                toast.error("Request timed out. Please check your connection and try again.", {
                    duration: 5000,
                    position: "top-center",
                });
            } else {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to initiate payment. Please try again.";
                toast.error(message, { duration: 5000, position: "top-center" });
            }

            if (mounted.current) setProcessing(false);
        }
    };

    const summaryItems = [
        { label: "Boiler type", value: answers?.boiler_type?.label || "—" },
        { label: "Make & model", value: answers?.boiler_model?.label || "—" },
        { label: "Boiler age", value: answers?.boiler_age?.label || "—" },
        { label: "Access", value: answers?.access?.label || "—" },
        {
            label: "Known issues",
            value: answers?.any_issue?.label || "—",
        },
    ];

    return (
        <>
            <Head title={title} />
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />
            <div className="min-h-screen">
                <PageHeader />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[12px] font-semibold text-emerald-800">
                            <FiShield className="h-3.5 w-3.5" />
                            Secure checkout
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h1>
                        <p className="text-base text-slate-600 max-w-2xl">
                            Confirm your visit time and details. Your service is fixed price—no surprises when the engineer arrives.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-8 items-start">
                        <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-[0_24px_60px_rgba(16,185,129,0.12)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-white" />
                            <div className="relative p-6 space-y-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-emerald-700 font-semibold">Fixed, all-in price</p>
                                        <p className="text-4xl font-black text-slate-900">
                                            {symbol}{basePrice}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">Includes gaskets & electrodes</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                                        <FiCheck className="h-4 w-4" />
                                        No hidden fees
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {summaryItems.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                                            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-900 leading-snug break-words">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-900">
                                    <p className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <FiShield className="h-4 w-4" /> What’s included
                                    </p>
                                    <ul className="mt-2 space-y-1 text-slate-700">
                                        <li className="flex items-start gap-2"><FiCheck className="mt-0.5 h-4 w-4 text-emerald-600" />Safety, combustion, and flue checks</li>
                                        <li className="flex items-start gap-2"><FiCheck className="mt-0.5 h-4 w-4 text-emerald-600" />Full clean of burner, condense trap, and seals</li>
                                        <li className="flex items-start gap-2"><FiCheck className="mt-0.5 h-4 w-4 text-emerald-600" />Expansion vessel set & leak-checked</li>
                                        <li className="flex items-start gap-2"><FiCheck className="mt-0.5 h-4 w-4 text-emerald-600" />Digital service record for compliance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Choose a visit time</h2>
                                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                            <FiCalendar className="h-4 w-4" /> Pick a preferred date and time.
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
                                        <FiMapPin className="h-4 w-4" /> Leeds & surrounding areas
                                    </div>
                                </div>
                                <div ref={dateRef} className="mt-5">
                                    <AppointmentDateTimePicker
                                        value={
                                            selectedDate && selectedTime
                                                ? { date: selectedDate, time: selectedTime }
                                                : null
                                        }
                                        type={SERVICES_KEY_VALUE.BOILER_SERVICE}
                                        onChange={handleAppointmentChange}
                                    />
                                    {errors.appointment && (
                                        <p className="text-sm text-red-500 mt-2">{errors.appointment}</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900">Your details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500">Title</label>
                                        <select
                                            ref={titleRef}
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="">Select</option>
                                            {"Mr, Mrs, Ms, Miss, Dr".split(", ").map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500">First name</label>
                                        <input
                                            ref={firstNameRef}
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500">Last name</label>
                                        <input
                                            ref={lastNameRef}
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500">Email</label>
                                        <input
                                            ref={emailRef}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500">Phone</label>
                                        <input
                                            ref={phoneRef}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500">Postcode</label>
                                        <input
                                            ref={postcodeRef}
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                        {errors.postcode && <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500">Address</label>
                                    <input
                                        ref={addressRef}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500">Notes (optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)] p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <FiShield className="h-4 w-4" /> Secure Stripe checkout
                                    </div>
                                    <div className="text-xs bg-white/15 px-3 py-1 rounded-full">Card payments only</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handlePayAndBook}
                                    disabled={processing}
                                    aria-busy={processing}
                                    className={`w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition ${
                                        processing
                                            ? "bg-white/20 cursor-not-allowed"
                                            : "bg-white text-emerald-700 hover:bg-emerald-50"
                                    }`}
                                >
                                    {processing ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Processing…
                                        </>
                                    ) : (
                                        <>
                                            <FiCreditCard />
                                            Pay & Book Service
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-emerald-50/90 text-center mt-3">
                                    Your details are encrypted and processed by Stripe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
