import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const pushPageView = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "pageview",
        page: window.location.pathname + window.location.search,
        title: document.title,
    });
};
// First load
pushPageView();
// Inertia navigations
router.on("navigate", () => {
    pushPageView();
});

const appName =
    import.meta.env.VITE_APP_NAME || document.title || "MD GAS SERVICES";

function syncPricingOverridesFromPage(page) {
    const props = page?.props || {};
    window.__PRICING_OVERRIDES__ = props.pricingOverrides || {};
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        // ✅ Initial sync
        const initialPage = props?.initialPage || props?.page || {};
        syncPricingOverridesFromPage(initialPage);

        // ✅ Sync on every Inertia navigation / reload
        router.on("navigate", (event) => {
            // Inertia provides the new page in event.detail.page
            syncPricingOverridesFromPage(event?.detail?.page);
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    progress: { color: "#4B5563" },
});
