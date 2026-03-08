import AppointmentDateRangePicker from "@/Components/extra/AppointmentDateTimePicker";
import { PageHeader } from "@/Components/ui/page-header";
import BlueQuoteSkin from "@/Components/extra/BlueQuoteSkin";
import { Head, usePage } from "@inertiajs/react";
import { GoogleReview } from "@/Components/GoogleReviewPremium";
import { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
    FiCreditCard,
    FiInfo,
    FiLoader,
    FiShield,
} from "react-icons/fi";

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

function buildAddressFull(parts = []) {
    return parts
        .map((value) => String(value || "").trim())
        .filter(Boolean)
        .join(", ");
}

export default function InstallPage({ booking }) {
    const { symbol, title, stripePublishableKey } = usePage().props;

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAllIncludes, setShowAllIncludes] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsError, setTermsError] = useState("");
    const [openInstallCompatibilityTip, setOpenInstallCompatibilityTip] =
        useState(null);
    const [openPetTooltip, setOpenPetTooltip] = useState(false);
    const [openCancellationTooltip, setOpenCancellationTooltip] =
        useState(false);

    const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr"];

    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        county: "",
        postcode: "",
        notes: "",
    });

    // client-side errors
    const [errors, setErrors] = useState({});

    // processing like InstantQuoteModal
    const [processing, setProcessing] = useState(false);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [paymentClientSecret, setPaymentClientSecret] = useState(null);
    const [paymentBookingId, setPaymentBookingId] = useState(null);
    const [paymentTxId, setPaymentTxId] = useState(null);
    const [paymentReturnUrl, setPaymentReturnUrl] = useState(null);
    const [paymentError, setPaymentError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const mounted = useRef(true);
    const paymentElementContainerRef = useRef(null);
    const paymentSectionRef = useRef(null);
    const stripeRef = useRef(null);
    const elementsRef = useRef(null);
    const paymentElementRef = useRef(null);
    const lastAutoInitKeyRef = useRef("");

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
        if (openInstallCompatibilityTip === null) return;

        const handleOutside = (event) => {
            const target = event.target;
            if (
                target instanceof Element &&
                !target.closest('[data-install-compat-wrap="true"]')
            ) {
                setOpenInstallCompatibilityTip(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpenInstallCompatibilityTip(null);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openInstallCompatibilityTip]);

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

    useEffect(() => {
        if (!openCancellationTooltip) return;

        const handleOutside = (event) => {
            const target = event.target;
            if (
                target instanceof Element &&
                !target.closest('[data-cancel-policy-wrap="true"]')
            ) {
                setOpenCancellationTooltip(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpenCancellationTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openCancellationTooltip]);

    // refs to scroll/focus to invalid section
    const dateRef = useRef(null);
    const titleRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const addressLine1Ref = useRef(null);
    const addressLine2Ref = useRef(null);
    const cityRef = useRef(null);
    const countyRef = useRef(null);
    const postcodeRef = useRef(null);
    const termsRef = useRef(null);

    const includes = Array.isArray(booking?.includes) ? booking.includes : [];
    const visibleIncludes = showAllIncludes ? includes : includes.slice(0, 3);

    const quoteAmount = useMemo(() => {
        const raw =
            booking?.price ??
            booking?.amount ??
            booking?.product?.amount ??
            0;

        if (typeof raw === "number") return raw;
        if (typeof raw !== "string") return 0;

        const cleaned = raw.replace(/[^\d.,-]/g, "");
        if (!cleaned) return 0;

        const hasComma = cleaned.includes(",");
        const hasDot = cleaned.includes(".");

        if (hasComma && hasDot) {
            return Number(cleaned.replace(/,/g, "")) || 0;
        }

        if (hasComma && !hasDot) {
            const parts = cleaned.split(",");
            if (parts.length === 2 && parts[1].length <= 2) {
                return Number(`${parts[0]}.${parts[1]}`) || 0;
            }
            return Number(cleaned.replace(/,/g, "")) || 0;
        }

        return Number(cleaned) || 0;
    }, [booking]);

    const payableAmount = useMemo(() => {
        if (couponApplied && Number.isFinite(Number(couponApplied.total))) {
            return Number(couponApplied.total);
        }
        return Number(quoteAmount || 0);
    }, [couponApplied, quoteAmount]);

    const discountAmount = useMemo(() => {
        if (couponApplied && Number.isFinite(Number(couponApplied.discount))) {
            return Number(couponApplied.discount);
        }
        return 0;
    }, [couponApplied]);

    const quotePostcode = useMemo(() => {
        const candidates = [
            booking?.answers?.inputs?.postcode,
            booking?.answers?.answers?.raw?.details?.postcode,
            booking?.answers?.answers?.raw?.postcode,
        ];

        return (
            candidates.find(
                (value) => typeof value === "string" && value.trim().length > 0
            )?.trim() || ""
        );
    }, [booking]);

    useEffect(() => {
        if (!quotePostcode) return;

        setFormData((prev) => {
            if (String(prev.postcode || "").trim()) return prev;

            return {
                ...prev,
                postcode: normalizeUkPostcode(quotePostcode),
            };
        });
    }, [quotePostcode]);

    const formatMoney = (amount) => `${symbol} ${Number(amount || 0).toFixed(2)}`;

    const visibleAddOns = booking?.answers?.addOns;

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

    const selectedThermostat =
        booking?.answers?.inputs?.thermostat ||
        booking?.answers?.raw?.thermostat_type?.label ||
        "";

    const usesExistingThermostat =
        String(selectedThermostat).toLowerCase() ===
        "use existing thermostat";

    const thermostatLabel = hasSmartThermostat
        ? "Smart Thermostat"
        : usesExistingThermostat
            ? "Use Existing Thermostat"
            : "Standard Wireless Thermostat";

    const isCompatibilityDependentItem = (label = "") => {
        const normalized = String(label).toLowerCase();
        return ["shock arrestor", "scale reducer", "magnetic filter"].some(
            (term) => normalized.includes(term)
        );
    };

    const compatibilityTooltipText =
        "Installed subject to site suitability and compatibility with your existing system configuration.";

    const scrollToRef = (ref) => {
        const el = ref?.current;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof el.focus === "function") el.focus();
    };

    const syncFormDataFromRefs = () => {
        const nextValues = {
            title: titleRef.current?.value ?? formData.title,
            firstName: firstNameRef.current?.value ?? formData.firstName,
            lastName: lastNameRef.current?.value ?? formData.lastName,
            email: emailRef.current?.value ?? formData.email,
            phone: phoneRef.current?.value ?? formData.phone,
            addressLine1:
                addressLine1Ref.current?.value ?? formData.addressLine1,
            addressLine2:
                addressLine2Ref.current?.value ?? formData.addressLine2,
            city: cityRef.current?.value ?? formData.city,
            county: countyRef.current?.value ?? formData.county,
            postcode: normalizeUkPostcode(
                postcodeRef.current?.value ?? formData.postcode
            ),
        };

        const hasChanges = Object.entries(nextValues).some(
            ([key, value]) => value !== formData[key]
        );

        if (hasChanges) {
            setFormData((prev) => ({
                ...prev,
                ...nextValues,
            }));
        }

        return {
            ...formData,
            ...nextValues,
        };
    };

    const clearError = (key) => {
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    const validateAll = (source = formData) => {
        const next = {};

        // appointment
        if (!selectedDate)
            next.appointment = "Please select an installation date.";
        else if (!selectedTime)
            next.appointment = "Please select an installation time.";

        // customer fields
        if (!source.title) next.title = "Please select a title.";
        if (!source.firstName?.trim())
            next.firstName = "First name is required.";
        if (!source.lastName?.trim())
            next.lastName = "Last name is required.";

        const email = (source.email || "").trim();
        if (!email) next.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            next.email = "Please enter a valid email address.";

        const phone = (source.phone || "").trim();
        if (!phone) next.phone = "Phone number is required.";
        else {
            const digits = phone.replace(/[^\d]/g, "");
            if (digits.length < 10)
                next.phone = "Please enter a valid phone number.";
        }

        if (!source.addressLine1?.trim())
            next.addressLine1 = "Address line 1 is required.";
        if (!source.city?.trim()) next.city = "Town or city is required.";

        const formattedPostcode = normalizeUkPostcode(source.postcode);
        if (!formattedPostcode) {
            next.postcode = "Postcode is required.";
        } else if (!UK_POSTCODE_RE.test(formattedPostcode)) {
            next.postcode = "Please enter a valid UK postcode.";
        } else if (!isAllowedOutcode(formattedPostcode)) {
            next.postcode =
                "Checkout is restricted to LS, WF, HG and BD postcodes only.";
        }

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
            { key: "addressLine1", ref: addressLine1Ref },
            { key: "addressLine2", ref: addressLine2Ref },
            { key: "city", ref: cityRef },
            { key: "county", ref: countyRef },
            { key: "postcode", ref: postcodeRef },
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

    const isFormValid = useMemo(() => {
        const e = validateAll();
        return Object.keys(e).length === 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, selectedDate, selectedTime]);

    useEffect(() => {
        if (!hasAttemptedSubmit) return;

        const nextErrors = validateAll();

        setErrors((prev) => {
            const prevKeys = Object.keys(prev);
            const nextKeys = Object.keys(nextErrors);

            if (prevKeys.length === nextKeys.length) {
                const isUnchanged = prevKeys.every(
                    (key) => prev[key] === nextErrors[key]
                );

                if (isUnchanged) return prev;
            }

            return nextErrors;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAttemptedSubmit, formData, selectedDate, selectedTime]);

    const checkoutReadyKey = useMemo(() => {
        if (!selectedDate || !selectedTime) return "";
        if (!formData.title?.trim()) return "";
        if (!formData.firstName?.trim()) return "";
        if (!formData.lastName?.trim()) return "";
        if (!formData.email?.trim()) return "";
        if (!formData.phone?.trim()) return "";
        if (!formData.addressLine1?.trim()) return "";
        if (!formData.city?.trim()) return "";

        const formattedPostcode = normalizeUkPostcode(formData.postcode);
        if (!formattedPostcode) return "";
        if (!UK_POSTCODE_RE.test(formattedPostcode)) return "";
        if (!isAllowedOutcode(formattedPostcode)) return "";

        return [
            selectedDate,
            selectedTime,
            formData.title,
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.phone,
            formData.addressLine1,
            formData.addressLine2,
            formData.city,
            formData.county,
            formattedPostcode,
        ]
            .map((v) => String(v || "").trim())
            .join("|");
    }, [selectedDate, selectedTime, formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({
            ...s,
            [name]:
                name === "postcode" ? normalizeUkPostcode(value) : value,
        }));
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
            if (key === "customer.address") return "addressLine1";
            if (key === "customer.address_line1") return "addressLine1";
            if (key === "customer.address_line2") return "addressLine2";
            if (key === "customer.city") return "city";
            if (key === "customer.county") return "county";
            if (key === "customer.postcode") return "postcode";
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

    const initialisePaymentElement = async ({ showValidationToast = false } = {}) => {
        const syncedFormData = syncFormDataFromRefs();
        const nextErrors = validateAll(syncedFormData);
        if (Object.keys(nextErrors).length > 0) {
            if (showValidationToast) {
                setHasAttemptedSubmit(true);
                setErrors(nextErrors);
                const firstInvalid = fieldOrder.find((f) => nextErrors[f.key]);
                if (firstInvalid) scrollToRef(firstInvalid.ref);
                toast.error("Please complete the required fields.", {
                    duration: 4000,
                    position: "top-center",
                });
            }
            return false;
        }

        setPaymentError("");
        setProcessing(true);

        const productDetails = {
            boiler_id: booking.boiler_id,
            brand: booking.brand,
            model: booking.model,
            kw: booking.kw,
            warrantyYears: booking.warrantyYears,
            amount: quoteAmount,
            includes: booking.includes,
            images: booking.images,
        };

        if (quoteAmount <= 0) {
            setPaymentError("Invalid quote amount. Please refresh and try again.");
            toast.error("Invalid quote amount. Please refresh and try again.");
            setProcessing(false);
            return false;
        }

        const answers = booking?.answers?.answers?.raw;
        const addOns = booking?.answers?.addOns;
        const customerName = [
            syncedFormData.title,
            syncedFormData.firstName,
            syncedFormData.lastName,
        ]
            .map((value) => String(value || "").trim())
            .filter(Boolean)
            .join(" ");
        const formattedPostcode = normalizeUkPostcode(syncedFormData.postcode);
        const addressFull = buildAddressFull([
            syncedFormData.addressLine1,
            syncedFormData.addressLine2,
            syncedFormData.city,
            syncedFormData.county,
            formattedPostcode || quotePostcode,
        ]);

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
                full_name: customerName,
                email: syncedFormData.email,
                phone: syncedFormData.phone,
                postcode: formattedPostcode || quotePostcode,
                address_line1: syncedFormData.addressLine1,
                address_line2: syncedFormData.addressLine2,
                city: syncedFormData.city,
                county: syncedFormData.county,
                country: "United Kingdom",
                address_full: addressFull,
                notes: syncedFormData.notes,
            },
            product: productDetails,
        };

        try {
            const res = await axios.post(
                "/quote/checkout",
                {
                    service: "new_boiler_quote",
                    form: payload,
                    amount: quoteAmount,
                    coupon_code: couponApplied?.coupon?.code || null,
                    payment_element: true,
                },
                { timeout: 15000 }
            );

            const checkoutClientSecret =
                res?.data?.data?.checkout_client_secret;
            const checkoutMode = res?.data?.data?.checkout_mode;
            const pricing = res?.data?.data?.pricing;

            setCouponError("");
            if (pricing?.coupon) {
                setCouponApplied(pricing);
            } else {
                setCouponApplied(null);
            }

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
                setTimeout(() => {
                    paymentSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
                return true;
            }

            throw new Error("Unable to initialise secure payment form.");
        } catch (err) {
            const status = err?.response?.status;

            if (status === 422) {
                const backendErrors = err?.response?.data?.errors;
                const firstBackendError = Object.values(backendErrors || {})
                    .flat()
                    .find(Boolean);
                const couponMsg = backendErrors?.coupon_code?.[0];
                if (couponMsg) {
                    setCouponError(couponMsg);
                    setCouponApplied(null);
                }
                if (firstBackendError) {
                    setPaymentError(String(firstBackendError));
                }
                if (showValidationToast) {
                    showValidationErrors(backendErrors);
                    hydrateInlineErrorsFromBackend(backendErrors);
                }
            } else if (status >= 500) {
                setPaymentError(
                    "Payment service is temporarily unavailable. Please try again shortly."
                );
                toast.error(
                    "Payment service is temporarily unavailable. Please try again shortly.",
                    {
                        duration: 5000,
                        position: "top-center",
                    }
                );
            } else if (err?.code === "ECONNABORTED") {
                setPaymentError(
                    "Request timed out. Please check your connection and try again."
                );
                toast.error(
                    "Request timed out. Please check your connection and try again.",
                    {
                        duration: 5000,
                        position: "top-center",
                    }
                );
            } else if (showValidationToast) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to initiate payment. Please try again.";
                setPaymentError(message);
                toast.error(message, {
                    duration: 5000,
                    position: "top-center",
                });
            }

            if (mounted.current) setProcessing(false);
            return false;
        }
    };

    // Intentionally no automatic payment initialisation here.
    // We only initialise when user explicitly clicks Continue / Apply coupon,
    // to avoid creating duplicate pending bookings and slot re-locking.

    const handlePayAndBook = async () => {
        if (processing) return;

        setHasAttemptedSubmit(true);

        if (!acceptedTerms) {
            setTermsError(
                "Please confirm you agree to the Terms & Conditions before continuing."
            );
            toast.error("Please agree to the Terms & Conditions to continue.", {
                duration: 4000,
                position: "top-center",
            });
            scrollToRef(termsRef);
            return;
        }

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
                    "Unable to complete payment. Please try again.";
                toast.error(message, { duration: 5000, position: "top-center" });
            }

            if (mounted.current) setProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (processing || applyingCoupon) return;

        setCouponError("");
        setPaymentError("");
        setApplyingCoupon(true);

        try {
            const code = couponCode.trim() || null;

            if (paymentClientSecret && paymentBookingId && paymentTxId) {
                const res = await axios.post(
                    "/quote/checkout/coupon-update",
                    {
                        booking_id: paymentBookingId,
                        tx_id: paymentTxId,
                        coupon_code: code,
                    },
                    { timeout: 15000 }
                );

                const pricing = res?.data?.data?.pricing || null;
                setCouponApplied(pricing);
                toast.success(code ? "Coupon applied." : "Coupon removed.");
                return;
            }

            const preview = await axios.post(
                "/quote/checkout/coupon-preview",
                {
                    service: "new_boiler_quote",
                    amount: quoteAmount,
                    coupon_code: code,
                },
                { timeout: 15000 }
            );

            const pricing = preview?.data?.data || null;
            setCouponApplied(pricing);
            if (code) {
                toast.success("Coupon applied.");
            } else {
                toast.success("Coupon cleared.");
            }
        } catch (err) {
            const couponMsg = err?.response?.data?.errors?.coupon_code?.[0];
            if (couponMsg) {
                setCouponError(couponMsg);
                return;
            }

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to apply coupon right now.";
            toast.error(message, { duration: 4500, position: "top-center" });
        } finally {
            setApplyingCoupon(false);
        }
    };

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
                <PageHeader />

            <div className="min-h-screen bg-white quote-page-bg">
                <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 pb-28 lg:pb-10">
                    <div className="flex items-end gap-6 mb-10">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="group flex w-fit items-center gap-2 text-[13px] cursor-pointer font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-900"
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
                            Back
                        </button>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Checkout
                            </p>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight whitespace-nowrap">
                                Finalise booking
                            </h2>
                        </div>
                    </div>

                    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Selected boiler package
                                </p>
                                <h3 className="mt-1 text-lg md:text-xl font-bold text-slate-900">
                                    {booking?.brand} {booking?.model}
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                        {booking?.kw}kW
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                        {booking?.warrantyYears} year warranty
                                    </span>
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                                        Installation included
                                    </span>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
                                <div className="text-2xl font-bold text-slate-900">
                                    {formatMoney(payableAmount)}
                                </div>
                                {discountAmount > 0 && (
                                    <p className="text-[11px] text-emerald-700 font-semibold">
                                        Coupon saved {formatMoney(discountAmount)}
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-500">inc VAT</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Google Reviews</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Rated Excellent by local customers</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/images/gas%20safe%20logo%20mega.png"
                                    alt="Gas Safe Register"
                                    className="h-5 w-auto object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/511-5113277-gas-safe-register-logo-symbol-gas-safe-logo.png";
                                    }}
                                />
                                <p className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold">Gas Safe</p>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-emerald-900">Registered business: 636354</p>
                        </div>
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                            <p className="text-[11px] uppercase tracking-wider text-sky-800 font-semibold">Secure payment</p>
                            <p className="mt-1 text-sm font-semibold text-sky-900">Card payments accepted online</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* STEP 1: Appointment */}
                            <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">

                                <div className="flex flex-col gap-2 border-b border-slate-100 p-5 md:p-7 lg:p-8">
                                    <div className="flex-1 flex gap-2 items-center justify-between">
                                        <div>
                                            <h2 className="text-lg lg:text-2xl font-semibold text-slate-900">
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
                            <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-500">

                                <div className="relative border-b border-slate-200/70 px-6 md:px-8 py-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
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
                                            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
                                                <FiShield className="h-3.5 w-3.5" />
                                                Your details are used only to arrange your installation and confirmation.
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
                                        <div className="group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                                            <div className="flex gap-6">
                                                <div className="flex-grow">
                                                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary">
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
                                        <div className="group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                                            <div className="flex gap-6">
                                                <div className="flex-grow pt-1.5">
                                                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary">
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
                                        <div className="group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                                            <div className="flex gap-6">
                                                <div className="flex-grow pt-1.5">
                                                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary">
                                                        Where are we installing?
                                                    </h3>

                                                    <div className="space-y-5">
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1 md:col-span-2">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Address line 1
                                                                </label>
                                                                <div className="relative group/input">
                                                                    <input
                                                                        ref={addressLine1Ref}
                                                                        name="addressLine1"
                                                                        placeholder="House number/name and street"
                                                                        value={
                                                                            formData.addressLine1
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                        autoComplete="address-line1"
                                                                        className={`w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.addressLine1
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
                                                                                strokeWidth={1.5}
                                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                            />
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={1.5}
                                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                {errors.addressLine1 && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.addressLine1
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1 md:col-span-2">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Address line 2 <span className="font-normal text-slate-400 ml-1 opacity-70">(Optional)</span>
                                                                </label>
                                                                <input
                                                                    ref={addressLine2Ref}
                                                                    name="addressLine2"
                                                                    placeholder="Apartment, building, or area"
                                                                    value={
                                                                        formData.addressLine2
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    autoComplete="address-line2"
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.addressLine2
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.addressLine2 && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.addressLine2
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Town / city
                                                                </label>
                                                                <input
                                                                    ref={cityRef}
                                                                    name="city"
                                                                    placeholder="e.g. Leeds"
                                                                    value={
                                                                        formData.city
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    autoComplete="address-level2"
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.city
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.city && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.city
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    County <span className="font-normal text-slate-400 ml-1 opacity-70">(Optional)</span>
                                                                </label>
                                                                <input
                                                                    ref={countyRef}
                                                                    name="county"
                                                                    placeholder="e.g. West Yorkshire"
                                                                    value={
                                                                        formData.county
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    autoComplete="address-level1"
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.county
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.county && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.county
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="relative transition-all duration-300 focus-within:-translate-y-1 md:max-w-sm">
                                                                <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                    Postcode
                                                                </label>
                                                                <input
                                                                    ref={postcodeRef}
                                                                    name="postcode"
                                                                    placeholder="e.g. LS1 1AA"
                                                                    value={
                                                                        formData.postcode
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    autoComplete="postal-code"
                                                                    className={`w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold uppercase text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.postcode
                                                                            ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10"
                                                                            : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"
                                                                        }`}
                                                                />
                                                                {errors.postcode && (
                                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                                        {
                                                                            errors.postcode
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="-mt-1 text-xs text-slate-500">
                                                            Checkout is restricted to LS, WF, HG and BD postcodes only.
                                                        </p>

                                                        <div className="relative transition-all duration-300 focus-within:-translate-y-1">
                                                            <label className="mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1">
                                                                Access & parking notes{" "}
                                                                <span className="font-normal text-slate-400 ml-1 opacity-70">(Optional)</span>
                                                            </label>
                                                            <textarea
                                                                name="notes"
                                                                rows={3}
                                                                placeholder="Tell us about parking, gate access, alarms, mobility requirements, or anything else we should know."
                                                                value={formData.notes}
                                                                onChange={handleInputChange}
                                                                className="w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10 focus:outline-none resize-none"
                                                            />
                                                        </div>

                                                        <div data-pet-policy-wrap="true" className="relative inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 group/pet-policy">
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
                                                            <span className="font-semibold text-slate-800">
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
                                                                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-primary hover:text-primary"
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
                            <aside className="sticky top-6">
                                <div className="rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                                    <div className="bg-slate-50 p-6 border-b border-slate-200 text-center rounded-t-3xl space-y-1">
                                        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                            Installation Summary
                                        </h2>
                                        <div>
                                            <span className="text-5xl font-bold tracking-tight text-slate-900">
                                                {formatMoney(payableAmount)}
                                            </span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                                                Coupon discount: {formatMoney(discountAmount)}
                                            </p>
                                        )}
                                        <p className="text-[11px] uppercase tracking-wider text-slate-500">Instant price • inc VAT</p>
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
                                                    <ul className="space-y-2">
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
                                                                    className="relative flex justify-between items-center font-medium text-dark opacity-0 included-animation"
                                                                    style={{
                                                                        animationDelay: `${i *
                                                                            40
                                                                            }ms`,
                                                                    }}
                                                                >
                                                                    <span className="max-w-[90%] text-[15px] inline-flex items-center gap-1.5">
                                                                        <span>
                                                                            {item}
                                                                        </span>
                                                                        {isCompatibilityDependentItem(
                                                                            item
                                                                        ) && (
                                                                            <span
                                                                                data-install-compat-wrap="true"
                                                                                className="relative inline-flex items-center group/compat"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    aria-label={compatibilityTooltipText}
                                                                                    onClick={() =>
                                                                                        setOpenInstallCompatibilityTip(
                                                                                            openInstallCompatibilityTip ===
                                                                                                i
                                                                                                ? null
                                                                                                : i
                                                                                        )
                                                                                    }
                                                                                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500"
                                                                                >
                                                                                    <FiInfo className="h-3 w-3" />
                                                                                </button>
                                                                                <div
                                                                                    className={`quote-solid-popover absolute left-0 top-[calc(100%+0.3rem)] z-40 w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-lg translate-y-1 transition-all duration-200 ${
                                                                                        openInstallCompatibilityTip ===
                                                                                        i
                                                                                            ? "pointer-events-auto opacity-100 translate-y-0"
                                                                                            : "pointer-events-none opacity-0 group-hover/compat:pointer-events-auto group-hover/compat:opacity-100 group-hover/compat:translate-y-0 group-focus-within/compat:pointer-events-auto group-focus-within/compat:opacity-100 group-focus-within/compat:translate-y-0"
                                                                                    }`}
                                                                                >
                                                                                    {compatibilityTooltipText}
                                                                                </div>
                                                                            </span>
                                                                        )}
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
                                        <div className="bg-slate-50 -mx-6 -mb-6 p-6 pb-10 mt-6 border-t border-slate-200 text-slate-900">
                                            <div className="mb-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                                                <div data-cancel-policy-wrap="true" className="relative inline-flex items-center gap-1.5 text-xs text-slate-600 group/cancel-policy">
                                                    <span className="font-semibold text-slate-800">
                                                        Cancellation policy
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenCancellationTooltip(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-primary hover:text-primary"
                                                        aria-label="Show cancellation policy"
                                                    >
                                                        <FiInfo className="h-3.5 w-3.5" />
                                                    </button>

                                                    <div
                                                        className={`quote-solid-popover absolute left-0 top-7 z-20 w-[290px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${
                                                            openCancellationTooltip
                                                                ? "pointer-events-auto opacity-100 translate-y-0"
                                                                : "pointer-events-none opacity-0 group-hover/cancel-policy:pointer-events-auto group-hover/cancel-policy:opacity-100 group-hover/cancel-policy:translate-y-0 group-focus-within/cancel-policy:pointer-events-auto group-focus-within/cancel-policy:opacity-100 group-focus-within/cancel-policy:translate-y-0"
                                                        }`}
                                                    >
                                                        <p>
                                                            You can cancel for a full refund up to 24 hours before your booking.
                                                        </p>
                                                        <p className="mt-1.5">
                                                            Cancellations made with less than 24 hours’ notice may be chargeable, including where materials have already been ordered or engineer time has been allocated.
                                                        </p>
                                                        <p className="mt-2 text-slate-500">
                                                            This does not affect your statutory rights. Full terms:
                                                            <a
                                                                href="/terms-conditions"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-1 font-semibold text-primary underline underline-offset-2"
                                                            >
                                                                view full terms
                                                            </a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                ref={termsRef}
                                                className={`mb-4 rounded-xl border p-3 ${
                                                    termsError
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-slate-200 bg-white"
                                                }`}
                                            >
                                                <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                                        Have a coupon code?
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) => {
                                                                setCouponCode(e.target.value.toUpperCase());
                                                                setCouponError("");
                                                                setCouponApplied(null);
                                                            }}
                                                            placeholder="Enter code"
                                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm uppercase"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleApplyCoupon}
                                                            disabled={processing || applyingCoupon}
                                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                                                        >
                                                            {applyingCoupon ? "Applying..." : "Apply"}
                                                        </button>
                                                    </div>

                                                    {couponApplied?.coupon?.code && (
                                                        <p className="mt-2 text-xs font-semibold text-emerald-700">
                                                            Applied {couponApplied.coupon.code} • -{formatMoney(discountAmount)}
                                                        </p>
                                                    )}

                                                    {couponError && (
                                                        <p className="mt-2 text-xs font-semibold text-red-600">
                                                            {couponError}
                                                        </p>
                                                    )}
                                                </div>

                                                <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={acceptedTerms}
                                                        onChange={(e) => {
                                                            setAcceptedTerms(
                                                                e.target.checked
                                                            );
                                                            setTermsError("");
                                                        }}
                                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 bg-white text-primary focus:ring-primary"
                                                    />
                                                    <span>
                                                        I confirm that I have read and agree to the{" "}
                                                        <a
                                                            href="/terms-conditions"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold underline underline-offset-2"
                                                        >
                                                            Terms & Conditions
                                                        </a>{" "}
                                                        and{" "}
                                                        <a
                                                            href="/privacy-policy"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold underline underline-offset-2"
                                                        >
                                                            Privacy Policy
                                                        </a>
                                                        , including any advertised{" "}
                                                        <a
                                                            href="/terms-conditions#next-day"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-semibold underline underline-offset-2"
                                                        >
                                                            next-day installation terms
                                                        </a>
                                                        .
                                                    </span>
                                                </label>
                                                {termsError && (
                                                    <p className="mt-2 text-xs font-semibold text-red-600">
                                                        {termsError}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handlePayAndBook}
                                                disabled={processing}
                                                aria-busy={processing}
                                                className={[
                                                    "w-full py-4 text-sm font-bold rounded-xl uppercase tracking-wide border transition-all flex items-center justify-center gap-2",
                                                    processing
                                                        ? "bg-gray-400 border-gray-400 cursor-not-allowed text-white"
                                                        : paymentClientSecret &&
                                                            !acceptedTerms
                                                          ? "bg-primary border-primary text-white opacity-70 cursor-not-allowed"
                                                          : "bg-primary border-primary text-white hover:opacity-95",
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
                                                        {paymentClientSecret
                                                            ? "Confirm & Book Installation"
                                                            : "Continue to secure payment"}
                                                    </>
                                                )}
                                            </button>

                                            {paymentClientSecret && (
                                                <div
                                                    ref={paymentSectionRef}
                                                    className="mt-4 rounded-2xl border border-slate-200 bg-white p-3"
                                                >
                                                    <div ref={paymentElementContainerRef} />
                                                </div>
                                            )}

                                            {paymentError && (
                                                <p className="mt-3 text-center text-xs font-semibold text-red-600">
                                                    {paymentError}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                                                <span className="rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm">
                                                    Visa
                                                </span>
                                                <span className="rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm">
                                                    Mastercard
                                                </span>
                                                <span className="rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm">
                                                    Klarna
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
                <div className="mx-auto max-w-7xl flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                            Total package
                        </p>
                        <p className="text-lg font-bold text-slate-900 truncate">
                            {formatMoney(payableAmount)}
                        </p>
                        {discountAmount > 0 && (
                            <p className="text-[11px] font-semibold text-emerald-700">
                                Coupon: -{formatMoney(discountAmount)}
                            </p>
                        )}
                        <label className="mt-1 inline-flex items-center gap-2 text-[11px] text-slate-600">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => {
                                    setAcceptedTerms(e.target.checked);
                                    setTermsError("");
                                }}
                                className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            Agree to terms
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={handlePayAndBook}
                        disabled={processing}
                        aria-busy={processing}
                        className={[
                            "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                            processing
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : paymentClientSecret && !acceptedTerms
                                  ? "bg-primary text-white opacity-70 cursor-not-allowed"
                                  : "bg-primary text-white",
                        ].join(" ")}
                    >
                        {processing
                            ? "Processing…"
                            : paymentClientSecret
                            ? "Confirm payment"
                            : "Secure payment"}
                    </button>
                </div>
            </div>
            <GoogleReview />
            </BlueQuoteSkin>
        </>
    );
}
