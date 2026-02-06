import{r as i,j as t}from"./app-Bgzj2z65.js";function x(){const[e,s]=i.useState(0);return i.useEffect(()=>{const r=[setTimeout(()=>s(1),100),setTimeout(()=>s(2),600),setTimeout(()=>s(3),1200),setTimeout(()=>s(4),1800)];return()=>r.forEach(a=>clearTimeout(a))},[]),t.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-green-800 via-green-800 to-green-800 flex items-center justify-center p-4 overflow-hidden relative",children:[t.jsx("div",{className:`absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 ${e>=1?"scale-150":"scale-0"}`,style:{top:"10%",left:"20%"}}),t.jsx("div",{className:`absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${e>=2?"scale-150":"scale-0"}`,style:{bottom:"10%",right:"20%"}}),t.jsxs("div",{className:"relative z-10 text-center max-w-2xl",children:[t.jsx("div",{className:"flex justify-center mb-12",children:t.jsxs("div",{className:`relative w-32 h-32 transition-all duration-700 ${e>=1?"scale-100 rotate-0":"scale-0 -rotate-180"}`,children:[t.jsx("div",{className:"absolute inset-0 rounded-full border-4 border-white opacity-30"}),t.jsx("div",{className:"absolute inset-0 rounded-full border-4 border-white border-t-transparent transition-all duration-1000",style:{transform:e>=2?"rotate(360deg)":"rotate(0deg)",opacity:e>=3?0:1}}),t.jsx("div",{className:`absolute inset-2 rounded-full bg-white flex items-center justify-center transition-all duration-500 ${e>=3?"scale-100 opacity-100":"scale-0 opacity-0"}`,children:t.jsxs("svg",{className:"w-16 h-16",viewBox:"0 0 24 24",children:[t.jsx("path",{d:"M5 13l4 4L19 7",fill:"none",stroke:"url(#gradient)",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",strokeDasharray:"24",strokeDashoffset:e>=4?0:24,style:{transition:"stroke-dashoffset 0.6s ease-in-out"}}),t.jsx("defs",{children:t.jsxs("linearGradient",{id:"gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[t.jsx("stop",{offset:"0%",stopColor:"#a855f7"}),t.jsx("stop",{offset:"100%",stopColor:"#ec4899"})]})})]})}),e>=4&&t.jsx(t.Fragment,{children:[...Array(12)].map((r,a)=>t.jsx("div",{className:"absolute w-2 h-2 bg-white rounded-full",style:{top:"50%",left:"50%",transform:`rotate(${a*30}deg) translateY(-60px)`,animation:"fadeOut 0.8s ease-out forwards",animationDelay:`${a*.03}s`}},a))})]})}),e>=4&&t.jsx("div",{className:"fixed inset-0 pointer-events-none",children:[...Array(80)].map((r,a)=>{const o=["bg-yellow-400","bg-pink-400","bg-blue-400","bg-green-400","bg-purple-400","bg-red-400","bg-orange-400","bg-cyan-400"],n=["rounded-full","rounded-none","rounded-sm"],l=Math.random()*100,d=2.5+Math.random()*2,c=Math.random()*.3,m=Math.random()*360,u=Math.random()>.5?"w-2 h-2":"w-3 h-3",h=-30+Math.random()*60;return t.jsx("div",{className:`absolute ${u} ${o[a%o.length]} ${n[a%n.length]}`,style:{left:`${l}%`,top:"-20px",transform:`rotate(${m}deg)`,animation:`confettiFall ${d}s ease-in forwards`,animationDelay:`${c}s`,opacity:.9,"--wobble":`${h}px`}},a)})}),t.jsxs("div",{className:`transition-all duration-700 delay-500 ${e>=3?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[t.jsx("h1",{className:"text-6xl font-bold text-white mb-6 tracking-tight",children:"Booking Confirmed!"}),t.jsx("div",{className:"w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 opacity-60"})]}),t.jsxs("div",{className:`transition-all duration-700 delay-700 ${e>=4?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[t.jsx("p",{className:"text-2xl text-white font-light mb-4",children:"Thank you for your booking!"}),t.jsx("p",{className:"text-lg text-purple-100 font-light max-w-md mx-auto leading-relaxed",children:"Your booking has been confirmed and will reach by your appointment date. We appreciate your business."})]}),t.jsxs("div",{className:`mt-16 flex justify-center gap-4 transition-all duration-700 delay-1000 ${e>=4?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[t.jsx("div",{className:"w-3 h-3 bg-white rounded-full animate-bounce",style:{animationDelay:"0s",animationDuration:"2s"}}),t.jsx("div",{className:"w-3 h-3 bg-white rounded-full animate-bounce",style:{animationDelay:"0.2s",animationDuration:"2s"}}),t.jsx("div",{className:"w-3 h-3 bg-white rounded-full animate-bounce",style:{animationDelay:"0.4s",animationDuration:"2s"}})]})]}),t.jsx("style",{jsx:!0,children:`
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: rotate(var(--rotation)) translateY(-60px)
                            scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: rotate(var(--rotation)) translateY(-120px)
                            scale(0);
                    }
                }

                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(50vh) translateX(var(--wobble))
                            rotate(360deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh)
                            translateX(calc(var(--wobble) * 2)) rotate(720deg);
                        opacity: 0;
                    }
                }
            `})]})}export{x as default};
