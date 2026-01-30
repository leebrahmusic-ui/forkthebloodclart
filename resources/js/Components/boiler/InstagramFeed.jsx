import React, { useEffect } from "react";

export function InstagramFeed() {
    useEffect(() => {
        const existing = document.getElementById("EmbedSocialHashtagScript");
        if (existing) return;

        const script = document.createElement("script");
        script.id = "EmbedSocialHashtagScript";
        script.src = "https://embedsocial.com/cdn/ht.js";
        document.head.appendChild(script);
    }, []);

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className="flex flex-col items-center text-center gap-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                            Recent work
                        </p>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                            Leeds installs, call-outs & behind-the-scenes
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-slate-600">
                            Expect everything from installs to fixes and day‑to‑day updates — all real, all local.
                        </p>
                    </div>
                </div>

                <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-4">
                    <style>{`
                        .embedsocial-hashtag .feed-powered-by-es {
                            display: none !important;
                        }
                    `}</style>
                    <div
                        className="embedsocial-hashtag"
                        data-ref="2598941845b6e27b854fa8073e1485fc1031cb4c"
                    />
                </div>
            </div>
        </section>
    );
}
