import { FcGoogle } from "react-icons/fc";
import { usePage } from "@inertiajs/react";

export function GoogleReview() {
    const { googleBusiness } = usePage().props || {};

    const fallbackUrl =
        "https://www.google.com/search?q=MD+Gas+Leeds&stick=H4sIAAAAAAAA_-NgU1I1qDBKTTRJMTAxTjFMMU21NDS3MqgwT7GwMEu0TElNSTY1MEgxWcTK4-ui4J5YrOCTmppSDAANgsr0OAAAAA&hl=en&mat=CTqTWGe_fFeMElYBTVDHnuqbxBwblP2-pewRSIB9v7Fc6NCQG6UfLVSP74OfKisuAjMmgaJcWLuFK7U2ex7ZhbotIUBPgoph_nxGgcDyJ_DVWmnBoVgMPu1HC_P4dtCQFQ&authuser=0#cobssid=s&mpd=~10112688649798193978/customers/reviews";

    const profileUrl = isSafeHttpsUrl(googleBusiness?.profileUrl)
        ? googleBusiness.profileUrl
        : fallbackUrl;

    const hasRating =
        typeof googleBusiness?.rating === "number" &&
        typeof googleBusiness?.reviewCount === "number";

    const formattedReviewCount = hasRating
        ? googleBusiness.reviewCount.toLocaleString()
        : null;

    return (
        <div className="mt-20 flex justify-center">
            <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read MD Gas reviews on Google"
                className="
                    group relative
                    flex items-center
                    rounded-2xl
                    px-6 py-4
                    bg-white
                    ring-1 ring-slate-200
                    shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)]
                    transition-all duration-300 ease-out
                    hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.45)]
                    hover:ring-primary/40
                    hover:-translate-y-0.5
                    active:scale-[0.98]
                    cursor-pointer
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute -inset-6 -z-10 rounded-full
                        bg-gradient-to-r from-blue-400/5 to-amber-400/5
                        opacity-0 blur-2xl transition-opacity duration-500
                        group-hover:opacity-100
                    "
                />

                <div className="relative flex items-center gap-5">
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-lg bg-white
                                ring-1 ring-slate-200
                                shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)]
                                transition-transform duration-300
                                group-hover:scale-[1.06]
                            "
                        >
                            <FcGoogle className="h-6 w-6" />
                        </div>

                        <div className="flex flex-col leading-tight">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                                Reviews on
                            </span>
                            <span className="text-[15px] font-semibold text-dark">
                                Google
                            </span>
                            {hasRating && (
                                <span className="text-xs text-slate-500 mt-1">
                                    Rated {googleBusiness.rating}/5 from {formattedReviewCount} reviews
                                </span>
                            )}
                        </div>
                    </div>

                    <div
                        className="
                            rounded-full
                            bg-foreground
                            px-4 py-2
                            ring-1 ring-primary/20
                            transition-all duration-300
                            group-hover:ring-primary/40
                        "
                    >
                        <span className="text-sm font-semibold text-slate-900">
                            Read our reviews
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
}

function isSafeHttpsUrl(url) {
    if (typeof url !== "string") return false;
    return url.startsWith("https://");
}
