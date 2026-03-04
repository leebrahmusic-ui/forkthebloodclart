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
        title: "Get your fixed-price boiler quote in under 60 seconds",
        description: "",
        priceLine: "From £1,395 inc VAT",
        brands: [
            { name: "Worcester Bosch", logo: "/images/brands/worcester-bosch.svg" },
            { name: "Ideal", logo: "/images/idealheating.png" },
            { name: "& many more...", logo: null },
        ],
        boilerImages: [
            "/assets/productImages/greenstar-boiler.png",
            "/assets/productImages/max-combi-image.png",
            "/assets/productImages/baxi-image.png",
        ],
        specs: [
            "Manufacturer warranties from 5 to 12 years",
            "Magnetic filter + system flush included",
            "Wireless thermostat included",
        ],
        image: "/assets/productImages/greenstar-boiler.png",
        highlight: "Most booked this month",
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
                        <div className="space-y-4 flex flex-col items-center lg:items-start">
                            <CardHeader className="p-0 w-full">
                                <CardTitle className="w-full text-[24px] font-semibold text-slate-900 text-center lg:text-left">
                                    {featuredService.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 w-full">
                                <CardDescription className="text-[14px] leading-relaxed text-slate-600 text-center lg:text-left">
                                    {featuredService.description}
                                </CardDescription>
                                {featuredService.priceLine && (
                                    <Link
                                        href={featuredService.href}
                                        className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[16px] font-bold text-emerald-800 transition hover:bg-emerald-100"
                                    >
                                        {featuredService.priceLine}
                                    </Link>
                                )}

                                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                        Gas Safe registered
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                        Fixed quote
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                        Next-day installs available
                                    </span>
                                </div>

                                {featuredService.brands?.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center lg:text-left">
                                            Available makes
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                            {featuredService.brands.map((brand) => (
                                                <div
                                                    key={brand.name}
                                                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5"
                                                >
                                                    {brand.logo ? (
                                                        <img
                                                            src={brand.logo}
                                                            alt={brand.name}
                                                            className="h-4 w-auto object-contain"
                                                        />
                                                    ) : null}
                                                    <span className="text-xs font-semibold text-slate-700">{brand.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {featuredService.specs?.length > 0 && (
                                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                                        {featuredService.specs.map((spec) => (
                                            <li key={spec} className="flex items-center justify-center gap-2 lg:justify-start">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <span>{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>

                            <Link
                                href={featuredService.href}
                                className="mt-3 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                Get fixed quote
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className="text-xs text-slate-500 text-center lg:text-left">
                                Rated 5.0 on Google • No-obligation quote
                            </p>
                        </div>

                        <div className="relative grid h-56 grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3">
                            {(featuredService.boilerImages?.length
                                ? featuredService.boilerImages
                                : [featuredService.image]
                            ).map((imgSrc, idx) => (
                                <div
                                    key={`${imgSrc}-${idx}`}
                                    className="flex items-center justify-center rounded-xl bg-white border border-slate-200 p-2"
                                >
                                    <img
                                        src={imgSrc}
                                        alt={`${featuredService.title} ${idx + 1}`}
                                        className={`h-36 w-full object-contain ${idx === 0 ? "scale-[1.38]" : "scale-125"}`}
                                    />
                                </div>
                            ))}
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
