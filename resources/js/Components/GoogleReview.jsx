import { useEffect, useRef, useState } from "react";

export function GoogleReview() {
    const containerRef = useRef(null);
    const [brandingRemoved, setBrandingRemoved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const mountWidget = () => {
            if (cancelled) return;

            const container = document.getElementById(
                "shapo-widget-1569ee68f38a1e8430cb"
            );
            if (!container) return;

            // Clear any existing iframes inside the widget container
            container.querySelectorAll("iframe").forEach((node) => node.remove());

            // Remove existing embed script so it can re-run after mount
            const existingScript = document.getElementById("shapo-embed-js");
            if (existingScript) existingScript.remove();

            // Reset Shapo loader flags (set by their script)
            if (window._shapoLoaded) delete window._shapoLoaded;
            if (window._shapoLoadedPopups) delete window._shapoLoadedPopups;

            const script = document.createElement("script");
            script.id = "shapo-embed-js";
            script.src = `https://cdn.shapo.io/js/embed.js?cb=${Date.now()}`;
            script.defer = true;
            document.head.appendChild(script);
        };

        const timer = setTimeout(mountWidget, 0);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const target = containerRef.current;
        if (!target) return;

        const removeBranding = () => {
            const candidates = Array.from(
                target.querySelectorAll("a, div, span")
            );

            const brandingNode = candidates.find((el) =>
                /powered by\s*shapo/i.test(el.textContent || "")
            );

            if (brandingNode) {
                brandingNode.remove();
                setBrandingRemoved(true);
            }
        };

        removeBranding();

        const observer = new MutationObserver(() => removeBranding());
        observer.observe(target, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-slate-50 py-16 no-auto-dark-surface google-review-light-lock">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className="flex justify-center">
                    <div
                        ref={containerRef}
                        className={`w-full max-w-4xl rounded-3xl bg-white p-4 ring-1 ring-slate-200 shadow-sm transition-all duration-300 no-auto-dark-card ${
                            brandingRemoved ? "pb-4" : "pb-8"
                        }`}
                    >
                        <style>{`
                            #shapo-widget-1569ee68f38a1e8430cb {
                                background: #ffffff !important;
                                color-scheme: only light !important;
                                forced-color-adjust: none !important;
                            }
                            #shapo-widget-1569ee68f38a1e8430cb iframe {
                                background: #ffffff !important;
                                color-scheme: only light !important;
                                forced-color-adjust: none !important;
                            }

                            @media (prefers-color-scheme: dark) {
                                .google-review-light-lock,
                                .google-review-light-lock * {
                                    color-scheme: only light !important;
                                    forced-color-adjust: none !important;
                                }

                                #shapo-widget-1569ee68f38a1e8430cb,
                                #shapo-widget-1569ee68f38a1e8430cb iframe {
                                    background: #ffffff !important;
                                }

                                #shapo-widget-1569ee68f38a1e8430cb :is(p, span, a, h1, h2, h3, h4, h5, h6, strong, small) {
                                    color: #0f172a !important;
                                    -webkit-text-fill-color: #0f172a !important;
                                }
                            }
                        `}</style>
                        <div id="shapo-widget-1569ee68f38a1e8430cb" />
                    </div>
                </div>
            </div>
        </section>
    );
}
