import{r as i,j as e,L as c}from"./app-Bgzj2z65.js";function f(){const[t,s]=i.useState(0);return i.useEffect(()=>{const r=[setTimeout(()=>s(1),100),setTimeout(()=>s(2),600),setTimeout(()=>s(3),1200),setTimeout(()=>s(4),1800)];return()=>r.forEach(a=>clearTimeout(a))},[]),e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4 overflow-hidden relative",children:[e.jsx("div",{className:`absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 ${t>=1?"scale-150":"scale-0"}`,style:{top:"10%",left:"20%"}}),e.jsx("div",{className:`absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${t>=2?"scale-150":"scale-0"}`,style:{bottom:"10%",right:"20%"}}),e.jsxs("div",{className:"relative z-10 text-center max-w-2xl",children:[e.jsx("div",{className:"flex justify-center mb-12",children:e.jsxs("div",{className:`relative w-32 h-32 transition-all duration-700 ${t>=1?"scale-100 rotate-0":"scale-0 -rotate-180"}`,children:[e.jsx("div",{className:"absolute inset-0 rounded-full border-4 border-white opacity-30"}),e.jsx("div",{className:"absolute inset-0 rounded-full border-4 border-white border-t-transparent transition-all duration-1000",style:{transform:t>=2?"rotate(360deg)":"rotate(0deg)",opacity:t>=3?0:1}}),e.jsx("div",{className:`absolute inset-2 rounded-full bg-white flex items-center justify-center transition-all duration-500 ${t>=3?"scale-100 opacity-100":"scale-0 opacity-0"}`,children:e.jsxs("svg",{className:"w-16 h-16",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M6 6l12 12",fill:"none",stroke:"url(#gradient)",strokeWidth:"3",strokeLinecap:"round",strokeDasharray:"17",strokeDashoffset:t>=4?0:17,style:{transition:"stroke-dashoffset 0.4s ease-in-out"}}),e.jsx("path",{d:"M18 6l-12 12",fill:"none",stroke:"url(#gradient)",strokeWidth:"3",strokeLinecap:"round",strokeDasharray:"17",strokeDashoffset:t>=4?0:17,style:{transition:"stroke-dashoffset 0.4s ease-in-out 0.2s"}}),e.jsx("defs",{children:e.jsxs("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#ef4444"}),e.jsx("stop",{offset:"100%",stopColor:"#dc2626"})]})})]})}),t>=4&&e.jsx(e.Fragment,{children:[...Array(6)].map((r,a)=>{const l=a*60+30;return e.jsx("div",{className:"absolute bg-red-300 rounded-full",style:{width:"2px",height:"20px",top:"50%",left:"50%",transformOrigin:"1px 1px",transform:`rotate(${l}deg) translateY(-40px)`,animation:"crackExpand 0.6s ease-out forwards",animationDelay:`${a*.05}s`,opacity:0}},a)})})]})}),t>=4&&e.jsx("div",{className:"fixed inset-0 pointer-events-none",children:[...Array(25)].map((r,a)=>{const l=20+Math.random()*60,n=1.5+Math.random()*1,o=Math.random()*1.2,d=-5+Math.random()*20;return e.jsx("div",{className:"absolute",style:{left:`${l}%`,top:`${d}%`},children:e.jsxs("div",{className:"relative",style:{animation:`tearFall ${n}s ease-in forwards`,animationDelay:`${o}s`,opacity:0},children:[e.jsx("div",{className:"bg-blue-300 rounded-full",style:{width:"8px",height:"8px",opacity:.7}}),e.jsx("div",{className:"bg-blue-300 absolute",style:{width:"8px",height:"12px",top:"-6px",left:"0",borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",opacity:.7}})]})},a)})}),t>=4&&e.jsx("div",{className:"fixed top-10 left-1/2 transform -translate-x-1/2 pointer-events-none",children:e.jsx("div",{className:"relative",style:{animation:"floatSad 3s ease-in-out infinite",opacity:.3},children:e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute bg-gray-300 rounded-full w-16 h-16 top-0 left-4"}),e.jsx("div",{className:"absolute bg-gray-300 rounded-full w-20 h-20 top-2 left-12"}),e.jsx("div",{className:"absolute bg-gray-300 rounded-full w-14 h-14 top-0 left-24"}),e.jsx("div",{className:"absolute bg-gray-300 rounded-full w-24 h-12 top-8 left-6"})]})})}),t>=4&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute",style:{top:"35%",left:"15%",animation:"heartBreakLeft 1s ease-out forwards",animationDelay:"0.3s",opacity:0},children:e.jsx("svg",{width:"30",height:"30",viewBox:"0 0 24 24",fill:"#ff6b9d",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09"})})}),e.jsx("div",{className:"absolute",style:{top:"35%",right:"15%",animation:"heartBreakRight 1s ease-out forwards",animationDelay:"0.3s",opacity:0},children:e.jsx("svg",{width:"30",height:"30",viewBox:"0 0 24 24",fill:"#ff6b9d",children:e.jsx("path",{d:"M12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09"})})})]}),e.jsxs("div",{className:`transition-all duration-700 delay-500 ${t>=3?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,style:{animation:t>=4?"gentleShake 0.5s ease-in-out":"none",animationDelay:"0.4s"},children:[e.jsx("h1",{className:"text-6xl font-bold text-white mb-6 tracking-tight",children:"Order Failed"}),e.jsx("div",{className:"w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 opacity-60"})]}),e.jsxs("div",{className:`transition-all duration-700 delay-700 ${t>=4?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[e.jsx("p",{className:"text-2xl text-white font-light mb-4",children:"We couldn't process your order"}),e.jsx("p",{className:"text-lg text-red-100 font-light max-w-md mx-auto leading-relaxed mb-8",children:"Something went wrong with your payment. Please check your payment details and try again."}),e.jsx("div",{className:"flex flex-col sm:flex-row gap-4 justify-center mt-8",children:e.jsx(c,{href:"/",children:e.jsx("button",{className:"px-8 py-3 bg-white text-red-900 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg",children:"Try Again"})})})]}),e.jsxs("div",{className:`mt-16 flex justify-center gap-4 transition-all duration-700 delay-1000 ${t>=4?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[e.jsx("div",{className:"w-3 h-3 bg-red-300 rounded-full",style:{animation:"sadPulse 3s ease-in-out infinite",animationDelay:"0s"}}),e.jsx("div",{className:"w-3 h-3 bg-red-300 rounded-full",style:{animation:"sadPulse 3s ease-in-out infinite",animationDelay:"0.3s"}}),e.jsx("div",{className:"w-3 h-3 bg-red-300 rounded-full",style:{animation:"sadPulse 3s ease-in-out infinite",animationDelay:"0.6s"}})]})]}),e.jsx("style",{jsx:!0,children:`
                @keyframes crackExpand {
                    0% {
                        opacity: 1;
                        height: 0px;
                    }
                    50% {
                        opacity: 1;
                        height: 30px;
                    }
                    100% {
                        opacity: 0;
                        height: 40px;
                    }
                }

                @keyframes tearFall {
                    0% {
                        opacity: 0;
                        transform: translateY(0) scale(0.5);
                    }
                    10% {
                        opacity: 0.8;
                        transform: translateY(10px) scale(1);
                    }
                    90% {
                        opacity: 0.6;
                        transform: translateY(80vh) scale(0.9);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(85vh) scale(0.7);
                    }
                }

                @keyframes floatSad {
                    0%,
                    100% {
                        transform: translateX(-50%) translateY(0px);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-10px);
                    }
                }

                @keyframes heartBreakLeft {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-30px, 40px) rotate(-25deg);
                    }
                }

                @keyframes heartBreakRight {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(30px, 40px) rotate(25deg);
                    }
                }

                @keyframes gentleShake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    75% {
                        transform: translateX(5px);
                    }
                }

                @keyframes sadPulse {
                    0%,
                    100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.1);
                    }
                }
            `})]})}export{f as default};
