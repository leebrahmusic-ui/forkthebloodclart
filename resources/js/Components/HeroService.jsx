import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { ArrowRight } from "lucide-react";

const services = [
    {
        id: "repair",
        title: "Boiler Repair",
        description: "Same‑week slots for Leeds boiler repairs.",
        image: "/images/product_boiler.png",
        highlight: "Same‑week slots",
        href: "/book/quote?service=repair",
        theme: {
            hoverBg: "hover:bg-emerald-50",
            hoverBorder: "hover:border-emerald-400",
            labelBg: "bg-emerald-600",
            rippleColor: "text-emerald-200",
            arrowHoverBg: "group-hover:bg-emerald-600",
        },
    },
    {
        id: "service",
        title: "Boiler Service",
        description: "Gas Safe servicing with clear, upfront pricing.",
        image: "/images/product_boiler.png",
        highlight: "Gas Safe",
        href: "/book/quote?service=service",
        theme: {
            hoverBg: "hover:bg-emerald-50",
            hoverBorder: "hover:border-emerald-400",
            labelBg: "bg-emerald-600",
            rippleColor: "text-emerald-200",
            arrowHoverBg: "group-hover:bg-emerald-600",
        },
    },
    {
        id: "quote",
        title: "New Boiler Quote",
        description: "Worcester Bosch Greenstar 1000",
        priceLine: "Installed from £1895 (24kW)",
        specs: [
            "5-year warranty included",
            "Filter included",
            "Chemical flush",
            "Wireless room thermostat",
        ],
        image: "/assets/productImages/greenstar-boiler.png",
        highlight: "Next‑day install",
        href: "/book",
        featured: true,

        theme: {
            hoverBg: "hover:bg-emerald-50",
            hoverBorder: "hover:border-emerald-400",
            labelBg: "bg-emerald-600",
            rippleColor: "text-emerald-200",
            arrowHoverBg: "group-hover:bg-emerald-600",
        },
    },
    {
        id: "powerflush",
        title: "Magnacleanse",
        description: "A gentler system cleanse for radiators and pipework.",
        image: "/images/product_boiler.png",
        highlight: "Cleaner system",
        href: "/book/quote?service=powerflush",
        theme: {
            hoverBg: "hover:bg-emerald-50",
            hoverBorder: "hover:border-emerald-400",
            labelBg: "bg-emerald-600",
            rippleColor: "text-emerald-200",
            arrowHoverBg: "group-hover:bg-emerald-600",
        },
    },
];

export function HeroServices() {
    const featuredService = services.find((service) => service.featured);
    const otherServices = services.filter((service) => !service.featured);

    return (
        <div className="space-y-6">
            {featuredService && (
                <Card className="group relative flex flex-col overflow-hidden rounded-[28px] border border-emerald-200 bg-white p-7 text-center shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
                    {/* label pill */}
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 mx-auto">
                        {featuredService.highlight}
                    </div>

                    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                        <div className="space-y-3 flex flex-col items-center">
                            <CardHeader className="p-0 w-full">
                                <CardTitle className="w-full text-[22px] font-semibold text-slate-900">
                                    {featuredService.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 w-full">
                                <CardDescription className="text-[14px] leading-relaxed text-slate-600">
                                    {featuredService.description}
                                </CardDescription>
                                {featuredService.priceLine && (
                                    <p className="mt-2 text-[15px] font-semibold text-slate-900">
                                        {featuredService.priceLine}
                                    </p>
                                )}
                                {featuredService.specs?.length > 0 && (
                                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                                        {featuredService.specs.map((spec) => (
                                            <li key={spec} className="flex items-center justify-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <span>{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>

                            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                                Example package shown • Final selection happens in your quote
                            </div>

                            <Link
                                href={featuredService.href}
                                className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Get fixed quote
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="relative flex h-48 items-center justify-center rounded-2xl bg-slate-50">
                            <img
                                src={featuredService.image}
                                alt={featuredService.title}
                                className="max-h-36 object-contain"
                            />
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {otherServices.map((service) => (
                    <Card
                        key={service.id}
                        className="group relative flex flex-col items-center text-center overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                            {service.highlight}
                        </div>

                        <div className="relative mt-4 flex h-32 w-full items-center justify-center rounded-2xl bg-slate-50">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="max-h-24 object-contain"
                            />
                        </div>

                        <div className="mt-4 w-full">
                            <CardHeader className="p-0">
                                <CardTitle className="text-[18px] font-semibold text-slate-900">
                                    {service.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CardDescription className="text-[14px] leading-relaxed text-slate-600">
                                    {service.description}
                                </CardDescription>
                            </CardContent>

                            <div className="mt-5">
                                <Link
                                    href={service.href}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                                >
                                    Book now
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
