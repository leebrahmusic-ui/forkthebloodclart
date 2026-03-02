import{r as n,j as o}from"./app-B0cE-u0f.js";function p(){const c=n.useRef(null),[d,l]=n.useState(!1);return n.useEffect(()=>{let e=!1;const a=setTimeout(()=>{if(e)return;const i=document.getElementById("shapo-widget-1569ee68f38a1e8430cb");if(!i)return;i.querySelectorAll("iframe").forEach(f=>f.remove());const r=document.getElementById("shapo-embed-js");r&&r.remove(),window._shapoLoaded&&delete window._shapoLoaded,window._shapoLoadedPopups&&delete window._shapoLoadedPopups;const t=document.createElement("script");t.id="shapo-embed-js",t.src=`https://cdn.shapo.io/js/embed.js?cb=${Date.now()}`,t.defer=!0,document.head.appendChild(t)},0);return()=>{e=!0,clearTimeout(a)}},[]),n.useEffect(()=>{const e=c.current;if(!e)return;const s=()=>{const r=Array.from(e.querySelectorAll("a, div, span")).find(t=>/powered by\s*shapo/i.test(t.textContent||""));r&&(r.remove(),l(!0))};s();const a=new MutationObserver(()=>s());return a.observe(e,{childList:!0,subtree:!0}),()=>a.disconnect()},[]),o.jsx("section",{className:"bg-slate-50 py-16 no-auto-dark-surface google-review-light-lock",children:o.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-0",children:o.jsx("div",{className:"flex justify-center",children:o.jsxs("div",{ref:c,className:`w-full max-w-4xl rounded-3xl bg-white p-4 ring-1 ring-slate-200 shadow-sm transition-all duration-300 no-auto-dark-card ${d?"pb-4":"pb-8"}`,children:[o.jsx("style",{children:`
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
                        `}),o.jsx("div",{id:"shapo-widget-1569ee68f38a1e8430cb"})]})})})})}export{p as G};
