// TermsConditionsPage.jsx
import { Footer } from "@/Components/boiler/footer";
import Header from "@/Components/boiler/header";
import { Head, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

// Sections
const SECTIONS = [
    { id: "agreement", title: "1. Agreement to Terms" },
    { id: "services", title: "2. Services" },
    { id: "bookings", title: "3. Bookings & Appointments" },
    { id: "pricing", title: "4. Pricing & Payment" },
    { id: "warranties", title: "5. Warranties & Guarantees" },
    { id: "liability", title: "6. Liability" },
    { id: "safety", title: "7. Safety Requirements" },
    { id: "complaints", title: "8. Complaints" },
    { id: "changes", title: "9. Changes to Terms" },
    { id: "next-day", title: "10. Next-Day Installation Terms" },
    { id: "contact", title: "11. Contact Information" },
];

const getActiveIdFromHash = () => {
    if (typeof window !== "undefined" && window.location.hash) {
        return window.location.hash.substring(1);
    }
    return null;
};

export default function TermsConditionsPage() {
    const { props } = usePage();
    const pageTitle = props.pageTitle ?? "Terms & Conditions";
    const lastUpdated = "28 January 2026";

    const [activeSectionId, setActiveSectionId] = useState(
        getActiveIdFromHash()
    );

    useEffect(() => {
        const handleHashChange = () => {
            setActiveSectionId(getActiveIdFromHash());
        };
        window.addEventListener("hashchange", handleHashChange);
        setActiveSectionId(getActiveIdFromHash());

        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <>
            <Head title={pageTitle} />

            <div className="min-h-screen w-full bg-white text-gray-900 rounded-b-3xl">
                <Header title={pageTitle} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-16 pt-28">
                    {/* Page Header */}
                    <div className="mb-8 md:mb-16 mt-6 flex flex-col items-center justify-center md:flex-row md:justify-between md:items-center">
                        <div className="">
                            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tighter text-center md:text-left">
                                Terms &{" "}
                                <span className="text-primary">Conditions</span>
                            </h1>
                            <p className="mt-3 text-lg sm:text-xl w-full max-w-84 text-gray-700 font-light text-center md:text-left">
                                The terms that govern your use of MD Gas
                                services.
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="mt-3 text-sm text-gray-400">
                                Last updated: <br className="md:flex" />
                                <span className="font-medium">
                                    {lastUpdated}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* ================= MOBILE: HORIZONTAL PILLS (NOT STICKY) ================= */}
                    <div className="md:hidden mb-10">
                        <div className="relative">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-2">
                                {SECTIONS.map((s) => {
                                    const isActive = s.id === activeSectionId;
                                    return (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
                                                ${isActive
                                                    ? "bg-primary text-white shadow-sm"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {s.title}
                                        </a>
                                    );
                                })}
                            </div>

                            {/* fade edges */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
                        </div>
                    </div>
                    {/* ================= END MOBILE PILLS ================= */}

                    {/* Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* ================= DESKTOP SIDEBAR ================= */}
                        <nav
                            aria-label="Table of contents"
                            className="hidden md:block md:col-span-1 md:sticky md:top-10 self-start"
                        >
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 shadow-md max-h-[calc(100vh-4rem)] overflow-y-auto">
                                <h2 className="text-base font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200">
                                    Contents
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
                                                        ${isActive
                                                            ? "border-primary text-primary font-semibold"
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
                        </nav>

                        {/* ================= CONTENT ================= */}
                        <article className="md:col-span-3 space-y-12 md:border-l md:border-gray-200 md:pl-8">
                            <TermsSection
                                id="agreement"
                                title="1. Agreement to Terms"
                                isActive={activeSectionId === "agreement"}
                            >
                                <p>
                                    By accessing or using the services provided
                                    by MD Gas ("Company", "we", "our", or "us"),
                                    you agree to be bound by these Terms &
                                    Conditions.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="services"
                                title="2. Services"
                                isActive={activeSectionId === "services"}
                            >
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>Boiler Repairs:</strong> Fixed
                                        labour rates with parts priced separately
                                        where required.
                                    </li>
                                    <li>
                                        <strong>Servicing:</strong> Annual
                                        servicing with clear fixed pricing.
                                    </li>
                                    <li>
                                        <strong>Installations:</strong> Fixed‑price
                                        online quotes and packages.
                                    </li>
                                    <li>
                                        <strong>Power Flush:</strong> Price
                                        based on radiator count and system size.
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection
                                id="bookings"
                                title="3. Bookings & Appointments"
                                isActive={activeSectionId === "bookings"}
                            >
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Provide accurate booking details.</li>
                                    <li>An adult must be present.</li>
                                    <li>Ensure safe access.</li>
                                    <li>Please give notice if you need to reschedule.</li>
                                </ul>
                            </TermsSection>

                            <TermsSection
                                id="pricing"
                                title="4. Pricing & Payment"
                                isActive={activeSectionId === "pricing"}
                            >
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>All prices include VAT.</li>
                                    <li>Labour fixed, parts extra where required.</li>
                                    <li>Payment is taken upfront.</li>
                                    <li>We accept card payments and Klarna.</li>
                                </ul>
                            </TermsSection>

                            <TermsSection
                                id="warranties"
                                title="5. Warranties & Guarantees"
                                isActive={activeSectionId === "warranties"}
                            >
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>12-month workmanship guarantee.</li>
                                    <li>Manufacturer warranties apply.</li>
                                </ul>
                            </TermsSection>

                            <TermsSection
                                id="liability"
                                title="6. Liability"
                                isActive={activeSectionId === "liability"}
                            >
                                <p>
                                    Liability is limited to the cost of the
                                    service provided and excludes pre‑existing
                                    faults.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="safety"
                                title="7. Safety Requirements"
                                isActive={activeSectionId === "safety"}
                            >
                                <p>
                                    All work complies with Gas Safe regulations.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="complaints"
                                title="8. Complaints"
                                isActive={activeSectionId === "complaints"}
                            >
                                <p>
                                    Contact us as soon as possible if you are
                                    unhappy with a service and we will work to
                                    put it right.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="changes"
                                title="9. Changes to Terms"
                                isActive={activeSectionId === "changes"}
                            >
                                <p>Terms may be updated at any time.</p>
                            </TermsSection>

                            <TermsSection
                                id="next-day"
                                title="10. Next-Day Installation Terms"
                                isActive={activeSectionId === "next-day"}
                            >
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Next-day installation refers to the next
                                        available appointment window, not a
                                        guaranteed time slot.
                                    </li>
                                    <li>
                                        Applies to eligible, in-stock products
                                        ordered and paid before 3:00pm Monday to
                                        Friday.
                                    </li>
                                    <li>
                                        Subject to final technical review,
                                        engineer and supplier availability,
                                        service-area coverage, and safe site
                                        access.
                                    </li>
                                    <li>
                                        Excludes bank holidays, weekends,
                                        special-order materials, and complex
                                        upgrade or remedial works.
                                    </li>
                                    <li>
                                        We may reschedule where required for
                                        safety, compliance, access, weather, or
                                        third-party delays.
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection
                                id="contact"
                                title="11. Contact Information"
                                isActive={activeSectionId === "contact"}
                                isContact
                            >
                                <div className="mt-4 p-5 rounded-lg border border-primary/60 bg-primary-5 space-y-3">
                                    <p>Contact: WhatsApp chat or request a callback.</p>
                                    <p>Email: info@mdgasleeds.co.uk</p>
                                    <p>Service area: Leeds & Surrounding.</p>
                                </div>
                            </TermsSection>
                        </article>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}

const TermsSection = ({
    id,
    title,
    children,
    isContact = false,
    isActive = false,
}) => (
    <section id={id} className="relative">
        {/* Timeline dot – desktop only */}
        <div
            className={`hidden md:block absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 ${isActive
                    ? "bg-primary border-secondary/60"
                    : "bg-white border-light-grey"
                }`}
        />
        <h3
            className={`text-xl sm:text-2xl font-extrabold mb-4 ${isContact || isActive ? "text-primary" : "text-gray-900"
                }`}
        >
            {title}
        </h3>
        <div className="space-y-4 text-base text-gray-700 leading-relaxed">
            {children}
        </div>
    </section>
);
