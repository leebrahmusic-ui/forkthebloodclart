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

                .quote-blue-skin .quote-page-bg {
                    background: #00ABDB !important;
                    background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.00) 44%), linear-gradient(180deg, #0098c4 0%, #007ea3 100%) !important;
                }

                .quote-blue-skin .page-header-clean {
                    background: #0089b2 !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) !important;
                }

                .quote-blue-skin .quote-trust-card {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), #008db6 !important;
                    border-color: rgba(255, 255, 255, 0.35) !important;
                    box-shadow: 0 8px 20px rgba(0, 65, 88, 0.14) !important;
                }

                .quote-blue-skin .quote-question-shell {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), #0088b0 !important;
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

                .quote-blue-skin .option-card {
                    border-color: rgba(255, 255, 255, 0.32) !important;
                    box-shadow: 0 8px 18px rgba(0, 53, 72, 0.16) !important;
                }

                .quote-blue-skin .option-inactive {
                    background: #0082a8 !important;
                    color: #ffffff !important;
                }

                .quote-blue-skin .option-active {
                    background: #006f91 !important;
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
                    background: #00799c !important;
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
                        background: #00ABDB !important;
                        background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.00) 44%), linear-gradient(180deg, #0098c4 0%, #007ea3 100%) !important;
                    }

                    .quote-blue-skin .page-header-clean,
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell {
                        background-color: #0088b0 !important;
                    }

                    .quote-blue-skin .page-header-clean,
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
                }
            `}</style>
            {children}
        </div>
    );
}
