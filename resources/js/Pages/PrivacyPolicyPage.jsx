import { Footer } from "@/Components/boiler/footer";
import Header from "@/Components/boiler/header";
import { Head, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

// --- Configuration ---
const SECTIONS = [
    { id: "overview", title: "Overview" },
    { id: "who-we-are", title: "1. Who we are" },
    { id: "contacting-us", title: "2. Contacting us" },
    { id: "what-we-collect", title: "3. What information we collect" },
    { id: "how-we-use", title: "4. How we use your information" },
    { id: "sharing", title: "5. Information sharing" },
    { id: "security", title: "6. Data security" },
    { id: "retention", title: "7. Data retention" },
    { id: "rights", title: "8. Your rights" },
    { id: "cookies", title: "9. Cookies" },
    { id: "children", title: "10. Children" },
    { id: "third-party", title: "11. Third-party services" },
    { id: "changes", title: "12. Changes to this policy" },
    { id: "contact", title: "Contact us" },
];

// Helper function to extract ID from URL hash
const getActiveIdFromHash = () => {
    if (typeof window !== "undefined" && window.location.hash) {
        return window.location.hash.substring(1);
    }
    return null;
};

export default function PrivacyPolicyPage() {
    const { props } = usePage();
    const pageTitle = props.pageTitle ?? "Privacy Policy";
    const lastUpdated = "28 January 2026";

    const [activeSectionId, setActiveSectionId] = useState(
        getActiveIdFromHash()
    );

    useEffect(() => {
        const handleHashChange = () => {
            setActiveSectionId(getActiveIdFromHash());
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <>
            <Head title={pageTitle} />

            <div className="min-h-screen w-full bg-white text-gray-900 rounded-b-3xl">
                <Header title={pageTitle} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-16 pt-28 md:pt-32">
                    {/* Header */}
                    <div className="mb-8 md:mb-16 mt-6 flex flex-col items-center justify-center md:flex-row md:justify-between md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tighter text-center md:text-left">
                                Data <span className="text-primary">Trust</span>{" "}
                                Policy
                            </h1>
                            <p className="mt-3 text-lg sm:text-xl w-full max-w-84 text-gray-700 font-light text-center md:text-left">
                                Everything you need to know about your personal
                                data security.
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-400">
                                Last updated:
                                <br className="md:flex" />
                                <span className="font-medium">
                                    {lastUpdated}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Two-Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-4">
                        {/* Sidebar */}
                        {/* -------------------- Navigation -------------------- */}
                        <nav
                            aria-label="Table of contents"
                            className="md:col-span-1"
                        >
                            {/* -------- MOBILE: Horizontal Pills -------- */}
                            <div className="md:hidden mb-4">
                                <div className="relative">
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-2">
                                        {SECTIONS.map((s) => {
                                            const isActive =
                                                s.id === activeSectionId;
                                            return (
                                                <a
                                                    key={s.id}
                                                    href={`#${s.id}`}
                                                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
                                ${
                                    isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : "bg-light-grey/80 text-dark hover:bg-light-grey"
                                }`}
                                                >
                                                    {s.title}
                                                </a>
                                            );
                                        })}
                                    </div>

                                    {/* subtle fade edges */}
                                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
                                </div>
                            </div>

                            {/* -------- DESKTOP: Sidebar (UNCHANGED) -------- */}
                            <div className="hidden md:block md:sticky md:top-10 self-start">
                                <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 shadow-md md:max-h-[calc(100vh-4rem)] md:overflow-y-auto">
                                    <h2 className="text-base font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
                                        Navigation
                                    </h2>
                                    <ul className="space-y-2 text-base">
                                        {SECTIONS.map((s) => {
                                            const isActive =
                                                s.id === activeSectionId;
                                            return (
                                                <li key={s.id}>
                                                    <a
                                                        href={`#${s.id}`}
                                                        className={`block px-3 py-1.5 transition-all border-l-4
                                    ${
                                        isActive
                                            ? "border-primary text-primary font-bold"
                                            : "border-transparent text-gray-600 hover:text-primary hover:border-secondary/70"
                                    }`}
                                                    >
                                                        {s.title}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        {/* Content */}
                        <article className="md:col-span-3 space-y-8 md:space-y-12 md:border-l md:border-gray-200 md:pl-8">
                            <PolicyTimelineSection
                                id="overview"
                                title="Overview"
                                isActive={activeSectionId === "overview"}
                            >
                                <p>
                                    Our priority at <strong>MD Gas</strong> is
                                    keeping your data secure and treating it
                                    with respect. We handle your data fairly and
                                    lawfully at all times. This statement
                                    explains how we collect, use and store
                                    personal data and outlines your rights
                                    under UK GDPR.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="who-we-are"
                                title="1. Who we are"
                                isActive={activeSectionId === "who-we-are"}
                            >
                                <p>
                                    MD Gas is the data controller. We comply
                                    with the UK Data Protection Act 2018 and UK
                                    GDPR.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="contacting-us"
                                title="2. Contacting us"
                                isActive={activeSectionId === "contacting-us"}
                            >
                                <p>
                                    You can reach us via the details in the
                                    **Contact us** section at the bottom of this
                                    policy.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="what-we-collect"
                                title="3. What information we collect"
                                isActive={activeSectionId === "what-we-collect"}
                            >
                                <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                    <li>
                                        <strong className="text-primary">
                                            Personal data:
                                        </strong>{" "}
                                        Name, address, email, and phone.
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Vulnerability info:
                                        </strong>{" "}
                                        Any information you choose to share so
                                        we can accommodate your service safely.
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Financial info:
                                        </strong>{" "}
                                        Payment details and finance application
                                        status (when using third‑party finance).
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Property info:
                                        </strong>{" "}
                                        Property details and heating system
                                        information needed to provide a quote.
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Communications:
                                        </strong>{" "}
                                        Messages and chat history for support
                                        and service delivery.
                                    </li>
                                </ul>
                                <p className="mt-4 border-l-4 border-gray-200 pl-4 text-sm text-gray-500 italic">
                                    We do not store complete credit card
                                    details; they are processed securely by a
                                    PCI DSS compliant third-party payment
                                    provider.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="how-we-use"
                                title="4. How we use your information"
                                isActive={activeSectionId === "how-we-use"}
                            >
                                <p className="text-base text-gray-700">
                                    We use data to deliver requested services
                                    (installation/repair), provide accurate
                                    quotes, manage orders, register products for
                                    warranty, process secure payments, improve
                                    services, and send marketing only where
                                    consent has been given.
                                </p>
                                <div className="mt-4 border-l-4 border-secondary bg-secondary/5 p-4 text-base text-primary rounded-r-lg">
                                    <strong>Legal Basis:</strong> Our primary
                                    legal basis for processing is the
                                    performance of a contract and legitimate
                                    interests.
                                </div>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="sharing"
                                title="5. Information sharing"
                                isActive={activeSectionId === "sharing"}
                            >
                                <p>
                                    We do not sell or rent your data. Sharing
                                    occurs only with trusted providers strictly
                                    as required to fulfil services or legal
                                    duties.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="security"
                                title="6. Data security"
                                isActive={activeSectionId === "security"}
                            >
                                <p>
                                    We maintain robust technical and
                                    organisational security measures including
                                    encryption, access controls, and staff
                                    training.
                                </p>
                                <div className="mt-4 border-l-4 border-yellow-500 bg-yellow-50 p-4 text-base text-yellow-800 rounded-r-lg">
                                    <strong>Security Note:</strong> If you
                                    suspect a security issue, contact our DPO
                                    immediately.
                                </div>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="retention"
                                title="7. Data retention"
                                isActive={activeSectionId === "retention"}
                            >
                                <p>Data is only kept as long as necessary.</p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>
                                        <strong className="text-primary">
                                            Service records:
                                        </strong>{" "}
                                        up to 6 years.
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Financial records:
                                        </strong>{" "}
                                        up to 7 years.
                                    </li>
                                    <li>
                                        <strong className="text-primary">
                                            Usage data:
                                        </strong>{" "}
                                        12–24 months.
                                    </li>
                                </ul>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="rights"
                                title="8. Your rights"
                                isActive={activeSectionId === "rights"}
                            >
                                <p>
                                    Under GDPR, you have rights to access,
                                    correct, erase, restrict, port, and object
                                    to processing of your data.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="cookies"
                                title="9. Cookies"
                                isActive={activeSectionId === "cookies"}
                            >
                                <p>
                                    We use cookies for functionality and basic
                                    analytics. You can control cookies through
                                    your browser settings.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="children"
                                title="10. Children"
                                isActive={activeSectionId === "children"}
                            >
                                <p>
                                    Our services are not designed for children
                                    under 16.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="third-party"
                                title="11. Third-party services"
                                isActive={activeSectionId === "third-party"}
                            >
                                <p>
                                    We are not responsible for third‑party
                                    privacy practices.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="changes"
                                title="12. Changes to this policy"
                                isActive={activeSectionId === "changes"}
                            >
                                <p>
                                    This policy is reviewed annually or as
                                    required by law.
                                </p>
                            </PolicyTimelineSection>

                            <PolicyTimelineSection
                                id="contact"
                                title="Contact us"
                                isContact
                                isActive={activeSectionId === "contact"}
                            >
                                <div className="mt-4 p-5 rounded-lg border border-primary/60 bg-primary/5 space-y-3">
                                    <p>
                                        <strong>Contact:</strong> WhatsApp chat
                                        or request an engineer callback.
                                    </p>
                                    <p>
                                        <strong>Email:</strong> info@mdgasleeds.co.uk
                                    </p>
                                </div>
                            </PolicyTimelineSection>
                        </article>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}

const PolicyTimelineSection = ({
    id,
    title,
    children,
    isContact = false,
    isActive = false,
}) => (
    <section id={id} className="relative">
        {/* Timeline dot – desktop only */}
        <div
            className={`hidden md:block absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 ${
                isActive
                    ? "bg-primary border-secondary/60"
                    : "bg-white border-gray-300"
            }`}
        />

        <h3
            className={`text-xl sm:text-2xl font-extrabold mb-4 ${
                isContact || isActive ? "text-primary" : "text-gray-900"
            }`}
        >
            {title}
        </h3>

        <div className="space-y-4 text-base text-gray-700 leading-relaxed">
            {children}
        </div>
    </section>
);
