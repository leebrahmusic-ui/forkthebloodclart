import { Head, Link, usePage } from "@inertiajs/react";
import Header from "@/Components/boiler/header";
import { Button } from "@/Components/ui/button";
import { Shield, Users, Clock, CheckCircle2 } from "lucide-react";
import React from "react";
import { Footer } from "@/Components/boiler/footer";

const VALUES = [
    {
        icon: Shield,
        title: "Gas Safe, insured",
        description:
            "Gas Safe Register 636354. Fully certified and insured for every install and repair.",
    },
    {
        icon: Users,
        title: "Local Leeds engineers",
        description:
            "We only cover Leeds & Surrounding areas, so response times stay fast and personal.",
    },
    {
        icon: CheckCircle2,
        title: "Fixed‑price quotes",
        description:
            "Clear online pricing with no sales visits or surprise add‑ons.",
    },
    {
        icon: Clock,
        title: "Faster installs",
        description:
            "Book this week. Next‑day installs available when ordered before 4pm.",
    },
];

const STATS = [
    { label: "Years serving Leeds", value: "8+" },
    { label: "Local jobs completed", value: "2,000+" },
    { label: "Boilers installed", value: "850+" },
    { label: "Support available", value: "24/7" },
];

const SERVICES = [
    {
        title: "New boiler installs",
        description:
            "Fixed‑price packages with tidy installs and clear handover.",
    },
    {
        title: "Boiler repairs",
        description:
            "Fast diagnosis, upfront labour rates, parts priced fairly.",
    },
    {
        title: "Boiler servicing",
        description:
            "Annual safety checks to keep your boiler efficient and protected.",
    },
    {
        title: "Power flushes",
        description:
            "Restore heat, improve flow, and protect new boilers long‑term.",
    },
];

export default function AboutPage() {
    const { props } = usePage();
    const pageTitle = props.pageTitle ?? "About";

    return (
        <>
            <Head title={pageTitle} />

            <div className="min-h-screen rounded-b-3xl bg-slate-50 text-slate-900">
                <Header title={pageTitle} />

                <main className="w-full">
                    {/* HERO */}
                    <section className="relative pt-40 pb-16 px-4 sm:px-6 lg:px-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40" />
                        <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
                        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                                <div className="space-y-7">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                        About MD Gas
                                    </span>

                                    <div className="space-y-3">
                                        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
                                            Local boiler experts for Leeds & Surrounding.
                                        </h1>
                                        <p className="text-lg text-slate-600 max-w-xl">
                                            We install, repair, and service boilers with clear prices, tidy workmanship, and no sales visits. Everything is built to be simple, fast, and local.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {[
                                            "Gas Safe Register 636354",
                                            "WhatsApp or callback only",
                                            "Fixed‑price quotes online",
                                            "All prices include VAT",
                                            "Next‑day installs before 4pm",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                            >
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                                        >
                                            <Link href="/book">Get a fixed quote</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:border-slate-300"
                                        >
                                            <Link href="/#contact">WhatsApp or callback</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                                        <img
                                            src="/images/engineers-image.jpg"
                                            alt="Local Gas Safe engineer"
                                            className="h-[420px] w-full object-cover"
                                            loading="lazy"
                                        />

                                        <div className="absolute top-5 left-5 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-lg">
                                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Gas Safe</p>
                                            <p className="text-lg font-semibold text-slate-900">636354</p>
                                        </div>

                                        <div className="absolute bottom-5 right-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fully insured</p>
                                            <p className="text-sm font-semibold text-slate-900">Work protected</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {STATS.map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center"
                                            >
                                                <div className="text-xl font-semibold text-slate-900">
                                                    {stat.value}
                                                </div>
                                                <div className="mt-1 text-xs text-slate-500">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* VALUES */}
                    <section className="py-12 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                    Why MD Gas
                                </span>
                                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                                    Built around clarity and trust.
                                </h2>
                                <p className="mt-4 text-lg text-slate-600">
                                    Everything we do is designed to be straight‑forward, local, and reliable.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {VALUES.map((value) => (
                                    <div
                                        key={value.title}
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                                            <value.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                            {value.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SERVICES */}
                    <section className="py-12 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
                                <div className="space-y-4">
                                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                        What we do
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                                        Boiler services with clean pricing and tidy installs.
                                    </h2>
                                    <p className="text-lg text-slate-600">
                                        We focus on the services Leeds homeowners need most, delivered by Gas Safe engineers with no sales pressure.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {SERVICES.map((service) => (
                                        <div
                                            key={service.title}
                                            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                                        >
                                            <h3 className="text-base font-semibold text-slate-900">
                                                {service.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {service.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LOCAL PROMISE */}
                    <section className="py-12 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl">
                                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
                                    <div className="space-y-5">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                            Our promise
                                        </span>
                                        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                                            Straight answers. Clean installs. No sales visit.
                                        </h2>
                                        <p className="text-lg text-slate-600">
                                            We keep things simple: clear pricing online, local engineers who show up on time, and tidy, respectful installs. If you need help, it’s WhatsApp or a call back — no phone queues.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                                            >
                                                <Link href="/book">Get a fixed quote</Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="lg"
                                                variant="outline"
                                                className="rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:border-slate-300"
                                            >
                                                <Link href="/#contact">WhatsApp or callback</Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -top-6 -right-6 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
                                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                            <img
                                                src="/images/landing-20boiler.png"
                                                alt="Boiler installation"
                                                className="h-[320px] w-full object-contain p-8"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RETURNS & REFUNDS */}
                    <section className="py-12 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
                                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
                                    <div className="space-y-4">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                            Returns & refunds
                                        </span>
                                        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                                            Simple, fair, and clear.
                                        </h2>
                                        <p className="text-lg text-slate-600">
                                            If plans change, we keep it straightforward. We take payment upfront and we accept Klarna.
                                        </p>
                                    </div>

                                    <div className="grid gap-4">
                                        {[
                                            {
                                                title: "Before work starts",
                                                text: "Cancel any time and we’ll refund your payment in full. No fees.",
                                            },
                                            {
                                                title: "Payment",
                                                text: "We take payment upfront and can accept Klarna to spread the cost.",
                                            },
                                            {
                                                title: "After completion",
                                                text: "All installs include workmanship cover and manufacturer warranties apply to the boiler itself.",
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.title}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
                                            >
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {item.title}
                                                </div>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                                        Questions? Message us on WhatsApp or request a callback.
                                    </span>
                                    <Link className="text-emerald-700 font-semibold" href="/#contact">
                                        Contact us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="relative py-14 sm:py-16 overflow-hidden rounded-b-3xl">
                        <div className="absolute inset-0 bg-emerald-600" />
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

                        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
                            <h2 className="text-3xl font-semibold">
                                Ready for a fixed‑price quote?
                            </h2>
                            <p className="mt-4 text-lg text-white/90">
                                Answer a few questions online and pick a package that suits your home.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full bg-white px-10 text-emerald-700 hover:bg-emerald-50"
                                >
                                    <Link href="/book">Start your quote</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full border-white/60 px-10 text-white hover:bg-white/10"
                                >
                                    <Link href="/#contact">WhatsApp or callback</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </>
    );
}
