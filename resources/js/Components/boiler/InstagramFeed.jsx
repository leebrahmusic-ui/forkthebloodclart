import React, { useEffect, useRef } from "react";

export function InstagramFeed() {
    const embedRef = useRef(null);

    useEffect(() => {
        const scriptId = "EmbedSocialHashtagScript";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.remove();
        }

        if (embedRef.current) {
            embedRef.current.innerHTML = "";
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://embedsocial.com/cdn/ht.js?cb=${Date.now()}`;
        document.head.appendChild(script);

        return () => {
            script.remove();
            if (embedRef.current) {
                embedRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <section className="py-20 bg-transparent">
            <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-0">
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

                <div className="mt-10 rounded-3xl bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/70 backdrop-blur-sm">
                    <style>{`
                        .embedsocial-hashtag .feed-powered-by-es {
                            display: none !important;
                        }
                    `}</style>
                    <div
                        ref={embedRef}
                        className="embedsocial-hashtag"
                        data-ref="98d397d59cef083016e0312428376fe3ae4f8fe1"
                    />
                </div>
            </div>
        </section>
    );
}
