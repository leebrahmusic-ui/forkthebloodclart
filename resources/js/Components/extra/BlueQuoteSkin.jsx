import React from "react";

export default function BlueQuoteSkin({ children }) {
    return (
        <div className="quote-blue-skin">
            <style>{`
                .quote-blue-skin,
                .quote-blue-skin * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                .quote-blue-skin {
                    --qb-base: #06263f;
                    --qb-mid: #0b3654;
                    --qb-deep: #114c73;
                    --qb-panel: #0b3654;
                    --qb-panel-dark: #114c73;
                    --qb-option: #114c73;
                    --qb-option-active: #0b3654;
                }

                .quote-blue-skin .quote-page-bg {
                    background: var(--qb-base) !important;
                    background-image: radial-gradient(circle at top, rgba(54, 193, 255, 0.22), rgba(255, 255, 255, 0.00) 45%), linear-gradient(180deg, var(--qb-mid) 0%, var(--qb-deep) 100%) !important;
                }

                .quote-blue-skin .page-header-clean:not(.page-header-blue) {
                    background: var(--qb-panel) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) !important;
                }

                .quote-blue-skin .page-header-clean.page-header-blue {
                    background: transparent !important;
                    background-image: none !important;
                    border-color: transparent !important;
                    box-shadow: none !important;
                }

                .quote-blue-skin .quote-trust-card {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), var(--qb-panel) !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                    box-shadow: 0 8px 20px rgba(0, 65, 88, 0.14) !important;
                }

                .quote-blue-skin .quote-question-shell {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), var(--qb-panel) !important;
                    border: 1px solid rgba(255, 255, 255, 0.35) !important;
                    box-shadow: 0 14px 34px rgba(0, 65, 88, 0.16) !important;
                }

                .quote-blue-skin .quote-question-shell .radial-highlight {
                    background: none !important;
                }

                .quote-blue-skin [class*="bg-white"],
                .quote-blue-skin [class*="bg-slate"],
                .quote-blue-skin [class*="bg-gray"] {
                    background-color: rgba(0, 96, 124, 0.28) !important;
                    background-image: none !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                }

                .quote-blue-skin .quote-solid-popover {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                    backdrop-filter: none !important;
                }

                .quote-blue-skin .quote-solid-popover,
                .quote-blue-skin .quote-solid-popover [class*="text-"],
                .quote-blue-skin .quote-solid-popover p,
                .quote-blue-skin .quote-solid-popover span,
                .quote-blue-skin .quote-solid-popover div {
                    color: #334155 !important;
                    -webkit-text-fill-color: #334155 !important;
                }

                .quote-blue-skin .quote-solid-popover a {
                    color: #1d4ed8 !important;
                    -webkit-text-fill-color: #1d4ed8 !important;
                }

                .quote-blue-skin .quote-solid-sidebar {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                }

                .quote-blue-skin .quote-solid-sidebar [class*="bg-white"],
                .quote-blue-skin .quote-solid-sidebar [class*="bg-slate"],
                .quote-blue-skin .quote-solid-sidebar [class*="bg-gray"] {
                    background-color: #f8fafc !important;
                    background-image: none !important;
                    border-color: #cbd5e1 !important;
                }

                .quote-blue-skin .quote-solid-sidebar,
                .quote-blue-skin .quote-solid-sidebar [class*="text-"],
                .quote-blue-skin .quote-solid-sidebar h1,
                .quote-blue-skin .quote-solid-sidebar h2,
                .quote-blue-skin .quote-solid-sidebar h3,
                .quote-blue-skin .quote-solid-sidebar p,
                .quote-blue-skin .quote-solid-sidebar span,
                .quote-blue-skin .quote-solid-sidebar div {
                    color: #334155 !important;
                    -webkit-text-fill-color: #334155 !important;
                }

                .quote-blue-skin .option-card {
                    border-color: rgba(255, 255, 255, 0.32) !important;
                    box-shadow: 0 8px 18px rgba(0, 53, 72, 0.16) !important;
                }

                .quote-blue-skin .option-inactive {
                    background: var(--qb-option) !important;
                    color: #ffffff !important;
                }

                .quote-blue-skin .option-active {
                    background: var(--qb-option-active) !important;
                    border-color: rgba(255, 255, 255, 0.58) !important;
                    box-shadow: 0 10px 24px rgba(0, 53, 72, 0.28) !important;
                    color: #ffffff !important;
                }

                .quote-blue-skin .option-card,
                .quote-blue-skin .option-card *,
                .quote-blue-skin .option-inactive,
                .quote-blue-skin .option-active {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .quote-blue-skin .radial-dot-inactive {
                    background: rgba(255, 255, 255, 0.35) !important;
                }

                .quote-blue-skin .radial-dot-inactive .radial-dot-core {
                    background: #ffffff !important;
                }

                .quote-blue-skin input,
                .quote-blue-skin select,
                .quote-blue-skin textarea {
                    background: var(--qb-panel-dark) !important;
                    color: #ffffff !important;
                    border-color: rgba(255, 255, 255, 0.45) !important;
                }

                .quote-blue-skin input::placeholder,
                .quote-blue-skin textarea::placeholder {
                    color: rgba(255, 255, 255, 0.8) !important;
                    -webkit-text-fill-color: rgba(255, 255, 255, 0.8) !important;
                }

                .quote-blue-skin,
                .quote-blue-skin h1,
                .quote-blue-skin h2,
                .quote-blue-skin h3,
                .quote-blue-skin h4,
                .quote-blue-skin h5,
                .quote-blue-skin h6,
                .quote-blue-skin p,
                .quote-blue-skin span,
                .quote-blue-skin label,
                .quote-blue-skin a,
                .quote-blue-skin svg,
                .quote-blue-skin [class*="text-"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .quote-blue-skin [class*="text-muted"],
                .quote-blue-skin [class*="text-slate"],
                .quote-blue-skin [class*="text-gray"] {
                    color: #e8f8ff !important;
                    -webkit-text-fill-color: #e8f8ff !important;
                }

                @media (prefers-color-scheme: dark) {
                    .quote-blue-skin .quote-page-bg {
                        background: var(--qb-base) !important;
                        background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.00) 44%), linear-gradient(180deg, var(--qb-mid) 0%, var(--qb-deep) 100%) !important;
                    }

                    .quote-blue-skin .page-header-clean:not(.page-header-blue),
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell {
                        background-color: var(--qb-panel) !important;
                    }

                    .quote-blue-skin .page-header-clean:not(.page-header-blue),
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell,
                    .quote-blue-skin .quote-question-shell [class*="bg-slate"],
                    .quote-blue-skin .quote-question-shell [class*="bg-gray"] {
                        border-color: rgba(255, 255, 255, 0.35) !important;
                    }

                    .quote-blue-skin,
                    .quote-blue-skin [class*="text-"] {
                        color: #ffffff !important;
                        -webkit-text-fill-color: #ffffff !important;
                    }

                    .quote-blue-skin .quote-solid-popover {
                        background-color: #f8fafc !important;
                        border-color: #cbd5e1 !important;
                    }

                    .quote-blue-skin .quote-solid-popover,
                    .quote-blue-skin .quote-solid-popover *,
                    .quote-blue-skin .quote-solid-popover [class*="text-"] {
                        color: #334155 !important;
                        -webkit-text-fill-color: #334155 !important;
                    }

                    .quote-blue-skin .quote-solid-popover a {
                        color: #1d4ed8 !important;
                        -webkit-text-fill-color: #1d4ed8 !important;
                    }

                    .quote-blue-skin .quote-solid-sidebar,
                    .quote-blue-skin .quote-solid-sidebar *,
                    .quote-blue-skin .quote-solid-sidebar [class*="text-"] {
                        color: #334155 !important;
                        -webkit-text-fill-color: #334155 !important;
                    }
                }
            `}</style>
            {children}
        </div>
    );
}
