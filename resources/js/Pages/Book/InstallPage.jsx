import AppointmentDateRangePicker from "@/Components/extra/AppointmentDateTimePicker";
import { PageHeader } from "@/Components/ui/page-header";
import { Head, usePage } from "@inertiajs/react";
import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiCreditCard, FiLoader } from "react-icons/fi";

export default function InstallPage({ booking }) {
    const { symbol, title } = usePage().props;
    console.log("Postcode ", booking);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAllIncludes, setShowAllIncludes] = useState(false);

    const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr"];

    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
    });

    // client-side errors
    const [errors, setErrors] = useState({});

    // processing like InstantQuoteModal
    const [processing, setProcessing] = useState(false);
    const mounted = useRef(true);

    // scroll to customer details
    const autoScrolledRef = useRef(false);

    useEffect(() => {
        if (selectedDate && selectedTime && titleRef.current) {
            // prevent repeated auto-scrolls
            if (autoScrolledRef.current) return;

            autoScrolledRef.current = true;

            // slight delay for smoother UX (calendar animation settle)
            setTimeout(() => {
                titleRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                // focus the first customer field
                titleRef.current.focus();
            }, 300);
        }

        // reset if appointment is cleared/changed
        if (!selectedDate || !selectedTime) {
            autoScrolledRef.current = false;
        }
    }, [selectedDate, selectedTime]);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        const postcode = booking?.answers?.inputs?.postcode;
        setFormData((prev) => {
            if (prev.address?.trim()) return prev;
            return { ...prev, address: postcode ? `${postcode} ` : "" };
        });
    }, []);

    // refs to scroll/focus to invalid section
    const dateRef = useRef(null);
    const titleRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);

    const includes = Array.isArray(booking?.includes) ? booking.includes : [];
    const visibleIncludes = showAllIncludes ? includes : includes.slice(0, 3);

    const visibleAddOns = booking?.answers?.addOns;
    console.log("Add Ons", visibleAddOns);

    const addOns = visibleAddOns?.items || [];

    const trvItem = addOns.find((x) => x.key === "trv");
    const flueType = visibleAddOns?.derived?.flueType || "horizontal"; // fallback
    const isVertical = String(flueType).toLowerCase() === "vertical";

    // Your vertical flue item can have different keys, so match by key OR label
    const verticalFlueItem =
        addOns.find((x) => x.key?.includes("vertical_flue")) ||
        addOns.find((x) =>
            String(x.label || "")
                .toLowerCase()
                .includes("vertical flue")
        );

    const hasSmartThermostat = addOns.some((x) => x.key === "smart_stat");

    const thermostatLabel = hasSmartThermostat
        ? "Smart Thermostat"
        : "Standard Wireless Thermostat";

    const scrollToRef = (ref) => {
        const el = ref?.current;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof el.focus === "function") el.focus();
    };

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

        // appointment
        if (!selectedDate)
            next.appointment = "Please select an installation date.";
        else if (!selectedTime)
            next.appointment = "Please select an installation time.";

        // customer fields
        if (!formData.title) next.title = "Please select a title.";
        if (!formData.firstName?.trim())
            next.firstName = "First name is required.";
        if (!formData.lastName?.trim())
            next.lastName = "Last name is required.";

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

        if (!formData.address?.trim()) next.address = "Address is required.";

        return next;
    };

    const fieldOrder = useMemo(
        () => [
            { key: "appointment", ref: dateRef },
            { key: "title", ref: titleRef },
            { key: "firstName", ref: firstNameRef },
            { key: "lastName", ref: lastNameRef },
            { key: "email", ref: emailRef },
            { key: "phone", ref: phoneRef },
            { key: "address", ref: addressRef },
        ],
        []
    );

    const isFormValid = useMemo(() => {
        const e = validateAll();
        return Object.keys(e).length === 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, selectedDate, selectedTime]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
        clearError(name);
    };

    const handleAppointmentChange = ({ date, time }) => {
        setSelectedDate(date);
        setSelectedTime(time);
        clearError("appointment");

        setFormData((prev) => ({
            ...prev,
            notes:
                date && time
                    ? `Preferred appointment: ${date} at ${time}`
                    : prev.notes,
        }));
    };

    const showValidationErrors = (errorsObj) => {
        if (!errorsObj || typeof errorsObj !== "object") return;

        // Laravel typically returns: { field: [msg1, msg2], ... }
        const messages = Object.values(errorsObj).flat().filter(Boolean);
        if (!messages.length) return;

        messages
            .slice(0, 4)
            .forEach((m) =>
                toast.error(m, { duration: 5000, position: "top-center" })
            );
        if (messages.length > 4) {
            toast.error("Please review the highlighted fields and try again.", {
                duration: 5000,
                position: "top-center",
            });
        }
    };

    // Optional: map backend 422 errors into local fields for inline rendering + scroll-to
    const hydrateInlineErrorsFromBackend = (errorsObj) => {
        if (!errorsObj || typeof errorsObj !== "object") return;

        // If backend keys come as customer.first_name etc, map them to your local keys.
        const mapKey = (k) => {
            const key = String(k || "");
            if (key === "appointment_date" || key === "appointment_time")
                return "appointment";
            if (key === "customer.title") return "title";
            if (key === "customer.first_name") return "firstName";
            if (key === "customer.last_name") return "lastName";
            if (key === "customer.email") return "email";
            if (key === "customer.phone") return "phone";
            if (key === "customer.address") return "address";
            return null;
        };

        const next = {};
        Object.entries(errorsObj).forEach(([k, arr]) => {
            const local = mapKey(k);
            if (!local) return;
            const msg = Array.isArray(arr) ? arr[0] : String(arr || "");
            if (msg) next[local] = msg;
        });

        if (Object.keys(next).length) {
            setErrors((prev) => ({ ...prev, ...next }));
            const firstInvalid = fieldOrder.find((f) => next[f.key]);
            if (firstInvalid) scrollToRef(firstInvalid.ref);
        }
    };

    // ✅ This replaces router.post("/book/installation/confirm"...)
    // It applies InstantQuoteModal "Pay now" behavior: POST -> get checkout_url -> redirect
    const handlePayAndBook = async () => {
        if (processing) return;

        const nextErrors = validateAll();
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            const firstInvalid = fieldOrder.find((f) => nextErrors[f.key]);
            if (firstInvalid) scrollToRef(firstInvalid.ref);
            toast.error("Please complete the required fields.", {
                duration: 4000,
                position: "top-center",
            });
            return;
        }

        setProcessing(true);

        const productDetails = {
            boiler_id: booking.boiler_id,
            brand: booking.brand,
            model: booking.model,
            kw: booking.kw,
            warrantyYears: booking.warrantyYears,
            amount: booking.price, // keep naming consistent with backend if it expects amount
            includes: booking.includes,
            images: booking.images,
        };

        // console.log(booking);

        const answers = booking?.answers?.answers?.raw;
        const addOns = booking?.answers?.addOns;

        const payload = {
            // booking data
            ...answers,
            addOns,

            // appointment
            visit_time: {
                datetime: {
                    date: selectedDate,
                    time: selectedTime,
                },
            },
            // customer form
            customer_details: {
                full_name: `${formData.title} ${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                postcode: "SW22NN",
                address: formData.address,
                notes: formData.notes,
            },
            product: productDetails,
        };

        // console.log("Form Data", payload);
        // console.log("Answers", answers);
        // return false;
        try {
            // If your checkout endpoint expects { service, form, amount } like InstantQuoteModal:
            // const res = await axios.post("/quote/checkout", { service: "new_boiler_install", form: payload, amount: booking.price }, { timeout: 15000 });

            // If you want install flow to use the exact same endpoint signature you already built:
            const res = await axios.post(
                "/quote/checkout",
                {
                    service: "new_boiler_quote", // change if you use another service key
                    form: payload,
                    amount: booking.price,
                },
                { timeout: 15000 }
            );

            const checkoutUrl = res?.data?.data?.checkout_url;
            if (!checkoutUrl)
                throw new Error("Checkout URL missing from response.");

            window.location.assign(checkoutUrl);
        } catch (err) {
            const status = err?.response?.status;

            if (status === 422) {
                const backendErrors = err?.response?.data?.errors;
                showValidationErrors(backendErrors);
                hydrateInlineErrorsFromBackend(backendErrors);
            } else if (status >= 500) {
                toast.error(
                    "Payment service is temporarily unavailable. Please try again shortly.",
                    {
                        duration: 5000,
                        position: "top-center",
                    }
                );
            } else if (err?.code === "ECONNABORTED") {
                toast.error(
                    "Request timed out. Please check your connection and try again.",
                    {
                        duration: 5000,
                        position: "top-center",
                    }
                );
            } else {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to initiate payment. Please try again.";
                toast.error(message, {
                    duration: 5000,
                    position: "top-center",
                });
            }

            if (mounted.current) setProcessing(false);
        }
    };

    return (
        <>
            <Head title={title} />
            <PageHeader />

            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-end gap-6 mb-8">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="group flex w-fit items-center gap-2 text-[14px] cursor-pointer font-bold uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-900"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-transform duration-300 group-hover:-translate-x-1 group-hover:bg-slate-200">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </span>
                            Go Back
                        </button>

                        <div className="relative">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                                Finalize Booking
                            </h2>
                            <div className="absolute -bottom-2 right-0 h-1 w-12 rounded-full bg-emerald-500"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* STEP 1: Appointment */}
                            <section className="relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-100">
                                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
                                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />

                                <div className="flex flex-col gap-2 border-b border-slate-100 p-4 md:6 lg:p-8">
                                    <div className="flex-1 flex gap-2 items-center justify-between">
                                        <div>
                                            <h2 className="text-[16px] lg:text-xl font-bold text-slate-900">
                                                Select Installation Date
                                            </h2>
                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                Our engineers are available in
                                                your area.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-primary ">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                            </span>
                                            Real-time Availability
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-1 p-4 md:p-7">
                                        <div
                                            ref={dateRef}
                                            className="min-h-[300px]"
                                        >
                                            <AppointmentDateRangePicker
                                                type="new_boiler_quote"
                                                value={{
                                                    date: selectedDate,
                                                    time: selectedTime,
                                                }}
                                                onChange={
                                                    handleAppointmentChange
                                                }
                                            />

                                            {errors.appointment && (
                                                <p className="mt-3 text-sm font-semibold text-red-600">
                                                    {errors.appointment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* STEP 2: Customer Details (unchanged markup except errors) */}
                            <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-2xl backdrop-blur-2xl transition-all duration-500">
                                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
                                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px]" />

                                <div className="relative border-b border-slate-200/50 px-8 py-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                                Personal Details
                                            </h2>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                                </span>
                                                <p className="text-sm font-medium text-slate-500">
                                                    Secure checkout active
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                                            <svg
                                                className="h-6 w-6 text-primary"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative p-8 pt-6">
                                    <div className="space-y-7">
                                        {/* Name Section */}
                                        <div className="group relative">
                                            <div className="flex gap-6">
                                                <div className="flex-grow">
                                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-primary">
                                                        Who are we installing
                                                        for?
                                                    </h3>

                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                        {/* Title */}
                                                        <div className="col-span-1">
                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Title
                                                                </label>

                                                                <div className="relative">
                                                                    <select
                                                                        ref={
                                                                            titleRef
                                                                        }
                                                                        name="title"
                                                                        value={
                                                                            formData.title
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                        className={`w-full appearance-none rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all hover:bg-white focus:bg-white focus:ring-2 focus:shadow-lg focus:outline-none
                                      ${errors.title
                                                                                ? "ring-red-400 focus:ring-red-400/50 focus:shadow-red-500/10"
                                                                                : "ring-slate-200 focus:ring-primary/50 focus:shadow-primary/10"
                                                                            }`}
                                                                    >
                                                                        <option value="">
                                                                            --
                                                                        </option>
                                                                        {titleOptions.map(
                                                                            (
                                                                                t
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        t
                                                                                    }
                                                                                    value={
                                                                                        t
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        t
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>

                                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                                                        <svg
                                                                            className="h-3 w-3"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    3
                                                                                }
                                                                                d="M19 9l-7 7-7-7"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                {errors.title && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.title
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* First/Last */}
                                                        <div className="col-span-3 grid grid-cols-2 gap-4">
                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    First Name
                                                                </label>
                                                                <input
                                                                    ref={
                                                                        firstNameRef
                                                                    }
                                                                    name="firstName"
                                                                    placeholder="e.g. John"
                                                                    value={
                                                                        formData.firstName
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.firstName
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.firstName && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.firstName
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Last Name
                                                                </label>
                                                                <input
                                                                    ref={
                                                                        lastNameRef
                                                                    }
                                                                    name="lastName"
                                                                    placeholder="e.g. Doe"
                                                                    value={
                                                                        formData.lastName
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.lastName
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.lastName && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.lastName
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Section */}
                                        <div className="group relative">
                                            <div className="flex gap-6">
                                                <div className="flex-grow pt-1.5">
                                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-primary">
                                                        How can we reach you?
                                                    </h3>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                            <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                Email Address
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    ref={
                                                                        emailRef
                                                                    }
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="your@email.com"
                                                                    value={
                                                                        formData.email
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.email
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                                    <svg
                                                                        className="w-5 h-5"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            {errors.email && (
                                                                <p className="mt-2 text-xs font-semibold text-red-600">
                                                                    {
                                                                        errors.email
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                            <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                Phone Number
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    ref={
                                                                        phoneRef
                                                                    }
                                                                    name="phone"
                                                                    placeholder="07xxx xxxxxx"
                                                                    value={
                                                                        formData.phone
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.phone
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                                    <svg
                                                                        className="w-5 h-5"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            {errors.phone && (
                                                                <p className="mt-2 text-xs font-semibold text-red-600">
                                                                    {
                                                                        errors.phone
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address Section */}
                                        <div className="group relative">
                                            <div className="flex gap-6">
                                                <div className="flex-grow pt-1.5">
                                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-primary">
                                                        Where are we installing?
                                                    </h3>

                                                    <div className="space-y-5">
                                                        <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                            <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                Property Address
                                                            </label>

                                                            <div className="relative group/input">
                                                                <input
                                                                    ref={
                                                                        addressRef
                                                                    }
                                                                    name="address"
                                                                    placeholder="Start typing postcode or address..."
                                                                    value={
                                                                        formData.address
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.address
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />

                                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                                    <svg
                                                                        className="w-5 h-5"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>

                                                            {errors.address && (
                                                                <p className="mt-2 text-xs font-semibold text-red-600">
                                                                    {
                                                                        errors.address
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                            <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                Additional Notes{" "}
                                                                <span className="font-normal text-slate-400 ml-1 opacity-70">(Optional)</span>
                                                            </label>
                                                            <textarea
                                                                name="notes"
                                                                rows={3}
                                                                placeholder="Any parking restrictions, access details, or special requests?"
                                                                value={formData.notes}
                                                                onChange={handleInputChange}
                                                                className="w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10 focus:outline-none resize-none"
                                                            />
                                                        </div> */}
                                                    </div>

                                                    {Object.keys(errors)
                                                        .length > 0 && (
                                                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                                                                <p className="text-sm font-bold text-red-700">
                                                                    Please fix the
                                                                    highlighted
                                                                    fields to
                                                                    continue.
                                                                </p>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN - Sticky Summary */}
                        <div className="lg:col-span-1">
                            <aside className="sticky top-6 filter drop-shadow-xl">
                                <div
                                    className="relative bg-white text-slate-800 rounded-t-2xl"
                                    style={{
                                        clipPath:
                                            "polygon(0 0, 100% 0, 100% calc(100% - 12px), 95% 100%, 90% calc(100% - 12px), 85% 100%, 80% calc(100% - 12px), 75% 100%, 70% calc(100% - 12px), 65% 100%, 60% calc(100% - 12px), 55% 100%, 50% calc(100% - 12px), 45% 100%, 40% calc(100% - 12px), 35% 100%, 30% calc(100% - 12px), 25% 100%, 20% calc(100% - 12px), 15% 100%, 10% calc(100% - 12px), 5% 100%, 0 calc(100% - 12px))",
                                    }}
                                >
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-foreground shadow-inner border border-slate-200" />

                                    <div className="bg-slate-50 p-6 pt-10 border-b-2 border-dashed border-dark/40 text-center rounded-t-2xl space-y-0.5">
                                        <h2 className="text-[12px] font-black font-mono uppercase tracking-widest text-dark/70 mt-2">
                                            Installation Summary
                                        </h2>
                                        <div>
                                            <span className="text-5xl font-bold tracking-tighter text-slate-900">
                                                {symbol} {booking?.price}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <p className="font-bold text-[18px] text-slate-900">
                                                    {booking?.model}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-primary/10 text-primary text-[14px] px-2 py-0.5 rounded font-mono">
                                                        {booking?.kw}KW
                                                    </span>
                                                    <span className="bg-slate-100 text-slate-600 text-[14px] px-2 py-0.5 rounded font-mono">
                                                        {booking?.warrantyYears}
                                                        Y Warranty
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-20 w-20 bg-slate-100/40 rounded-full flex items-center justify-center text-xl p-2">
                                                <img
                                                    src={booking?.images?.[0]}
                                                    className="h-full object-contain drop-shadow-2xl"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/ideal-20logic.png";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full border-t-2 border-dashed border-dark/40" />

                                        <div className="space-y-3">
                                            <p className="text-[14px] font-bold uppercase text-dark/60 tracking-wider">
                                                What's Included
                                            </p>

                                            {includes.length > 0 && (
                                                <div className="space-y-3">
                                                    <ul
                                                        className={`space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${showAllIncludes
                                                                ? "max-h-[600px]"
                                                                : "max-h-[180px]"
                                                            }`}
                                                    >
                                                        <div className="space-y-3">
                                                            {/* TRV */}
                                                            {trvItem && (
                                                                <div className="flex items-center justify-between text-[14px]">
                                                                    <div className="text-slate-700 font-semibold">
                                                                        TRV
                                                                        supply &
                                                                        fit
                                                                    </div>
                                                                    <div className="text-slate-900 font-bold">
                                                                        {trvItem
                                                                            ? `${trvItem.qty} × £${trvItem.unitPrice} = £${trvItem.total}`
                                                                            : "—"}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {(() => {
                                                                const relocation =
                                                                    addOns.find(
                                                                        (x) =>
                                                                            x.key ===
                                                                            "boiler_relocation"
                                                                    );
                                                                if (!relocation)
                                                                    return null;

                                                                return (
                                                                    <div className="flex items-center justify-between text-[14px]">
                                                                        <div className="text-slate-700 font-semibold">
                                                                            {
                                                                                relocation.label
                                                                            }
                                                                        </div>
                                                                        <div className="text-slate-900 font-bold">
                                                                            £
                                                                            {
                                                                                relocation.total
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}

                                                            {(() => {
                                                                const convert_to_combi =
                                                                    addOns.find(
                                                                        (x) =>
                                                                            x.key ===
                                                                            "convert_to_combi"
                                                                    );
                                                                if (
                                                                    !convert_to_combi
                                                                )
                                                                    return null;

                                                                return (
                                                                    <div className="flex items-center justify-between text-[14px]">
                                                                        <div className="text-slate-700 font-semibold">
                                                                            {
                                                                                convert_to_combi.label
                                                                            }
                                                                        </div>
                                                                        <div className="text-slate-900 font-bold">
                                                                            £
                                                                            {
                                                                                convert_to_combi.total
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}

                                                            {/* Flue Type */}
                                                            <div className="flex items-center justify-between text-[14px]">
                                                                <div className="text-slate-700 font-semibold">
                                                                    Flue Type
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={`px-2 py-0.5 rounded font-bold text-[12px] uppercase tracking-wider ${isVertical
                                                                                ? "bg-amber-100 text-amber-900"
                                                                                : "bg-emerald-100 text-emerald-900"
                                                                            }`}
                                                                    >
                                                                        {isVertical
                                                                            ? "Vertical"
                                                                            : "Horizontal"}
                                                                    </span>

                                                                    {/* Only show cost if vertical add-on exists */}
                                                                    {isVertical &&
                                                                        verticalFlueItem ? (
                                                                        <span className="text-slate-900 font-bold">
                                                                            £
                                                                            {
                                                                                verticalFlueItem.total
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-slate-500 font-semibold text-[13px]">
                                                                            Included
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between text-[14px]">
                                                            <span className="text-slate-700 font-semibold">
                                                                Thermostat
                                                            </span>

                                                            <span
                                                                className={`font-bold ${hasSmartThermostat
                                                                        ? "text-primary"
                                                                        : "text-slate-700"
                                                                    }`}
                                                            >
                                                                {
                                                                    thermostatLabel
                                                                }
                                                            </span>
                                                        </div>

                                                        {visibleIncludes.map(
                                                            (item, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex justify-between items-center font-medium text-dark opacity-0 included-animation"
                                                                    style={{
                                                                        animationDelay: `${i *
                                                                            40
                                                                            }ms`,
                                                                    }}
                                                                >
                                                                    <span className="max-w-[90%] text-[15px] line-clamp-1">
                                                                        {item}
                                                                    </span>
                                                                    <span className="text-primary text-sm font-semibold">
                                                                        Included
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>

                                                    {includes.length > 3 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowAllIncludes(
                                                                    (v) => !v
                                                                )
                                                            }
                                                            className="text-[14px] mt-3 border border-gray-200 cursor-pointer hover:border-primary px-3 py-2 uppercase tracking-wider font-semibold text-dark/80 hover:text-primary transition-colors"
                                                        >
                                                            {showAllIncludes
                                                                ? "- Hide full item"
                                                                : `+ See full item (${includes.length})`}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* ✅ Pay Now button functionality applied here */}
                                        <div className="bg-slate-900 -mx-6 -mb-6 p-6 pb-12 mt-6 text-white">
                                            <button
                                                type="button"
                                                onClick={handlePayAndBook}
                                                disabled={
                                                    !isFormValid || processing
                                                }
                                                aria-busy={processing}
                                                className={[
                                                    "w-full py-4 text-sm font-bold rounded-sm uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2",
                                                    processing
                                                        ? "bg-gray-400 border-gray-400 cursor-not-allowed text-white"
                                                        : isFormValid
                                                            ? "bg-primary border-primary text-foreground hover:text-dark hover:bg-foreground"
                                                            : "bg-transparent border-slate-700 text-slate-500 cursor-not-allowed",
                                                ].join(" ")}
                                            >
                                                {processing ? (
                                                    <>
                                                        <FiLoader className="animate-spin" />
                                                        Processing…
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCreditCard />
                                                        Pay & Book Now
                                                    </>
                                                )}
                                            </button>

                                            <div className="mt-4 flex justify-center gap-3 opacity-30 grayscale">
                                                <div className="h-6 w-10 bg-white rounded-sm"></div>
                                                <div className="h-6 w-10 bg-white rounded-sm"></div>
                                                <div className="h-6 w-10 bg-white rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
