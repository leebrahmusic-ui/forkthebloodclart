import { Link } from "@inertiajs/react";
import { Phone, MapPin, CheckCircle, Shield, Clock } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="bg-white border-t border-slate-200">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-0">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <Link href="/" className="inline-block">
                            <img
                                src="/images/logo%20FIXED.png"
                                alt="MD Gas Leeds"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-4 text-slate-600 max-w-md">
                            Local boiler services for Leeds and surrounding areas.
                            Fixed‑price quotes, tidy installs, and fast support.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="/book"
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                Get a fixed quote
                            </a>
                            <a
                                href="https://wa.me/447454796398"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                            >
                                WhatsApp 24/7
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                                    <Phone className="h-5 w-5 text-emerald-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">WhatsApp chat</p>
                                    <p className="text-sm text-slate-600">24/7 support via WhatsApp</p>
                                    <a
                                        href="https://wa.me/447454796398"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-emerald-700"
                                    >
                                        +44 7454 796398
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                                    <MapPin className="h-5 w-5 text-emerald-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Service area</p>
                                    <p className="text-sm text-slate-600">Leeds & surrounding areas only</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
                    <p>© {currentYear} MD Gas Leeds. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-slate-700">
                            About Us
                        </Link>
                        <Link href="/privacy-policy" className="hover:text-slate-700">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-conditions" className="hover:text-slate-700">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
