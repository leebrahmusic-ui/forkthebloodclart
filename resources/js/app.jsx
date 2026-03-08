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

const appName = "MD Gas Leeds";

function syncBodyThemeFromPage(page) {
    const component = page?.component || "";
    const pageUrl = page?.url || window.location.pathname || "";
    const rawPath = pageUrl.split("?")[0] || "";
    const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const isQuoteQuestionStep =
        component === "Book/NewBoilerPage" ||
        path === "/book/quote/new" ||
        path === "/book/quote/new/";
    const shouldUseForcedTheme = !isQuoteQuestionStep;

    if (!document.body) return;
    document.body.classList.toggle("force-purple-theme", shouldUseForcedTheme);
}

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
        syncBodyThemeFromPage(initialPage);
        syncPricingOverridesFromPage(initialPage);

        // ✅ Sync on every Inertia navigation / reload
        router.on("navigate", (event) => {
            // Inertia provides the new page in event.detail.page
            const nextPage = event?.detail?.page;
            syncBodyThemeFromPage(nextPage);
            syncPricingOverridesFromPage(nextPage);
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    progress: { color: "#4B5563" },
});
