import AppointmentDateTimePicker from "@/Components/extra/AppointmentDateTimePicker";
import { PageHeader } from "@/Components/ui/page-header";
import BlueQuoteSkin from "@/Components/extra/BlueQuoteSkin";
import { Head, usePage } from "@inertiajs/react";
import { GoogleReview } from "@/Components/GoogleReviewPremium";
import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiCreditCard, FiLoader, FiCheck, FiShield, FiCalendar, FiMapPin, FiInfo } from "react-icons/fi";
import { SERVICES_KEY_VALUE } from "@/Components/extra/ServicesKeyValue";
import { loadStripe } from "@stripe/stripe-js";

const UK_POSTCODE_RE =
    /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2})|(?:[A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(?:[A-PR-UWYZ][0-9][A-HJKPSTUW])|(?:[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

const ALLOWED_OUTCODES = ["LS", "WF", "HG", "BD"];

function normalizeUkPostcode(input) {
    const raw = String(input || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    if (raw.length <= 3) return raw;

    return `${raw.slice(0, -3)} ${raw.slice(-3)}`.trim();
}

function getOutcode(value) {
    const normalized = normalizeUkPostcode(value);
    if (!normalized) return "";

    return normalized.includes(" ")
        ? normalized.split(" ")[0]
        : normalized.length > 3
            ? normalized.slice(0, -3)
            : normalized;
}

function isAllowedOutcode(value) {
    const outcode = getOutcode(value);
    return ALLOWED_OUTCODES.some((prefix) => outcode.startsWith(prefix));
}

export default function ServiceCheckout() {
    const { answers, basePrice, symbol, title, stripePublishableKey } = usePage().props;

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
    const [paymentClientSecret, setPaymentClientSecret] = useState(null);
    const [paymentBookingId, setPaymentBookingId] = useState(null);
    const [paymentTxId, setPaymentTxId] = useState(null);
    const [paymentReturnUrl, setPaymentReturnUrl] = useState(null);
    const [paymentError, setPaymentError] = useState("");
    const [openPetTooltip, setOpenPetTooltip] = useState(false);
    const mounted = useRef(true);
    const paymentElementContainerRef = useRef(null);
    const paymentSectionRef = useRef(null);
    const stripeRef = useRef(null);
    const elementsRef = useRef(null);
    const paymentElementRef = useRef(null);
    const lastAutoInitKeyRef = useRef("");

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!openPetTooltip) return;

        const handleOutside = (event) => {
            const target = event.target;
            if (
                target instanceof Element &&
                !target.closest('[data-pet-policy-wrap="true"]')
            ) {
                setOpenPetTooltip(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpenPetTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openPetTooltip]);

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

    const stripePromise = useMemo(() => {
        if (!stripePublishableKey) return null;
        return loadStripe(stripePublishableKey);
    }, [stripePublishableKey]);

    useEffect(() => {
        if (!paymentClientSecret || !paymentElementContainerRef.current || !stripePromise)
            return;

        let disposed = false;

        (async () => {
            try {
                const stripe = await stripePromise;
                if (!stripe || disposed) return;

                const elements = stripe.elements({
                    clientSecret: paymentClientSecret,
                    appearance: { theme: "stripe" },
                });

                const paymentElement = elements.create("payment", {
                    layout: "tabs",
                });

                paymentElement.mount(paymentElementContainerRef.current);

                stripeRef.current = stripe;
                elementsRef.current = elements;
                paymentElementRef.current = paymentElement;
                setPaymentError("");
            } catch (error) {
                const msg =
                    "Unable to load secure payment form. Please try again, or refresh this page.";
                toast.error(msg);
                setPaymentError(msg);
                setPaymentClientSecret(null);
            }
        })();

        return () => {
            disposed = true;
            paymentElementRef.current?.destroy?.();
            paymentElementRef.current = null;
            elementsRef.current = null;
            stripeRef.current = null;
        };
    }, [paymentClientSecret, stripePromise]);

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

        const formattedPostcode = normalizeUkPostcode(formData.postcode);
        if (!formattedPostcode) {
            next.postcode = "Postcode is required.";
        } else if (!UK_POSTCODE_RE.test(formattedPostcode)) {
            next.postcode = "Please enter a valid UK postcode.";
        } else if (!isAllowedOutcode(formattedPostcode)) {
            next.postcode = "Checkout is restricted to LS, WF, HG and BD postcodes only.";
        }
        if (!formData.address?.trim()) next.address = "Address is required.";

        return next;
    };

    const checkoutReadyKey = useMemo(() => {
        if (!selectedDate || !selectedTime) return "";
        if (!formData.title?.trim()) return "";
        if (!formData.firstName?.trim()) return "";
        if (!formData.lastName?.trim()) return "";
        if (!formData.email?.trim()) return "";
        if (!formData.phone?.trim()) return "";
        const formattedPostcode = normalizeUkPostcode(formData.postcode);
        if (!formattedPostcode) return "";
        if (!UK_POSTCODE_RE.test(formattedPostcode)) return "";
        if (!isAllowedOutcode(formattedPostcode)) return "";
        if (!formData.address?.trim()) return "";

        return [
            selectedDate,
            selectedTime,
            formData.title,
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.phone,
            formattedPostcode,
            formData.address,
        ]
            .map((v) => String(v || "").trim())
            .join("|");
    }, [selectedDate, selectedTime, formData]);

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
        setFormData((s) => ({
            ...s,
            [name]: name === "postcode" ? normalizeUkPostcode(value) : value,
        }));
        clearError(name);
    };

    const handleAppointmentChange = ({ date, time }) => {
        setSelectedDate(date);
        setSelectedTime(time);
        clearError("appointment");
    };

    const initialisePaymentElement = async ({ showValidationToast = false } = {}) => {
        const nextErrors = validateAll();
        if (Object.keys(nextErrors).length) {
            if (showValidationToast) {
                setErrors(nextErrors);
                setPaymentError("Please complete the highlighted fields first.");
                const first = fieldOrder.find((f) => nextErrors[f.key]);
                if (first) scrollToRef(first.ref);
                toast.error("Please complete the required details first.");
            }
            return false;
        }

        setPaymentError("");

        const customerName = `${formData.title} ${formData.firstName} ${formData.lastName}`.trim();

        const payload = {
            ...answers,
            customer_details: {
                full_name: customerName,
                title: formData.title,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                postcode: formData.postcode,
                address: formData.address,
                notes: formData.notes,
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
            setProcessing(true);
            const res = await axios.post(
                "/quote/checkout",
                {
                    service: SERVICES_KEY_VALUE.BOILER_SERVICE,
                    form: payload,
                    amount: basePrice,
                    payment_element: true,
                },
                { timeout: 15000 }
            );

            const checkoutClientSecret =
                res?.data?.data?.checkout_client_secret;
            const checkoutMode = res?.data?.data?.checkout_mode;

            if (
                checkoutMode === "payment_element" &&
                checkoutClientSecret &&
                stripePublishableKey
            ) {
                setPaymentClientSecret(checkoutClientSecret);
                setPaymentBookingId(res?.data?.data?.booking_id || null);
                setPaymentTxId(res?.data?.data?.transaction_id || null);
                setPaymentReturnUrl(res?.data?.data?.return_url || null);
                setProcessing(false);
                return true;
            }

            throw new Error("Unable to initialise secure payment form.");
        } catch (err) {
            const status = err?.response?.status;

            if (status === 422) {
                if (showValidationToast) showValidationErrors(err?.response?.data?.errors);
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
            } else if (showValidationToast) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to initiate payment. Please try again.";
                toast.error(message, { duration: 5000, position: "top-center" });
            }

            if (mounted.current) setProcessing(false);
            return false;
        }
    };

    useEffect(() => {
        if (!checkoutReadyKey || paymentClientSecret || processing) return;
        if (lastAutoInitKeyRef.current === checkoutReadyKey) return;

        lastAutoInitKeyRef.current = checkoutReadyKey;

        const timer = setTimeout(() => {
            initialisePaymentElement({ showValidationToast: false });
        }, 250);

        return () => clearTimeout(timer);
    }, [checkoutReadyKey, paymentClientSecret, processing]);

    const handlePayAndBook = async () => {
        if (processing) return;

        if (!paymentClientSecret) {
            await initialisePaymentElement({ showValidationToast: true });
            return;
        }

        setPaymentError("");

        try {
            setProcessing(true);

            if (!stripeRef.current || !elementsRef.current) {
                throw new Error("Payment form is still loading. Please try again.");
            }

            const { error, paymentIntent } = await stripeRef.current.confirmPayment(
                {
                    elements: elementsRef.current,
                    confirmParams: {
                        return_url:
                            paymentReturnUrl ||
                            `${window.location.origin}/checkout/success-intent?booking=${paymentBookingId}&tx=${paymentTxId}`,
                    },
                    redirect: "if_required",
                }
            );

            if (error) {
                setPaymentError(
                    error.message ||
                        "Payment could not be confirmed. Please check your details and try again."
                );
                toast.error(error.message || "Payment failed.");
                setProcessing(false);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                const confirmRes = await axios.post(
                    "/quote/checkout/confirm-intent",
                    {
                        booking_id: paymentBookingId,
                        tx_id: paymentTxId,
                        payment_intent_id: paymentIntent.id,
                    },
                    { timeout: 15000 }
                );

                const redirectUrl = confirmRes?.data?.data?.redirect_url;
                if (redirectUrl) {
                    window.location.assign(redirectUrl);
                    return;
                }
            }

            setProcessing(false);
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
            <style>{`
                .pet-doggy-wrap {
                    animation: pet-doggy-bob 1.8s ease-in-out infinite;
                    transform-origin: center;
                }

                .pet-doggy-ear-left,
                .pet-doggy-ear-right {
                    animation: pet-doggy-ear 1.2s ease-in-out infinite;
                    transform-origin: center top;
                }

                @keyframes pet-doggy-bob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-1.5px); }
                }

                @keyframes pet-doggy-ear {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(7deg); }
                }
            `}</style>
            <BlueQuoteSkin>
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50 quote-page-bg" />
                <div className="min-h-screen quote-page-bg">
                    <PageHeader theme="blue" />
                

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                    <div className="flex flex-col gap-2">
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
                                        <p className="text-xs text-slate-500 mt-1">If inspection finds worn seals, gaskets, or electrodes, we’ll quote before fitting—often not needed.</p>
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
                                    <div className="text-xs bg-white/15 px-3 py-1 rounded-full">Card or Klarna payments</div>
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
                                            {paymentClientSecret
                                                ? "Confirm & Book Service"
                                                : "Continue to secure payment"}
                                        </>
                                    )}
                                </button>

                                <div data-pet-policy-wrap="true" className="relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-800 group/pet-policy">
                                    <span className="pet-doggy-wrap inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100/90 ring-1 ring-amber-200">
                                        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                                            <path className="pet-doggy-ear-left" d="M7 7.2c-.8-1.5-2.3-1.9-3.2-.8-.8 1-.6 2.5.8 3.4L7 10.9V7.2Z" fill="#c08457" />
                                            <path className="pet-doggy-ear-right" d="M17 7.2c.8-1.5 2.3-1.9 3.2-.8.8 1 .6 2.5-.8 3.4L17 10.9V7.2Z" fill="#c08457" />
                                            <circle cx="12" cy="12" r="7" fill="#f5c892" />
                                            <circle cx="9.4" cy="11.3" r="0.9" fill="#1f2937" />
                                            <circle cx="14.6" cy="11.3" r="0.9" fill="#1f2937" />
                                            <ellipse cx="12" cy="13.7" rx="1.2" ry="0.9" fill="#111827" />
                                            <path d="M10.8 15.4c.3.5.7.8 1.2.8s.9-.3 1.2-.8" stroke="#7c2d12" strokeWidth="1" strokeLinecap="round" fill="none" />
                                        </svg>
                                    </span>
                                    <span className="font-semibold text-emerald-900">
                                        Pet-friendly visits
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenPetTooltip(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 transition-colors hover:border-emerald-500 hover:text-emerald-800"
                                        aria-label="Show pet-friendly information"
                                    >
                                        <FiInfo className="h-3.5 w-3.5" />
                                    </button>

                                    <div
                                        className={`quote-solid-popover absolute left-0 top-9 z-20 w-[320px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${
                                            openPetTooltip
                                                ? "pointer-events-auto opacity-100 translate-y-0"
                                                : "pointer-events-none opacity-0 group-hover/pet-policy:pointer-events-auto group-hover/pet-policy:opacity-100 group-hover/pet-policy:translate-y-0 group-focus-within/pet-policy:pointer-events-auto group-focus-within/pet-policy:opacity-100 group-focus-within/pet-policy:translate-y-0"
                                        }`}
                                    >
                                        <p>
                                            We are dog-friendly and happy for them to be around during the visit.
                                        </p>
                                        <p className="mt-1.5">
                                            If your dog is feeling social, we are always glad to say hello first.
                                        </p>
                                        <p className="mt-1.5">
                                            During active work, we ask that pets are kept clear of tools and working areas for everyone’s safety.
                                        </p>
                                    </div>
                                </div>

                                {paymentClientSecret && (
                                    <div
                                        ref={paymentSectionRef}
                                        className="mt-4 rounded-2xl bg-white p-3"
                                    >
                                        <div ref={paymentElementContainerRef} />
                                    </div>
                                )}

                                <p className="text-xs text-emerald-50/90 text-center mt-3">
                                    Your details are encrypted and processed by Stripe.
                                </p>
                                {paymentError && (
                                    <p className="text-xs text-amber-100 text-center mt-2 font-semibold">
                                        {paymentError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <GoogleReview />
                </div>
            </BlueQuoteSkin>
        </>
    );
}
