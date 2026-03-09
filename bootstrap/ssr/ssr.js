import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, usePage, Head, useForm, router, createInertiaApp } from "@inertiajs/react";
import * as React from "react";
import { useState, useEffect, createContext, useContext, useMemo, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { X, Menu, ArrowRight, Phone, MapPin, Shield, Users, CheckCircle2, Clock, ChevronDown, Flame, MessageCircleMore, Touchpad, Hammer, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CalendarDays, ChevronRight, ShieldCheck, BadgeCheck, Clock4, PhoneCall, ArrowLeft, Home as Home$2, Building2, Castle, Building } from "lucide-react";
import { AiOutlineWhatsApp, AiOutlineQuestion } from "react-icons/ai";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transition, Dialog, TransitionChild, DialogPanel } from "@headlessui/react";
import { FiAward, FiHeart, FiTag, FiStar, FiShield, FiZap, FiInfo, FiLoader, FiCreditCard, FiHome, FiTool, FiClock, FiX, FiCheck, FiRefreshCcw, FiChevronLeft, FiChevronRight, FiXCircle, FiCalendar, FiMapPin, FiCheckSquare, FiCpu, FiPackage, FiCamera, FiCheckCircle, FiFileText, FiArrowRight, FiChevronDown } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { startOfDay, addMonths, startOfMonth, format, isSameDay } from "date-fns";
import { getDefaultClassNames, DayPicker } from "react-day-picker";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import createServer from "@inertiajs/server";
import { renderToString } from "react-dom/server";
const MEGA_SECTIONS = {
  services: [
    {
      title: "Boiler installation",
      description: "Fixed-price installs by engineers across Leeds & Surrounding.",
      href: "/#services"
    },
    {
      title: "Boiler repair & servicing",
      description: "Fast repairs and servicing with clear, upfront pricing.",
      href: "/#services"
    },
    {
      title: "Gas safety certificates",
      description: "Landlord and homeowner safety checks by qualified engineers.",
      href: "/#services"
    }
  ],
  about: [
    {
      title: "Why choose MD Gas?",
      description: "Local engineers focused on safety, clarity and care.",
      href: "/about"
    },
    {
      title: "Our qualifications",
      description: "Gas Safe Register 636354. Fully certified and insured.",
      href: "/about#qualification"
    },
    {
      title: "Our service areas",
      description: "Leeds & Surrounding areas only — fast local support.",
      href: "/about#services-area"
    }
  ],
  contact: [
    {
      title: "Engineer callback",
      description: "Request a callback and a local engineer will phone you back.",
      href: "/#contact"
    },
    {
      title: "WhatsApp chat 24/7",
      description: "Message us any time on WhatsApp for quick, clear help.",
      href: "/#contact"
    },
    {
      title: "Fixed-price quotes",
      description: "Simple questions, clear pricing, no pushy sales visits.",
      href: "/#contact"
    }
  ]
};
const NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];
function Header({
  textColor = "text-slate-900",
  buttonBg = "bg-dark",
  buttonText = "text-white",
  navInactive = "bg-white/80 text-slate-800",
  navActive = "bg-black text-white"
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const isMegaOpen = !!openMenu;
  const toggleMenu = (id) => {
    setOpenMenu((prev) => prev === id ? null : id);
  };
  const closeMega = () => setOpenMenu(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMega();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const currentCards = openMenu ? MEGA_SECTIONS[openMenu] : [];
  return /* @__PURE__ */ jsx("header", { className: "absolute top-4 w-full z-50", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-2 lg:px-6", children: [
      /* @__PURE__ */ jsx(Link, { href: "/", className: "w-[170px]", children: /* @__PURE__ */ jsx("img", { src: "/images/logo%20FIXED.png", alt: "MD Gas Leeds" }) }),
      /* @__PURE__ */ jsx("nav", { className: "hidden flex-1 items-center justify-center gap-3 md:flex z-50", children: NAV_ITEMS.map((item) => {
        const active = openMenu === item.id;
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleMenu(item.id),
            className: `rounded-full px-6 py-2 text-sm font-medium transition shadow-sm cursor-pointer ${active ? navActive : navInactive}
                                        `,
            children: item.label
          },
          item.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => window.open(
              "https://wa.me/447454796398",
              "_blank"
            ),
            className: `hidden gap-2 items-center rounded-full px-4 py-2 text-sm font-medium cursor-pointer ${buttonBg} ${buttonText} hover:opacity-80 transition sm:flex`,
            children: [
              /* @__PURE__ */ jsx(AiOutlineWhatsApp, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "WhatsApp 24/7" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "md:hidden rounded-full p-2 text-slate-700 hover:bg-white/60",
            onClick: () => {
              setMobileMenuOpen((open) => !open);
              closeMega();
            },
            children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
          }
        )
      ] })
    ] }),
    isMegaOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-20 bg-black/60 backdrop-blur-[1px]",
        onClick: closeMega
      }
    ),
    isMegaOpen && /* @__PURE__ */ jsx("div", { className: "pointer-events-auto hidden md:block", children: /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 z-30 w-full max-w-3xl -translate-x-1/2 px-4 pb-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-3xl bg-white shadow-xl", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:p-8 !pt-20", children: currentCards.map((card) => /* @__PURE__ */ jsxs(
      Link,
      {
        href: card.href,
        onClick: closeMega,
        className: "group flex flex-col justify-between rounded-2xl bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-slate-100 hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-base font-semibold text-slate-900", children: card.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: card.description })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-1", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) }) })
        ]
      },
      card.title
    )) }) }) }) }),
    mobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col space-y-2 px-4 py-4", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/#services",
          className: "rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
          onClick: () => setMobileMenuOpen(false),
          children: "Services"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/about",
          className: "rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
          onClick: () => setMobileMenuOpen(false),
          children: "About"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/#contact",
          className: "rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
          onClick: () => setMobileMenuOpen(false),
          children: "Contact"
        }
      )
    ] }) })
  ] }) });
}
function cn$2(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      className: cn$2(buttonVariants({ variant, size, className })),
      ref,
      ...props
    }
  );
});
Button.displayName = "Button";
function Footer() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { id: "contact", className: "bg-white border-t border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 lg:grid-cols-[1.2fr_0.8fr]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "inline-block", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/images/logo%20FIXED.png",
            alt: "MD Gas Leeds",
            className: "h-16 w-auto object-contain"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-slate-600 max-w-md", children: "Local boiler services for Leeds and surrounding areas. Fixed‑price quotes, tidy installs, and fast support." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/book",
              className: "inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700",
              children: "Get a fixed quote"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://wa.me/447454796398",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400",
              children: "WhatsApp 24/7"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 bg-slate-50 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100", children: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-emerald-700" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: "WhatsApp chat" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "24/7 support via WhatsApp" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://wa.me/447454796398",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-sm font-semibold text-emerald-700",
                children: "+44 7454 796398"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 bg-slate-50 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100", children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-emerald-700" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: "Service area" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Leeds & surrounding areas only" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "© ",
          currentYear,
          " MD Gas Leeds. All rights reserved."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1", children: "VAT No: 511 0588 26" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsx(Link, { href: "/about", className: "hover:text-slate-700", children: "About Us" }),
        /* @__PURE__ */ jsx(Link, { href: "/privacy-policy", className: "hover:text-slate-700", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { href: "/terms-conditions", className: "hover:text-slate-700", children: "Terms & Conditions" })
      ] })
    ] })
  ] }) });
}
const VALUES = [
  {
    icon: Shield,
    title: "Gas Safe, insured",
    description: "Gas Safe Register 636354. Fully certified and insured for every install and repair."
  },
  {
    icon: Users,
    title: "Local Leeds engineers",
    description: "We only cover Leeds & Surrounding areas, so response times stay fast and personal."
  },
  {
    icon: CheckCircle2,
    title: "Fixed‑price quotes",
    description: "Clear online pricing with no sales visits or surprise add‑ons."
  },
  {
    icon: Clock,
    title: "Faster installs",
    description: "Book this week. Next‑day installs available when ordered before 3pm."
  }
];
const STATS = [
  { label: "Years serving Leeds", value: "8+" },
  { label: "Local jobs completed", value: "2,000+" },
  { label: "Boilers installed", value: "850+" },
  { label: "Support available", value: "24/7" }
];
const SERVICES = [
  {
    title: "New boiler installs",
    description: "Fixed‑price packages with tidy installs and clear handover."
  },
  {
    title: "Boiler repairs",
    description: "Fast diagnosis, upfront labour rates, parts priced fairly."
  },
  {
    title: "Boiler servicing",
    description: "Annual safety checks to keep your boiler efficient and protected."
  },
  {
    title: "Power flushes",
    description: "Restore heat, improve flow, and protect new boilers long‑term."
  }
];
function AboutPage() {
  const { props } = usePage();
  const pageTitle2 = props.pageTitle ?? "About";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: pageTitle2 }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen rounded-b-3xl bg-slate-50 text-slate-900", children: [
      /* @__PURE__ */ jsx(Header, { title: pageTitle2 }),
      /* @__PURE__ */ jsxs("main", { className: "w-full", children: [
        /* @__PURE__ */ jsxs("section", { className: "relative pt-40 pb-16 px-4 sm:px-6 lg:px-0 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-20 left-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-7", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700", children: "About MD Gas" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("h1", { className: "text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900", children: "Local boiler experts for Leeds & Surrounding." }),
                /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600 max-w-xl", children: "We install, repair, and service boilers with clear prices, tidy workmanship, and no sales visits. Everything is built to be simple, fast, and local." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                "Gas Safe Register 636354",
                "WhatsApp or callback only",
                "Fixed‑price quotes online",
                "All prices include VAT",
                "Next‑day installs before 3pm"
              ].map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
                    item
                  ]
                },
                item
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    asChild: true,
                    size: "lg",
                    className: "rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700",
                    children: /* @__PURE__ */ jsx(Link, { href: "/book", children: "Get a fixed quote" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    asChild: true,
                    size: "lg",
                    variant: "outline",
                    className: "rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:border-slate-300",
                    children: /* @__PURE__ */ jsx(Link, { href: "/#contact", children: "WhatsApp or callback" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/images/engineers-image.jpg",
                    alt: "Local Gas Safe engineer",
                    className: "h-[420px] w-full object-cover",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute top-5 left-5 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-lg", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Gas Safe" }),
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-slate-900", children: "636354" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "absolute bottom-5 right-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-500", children: "Fully insured" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Work protected" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4", children: STATS.map((stat) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold text-slate-900", children: stat.value }),
                    /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-slate-500", children: stat.label })
                  ]
                },
                stat.label
              )) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700", children: "Why MD Gas" }),
            /* @__PURE__ */ jsx("h2", { className: "mt-3 text-3xl sm:text-4xl font-semibold text-slate-900", children: "Built around clarity and trust." }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-slate-600", children: "Everything we do is designed to be straight‑forward, local, and reliable." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: VALUES.map((value) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm", children: /* @__PURE__ */ jsx(value.icon, { className: "h-6 w-6" }) }),
                /* @__PURE__ */ jsx("h3", { className: "mt-5 text-lg font-semibold text-slate-900", children: value.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-slate-600", children: value.description })
              ]
            },
            value.title
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700", children: "What we do" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-slate-900", children: "Boiler services with clean pricing and tidy installs." }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600", children: "We focus on the services Leeds homeowners need most, delivered by Gas Safe engineers with no sales pressure." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: SERVICES.map((service) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900", children: service.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: service.description })
              ]
            },
            service.title
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700", children: "Our promise" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-slate-900", children: "Straight answers. Clean installs. No sales visit." }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600", children: "We keep things simple: clear pricing online, local engineers who show up on time, and tidy, respectful installs. If you need help, it’s WhatsApp or a call back — no phone queues." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  className: "rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700",
                  children: /* @__PURE__ */ jsx(Link, { href: "/book", children: "Get a fixed quote" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  variant: "outline",
                  className: "rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:border-slate-300",
                  children: /* @__PURE__ */ jsx(Link, { href: "/#contact", children: "WhatsApp or callback" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-6 -right-6 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" }),
            /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/images/landing-20boiler.png",
                alt: "Boiler installation",
                className: "h-[320px] w-full object-contain p-8",
                loading: "lazy"
              }
            ) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700", children: "Returns & refunds" }),
              /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-slate-900", children: "Simple, fair, and clear." }),
              /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-600", children: "If plans change, we keep it straightforward. We take payment upfront and we accept Klarna." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: [
              {
                title: "Before work starts",
                text: "Cancel any time and we’ll refund your payment in full. No fees."
              },
              {
                title: "Payment",
                text: "We take payment upfront and can accept Klarna to spread the cost."
              },
              {
                title: "After completion",
                text: "All installs include workmanship cover and manufacturer warranties apply to the boiler itself."
              }
            ].map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: item.text })
                ]
              },
              item.title
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2", children: "Questions? Message us on WhatsApp or request a callback." }),
            /* @__PURE__ */ jsx(Link, { className: "text-emerald-700 font-semibold", href: "/#contact", children: "Contact us" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs("section", { className: "relative py-14 sm:py-16 overflow-hidden rounded-b-3xl", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-emerald-600" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" }),
          /* @__PURE__ */ jsxs("div", { className: "relative max-w-3xl mx-auto px-4 text-center text-white", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold", children: "Ready for a fixed‑price quote?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-white/90", children: "Answer a few questions online and pick a package that suits your home." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  className: "rounded-full bg-white px-10 text-emerald-700 hover:bg-emerald-50",
                  children: /* @__PURE__ */ jsx(Link, { href: "/book", children: "Start your quote" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  variant: "outline",
                  className: "rounded-full border-white/60 px-10 text-white hover:bg-white/10",
                  children: /* @__PURE__ */ jsx(Link, { href: "/#contact", children: "WhatsApp or callback" })
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AboutPage
}, Symbol.toStringTag, { value: "Module" }));
function ApplicationLogo({ className = "", alt = "Logo", ...props }) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: "/assets/logo.png",
      alt,
      className: `select-none ${className}`,
      loading: "lazy",
      decoding: "async",
      ...props
    }
  );
}
const DropDownContext = createContext();
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, { value: { open, setOpen, toggleOpen }, children: /* @__PURE__ */ jsx("div", { className: "relative", children }) });
};
const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: toggleOpen, children }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => setOpen(false)
      }
    )
  ] });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white",
  children
}) => {
  const { open, setOpen } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Transition,
    {
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "opacity-0 scale-95",
      enterTo: "opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "opacity-100 scale-100",
      leaveTo: "opacity-0 scale-95",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`,
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-md ring-1 ring-black ring-opacity-50 ` + contentClasses,
              children
            }
          )
        }
      )
    }
  ) });
};
const DropdownLink = ({ className = "", children, ...props }) => {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " + className,
      children
    }
  );
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " + (active ? "border-indigo-400 text-gray-900 focus:border-indigo-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700") + className,
      children
    }
  );
}
function ResponsiveNavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: `flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${active ? "border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800" : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800"} text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`,
      children
    }
  );
}
const cn$1 = (...c) => c.filter(Boolean).join(" ");
function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState({
    pricing: false,
    bookings: false
  });
  const bookingHref = (status) => route("admin.orders.management", { status });
  const nav = useMemo(
    () => [
      {
        key: "dashboard",
        type: "link",
        label: "Dashboard",
        href: route("dashboard"),
        isActive: () => route().current("dashboard")
      },
      {
        key: "pricing",
        type: "dropdown",
        label: "Pricing",
        items: [
          {
            key: "pricing.base",
            label: "Base Price Management",
            href: route("pricing.base"),
            isActive: () => route().current("pricing.base")
          },
          {
            key: "pricing.radiators",
            label: "Power flush Price Management",
            href: route("pricing.radiators"),
            isActive: () => route().current("pricing.radiators")
          },
          {
            key: "pricing.new.quote",
            label: "New Quote Price Management",
            href: route("admin.pricing.index"),
            isActive: () => route().current("admin.pricing.index")
          },
          {
            key: "pricing.boiler.catalogue",
            label: "Boiler Catalogue",
            href: route("admin.boilers.index"),
            isActive: () => route().current("admin.boilers.index")
          },
          {
            key: "pricing.checkout.coupons",
            label: "Checkout Coupons",
            href: route("admin.coupons.index"),
            isActive: () => route().current("admin.coupons.index")
          }
          // add more pricing items here later
        ]
      },
      {
        key: "bookings",
        type: "dropdown",
        label: "Bookings",
        items: [
          {
            key: "bookings.confirmed",
            label: "Confirmed Booking",
            href: bookingHref("confirmed"),
            isActive: () => route().current("admin.orders.management") && route().params?.status === "confirmed"
          },
          {
            key: "bookings.pending",
            label: "Pending Booking",
            href: bookingHref("pending"),
            isActive: () => route().current("admin.orders.management") && route().params?.status === "pending"
          },
          {
            key: "bookings.cancelled",
            label: "Cancelled Booking",
            href: bookingHref("cancelled"),
            isActive: () => route().current("admin.orders.management") && route().params?.status === "cancelled"
          },
          {
            key: "bookings.all",
            label: "All Bookings",
            href: bookingHref("all"),
            isActive: () => route().current("admin.orders.management") && (route().params?.status === "all" || !route().params?.status)
          }
        ]
      },
      {
        key: "scheduling",
        type: "link",
        label: "Scheduling",
        href: route("admin.scheduling.index"),
        isActive: () => route().current("admin.scheduling.index")
      }
    ],
    []
  );
  const toggleMobileSection = (key) => {
    setMobileOpen((s) => ({ ...s, [key]: !s[key] }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsx("style", { children: `input { padding: 10px; }` }),
    /* @__PURE__ */ jsxs("nav", { className: "border-b border-gray-100 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "block h-9 w-auto fill-current text-gray-800" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden sm:-my-px sm:ms-10 sm:flex items-center space-x-8", children: nav.map((node) => {
            if (node.type === "link") {
              return /* @__PURE__ */ jsx(
                NavLink,
                {
                  href: node.href,
                  active: node.isActive?.(),
                  children: node.label
                },
                node.key
              );
            }
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative group h-full flex items-center",
                children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      className: cn$1(
                        "inline-flex items-center gap-1 h-full px-1 text-sm font-medium",
                        "hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300",
                        "focus:outline-none transition"
                      ),
                      children: [
                        node.label,
                        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn$1(
                        "absolute left-0 top-full z-50 mt-2 w-56 rounded-xl bg-white",
                        "border border-gray-100 shadow-lg opacity-0 invisible",
                        "group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      ),
                      children: node.items.map((item, idx) => /* @__PURE__ */ jsx(
                        NavLink,
                        {
                          href: item.href,
                          active: item.isActive?.(),
                          className: cn$1(
                            "block px-4 py-2.5 text-sm hover:bg-gray-50",
                            idx === 0 && "rounded-t-xl",
                            idx === node.items.length - 1 && "rounded-b-xl"
                          ),
                          children: item.label
                        },
                        item.key
                      ))
                    }
                  )
                ]
              },
              node.key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:ms-6 sm:flex sm:items-center", children: /* @__PURE__ */ jsx("div", { className: "relative ms-3", children: /* @__PURE__ */ jsxs(Dropdown, { children: [
          /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-md", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none",
              children: [
                user.name,
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "-me-0.5 ms-2 h-4 w-4",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    )
                  }
                )
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsxs(Dropdown.Content, { children: [
            /* @__PURE__ */ jsx(
              Dropdown.Link,
              {
                href: route("profile.edit"),
                children: "Profile"
              }
            ),
            /* @__PURE__ */ jsx(
              Dropdown.Link,
              {
                href: route("logout"),
                method: "post",
                as: "button",
                children: "Log Out"
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "-me-2 flex items-center sm:hidden", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowingNavigationDropdown(
              (prev) => !prev
            ),
            className: "inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none",
            children: /* @__PURE__ */ jsxs(
              "svg",
              {
                className: "h-6 w-6",
                stroke: "currentColor",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      className: !showingNavigationDropdown ? "inline-flex" : "hidden",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M4 6h16M4 12h16M4 18h16"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      className: showingNavigationDropdown ? "inline-flex" : "hidden",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M6 18L18 6M6 6l12 12"
                    }
                  )
                ]
              }
            )
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: (showingNavigationDropdown ? "block" : "hidden") + " sm:hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-1 pb-3 pt-2", children: nav.map((node) => {
              if (node.type === "link") {
                return /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    href: node.href,
                    active: node.isActive?.(),
                    children: node.label
                  },
                  node.key
                );
              }
              const sectionKey = node.key;
              const isOpen = !!mobileOpen[sectionKey];
              return /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleMobileSection(sectionKey),
                    className: cn$1(
                      "w-full flex items-center justify-between rounded-lg px-3 py-2",
                      "text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { children: node.label }),
                      /* @__PURE__ */ jsx(
                        ChevronDown,
                        {
                          className: cn$1(
                            "h-4 w-4 transition",
                            isOpen ? "rotate-180" : ""
                          )
                        }
                      )
                    ]
                  }
                ),
                isOpen ? /* @__PURE__ */ jsx("div", { className: "mt-1 rounded-lg border border-gray-100 bg-white", children: node.items.map((item, idx) => /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    href: item.href,
                    active: item.isActive?.(),
                    className: cn$1(
                      "block px-4 py-2 text-sm hover:bg-gray-50",
                      idx === 0 && "rounded-t-lg",
                      idx === node.items.length - 1 && "rounded-b-lg"
                    ),
                    children: item.label
                  },
                  item.key
                )) }) : null
              ] }, node.key);
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 pb-1 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
                /* @__PURE__ */ jsx("div", { className: "text-base font-medium text-gray-800", children: user.name }),
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-500", children: user.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
                /* @__PURE__ */ jsx(ResponsiveNavLink, { href: route("profile.edit"), children: "Profile" }),
                /* @__PURE__ */ jsx(
                  ResponsiveNavLink,
                  {
                    method: "post",
                    href: route("logout"),
                    as: "button",
                    children: "Log Out"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    ] }),
    header ? /* @__PURE__ */ jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: header }) }) : null,
    /* @__PURE__ */ jsx("main", { children })
  ] });
}
function BasePrice({ prices = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { currencySymbol } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    service: "",
    price: ""
  });
  const openEditModal = (item) => {
    setEditingItem(item);
    setData({
      service: item.service,
      price: item.price
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Base Price" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Base Price" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full border", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ jsx("th", { className: "border px-4 py-2 text-left", children: "Service" }),
            /* @__PURE__ */ jsx("th", { className: "border px-4 py-2 text-left", children: "Price" }),
            /* @__PURE__ */ jsx("th", { className: "border px-6 py-3 text-center", children: "Edit" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: prices.filter((item) => item.service !== "New Boiler Quote").map((item) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "border px-4 py-2", children: item.service }),
            /* @__PURE__ */ jsxs("td", { className: "border px-4 py-2 font-semibold", children: [
              currencySymbol,
              " ",
              item.price
            ] }),
            /* @__PURE__ */ jsx("td", { className: "border px-6 py-3 text-center", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "inline-flex items-center rounded-lg\n                                                    bg-indigo-50 px-3 py-1.5 text-sm font-medium\n                                                    text-indigo-600 hover:bg-indigo-100 transition",
                onClick: () => openEditModal(item),
                children: "Edit"
              }
            ) })
          ] }, item.id)) })
        ] }) }) }) }) }),
        showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-xl bg-white p-6 shadow-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Edit Base Price" }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Service" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.service,
                disabled: true,
                className: "mt-1 w-full rounded-lg border-gray-300 bg-gray-100"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700", children: [
              "Price (",
              currencySymbol,
              ")"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.price,
                onChange: (e) => setData("price", e.target.value),
                className: "mt-1 w-full rounded-lg border border-gray-300"
              }
            ),
            errors.price && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: errors.price })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closeModal,
                className: "rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: processing,
                onClick: () => post(route("pricing.update", editingItem.id), {
                  onSuccess: () => closeModal()
                }),
                className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm\n                                font-medium text-white hover:bg-indigo-700 disabled:opacity-50",
                children: "Update"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BasePrice
}, Symbol.toStringTag, { value: "Module" }));
const COMBI_INCLUDES = [
  "Magnetic filter",
  "Scale reducer",
  "Shock arrestor",
  // "Standard horizontal flue",
  // "Basic wireless programmable thermostat",
  "Chemical flush + inhibitor",
  "Old boiler removal & disposal",
  "Commissioning + registration"
];
const COMBI_NOTES = [];
const SYSTEM_HEAT_INCLUDES = [
  "Magnetic system filter",
  "Chemical system flush + inhibitor",
  "Old boiler removal & disposal",
  "Hot water cylinder connection (existing)",
  "System boiler commissioning",
  "Gas Safe registration",
  "Building Control compliance certificate",
  "Manufacturer warranty registration"
];
const SYSTEM_HEAT_NOTES = [];
const PRODUCTS = [
  // Ideal Atlantic (Combi) — keep fixed prices from your existing catalogue
  {
    id: "ideal_atlantic_24",
    type: "combi",
    brand: "Ideal",
    model: "Atlantic Combi",
    warrantyYears: 5,
    kw: 24,
    priceType: "fixed",
    basePrice: 1599,
    images: ["/assets/productImages/ideal-atlantic-combi.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "ideal_atlantic_30",
    type: "combi",
    brand: "Ideal",
    model: "Atlantic Combi",
    warrantyYears: 5,
    kw: 30,
    priceType: "fixed",
    basePrice: 1699,
    images: ["/assets/productImages/ideal-atlantic-combi.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "ideal_atlantic_35",
    type: "combi",
    brand: "Ideal",
    model: "Atlantic Combi",
    warrantyYears: 5,
    kw: 35,
    priceType: "fixed",
    basePrice: 1849,
    images: ["/assets/productImages/ideal-atlantic-combi.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  // Worcester Bosch Greenstar 1000 Combi — price unknown (null)
  {
    id: "wb_greenstar_1000_24",
    type: "combi",
    brand: "Worcester Bosch",
    model: "Greenstar 1000 Combi",
    warrantyYears: 5,
    kw: 24,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/greenstar-boiler.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "wb_greenstar_1000_30",
    type: "combi",
    brand: "Worcester Bosch",
    model: "Greenstar 1000 Combi",
    warrantyYears: 5,
    kw: 30,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/greenstar-boiler.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "wb_greenstar_1000_35",
    type: "combi",
    brand: "Worcester Bosch",
    model: "Greenstar 8000+",
    warrantyYears: 12,
    kw: 36,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/greenstar-boiler8000.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  // Ideal Logic Max Combi — price unknown (null)
  {
    id: "ideal_logic_max_24",
    type: "combi",
    brand: "Ideal",
    model: "Logic Max Combi",
    warrantyYears: 10,
    kw: 24,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/max-combi-image.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "ideal_logic_max_30",
    type: "combi",
    brand: "Ideal",
    model: "Logic Max Combi",
    warrantyYears: 10,
    kw: 30,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/max-combi-image.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  {
    id: "ideal_logic_max_35",
    type: "combi",
    brand: "Ideal",
    model: "Logic Max Combi",
    warrantyYears: 10,
    kw: 35,
    priceType: "variable",
    basePrice: null,
    images: ["/assets/productImages/max-combi-image.png"],
    includes: COMBI_INCLUDES,
    notes: COMBI_NOTES
  },
  // Ideal Logic System2 — price unknown in your new list (null)
  // (Pricing engine will use boilerCost + margin when you provide costs)
  {
    id: "ideal_system2_15",
    type: "system",
    brand: "Ideal",
    model: "Logic System2",
    warrantyYears: 2,
    kw: 15,
    priceType: "cost_plus",
    boilerCost: null,
    minMargin: 750,
    images: ["/assets/productImages/system-image.png"],
    includes: SYSTEM_HEAT_INCLUDES,
    notes: SYSTEM_HEAT_NOTES
  },
  {
    id: "ideal_system2_18",
    type: "system",
    brand: "Ideal",
    model: "Logic System2",
    warrantyYears: 2,
    kw: 18,
    priceType: "cost_plus",
    boilerCost: null,
    minMargin: 750,
    images: ["/assets/productImages/system-image.png"],
    includes: SYSTEM_HEAT_INCLUDES,
    notes: SYSTEM_HEAT_NOTES
  },
  {
    id: "ideal_system2_24",
    type: "system",
    brand: "Ideal",
    model: "Logic System2",
    warrantyYears: 2,
    kw: 24,
    priceType: "cost_plus",
    boilerCost: null,
    minMargin: 750,
    images: ["/assets/productImages/system-image.png"],
    includes: SYSTEM_HEAT_INCLUDES,
    notes: SYSTEM_HEAT_NOTES
  },
  // Baxi Heat Only 415 — price unknown (null) until trade list
  {
    id: "baxi_heat_415",
    type: "heat_only",
    brand: "Baxi",
    model: "415 Heat Only",
    warrantyYears: 5,
    kw: 15,
    priceType: "cost_plus",
    boilerCost: null,
    minMargin: 750,
    images: ["/assets/productImages/baxi-image.png"],
    includes: SYSTEM_HEAT_INCLUDES,
    notes: SYSTEM_HEAT_NOTES
  }
];
const TYPE_OPTIONS = [
  { value: "combi", label: "Combi" },
  { value: "system", label: "System" },
  { value: "heat_only", label: "Heat Only" }
];
const PRICE_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "variable", label: "Variable" },
  { value: "cost_plus", label: "Cost Plus" }
];
function slugify(v) {
  return String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function listToText(v) {
  return Array.isArray(v) ? v.join("\n") : "";
}
function textToList(v) {
  return String(v || "").split("\n").map((x) => x.trim()).filter(Boolean);
}
function toNum(v) {
  if (v === "" || v === null || v === void 0) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function normalizeForSave(p) {
  const fallbackId = [p.brand, p.model, p.kw].map(slugify).filter(Boolean).join("_");
  return {
    id: (p.id || fallbackId || "new_boiler").trim(),
    type: p.type || "combi",
    brand: (p.brand || "").trim(),
    model: (p.model || "").trim(),
    warrantyYears: Number(p.warrantyYears || 0),
    kw: Number(p.kw || 0),
    priceType: p.priceType || "fixed",
    basePrice: toNum(p.basePrice),
    boilerCost: toNum(p.boilerCost),
    minMargin: toNum(p.minMargin),
    images: textToList(p.imagesText),
    includes: textToList(p.includesText),
    notes: textToList(p.notesText)
  };
}
function toEditorRow(p) {
  return {
    ...p,
    basePrice: p.basePrice ?? "",
    boilerCost: p.boilerCost ?? "",
    minMargin: p.minMargin ?? "",
    imagesText: listToText(p.images),
    includesText: listToText(p.includes),
    notesText: listToText(p.notes)
  };
}
function blankProduct() {
  return toEditorRow({
    id: "",
    type: "combi",
    brand: "",
    model: "",
    warrantyYears: 5,
    kw: 24,
    priceType: "fixed",
    basePrice: "",
    boilerCost: "",
    minMargin: "",
    images: [],
    includes: [],
    notes: []
  });
}
function blankProductForType(type = "combi") {
  const kwByType = {
    combi: 24,
    system: 18,
    heat_only: 15
  };
  return {
    ...blankProduct(),
    type,
    kw: kwByType[type] ?? 24,
    priceType: type === "combi" ? "fixed" : "cost_plus"
  };
}
function labelType(type) {
  return TYPE_OPTIONS.find((x) => x.value === type)?.label || type;
}
function BoilerCatalog() {
  const { catalogOverride } = usePage().props;
  const initial = useMemo(() => {
    const source = Array.isArray(catalogOverride) && catalogOverride.length ? catalogOverride : PRODUCTS;
    return source.map(toEditorRow);
  }, [catalogOverride]);
  const [products, setProducts] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openAdvanced, setOpenAdvanced] = useState({});
  const normalizedQuery = query.trim().toLowerCase();
  const filteredWithIndex = useMemo(() => {
    return products.map((p, idx) => ({ p, idx })).filter(({ p }) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (!normalizedQuery) return true;
      return [p.id, p.brand, p.model, p.type, p.kw].map((v) => String(v || "").toLowerCase()).join(" ").includes(normalizedQuery);
    });
  }, [products, typeFilter, normalizedQuery]);
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const { p, idx } of filteredWithIndex) {
      const type = p.type || "other";
      const kw = Number(p.kw) || 0;
      if (!map.has(type)) map.set(type, /* @__PURE__ */ new Map());
      if (!map.get(type).has(kw)) map.get(type).set(kw, []);
      map.get(type).get(kw).push({ p, idx });
    }
    const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([type, kwMap]) => ({
      type,
      buckets: Array.from(kwMap.entries()).sort(([a], [b]) => Number(a) - Number(b)).map(([kw, items]) => ({
        kw,
        items: items.sort(({ p: x }, { p: y }) => `${x.brand} ${x.model}`.localeCompare(`${y.brand} ${y.model}`))
      }))
    }));
    return sorted;
  }, [filteredWithIndex]);
  const update = (idx, field, value) => {
    setProducts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };
  const addProduct = (type = "combi") => {
    setProducts((prev) => [...prev, blankProductForType(type)]);
  };
  const removeProduct = (idx) => {
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };
  const saveCatalog = () => {
    setSaving(true);
    router.post(
      route("admin.boilers.save"),
      {
        products: products.map(normalizeForSave)
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false)
      }
    );
  };
  const resetCatalog = () => {
    router.post(route("admin.boilers.reset"), {}, { preserveScroll: true });
  };
  const toggleAdvanced = (idx) => {
    setOpenAdvanced((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Boiler Catalogue" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Boiler Catalogue" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Boiler Catalogue Management" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600 leading-relaxed", children: "Simple mode for day-to-day updates. Boilers are grouped by type and kW below." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Total boilers" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 text-xl font-bold text-slate-900", children: products.length })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Showing" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 text-xl font-bold text-slate-900", children: filteredWithIndex.length })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Groups" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 text-xl font-bold text-slate-900", children: grouped.length })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => addProduct("combi"),
                  className: "rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white",
                  children: "+ Add Combi"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => addProduct("system"),
                  className: "rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700",
                  children: "+ Add System"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => addProduct("heat_only"),
                  className: "rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700",
                  children: "+ Add Heat Only"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: saveCatalog,
                  disabled: saving,
                  className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60",
                  children: saving ? "Saving..." : "Save catalogue"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: resetCatalog,
                  className: "rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700",
                  children: "Reset to defaults"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  placeholder: "Search by brand/model/id",
                  className: "rounded-xl border border-slate-300 px-3 py-2 text-sm"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: typeFilter,
                  onChange: (e) => setTypeFilter(e.target.value),
                  className: "rounded-xl border border-slate-300 px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "all", children: "All types" }),
                    TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setQuery("");
                    setTypeFilter("all");
                  },
                  className: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700",
                  children: "Clear filters"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            grouped.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600", children: "No boilers found for this filter." }),
            grouped.map((group) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 uppercase", children: labelType(group.type) }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-4", children: group.buckets.map((bucket) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700", children: [
                  bucket.kw,
                  " kW • ",
                  bucket.items.length,
                  " item",
                  bucket.items.length === 1 ? "" : "s"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: bucket.items.map(({ p, idx }) => {
                  const showBasePrice = p.priceType === "fixed" || p.priceType === "variable";
                  const showCostPlus = p.priceType === "cost_plus";
                  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-slate-900", children: [
                        p.brand || "New brand",
                        " ",
                        p.model || "New model"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleAdvanced(idx),
                            className: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700",
                            children: openAdvanced[idx] ? "Hide advanced" : "Advanced"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removeProduct(idx),
                            className: "rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50",
                            children: "Remove"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [
                      /* @__PURE__ */ jsx("select", { value: p.type, onChange: (e) => update(idx, "type", e.target.value), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm", children: TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) }),
                      /* @__PURE__ */ jsx("input", { value: p.brand, onChange: (e) => update(idx, "brand", e.target.value), placeholder: "brand", className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }),
                      /* @__PURE__ */ jsx("input", { value: p.model, onChange: (e) => update(idx, "model", e.target.value), placeholder: "model", className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }),
                      /* @__PURE__ */ jsx("input", { value: p.kw, type: "number", min: "1", onChange: (e) => update(idx, "kw", e.target.value), placeholder: "kW", className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }),
                      /* @__PURE__ */ jsx("input", { value: p.warrantyYears, type: "number", min: "0", onChange: (e) => update(idx, "warrantyYears", e.target.value), placeholder: "warranty years", className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }),
                      /* @__PURE__ */ jsx("select", { value: p.priceType, onChange: (e) => update(idx, "priceType", e.target.value), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm", children: PRICE_TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: p.basePrice,
                          onChange: (e) => update(idx, "basePrice", e.target.value),
                          placeholder: showBasePrice ? "base price (required)" : "base price (optional)",
                          className: `rounded-lg border px-3 py-2 text-sm ${showBasePrice ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: p.boilerCost,
                          onChange: (e) => update(idx, "boilerCost", e.target.value),
                          placeholder: showCostPlus ? "boiler cost (required)" : "boiler cost (optional)",
                          className: `rounded-lg border px-3 py-2 text-sm ${showCostPlus ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: p.minMargin,
                          onChange: (e) => update(idx, "minMargin", e.target.value),
                          placeholder: showCostPlus ? "min margin (required)" : "min margin (optional)",
                          className: `rounded-lg border px-3 py-2 text-sm ${showCostPlus ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300"}`
                        }
                      )
                    ] }),
                    openAdvanced[idx] && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            value: p.id,
                            onChange: (e) => update(idx, "id", e.target.value),
                            placeholder: "ID (leave blank to auto-generate)",
                            className: "rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          }
                        ),
                        /* @__PURE__ */ jsx("textarea", { value: p.imagesText, onChange: (e) => update(idx, "imagesText", e.target.value), rows: 4, placeholder: "Image URLs (one per line)", className: "rounded-lg border border-slate-300 px-3 py-2 text-xs" }),
                        /* @__PURE__ */ jsx("textarea", { value: p.includesText, onChange: (e) => update(idx, "includesText", e.target.value), rows: 4, placeholder: "Includes (one per line)", className: "rounded-lg border border-slate-300 px-3 py-2 text-xs" })
                      ] }),
                      /* @__PURE__ */ jsx("textarea", { value: p.notesText, onChange: (e) => update(idx, "notesText", e.target.value), rows: 3, placeholder: "Notes (one per line)", className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs" })
                    ] })
                  ] }, `${p.id || "new"}-${idx}`);
                }) })
              ] }, `${group.type}-${bucket.kw}`)) })
            ] }, group.type))
          ] })
        ] })
      ]
    }
  );
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BoilerCatalog
}, Symbol.toStringTag, { value: "Module" }));
function CheckoutCoupons() {
  const { coupons = [] } = usePage().props;
  const createForm = useForm({
    code: "",
    discount_type: "fixed",
    discount_value: "",
    is_active: true,
    starts_at: "",
    ends_at: "",
    notes: ""
  });
  const activeCount = useMemo(
    () => coupons.filter((c) => c.is_active).length,
    [coupons]
  );
  const saveNew = (e) => {
    e.preventDefault();
    createForm.post(route("admin.coupons.store"), {
      preserveScroll: true,
      onSuccess: () => createForm.reset()
    });
  };
  const updateCoupon = (coupon, patch) => {
    router.put(
      route("admin.coupons.update", coupon.id),
      {
        code: patch.code ?? coupon.code,
        discount_type: patch.discount_type ?? coupon.discount_type,
        discount_value: patch.discount_value ?? coupon.discount_value,
        is_active: patch.is_active ?? coupon.is_active,
        starts_at: patch.starts_at ?? coupon.starts_at,
        ends_at: patch.ends_at ?? coupon.ends_at,
        notes: patch.notes ?? coupon.notes
      },
      { preserveScroll: true }
    );
  };
  const removeCoupon = (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    router.delete(route("admin.coupons.destroy", coupon.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "New Boiler Checkout Coupons" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Checkout Coupons" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Coupon Codes" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "These apply only to new boiler checkout." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm font-semibold text-slate-700", children: [
              "Active: ",
              activeCount,
              " / Total: ",
              coupons.length
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: saveNew, className: "rounded-2xl border border-gray-200 bg-white p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Add coupon" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: createForm.data.code,
                  onChange: (e) => createForm.setData("code", e.target.value.toUpperCase()),
                  placeholder: "Code (e.g. SPRING150)",
                  className: "rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: createForm.data.discount_type,
                  onChange: (e) => createForm.setData("discount_type", e.target.value),
                  className: "rounded-lg border border-slate-300 px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "fixed", children: "Fixed amount (£)" }),
                    /* @__PURE__ */ jsx("option", { value: "percent", children: "Percent (%)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: createForm.data.discount_value,
                  onChange: (e) => createForm.setData("discount_value", e.target.value),
                  placeholder: createForm.data.discount_type === "percent" ? "Discount %" : "Discount £",
                  className: "rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "datetime-local",
                  value: createForm.data.starts_at,
                  onChange: (e) => createForm.setData("starts_at", e.target.value),
                  className: "rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "datetime-local",
                  value: createForm.data.ends_at,
                  onChange: (e) => createForm.setData("ends_at", e.target.value),
                  className: "rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              ),
              /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: createForm.data.is_active,
                    onChange: (e) => createForm.setData("is_active", e.target.checked)
                  }
                ),
                "Active"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: createForm.data.notes,
                onChange: (e) => createForm.setData("notes", e.target.value),
                placeholder: "Notes (optional)",
                rows: 2,
                className: "mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              }
            ),
            Object.values(createForm.errors).length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700", children: Object.values(createForm.errors)[0] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: createForm.processing,
                className: "mt-3 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60",
                children: createForm.processing ? "Saving..." : "Create coupon"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "px-5 py-3 border-b border-gray-100 font-semibold text-gray-900", children: "Existing coupons" }),
            /* @__PURE__ */ jsxs("div", { className: "divide-y", children: [
              coupons.map((coupon) => /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      defaultValue: coupon.code,
                      onBlur: (e) => updateCoupon(coupon, { code: e.target.value }),
                      className: "rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      defaultValue: coupon.discount_type,
                      onChange: (e) => updateCoupon(coupon, { discount_type: e.target.value }),
                      className: "rounded-lg border border-slate-300 px-2.5 py-2 text-sm",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "fixed", children: "Fixed" }),
                        /* @__PURE__ */ jsx("option", { value: "percent", children: "Percent" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      defaultValue: coupon.discount_value,
                      onBlur: (e) => updateCoupon(coupon, { discount_value: e.target.value }),
                      className: "rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "datetime-local",
                      defaultValue: coupon.starts_at ? String(coupon.starts_at).slice(0, 16) : "",
                      onBlur: (e) => updateCoupon(coupon, { starts_at: e.target.value || null }),
                      className: "rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "datetime-local",
                      defaultValue: coupon.ends_at ? String(coupon.ends_at).slice(0, 16) : "",
                      onBlur: (e) => updateCoupon(coupon, { ends_at: e.target.value || null }),
                      className: "rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: !!coupon.is_active,
                          onChange: (e) => updateCoupon(coupon, { is_active: e.target.checked })
                        }
                      ),
                      "Active"
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeCoupon(coupon),
                        className: "rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-600",
                        children: "Delete"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    defaultValue: coupon.notes || "",
                    onBlur: (e) => updateCoupon(coupon, { notes: e.target.value }),
                    placeholder: "Notes",
                    rows: 1,
                    className: "mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs"
                  }
                )
              ] }, coupon.id)),
              coupons.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-4 text-sm text-slate-500", children: "No coupons created yet." })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CheckoutCoupons
}, Symbol.toStringTag, { value: "Module" }));
const cn = (...c) => c.filter(Boolean).join(" ");
function money$1(amount, currency = "GBP") {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 2
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
function formatUkDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}
function formatUkDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(d);
}
function Spinner({ className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className: cn("h-4 w-4 animate-spin text-slate-600", className),
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            className: "opacity-25",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4",
            fill: "none"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          }
        )
      ]
    }
  );
}
function Badge({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200"
  };
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        map[tone] || map.slate
      ),
      children
    }
  );
}
function SmallButton({ children, className, ...props }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: cn(
        "rounded-xl border px-3.5 py-2 text-sm font-semibold transition",
        "bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      ),
      children
    }
  );
}
function CopyText({ value }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value || "");
      setOk(true);
      setTimeout(() => setOk(false), 900);
    } catch {
    }
  };
  if (!value) return /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "—" });
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ jsx("span", { className: "truncate", children: value }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: copy,
        className: cn(
          "rounded-lg border px-2 py-0.5 text-xs font-semibold transition",
          ok ? "bg-green-50 border-green-200 text-green-700" : "hover:bg-slate-50"
        ),
        title: "Copy",
        children: ok ? "Copied" : "Copy"
      }
    )
  ] });
}
function normalizePagination(paginated) {
  const meta = paginated?.meta || null;
  const arrLinks = Array.isArray(paginated?.links) ? paginated.links : null;
  const objLinks = !arrLinks && paginated?.links && typeof paginated.links === "object" ? paginated.links : null;
  let links = arrLinks;
  if (!links && objLinks) {
    links = [
      { url: objLinks.prev || null, label: "Previous", active: false },
      { url: objLinks.next || null, label: "Next", active: false }
    ];
  }
  return { meta, links };
}
function Pagination({ paginated }) {
  const { links } = normalizePagination(paginated);
  console.log("Bookings Data", paginated);
  const current = paginated.current_page || 1;
  const last = paginated.last_page || 1;
  const prevUrl = links.find((l) => String(l.label || "").toLowerCase().includes("previous"))?.url || null;
  const nextUrl = links.find((l) => String(l.label || "").toLowerCase().includes("next"))?.url || null;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-600", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: paginated.from || 0 }),
      "–",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: paginated.to || 0 }),
      " of",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: paginated.total || 0 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 sm:hidden", children: [
      /* @__PURE__ */ jsx(SmallButton, { disabled: !prevUrl, onClick: () => prevUrl && router.visit(prevUrl, { preserveScroll: true }), children: "Previous" }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-slate-50 px-3 py-2 text-sm text-slate-700", children: [
        "Page ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: current }),
        " / ",
        last
      ] }),
      /* @__PURE__ */ jsx(SmallButton, { disabled: !nextUrl, onClick: () => nextUrl && router.visit(nextUrl, { preserveScroll: true }), children: "Next" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden items-center gap-1 sm:flex", children: links.map((l, idx) => {
      const isDisabled = !l.url;
      const isActive = !!l.active;
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: isDisabled,
          onClick: () => l.url && router.visit(l.url, { preserveScroll: true }),
          className: cn(
            "min-w-[40px] rounded-xl border px-3 py-2 text-sm font-semibold transition",
            isActive && "bg-slate-900 text-white border-slate-900",
            !isActive && "bg-white hover:bg-slate-50",
            isDisabled && "cursor-not-allowed opacity-40"
          ),
          dangerouslySetInnerHTML: { __html: l.label }
        },
        idx
      );
    }) })
  ] });
}
const PAYMENT_OPTIONS = [
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" }
];
const APPOINTMENT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  //   { value: "no_show", label: "No show" },
  { value: "cancelled", label: "Cancelled" }
];
function Management() {
  const { bookings, filters, flash } = usePage().props;
  const [openId, setOpenId] = useState(null);
  const [saving, setSaving] = useState({ id: null, field: null });
  const rows = useMemo(() => bookings?.data || [], [bookings]);
  const onSearch = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    router.get(
      "/admin/order/management",
      {
        q: fd.get("q") || "",
        per_page: fd.get("per_page") || 10
      },
      { preserveScroll: true, preserveState: true, replace: true }
    );
  };
  const updateStatus = (bookingId, field, value) => {
    setSaving({ id: bookingId, field });
    router.put(route("admin.orders.management.status", bookingId), { [field]: value }, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => setSaving({ id: null, field: null })
    });
  };
  function JsonPill({ label: label2, value }) {
    if (!value) return null;
    let text = "";
    try {
      text = typeof value === "string" ? value : JSON.stringify(value);
    } catch {
      text = String(value);
    }
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
        label2,
        ":"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "truncate max-w-[260px]", children: text })
    ] });
  }
  function ProductSection({ booking }) {
    const products = booking?.products || [];
    if (!products.length) return null;
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-4 sm:col-span-2", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-extrabold text-slate-900", children: "Product" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: products.map((p) => {
        const includes = Array.isArray(p.includes) ? p.includes : [];
        const images = Array.isArray(p.images) ? p.images : [];
        const addOns = Array.isArray(p.add_ons) ? p.add_ons : Array.isArray(p.addOns) ? p.addOns : [];
        const derivedList = [];
        const derivedSeen = /* @__PURE__ */ new Set();
        addOns.forEach((a) => {
          const d = a?.derived;
          if (!d) return;
          const key = (() => {
            try {
              return JSON.stringify(d);
            } catch {
              return String(d);
            }
          })();
          if (!derivedSeen.has(key)) {
            derivedSeen.add(key);
            derivedList.push(d);
          }
        });
        const addOnsTotal = addOns.reduce((sum, a) => sum + Number(a?.total || 0), 0);
        return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-extrabold text-slate-900", children: [
                  p.brand ? `${p.brand} ` : "",
                  p.model || p.boiler_id || "Product"
                ] }),
                p.kw != null ? /* @__PURE__ */ jsxs(Badge, { tone: "blue", children: [
                  p.kw,
                  " kW"
                ] }) : null,
                p.warranty_years != null ? /* @__PURE__ */ jsxs(Badge, { tone: "purple", children: [
                  p.warranty_years,
                  " yr warranty"
                ] }) : null,
                p.amount != null ? /* @__PURE__ */ jsxs(Badge, { tone: "green", children: [
                  "Base: ",
                  money$1(p.amount, booking.currency)
                ] }) : null,
                addOnsTotal ? /* @__PURE__ */ jsxs(Badge, { tone: "yellow", children: [
                  "Add-ons: ",
                  money$1(addOnsTotal, booking.currency)
                ] }) : null
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-slate-500", children: [
                "Boiler ID: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: p.boiler_id || "—" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: images?.[0] ? /* @__PURE__ */ jsx(
              "img",
              {
                src: images[0],
                alt: p.model || p.boiler_id || "Product image",
                className: "h-14 w-14 rounded-xl border object-contain bg-white",
                loading: "lazy"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-xl border bg-slate-50 flex items-center justify-center text-xs text-slate-500", children: "No image" }) })
          ] }),
          includes.length ? /* @__PURE__ */ jsxs("div", { className: "border-t bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-extrabold text-slate-700 mb-2", children: "Included" }),
            /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: includes.map((it, idx) => /* @__PURE__ */ jsx("li", { className: "rounded-xl border bg-white px-3 py-2 text-sm text-slate-700", children: it }, idx)) })
          ] }) : null,
          /* @__PURE__ */ jsxs("div", { className: "border-t bg-white p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-extrabold text-slate-700", children: "Add-ons" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Line items applied to this booking/product." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: derivedList.map((d, i) => /* @__PURE__ */ jsx(JsonPill, { label: "Flue Type", value: d }, i)) })
            ] }),
            !addOns.length ? /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm text-slate-600", children: "No add-ons." }) : /* @__PURE__ */ jsx("div", { className: "mt-3 overflow-x-auto rounded-xl border", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-slate-600", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Item" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Qty" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Unit" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: addOns.map((a) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 font-semibold text-slate-900", children: a.label || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: a.qty ?? 1 }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: money$1(a.unit_price, booking.currency) }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap font-extrabold text-slate-900", children: money$1(a.total, booking.currency) })
              ] }, a.id)) })
            ] }) })
          ] })
        ] }, p.id);
      }) })
    ] });
  }
  return /* @__PURE__ */ jsx(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Order Management" }) }),
      children: /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-6", children: [
        flash?.success ? /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex h-2 w-2 rounded-full bg-green-500" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Updated:" }),
          /* @__PURE__ */ jsx("span", { children: flash.success })
        ] }) }) : null,
        /* @__PURE__ */ jsx("form", { onSubmit: onSearch, className: "mb-5 rounded-2xl border bg-white p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_140px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-600", children: "Search" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                name: "q",
                defaultValue: filters?.q || "",
                placeholder: "Customer name, email, phone…",
                className: "w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-600", children: "Rows per page" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "per_page",
                defaultValue: filters?.per_page || 10,
                className: "w-full rounded-xl border px-3 py-2.5 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: 10, children: "10 rows" }),
                  /* @__PURE__ */ jsx("option", { value: 15, children: "15 rows" }),
                  /* @__PURE__ */ jsx("option", { value: 25, children: "25 rows" }),
                  /* @__PURE__ */ jsx("option", { value: 50, children: "50 rows" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "mt-0.5 rounded-xl bg-slate-900 px-2 py-2.5 text-sm font-semibold text-white hover:bg-slate-800",
              children: "Apply filters"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border bg-white p-6 text-sm text-slate-600", children: "No bookings found." }) : rows.map((b) => {
          const isOpen = openId === b.id;
          const isSavingRow = saving.id === b.id;
          const paymentTone = b.payment_status === "paid" ? "green" : b.payment_status === "pending" ? "yellow" : b.payment_status === "failed" ? "red" : b.payment_status === "refunded" ? "purple" : b.payment_status === "cancelled" ? "red" : "slate";
          const apptStatus = b.appointment?.status || "—";
          const apptTone = apptStatus === "confirmed" ? "green" : apptStatus === "pending" ? "yellow" : apptStatus === "cancelled" ? "red" : apptStatus === "completed" ? "blue" : apptStatus === "no_show" ? "purple" : "slate";
          const serviceName = b.appointment?.service?.service || b.appointment?.type || "—";
          const basePrice = b.total;
          const appointmentTime = b.appointment?.starts_at ? formatUkDateTime(b.appointment.starts_at) : b.appointment?.appointment_date ? formatUkDate(b.appointment.appointment_date) : "—";
          return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-sm font-extrabold text-slate-900", children: [
                    "Booking #",
                    b.id
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { tone: paymentTone, children: [
                    "Payment:",
                    " ",
                    PAYMENT_OPTIONS.find((o) => o.value === b.payment_status)?.label || b.payment_status || "—"
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { tone: apptTone, children: [
                    "Appointment:",
                    " ",
                    APPOINTMENT_OPTIONS.find((o) => o.value === apptStatus)?.label || apptStatus
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { tone: "blue", children: [
                    serviceName,
                    basePrice != null ? ` • ${money$1(basePrice, b.currency)}` : ""
                  ] }),
                  isSavingRow ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700", children: [
                    /* @__PURE__ */ jsx(Spinner, { className: "h-3.5 w-3.5" }),
                    "Saving…"
                  ] }) : ``
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-1 gap-1 text-sm text-slate-600 sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Customer:" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.full_name || "—" }),
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "text-slate-400", children: [
                      "(",
                      b.customer?.email || "—",
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Visit:" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: appointmentTime })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Total:" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-extrabold text-slate-900", children: money$1(b.total, b.currency) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
                SmallButton,
                {
                  className: cn(
                    "min-w-[140px]",
                    isOpen ? "bg-slate-900 hover:text-white border-slate-900 hover:bg-slate-800" : ""
                  ),
                  onClick: () => setOpenId(isOpen ? null : b.id),
                  children: isOpen ? "Hide details" : "View details"
                }
              ) })
            ] }),
            isOpen && /* @__PURE__ */ jsxs("div", { className: "border-t bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-2xl border bg-white p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-extrabold text-slate-900", children: "Quick Actions" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Update statuses without leaving this screen." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-600", children: "Appointment status" }),
                    /* @__PURE__ */ jsx(
                      "select",
                      {
                        value: apptStatus === "—" ? "pending" : apptStatus,
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm sm:w-[240px]",
                        disabled: isSavingRow || !b.appointment,
                        onChange: (e) => updateStatus(b.id, "appointment_status", e.target.value),
                        children: APPOINTMENT_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 flex items-center gap-2", children: isSavingRow ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Spinner, {}),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Saving changes…" })
                  ] }) : null })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-extrabold text-slate-900", children: "Customer" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm text-slate-700", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Name:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.full_name || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Email:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.email || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Phone:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.phone || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Street:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.address_line1 || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Address line 2:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.address_line2 || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Town / City:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.city || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "County:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.county || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Postcode:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.postcode || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Address:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.customer?.address_full || "—" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-extrabold text-slate-900", children: "Appointment" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm text-slate-700", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Service:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: serviceName }),
                      basePrice != null ? /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
                        " ",
                        "• Base: ",
                        money$1(basePrice, b.currency)
                      ] }) : null
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Service key:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.appointment?.service_key || "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Date:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.appointment?.appointment_date ? formatUkDate(b.appointment.appointment_date) : "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Starts at:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: b.appointment?.starts_at ? formatUkDateTime(b.appointment.starts_at) : "—" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Status:" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: APPOINTMENT_OPTIONS.find((o) => o.value === apptStatus)?.label || apptStatus })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ProductSection, { booking: b }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-4 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-extrabold text-slate-900", children: "Booking Details (Q/A)" }),
                  !b.details || b.details.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: "No details found." }) : /* @__PURE__ */ jsx("div", { className: "divide-y rounded-xl border bg-white", children: b.details.map((d) => {
                    const answer = d.answer_text ?? (d.answer_json ? JSON.stringify(d.answer_json) : null) ?? (d.media ? JSON.stringify(d.media) : null);
                    return /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: d.question_snapshot || d.frontend_key }),
                      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-slate-700 break-words", children: answer || "—" }),
                      d.amount ? /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-slate-500", children: [
                        "Amount impact:",
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: money$1(d.amount, b.currency) })
                      ] }) : null
                    ] }, d.id);
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-4 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-extrabold text-slate-900", children: "Transactions" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Tip: copy IDs for support and debugging." })
                  ] }),
                  !b.transactions || b.transactions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: "No transactions found." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
                    /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-slate-600", children: /* @__PURE__ */ jsxs("tr", { children: [
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Status" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Amount" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Provider" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Kind" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Session" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Payment Intent" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Charge" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Refund" }),
                      /* @__PURE__ */ jsx("th", { className: "px-3 py-2 whitespace-nowrap", children: "Created" })
                    ] }) }),
                    /* @__PURE__ */ jsx("tbody", { children: b.transactions.map((t) => /* @__PURE__ */ jsxs("tr", { className: "border-t align-top", children: [
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsx(
                        Badge,
                        {
                          tone: t.status === "succeeded" ? "green" : t.status === "processing" ? "yellow" : t.status === "failed" ? "red" : "slate",
                          children: t.status || "—"
                        }
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: money$1(t.amount, t.currency) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: t.provider || "—" }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: t.kind || "—" }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-xs text-slate-700", children: /* @__PURE__ */ jsx(CopyText, { value: t.provider_checkout_session_id }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-xs text-slate-700", children: /* @__PURE__ */ jsx(CopyText, { value: t.provider_payment_intent_id }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-xs text-slate-700", children: /* @__PURE__ */ jsx(CopyText, { value: t.provider_charge_id }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-xs text-slate-700", children: /* @__PURE__ */ jsx(CopyText, { value: t.provider_refund_id }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-xs text-slate-600 whitespace-nowrap", children: t.created_at ? formatUkDateTime(t.created_at) : "—" })
                    ] }, t.id)) })
                  ] }) })
                ] })
              ] })
            ] })
          ] }, b.id);
        }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border bg-white", children: /* @__PURE__ */ jsx(Pagination, { paginated: bookings }) })
      ] }) })
    }
  );
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Management
}, Symbol.toStringTag, { value: "Module" }));
const RULES = {
  MIN_MARGIN_SYSTEM_HEAT: 750,
  TRV_MAX_QTY: 13
};
const ADDONS = {
  TRV: { key: "trv", label: "TRV supply & fit", unitPrice: 35 },
  SMART_STAT: { key: "smart_stat", label: "Smart thermostat upgrade", unitPrice: 100 },
  // Flues
  COMBI_VERTICAL_FLUE: { key: "combi_vertical_flue", label: "Vertical flue (Combi)", unitPrice: 300 },
  SYS_HEAT_HORIZONTAL_FLUE: { key: "sys_heat_horizontal_flue", label: "Horizontal flue (System/Heat-only)", unitPrice: 150 },
  SYS_HEAT_VERTICAL_FLUE: { key: "sys_heat_vertical_flue", label: "Vertical flue (System/Heat-only)", unitPrice: 300 },
  // Client “later usage” items (configurable)
  BOILER_RELOCATION: { key: "boiler_relocation", label: "Boiler relocation", unitPrice: 800 },
  CONVERT_TO_COMBI: { key: "convert_to_combi", label: "Conversion to combi", unitPrice: 800 }
};
function fmt(v) {
  if (v === null || v === void 0) return "—";
  return String(v);
}
function getDefaultFor(tab, key) {
  if (tab === "rules") return RULES?.[key] ?? null;
  if (tab === "addons") {
    const [addonConst, field2] = key.split(".");
    return ADDONS?.[addonConst]?.[field2] ?? null;
  }
  const [id, field] = key.split(".");
  const p = PRODUCTS.find((x) => x.id === id);
  return p?.[field] ?? null;
}
function getEffective(defaultValue, overrideValue) {
  return overrideValue !== void 0 ? overrideValue : defaultValue;
}
function isMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
}
function EditorPanel({
  compact = false,
  tab,
  editKey,
  value,
  setValue,
  inputRef,
  groupOverrides,
  currentDefault,
  onSave,
  onReset,
  onClose
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${compact ? "" : "lg:sticky lg:top-6"} rounded-2xl border border-gray-200 bg-white overflow-hidden`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: "Editor" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Set an override value or reset to default." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Group" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-sm",
                  value: tab,
                  disabled: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Key" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-sm",
                  value: editKey,
                  disabled: true,
                  placeholder: "Select a key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Override Value" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  className: "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300",
                  value,
                  onChange: (e) => setValue(e.target.value),
                  placeholder: "Leave empty to use default",
                  inputMode: "decimal",
                  disabled: !editKey
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mt-1", children: "Blank = default. Server enforces numeric rules." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-100 p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Default" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 mt-1", children: fmt(currentDefault) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-100 p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Override" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 mt-1", children: editKey ? value === "" ? "—" : value : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-900 text-white p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-white/70", children: "Effective" }),
              /* @__PURE__ */ jsx("div", { className: "font-semibold mt-1", children: editKey ? fmt(getEffective(currentDefault, value === "" ? void 0 : value)) : "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onSave,
                className: "w-full px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-50",
                disabled: !editKey,
                children: "Save Override"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onReset(editKey),
                className: "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50",
                disabled: !editKey || groupOverrides[editKey] === void 0,
                children: "Reset"
              }
            ),
            compact ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50",
                children: "Close"
              }
            ) : null
          ] }),
          tab === "rules" && editKey === "TRV_MAX_QTY" ? /* @__PURE__ */ jsx("div", { className: "text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3", children: "TRV_MAX_QTY must be between 0 and 13 (enforced server-side)." }) : null
        ] })
      ]
    }
  );
}
function PricingOverrides() {
  const { overrides = {} } = usePage().props;
  const [tab, setTab] = useState("rules");
  const [query, setQuery] = useState("");
  const groupOverrides = overrides?.[tab] || {};
  const rulesRows = useMemo(
    () => [
      {
        key: "MIN_MARGIN_SYSTEM_HEAT",
        label: "Min margin (System/Heat-only)",
        help: "Applied to system/heat-only pricing."
      }
      //   {
      //     key: "TRV_MAX_QTY",
      //     label: "TRV max qty (0–13)",
      //     help: "Controls dropdown max for TRVs.",
      //   },
    ],
    []
  );
  const addonRows = useMemo(
    () => [
      { key: "TRV.unitPrice", label: "TRV unit price", help: "Per TRV supply & fit." },
      {
        key: "SMART_STAT.unitPrice",
        label: "Smart thermostat upgrade",
        help: "Applied if Smart selected."
      },
      {
        key: "COMBI_VERTICAL_FLUE.unitPrice",
        label: "Combi vertical flue",
        help: "Applied when flue_wall = No (Combi)."
      },
      {
        key: "SYS_HEAT_HORIZONTAL_FLUE.unitPrice",
        label: "System/Heat horizontal flue",
        help: "Only if you use it in logic."
      },
      {
        key: "SYS_HEAT_VERTICAL_FLUE.unitPrice",
        label: "System/Heat vertical flue",
        help: "Applied when flue_wall = No (System/Heat)."
      },
      {
        key: "BOILER_RELOCATION.unitPrice",
        label: "Boiler relocation",
        help: "Applied when moving boiler location."
      },
      {
        key: "CONVERT_TO_COMBI.unitPrice",
        label: "Convert to combi",
        help: "Applied if converting & not currently combi."
      }
    ],
    []
  );
  const productRows = useMemo(() => {
    const rows2 = [];
    for (const p of PRODUCTS) {
      if (p.priceType === "fixed" || p.priceType === "variable") {
        rows2.push({
          key: `${p.id}.basePrice`,
          label: `${p.brand} ${p.model} ${p.kw}kW basePrice`,
          help: `Type: ${p.type} • Price: ${p.priceType}`
        });
      }
      if (p.priceType === "cost_plus") {
        rows2.push({
          key: `${p.id}.boilerCost`,
          label: `${p.brand} ${p.model} ${p.kw}kW boilerCost`,
          help: `Type: ${p.type} • Price: cost_plus`
        });
        rows2.push({
          key: `${p.id}.minMargin`,
          label: `${p.brand} ${p.model} ${p.kw}kW minMargin`,
          help: `Type: ${p.type} • Price: cost_plus`
        });
      }
    }
    return rows2;
  }, []);
  const rows = tab === "rules" ? rulesRows : tab === "addons" ? addonRows : productRows;
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => `${r.label} ${r.key} ${r.help || ""}`.toLowerCase().includes(q)
    );
  }, [rows, query]);
  const [editKey, setEditKey] = useState("");
  const [value, setValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const inputRef = useRef(null);
  const currentDefault = editKey ? getDefaultFor(tab, editKey) : null;
  function startEdit(k) {
    setEditKey(k);
    const v = groupOverrides[k];
    setValue(v === void 0 || v === null ? "" : String(v));
    if (isMobile()) setDrawerOpen(true);
  }
  useEffect(() => {
    if (!editKey) return;
    const t = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select?.();
      }
    }, 80);
    return () => clearTimeout(t);
  }, [editKey, drawerOpen]);
  function save() {
    if (!editKey) return;
    router.post(
      route("admin.pricing.save"),
      { group: tab, key: editKey, value: value === "" ? null : value },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ["overrides", "pricingOverrides"] });
          if (isMobile()) setDrawerOpen(false);
        }
      }
    );
  }
  function reset(k) {
    if (!k) return;
    router.post(
      route("admin.pricing.reset"),
      { group: tab, key: k },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ["overrides", "pricingOverrides"] });
          if (isMobile()) setDrawerOpen(false);
        }
      }
    );
  }
  function closeDrawer() {
    setDrawerOpen(false);
  }
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Pricing Management For New Boiler Quote" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Pricing Management For New Boiler Quote" }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Pricing Overrides" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 mt-1", children: "Defaults come from JS config. Overrides apply instantly on top." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["rules", "addons", "products"].map((t) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setTab(t);
                  setEditKey("");
                  setValue("");
                  setQuery("");
                },
                className: `px-4 py-2 rounded-xl border text-sm font-semibold transition ${tab === t ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}`,
                children: t.toUpperCase()
              },
              t
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
            "input",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: `Search ${tab}…`,
              className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 rounded-2xl border border-gray-200 bg-white overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-gray-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: "Keys" }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500", children: [
                  filteredRows.length,
                  " items"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y", children: [
                filteredRows.map((r) => {
                  const defaultValue = getDefaultFor(tab, r.key);
                  const overrideValue = groupOverrides[r.key];
                  const hasOverride = overrideValue !== void 0;
                  const effectiveValue = getEffective(defaultValue, overrideValue);
                  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 truncate", children: r.label }),
                        /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-slate-500 font-mono break-all", children: r.key }),
                        r.help ? /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-slate-600", children: r.help }) : null
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-xs px-2 py-1 rounded-full border ${hasOverride ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600"}`,
                            children: hasOverride ? "Override ON" : "Default"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => startEdit(r.key),
                            className: "px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50",
                            children: "Edit"
                          }
                        ),
                        !isMobile() && hasOverride ? /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => reset(r.key),
                            className: "px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50",
                            children: "Reset"
                          }
                        ) : null
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-sm", children: [
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-100 p-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Default" }),
                        /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 mt-1", children: fmt(defaultValue) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-100 p-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Override" }),
                        /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 mt-1", children: hasOverride ? fmt(overrideValue) : "—" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-900 text-white p-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-white/70", children: "Effective" }),
                        /* @__PURE__ */ jsx("div", { className: "font-semibold mt-1", children: fmt(effectiveValue) })
                      ] })
                    ] })
                  ] }, r.key);
                }),
                !filteredRows.length ? /* @__PURE__ */ jsx("div", { className: "p-6 text-sm text-slate-600", children: "No matching items." }) : null
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:col-span-2", children: /* @__PURE__ */ jsx(
              EditorPanel,
              {
                tab,
                editKey,
                value,
                setValue,
                inputRef,
                groupOverrides,
                currentDefault,
                onSave: save,
                onReset: reset,
                onClose: closeDrawer
              }
            ) })
          ] }),
          drawerOpen ? /* @__PURE__ */ jsxs("div", { className: "lg:hidden fixed inset-0 z-[80]", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 bg-black/50",
                onClick: closeDrawer,
                role: "button",
                "aria-label": "Close",
                tabIndex: -1
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-gray-900", children: "Edit Override" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Tap outside to close." })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: closeDrawer,
                    className: "px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50",
                    children: "Close"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                EditorPanel,
                {
                  compact: true,
                  tab,
                  editKey,
                  value,
                  setValue,
                  inputRef,
                  groupOverrides,
                  currentDefault,
                  onSave: save,
                  onReset: reset,
                  onClose: closeDrawer
                }
              )
            ] })
          ] }) : null
        ] })
      ]
    }
  );
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PricingOverrides
}, Symbol.toStringTag, { value: "Module" }));
function RadiatorPrice({ radiators = [] }) {
  const { currencySymbol } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    label: "",
    price: ""
  });
  const openEditModal = (item) => {
    setEditingItem(item);
    setData({
      label: item.label,
      price: item.price
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Radiator Pricing" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Radiator Pricing" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full border", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100", children: [
            /* @__PURE__ */ jsx("th", { className: "border px-4 py-2 text-left", children: "Radiator Range" }),
            /* @__PURE__ */ jsx("th", { className: "border px-4 py-2 text-left", children: "Price" }),
            /* @__PURE__ */ jsx("th", { className: "border px-6 py-3 text-center", children: "Edit" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: radiators.map((item) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "border px-4 py-2", children: item.label }),
            /* @__PURE__ */ jsxs("td", { className: "border px-4 py-2 font-semibold", children: [
              currencySymbol,
              " ",
              item.price
            ] }),
            /* @__PURE__ */ jsx("td", { className: "border px-6 py-3 text-center", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "inline-flex items-center rounded-lg\n                                                    bg-indigo-50 px-3 py-1.5 text-sm font-medium\n                                                    text-indigo-600 hover:bg-indigo-100 transition",
                onClick: () => openEditModal(item),
                children: "Edit"
              }
            ) })
          ] }, item.id)) })
        ] }) }) }) }) }),
        showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-xl bg-white p-6 shadow-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Edit Radiator Price" }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Radiator Range" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.label,
                disabled: true,
                className: "mt-1 w-full rounded-lg border-gray-300 bg-gray-100"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700", children: [
              "Price (",
              currencySymbol,
              ")"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.price,
                onChange: (e) => setData("price", e.target.value),
                className: "mt-1 w-full rounded-lg border border-gray-300"
              }
            ),
            errors.price && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: errors.price })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: closeModal,
                className: "rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: processing,
                onClick: () => post(route("pricing.radiators.update", editingItem.id), {
                  onSuccess: () => closeModal()
                }),
                className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm\n                                font-medium text-white hover:bg-indigo-700 disabled:opacity-50",
                children: "Update"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RadiatorPrice
}, Symbol.toStringTag, { value: "Module" }));
function Scheduling({ settings = [], blackouts = [], services: services2 = {} }) {
  const { flash } = usePage().props;
  const [tab, setTab] = useState("rules");
  const { data, setData, post, processing } = useForm({
    settings
  });
  const { data: blackoutData, setData: setBlackoutData, post: postBlackout, processing: blackoutProcessing, reset: resetBlackout } = useForm({
    service_key: "",
    date: "",
    start_time: "",
    end_time: "",
    reason: ""
  });
  const onSaveSettings = () => {
    post(route("admin.scheduling.settings"));
  };
  const onAddBlackout = () => {
    postBlackout(route("admin.scheduling.blackouts.add"), {
      onSuccess: () => resetBlackout()
    });
  };
  const onDeleteBlackout = (id) => {
    router.delete(route("admin.scheduling.blackouts.delete", id));
  };
  const serviceOptions = Object.entries(services2);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Scheduling" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Scheduling" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm", children: ["rules", "blackouts"].map((key) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setTab(key),
                className: `px-4 py-2 text-sm font-semibold rounded-md ${tab === key ? "bg-emerald-100 text-emerald-700" : "text-gray-600"}`,
                children: key === "rules" ? "Rules" : "Blackouts"
              },
              key
            )) }),
            flash?.success && /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700", children: flash.success }),
            tab === "rules" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "How to set availability" }),
              /* @__PURE__ */ jsxs("ul", { className: "mt-2 list-disc space-y-1 pl-4 text-emerald-900", children: [
                /* @__PURE__ */ jsx("li", { children: "Set slot length and your working hours; that creates the day’s slots." }),
                /* @__PURE__ */ jsx("li", { children: "Installs automatically block the whole day. Other services only block their chosen slot." }),
                /* @__PURE__ */ jsx("li", { children: "Use “Max per day” to cap how many of that service you take." })
              ] })
            ] })
          ] }),
          tab === "rules" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            data.settings.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: item.service_label }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                    "Service key: ",
                    item.service_key
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700", children: "Simple: set slot length & hours" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-gray-600", children: [
                "Slots every ",
                /* @__PURE__ */ jsxs("strong", { children: [
                  item.slot_minutes || 60,
                  " mins"
                ] }),
                " between ",
                /* @__PURE__ */ jsxs("strong", { children: [
                  item.start_hour,
                  ":00"
                ] }),
                " and ",
                /* @__PURE__ */ jsxs("strong", { children: [
                  item.end_hour,
                  ":00"
                ] }),
                ". Max ",
                /* @__PURE__ */ jsx("strong", { children: item.max_per_day || 0 }),
                " per day."
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [
                /* @__PURE__ */ jsx(Field, { label: "Slot length", children: /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: item.slot_minutes,
                    onChange: (e) => updateSetting(idx, "slot_minutes", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2",
                    children: [30, 45, 60, 75, 90, 120].map((m) => /* @__PURE__ */ jsxs("option", { value: m, children: [
                      m,
                      " minutes"
                    ] }, m))
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Day starts", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    max: "23",
                    value: item.start_hour,
                    onChange: (e) => updateSetting(idx, "start_hour", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Day ends", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    max: "24",
                    value: item.end_hour,
                    onChange: (e) => updateSetting(idx, "end_hour", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Last slot starts (optional)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: item.last_slot_time || "",
                    onChange: (e) => updateSetting(idx, "last_slot_time", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Max per day", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    value: item.max_per_day,
                    onChange: (e) => updateSetting(idx, "max_per_day", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsxs(Field, { label: "Buffer (advanced)", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      value: item.gap_minutes,
                      onChange: (e) => updateSetting(idx, "gap_minutes", e.target.value),
                      className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-gray-500", children: "Leave at 0 unless you need extra prep/cleanup." })
                ] })
              ] })
            ] }, item.service_key)),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onSaveSettings,
                disabled: processing,
                className: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60",
                children: processing ? "Saving…" : "Save settings"
              }
            ) })
          ] }),
          tab === "blackouts" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm", children: [
                /* @__PURE__ */ jsx(Field, { label: "Service", children: /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: blackoutData.service_key,
                    onChange: (e) => setBlackoutData("service_key", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All services" }),
                      serviceOptions.map(([key, label2]) => /* @__PURE__ */ jsx("option", { value: key, children: label2 }, key))
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Date", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    value: blackoutData.date,
                    onChange: (e) => setBlackoutData("date", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Reason (optional)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: blackoutData.reason,
                    onChange: (e) => setBlackoutData("reason", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2",
                    placeholder: "Day off, training, emergency"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Start time (optional)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: blackoutData.start_time,
                    onChange: (e) => setBlackoutData("start_time", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "End time (optional)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: blackoutData.end_time,
                    onChange: (e) => setBlackoutData("end_time", e.target.value),
                    className: "w-full rounded-lg border border-gray-200 px-3 py-2"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onAddBlackout,
                  disabled: blackoutProcessing,
                  className: "rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-60",
                  children: blackoutProcessing ? "Adding…" : "Add blackout"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Upcoming blackouts" }),
              blackouts.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No blackouts set." }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: blackouts.map((b) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: b.reason || "Blackout" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-xs", children: [
                    b.service_key ? services2[b.service_key] || b.service_key : "All services",
                    " • ",
                    new Date(b.starts_at).toLocaleString(),
                    " — ",
                    new Date(b.ends_at).toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onDeleteBlackout(b.id),
                    className: "text-xs font-semibold text-red-600 hover:text-red-700",
                    children: "Remove"
                  }
                )
              ] }, b.id)) })
            ] })
          ] })
        ] }) })
      ]
    }
  );
  function updateSetting(index, key, value) {
    setData("settings", data.settings.map((row, i) => i === index ? { ...row, [key]: value } : row));
  }
}
function Field({ label: label2, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1 text-xs font-semibold text-gray-600", children: [
    /* @__PURE__ */ jsx("span", { children: label2 }),
    children
  ] });
}
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Scheduling
}, Symbol.toStringTag, { value: "Module" }));
function InputError({ message, className = "", ...props }) {
  return message ? /* @__PURE__ */ jsx(
    "p",
    {
      ...props,
      className: "text-sm text-red-600 " + className,
      children: message
    }
  ) : null;
}
function InputLabel({
  value,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "label",
    {
      ...props,
      className: `block text-sm font-medium text-gray-700 ` + className,
      children: value ? value : children
    }
  );
}
function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${disabled && "opacity-25"} ` + className,
      disabled,
      children
    }
  );
}
const TextInput = forwardRef(function TextInput2({ type = "text", className = "", isFocused = false, ...props }, ref) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus()
  }));
  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type,
      className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " + className,
      ref: localRef
    }
  );
});
function GuestLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col relative", children: [
    /* @__PURE__ */ jsx(Header, {}),
    children,
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Confirm Password" }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "This is a secure area of the application. Please confirm your password before continuing." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            className: "mt-1 block w-full",
            isFocused: true,
            onChange: (e) => setData("password", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center justify-end", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Confirm" }) })
    ] })
  ] });
}
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ConfirmPassword
}, Symbol.toStringTag, { value: "Module" }));
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Forgot Password" }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one." }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsx(
        TextInput,
        {
          id: "email",
          type: "email",
          name: "email",
          value: data.email,
          className: "mt-1 block w-full",
          isFocused: true,
          onChange: (e) => setData("email", e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center justify-end", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Email Password Reset Link" }) })
    ] })
  ] });
}
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
function Checkbox({ className = "", ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type: "checkbox",
      className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 " + className
    }
  );
}
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex justify-center items-center bg-gray-100 px-4", children: [
    /* @__PURE__ */ jsx(Head, { title: "Login" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white shadow-xl rounded-2xl p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary", children: /* @__PURE__ */ jsx(Flame, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "MD Gas" })
      ] }) }),
      status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "email",
              className: "text-sm font-medium text-gray-700",
              children: "Email"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              type: "email",
              value: data.email,
              className: "mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600",
              onChange: (e) => setData("email", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "password",
              className: "text-sm font-medium text-gray-700",
              children: "Password"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              type: "password",
              value: data.password,
              className: "mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600",
              onChange: (e) => setData("password", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: errors.password,
              className: "mt-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              name: "remember",
              checked: data.remember,
              onChange: (e) => setData("remember", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Remember me" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
          canResetPassword && /* @__PURE__ */ jsx(
            Link,
            {
              href: route("password.request"),
              className: "text-sm text-blue-600 hover:underline",
              children: "Forgot Password?"
            }
          ),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Log In" })
        ] })
      ] })
    ] })
  ] });
}
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "name",
            name: "name",
            value: data.name,
            className: "mt-1 block w-full",
            autoComplete: "name",
            isFocused: true,
            onChange: (e) => setData("name", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            className: "mt-1 block w-full",
            autoComplete: "username",
            onChange: (e) => setData("email", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            className: "mt-1 block w-full",
            autoComplete: "new-password",
            onChange: (e) => setData("password", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password_confirmation",
            value: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password_confirmation",
            type: "password",
            name: "password_confirmation",
            value: data.password_confirmation,
            className: "mt-1 block w-full",
            autoComplete: "new-password",
            onChange: (e) => setData("password_confirmation", e.target.value),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password_confirmation,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-end", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            children: "Already registered?"
          }
        ),
        /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Register" })
      ] })
    ] })
  ] });
}
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Reset Password" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            className: "mt-1 block w-full",
            autoComplete: "username",
            onChange: (e) => setData("email", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            className: "mt-1 block w-full",
            autoComplete: "new-password",
            isFocused: true,
            onChange: (e) => setData("password", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password_confirmation",
            value: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            type: "password",
            id: "password_confirmation",
            name: "password_confirmation",
            value: data.password_confirmation,
            className: "mt-1 block w-full",
            autoComplete: "new-password",
            onChange: (e) => setData("password_confirmation", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password_confirmation,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center justify-end", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-4", disabled: processing, children: "Reset Password" }) })
    ] })
  ] });
}
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword
}, Symbol.toStringTag, { value: "Module" }));
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Email Verification" }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another." }),
    status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Resend Verification Email" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("logout"),
          method: "post",
          as: "button",
          className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          children: "Log Out"
        }
      )
    ] }) })
  ] });
}
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VerifyEmail
}, Symbol.toStringTag, { value: "Module" }));
const BENEFITS = [
  {
    title: "Leeds specialists.",
    description: "Local engineers who know Leeds homes and install cleanly.",
    icon: FiAward,
    iconColor: "text-emerald-500"
  },
  {
    title: "WhatsApp-first support.",
    description: "Chat 24/7 on WhatsApp or request a callback.",
    icon: FiHeart,
    iconColor: "text-emerald-500"
  },
  {
    title: "Transparent pricing.",
    description: "Fixed‑price quotes with no hidden extras.",
    icon: FiTag,
    iconColor: "text-emerald-500"
  },
  {
    title: "Engineer callbacks.",
    description: "Need a call? A local engineer will call you back.",
    icon: FiStar,
    iconColor: "text-emerald-500"
  },
  {
    title: "Efficiency focused.",
    description: "Modern options that improve efficiency and reduce waste.",
    icon: FiShield,
    iconColor: "text-emerald-500"
  },
  {
    title: "Certified engineers.",
    description: "Fully qualified for boiler and heating work.",
    icon: FiZap,
    iconColor: "text-emerald-500"
  }
];
function WhyChooseUs() {
  return /* @__PURE__ */ jsxs("section", { className: "relative bg-white py-16 sm:py-20", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent" }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "mx-auto max-w-3xl text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700", children: "Why choose us" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900", children: "Built for Leeds & Surrounding homeowners" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm sm:text-base text-slate-600", children: "Clear pricing, direct contact, and tidy installs." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-14 grid gap-6 md:grid-cols-2 items-stretch", children: BENEFITS.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          "article",
          {
            className: "\n                                    relative flex h-full flex-col items-center gap-4 text-center\n                                    rounded-2xl border border-slate-200 \n                                    bg-white\n                                    p-5 sm:p-6 \n                                    shadow-[0_10px_30px_rgba(15,23,42,0.08)] \n                                    transition-colors duration-300 \n                                    hover:border-emerald-300\n                                ",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "\n                                        pointer-events-none\n                                        absolute inset-y-2 left-0\n                                        w-[3px]\n                                        rounded-full \n                                        bg-emerald-400\n                                        shadow-[0_0_8px_rgba(16,185,129,0.35)]\n                                    "
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50", children: /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-emerald-100", children: /* @__PURE__ */ jsx(
                Icon,
                {
                  className: `h-6 w-6 ${item.iconColor}`
                }
              ) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 items-center", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm sm:text-[15px] font-semibold text-slate-900", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-[13px] sm:text-sm leading-relaxed text-slate-600", children: item.description }),
                /* @__PURE__ */ jsx("div", { className: "flex-1" })
              ] })
            ]
          },
          item.title
        );
      }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-10 text-center text-base text-slate-500", children: "Local, transparent, and engineer‑led." })
    ] })
  ] });
}
function ServiceCards() {
  const steps = [
    {
      title: "You answer",
      description: "Answer a few quick questions about your home.",
      icon: MessageCircleMore,
      badge: "Start here",
      step: "STEP 01"
    },
    {
      title: "You pick",
      description: "Choose a fixed‑price package with clear costs.",
      icon: Touchpad,
      badge: "Choose",
      step: "STEP 02"
    },
    {
      title: "We fit",
      description: "A qualified engineer installs it clean and on time.",
      icon: Hammer,
      badge: "Installation",
      step: "STEP 03"
    }
  ];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "service-cards",
      className: "relative scroll-mt-24 overflow-hidden rounded-t-[45px] bg-slate-50 no-auto-dark-surface py-16 sm:py-24",
      children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-0", children: /* @__PURE__ */ jsx("div", { className: "grid gap-10 justify-items-center lg:grid-cols-1 lg:items-start", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-5 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-10", children: [
              "A clear online quote, without a sales visit.",
              /* @__PURE__ */ jsx("br", { className: "hidden sm:block" }),
              /* @__PURE__ */ jsx("span", { className: "block mt-2 text-emerald-600", children: "Local engineers, tidy installs, clear pricing." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg text-slate-600", children: "Book this week. Next‑day installs available when ordered before 3pm." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative mt-3", children: /* @__PURE__ */ jsx("div", { className: "relative grid gap-4 sm:grid-cols-3", children: steps.map((step) => {
            const Icon = step.icon;
            return /* @__PURE__ */ jsxs(
              "article",
              {
                className: "relative z-[1] flex h-full flex-col items-center rounded-[24px] bg-white no-auto-dark-card px-4 py-5 text-center sm:px-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-colors duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.35)]", children: /* @__PURE__ */ jsx(
                      Icon,
                      {
                        className: "h-5 w-5 text-white",
                        strokeWidth: 2.2
                      }
                    ) }),
                    /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600", children: step.badge })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-4 text-[18px] font-semibold text-slate-900", children: step.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-[14px] leading-relaxed text-slate-600", children: step.description }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-[5px] text-[11px] font-medium tracking-[0.16em] text-slate-600 uppercase", children: step.step }),
                    /* @__PURE__ */ jsx("span", { className: "h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-400/60 via-emerald-300/40 to-transparent" })
                  ] })
                ]
              },
              step.title
            );
          }) }) })
        ] }) }) })
      ]
    }
  );
}
const FAQ_LIST = [
  {
    q: "Who do you cover?",
    a: "Leeds and surrounding areas only, so we can keep response times fast and local."
  },
  {
    q: "How can I contact you?",
    a: "WhatsApp chat 24/7 or request an engineer callback. We don’t use phone queues or email forms."
  },
  {
    q: "What services do you provide?",
    a: "Boiler installation, servicing, repairs, power flushes, and heating upgrades."
  },
  {
    q: "Are you Gas Safe registered?",
    a: "Yes — Gas Safe Register number 636354. All work is completed by qualified engineers."
  },
  {
    q: "Do you offer fixed prices?",
    a: "Yes. Fixed‑price quotes with clear breakdowns and no hidden extras."
  },
  {
    q: "How fast can you install?",
    a: "Often within days, depending on availability and boiler choice."
  },
  {
    q: "Do you do emergency repairs?",
    a: "We’ll always try to help quickly. WhatsApp us and we’ll advise the fastest option."
  }
];
function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const displayedFaqs = showAll ? FAQ_LIST : FAQ_LIST.slice(0, 5);
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 py-20 rounded-b-[45px]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-16 max-w-3xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-emerald-600", children: "Leeds & Surrounding support" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 text-4xl sm:text-5xl font-bold text-slate-900", children: "Questions, answered" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: displayedFaqs.map((item, index) => {
      const isOpen = openIndex === index;
      const isNewItem = showAll && index >= 5;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative",
          style: isNewItem ? {
            animation: "faqFadeUp 0.45s ease-out forwards",
            animationDelay: `${(index - 5) * 70}ms`
          } : void 0,
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setOpenIndex(isOpen ? null : index),
                className: `
                                            group relative w-full cursor-pointer
                                            border
                                            px-8 pt-9 pb-6
                                            flex flex-col items-center gap-3
                                            text-center
                                            transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
                                            ${isOpen ? "bg-white border-emerald-200 shadow-[0_22px_50px_-30px_rgba(0,0,0,0.2)]" : "bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md"}
                                        `,
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `
                                                absolute left-1/2 top-3 -translate-x-1/2
                                                h-3 w-3 rounded-full
                                                transition-all duration-300
                                                ${isOpen ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-emerald-200"}
                                            `
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `
                                                text-lg transition-colors
                                                ${isOpen ? "font-semibold text-slate-900" : "font-medium text-slate-800"}
                                            `,
                      children: item.q
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `
                                                flex h-9 w-9 items-center justify-center
                                                rounded-full
                                                transition-all duration-300
                                                ${isOpen ? "bg-emerald-600 text-white rotate-180" : "bg-emerald-50 text-emerald-700"}
                                            `,
                      children: /* @__PURE__ */ jsx(IoChevronDown, { className: "text-lg" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `
                                            overflow-hidden transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
                                            ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}
                                        `,
                children: /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-sm bg-white px-6 py-5 text-[15px] leading-relaxed text-slate-600 text-center border border-slate-200 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)]", children: item.a })
              }
            )
          ]
        },
        index
      );
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 flex justify-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setShowAll((prev) => !prev);
          setOpenIndex(0);
        },
        className: "\n                            inline-flex items-center gap-3 cursor-pointer\n                            rounded-full\n                            border border-slate-300\n                            bg-white\n                            px-6 py-3\n                            text-sm font-semibold text-slate-900\n                            transition-all duration-300\n                            hover:border-emerald-300 hover:shadow-md\n                        ",
        children: [
          showAll ? "Show less questions" : "View all questions",
          /* @__PURE__ */ jsx(
            IoChevronDown,
            {
              className: `transition-transform duration-300 ${showAll ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ) })
  ] }) });
}
const renderStars = (rating = 0) => {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(Math.round(safe)) + "☆".repeat(5 - Math.round(safe));
};
const truncate = (text = "", max = 320) => {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
};
const initialsFromName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "GU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};
const formatRating = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(1);
};
function GoogleMark() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "h-6 w-6", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.6v2.99h3.87c2.26-2.08 3.57-5.15 3.57-8.62Z" }),
    /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-2.99c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.93H1.29v3.1A12 12 0 0 0 12 24Z" }),
    /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.28 14.32A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.38-2.32v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.78 1.29 5.42l3.99-3.1Z" }),
    /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 4.75c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.14 15.24 0 12 0A12 12 0 0 0 1.29 6.58l3.99 3.1c.95-2.83 3.6-4.93 6.72-4.93Z" })
  ] });
}
function GoogleReview({ theme = "light" }) {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isBlue = theme === "blue";
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/google-reviews", {
          headers: { Accept: "application/json" },
          credentials: "same-origin"
        });
        const data = await res.json();
        if (mounted) setPayload(data || null);
      } catch {
        if (mounted) setPayload(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const reviews = useMemo(() => {
    const all = Array.isArray(payload?.reviews) ? payload.reviews : [];
    return [...all].sort((a, b) => {
      const ta = a?.time ? new Date(a.time).getTime() : 0;
      const tb = b?.time ? new Date(b.time).getTime() : 0;
      return tb - ta;
    }).slice(0, 30);
  }, [payload]);
  useEffect(() => {
    setActiveIndex(0);
  }, [reviews.length]);
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [reviews.length]);
  const goPrev = () => {
    if (reviews.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };
  const goNext = () => {
    if (reviews.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };
  const activeReview = reviews[activeIndex] ?? null;
  if (loading) {
    return /* @__PURE__ */ jsx("section", { className: isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0", children: /* @__PURE__ */ jsx("div", { className: isBlue ? "rounded-[32px] border border-white/30 bg-[var(--qb-panel)] p-6 shadow-sm" : "rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: isBlue ? "h-12 w-44 rounded-2xl bg-white/20" : "h-12 w-44 rounded-2xl bg-slate-100" }),
        /* @__PURE__ */ jsx("div", { className: isBlue ? "h-32 rounded-[24px] bg-white/15" : "h-32 rounded-[24px] bg-slate-100" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: isBlue ? "h-[320px] rounded-[28px] bg-white/10" : "h-[320px] rounded-[28px] bg-slate-100" })
    ] }) }) }) });
  }
  if (!payload?.configured || reviews.length === 0 || !activeReview) return null;
  return /* @__PURE__ */ jsx("section", { className: isBlue ? "py-12 quote-page-bg" : "bg-slate-50 py-12 no-auto-dark-surface", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0", children: /* @__PURE__ */ jsx("div", { className: isBlue ? "overflow-hidden rounded-[32px] border border-white/30 bg-[var(--qb-panel)] shadow-sm" : "overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] no-auto-dark-card", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: isBlue ? "flex min-h-full flex-col border-b border-white/15 bg-white/8 p-6 lg:border-b-0 lg:border-r lg:border-r-white/15" : "flex min-h-full flex-col border-b border-slate-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r lg:border-r-slate-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: isBlue ? "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10" : "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white", children: /* @__PURE__ */ jsx(GoogleMark, {}) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: isBlue ? "text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70" : "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500", children: "Google Reviews" }),
          /* @__PURE__ */ jsx("h3", { className: isBlue ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900", style: isBlue ? { color: "#ffffff" } : void 0, children: payload.name || "MD Gas Leeds" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: isBlue ? "mt-6 rounded-[24px] border border-white/20 bg-white/10 p-5" : "mt-6 rounded-[24px] border border-slate-200 bg-white p-5", children: [
        /* @__PURE__ */ jsx("p", { className: isBlue ? "text-4xl font-bold text-white" : "text-4xl font-bold text-slate-900", children: formatRating(payload.rating) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg leading-none text-amber-500", children: renderStars(payload.rating) }),
        /* @__PURE__ */ jsx("p", { className: isBlue ? "mt-3 text-sm leading-6 text-cyan-100" : "mt-3 text-sm leading-6 text-slate-600", children: "Rated by homeowners in Leeds and surrounding areas." }),
        /* @__PURE__ */ jsxs("p", { className: isBlue ? "mt-2 text-xs font-medium text-white/70" : "mt-2 text-xs font-medium text-slate-500", children: [
          "Based on ",
          payload.user_ratings_total ?? "-",
          " verified Google reviews"
        ] })
      ] }),
      reviews.length > 1 ? /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-center gap-2", children: reviews.slice(0, Math.min(reviews.length, 5)).map((_, index) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveIndex(index),
          "aria-label": `Go to review ${index + 1}`,
          className: index === activeIndex ? isBlue ? "h-2.5 w-8 rounded-full bg-white" : "h-2.5 w-8 rounded-full bg-emerald-600" : isBlue ? "h-2.5 w-2.5 rounded-full bg-white/35" : "h-2.5 w-2.5 rounded-full bg-slate-300"
        },
        index
      )) }) : null,
      payload.maps_url ? /* @__PURE__ */ jsxs(
        "a",
        {
          href: payload.maps_url,
          target: "_blank",
          rel: "noreferrer",
          className: isBlue ? "mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 lg:mt-auto" : "mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 lg:mt-auto",
          children: [
            "View all on Google ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "↗" })
          ]
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6 lg:p-8", children: /* @__PURE__ */ jsxs("article", { className: isBlue ? "flex min-h-[320px] flex-col rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] p-6" : "flex min-h-[320px] flex-col rounded-[28px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-4", children: [
          activeReview.profile_photo_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: activeReview.profile_photo_url,
              alt: activeReview.author_name || "Google reviewer",
              className: isBlue ? "h-14 w-14 shrink-0 rounded-full border border-white/35 object-cover" : "h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover",
              loading: "lazy",
              referrerPolicy: "no-referrer"
            }
          ) : /* @__PURE__ */ jsx("div", { className: isBlue ? "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15 text-sm font-bold text-white" : "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700", children: initialsFromName(activeReview.author_name) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: isBlue ? "truncate text-lg font-semibold text-white" : "truncate text-lg font-semibold text-slate-900", children: activeReview.author_name }),
            /* @__PURE__ */ jsx("p", { className: isBlue ? "mt-1 text-sm text-cyan-100" : "mt-1 text-sm text-slate-500", children: activeReview.relative_time_description })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: isBlue ? "rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700", children: [
          activeIndex + 1,
          "/",
          reviews.length
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg leading-none text-amber-500", children: "★" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-[0.18em] text-amber-500", children: renderStars(activeReview.rating) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex-1", children: /* @__PURE__ */ jsxs("p", { className: isBlue ? "min-h-[168px] text-lg leading-8 text-white/95" : "min-h-[168px] text-lg leading-8 text-slate-700", children: [
        "“",
        truncate(activeReview.text, 320),
        "”"
      ] }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "mt-6 flex items-center justify-between gap-3 border-t pt-5",
          style: isBlue ? { borderColor: "rgba(255,255,255,0.18)" } : void 0,
          children: [
            /* @__PURE__ */ jsx("p", { className: isBlue ? "text-sm text-cyan-100" : "text-sm text-slate-500", children: "Real Google feedback helping customers choose with confidence." }),
            reviews.length > 1 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: goPrev,
                  className: isBlue ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20" : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100",
                  "aria-label": "Previous review",
                  children: "←"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: goNext,
                  className: isBlue ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20" : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100",
                  "aria-label": "Next review",
                  children: "→"
                }
              )
            ] }) : null
          ]
        }
      )
    ] }) })
  ] }) }) }) });
}
const UK_POSTCODE_RE$3 = /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2})|(?:[A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(?:[A-PR-UWYZ][0-9][A-HJKPSTUW])|(?:[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
const ALLOWED_OUTCODES$3 = ["LS", "BD", "WF", "HG"];
function normalizeUkPostcode$3(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length <= 3) return raw;
  return `${raw.slice(0, -3)} ${raw.slice(-3)}`.trim();
}
function isValidUkPostcode(value) {
  const v = String(value || "").trim().toUpperCase();
  return UK_POSTCODE_RE$3.test(v);
}
function getOutcode$3(value) {
  const v = String(value || "").trim().toUpperCase();
  if (!v) return "";
  if (v.includes(" ")) return v.split(" ")[0];
  if (v.length > 3) return v.slice(0, -3);
  return v;
}
function isAllowedOutcode$3(value) {
  const outcode = getOutcode$3(value);
  return ALLOWED_OUTCODES$3.some((prefix) => outcode.startsWith(prefix));
}
function Home$1() {
  const [postcode, setPostcode] = useState("");
  const [touched, setTouched] = useState(false);
  const { title } = usePage().props;
  const normalized = useMemo(() => normalizeUkPostcode$3(postcode), [postcode]);
  const validFormat = useMemo(
    () => isValidUkPostcode(normalized),
    [normalized]
  );
  const allowedArea = useMemo(
    () => isAllowedOutcode$3(normalized),
    [normalized]
  );
  const valid = validFormat && allowedArea;
  const submit = () => {
    setTouched(true);
    if (!valid) return;
    router.visit(
      `/book/quote/new?postcode=${encodeURIComponent(normalized)}`,
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { title, children: [
      /* @__PURE__ */ jsx(
        "script",
        {
          id: "shapo-embed-js",
          type: "text/javascript",
          src: "https://cdn.shapo.io/js/embed.js",
          defer: true
        }
      ),
      /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          id: "shapo-ratingschema-0206b0f6a8"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center bg-[#F7FAF9] px-4 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.3),transparent_45%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-4xl w-full text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-block mb-6 text-xs font-semibold tracking-widest text-primary uppercase", children: "Boiler installation, done properly" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[44px] md:text-[56px] lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.05]", children: "Heating, handled." }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto", children: "Get a fixed boiler price instantly. Installed by certified engineers — often next day." }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-3 md:p-4 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: normalized,
                onChange: (e) => {
                  setTouched(true);
                  setPostcode(e.target.value);
                },
                onBlur: () => setTouched(true),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                },
                placeholder: "Enter your postcode (LS/BD/WF/HG)",
                className: [
                  "w-full px-6 py-5 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 outline-none transition",
                  touched && normalized && !valid ? "ring-2 ring-red-200" : "focus:ring-2 focus:ring-slate-200"
                ].join(" "),
                inputMode: "text",
                autoComplete: "postal-code",
                spellCheck: false
              }
            ),
            touched && normalized && !valid && /* @__PURE__ */ jsx("div", { className: "mt-2 text-left text-sm text-red-600 font-semibold", children: !validFormat ? "Please enter a valid UK postcode." : "We currently only serve postcodes starting with LS, BD, WF, or HG." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: submit,
              className: [
                "px-8 py-5 rounded-2xl font-semibold transition flex items-center justify-center h-full",
                valid ? "bg-primary text-white hover:opacity-95" : "bg-slate-200 text-slate-500 cursor-not-allowed"
              ].join(" "),
              disabled: !valid,
              children: "Get instant quote →"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 text-center max-w-md", children: "Tip: We’ll use this to check availability and pricing in your area." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "-mt-6", children: /* @__PURE__ */ jsx(GoogleReview, {}) }),
    /* @__PURE__ */ jsx(WhyChooseUs, {}),
    /* @__PURE__ */ jsx(ServiceCards, {}),
    /* @__PURE__ */ jsx(Faq, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home$1
}, Symbol.toStringTag, { value: "Module" }));
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  Components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn$2(
        " group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn$2("w-fit", defaultClassNames.root),
        months: cn$2(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn$2(
          "flex w-full flex-col gap-4",
          defaultClassNames.month
        ),
        nav: cn$2(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn$2(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn$2(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn$2(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn$2(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn$2(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn$2(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn$2(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn$2("grid grid-cols-7", defaultClassNames.weekdays),
        weekday: cn$2(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn$2("mt-2 grid grid-cols-7 w-full", defaultClassNames.week),
        week_number_header: cn$2(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn$2(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn$2(
          "group/day relative h-[--cell-size] w-[--cell-size] select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn$2(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn$2(
          "rounded-none",
          defaultClassNames.range_middle
        ),
        range_end: cn$2(
          "bg-accent rounded-r-md",
          defaultClassNames.range_end
        ),
        today: cn$2(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn$2(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn$2(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn$2("invisible", defaultClassNames.hidden),
        ...classNames
      },
      Components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar",
              ref: rootRef,
              className: cn$2(className2),
              ...props2
            }
          );
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(
              ChevronLeftIcon,
              {
                className: cn$2("size-4", className2),
                ...props2
              }
            );
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(
              ChevronRightIcon,
              {
                className: cn$2("size-4", className2),
                ...props2
              }
            );
          }
          return /* @__PURE__ */ jsx(
            ChevronDownIcon,
            {
              className: cn$2("size-4", className2),
              ...props2
            }
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-[--cell-size] items-center justify-center text-center", children }) });
        },
        ...Components
      },
      ...props
    }
  );
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn$2(
        "data-[selected-single=true]:bg-light-grey data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-light-grey data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-light-grey data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex h-[--cell-size] w-[--cell-size] min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[1px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
const AppointmentDateRangePicker = ({ type, value, onChange }) => {
  const serviceKey = useMemo(() => {
    if (!type) return null;
    if (typeof type === "string") return type;
    return type.key || null;
  }, [type]);
  const today = useMemo(() => startOfDay(/* @__PURE__ */ new Date()), []);
  const maxDate = useMemo(() => addMonths(today, 2), [today]);
  const fromMonth = useMemo(() => startOfMonth(today), [today]);
  const toMonth = useMemo(() => startOfMonth(maxDate), [maxDate]);
  const [date, setDate] = useState(value?.date ? new Date(value.date) : null);
  const [time, setTime] = useState(value?.time || null);
  const [month, setMonth] = useState(() => startOfMonth(date || today));
  const [loading, setLoading] = useState(false);
  const [slotsByDay, setSlotsByDay] = useState({});
  const [error, setError] = useState(null);
  const lastAppliedRef = useRef({ date: null, time: null });
  const monthKey = useMemo(() => format(month, "yyyy-MM"), [month]);
  useEffect(() => {
    if (!serviceKey) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios.get("/appointments/availability", {
      params: { type: serviceKey, month: monthKey }
    }).then((res) => {
      if (cancelled) return;
      setSlotsByDay(res.data?.data?.days || {});
    }).catch(() => {
      if (cancelled) return;
      setError("Unable to load availability. Please try again.");
      setSlotsByDay({});
    }).finally(() => {
      if (cancelled) return;
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [serviceKey, monthKey]);
  const dayKey = date ? format(date, "yyyy-MM-dd") : null;
  const daySlots = dayKey ? slotsByDay[dayKey] || [] : [];
  useEffect(() => {
    const incomingDateStr = value?.date || null;
    const incomingTime = value?.time || null;
    const last = lastAppliedRef.current;
    if (incomingDateStr !== last.date || incomingTime !== last.time) {
      lastAppliedRef.current = {
        date: incomingDateStr,
        time: incomingTime
      };
      const nextDate = incomingDateStr ? new Date(incomingDateStr) : null;
      setDate(nextDate);
      setTime(incomingTime || null);
      if (nextDate) setMonth(startOfMonth(nextDate));
    }
  }, [value?.date, value?.time]);
  const emit = (d, t) => {
    onChange?.({
      date: d ? format(d, "yyyy-MM-dd") : null,
      time: t || null
    });
  };
  const disabled = useMemo(
    () => ({ before: today, after: maxDate }),
    [today, maxDate]
  );
  const selectDate = (d) => {
    if (!d) return;
    if (d < today || d > maxDate) return;
    if (date && isSameDay(d, date)) return;
    setDate(d);
    setTime(null);
    emit(d, null);
  };
  const selectTime = (t) => {
    if (!date) return;
    setTime(t);
    emit(date, t);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:h-[600px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 lg:px-6 py-4 border-b border-slate-200", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-slate-900 line-clamp-1", children: "Select a date and time" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 line-clamp-1", children: "Choose an available slot to confirm your appointment." })
      ] }),
      serviceKey ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border text-center border-slate-200 bg-slate-50 px-3 py-1 text-[10px] lg:text-xs font-medium text-slate-700 whitespace-nowrap", children: String(serviceKey).replaceAll("_", " ").toUpperCase() }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800", children: "Select service type first" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 items-stretch h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b lg:border-b-0 lg:border-r border-slate-200 p-5 sm:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 text-slate-700" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Calendar" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Next 2 months only" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-slate-200 bg-white p-0 md:p-3", children: /* @__PURE__ */ jsx(
          Calendar,
          {
            mode: "single",
            month,
            onMonthChange: setMonth,
            fromMonth,
            toMonth,
            selected: date,
            onSelect: selectDate,
            weekStartsOn: 1,
            disabled,
            className: "w-full",
            classNames: {
              disabled: "text-muted-foreground opacity-50"
            }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4", children: date && time ? /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-800", children: [
          "Your chosen appointment:",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: format(date, "EEEE do MMMM") }),
          " ",
          "at",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900", children: time })
        ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-700", children: "Please select a date and time to continue." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 sm:p-6 flex flex-col max-h-[510px] overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-slate-700" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Available times" })
          ] }),
          date ? /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-600", children: format(date, "EEEE, d MMM yyyy") }) : /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "No date selected" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-y-auto pr-1", children: !serviceKey ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-900", children: "Service type required" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 mt-1", children: "Select a service type to load availability." })
        ] }) : loading ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 w-44 bg-slate-100 rounded" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-lg" }),
            /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-lg" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Loading availability…" })
        ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-rose-200 bg-rose-50 p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-rose-900", children: "Something went wrong" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-rose-800 mt-1", children: error })
        ] }) : !date ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-900", children: "Select a date" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 mt-1", children: "Choose a date to see available time slots." })
        ] }) : daySlots.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-900", children: "No slots available" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 mt-1", children: "Try another day to find an open slot." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3", children: daySlots.map((t) => {
          const active = time === t;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => selectTime(t),
              "aria-pressed": active,
              className: cn$2(
                "rounded-lg border px-4 py-3 text-left transition-all",
                "bg-white hover:bg-slate-50",
                active ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              ),
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-900", children: t }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: active ? "Chosen slot" : "Tap to choose" })
                ] }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn$2(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      active ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                    ),
                    children: active ? "Selected" : "Available"
                  }
                )
              ] })
            },
            t
          );
        }) }) })
      ] })
    ] })
  ] });
};
const STEPS$2 = ["Choose", "Customise", "Book", "Complete"];
function PageHeader({ variant = "default", currentStep = 4 }) {
  const waHref = "https://wa.me/447454796398";
  const waNumber = "+447454796398";
  return /* @__PURE__ */ jsx(
    "header",
    {
      className: "page-header-clean border-b border-slate-200 bg-white",
      style: { backgroundColor: "#ffffff", borderBottomColor: "#e2e8f0" },
      children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 sm:px-8 lg:px-10", children: /* @__PURE__ */ jsxs("div", { className: "flex h-[75px] items-center justify-between", children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "w-[120px]", children: /* @__PURE__ */ jsx("img", { src: "/images/logo%20FIXED.png", alt: "MD Gas Leeds" }) }),
        variant === "results" && /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-3", children: STEPS$2.map((label2, i) => {
          const step = i + 1;
          const active = step === currentStep;
          const done = step < currentStep;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                                                ${done ? "bg-primary text-white" : active ? "border-2 border-primary text-primary" : "border border-gray-300 text-gray-400"}
                                            `,
                    children: step
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-sm ${active ? "font-semibold text-slate-900" : "text-gray-400"}`,
                    children: label2
                  }
                ),
                i !== STEPS$2.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-gray-300 mx-1" })
              ]
            },
            label2
          );
        }) }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: waHref,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            "aria-label": `Chat on WhatsApp ${waNumber}`,
            children: [
              /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "WhatsApp 24/7" })
            ]
          }
        )
      ] }) })
    }
  );
}
function BlueQuoteSkin({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "quote-blue-skin", children: [
    /* @__PURE__ */ jsx("style", { children: `
                .quote-blue-skin,
                .quote-blue-skin * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                .quote-blue-skin {
                    --qb-base: #00ABDB;
                    --qb-mid: #0098c4;
                    --qb-deep: #007ea3;
                    --qb-panel: #0089b2;
                    --qb-panel-dark: #00779b;
                    --qb-option: #0082a8;
                    --qb-option-active: #006f91;
                }

                .quote-blue-skin .quote-page-bg {
                    background: var(--qb-base) !important;
                    background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.00) 44%), linear-gradient(180deg, var(--qb-mid) 0%, var(--qb-deep) 100%) !important;
                }

                .quote-blue-skin .page-header-clean {
                    background: var(--qb-panel) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) !important;
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

                    .quote-blue-skin .page-header-clean,
                    .quote-blue-skin .quote-trust-card,
                    .quote-blue-skin .quote-question-shell {
                        background-color: var(--qb-panel) !important;
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
            ` }),
    children
  ] });
}
const UK_POSTCODE_RE$2 = /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2})|(?:[A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(?:[A-PR-UWYZ][0-9][A-HJKPSTUW])|(?:[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
const ALLOWED_OUTCODES$2 = ["LS", "WF", "HG", "BD"];
function normalizeUkPostcode$2(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length <= 3) return raw;
  return `${raw.slice(0, -3)} ${raw.slice(-3)}`.trim();
}
function getOutcode$2(value) {
  const normalized = normalizeUkPostcode$2(value);
  if (!normalized) return "";
  return normalized.includes(" ") ? normalized.split(" ")[0] : normalized.length > 3 ? normalized.slice(0, -3) : normalized;
}
function isAllowedOutcode$2(value) {
  const outcode = getOutcode$2(value);
  return ALLOWED_OUTCODES$2.some((prefix) => outcode.startsWith(prefix));
}
function buildAddressFull(parts = []) {
  return parts.map((value) => String(value || "").trim()).filter(Boolean).join(", ");
}
function InstallPage({ booking }) {
  const { symbol, title, stripePublishableKey } = usePage().props;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [showAllIncludes, setShowAllIncludes] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [openInstallCompatibilityTip, setOpenInstallCompatibilityTip] = useState(null);
  const [openPetTooltip, setOpenPetTooltip] = useState(false);
  const [openCancellationTooltip, setOpenCancellationTooltip] = useState(false);
  const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr"];
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentBookingId, setPaymentBookingId] = useState(null);
  const [paymentTxId, setPaymentTxId] = useState(null);
  const [paymentReturnUrl, setPaymentReturnUrl] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const mounted = useRef(true);
  const paymentElementContainerRef = useRef(null);
  const paymentSectionRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const paymentElementRef = useRef(null);
  useRef("");
  const autoScrolledRef = useRef(false);
  useEffect(() => {
    if (selectedDate && selectedTime && titleRef.current) {
      if (autoScrolledRef.current) return;
      autoScrolledRef.current = true;
      setTimeout(() => {
        titleRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        titleRef.current.focus();
      }, 300);
    }
    if (!selectedDate || !selectedTime) {
      autoScrolledRef.current = false;
    }
  }, [selectedDate, selectedTime]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (openInstallCompatibilityTip === null) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-install-compat-wrap="true"]')) {
        setOpenInstallCompatibilityTip(null);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenInstallCompatibilityTip(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openInstallCompatibilityTip]);
  useEffect(() => {
    if (!openPetTooltip) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-pet-policy-wrap="true"]')) {
        setOpenPetTooltip(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenPetTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openPetTooltip]);
  useEffect(() => {
    if (!openCancellationTooltip) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-cancel-policy-wrap="true"]')) {
        setOpenCancellationTooltip(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenCancellationTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openCancellationTooltip]);
  const dateRef = useRef(null);
  const titleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressLine1Ref = useRef(null);
  const addressLine2Ref = useRef(null);
  const cityRef = useRef(null);
  const countyRef = useRef(null);
  const postcodeRef = useRef(null);
  const termsRef = useRef(null);
  const includes = Array.isArray(booking?.includes) ? booking.includes : [];
  const visibleIncludes = showAllIncludes ? includes : includes.slice(0, 3);
  const quoteAmount = useMemo(() => {
    const raw = booking?.price ?? booking?.amount ?? booking?.product?.amount ?? 0;
    if (typeof raw === "number") return raw;
    if (typeof raw !== "string") return 0;
    const cleaned = raw.replace(/[^\d.,-]/g, "");
    if (!cleaned) return 0;
    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");
    if (hasComma && hasDot) {
      return Number(cleaned.replace(/,/g, "")) || 0;
    }
    if (hasComma && !hasDot) {
      const parts = cleaned.split(",");
      if (parts.length === 2 && parts[1].length <= 2) {
        return Number(`${parts[0]}.${parts[1]}`) || 0;
      }
      return Number(cleaned.replace(/,/g, "")) || 0;
    }
    return Number(cleaned) || 0;
  }, [booking]);
  const payableAmount = useMemo(() => {
    if (couponApplied && Number.isFinite(Number(couponApplied.total))) {
      return Number(couponApplied.total);
    }
    return Number(quoteAmount || 0);
  }, [couponApplied, quoteAmount]);
  const discountAmount = useMemo(() => {
    if (couponApplied && Number.isFinite(Number(couponApplied.discount))) {
      return Number(couponApplied.discount);
    }
    return 0;
  }, [couponApplied]);
  const quotePostcode = useMemo(() => {
    const candidates = [
      booking?.answers?.inputs?.postcode,
      booking?.answers?.answers?.raw?.details?.postcode,
      booking?.answers?.answers?.raw?.postcode
    ];
    return candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0
    )?.trim() || "";
  }, [booking]);
  useEffect(() => {
    if (!quotePostcode) return;
    setFormData((prev) => {
      if (String(prev.postcode || "").trim()) return prev;
      return {
        ...prev,
        postcode: normalizeUkPostcode$2(quotePostcode)
      };
    });
  }, [quotePostcode]);
  const formatMoney = (amount) => `${symbol} ${Number(amount || 0).toFixed(2)}`;
  const visibleAddOns = booking?.answers?.addOns;
  const addOns = visibleAddOns?.items || [];
  const trvItem = addOns.find((x) => x.key === "trv");
  const flueType = visibleAddOns?.derived?.flueType || "horizontal";
  const isVertical = String(flueType).toLowerCase() === "vertical";
  const verticalFlueItem = addOns.find((x) => x.key?.includes("vertical_flue")) || addOns.find(
    (x) => String(x.label || "").toLowerCase().includes("vertical flue")
  );
  const hasSmartThermostat = addOns.some((x) => x.key === "smart_stat");
  const selectedThermostat = booking?.answers?.inputs?.thermostat || booking?.answers?.raw?.thermostat_type?.label || "";
  const usesExistingThermostat = String(selectedThermostat).toLowerCase() === "use existing thermostat";
  const thermostatLabel = hasSmartThermostat ? "Smart Thermostat" : usesExistingThermostat ? "Use Existing Thermostat" : "Standard Wireless Thermostat";
  const isCompatibilityDependentItem = (label2 = "") => {
    const normalized = String(label2).toLowerCase();
    return ["shock arrestor", "scale reducer", "magnetic filter"].some(
      (term) => normalized.includes(term)
    );
  };
  const compatibilityTooltipText = "Installed subject to site suitability and compatibility with your existing system configuration.";
  const scrollToRef = (ref) => {
    const el = ref?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof el.focus === "function") el.focus();
  };
  const syncFormDataFromRefs = () => {
    const nextValues = {
      title: titleRef.current?.value ?? formData.title,
      firstName: firstNameRef.current?.value ?? formData.firstName,
      lastName: lastNameRef.current?.value ?? formData.lastName,
      email: emailRef.current?.value ?? formData.email,
      phone: phoneRef.current?.value ?? formData.phone,
      addressLine1: addressLine1Ref.current?.value ?? formData.addressLine1,
      addressLine2: addressLine2Ref.current?.value ?? formData.addressLine2,
      city: cityRef.current?.value ?? formData.city,
      county: countyRef.current?.value ?? formData.county,
      postcode: normalizeUkPostcode$2(
        postcodeRef.current?.value ?? formData.postcode
      )
    };
    const hasChanges = Object.entries(nextValues).some(
      ([key, value]) => value !== formData[key]
    );
    if (hasChanges) {
      setFormData((prev) => ({
        ...prev,
        ...nextValues
      }));
    }
    return {
      ...formData,
      ...nextValues
    };
  };
  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };
  const validateAll = (source = formData) => {
    const next = {};
    if (!selectedDate)
      next.appointment = "Please select an installation date.";
    else if (!selectedTime)
      next.appointment = "Please select an installation time.";
    if (!source.title) next.title = "Please select a title.";
    if (!source.firstName?.trim())
      next.firstName = "First name is required.";
    if (!source.lastName?.trim())
      next.lastName = "Last name is required.";
    const email = (source.email || "").trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    const phone = (source.phone || "").trim();
    if (!phone) next.phone = "Phone number is required.";
    else {
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 10)
        next.phone = "Please enter a valid phone number.";
    }
    if (!source.addressLine1?.trim())
      next.addressLine1 = "Address line 1 is required.";
    if (!source.city?.trim()) next.city = "Town or city is required.";
    const formattedPostcode = normalizeUkPostcode$2(source.postcode);
    if (!formattedPostcode) {
      next.postcode = "Postcode is required.";
    } else if (!UK_POSTCODE_RE$2.test(formattedPostcode)) {
      next.postcode = "Please enter a valid UK postcode.";
    } else if (!isAllowedOutcode$2(formattedPostcode)) {
      next.postcode = "Checkout is restricted to LS, WF, HG and BD postcodes only.";
    }
    return next;
  };
  const fieldOrder = useMemo(
    () => [
      { key: "appointment", ref: dateRef },
      { key: "title", ref: titleRef },
      { key: "firstName", ref: firstNameRef },
      { key: "lastName", ref: lastNameRef },
      { key: "email", ref: emailRef },
      { key: "phone", ref: phoneRef },
      { key: "addressLine1", ref: addressLine1Ref },
      { key: "addressLine2", ref: addressLine2Ref },
      { key: "city", ref: cityRef },
      { key: "county", ref: countyRef },
      { key: "postcode", ref: postcodeRef }
    ],
    []
  );
  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) return null;
    return loadStripe(stripePublishableKey);
  }, [stripePublishableKey]);
  useEffect(() => {
    if (!paymentClientSecret || !paymentElementContainerRef.current || !stripePromise)
      return;
    let disposed = false;
    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe || disposed) return;
        const elements = stripe.elements({
          clientSecret: paymentClientSecret,
          appearance: { theme: "stripe" }
        });
        const paymentElement = elements.create("payment", {
          layout: "tabs"
        });
        paymentElement.mount(paymentElementContainerRef.current);
        stripeRef.current = stripe;
        elementsRef.current = elements;
        paymentElementRef.current = paymentElement;
        setPaymentError("");
      } catch (error) {
        const msg = "Unable to load secure payment form. Please try again, or refresh this page.";
        toast.error(msg);
        setPaymentError(msg);
        setPaymentClientSecret(null);
      }
    })();
    return () => {
      disposed = true;
      paymentElementRef.current?.destroy?.();
      paymentElementRef.current = null;
      elementsRef.current = null;
      stripeRef.current = null;
    };
  }, [paymentClientSecret, stripePromise]);
  useMemo(() => {
    const e = validateAll();
    return Object.keys(e).length === 0;
  }, [formData, selectedDate, selectedTime]);
  useEffect(() => {
    if (!hasAttemptedSubmit) return;
    const nextErrors = validateAll();
    setErrors((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(nextErrors);
      if (prevKeys.length === nextKeys.length) {
        const isUnchanged = prevKeys.every(
          (key) => prev[key] === nextErrors[key]
        );
        if (isUnchanged) return prev;
      }
      return nextErrors;
    });
  }, [hasAttemptedSubmit, formData, selectedDate, selectedTime]);
  useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    if (!formData.title?.trim()) return "";
    if (!formData.firstName?.trim()) return "";
    if (!formData.lastName?.trim()) return "";
    if (!formData.email?.trim()) return "";
    if (!formData.phone?.trim()) return "";
    if (!formData.addressLine1?.trim()) return "";
    if (!formData.city?.trim()) return "";
    const formattedPostcode = normalizeUkPostcode$2(formData.postcode);
    if (!formattedPostcode) return "";
    if (!UK_POSTCODE_RE$2.test(formattedPostcode)) return "";
    if (!isAllowedOutcode$2(formattedPostcode)) return "";
    return [
      selectedDate,
      selectedTime,
      formData.title,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.county,
      formattedPostcode
    ].map((v) => String(v || "").trim()).join("|");
  }, [selectedDate, selectedTime, formData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: name === "postcode" ? normalizeUkPostcode$2(value) : value
    }));
    clearError(name);
  };
  const handleAppointmentChange = ({ date, time }) => {
    setSelectedDate(date);
    setSelectedTime(time);
    clearError("appointment");
    setFormData((prev) => ({
      ...prev,
      notes: date && time ? `Preferred appointment: ${date} at ${time}` : prev.notes
    }));
  };
  const showValidationErrors = (errorsObj) => {
    if (!errorsObj || typeof errorsObj !== "object") return;
    const messages = Object.values(errorsObj).flat().filter(Boolean);
    if (!messages.length) return;
    messages.slice(0, 4).forEach(
      (m) => toast.error(m, { duration: 5e3, position: "top-center" })
    );
    if (messages.length > 4) {
      toast.error("Please review the highlighted fields and try again.", {
        duration: 5e3,
        position: "top-center"
      });
    }
  };
  const hydrateInlineErrorsFromBackend = (errorsObj) => {
    if (!errorsObj || typeof errorsObj !== "object") return;
    const mapKey = (k) => {
      const key = String(k || "");
      if (key === "appointment_date" || key === "appointment_time")
        return "appointment";
      if (key === "customer.title") return "title";
      if (key === "customer.first_name") return "firstName";
      if (key === "customer.last_name") return "lastName";
      if (key === "customer.email") return "email";
      if (key === "customer.phone") return "phone";
      if (key === "customer.address") return "addressLine1";
      if (key === "customer.address_line1") return "addressLine1";
      if (key === "customer.address_line2") return "addressLine2";
      if (key === "customer.city") return "city";
      if (key === "customer.county") return "county";
      if (key === "customer.postcode") return "postcode";
      return null;
    };
    const next = {};
    Object.entries(errorsObj).forEach(([k, arr]) => {
      const local = mapKey(k);
      if (!local) return;
      const msg = Array.isArray(arr) ? arr[0] : String(arr || "");
      if (msg) next[local] = msg;
    });
    if (Object.keys(next).length) {
      setErrors((prev) => ({ ...prev, ...next }));
      const firstInvalid = fieldOrder.find((f) => next[f.key]);
      if (firstInvalid) scrollToRef(firstInvalid.ref);
    }
  };
  const initialisePaymentElement = async ({ showValidationToast = false } = {}) => {
    const syncedFormData = syncFormDataFromRefs();
    const nextErrors = validateAll(syncedFormData);
    if (Object.keys(nextErrors).length > 0) {
      if (showValidationToast) {
        setHasAttemptedSubmit(true);
        setErrors(nextErrors);
        const firstInvalid = fieldOrder.find((f) => nextErrors[f.key]);
        if (firstInvalid) scrollToRef(firstInvalid.ref);
        toast.error("Please complete the required fields.", {
          duration: 4e3,
          position: "top-center"
        });
      }
      return false;
    }
    setPaymentError("");
    setProcessing(true);
    const productDetails = {
      boiler_id: booking.boiler_id,
      brand: booking.brand,
      model: booking.model,
      kw: booking.kw,
      warrantyYears: booking.warrantyYears,
      amount: quoteAmount,
      includes: booking.includes,
      images: booking.images
    };
    if (quoteAmount <= 0) {
      setPaymentError("Invalid quote amount. Please refresh and try again.");
      toast.error("Invalid quote amount. Please refresh and try again.");
      setProcessing(false);
      return false;
    }
    const answers = booking?.answers?.answers?.raw;
    const addOns2 = booking?.answers?.addOns;
    const customerName = [
      syncedFormData.title,
      syncedFormData.firstName,
      syncedFormData.lastName
    ].map((value) => String(value || "").trim()).filter(Boolean).join(" ");
    const formattedPostcode = normalizeUkPostcode$2(syncedFormData.postcode);
    const addressFull = buildAddressFull([
      syncedFormData.addressLine1,
      syncedFormData.addressLine2,
      syncedFormData.city,
      syncedFormData.county,
      formattedPostcode || quotePostcode
    ]);
    const payload = {
      // booking data
      ...answers,
      addOns: addOns2,
      // appointment
      visit_time: {
        datetime: {
          date: selectedDate,
          time: selectedTime
        }
      },
      // customer form
      customer_details: {
        full_name: customerName,
        email: syncedFormData.email,
        phone: syncedFormData.phone,
        postcode: formattedPostcode || quotePostcode,
        address_line1: syncedFormData.addressLine1,
        address_line2: syncedFormData.addressLine2,
        city: syncedFormData.city,
        county: syncedFormData.county,
        country: "United Kingdom",
        address_full: addressFull,
        notes: syncedFormData.notes
      },
      product: productDetails
    };
    try {
      const res = await axios.post(
        "/quote/checkout",
        {
          service: "new_boiler_quote",
          form: payload,
          amount: quoteAmount,
          coupon_code: couponApplied?.coupon?.code || null,
          payment_element: true
        },
        { timeout: 15e3 }
      );
      const checkoutClientSecret = res?.data?.data?.checkout_client_secret;
      const checkoutMode = res?.data?.data?.checkout_mode;
      const pricing = res?.data?.data?.pricing;
      setCouponError("");
      if (pricing?.coupon) {
        setCouponApplied(pricing);
      } else {
        setCouponApplied(null);
      }
      if (checkoutMode === "payment_element" && checkoutClientSecret && stripePublishableKey) {
        setPaymentClientSecret(checkoutClientSecret);
        setPaymentBookingId(res?.data?.data?.booking_id || null);
        setPaymentTxId(res?.data?.data?.transaction_id || null);
        setPaymentReturnUrl(res?.data?.data?.return_url || null);
        setProcessing(false);
        setTimeout(() => {
          paymentSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
        return true;
      }
      throw new Error("Unable to initialise secure payment form.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        const backendErrors = err?.response?.data?.errors;
        const firstBackendError = Object.values(backendErrors || {}).flat().find(Boolean);
        const couponMsg = backendErrors?.coupon_code?.[0];
        if (couponMsg) {
          setCouponError(couponMsg);
          setCouponApplied(null);
        }
        if (firstBackendError) {
          setPaymentError(String(firstBackendError));
        }
        if (showValidationToast) {
          showValidationErrors(backendErrors);
          hydrateInlineErrorsFromBackend(backendErrors);
        }
      } else if (status >= 500) {
        setPaymentError(
          "Payment service is temporarily unavailable. Please try again shortly."
        );
        toast.error(
          "Payment service is temporarily unavailable. Please try again shortly.",
          {
            duration: 5e3,
            position: "top-center"
          }
        );
      } else if (err?.code === "ECONNABORTED") {
        setPaymentError(
          "Request timed out. Please check your connection and try again."
        );
        toast.error(
          "Request timed out. Please check your connection and try again.",
          {
            duration: 5e3,
            position: "top-center"
          }
        );
      } else if (showValidationToast) {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        setPaymentError(message);
        toast.error(message, {
          duration: 5e3,
          position: "top-center"
        });
      }
      if (mounted.current) setProcessing(false);
      return false;
    }
  };
  const handlePayAndBook = async () => {
    if (processing) return;
    setHasAttemptedSubmit(true);
    if (!acceptedTerms) {
      setTermsError(
        "Please confirm you agree to the Terms & Conditions before continuing."
      );
      toast.error("Please agree to the Terms & Conditions to continue.", {
        duration: 4e3,
        position: "top-center"
      });
      scrollToRef(termsRef);
      return;
    }
    if (!paymentClientSecret) {
      await initialisePaymentElement({ showValidationToast: true });
      return;
    }
    setPaymentError("");
    try {
      setProcessing(true);
      if (!stripeRef.current || !elementsRef.current) {
        throw new Error("Payment form is still loading. Please try again.");
      }
      const { error, paymentIntent } = await stripeRef.current.confirmPayment(
        {
          elements: elementsRef.current,
          confirmParams: {
            return_url: paymentReturnUrl || `${window.location.origin}/checkout/success-intent?booking=${paymentBookingId}&tx=${paymentTxId}`
          },
          redirect: "if_required"
        }
      );
      if (error) {
        setPaymentError(
          error.message || "Payment could not be confirmed. Please check your details and try again."
        );
        toast.error(error.message || "Payment failed.");
        setProcessing(false);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        const confirmRes = await axios.post(
          "/quote/checkout/confirm-intent",
          {
            booking_id: paymentBookingId,
            tx_id: paymentTxId,
            payment_intent_id: paymentIntent.id
          },
          { timeout: 15e3 }
        );
        const redirectUrl = confirmRes?.data?.data?.redirect_url;
        if (redirectUrl) {
          window.location.assign(redirectUrl);
          return;
        }
      }
      setProcessing(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else {
        const message = err?.response?.data?.message || err?.message || "Unable to complete payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
    }
  };
  const handleApplyCoupon = async () => {
    if (processing || applyingCoupon) return;
    setCouponError("");
    setPaymentError("");
    setApplyingCoupon(true);
    try {
      const code = couponCode.trim() || null;
      if (paymentClientSecret && paymentBookingId && paymentTxId) {
        const res = await axios.post(
          "/quote/checkout/coupon-update",
          {
            booking_id: paymentBookingId,
            tx_id: paymentTxId,
            coupon_code: code
          },
          { timeout: 15e3 }
        );
        const pricing2 = res?.data?.data?.pricing || null;
        setCouponApplied(pricing2);
        toast.success(code ? "Coupon applied." : "Coupon removed.");
        return;
      }
      const preview = await axios.post(
        "/quote/checkout/coupon-preview",
        {
          service: "new_boiler_quote",
          amount: quoteAmount,
          coupon_code: code
        },
        { timeout: 15e3 }
      );
      const pricing = preview?.data?.data || null;
      setCouponApplied(pricing);
      if (code) {
        toast.success("Coupon applied.");
      } else {
        toast.success("Coupon cleared.");
      }
    } catch (err) {
      const couponMsg = err?.response?.data?.errors?.coupon_code?.[0];
      if (couponMsg) {
        setCouponError(couponMsg);
        return;
      }
      const message = err?.response?.data?.message || err?.message || "Unable to apply coupon right now.";
      toast.error(message, { duration: 4500, position: "top-center" });
    } finally {
      setApplyingCoupon(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx("style", { children: `
                .pet-doggy-wrap {
                    animation: pet-doggy-bob 1.8s ease-in-out infinite;
                    transform-origin: center;
                }

                .pet-doggy-ear-left,
                .pet-doggy-ear-right {
                    animation: pet-doggy-ear 1.2s ease-in-out infinite;
                    transform-origin: center top;
                }

                @keyframes pet-doggy-bob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-1.5px); }
                }

                @keyframes pet-doggy-ear {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(7deg); }
                }
            ` }),
    /* @__PURE__ */ jsxs(BlueQuoteSkin, { children: [
      /* @__PURE__ */ jsx(PageHeader, {}),
      /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-white quote-page-bg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-10 md:py-14 pb-28 lg:pb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-6 mb-10", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => window.history.back(),
              className: "group flex w-fit items-center gap-2 text-[13px] cursor-pointer font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-900",
              children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-transform duration-300 group-hover:-translate-x-1 group-hover:bg-slate-200", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-4 w-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 3,
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M15 19l-7-7 7-7"
                      }
                    )
                  }
                ) }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500", children: "Checkout" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight whitespace-nowrap", children: "Finalise booking" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-5 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Selected boiler package" }),
            /* @__PURE__ */ jsxs("h3", { className: "mt-1 text-lg md:text-xl font-bold text-slate-900", children: [
              booking?.brand,
              " ",
              booking?.model
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary", children: [
                booking?.kw,
                "kW"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700", children: [
                booking?.warrantyYears,
                " year warranty"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800", children: "Installation included" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-left sm:text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-slate-500", children: "Total" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-slate-900", children: formatMoney(payableAmount) }),
            discountAmount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-emerald-700 font-semibold", children: [
              "Coupon saved ",
              formatMoney(discountAmount)
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500", children: "inc VAT" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: "Google Reviews" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-slate-900", children: "Rated Excellent by local customers" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/images/gas%20safe%20logo%20mega.png",
                  alt: "Gas Safe Register",
                  className: "h-5 w-auto object-contain",
                  loading: "lazy",
                  onError: (e) => {
                    e.currentTarget.src = "/images/511-5113277-gas-safe-register-logo-symbol-gas-safe-logo.png";
                  }
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-emerald-800 font-semibold", children: "Gas Safe" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-emerald-900", children: "Registered business: 636354" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-sky-200 bg-sky-50 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-sky-800 font-semibold", children: "Secure payment" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-sky-900", children: "Card payments accepted online" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 border-b border-slate-100 p-5 md:p-7 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2 items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg lg:text-2xl font-semibold text-slate-900", children: "Select Installation Date" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 line-clamp-1", children: "Our engineers are available in your area." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-primary ", children: [
                  /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }),
                    /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })
                  ] }),
                  "Real-time Availability"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row", children: /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 md:p-7", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: dateRef,
                  className: "min-h-[300px]",
                  children: [
                    /* @__PURE__ */ jsx(
                      AppointmentDateRangePicker,
                      {
                        type: "new_boiler_quote",
                        value: {
                          date: selectedDate,
                          time: selectedTime
                        },
                        onChange: handleAppointmentChange
                      }
                    ),
                    errors.appointment && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-red-600", children: errors.appointment })
                  ]
                }
              ) }) })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-500", children: [
              /* @__PURE__ */ jsx("div", { className: "relative border-b border-slate-200/70 px-6 md:px-8 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold tracking-tight text-slate-900", children: "Personal Details" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }),
                      /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500", children: "Secure checkout active" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800", children: [
                    /* @__PURE__ */ jsx(FiShield, { className: "h-3.5 w-3.5" }),
                    "Your details are used only to arrange your installation and confirmation."
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] ring-1 ring-slate-100", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-6 w-6 text-primary",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      }
                    )
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "relative p-8 pt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-7", children: [
                /* @__PURE__ */ jsx("div", { className: "group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow", children: [
                  /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary", children: "Who are we installing for?" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Title" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxs(
                          "select",
                          {
                            ref: titleRef,
                            name: "title",
                            value: formData.title,
                            onChange: handleInputChange,
                            className: `w-full appearance-none rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all hover:bg-white focus:bg-white focus:ring-2 focus:shadow-lg focus:outline-none
                                      ${errors.title ? "ring-red-400 focus:ring-red-400/50 focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-primary/10"}`,
                            children: [
                              /* @__PURE__ */ jsx("option", { value: "", children: "--" }),
                              titleOptions.map(
                                (t) => /* @__PURE__ */ jsx(
                                  "option",
                                  {
                                    value: t,
                                    children: t
                                  },
                                  t
                                )
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400", children: /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "h-3 w-3",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 3,
                                d: "M19 9l-7 7-7-7"
                              }
                            )
                          }
                        ) })
                      ] }),
                      errors.title && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.title })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "col-span-3 grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "First Name" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: firstNameRef,
                            name: "firstName",
                            placeholder: "e.g. John",
                            value: formData.firstName,
                            onChange: handleInputChange,
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.firstName ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.firstName && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.firstName })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Last Name" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: lastNameRef,
                            name: "lastName",
                            placeholder: "e.g. Doe",
                            value: formData.lastName,
                            onChange: handleInputChange,
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.lastName ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.lastName && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.lastName })
                      ] })
                    ] })
                  ] })
                ] }) }) }),
                /* @__PURE__ */ jsx("div", { className: "group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow pt-1.5", children: [
                  /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary", children: "How can we reach you?" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Email Address" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: emailRef,
                            type: "email",
                            name: "email",
                            placeholder: "your@email.com",
                            value: formData.email,
                            onChange: handleInputChange,
                            className: `w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.email ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "w-5 h-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 1.5,
                                d: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              }
                            )
                          }
                        ) })
                      ] }),
                      errors.email && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.email })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Phone Number" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: phoneRef,
                            name: "phone",
                            placeholder: "07xxx xxxxxx",
                            value: formData.phone,
                            onChange: handleInputChange,
                            className: `w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.phone ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsx(
                          "svg",
                          {
                            className: "w-5 h-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /* @__PURE__ */ jsx(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 1.5,
                                d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              }
                            )
                          }
                        ) })
                      ] }),
                      errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.phone })
                    ] })
                  ] })
                ] }) }) }),
                /* @__PURE__ */ jsx("div", { className: "group relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5", children: /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow pt-1.5", children: [
                  /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors group-focus-within:text-primary", children: "Where are we installing?" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1 md:col-span-2", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Address line 1" }),
                        /* @__PURE__ */ jsxs("div", { className: "relative group/input", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              ref: addressLine1Ref,
                              name: "addressLine1",
                              placeholder: "House number/name and street",
                              value: formData.addressLine1,
                              onChange: handleInputChange,
                              autoComplete: "address-line1",
                              className: `w-full rounded-xl border-0 bg-slate-50/80 pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.addressLine1 ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                            }
                          ),
                          /* @__PURE__ */ jsx("div", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400", children: /* @__PURE__ */ jsxs(
                            "svg",
                            {
                              className: "w-5 h-5",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              children: [
                                /* @__PURE__ */ jsx(
                                  "path",
                                  {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 1.5,
                                    d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "path",
                                  {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 1.5,
                                    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  }
                                )
                              ]
                            }
                          ) })
                        ] }),
                        errors.addressLine1 && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.addressLine1 })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1 md:col-span-2", children: [
                        /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: [
                          "Address line 2 ",
                          /* @__PURE__ */ jsx("span", { className: "font-normal text-slate-400 ml-1 opacity-70", children: "(Optional)" })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: addressLine2Ref,
                            name: "addressLine2",
                            placeholder: "Apartment, building, or area",
                            value: formData.addressLine2,
                            onChange: handleInputChange,
                            autoComplete: "address-line2",
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.addressLine2 ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.addressLine2 && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.addressLine2 })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Town / city" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: cityRef,
                            name: "city",
                            placeholder: "e.g. Leeds",
                            value: formData.city,
                            onChange: handleInputChange,
                            autoComplete: "address-level2",
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.city ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.city && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.city })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                        /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: [
                          "County ",
                          /* @__PURE__ */ jsx("span", { className: "font-normal text-slate-400 ml-1 opacity-70", children: "(Optional)" })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: countyRef,
                            name: "county",
                            placeholder: "e.g. West Yorkshire",
                            value: formData.county,
                            onChange: handleInputChange,
                            autoComplete: "address-level1",
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.county ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.county && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.county })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1 md:max-w-sm", children: [
                        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: "Postcode" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            ref: postcodeRef,
                            name: "postcode",
                            placeholder: "e.g. LS1 1AA",
                            value: formData.postcode,
                            onChange: handleInputChange,
                            autoComplete: "postal-code",
                            className: `w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold uppercase text-slate-900 ring-1 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:outline-none
                                    ${errors.postcode ? "ring-red-400 focus:ring-red-400/50 focus:shadow-lg focus:shadow-red-500/10" : "ring-slate-200 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10"}`
                          }
                        ),
                        errors.postcode && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: errors.postcode })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "-mt-1 text-xs text-slate-500", children: "Checkout is restricted to LS, WF, HG and BD postcodes only." }),
                    /* @__PURE__ */ jsxs("div", { className: "relative transition-all duration-300 focus-within:-translate-y-1", children: [
                      /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-[14px] font-semibold text-slate-600 ml-1", children: [
                        "Access & parking notes",
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "font-normal text-slate-400 ml-1 opacity-70", children: "(Optional)" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          name: "notes",
                          rows: 3,
                          placeholder: "Tell us about parking, gate access, alarms, mobility requirements, or anything else we should know.",
                          value: formData.notes,
                          onChange: handleInputChange,
                          className: "w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-all placeholder:font-normal placeholder:text-slate-400 hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/10 focus:outline-none resize-none"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { "data-pet-policy-wrap": "true", className: "relative inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 group/pet-policy", children: [
                      /* @__PURE__ */ jsx("span", { className: "pet-doggy-wrap inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100/90 ring-1 ring-amber-200", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "h-4.5 w-4.5", "aria-hidden": "true", children: [
                        /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-left", d: "M7 7.2c-.8-1.5-2.3-1.9-3.2-.8-.8 1-.6 2.5.8 3.4L7 10.9V7.2Z", fill: "#c08457" }),
                        /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-right", d: "M17 7.2c.8-1.5 2.3-1.9 3.2-.8.8 1 .6 2.5-.8 3.4L17 10.9V7.2Z", fill: "#c08457" }),
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "7", fill: "#f5c892" }),
                        /* @__PURE__ */ jsx("circle", { cx: "9.4", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                        /* @__PURE__ */ jsx("circle", { cx: "14.6", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                        /* @__PURE__ */ jsx("ellipse", { cx: "12", cy: "13.7", rx: "1.2", ry: "0.9", fill: "#111827" }),
                        /* @__PURE__ */ jsx("path", { d: "M10.8 15.4c.3.5.7.8 1.2.8s.9-.3 1.2-.8", stroke: "#7c2d12", strokeWidth: "1", strokeLinecap: "round", fill: "none" })
                      ] }) }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: "Pet-friendly visits" }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setOpenPetTooltip(
                            (prev) => !prev
                          ),
                          className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-primary hover:text-primary",
                          "aria-label": "Show pet-friendly information",
                          children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `quote-solid-popover absolute left-0 top-9 z-20 w-[320px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${openPetTooltip ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 group-hover/pet-policy:pointer-events-auto group-hover/pet-policy:opacity-100 group-hover/pet-policy:translate-y-0 group-focus-within/pet-policy:pointer-events-auto group-focus-within/pet-policy:opacity-100 group-focus-within/pet-policy:translate-y-0"}`,
                          children: [
                            /* @__PURE__ */ jsx("p", { children: "We are dog-friendly and happy for them to be around during the visit." }),
                            /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "If your dog is feeling social, we are always glad to say hello first." }),
                            /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "During active work, we ask that pets are kept clear of tools and working areas for everyone’s safety." })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  Object.keys(errors).length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-xl border border-red-200 bg-red-50 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-red-700", children: "Please fix the highlighted fields to continue." }) })
                ] }) }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("aside", { className: "sticky top-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-[0_16px_40px_rgba(15,23,42,0.08)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 border-b border-slate-200 text-center rounded-t-3xl space-y-1", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500", children: "Installation Summary" }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold tracking-tight text-slate-900", children: formatMoney(payableAmount) }) }),
              discountAmount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-emerald-700", children: [
                "Coupon discount: ",
                formatMoney(discountAmount)
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-slate-500", children: "Instant price • inc VAT" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-[18px] text-slate-900", children: booking?.model }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "bg-primary/10 text-primary text-[14px] px-2 py-0.5 rounded font-mono", children: [
                      booking?.kw,
                      "KW"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "bg-slate-100 text-slate-600 text-[14px] px-2 py-0.5 rounded font-mono", children: [
                      booking?.warrantyYears,
                      "Y Warranty"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-20 w-20 bg-slate-100/40 rounded-full flex items-center justify-center text-xl p-2", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: booking?.images?.[0],
                    className: "h-full object-contain drop-shadow-2xl",
                    onError: (e) => {
                      e.target.src = "/images/ideal-20logic.png";
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full border-t-2 border-dashed border-dark/40" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[14px] font-bold uppercase text-dark/60 tracking-wider", children: "What's Included" }),
                includes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                      trvItem && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[14px]", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-slate-700 font-semibold", children: "TRV supply & fit" }),
                        /* @__PURE__ */ jsx("div", { className: "text-slate-900 font-bold", children: trvItem ? `${trvItem.qty} × £${trvItem.unitPrice} = £${trvItem.total}` : "—" })
                      ] }),
                      (() => {
                        const relocation = addOns.find(
                          (x) => x.key === "boiler_relocation"
                        );
                        if (!relocation)
                          return null;
                        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[14px]", children: [
                          /* @__PURE__ */ jsx("div", { className: "text-slate-700 font-semibold", children: relocation.label }),
                          /* @__PURE__ */ jsxs("div", { className: "text-slate-900 font-bold", children: [
                            "£",
                            relocation.total
                          ] })
                        ] });
                      })(),
                      (() => {
                        const convert_to_combi = addOns.find(
                          (x) => x.key === "convert_to_combi"
                        );
                        if (!convert_to_combi)
                          return null;
                        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[14px]", children: [
                          /* @__PURE__ */ jsx("div", { className: "text-slate-700 font-semibold", children: convert_to_combi.label }),
                          /* @__PURE__ */ jsxs("div", { className: "text-slate-900 font-bold", children: [
                            "£",
                            convert_to_combi.total
                          ] })
                        ] });
                      })(),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[14px]", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-slate-700 font-semibold", children: "Flue Type" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `px-2 py-0.5 rounded font-bold text-[12px] uppercase tracking-wider ${isVertical ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`,
                              children: isVertical ? "Vertical" : "Horizontal"
                            }
                          ),
                          isVertical && verticalFlueItem ? /* @__PURE__ */ jsxs("span", { className: "text-slate-900 font-bold", children: [
                            "£",
                            verticalFlueItem.total
                          ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-semibold text-[13px]", children: "Included" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[14px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-700 font-semibold", children: "Thermostat" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `font-bold ${hasSmartThermostat ? "text-primary" : "text-slate-700"}`,
                          children: thermostatLabel
                        }
                      )
                    ] }),
                    visibleIncludes.map(
                      (item, i) => /* @__PURE__ */ jsxs(
                        "li",
                        {
                          className: "relative flex justify-between items-center font-medium text-dark opacity-0 included-animation",
                          style: {
                            animationDelay: `${i * 40}ms`
                          },
                          children: [
                            /* @__PURE__ */ jsxs("span", { className: "max-w-[90%] text-[15px] inline-flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx("span", { children: item }),
                              isCompatibilityDependentItem(
                                item
                              ) && /* @__PURE__ */ jsxs(
                                "span",
                                {
                                  "data-install-compat-wrap": "true",
                                  className: "relative inline-flex items-center group/compat",
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "button",
                                      {
                                        type: "button",
                                        "aria-label": compatibilityTooltipText,
                                        onClick: () => setOpenInstallCompatibilityTip(
                                          openInstallCompatibilityTip === i ? null : i
                                        ),
                                        className: "inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500",
                                        children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3 w-3" })
                                      }
                                    ),
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: `quote-solid-popover absolute left-0 top-[calc(100%+0.3rem)] z-40 w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-lg translate-y-1 transition-all duration-200 ${openInstallCompatibilityTip === i ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 group-hover/compat:pointer-events-auto group-hover/compat:opacity-100 group-hover/compat:translate-y-0 group-focus-within/compat:pointer-events-auto group-focus-within/compat:opacity-100 group-focus-within/compat:translate-y-0"}`,
                                        children: compatibilityTooltipText
                                      }
                                    )
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "text-primary text-sm font-semibold", children: "Included" })
                          ]
                        },
                        i
                      )
                    )
                  ] }),
                  includes.length > 3 && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowAllIncludes(
                        (v) => !v
                      ),
                      className: "text-[14px] mt-3 border border-gray-200 cursor-pointer hover:border-primary px-3 py-2 uppercase tracking-wider font-semibold text-dark/80 hover:text-primary transition-colors",
                      children: showAllIncludes ? "- Hide full item" : `+ See full item (${includes.length})`
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 -mx-6 -mb-6 p-6 pb-10 mt-6 border-t border-slate-200 text-slate-900", children: [
                /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5", children: /* @__PURE__ */ jsxs("div", { "data-cancel-policy-wrap": "true", className: "relative inline-flex items-center gap-1.5 text-xs text-slate-600 group/cancel-policy", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: "Cancellation policy" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setOpenCancellationTooltip(
                        (prev) => !prev
                      ),
                      className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-colors hover:border-primary hover:text-primary",
                      "aria-label": "Show cancellation policy",
                      children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `quote-solid-popover absolute left-0 top-7 z-20 w-[290px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${openCancellationTooltip ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 group-hover/cancel-policy:pointer-events-auto group-hover/cancel-policy:opacity-100 group-hover/cancel-policy:translate-y-0 group-focus-within/cancel-policy:pointer-events-auto group-focus-within/cancel-policy:opacity-100 group-focus-within/cancel-policy:translate-y-0"}`,
                      children: [
                        /* @__PURE__ */ jsx("p", { children: "You can cancel for a full refund up to 24 hours before your booking." }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "Cancellations made with less than 24 hours’ notice may be chargeable, including where materials have already been ordered or engineer time has been allocated." }),
                        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-slate-500", children: [
                          "This does not affect your statutory rights. Full terms:",
                          /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: "/terms-conditions",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "ml-1 font-semibold text-primary underline underline-offset-2",
                              children: "view full terms"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    ref: termsRef,
                    className: `mb-4 rounded-xl border p-3 ${termsError ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2", children: "Have a coupon code?" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              value: couponCode,
                              onChange: (e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setCouponError("");
                                setCouponApplied(null);
                              },
                              placeholder: "Enter code",
                              className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm uppercase"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: handleApplyCoupon,
                              disabled: processing || applyingCoupon,
                              className: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60",
                              children: applyingCoupon ? "Applying..." : "Apply"
                            }
                          )
                        ] }),
                        couponApplied?.coupon?.code && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs font-semibold text-emerald-700", children: [
                          "Applied ",
                          couponApplied.coupon.code,
                          " • -",
                          formatMoney(discountAmount)
                        ] }),
                        couponError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: couponError })
                      ] }),
                      /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 text-sm leading-relaxed text-slate-700", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: acceptedTerms,
                            onChange: (e) => {
                              setAcceptedTerms(
                                e.target.checked
                              );
                              setTermsError("");
                            },
                            className: "mt-0.5 h-4 w-4 rounded border-slate-300 bg-white text-primary focus:ring-primary"
                          }
                        ),
                        /* @__PURE__ */ jsxs("span", { children: [
                          "I confirm that I have read and agree to the",
                          " ",
                          /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: "/terms-conditions",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "font-semibold underline underline-offset-2",
                              children: "Terms & Conditions"
                            }
                          ),
                          " ",
                          "and",
                          " ",
                          /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: "/privacy-policy",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "font-semibold underline underline-offset-2",
                              children: "Privacy Policy"
                            }
                          ),
                          ", including any advertised",
                          " ",
                          /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: "/terms-conditions#next-day",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "font-semibold underline underline-offset-2",
                              children: "next-day installation terms"
                            }
                          ),
                          "."
                        ] })
                      ] }),
                      termsError && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-semibold text-red-600", children: termsError })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handlePayAndBook,
                    disabled: processing,
                    "aria-busy": processing,
                    className: [
                      "w-full py-4 text-sm font-bold rounded-xl uppercase tracking-wide border transition-all flex items-center justify-center gap-2",
                      processing ? "bg-gray-400 border-gray-400 cursor-not-allowed text-white" : paymentClientSecret && !acceptedTerms ? "bg-primary border-primary text-white opacity-70 cursor-not-allowed" : "bg-primary border-primary text-white hover:opacity-95"
                    ].join(" "),
                    children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiLoader, { className: "animate-spin" }),
                      "Processing…"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiCreditCard, {}),
                      paymentClientSecret ? "Confirm & Book Installation" : "Continue to secure payment"
                    ] })
                  }
                ),
                paymentClientSecret && /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: paymentSectionRef,
                    className: "mt-4 rounded-2xl border border-slate-200 bg-white p-3",
                    children: /* @__PURE__ */ jsx("div", { ref: paymentElementContainerRef })
                  }
                ),
                paymentError && /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-xs font-semibold text-red-600", children: paymentError }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]", children: [
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm", children: "Visa" }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm", children: "Mastercard" }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-slate-300 bg-white text-slate-900 px-3 py-1 shadow-sm", children: "Klarna" })
                ] })
              ] })
            ] })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: "Total package" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-slate-900 truncate", children: formatMoney(payableAmount) }),
          discountAmount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-semibold text-emerald-700", children: [
            "Coupon: -",
            formatMoney(discountAmount)
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "mt-1 inline-flex items-center gap-2 text-[11px] text-slate-600", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: acceptedTerms,
                onChange: (e) => {
                  setAcceptedTerms(e.target.checked);
                  setTermsError("");
                },
                className: "h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
              }
            ),
            "Agree to terms"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handlePayAndBook,
            disabled: processing,
            "aria-busy": processing,
            className: [
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
              processing ? "bg-gray-400 text-white cursor-not-allowed" : paymentClientSecret && !acceptedTerms ? "bg-primary text-white opacity-70 cursor-not-allowed" : "bg-primary text-white"
            ].join(" "),
            children: processing ? "Processing…" : paymentClientSecret ? "Confirm payment" : "Secure payment"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(GoogleReview, {})
    ] })
  ] });
}
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InstallPage
}, Symbol.toStringTag, { value: "Module" }));
const SERVICES_KEY_VALUE = {
  BOILER_REPAIR: {
    key: "boiler_repair",
    value: "Boiler Repair"
  },
  BOILER_SERVICE: {
    key: "boiler_service",
    value: "Boiler Service"
  },
  NEW_BOILER_QUOTE: {
    key: "new_boiler_quote",
    value: "New Boiler Quote"
  },
  POWER_FLUSH: {
    key: "power_flush",
    value: "Power Flush"
  }
};
const getOverrides = () => {
  if (typeof window === "undefined") return {};
  return window.__PRICING_OVERRIDES__ || {};
};
const numOr = (v, fallback) => {
  if (v === null || v === void 0 || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const normalizeLegacyProduct = (p) => {
  const next = { ...p };
  const brand = String(next.brand || "");
  const model = String(next.model || "").toLowerCase();
  if ((next.id === "wb_greenstar_1000_35" || model.includes("8000")) && Number(next.kw) === 35) {
    next.kw = 36;
  }
  if (/\b36\s*kw\b/i.test(brand)) {
    next.brand = brand.replace(/\s*36\s*kw\b/i, "").trim() || "Worcester Bosch";
  }
  return next;
};
const applyEffectiveConfig = () => {
  const o = getOverrides();
  const oRules = o.rules || {};
  const oAddons = o.addons || {};
  const oProducts = o.products || {};
  const catalogProducts = Array.isArray(o?.catalog?.products) && o.catalog.products.length ? o.catalog.products : PRODUCTS;
  const RULES$1 = {
    ...RULES,
    MIN_MARGIN_SYSTEM_HEAT: numOr(oRules.MIN_MARGIN_SYSTEM_HEAT, RULES.MIN_MARGIN_SYSTEM_HEAT),
    TRV_MAX_QTY: numOr(oRules.TRV_MAX_QTY, RULES.TRV_MAX_QTY)
  };
  const ADDONS$1 = JSON.parse(JSON.stringify(ADDONS));
  Object.keys(ADDONS$1).forEach((k) => {
    const key = `${k}.unitPrice`;
    if (oAddons[key] !== void 0) {
      ADDONS$1[k].unitPrice = numOr(oAddons[key], ADDONS$1[k].unitPrice);
    }
  });
  const PRODUCTS$1 = catalogProducts.map((p) => {
    const next = normalizeLegacyProduct(p);
    if (oProducts[`${p.id}.basePrice`] !== void 0) {
      const v = oProducts[`${p.id}.basePrice`];
      next.basePrice = v === null ? null : numOr(v, p.basePrice);
    }
    if (oProducts[`${p.id}.boilerCost`] !== void 0) {
      const v = oProducts[`${p.id}.boilerCost`];
      next.boilerCost = v === null ? null : numOr(v, p.boilerCost);
    }
    if (oProducts[`${p.id}.minMargin`] !== void 0) {
      next.minMargin = numOr(oProducts[`${p.id}.minMargin`], p.minMargin);
    }
    return next;
  });
  return { RULES: RULES$1, ADDONS: ADDONS$1, PRODUCTS: PRODUCTS$1 };
};
const money = (n) => Math.round((Number(n) || 0) * 100) / 100;
function label(v) {
  return v?.label ?? null;
}
function isYes(v) {
  return (v?.label || "").toLowerCase() === "yes";
}
function clampInt(n, min, max) {
  const x = Number(n);
  if (Number.isNaN(x)) return min;
  return Math.max(min, Math.min(max, Math.trunc(x)));
}
function questionMap(questions = []) {
  const map = /* @__PURE__ */ new Map();
  for (const q of questions) map.set(q.id, q.question);
  return map;
}
function parseRadsBucket(lab) {
  if (!lab) return null;
  if (lab.includes("Up to")) return "UP_TO_6";
  if (lab.includes("7")) return "R7_12";
  if (lab.includes("13")) return "R13_20";
  if (lab.includes("21")) return "R21_PLUS";
  return null;
}
function parseBaths(lab) {
  if (!lab) return null;
  const n = parseFloat(lab);
  if (Number.isFinite(n)) return n;
  return null;
}
function bathsScore(baths) {
  if (baths == null) return null;
  if (baths <= 1.5) return 1;
  if (baths === 2) return 2;
  return 3;
}
function combiAllowed(baths) {
  const score = bathsScore(baths);
  if (score == null) return false;
  return score <= 3;
}
function combiTargetKw(baths) {
  const DEFAULT_KW = 35;
  const score = bathsScore(baths);
  if (score == null) return DEFAULT_KW;
  if (score === 1) return 24;
  if (score === 2) return 30;
  return 35;
}
function sysHeatBand(radsBucket) {
  if (!radsBucket) return { min: 18, max: 24 };
  if (radsBucket === "UP_TO_6") return { min: 15, max: 18 };
  if (radsBucket === "R7_12") return { min: 18, max: 24 };
  if (radsBucket === "R13_20") return { min: 24, max: 30 };
  return { min: 30, max: 60 };
}
function pickKwForSystemHeat(productsOfType, band) {
  const within = productsOfType.map((p) => p.kw).filter((kw) => kw >= band.min && kw <= band.max).sort((a, b) => b - a);
  if (within.length) return within[0];
  const aboveMin = productsOfType.map((p) => p.kw).filter((kw) => kw > band.min).sort((a, b) => a - b);
  if (aboveMin.length) return aboveMin[0];
  const belowMax = productsOfType.map((p) => p.kw).filter((kw) => kw < band.max).sort((a, b) => b - a);
  if (belowMax.length) return belowMax[0];
  return null;
}
function resolveBoilerTypeFromAnswers(answers, { combiOk, combiKw }) {
  if (isYes(answers?.move_to_combi)) return "combi";
  const typeKnown = (answers?.boiler_type_known?.label || "").toLowerCase() === "yes";
  const currentType = (answers?.current_boiler_type?.label || "").toLowerCase();
  if (typeKnown) {
    if (currentType.includes("combi")) return "combi";
    if (currentType.includes("system")) return "system";
    if (currentType.includes("regular") || currentType.includes("standard") || currentType.includes("back")) {
      return "heat_only";
    }
  }
  const tank = (answers?.has_water_tank?.label || "").toLowerCase();
  const gauge = (answers?.pressure_gauge?.label || "").toLowerCase();
  if (tank === "yes") {
    if (gauge === "yes") return "system";
    if (gauge === "no") return "heat_only";
    return "system";
  }
  if (tank === "no") {
    if (combiOk && combiKw != null) return "combi";
    return "system";
  }
  return combiOk && combiKw != null ? "combi" : "system";
}
function resolveFlueType(answers) {
  const label2 = (answers?.flue_wall?.label || "").toLowerCase();
  const isVertical = label2.startsWith("no") || label2.includes("roof");
  return isVertical ? "vertical" : "horizontal";
}
function computeAddOns(answers, boilerType, { ADDONS: ADDONS2, RULES: RULES2 }) {
  const items = [];
  if ((answers?.thermostat_type?.label || "Basic").toLowerCase() === "smart") {
    items.push({
      key: ADDONS2.SMART_STAT.key,
      label: ADDONS2.SMART_STAT.label,
      qty: 1,
      unitPrice: ADDONS2.SMART_STAT.unitPrice,
      total: ADDONS2.SMART_STAT.unitPrice
    });
  }
  if ((answers?.trv_required?.label || "No") === "Yes") {
    const qty = clampInt(answers?.trv_qty?.value ?? 0, 0, RULES2.TRV_MAX_QTY);
    if (qty > 0) {
      items.push({
        key: ADDONS2.TRV.key,
        label: ADDONS2.TRV.label,
        qty,
        unitPrice: ADDONS2.TRV.unitPrice,
        total: money(qty * ADDONS2.TRV.unitPrice)
      });
    }
  }
  const flue = resolveFlueType(answers);
  if (flue === "vertical") {
    const verticalKey = boilerType === "combi" ? ADDONS2.COMBI_VERTICAL_FLUE : ADDONS2.SYS_HEAT_VERTICAL_FLUE;
    items.push({
      key: verticalKey.key,
      label: verticalKey.label,
      qty: 1,
      unitPrice: verticalKey.unitPrice,
      total: verticalKey.unitPrice
    });
  }
  if (isYes(answers?.boiler_move_location)) {
    items.push({
      key: ADDONS2.BOILER_RELOCATION.key,
      label: ADDONS2.BOILER_RELOCATION.label,
      qty: 1,
      unitPrice: ADDONS2.BOILER_RELOCATION.unitPrice,
      total: ADDONS2.BOILER_RELOCATION.unitPrice
    });
  }
  const currentType = (answers?.current_boiler_type?.label || "").toLowerCase();
  const currentlyCombi = currentType.includes("combi");
  if (isYes(answers?.move_to_combi) && !currentlyCombi) {
    items.push({
      key: ADDONS2.CONVERT_TO_COMBI.key,
      label: ADDONS2.CONVERT_TO_COMBI.label,
      qty: 1,
      unitPrice: ADDONS2.CONVERT_TO_COMBI.unitPrice,
      total: ADDONS2.CONVERT_TO_COMBI.unitPrice
    });
  }
  const total = money(items.reduce((s, x) => s + (x.total || 0), 0));
  return { items, total, derived: { flueType: flue } };
}
function combiKwMatch(productKw, targetKw) {
  if (targetKw === 24) return productKw === 24 || productKw === 25;
  if (targetKw === 30) return productKw === 30;
  if (targetKw === 35) return productKw === 35 || productKw === 36;
  return false;
}
function buildBoilerQuote({ answers, questions = [] }) {
  const { RULES: RULES2, ADDONS: ADDONS2, PRODUCTS: PRODUCTS2 } = applyEffectiveConfig();
  console.log("EFFECTIVE TRV:", ADDONS2.TRV.unitPrice, "MAX:", RULES2.TRV_MAX_QTY);
  const qMap = questionMap(questions);
  const radsBucket = parseRadsBucket(label(answers?.radiators));
  const baths = parseBaths(label(answers?.bathrooms));
  const combiOk = combiAllowed(baths);
  const combiKw = combiTargetKw(baths);
  const allowedBoilerTypes = {
    combi: combiOk && combiKw != null,
    system: true,
    heat_only: true
  };
  const selectedBoilerType = resolveBoilerTypeFromAnswers(answers, { combiOk, combiKw });
  let sizing = null;
  if (selectedBoilerType === "combi") {
    sizing = { type: "combi", targetKw: combiKw };
  } else {
    const band = sysHeatBand(radsBucket);
    const typeProducts = PRODUCTS2.filter((p) => p.type === selectedBoilerType);
    const chosenKw = pickKwForSystemHeat(typeProducts, band);
    sizing = { type: selectedBoilerType, band, targetKw: chosenKw };
  }
  const addOns = computeAddOns(answers, selectedBoilerType, { ADDONS: ADDONS2, RULES: RULES2 });
  let products = PRODUCTS2.filter((p) => p.type === selectedBoilerType);
  if (selectedBoilerType === "combi") {
    const wantsCombi = isYes(answers?.move_to_combi);
    const filtered = combiKw != null ? products.filter((p) => combiKwMatch(p.kw, combiKw)) : [];
    products = wantsCombi && !filtered.length ? products : filtered.length ? filtered : products;
  } else {
    const band = sizing.band;
    const inBand = products.filter((p) => p.kw >= band.min && p.kw <= band.max);
    products = inBand.length ? inBand : products.sort((a, b) => a.kw - b.kw).slice(0, 3);
  }
  const pricedProducts = products.map((p) => {
    const base = selectedBoilerType === "combi" ? Number(p.baseInstallPrice || p.basePrice || 0) : money(Number(p.boilerCost || 0) + RULES2.MIN_MARGIN_SYSTEM_HEAT);
    const marginApplied = selectedBoilerType === "combi" ? 0 : RULES2.MIN_MARGIN_SYSTEM_HEAT;
    const pricingComplete = selectedBoilerType === "combi" ? true : p.boilerCost != null;
    const total = pricingComplete ? money(base + addOns.total) : null;
    return {
      ...p,
      pricing: {
        base,
        marginApplied,
        addOnsTotal: addOns.total,
        total,
        pricingComplete
      }
    };
  });
  const recommended = pricedProducts.find((x) => x.pricing.pricingComplete) || pricedProducts[0] || null;
  const answersDetailed = Object.entries(answers || {}).map(([id, val]) => ({
    id,
    question: qMap.get(id) || id,
    answerLabel: val?.label ?? null,
    answerValue: val?.value ?? null,
    raw: val
  }));
  const totals = {
    addOns: addOns.total,
    recommendedBase: recommended?.pricing?.base ?? null,
    recommendedTotal: recommended?.pricing?.total ?? null
  };
  return {
    meta: {
      version: "3.2",
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    inputs: {
      radiators: label(answers?.radiators),
      bathrooms: label(answers?.bathrooms),
      thermostat: label(answers?.thermostat_type) || "Basic",
      flueType: addOns.derived.flueType,
      trvRequired: label(answers?.trv_required) || "No",
      trvQty: Number(answers?.trv_qty?.value ?? 0)
    },
    eligibility: {
      allowedBoilerTypes,
      selectedBoilerType,
      forcedToCombi: isYes(answers?.move_to_combi) && !allowedBoilerTypes.combi
    },
    sizing,
    answers: {
      raw: answers,
      detailed: answersDetailed
    },
    addOns,
    products: pricedProducts,
    recommendedProductId: recommended?.id || null,
    totals
  };
}
const SERVICE_QUESTIONS = {
  new: [
    {
      id: "mains_gas",
      question: "Does your boiler run on mains gas?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/fuel-mains-gas.svg" },
        { label: "No", image: "/images/stepper/fuel-no-gas.svg" }
      ],
      infoBox: {
        badge: "Tip",
        text: "Most homes in the UK are connected to mains gas. If you receive a gas bill or have a gas meter installed, this is almost certainly the correct option for your home."
        // helperLabel: "Not sure?",
        // phone: "0330 113 1333",
        // phoneLabel: "Speak to an engineer",
      }
    },
    {
      id: "boiler_fuel",
      question: "What fuel does your boiler run on?",
      type: "select",
      options: [
        { label: "LPG Gas", image: "/images/stepper/fuel-lpg.svg" },
        { label: "Other", image: "/images/stepper/fuel-other.svg" }
      ],
      showIf: (a) => a.mains_gas?.label === "No"
    },
    {
      id: "fuel_help",
      question: "Thanks — this setup needs a specialist review. One of our experts will help you.",
      type: "info",
      showIf: (a) => a.mains_gas?.label === "No" && a.boiler_fuel?.label === "Other"
    },
    {
      id: "boiler_type_known",
      question: "Do you know the type of boiler currently installed?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      infoBox: {
        badge: "Tip",
        text: "Common types: Combi boiler • System boiler • Regular/Standard boiler\n\nSelect Yes if you know. If you’re not sure, choose No and we’ll guide you through it in the next step — or you can speak with an engineer."
        // helperLabel: "Not sure?",
        // phone: "0330 113 1333",
        // phoneLabel: "Speak to an expert",
      },
      showIf: (a) => a.mains_gas?.label === "Yes" || a.boiler_fuel?.label === "LPG Gas"
    },
    {
      id: "current_boiler_type",
      question: "What kind of boiler do you have right now?",
      type: "select",
      options: [
        {
          label: "Combi boiler",
          image: "/images/stepper/combi_boiler.png"
        },
        {
          label: "Regular / Standard boiler",
          image: "/images/stepper/regular_boiler.png"
        },
        {
          label: "System boiler",
          image: "/images/stepper/system_boiler.png"
        }
        // {
        //     label: "Back boiler",
        //     image: "/images/stepper/back_boiler.png",
        // },
      ],
      showIf: (a) => a.boiler_type_known?.label === "Yes"
    },
    {
      id: "has_water_tank",
      question: "Does your home have a water tank or hot water cylinder?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      showIf: (a) => a.boiler_type_known?.label === "No"
    },
    {
      id: "pressure_gauge",
      question: "Can you see a pressure gauge on your boiler?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      showIf: (a) => a.has_water_tank?.label === "Yes"
    },
    {
      id: "move_to_combi",
      question: "Are you thinking about moving to a combi boiler?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      showIf: (a) => ["Regular / Standard boiler", "System boiler"].includes(
        a.current_boiler_type?.label
      ) || a.pressure_gauge?.label === "Yes" || a.boiler_type_known?.label == "No" && a.has_water_tank?.label == "Yes" && a.pressure_gauge?.label == "No"
    },
    {
      id: "boiler_move_location",
      question: "Are you planning to move the boiler to a different location?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      showIf: (a) => a.move_to_combi?.label || a.has_water_tank?.label === "No" || a.current_boiler_type?.label === "Combi boiler"
    },
    {
      id: "preferred_location",
      question: "What is the preferred location for the boiler?",
      type: "select",
      options: [
        {
          label: "In the airing cupboard",
          image: "/images/stepper/location-cupboard.svg",
          priceNote: "+£800"
        },
        {
          label: "New place within the same room",
          image: "/images/stepper/location-same-room.svg",
          priceNote: "+£800"
        },
        {
          label: "Another room on the same floor",
          image: "/images/stepper/location-other-room.svg",
          priceNote: "+£800"
        },
        {
          label: "Another floor or loft",
          image: "/images/stepper/location-loft.svg",
          priceNote: "+£800"
        }
      ],
      showIf: (a) => a.boiler_move_location?.label === "Yes" || a.current_boiler_type?.label === "Back boiler"
    },
    {
      id: "property_type",
      question: "What type of property do you live in?",
      type: "select",
      options: [
        { label: "House", image: "/images/stepper/property-house.svg" },
        { label: "Bungalow", image: "/images/stepper/property-bungalow.svg" },
        { label: "Flat / Apartment", image: "/images/stepper/property-flat.svg" }
      ],
      showIf: (a) => a.boiler_move_location?.label === "No" || !!a.preferred_location
    },
    {
      id: "flat_upper_floor",
      question: "Is the property on the second floor or higher?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/option-yes.svg" },
        { label: "No", image: "/images/stepper/option-no.svg" }
      ],
      showIf: (a) => a.property_type?.label === "Flat / Apartment"
    },
    {
      id: "flue_reachable",
      question: "Can the flue be reached from outside?",
      type: "select",
      options: [
        { label: "Yes", image: "/images/stepper/outside_wall.png" },
        { label: "No", image: "/images/stepper/flue_roof.jpg" }
      ],
      showIf: (a) => a.flat_upper_floor?.label === "Yes"
    },
    {
      id: "flue_help",
      question: "Thanks — this setup requires a specialist assessment. Our team will help you.",
      type: "info",
      showIf: (a) => a.flue_reachable?.label === "No"
    },
    // Spec buckets (keep)
    {
      id: "bathrooms",
      question: "How many bathrooms are in your property?",
      type: "select",
      options: [
        { label: "1", image: "/images/stepper/bath-1.svg" },
        { label: "1.5", image: "/images/stepper/bath-1-5.svg" },
        { label: "2", image: "/images/stepper/bath-2.svg" },
        { label: "3+", image: "/images/stepper/bath-3plus.svg" }
      ],
      showIf: (a) => (a.property_type?.label === "House" || a.property_type?.label === "Bungalow" || a.flat_upper_floor?.label === "No" || a.flue_reachable?.label === "Yes") && (a.move_to_combi?.label === "Yes" || a.pressure_gauge?.label !== "No")
    },
    {
      id: "bedrooms",
      question: "How many bedrooms are in your property?",
      type: "select",
      options: [
        { label: "1", image: "/images/stepper/bed-1.svg" },
        { label: "2", image: "/images/stepper/bed-2.svg" },
        { label: "3", image: "/images/stepper/bed-3.svg" },
        { label: "4+", image: "/images/stepper/bed-4plus.svg" }
      ],
      showIf: (a) => !!a.bathrooms || a.pressure_gauge?.label === "No"
    },
    // ✅ show radiators always once bedrooms are known (even when moving to combi)
    {
      id: "radiators",
      question: "How many radiators are in your home?",
      type: "select",
      options: [
        { label: "Up to 6", image: "/images/stepper/rads-6.svg" },
        { label: "7–12", image: "/images/stepper/rads-7-12.svg" },
        { label: "13–20", image: "/images/stepper/rads-13-20.svg" },
        { label: "21+", image: "/images/stepper/rads-21plus.svg" }
      ],
      showIf: (a) => !!a.bedrooms
    },
    // No flue_type needed. Engine: if flue_wall=No => +£300 vertical flue.
    {
      id: "flue_wall",
      question: "Does the flue come out the wall?",
      type: "select",
      options: [
        {
          label: "Yes",
          image: "/images/stepper/Is your flue coming out of the wall - YES.jpeg"
        },
        {
          label: "No, it comes out the roof",
          image: "/images/stepper/Is your flue coming out of the wall - NO.jpeg"
        }
      ],
      helperImages: [
        // {
        //     src: "/images/stepper/outside_wall.png",
        //     alt: "Boiler flue coming out of the wall",
        // },
        // {
        //     src: "/images/stepper/outside_wall2.png",
        //     alt: "External boiler flue example",
        // },
      ],
      showIf: (a) => a.boiler_move_location?.label === "No" && !!a.radiators || a.pressure_gauge?.label === "No" || a.current_boiler_type?.label == "Back boiler"
    },
    {
      id: "thermostat_type",
      question: "Which thermostat do you require?",
      type: "select",
      infoBox: {
        badge: "Tip",
        text: `A smart thermostat allows you to control your heating remotely via iOS or Android, set schedules, and improve efficiency.

You can also keep your current thermostat at no extra cost.
• Standard wireless thermostat (free & included)
`
      },
      options: [
        {
          label: "Basic",
          priceNote: "Free (Included)",
          image: "/images/stepper/STANDARD_room_thermostat-removebg-preview.png"
        },
        {
          label: "Smart",
          priceNote: "+£100",
          image: "/images/stepper/SMART_room_thermostat-removebg-preview.png"
        },
        {
          label: "Use existing thermostat",
          priceNote: "Free",
          image: "/images/stepper/STANDARD_room_thermostat-removebg-preview.png"
        }
      ],
      preset: { label: "Basic" },
      showIf: (a) => !!a.radiators
    },
    {
      id: "trv_required",
      question: "Do you require new/additional TRVs?",
      type: "select",
      infoBox: {
        badge: "Tip",
        text: `Thermostatic Radiator Valves (TRVs)
                Required under current Building Regulations to allow individual room temperature control.

                Any missing or faulty TRVs will need to be replaced to ensure compliance with current standards.

                `
      },
      options: [
        { label: "No", image: "/images/stepper/option-no.svg" },
        { label: "Yes", priceNote: "+£35 each", image: "/images/stepper/TRV-removebg-preview.png" }
      ],
      preset: { label: "No" },
      showIf: (a) => !!a.thermostat_type
    },
    {
      id: "trv_qty",
      question: "How many TRVs?",
      type: "dropdown",
      options: Array.from({ length: 13 }, (_, idx) => {
        const v = idx + 1;
        return { label: String(v), value: v };
      }),
      showIf: (a) => a.trv_required?.label === "Yes"
    }
  ]
};
function QuoteProcessingModal({
  open,
  answers,
  onComplete,
  onClose
}) {
  const STEP_DURATION_MS = 1200;
  const REDIRECT_DELAY_MS = 650;
  const [activeStep, setActiveStep] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const canvasRef = useRef(null);
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    if (!open) return;
    const q = buildBoilerQuote({
      answers,
      questions: SERVICE_QUESTIONS.new
    });
    console.log("Built quote:", q);
    const postcode = answers?.details?.postcode || new URLSearchParams(window.location.search).get("postcode") || "";
    setQuote({
      ...q,
      inputs: { ...q?.inputs || {}, postcode }
    });
  }, [open, answers]);
  const steps = useMemo(
    () => [
      {
        id: 1,
        text: buildQuoteText(answers),
        icon: FiHome,
        frequency: 120,
        waveColor: "rgb(54, 193, 255)"
      },
      {
        id: 2,
        text: buildCompatibilityText(answers),
        icon: FiTool,
        frequency: 180,
        waveColor: "rgb(30, 151, 230)"
      },
      {
        id: 3,
        text: "Verifying installer availability & warranty options",
        icon: PoundIcon,
        frequency: 240,
        waveColor: "rgb(0, 171, 219)"
      }
    ],
    [answers]
  );
  useEffect(() => {
    if (!open) return;
    let raf;
    let start;
    const animate = (t) => {
      if (!start) start = t;
      setWaveOffset((t - start) * 1e-3 % 1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [open, activeStep]);
  useEffect(() => {
    if (!open) {
      setDisplayProgress(0);
      return;
    }
    const totalDuration = steps.length * STEP_DURATION_MS;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, elapsed / totalDuration * 100);
      setDisplayProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [open, steps.length]);
  useEffect(() => {
    if (!canvasRef.current || !open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const step = steps[activeStep];
    if (!step) return;
    ctx.beginPath();
    ctx.strokeStyle = step.waveColor.replace("rgb", "rgba").replace(")", ",0.35)");
    ctx.lineWidth = 3;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin((x + waveOffset * canvas.width) * 0.02) * 40;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [waveOffset, activeStep, steps, open]);
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setDisplayProgress(0);
      return;
    }
    if (activeStep >= steps.length) return;
    const timer = setTimeout(
      () => setActiveStep((s) => s + 1),
      STEP_DURATION_MS
    );
    return () => clearTimeout(timer);
  }, [open, activeStep, steps.length, STEP_DURATION_MS]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  const completed = activeStep >= steps.length;
  const currentStep = steps[Math.min(activeStep, steps.length - 1)];
  const progressPercent = Math.min(100, Math.round(displayProgress));
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference - progressPercent / 100 * ringCircumference;
  useEffect(() => {
    if (!open || !completed || !quote) return;
    const timer = setTimeout(() => {
      const csrfToken = document.head.querySelector(
        'meta[name="csrf-token"]'
      )?.content;
      const payload = csrfToken ? { ...quote, _token: csrfToken } : quote;
      router.post(`/book/quote/new/results`, payload, {
        preserveScroll: true
      });
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, completed, quote, REDIRECT_DELAY_MS]);
  if (!open) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id: "quote-processing-modal",
      className: "fixed inset-0 z-50 bg-[#00ABDB]/32 backdrop-blur-[2px] quote-processing-overlay",
      role: "dialog",
      "aria-modal": "true",
      children: [
        /* @__PURE__ */ jsx("style", { children: `
                #quote-processing-modal,
                #quote-processing-modal * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                #quote-processing-modal .modal-card,
                #quote-processing-modal .modal-left,
                #quote-processing-modal .modal-right {
                    background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    box-shadow: 0 22px 60px rgba(0, 63, 85, 0.28) !important;
                }

                #quote-processing-modal .modal-soft-chip,
                #quote-processing-modal .modal-soft-block {
                    background: rgba(255, 255, 255, 0.10) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                }

                #quote-processing-modal [class*="text-"],
                #quote-processing-modal .text-dark,
                #quote-processing-modal .text-muted-foreground,
                #quote-processing-modal p,
                #quote-processing-modal h2,
                #quote-processing-modal h3,
                #quote-processing-modal span,
                #quote-processing-modal button,
                #quote-processing-modal svg {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                #quote-processing-modal .modal-soft-text {
                    color: rgba(255, 255, 255, 0.86) !important;
                    -webkit-text-fill-color: rgba(255, 255, 255, 0.86) !important;
                }

                #quote-processing-modal .modal-track {
                    background-color: rgba(255, 255, 255, 0.24) !important;
                }

                #quote-processing-modal .modal-progress {
                    background: linear-gradient(90deg, #8bdfff 0%, #36c1ff 100%) !important;
                }

                @media (max-width: 640px) {
                    #quote-processing-modal {
                        background: rgba(0, 171, 219, 0.38) !important;
                    }
                }

                @media (max-width: 640px) and (prefers-color-scheme: dark) {
                    #quote-processing-modal,
                    #quote-processing-modal * {
                        color-scheme: light !important;
                        forced-color-adjust: none !important;
                    }

                    #quote-processing-modal {
                        background: rgba(0, 171, 219, 0.40) !important;
                    }
                }
            ` }),
        /* @__PURE__ */ jsx("div", { className: "h-[100dvh] w-full flex items-end sm:items-center justify-center p-0 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:max-w-5xl", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-12 left-6 h-40 w-40 rounded-full bg-[#36C1FF]/30 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-[#00ABDB]/30 blur-3xl" }),
          /* @__PURE__ */ jsxs("div", { className: "relative modal-card rounded-t-3xl sm:rounded-3xl border", children: [
            /* @__PURE__ */ jsx(
              "canvas",
              {
                ref: canvasRef,
                className: "hidden sm:block absolute inset-0 w-full h-full rounded-3xl opacity-30 pointer-events-none",
                width: 900,
                height: 500
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[100dvh] sm:h-auto sm:rounded-3xl sm:overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "sm:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 modal-soft-block border-b", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx(FiClock, { className: "text-white w-5 h-5" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-dark", children: "Preparing your quote" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Almost there…" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "h-10 w-10 rounded-xl bg-white border border-dark/10 flex items-center justify-center text-dark",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsx(FiX, {})
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-4 pb-36 sm:pb-4 sm:px-0 sm:grid sm:grid-cols-1 lg:grid-cols-5 sm:gap-6 sm:p-4 lg:p-0 overflow-y-auto sm:overflow-visible thin-scroll h-full sm:h-auto", children: [
                /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 modal-left rounded-3xl border p-5 sm:p-8 mt-4 sm:mt-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 rounded-full border modal-soft-chip px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]", children: "Instant estimate" }),
                    /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 text-xs modal-soft-text", children: [
                      /* @__PURE__ */ jsx(FiClock, { className: "text-primary" }),
                      "Live checks"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("h2", { className: "mt-4 text-[20px] sm:text-[22px] font-extrabold text-dark", children: "Preparing your quote" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-[14px] modal-soft-text", children: "We’re matching the best boiler options to your home in seconds." }),
                  /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border modal-soft-block p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxs("svg", { width: "120", height: "120", viewBox: "0 0 120 120", children: [
                        /* @__PURE__ */ jsx(
                          "circle",
                          {
                            cx: "60",
                            cy: "60",
                            r: ringRadius,
                            stroke: "rgba(15, 23, 42, 0.12)",
                            strokeWidth: "10",
                            fill: "none"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "circle",
                          {
                            cx: "60",
                            cy: "60",
                            r: ringRadius,
                            stroke: "url(#progressGradient)",
                            strokeWidth: "10",
                            fill: "none",
                            strokeLinecap: "round",
                            strokeDasharray: ringCircumference,
                            strokeDashoffset: ringDashOffset,
                            transform: "rotate(-90 60 60)"
                          }
                        ),
                        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "progressGradient", x1: "0", x2: "1", y1: "0", y2: "1", children: [
                          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#36C1FF" }),
                          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1E97E6" })
                        ] }) })
                      ] }),
                      completed ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30", children: /* @__PURE__ */ jsx(FiCheck, { className: "text-white w-6 h-6" }) }) }) : /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                        /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-dark", children: [
                          progressPercent,
                          "%"
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] modal-soft-text", children: "Complete" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[12px] uppercase tracking-[0.2em] modal-soft-text", children: "Now checking" }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-2 text-[16px] sm:text-[18px] font-semibold text-dark break-words", children: currentStep?.text }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[12px] modal-soft-text", children: "Fast, accurate, and tailored to your answers." }),
                      completed && /* @__PURE__ */ jsx("p", { className: "mt-2 text-[12px] font-semibold text-primary", children: "Redirecting to your results…" })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3 text-[12px] modal-soft-text", children: [
                    /* @__PURE__ */ jsx("div", { className: "rounded-xl border modal-soft-chip px-3 py-2", children: "Fixed price options" }),
                    /* @__PURE__ */ jsx("div", { className: "rounded-xl border modal-soft-chip px-3 py-2", children: "Trusted brands only" }),
                    /* @__PURE__ */ jsx("div", { className: "rounded-xl border modal-soft-chip px-3 py-2", children: "Clear install timeline" }),
                    /* @__PURE__ */ jsx("div", { className: "rounded-xl border modal-soft-chip px-3 py-2", children: "No hidden extras" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 flex flex-col space-y-6 mt-4 sm:mt-0", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 modal-right backdrop-blur-xl rounded-3xl border p-5 sm:p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-5", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-[16px] sm:text-lg font-semibold text-dark", children: "Live checks" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] modal-soft-text", children: "Real-time" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-3 sm:space-y-4", children: steps.map((step, i) => {
                    const Icon = step.icon;
                    const active = i === activeStep;
                    const done = i < activeStep;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-2xl p-4 border transition ${active ? "border-white/55 bg-white/18" : done ? "border-white/45 bg-white/14" : "border-white/30 bg-white/10"}`,
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${active ? "bg-gradient-to-br from-secondary to-primary" : done ? "bg-primary" : "bg-white/25"}`,
                              children: /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `${active ? "animate-spin" : ""} inline-flex items-center justify-center`,
                                  children: /* @__PURE__ */ jsx(
                                    Icon,
                                    {
                                      className: `w-4 h-4 ${active || done ? "text-white" : "text-white"}`
                                    }
                                  )
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxs("p", { className: "text-[12px] sm:text-[14px] font-semibold modal-soft-text", children: [
                              "Step ",
                              i + 1
                            ] }),
                            /* @__PURE__ */ jsx("p", { className: "text-[13px] text-dark line-clamp-2", children: step.text })
                          ] }),
                          done && /* @__PURE__ */ jsx(FiCheck, { className: "text-primary shrink-0" })
                        ] })
                      },
                      step.id
                    );
                  }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs modal-soft-text mb-1", children: [
                      /* @__PURE__ */ jsx("span", { children: "Finishing up" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        progressPercent,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 modal-track rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-full modal-progress transition-[width] duration-300 ease-out",
                        style: {
                          width: `${progressPercent}%`
                        }
                      }
                    ) })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "hidden sm:flex absolute top-4 right-4 h-11 w-11 rounded-2xl modal-soft-chip border items-center justify-center text-white hover:bg-white/20 transition",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(FiX, {})
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
function PoundIcon({ className = "" }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `${className} inline-flex items-center justify-center w-4 h-4 text-[16px] font-extrabold leading-none tracking-tight`,
      "aria-hidden": "true",
      children: "£"
    }
  );
}
function buildQuoteText(answers) {
  const flue = answers?.flue_type?.label;
  return `Reviewing your boiler requirements${flue ? ` (${flue.toLowerCase()} flue)` : ""}`;
}
function buildCompatibilityText(answers) {
  const rads = answers?.radiator_count?.label;
  const baths = answers?.bathrooms?.label;
  const info = [];
  if (rads) info.push(`${rads.toLowerCase()} radiators`);
  if (baths) info.push(`${baths.toLowerCase()} bathrooms`);
  return info.length ? `Sizing the system for your home (${info.join(", ")})` : "Sizing the system for your home";
}
function InstantQuoteModal({ open, price, onClose, answers, serviceKey }) {
  const { symbol } = usePage().props;
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-md w-full p-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(FiCheck, { className: "text-white w-7 h-7" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-dark", children: "Instant quote ready" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Fixed price — no call needed" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 text-4xl font-extrabold text-dark", children: [
      symbol,
      price
    ] }),
    /* @__PURE__ */ jsx(PayAndBookButton, { serviceKey, answers, price }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "mt-4 text-sm text-muted-foreground hover:underline",
        children: "Close"
      }
    )
  ] }) });
}
function PayAndBookButton({ serviceKey, answers, price }) {
  const [processing, setProcessing] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const showValidationErrors = (errorsObj) => {
    if (!errorsObj || typeof errorsObj !== "object") return;
    const messages = Object.values(errorsObj).flat().filter(Boolean);
    if (!messages.length) return;
    messages.slice(0, 4).forEach((m) => toast.error(m, { duration: 5e3, position: "top-center" }));
    if (messages.length > 4) toast.error("Please review the highlighted fields and try again.", { duration: 5e3 });
  };
  const handleCheckout = async () => {
    if (processing) return;
    setProcessing(true);
    console.log("Payloaad", { service: serviceKey, form: answers, amount: price });
    try {
      const res = await axios.post(
        "/quote/checkout",
        { service: serviceKey, form: answers, amount: price },
        { timeout: 15e3 }
      );
      const checkoutUrl = res?.data?.data?.checkout_url;
      if (!checkoutUrl) throw new Error("Checkout URL missing from response.");
      window.location.assign(checkoutUrl);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: handleCheckout,
      disabled: processing,
      "aria-busy": processing,
      className: [
        "mt-6 w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition",
        processing ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:opacity-90"
      ].join(" "),
      children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(FiLoader, { className: "animate-spin" }),
        "Processing…"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(FiCreditCard, {}),
        "Pay & Book Now"
      ] })
    }
  );
}
const SERVICES_WITH_INSTANT_QUOTE = [
  "boiler_repair",
  "boiler_service",
  "power_flush"
];
function Stepper({
  title = "Boiler Repair Quote",
  steps = [],
  basePrice = 0,
  currency = "£",
  onSubmit,
  serviceKey,
  autoAdvance = false
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTriggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [showInstantQuote, setShowInstantQuote] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const lastAutoAdvanceRef = useRef(null);
  const skipAutoAdvanceRef = useRef(false);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  const visibleSteps = useMemo(() => {
    return steps.filter((step) => {
      if (!step.showIf) return true;
      return step.showIf(answers);
    });
  }, [steps, answers]);
  const current = visibleSteps[index] || null;
  useEffect(() => {
    Object.keys(answers).forEach((key) => {
      const step = steps.find((s) => s.id === key);
      if (step?.showIf && !step.showIf(answers)) {
        setAnswers((prev) => {
          const next2 = { ...prev };
          delete next2[key];
          return next2;
        });
      }
    });
  }, [answers, steps]);
  useEffect(() => {
    if (!isDropdownOpen || !dropdownTriggerRef.current) return;
    const rect = dropdownTriggerRef.current.getBoundingClientRect();
    const dropdownHeight = 320;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenUpwards(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
  }, [isDropdownOpen]);
  const displayOptions = useMemo(() => {
    if (!current?.options) return [];
    const rawOptions = typeof current.options === "function" ? current.options(answers) : current.options;
    return (rawOptions || []).map(
      (opt) => typeof opt === "string" ? { label: opt, price: 0 } : {
        ...opt,
        requiresText: opt.requiresText || false
      }
    );
  }, [current, answers]);
  Object.keys(answers).length;
  useEffect(() => {
    steps.forEach((step) => {
      if (step.preset && !answers[step.id]) {
        setAnswers((s) => ({
          ...s,
          [step.id]: step.preset
        }));
      }
    });
  }, [steps]);
  function choose(option) {
    if (!current) return;
    const shouldAutoAdvance = autoAdvance && ["select", "dropdown", "make_model"].includes(current.type) && !option.requiresText;
    setAnswers((s) => {
      const updated = {
        ...s,
        [current.id]: {
          ...option,
          price: option.price || 0,
          extraText: ""
        }
      };
      console.log("All answers state:", updated);
      if (shouldAutoAdvance) {
        const key = `${current.id}:${option.label ?? option.value ?? JSON.stringify(option)}`;
        lastAutoAdvanceRef.current = key;
        const nextVisibleSteps = steps.filter((step) => {
          if (!step.showIf) return true;
          return step.showIf(updated);
        });
        const currentIndex = nextVisibleSteps.findIndex(
          (step) => step.id === current.id
        );
        if (currentIndex >= 0) {
          if (currentIndex >= nextVisibleSteps.length - 1) {
            handleCompletion(updated);
          } else {
            setIndex(currentIndex + 1);
          }
        }
      }
      return updated;
    });
  }
  useEffect(() => {
    if (!autoAdvance || !current) return;
    if (skipAutoAdvanceRef.current) {
      skipAutoAdvanceRef.current = false;
      return;
    }
    if (!["select", "dropdown", "make_model"].includes(current.type)) return;
    const ans = answers[current.id];
    if (!ans || ans.requiresText) return;
    if (current.type === "make_model") {
      if (!ans.brand || !ans.model) return;
    }
    const key = `${current.id}:${ans.label ?? ans.value ?? JSON.stringify(ans)}`;
    if (lastAutoAdvanceRef.current === key) return;
    lastAutoAdvanceRef.current = key;
    setIndex((i) => Math.min(i + 1, visibleSteps.length - 1));
  }, [autoAdvance, current, answers, visibleSteps.length]);
  function updateMakeModel(next2) {
    setAnswers((s) => ({
      ...s,
      [current.id]: {
        ...s[current.id] || {},
        ...next2
      }
    }));
  }
  function updateText(value) {
    setAnswers((s) => ({
      ...s,
      [current.id]: {
        ...s[current.id] || {},
        value
      }
    }));
  }
  function updateExtraText(value) {
    setAnswers((s) => ({
      ...s,
      [current.id]: {
        ...s[current.id],
        extraText: value
      }
    }));
  }
  const handleCompletion = (submittedAnswers = answersRef.current) => {
    if (serviceKey?.key === "boiler_service") {
      router.post(route("book.quote.service.checkout"), submittedAnswers, {
        preserveScroll: true
      });
      return;
    }
    if (serviceKey?.key === "boiler_repair") {
      router.post(route("book.quote.repair.checkout"), submittedAnswers, {
        preserveScroll: true
      });
      return;
    }
    if (SERVICES_WITH_INSTANT_QUOTE.includes(serviceKey?.key)) {
      setShowInstantQuote(true);
      setShowProcessing(false);
    } else {
      setShowProcessing(true);
      setShowInstantQuote(false);
    }
  };
  function next() {
    if (!canProceed) return;
    setIndex((i) => i + 1);
  }
  function back() {
    if (autoAdvance) {
      skipAutoAdvanceRef.current = true;
      lastAutoAdvanceRef.current = null;
    }
    setIndex((i) => Math.max(0, i - 1));
  }
  function restart() {
    setIndex(0);
    setAnswers({});
  }
  const pricing = useMemo(() => {
    const radiatorPrice = answers.radiators?.price || 0;
    return {
      base: Number(basePrice) || 0,
      radiator: Number(radiatorPrice),
      total: Number(basePrice || 0) + Number(radiatorPrice)
    };
  }, [answers, basePrice]);
  const canProceed = useMemo(() => {
    if (!current) return false;
    const ans = answers[current.id];
    if (current.type === "upload") return true;
    if (current.type === "text") {
      return !!ans?.value?.trim();
    }
    if (current.type === "info") return false;
    if (current.type === "select") {
      if (!ans) return false;
      if (ans.requiresText) {
        return !!ans.extraText?.trim();
      }
      return true;
    }
    if (current.type === "dropdown") {
      return !!ans?.label;
    }
    if (current.type === "make_model") {
      if (!ans?.brand || !ans?.model) return false;
      if (ans.requiresText) return !!ans.extraText?.trim();
      return true;
    }
    if (current.type === "checkbox_quantity") {
      return true;
    }
    if (current.type === "details") {
      return !!ans?.name?.trim() && !!ans?.phone?.trim() && !!ans?.email?.trim() && !!ans?.postcode?.trim();
    }
    if (current.type === "datetime") {
      return !!ans?.datetime?.date && !!ans?.datetime?.time;
    }
    return false;
  }, [current, answers]);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!canProceed) return;
      if (index === visibleSteps.length - 1) {
        handleCompletion();
      } else {
        setIndex((i) => i + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, index, visibleSteps.length, serviceKey, answers]);
  const optionGridColumns = displayOptions.length === 1 ? "grid-cols-1" : displayOptions.length === 2 ? "grid-cols-2 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-light-grey -z-10 quote-page-bg",
        style: {
          backgroundColor: "#f7faf9",
          backgroundImage: "radial-gradient(circle at top, rgba(16,185,129,0.30), transparent 45%)"
        }
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "min-h-screen bg-light-grey overflow-hidden quote-page-bg",
        style: {
          backgroundColor: "#f7faf9",
          backgroundImage: "radial-gradient(circle at top, rgba(16,185,129,0.30), transparent 45%)"
        },
        children: [
          /* @__PURE__ */ jsx(PageHeader, {}),
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "service_key", value: serviceKey }),
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "service_name", value: title }),
          /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-10 py-16 px-4 sm:px-6 lg:px-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold text-dark", children: title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Answer a few quick questions to get a clear, fixed-price estimate." })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "group relative flex items-center gap-4 px-5 py-3 rounded-2xl bg-white border border-primary/50 shadow-sm overflow-hidden quote-trust-card",
                  style: {
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(15,23,42,0.12)",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.08)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary to-dark/90" }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-9 h-9 rounded-lg bg-primary/80 text-foreground shrink-0", children: /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" }),
                          /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Certified Engineers" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-dark", children: "Gas Safe Registered" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch", children: /* @__PURE__ */ jsx("section", { className: "md:col-span-12 h-full flex", children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "glass-root p-8 rounded-3xl w-full flex flex-col relative min-h-[75vh] sm:min-h-[640px] quote-question-shell",
                style: {
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,252,255,0.98))",
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.10)"
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "radial-highlight absolute inset-0 pointer-events-none" }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Question" }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: restart,
                        className: "inline-flex items-center gap-2 text-xs bg-foreground text-dark px-3 py-1.5 rounded-full cursor-pointer shadow-sm hover:bg-white transition-colors",
                        children: [
                          /* @__PURE__ */ jsx(FiRefreshCcw, { className: "text-sm" }),
                          "Reset"
                        ]
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-center text-dark mb-4", children: current?.question }),
                  current?.infoBox && /* @__PURE__ */ jsxs("div", { className: "mb-8 max-w-3xl mx-auto text-center", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary mr-2 align-middle", children: current.infoBox.badge ?? "Tip" }),
                      current.infoBox.text
                    ] }),
                    current.infoBox.phone && current.infoBox.phoneLabel && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm text-slate-500", children: [
                      current.infoBox.helperLabel ?? "Not sure?",
                      " ",
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: `tel:${current.infoBox.phone.replace(/\s/g, "")}`,
                          className: "font-semibold text-slate-900 hover:underline",
                          children: current.infoBox.phoneLabel
                        }
                      )
                    ] })
                  ] }),
                  current?.type === "checkbox_quantity" && /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto w-full", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `flex items-center justify-between rounded-2xl border px-6 py-5 transition ${answers[current.id]?.enabled ? "border-primary bg-primary/5" : "border-dark/20 bg-white"}`,
                      children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-4 cursor-pointer", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: answers[current.id]?.enabled || false,
                            onChange: (e) => {
                              const enabled = e.target.checked;
                              setAnswers((s) => ({
                                ...s,
                                [current.id]: enabled ? {
                                  enabled: true,
                                  qty: 1,
                                  unitPrice: current.price,
                                  price: current.price
                                } : {
                                  enabled: false,
                                  qty: 0,
                                  unitPrice: current.price,
                                  price: 0
                                }
                              }));
                            },
                            className: "h-5 w-5 accent-primary"
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-dark", children: current.label }) })
                      ] })
                    }
                  ) }),
                  current?.type === "upload" && /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl", children: [
                    /* @__PURE__ */ jsxs("label", { className: "group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 transition hover:border-primary hover:bg-white", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "file",
                          multiple: true,
                          accept: "image/*,video/*",
                          onChange: (e) => setAnswers((s) => ({
                            ...s,
                            [current.id]: Array.from(
                              e.target.files
                            )
                          })),
                          className: "sr-only"
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxs(
                        "svg",
                        {
                          className: "h-5 w-5",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          viewBox: "0 0 24 24",
                          children: [
                            /* @__PURE__ */ jsx("path", { d: "M12 16v-8m0 0l-4 4m4-4l4 4" }),
                            /* @__PURE__ */ jsx("path", { d: "M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-dark", children: "Upload photos or videos" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Optional, but helpful for diagnosis" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "ml-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-dark transition group-hover:border-primary group-hover:text-primary", children: "Choose files" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-400", children: "JPG, PNG supported" })
                  ] }) }),
                  current?.type === "text" && /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto w-full", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: current.placeholder,
                      value: answers[current.id]?.value || "",
                      onChange: (e) => updateText(e.target.value),
                      className: "w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    }
                  ) }),
                  current?.type === "info" && /* @__PURE__ */ jsx("div", { className: "mt-5 w-full lg:max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "w-full relative flex flex-col lg:flex-row gap-8", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 group w-full", children: /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: "https://wa.me/447454796398",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "\n                    relative flex flex-col sm:flex-row sm:items-center gap-4\n                    p-4 sm:p-5\n                    rounded-2xl bg-gradient-to-br from-white to-green-50/30\n                    border-l-4 border-green-400 hover:border-green-500\n                    transition-all duration-300 hover:shadow-lg\n                    group-hover:shadow-green-100/50 overflow-hidden\n                    ",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-green-400/5 to-transparent" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center ", children: [
                            /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "relative h-12 w-12 sm:h-14 sm:w-14", children: [
                              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsx(
                                "svg",
                                {
                                  className: "h-6 w-6 text-green-600",
                                  fill: "currentColor",
                                  viewBox: "0 0 24 24",
                                  children: /* @__PURE__ */ jsx("path", { d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" })
                                }
                              ) }),
                              /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 rounded-full border-2 border-green-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" })
                            ] }) }),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1 relative z-10", children: [
                              /* @__PURE__ */ jsx("span", { className: "block text-[16px] font-bold text-gray-800", children: "WhatsApp" }),
                              /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: "Chat with an engineer" })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full sm:w-auto", children: /* @__PURE__ */ jsx("div", { className: "w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 sm:group-hover:translate-x-1", children: "Start chat" }) })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsx("div", { className: "flex-1 group w-full", children: /* @__PURE__ */ jsxs(
                      Link,
                      {
                        href: "/#contact",
                        className: "\n                    relative flex flex-col sm:flex-row sm:items-center gap-4\n                    p-4 sm:p-5\n                    rounded-2xl bg-gradient-to-br from-white to-blue-50/30\n                    border-r-4 border-blue-400 hover:border-blue-500\n                    transition-all duration-300 hover:shadow-lg\n                    group-hover:shadow-blue-100/50 overflow-hidden\n                ",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-400/5 to-transparent" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
                            /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "relative h-12 w-12 sm:h-14 sm:w-14", children: [
                              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300 shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsx(
                                "svg",
                                {
                                  className: "h-6 w-6 text-primary",
                                  fill: "currentColor",
                                  viewBox: "0 0 24 24",
                                  children: /* @__PURE__ */ jsx("path", { d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" })
                                }
                              ) }),
                              /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 rounded-full border-2 border-blue-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" })
                            ] }) }),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1 relative z-10", children: [
                              /* @__PURE__ */ jsx("span", { className: "block text-[14px] font-bold text-gray-800", children: "Engineer callback" }),
                              /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-500", children: "No phone queues" })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full sm:w-auto", children: /* @__PURE__ */ jsx("div", { className: "w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 sm:group-hover:-translate-x-1", children: "Request callback" }) })
                        ]
                      }
                    ) })
                  ] }) }),
                  current?.helperImages && current.helperImages.length >= 2 && /* @__PURE__ */ jsx("div", { className: "w-full flex flex-col items-center mb-10 mt-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-10", children: current.helperImages.slice(0, 2).map((img, index2) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      onMouseEnter: () => setHoveredIndex(
                        index2
                      ),
                      onMouseLeave: () => setHoveredIndex(
                        null
                      ),
                      onMouseMove: (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMouse({
                          x: (e.clientX - rect.left) / rect.width * 100,
                          y: (e.clientY - rect.top) / rect.height * 100
                        });
                      },
                      className: "relative w-[240px] md:w-[350px] aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md cursor-zoom-in",
                      children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: img.src,
                            alt: img.alt,
                            className: "absolute inset-0 w-full h-full object-cover"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `absolute inset-0 transition-opacity duration-300 ${hoveredIndex === index2 ? "opacity-100" : "opacity-0"}`,
                            children: /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: img.src,
                                alt: "",
                                className: "absolute inset-0 w-full h-full object-cover scale-[1.5]",
                                style: {
                                  transformOrigin: `${mouse.x}% ${mouse.y}%`
                                }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `pointer-events-none absolute inset-5 rounded-2xl border border-white/70 transition-opacity duration-300 ${hoveredIndex === index2 ? "opacity-100" : "opacity-0"}`
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 inset-x-0 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-1.5 rounded-full bg-black/70 backdrop-blur text-xs font-medium text-white", children: [
                          "Example",
                          " ",
                          index2 + 1
                        ] }) })
                      ]
                    },
                    index2
                  )) }) }),
                  current?.type === "make_model" && /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto w-full space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-dark mb-2", children: "Brand" }),
                        /* @__PURE__ */ jsxs(
                          "select",
                          {
                            className: "w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none",
                            value: answers[current.id]?.brand || "",
                            onChange: (e) => {
                              const brand = e.target.value;
                              updateMakeModel({
                                brand,
                                brandLabel: brand,
                                model: "",
                                modelLabel: "",
                                requiresText: false,
                                extraText: "",
                                label: brand || ""
                              });
                            },
                            children: [
                              /* @__PURE__ */ jsx("option", { value: "", children: "Select brand" }),
                              (current.brands || []).map((label2) => /* @__PURE__ */ jsx("option", { value: label2, children: label2 }, label2))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-dark mb-2", children: "Model" }),
                        /* @__PURE__ */ jsxs(
                          "select",
                          {
                            className: "w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none",
                            value: answers[current.id]?.model || "",
                            onChange: (e) => {
                              const selected = e.target.value;
                              const modelOptions = current.getModels?.(
                                answers[current.id]?.brand
                              ) || [];
                              const opt = modelOptions.find(
                                (o) => o.label === selected
                              );
                              const requiresText = !!opt?.requiresText;
                              updateMakeModel({
                                model: selected,
                                modelLabel: selected,
                                requiresText,
                                extraText: "",
                                label: `${answers[current.id]?.brand || ""}${selected ? ` — ${selected}` : ""}`
                              });
                            },
                            disabled: !answers[current.id]?.brand,
                            children: [
                              /* @__PURE__ */ jsx("option", { value: "", children: answers[current.id]?.brand ? "Select model" : "Select brand first" }),
                              (current.getModels?.(
                                answers[current.id]?.brand
                              ) || []).map((opt) => /* @__PURE__ */ jsx("option", { value: opt.label, children: opt.label }, opt.label))
                            ]
                          }
                        )
                      ] })
                    ] }),
                    answers[current.id]?.requiresText && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Enter model",
                        value: answers[current.id]?.extraText || "",
                        onChange: (e) => updateMakeModel({
                          extraText: e.target.value,
                          label: `${answers[current.id]?.brand || ""} — ${e.target.value}`
                        }),
                        className: "w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ) })
                  ] }),
                  current?.type === "dropdown" && /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto w-full overflow-x-clip", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        ref: dropdownTriggerRef,
                        type: "button",
                        onClick: () => setIsDropdownOpen((s) => !s),
                        className: `
                    w-full px-5 py-4 bg-white border-2 rounded-xl
                    flex items-center justify-between text-left
                    transition-all duration-200
                    ${isDropdownOpen ? "border-blue-500" : "border-gray-200"}
                `,
                        children: answers[current.id] ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full pr-2", children: [
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-gray-900 truncate", children: answers[current.id].label }),
                            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500 mt-1 truncate", children: "System size based pricing" })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 ml-4", children: /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-gray-900", children: [
                            "£",
                            answers[current.id].price
                          ] }) })
                        ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-lg", children: "Select an option..." })
                      }
                    ),
                    isDropdownOpen && /* @__PURE__ */ jsx(
                      "div",
                      {
                        ref: dropdownRef,
                        className: `absolute inset-x-0 z-50 ${openUpwards ? "bottom-full mb-2" : "top-full mt-2"}`,
                        children: /* @__PURE__ */ jsx("div", { className: "bg-white border-2 border-dark/20 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto", children: displayOptions.map(
                          (opt) => /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                choose(opt);
                                setIsDropdownOpen(
                                  false
                                );
                              },
                              className: "w-full px-5 py-4 text-left hover:bg-gray-50 flex justify-between",
                              children: /* @__PURE__ */ jsx("span", { className: "font-semibold", children: opt.label })
                            },
                            opt.value || opt.label
                          )
                        ) }) })
                      }
                    )
                  ] }) }),
                  current?.type === "details" && /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl px-2", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
                    {
                      key: "name",
                      label: "Full name"
                    },
                    {
                      key: "phone",
                      label: "Phone number"
                    },
                    {
                      key: "email",
                      label: "Email address"
                    },
                    {
                      key: "postcode",
                      label: "Postcode"
                    },
                    {
                      key: "address",
                      label: "Address (Optional)",
                      full: true
                    }
                  ].map(
                    ({ key, label: label2, full }) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `relative ${full ? "md:col-span-2" : ""}`,
                        children: [
                          /* @__PURE__ */ jsx("label", { className: "absolute -top-2 left-5 z-10 bg-white px-1 text-xs font-medium text-slate-500", children: label2 }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              value: answers[current.id]?.[key] || "",
                              onChange: (e) => setAnswers(
                                (s) => ({
                                  ...s,
                                  [current.id]: {
                                    ...s[current.id],
                                    [key]: e.target.value
                                  }
                                })
                              ),
                              className: "w-full rounded-2xl border border-dark/20 bg-white px-5 py-4 text-sm text-dark\n                                   focus:border-primary focus:ring-1 focus:ring-primary/10\n                                   transition"
                            }
                          )
                        ]
                      },
                      key
                    )
                  ) }) }) }),
                  current?.type === "datetime" && /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx(
                    AppointmentDateRangePicker,
                    {
                      value: answers[current.id]?.datetime || null,
                      type: serviceKey,
                      onChange: (payload) => {
                        console.log(
                          "Datetime Payloaad",
                          payload
                        );
                        setAnswers((s) => ({
                          ...s,
                          [current.id]: {
                            ...s[current.id],
                            datetime: payload
                            // ✅ stores {date,time}
                          }
                        }));
                      }
                    }
                  ) }),
                  current?.type === "select" && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `grid ${optionGridColumns} gap-5 max-w-5xl mx-auto w-full justify-items-stretch`,
                        children: displayOptions.map((opt) => {
                          const active = answers[current?.id]?.label === opt.label;
                          return /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `option-card relative overflow-hidden ${active ? "option-active sheen" : "option-inactive"}`,
                              children: /* @__PURE__ */ jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "w-full aspect-square p-5 sm:p-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center gap-4",
                                  onClick: () => choose(opt),
                                  children: [
                                    active && /* @__PURE__ */ jsx("span", { className: "absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow", children: /* @__PURE__ */ jsx(FiCheck, { className: "text-sm" }) }),
                                    opt.image && /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: `${current?.id === "flue_wall" ? "w-32 h-32 sm:w-36 sm:h-36" : "w-24 h-24 sm:w-28 sm:h-28"} flex items-center justify-center`,
                                        children: /* @__PURE__ */ jsx(
                                          "img",
                                          {
                                            src: opt.image,
                                            alt: opt.label,
                                            className: "w-full h-full object-contain"
                                          }
                                        )
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs("div", { children: [
                                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-dark", children: opt.label }),
                                      opt.priceNote && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-primary mt-1", children: opt.priceNote }),
                                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: active ? "Selected" : "Tap to choose" })
                                    ] })
                                  ]
                                }
                              )
                            },
                            opt.label
                          );
                        })
                      }
                    ),
                    answers[current?.id]?.requiresText && /* @__PURE__ */ jsx("div", { className: "max-w-lg mx-auto mt-6 w-full", children: /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Please provide details",
                        value: answers[current.id]?.extraText || "",
                        onChange: (e) => updateExtraText(
                          e.target.value
                        ),
                        className: "w-full rounded-xl border border-dark/20 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 md:pt-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 md:justify-between", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: answers[current?.id] ? "Answer recorded" : "Please choose an option" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: back,
                          disabled: index === 0,
                          className: `btn-pill flex gap-1 items-center cursor-pointer ${index === 0 ? "btn-disabled" : ""}`,
                          children: [
                            /* @__PURE__ */ jsx(FiChevronLeft, {}),
                            " Back"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => {
                            if (index === visibleSteps.length - 1) {
                              handleCompletion();
                            } else {
                              next();
                            }
                          },
                          disabled: !canProceed,
                          className: `btn-gloss flex gap-1 items-center cursor-pointer ${!canProceed ? "btn-disabled" : ""}`,
                          children: [
                            "Next ",
                            /* @__PURE__ */ jsx(FiChevronRight, {})
                          ]
                        }
                      )
                    ] })
                  ] })
                ]
              }
            ) }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      QuoteProcessingModal,
      {
        open: showProcessing,
        answers,
        onComplete: () => {
          setShowProcessing(false);
          console.log("READY TO SHOW QUOTES", answers);
        },
        onClose: () => setShowProcessing(false)
      }
    ),
    /* @__PURE__ */ jsx(
      InstantQuoteModal,
      {
        answers,
        open: showInstantQuote,
        price: pricing.total,
        onClose: () => setShowInstantQuote(false),
        serviceKey
      }
    )
  ] });
}
function getInitialData() {
  const params = new URLSearchParams(window.location.search);
  return {
    postcode: params.get("postcode") || ""
  };
}
function NewBoilerQuote() {
  const { postcode } = getInitialData();
  const { title } = usePage().props;
  const baseSteps = SERVICE_QUESTIONS?.new || [];
  const steps = useMemo(() => {
    return [...baseSteps];
  }, [postcode]);
  if (!baseSteps.length) {
    return /* @__PURE__ */ jsxs("div", { className: "py-24 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Configuration error" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-2", children: "No questions configured for new boiler" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(BlueQuoteSkin, { children: [
      /* @__PURE__ */ jsx(
        Stepper,
        {
          title: "New boiler quote",
          steps,
          basePrice: 0,
          serviceKey: SERVICES_KEY_VALUE.NEW_BOILER_QUOTE,
          autoAdvance: true
        }
      ),
      /* @__PURE__ */ jsx(GoogleReview, { theme: "blue" })
    ] })
  ] });
}
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewBoilerQuote
}, Symbol.toStringTag, { value: "Module" }));
function Cancelled() {
  const { booking } = usePage().props;
  return /* @__PURE__ */ jsx("div", { className: "min-h-[70vh] flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-3xl bg-white p-8 text-center shadow", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500", children: /* @__PURE__ */ jsx(FiXCircle, { className: "h-7 w-7 text-white" }) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Payment cancelled" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "No charges were made. You can restart checkout anytime." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl bg-gray-50 p-4 text-left text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Booking ID" }),
      /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900", children: [
        "#",
        booking?.id
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/",
          className: "w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 text-center",
          children: "Go home"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/",
          className: "w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white hover:opacity-90 text-center",
          children: "Restart"
        }
      )
    ] })
  ] }) });
}
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cancelled
}, Symbol.toStringTag, { value: "Module" }));
function OrderSuccess() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 1800)
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-green-800 via-green-800 to-green-800 flex items-center justify-center p-4 overflow-hidden relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 ${stage >= 1 ? "scale-150" : "scale-0"}`,
        style: { top: "10%", left: "20%" }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${stage >= 2 ? "scale-150" : "scale-0"}`,
        style: { bottom: "10%", right: "20%" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center max-w-2xl", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-12", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `relative w-32 h-32 transition-all duration-700 ${stage >= 1 ? "scale-100 rotate-0" : "scale-0 -rotate-180"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-white opacity-30" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 rounded-full border-4 border-white border-t-transparent transition-all duration-1000",
                style: {
                  transform: stage >= 2 ? "rotate(360deg)" : "rotate(0deg)",
                  opacity: stage >= 3 ? 0 : 1
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute inset-2 rounded-full bg-white flex items-center justify-center transition-all duration-500 ${stage >= 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`,
                children: /* @__PURE__ */ jsxs("svg", { className: "w-16 h-16", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M5 13l4 4L19 7",
                      fill: "none",
                      stroke: "url(#gradient)",
                      strokeWidth: "3",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: "24",
                      strokeDashoffset: stage >= 4 ? 0 : 24,
                      style: {
                        transition: "stroke-dashoffset 0.6s ease-in-out"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                    "linearGradient",
                    {
                      id: "gradient",
                      x1: "0%",
                      y1: "0%",
                      x2: "100%",
                      y2: "100%",
                      children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#a855f7" }),
                        /* @__PURE__ */ jsx(
                          "stop",
                          {
                            offset: "100%",
                            stopColor: "#ec4899"
                          }
                        )
                      ]
                    }
                  ) })
                ] })
              }
            ),
            stage >= 4 && /* @__PURE__ */ jsx(Fragment, { children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute w-2 h-2 bg-white rounded-full",
                style: {
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-60px)`,
                  animation: "fadeOut 0.8s ease-out forwards",
                  animationDelay: `${i * 0.03}s`
                }
              },
              i
            )) })
          ]
        }
      ) }),
      stage >= 4 && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none", children: [...Array(80)].map((_, i) => {
        const colors = [
          "bg-yellow-400",
          "bg-pink-400",
          "bg-blue-400",
          "bg-green-400",
          "bg-purple-400",
          "bg-red-400",
          "bg-orange-400",
          "bg-cyan-400"
        ];
        const shapes = [
          "rounded-full",
          "rounded-none",
          "rounded-sm"
        ];
        const left = Math.random() * 100;
        const animDuration = 2.5 + Math.random() * 2;
        const delay = Math.random() * 0.3;
        const rotation = Math.random() * 360;
        const size = Math.random() > 0.5 ? "w-2 h-2" : "w-3 h-3";
        const wobble = -30 + Math.random() * 60;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute ${size} ${colors[i % colors.length]} ${shapes[i % shapes.length]}`,
            style: {
              left: `${left}%`,
              top: "-20px",
              transform: `rotate(${rotation}deg)`,
              animation: `confettiFall ${animDuration}s ease-in forwards`,
              animationDelay: `${delay}s`,
              opacity: 0.9,
              "--wobble": `${wobble}px`
            }
          },
          i
        );
      }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `transition-all duration-700 delay-500 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          children: [
            /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-white mb-6 tracking-tight", children: "Booking Confirmed!" }),
            /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 opacity-60" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `transition-all duration-700 delay-700 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl text-white font-light mb-4", children: "Thank you for your booking!" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-purple-100 font-light max-w-md mx-auto leading-relaxed", children: "Your booking has been confirmed and will reach by your appointment date. We appreciate your business." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `mt-16 flex justify-center gap-4 transition-all duration-700 delay-1000 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-white rounded-full animate-bounce",
                style: {
                  animationDelay: "0s",
                  animationDuration: "2s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-white rounded-full animate-bounce",
                style: {
                  animationDelay: "0.2s",
                  animationDuration: "2s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-white rounded-full animate-bounce",
                style: {
                  animationDelay: "0.4s",
                  animationDuration: "2s"
                }
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
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
            ` })
  ] });
}
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderSuccess
}, Symbol.toStringTag, { value: "Module" }));
function OrderFailed() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 1800)
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4 overflow-hidden relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 ${stage >= 1 ? "scale-150" : "scale-0"}`,
        style: { top: "10%", left: "20%" }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${stage >= 2 ? "scale-150" : "scale-0"}`,
        style: { bottom: "10%", right: "20%" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center max-w-2xl", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-12", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `relative w-32 h-32 transition-all duration-700 ${stage >= 1 ? "scale-100 rotate-0" : "scale-0 -rotate-180"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-white opacity-30" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 rounded-full border-4 border-white border-t-transparent transition-all duration-1000",
                style: {
                  transform: stage >= 2 ? "rotate(360deg)" : "rotate(0deg)",
                  opacity: stage >= 3 ? 0 : 1
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute inset-2 rounded-full bg-white flex items-center justify-center transition-all duration-500 ${stage >= 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"}`,
                children: /* @__PURE__ */ jsxs("svg", { className: "w-16 h-16", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M6 6l12 12",
                      fill: "none",
                      stroke: "url(#gradient)",
                      strokeWidth: "3",
                      strokeLinecap: "round",
                      strokeDasharray: "17",
                      strokeDashoffset: stage >= 4 ? 0 : 17,
                      style: {
                        transition: "stroke-dashoffset 0.4s ease-in-out"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M18 6l-12 12",
                      fill: "none",
                      stroke: "url(#gradient)",
                      strokeWidth: "3",
                      strokeLinecap: "round",
                      strokeDasharray: "17",
                      strokeDashoffset: stage >= 4 ? 0 : 17,
                      style: {
                        transition: "stroke-dashoffset 0.4s ease-in-out 0.2s"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                    "linearGradient",
                    {
                      id: "gradient",
                      x1: "0%",
                      y1: "0%",
                      x2: "100%",
                      y2: "100%",
                      children: [
                        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#ef4444" }),
                        /* @__PURE__ */ jsx(
                          "stop",
                          {
                            offset: "100%",
                            stopColor: "#dc2626"
                          }
                        )
                      ]
                    }
                  ) })
                ] })
              }
            ),
            stage >= 4 && /* @__PURE__ */ jsx(Fragment, { children: [...Array(6)].map((_, i) => {
              const angle = i * 60 + 30;
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute bg-red-300 rounded-full",
                  style: {
                    width: "2px",
                    height: "20px",
                    top: "50%",
                    left: "50%",
                    transformOrigin: "1px 1px",
                    transform: `rotate(${angle}deg) translateY(-40px)`,
                    animation: "crackExpand 0.6s ease-out forwards",
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0
                  }
                },
                i
              );
            }) })
          ]
        }
      ) }),
      stage >= 4 && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none", children: [...Array(25)].map((_, i) => {
        const left = 20 + Math.random() * 60;
        const animDuration = 1.5 + Math.random() * 1;
        const delay = Math.random() * 1.2;
        const startY = -5 + Math.random() * 20;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute",
            style: {
              left: `${left}%`,
              top: `${startY}%`
            },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative",
                style: {
                  animation: `tearFall ${animDuration}s ease-in forwards`,
                  animationDelay: `${delay}s`,
                  opacity: 0
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "bg-blue-300 rounded-full",
                      style: {
                        width: "8px",
                        height: "8px",
                        opacity: 0.7
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "bg-blue-300 absolute",
                      style: {
                        width: "8px",
                        height: "12px",
                        top: "-6px",
                        left: "0",
                        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                        opacity: 0.7
                      }
                    }
                  )
                ]
              }
            )
          },
          i
        );
      }) }),
      stage >= 4 && /* @__PURE__ */ jsx("div", { className: "fixed top-10 left-1/2 transform -translate-x-1/2 pointer-events-none", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "relative",
          style: {
            animation: "floatSad 3s ease-in-out infinite",
            opacity: 0.3
          },
          children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute bg-gray-300 rounded-full w-16 h-16 top-0 left-4" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bg-gray-300 rounded-full w-20 h-20 top-2 left-12" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bg-gray-300 rounded-full w-14 h-14 top-0 left-24" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bg-gray-300 rounded-full w-24 h-12 top-8 left-6" })
          ] })
        }
      ) }),
      stage >= 4 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute",
            style: {
              top: "35%",
              left: "15%",
              animation: "heartBreakLeft 1s ease-out forwards",
              animationDelay: "0.3s",
              opacity: 0
            },
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                width: "30",
                height: "30",
                viewBox: "0 0 24 24",
                fill: "#ff6b9d",
                children: /* @__PURE__ */ jsx("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute",
            style: {
              top: "35%",
              right: "15%",
              animation: "heartBreakRight 1s ease-out forwards",
              animationDelay: "0.3s",
              opacity: 0
            },
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                width: "30",
                height: "30",
                viewBox: "0 0 24 24",
                fill: "#ff6b9d",
                children: /* @__PURE__ */ jsx("path", { d: "M12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09" })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `transition-all duration-700 delay-500 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          style: {
            animation: stage >= 4 ? "gentleShake 0.5s ease-in-out" : "none",
            animationDelay: "0.4s"
          },
          children: [
            /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-white mb-6 tracking-tight", children: "Order Failed" }),
            /* @__PURE__ */ jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 opacity-60" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `transition-all duration-700 delay-700 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl text-white font-light mb-4", children: "We couldn't process your order" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-red-100 font-light max-w-md mx-auto leading-relaxed mb-8", children: "Something went wrong with your payment. Please check your payment details and try again." }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center mt-8", children: /* @__PURE__ */ jsx(Link, { href: `/`, children: /* @__PURE__ */ jsx("button", { className: "px-8 py-3 bg-white text-red-900 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg", children: "Try Again" }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `mt-16 flex justify-center gap-4 transition-all duration-700 delay-1000 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-red-300 rounded-full",
                style: {
                  animation: "sadPulse 3s ease-in-out infinite",
                  animationDelay: "0s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-red-300 rounded-full",
                style: {
                  animation: "sadPulse 3s ease-in-out infinite",
                  animationDelay: "0.3s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 bg-red-300 rounded-full",
                style: {
                  animation: "sadPulse 3s ease-in-out infinite",
                  animationDelay: "0.6s"
                }
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
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
            ` })
  ] });
}
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderFailed
}, Symbol.toStringTag, { value: "Module" }));
function PowerflushQuote() {
  const { basePrice, symbol, radiatorPrices, title } = usePage().props;
  const yesIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23ecfdf3' stroke='%2322c55e' stroke-width='3'/><path d='M22 32l8 8 12-16' stroke='%2322c55e' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>";
  const noIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff1f2' stroke='%23ef4444' stroke-width='3'/><path d='M24 24l16 16m0-16L24 40' stroke='%23ef4444' stroke-width='4' stroke-linecap='round'/></svg>";
  const radiatorIcon = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='14' width='44' height='36' rx='8' fill='%23eff6ff' stroke='%233b82f6' stroke-width='3'/><path d='M18 20v24M26 20v24M34 20v24M42 20v24M50 20v24' stroke='%233b82f6' stroke-width='3' stroke-linecap='round'/><path d='M18 44h28' stroke='%23a5b4fc' stroke-width='3' stroke-linecap='round'/></svg>";
  const radiatorRows = Array.isArray(radiatorPrices) ? radiatorPrices : Array.isArray(radiatorPrices?.data) ? radiatorPrices.data : [];
  const baseValue = Number(basePrice || 525);
  const basePriceForStepper = 0;
  const radiatorOptions = radiatorRows.length ? radiatorRows.map((item) => ({
    label: item.label,
    // Use the admin-set per-range price directly; fall back to baseValue if missing
    price: Number(item.price) || baseValue,
    image: radiatorIcon
  })) : [
    { label: "1–5 radiators", price: baseValue, image: radiatorIcon },
    { label: "6–10 radiators", price: baseValue, image: radiatorIcon },
    { label: "11–15 radiators", price: baseValue, image: radiatorIcon },
    { label: "16–20 radiators", price: baseValue, image: radiatorIcon },
    { label: "21+ radiators", price: baseValue, image: radiatorIcon }
  ];
  const STEPS2 = [
    {
      id: "radiators",
      type: "select",
      question: "How many radiators are in your property?",
      options: radiatorOptions
    },
    {
      id: "boiler_flush_type",
      question: "What type of boiler system do you have?",
      type: "select",
      options: [
        { label: "Combi", image: "/images/stepper/combi_boiler.png" },
        { label: "System", image: "/images/stepper/system_boiler.png" },
        { label: "Heat Only", image: "/images/stepper/regular_boiler.png" }
      ]
    },
    {
      id: "any_cold_spots",
      question: "Any cold spots?",
      type: "select",
      options: [
        { label: "No", image: noIcon },
        { label: "Yes", image: yesIcon }
      ]
    },
    {
      id: "any_sludge",
      question: "Any sludge/dirty water?",
      type: "select",
      options: [
        { label: "No", image: noIcon },
        { label: "Yes", image: yesIcon }
      ]
    },
    {
      id: "flush_before",
      question: " Has system ever been flushed before?",
      type: "select",
      options: [
        { label: "No", image: noIcon },
        { label: "Yes", image: yesIcon },
        {
          label: "Not Sure",
          image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23eef2ff' stroke='%234f46e5' stroke-width='3'/><path d='M28 26a4 4 0 1 1 6 3.2c-1.2.9-2 2-2 3.3V34' stroke='%234f46e5' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/><circle cx='32' cy='42' r='2' fill='%234f46e5'/></svg>"
        }
      ]
    },
    {
      id: "leaking_radiators",
      question: " Any leaking radiators or valves?",
      type: "select",
      options: [
        { label: "No", image: noIcon },
        { label: "Yes", image: yesIcon }
      ]
    },
    {
      id: "access_flush",
      question: "Access type",
      type: "select",
      options: [
        {
          label: "Easy access",
          image: "/images/stepper/location-same-room.svg"
        },
        {
          label: "Cupboard / boxed in",
          image: "/images/stepper/location-cupboard.svg"
        },
        {
          label: "Loft",
          image: "/images/stepper/location-loft.svg"
        }
      ]
    },
    {
      id: "customer_details",
      question: "Your details",
      type: "details"
    },
    {
      id: "visit_time",
      question: "Preferred visit date & time",
      type: "datetime"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(BlueQuoteSkin, { children: /* @__PURE__ */ jsx(
      Stepper,
      {
        title: "Power Flush",
        basePrice: basePriceForStepper,
        steps: STEPS2,
        currency: symbol,
        serviceKey: SERVICES_KEY_VALUE.POWER_FLUSH,
        autoAdvance: true
      }
    ) })
  ] });
}
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PowerflushQuote
}, Symbol.toStringTag, { value: "Module" }));
function TechnicianButton() {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => window.open("https://wa.me/447454796398", "_blank"),
      className: "group/secondary inline-flex items-center justify-center gap-3 rounded-xl cursor-pointer border-2 border-slate-300 bg-white px-7 py-4 text-[15px] font-medium text-slate-900 hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-[1.02]",
      children: [
        /* @__PURE__ */ jsx("span", { children: "Speak to a technician" }),
        /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-5 w-5 text-slate-500 group-hover/secondary:text-primary transition-colors" })
      ]
    }
  );
}
const pageTitle = "Get a Quote";
const SERVICE_KEYS = {
  REPAIR: "repair",
  NEW: "new",
  POWERFLUSH: "powerflush",
  SERVICE: "service"
};
const SERVICE_CONTENT = {
  [SERVICE_KEYS.REPAIR]: {
    slug: SERVICE_KEYS.REPAIR,
    heroTitle: "Fast boiler repair — same-day engineers, transparent pricing.",
    heroDesc: "Emergency diagnosis and on-site fixes. Fixed labour rates, clear parts pricing — we prioritise safety and speed.",
    badge: "Boiler Repair",
    cta: "Get your personalised quote",
    pricingType: "table",
    pricingTable: [
      { item: "Sensor", category: "Boiler", price: "£120" },
      { item: "Electrodes", category: "Boiler", price: "£130" },
      { item: "Plate heat exchanger", category: "Boiler", price: "£260" },
      { item: "Fan", category: "Boiler", price: "£300" },
      {
        item: "Thermostat (not smart controls)",
        category: "Controls",
        price: "£180"
      }
    ],
    inspectionNote: "These prices exclude your £89 inspection"
  },
  [SERVICE_KEYS.NEW]: {
    slug: SERVICE_KEYS.NEW,
    heroTitle: "New boiler installations — efficient, tested, guaranteed.",
    heroDesc: "Supply & install modern, high-efficiency boilers. Full removal, install, commissioning and certificates included.",
    badge: "New Boiler",
    sampleJobLabel: "New Boiler • From £1,200",
    estimateLabel: "Install estimate",
    labour: "£600",
    parts: "£600",
    gaugeLabel: "Install success",
    gaugeValueText: "95%",
    cta: "Get installation quote",
    pricingType: "estimate"
  },
  [SERVICE_KEYS.POWERFLUSH]: {
    slug: SERVICE_KEYS.POWERFLUSH,
    heroTitle: "Magnacleanse — deep clean for radiators & pipework.",
    heroDesc: "A professional system clean using Magnacleanse equipment to lift sludge, improve heat flow, and protect your boiler.",
    badge: "System Clean",
    sampleJobLabel: "Magnacleanse • From £525 inc VAT",
    estimateLabel: "System clean",
    labour: "£525",
    parts: "—",
    gaugeLabel: "Flow restored",
    gaugeValueText: "88%",
    cta: "Get Magnacleanse quote",
    pricingType: "estimate"
  },
  [SERVICE_KEYS.SERVICE]: {
    slug: SERVICE_KEYS.SERVICE,
    heroTitle: "Boiler Servicing in Leeds & Surrounding",
    heroDesc: "Full strip-down service with safety checks, combustion analysis, and clean. If strip-down shows worn seals, gaskets, or electrodes, we’ll show you and price the required service parts for your boiler model before fitting.",
    badge: "Boiler Service",
    sampleJobLabel: "Boiler Service • £115 inc VAT",
    estimateLabel: "Annual check",
    labour: "£115",
    parts: "—",
    gaugeLabel: "Pass rate",
    gaugeValueText: "99%",
    cta: "Book a service",
    pricingType: "estimate",
    // ✅ CORRECT PLACE
    serviceNote: "A strip-down can reveal failed seals, gaskets, or electrodes. These are routine service parts that occasionally need replacing; we’ll confirm the requirement and cost based on your boiler model before fitting. If your boiler isn’t working or showing faults, please book a repair/diagnosis instead of a service."
  }
};
function getServiceFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("service");
    if (q) return q.toLowerCase();
  } catch {
  }
  return SERVICE_KEYS.REPAIR;
}
function QuotePage() {
  const radius = 14;
  const [serviceKey, setServiceKey] = useState(getServiceFromUrl());
  const { title, basePrices = {}, symbol = "£" } = usePage().props;
  const mergedContent = useMemo(() => {
    const servicePrice = basePrices.boiler_service;
    const repairPrice = basePrices.boiler_repair;
    const powerFlushPrice = basePrices.power_flush;
    return {
      ...SERVICE_CONTENT,
      [SERVICE_KEYS.SERVICE]: {
        ...SERVICE_CONTENT[SERVICE_KEYS.SERVICE],
        labour: servicePrice ? `${symbol}${servicePrice}` : SERVICE_CONTENT[SERVICE_KEYS.SERVICE].labour,
        sampleJobLabel: servicePrice ? `Boiler Service • ${symbol}${servicePrice} inc VAT` : SERVICE_CONTENT[SERVICE_KEYS.SERVICE].sampleJobLabel
      },
      [SERVICE_KEYS.REPAIR]: {
        ...SERVICE_CONTENT[SERVICE_KEYS.REPAIR],
        pricingTable: SERVICE_CONTENT[SERVICE_KEYS.REPAIR].pricingTable.map(
          (row) => row.item === "Sensor" ? { ...row, price: repairPrice ? `${symbol}${repairPrice}` : row.price } : row
        )
      },
      [SERVICE_KEYS.POWERFLUSH]: {
        ...SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH],
        labour: powerFlushPrice ? `${symbol}${powerFlushPrice}` : SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH].labour,
        sampleJobLabel: powerFlushPrice ? `Magnacleanse • From ${symbol}${powerFlushPrice} inc VAT` : SERVICE_CONTENT[SERVICE_KEYS.POWERFLUSH].sampleJobLabel
      }
    };
  }, [basePrices, symbol]);
  useEffect(() => {
    const onChange = () => setServiceKey(getServiceFromUrl());
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  const content = useMemo(
    () => mergedContent[serviceKey] || mergedContent[SERVICE_KEYS.REPAIR],
    [serviceKey, mergedContent]
  );
  const gaugePercent = parseInt(content.gaugeValueText || "75") / 100;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * gaugePercent;
  const gap = circumference - dash;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(BlueQuoteSkin, { children: /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-white overflow-x-hidden quote-page-bg", children: [
      /* @__PURE__ */ jsx(PageHeader, { title: pageTitle }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 mt-16", children: [
        /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 md:grid-cols-12 gap-10 items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-7", children: [
            content.slug === SERVICE_KEYS.SERVICE ? /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 border border-slate-200 shadow-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-slate-500" }),
              "Boiler service • ",
              content.sampleJobLabel.replace("Boiler Service • ", "")
            ] }) : /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-800", children: content.badge })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900", children: content.heroTitle }),
            /* @__PURE__ */ jsx("div", { className: "relative mt-6", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-700 max-w-xl leading-relaxed", children: content.heroDesc }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(`book.quote.${content.slug}`),
                  className: "group/primary relative inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-7 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02]",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "relative z-10", children: content.cta }),
                    /* @__PURE__ */ jsx("span", { className: "relative z-10 transition-transform group-hover/primary:translate-x-1", children: "→" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-700 rounded-xl opacity-0 group-hover/primary:opacity-100 transition-opacity duration-300" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(TechnicianButton, {})
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white font-black text-xl flex items-center justify-center", children: "K" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Spread the cost with Klarna" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Pay in 3 instalments, interest free. Subject to status. Choose Klarna at checkout." })
              ] })
            ] }),
            content.slug === SERVICE_KEYS.SERVICE ? /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-4 sm:grid-cols-2", children: ["Full clean and combustion safety checks", "Strip-down inspection; service parts priced if worn", "Expansion vessel set and leak-checked", "Gas Safe engineers, tidy work"].map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-0.5 h-2 w-2 rounded-full bg-emerald-500" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900 leading-snug", children: item })
                ]
              },
              item
            )) }) : /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap items-center gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-emerald-600", children: "✓" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900", children: "Same-day service" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Emergency response" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-emerald-600", children: "💷" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900", children: "Fixed pricing" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "No hidden fees" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-5", children: content.pricingType === "table" ? (
            /* ✅ REDESIGNED PRICING CARD */
            /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "px-6 pt-6 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "How boiler repairs work" }),
                  /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm mt-1", children: "Simple, local, and clear — no jargon." })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-emerald-600 animate-[spin_8s_linear_infinite]", children: "🔧" }) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6", children: [
                /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
                  {
                    step: "STEP 01",
                    title: "Book your repair",
                    text: "Your booking covers a full inspection visit of up to 1 hour."
                  },
                  {
                    step: "STEP 02",
                    title: "Engineer inspection",
                    text: "If it’s fixed within the hour with no parts, there are no further charges."
                  },
                  {
                    step: "STEP 03",
                    title: "If parts are needed",
                    text: "We explain fixed parts pricing before doing any extra work. You choose how to proceed."
                  }
                ].map((item) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600", children: item.step }),
                        /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" })
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: "mt-4 text-base font-semibold text-slate-900", children: item.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: item.text })
                    ]
                  },
                  item.step
                )) }),
                /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600", children: "If we can’t resolve the boiler issue after a full inspection, we’ll refund the inspection fee. If access is restricted or the fault is outside the boiler system, the inspection fee applies." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-6 py-5 bg-slate-50 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Repair booking includes a full inspection visit for up to 1 hour." }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Book instantly online after the questions — no waiting, no calling, no callbacks unless you want one." })
                ] }),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(`book.quote.${content.slug}`),
                    className: "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full",
                    children: [
                      "Book a repair",
                      /* @__PURE__ */ jsx("span", { children: "→" })
                    ]
                  }
                )
              ] }) })
            ] })
          ) : content.slug === SERVICE_KEYS.SERVICE ? /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "px-6 pt-6 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "How boiler servicing works" }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm mt-1", children: "Strip-down service; if service parts are needed, we price them clearly before fitting." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-emerald-600 animate-[spin_8s_linear_infinite]", children: "🧰" }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-emerald-800", children: "What we actually do on the strip-down:" }),
                /* @__PURE__ */ jsxs("ul", { className: "mt-2 list-disc space-y-1 pl-5", children: [
                  /* @__PURE__ */ jsx("li", { children: "Pump and set the expansion vessel, checking the Schrader valve" }),
                  /* @__PURE__ */ jsx("li", { children: "Clean the combustion chamber and burner area" }),
                  /* @__PURE__ */ jsx("li", { children: "Clean and flush the condensate trap" }),
                  /* @__PURE__ */ jsx("li", { children: "Check and replace worn service parts (gaskets/electrodes) if needed" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
              {
                step: "STEP 01",
                title: "Book online in minutes",
                text: "Answer the short questions and lock in your strip-down service instantly — no calls or back-and-forth."
              },
              {
                step: "STEP 02",
                title: "We confirm your slot",
                text: "You get the appointment time and a reminder. If anything needs tweaking, we’ll message you straight away."
              },
              {
                step: "STEP 03",
                title: "Service + sign-off",
                text: "We carry out the strip-down. If service parts are required, we’ll show you and price them before fitting; if your boiler has faults, we’ll recommend a repair visit instead."
              }
            ].map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600", children: item.step }),
                    /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "mt-4 text-base font-semibold text-slate-900", children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: item.text })
                ]
              },
              item.step
            )) }) }),
            /* @__PURE__ */ jsx("div", { className: "px-6 py-5 bg-slate-50 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Fixed-price strip-down service. If worn service parts are needed, we price them clearly by boiler model before fitting." }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Service is for healthy or routine maintenance. If your boiler is showing faults or not working, please book a repair/diagnosis instead." })
              ] }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(`book.quote.${content.slug}`),
                  className: "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full",
                  children: [
                    "Book a service",
                    /* @__PURE__ */ jsx("span", { children: "→" })
                  ]
                }
              )
            ] }) })
          ] }) : content.slug === SERVICE_KEYS.POWERFLUSH ? /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl bg-white border border-slate-100 shadow-lg overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "px-6 pt-6 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "How Magnacleanse works" }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm mt-1", children: "We use Magnacleanse, not a generic power flush." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-emerald-600 animate-[spin_8s_linear_infinite]", children: "🧲" }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [
                {
                  step: "STEP 01",
                  title: "Complete the questionnaire",
                  text: "We use your answers to size the job and give an accurate quote."
                },
                {
                  step: "STEP 02",
                  title: "Magnacleanse clean",
                  text: "We remove sludge and restore heat flow across the system."
                },
                {
                  step: "STEP 03",
                  title: "Protect with inhibitor",
                  text: "We treat the system with inhibitor to help prevent future build‑up."
                }
              ].map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600", children: item.step }),
                      /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" })
                    ] }),
                    /* @__PURE__ */ jsx("h4", { className: "mt-4 text-base font-semibold text-slate-900", children: item.title }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: item.text })
                  ]
                },
                item.step
              )) }),
              /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600", children: "Prices start at £525 inc VAT and vary by system size and radiator count. If we believe the service won’t benefit you, we’ll let you know and cancel with a full refund." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-6 py-5 bg-slate-50 border-t border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Complete the multiple‑choice questionnaire to get your quote and book instantly online — no waiting, no calling, no callbacks unless you want one." }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(`book.quote.${content.slug}`),
                  className: "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity sm:w-auto w-full",
                  children: [
                    "Get Magnacleanse quote",
                    /* @__PURE__ */ jsx("span", { children: "→" })
                  ]
                }
              )
            ] }) })
          ] }) : (
            /* ESTIMATE CARD (unchanged) */
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 p-6 shadow-[0_18px_40px_rgba(6,34,20,0.06)]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "rounded-md bg-primary/10 p-2", children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "w-5 h-5 text-primary",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "aria-hidden": true,
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeWidth: "1.6",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          d: "M3 12h18"
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-dark/60", children: content.estimateLabel }),
                    /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-dark leading-tight", children: content.sampleJobLabel })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-dark/60", children: "Demo • No obligation" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-white p-3 border border-white/30 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    viewBox: "0 0 220 140",
                    className: "w-full h-24",
                    xmlns: "http://www.w3.org/2000/svg",
                    "aria-hidden": true,
                    children: [
                      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          id: "accentGrad2",
                          x1: "0",
                          x2: "1",
                          children: [
                            /* @__PURE__ */ jsx(
                              "stop",
                              {
                                offset: "0",
                                stopColor: "#0067ff",
                                stopOpacity: "0.85"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "stop",
                              {
                                offset: "1",
                                stopColor: "#0067ff40",
                                stopOpacity: "0.65"
                              }
                            )
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsx(
                        "rect",
                        {
                          x: "20",
                          y: "62",
                          width: "180",
                          height: "44",
                          rx: "8",
                          fill: "#ffffff",
                          stroke: "#d9e2f1",
                          strokeWidth: "1"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M20 62 L110 20 L200 62 Z",
                          fill: "url(#accentGrad2)",
                          opacity: "0.95",
                          stroke: "#c7d8f5",
                          strokeWidth: "1"
                        }
                      )
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center sm:justify-end", children: /* @__PURE__ */ jsx("div", { className: "w-28 h-28 flex items-center justify-center rounded-full bg-white/60 border border-white/30 p-2", children: /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    width: "84",
                    height: "84",
                    viewBox: "0 0 36 36",
                    xmlns: "http://www.w3.org/2000/svg",
                    "aria-hidden": true,
                    children: [
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          cx: "18",
                          cy: "18",
                          r: radius,
                          fill: "none",
                          stroke: "#f6fdf8",
                          strokeWidth: "3"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          cx: "18",
                          cy: "18",
                          r: radius,
                          fill: "none",
                          stroke: "url(#g3)",
                          strokeWidth: "3",
                          strokeLinecap: "round",
                          strokeDasharray: `${dash.toFixed(
                            2
                          )} ${gap.toFixed(2)}`,
                          transform: "rotate(-90 18 18)"
                        }
                      ),
                      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          id: "g3",
                          x1: "0",
                          x2: "1",
                          children: [
                            /* @__PURE__ */ jsx(
                              "stop",
                              {
                                offset: "0",
                                stopColor: "#0067ff"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "stop",
                              {
                                offset: "1",
                                stopColor: "#0067ff40"
                              }
                            )
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsx(
                        "text",
                        {
                          x: "18",
                          y: "16.6",
                          textAnchor: "middle",
                          fontSize: "5",
                          fill: "#065f46",
                          fontWeight: "700",
                          children: content.gaugeValueText
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "text",
                        {
                          x: "18",
                          y: "21.4",
                          textAnchor: "middle",
                          fontSize: "4",
                          fill: "#065f46",
                          children: content.gaugeLabel
                        }
                      )
                    ]
                  }
                ) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-white p-3 border border-gray-100 text-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Labour" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-900", children: content.labour })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-white p-3 border border-gray-100 text-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Parts" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-slate-900", children: content.parts })
                ] })
              ] }),
              content.serviceNote && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-xl border border-primary/30 bg-primary/2 px-4 py-3", children: /* @__PURE__ */ jsxs("p", { className: "text-[15px] text-dark leading-6", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-[18px]", children: "Important :" }),
                " ",
                content.serviceNote
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      `book.quote.${content.slug}`
                    ),
                    className: "w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary/80 via-primary/70 via-primary/40 to-secondary/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(23,42,68,0.12)] focus:outline-none ",
                    children: content.cta
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "mt-4 text-center text-xs text-slate-500", children: "No obligation — booking in 2 mins" })
              ] })
            ] })
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-20 pb-12", children: /* @__PURE__ */ jsx(GoogleReview, {}) })
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: QuotePage
}, Symbol.toStringTag, { value: "Module" }));
const UK_POSTCODE_RE$1 = /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2})|(?:[A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(?:[A-PR-UWYZ][0-9][A-HJKPSTUW])|(?:[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
const ALLOWED_OUTCODES$1 = ["LS", "WF", "HG", "BD"];
function normalizeUkPostcode$1(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length <= 3) return raw;
  return `${raw.slice(0, -3)} ${raw.slice(-3)}`.trim();
}
function getOutcode$1(value) {
  const normalized = normalizeUkPostcode$1(value);
  if (!normalized) return "";
  return normalized.includes(" ") ? normalized.split(" ")[0] : normalized.length > 3 ? normalized.slice(0, -3) : normalized;
}
function isAllowedOutcode$1(value) {
  const outcode = getOutcode$1(value);
  return ALLOWED_OUTCODES$1.some((prefix) => outcode.startsWith(prefix));
}
function RepairCheckout() {
  const { answers, basePrice, symbol, title, stripePublishableKey } = usePage().props;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentBookingId, setPaymentBookingId] = useState(null);
  const [paymentTxId, setPaymentTxId] = useState(null);
  const [paymentReturnUrl, setPaymentReturnUrl] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [openPetTooltip, setOpenPetTooltip] = useState(false);
  const mounted = useRef(true);
  const prefilled = useRef(false);
  const paymentElementContainerRef = useRef(null);
  const paymentSectionRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const paymentElementRef = useRef(null);
  const lastAutoInitKeyRef = useRef("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!openPetTooltip) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-pet-policy-wrap="true"]')) {
        setOpenPetTooltip(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenPetTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openPetTooltip]);
  useEffect(() => {
    if (prefilled.current) return;
    prefilled.current = true;
    const customer = answers?.customer_details || {};
    const nameParts = (customer.name || "").trim().split(/\s+/);
    const firstFromName = nameParts[0] || "";
    const lastFromName = nameParts.slice(1).join(" ");
    const visit = answers?.visit_time?.datetime || {};
    const extraNotes = [answers?.fault_type?.extraText, answers?.previous_work?.extraText].filter(Boolean).join(" | ");
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || firstFromName,
      lastName: prev.lastName || lastFromName,
      email: prev.email || customer.email || "",
      phone: prev.phone || customer.phone || "",
      postcode: prev.postcode || customer.postcode || "",
      address: prev.address || customer.address || "",
      notes: prev.notes || extraNotes || ""
    }));
    if (visit.date) setSelectedDate(visit.date);
    if (visit.time) setSelectedTime(visit.time);
  }, [answers]);
  const dateRef = useRef(null);
  const titleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const postcodeRef = useRef(null);
  const addressRef = useRef(null);
  const fieldOrder = useMemo(
    () => [
      { key: "appointment", ref: dateRef },
      { key: "title", ref: titleRef },
      { key: "firstName", ref: firstNameRef },
      { key: "lastName", ref: lastNameRef },
      { key: "email", ref: emailRef },
      { key: "phone", ref: phoneRef },
      { key: "postcode", ref: postcodeRef },
      { key: "address", ref: addressRef }
    ],
    []
  );
  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) return null;
    return loadStripe(stripePublishableKey);
  }, [stripePublishableKey]);
  useEffect(() => {
    if (!paymentClientSecret || !paymentElementContainerRef.current || !stripePromise)
      return;
    let disposed = false;
    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe || disposed) return;
        const elements = stripe.elements({
          clientSecret: paymentClientSecret,
          appearance: { theme: "stripe" }
        });
        const paymentElement = elements.create("payment", {
          layout: "tabs"
        });
        paymentElement.mount(paymentElementContainerRef.current);
        stripeRef.current = stripe;
        elementsRef.current = elements;
        paymentElementRef.current = paymentElement;
        setPaymentError("");
      } catch (error) {
        const msg = "Unable to load secure payment form. Please try again, or refresh this page.";
        toast.error(msg);
        setPaymentError(msg);
        setPaymentClientSecret(null);
      }
    })();
    return () => {
      disposed = true;
      paymentElementRef.current?.destroy?.();
      paymentElementRef.current = null;
      elementsRef.current = null;
      stripeRef.current = null;
    };
  }, [paymentClientSecret, stripePromise]);
  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };
  const validateAll = () => {
    const next = {};
    if (!selectedDate) next.appointment = "Please select a visit date.";
    else if (!selectedTime) next.appointment = "Please select a visit time.";
    if (!formData.title) next.title = "Please select a title.";
    if (!formData.firstName?.trim()) next.firstName = "First name is required.";
    if (!formData.lastName?.trim()) next.lastName = "Last name is required.";
    const email = (formData.email || "").trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    const phone = (formData.phone || "").trim();
    if (!phone) next.phone = "Phone number is required.";
    else {
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 10)
        next.phone = "Please enter a valid phone number.";
    }
    const formattedPostcode = normalizeUkPostcode$1(formData.postcode);
    if (!formattedPostcode) {
      next.postcode = "Postcode is required.";
    } else if (!UK_POSTCODE_RE$1.test(formattedPostcode)) {
      next.postcode = "Please enter a valid UK postcode.";
    } else if (!isAllowedOutcode$1(formattedPostcode)) {
      next.postcode = "Checkout is restricted to LS, WF, HG and BD postcodes only.";
    }
    if (!formData.address?.trim()) next.address = "Address is required.";
    return next;
  };
  const checkoutReadyKey = useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    if (!formData.title?.trim()) return "";
    if (!formData.firstName?.trim()) return "";
    if (!formData.lastName?.trim()) return "";
    if (!formData.email?.trim()) return "";
    if (!formData.phone?.trim()) return "";
    const formattedPostcode = normalizeUkPostcode$1(formData.postcode);
    if (!formattedPostcode) return "";
    if (!UK_POSTCODE_RE$1.test(formattedPostcode)) return "";
    if (!isAllowedOutcode$1(formattedPostcode)) return "";
    if (!formData.address?.trim()) return "";
    return [
      selectedDate,
      selectedTime,
      formData.title,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formattedPostcode,
      formData.address
    ].map((v) => String(v || "").trim()).join("|");
  }, [selectedDate, selectedTime, formData]);
  const scrollToRef = (ref) => {
    const el = ref?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof el.focus === "function") el.focus();
  };
  const showValidationErrors = (errorsObj) => {
    if (!errorsObj || typeof errorsObj !== "object") return;
    const messages = Object.values(errorsObj).flat().filter(Boolean);
    if (!messages.length) return;
    messages.slice(0, 4).forEach((m) => toast.error(m, { duration: 5e3, position: "top-center" }));
    if (messages.length > 4) {
      toast.error("Please review the highlighted fields and try again.", {
        duration: 5e3,
        position: "top-center"
      });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: name === "postcode" ? normalizeUkPostcode$1(value) : value
    }));
    clearError(name);
  };
  const handleAppointmentChange = ({ date, time }) => {
    setSelectedDate(date);
    setSelectedTime(time);
    clearError("appointment");
  };
  const initialisePaymentElement = async ({ showValidationToast = false } = {}) => {
    const nextErrors = validateAll();
    if (Object.keys(nextErrors).length) {
      if (showValidationToast) {
        setErrors(nextErrors);
        setPaymentError("Please complete the highlighted fields first.");
        const first = fieldOrder.find((f) => nextErrors[f.key]);
        if (first) scrollToRef(first.ref);
        toast.error("Please complete the required details first.");
      }
      return false;
    }
    setPaymentError("");
    const customerName = `${formData.title} ${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      ...answers,
      customer_details: {
        full_name: customerName,
        title: formData.title,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode,
        address: formData.address,
        notes: formData.notes
      },
      visit_time: {
        datetime: {
          date: selectedDate,
          time: selectedTime
        },
        name: customerName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode
      },
      product: {},
      addOns: {}
    };
    try {
      setProcessing(true);
      const res = await axios.post(
        "/quote/checkout",
        {
          service: SERVICES_KEY_VALUE.BOILER_REPAIR,
          form: payload,
          amount: basePrice,
          payment_element: true
        },
        { timeout: 15e3 }
      );
      const checkoutClientSecret = res?.data?.data?.checkout_client_secret;
      const checkoutMode = res?.data?.data?.checkout_mode;
      if (checkoutMode === "payment_element" && checkoutClientSecret && stripePublishableKey) {
        setPaymentClientSecret(checkoutClientSecret);
        setPaymentBookingId(res?.data?.data?.booking_id || null);
        setPaymentTxId(res?.data?.data?.transaction_id || null);
        setPaymentReturnUrl(res?.data?.data?.return_url || null);
        setProcessing(false);
        return true;
      }
      throw new Error("Unable to initialise secure payment form.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        if (showValidationToast) showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (showValidationToast) {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
      return false;
    }
  };
  useEffect(() => {
    if (!checkoutReadyKey || paymentClientSecret || processing) return;
    if (lastAutoInitKeyRef.current === checkoutReadyKey) return;
    lastAutoInitKeyRef.current = checkoutReadyKey;
    const timer = setTimeout(() => {
      initialisePaymentElement({ showValidationToast: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [checkoutReadyKey, paymentClientSecret, processing]);
  const handlePayAndBook = async () => {
    if (processing) return;
    if (!paymentClientSecret) {
      await initialisePaymentElement({ showValidationToast: true });
      return;
    }
    setPaymentError("");
    try {
      setProcessing(true);
      if (!stripeRef.current || !elementsRef.current) {
        throw new Error("Payment form is still loading. Please try again.");
      }
      const { error, paymentIntent } = await stripeRef.current.confirmPayment(
        {
          elements: elementsRef.current,
          confirmParams: {
            return_url: paymentReturnUrl || `${window.location.origin}/checkout/success-intent?booking=${paymentBookingId}&tx=${paymentTxId}`
          },
          redirect: "if_required"
        }
      );
      if (error) {
        setPaymentError(
          error.message || "Payment could not be confirmed. Please check your details and try again."
        );
        toast.error(error.message || "Payment failed.");
        setProcessing(false);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        const confirmRes = await axios.post(
          "/quote/checkout/confirm-intent",
          {
            booking_id: paymentBookingId,
            tx_id: paymentTxId,
            payment_intent_id: paymentIntent.id
          },
          { timeout: 15e3 }
        );
        const redirectUrl = confirmRes?.data?.data?.redirect_url;
        if (redirectUrl) {
          window.location.assign(redirectUrl);
          return;
        }
      }
      setProcessing(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
    }
  };
  const withNote = (item) => {
    if (!item?.label) return "—";
    return item.extraText ? `${item.label} (${item.extraText})` : item.label;
  };
  const summaryItems = [
    { label: "Boiler type", value: answers?.boiler_type?.label || "—" },
    { label: "Make & model", value: answers?.boiler_model?.label || "—" },
    { label: "Issue", value: withNote(answers?.fault_type) },
    { label: "When it started", value: answers?.issue_start?.label || "—" },
    { label: "Previous work", value: withNote(answers?.previous_work) },
    { label: "Access", value: answers?.access?.label || "—" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx("style", { children: `
                .pet-doggy-wrap {
                    animation: pet-doggy-bob 1.8s ease-in-out infinite;
                    transform-origin: center;
                }

                .pet-doggy-ear-left,
                .pet-doggy-ear-right {
                    animation: pet-doggy-ear 1.2s ease-in-out infinite;
                    transform-origin: center top;
                }

                @keyframes pet-doggy-bob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-1.5px); }
                }

                @keyframes pet-doggy-ear {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(7deg); }
                }
            ` }),
    /* @__PURE__ */ jsxs(BlueQuoteSkin, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50 quote-page-bg" }),
      /* @__PURE__ */ jsxs("div", { className: "min-h-screen quote-page-bg", children: [
        /* @__PURE__ */ jsx(PageHeader, {}),
        /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[12px] font-semibold text-emerald-800", children: [
              /* @__PURE__ */ jsx(FiShield, { className: "h-3.5 w-3.5" }),
              "Secure checkout"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-slate-900", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-slate-600 max-w-2xl", children: "Confirm your visit time and details. Repairs include diagnosis and the first hour on site; we agree any parts and extra labour with you before fitting." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-8 items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-[0_24px_60px_rgba(16,185,129,0.12)]", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-white" }),
              /* @__PURE__ */ jsxs("div", { className: "relative p-6 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700 font-semibold", children: "Diagnostic visit" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-slate-900", children: [
                      symbol,
                      basePrice
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Diagnostic and first hour included. Parts and extra labour are quoted first; no work proceeds without your approval." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800", children: [
                    /* @__PURE__ */ jsx(FiCheck, { className: "h-4 w-4" }),
                    "No hidden fees"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: summaryItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.12em] text-slate-500", children: item.label }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-slate-900 leading-snug break-words", children: item.value })
                ] }, item.label)) }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-900", children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-semibold text-emerald-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FiShield, { className: "h-4 w-4" }),
                    " What's included"
                  ] }),
                  /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 text-slate-700", children: [
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Fault diagnosis and safety checks"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "First hour of labour on site"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Transparent parts pricing before fitting"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Gas Safe engineer attendance"
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Choose a visit time" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-1 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FiCalendar, { className: "h-4 w-4" }),
                      " Pick a preferred date and time."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700", children: [
                    /* @__PURE__ */ jsx(FiMapPin, { className: "h-4 w-4" }),
                    " Leeds & surrounding areas"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { ref: dateRef, className: "mt-5", children: [
                  /* @__PURE__ */ jsx(
                    AppointmentDateRangePicker,
                    {
                      value: selectedDate && selectedTime ? { date: selectedDate, time: selectedTime } : null,
                      type: SERVICES_KEY_VALUE.BOILER_REPAIR,
                      onChange: handleAppointmentChange
                    }
                  ),
                  errors.appointment && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-2", children: errors.appointment })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 space-y-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Your details" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Title" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        ref: titleRef,
                        name: "title",
                        value: formData.title,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "Select" }),
                          "Mr, Mrs, Ms, Miss, Dr".split(", ").map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
                        ]
                      }
                    ),
                    errors.title && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.title })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "First name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: firstNameRef,
                        name: "firstName",
                        value: formData.firstName,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.firstName && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.firstName })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Last name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: lastNameRef,
                        name: "lastName",
                        value: formData.lastName,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.lastName && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.lastName })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Email" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: emailRef,
                        name: "email",
                        value: formData.email,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Phone" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: phoneRef,
                        name: "phone",
                        value: formData.phone,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Postcode" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: postcodeRef,
                        name: "postcode",
                        value: formData.postcode,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.postcode && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.postcode })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Address" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: addressRef,
                      name: "address",
                      value: formData.address,
                      onChange: handleInputChange,
                      className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    }
                  ),
                  errors.address && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.address })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Notes (optional)" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      name: "notes",
                      value: formData.notes,
                      onChange: handleInputChange,
                      rows: 3,
                      className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)] p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
                    /* @__PURE__ */ jsx(FiShield, { className: "h-4 w-4" }),
                    " Secure Stripe checkout"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs bg-white/15 px-3 py-1 rounded-full", children: "Card or Klarna payments" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handlePayAndBook,
                    disabled: processing,
                    "aria-busy": processing,
                    className: `w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition ${processing ? "bg-white/20 cursor-not-allowed" : "bg-white text-emerald-700 hover:bg-emerald-50"}`,
                    children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiLoader, { className: "animate-spin" }),
                      "Processing…"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiCreditCard, {}),
                      paymentClientSecret ? "Confirm & Book Repair" : "Continue to secure payment"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { "data-pet-policy-wrap": "true", className: "relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-800 group/pet-policy", children: [
                  /* @__PURE__ */ jsx("span", { className: "pet-doggy-wrap inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100/90 ring-1 ring-amber-200", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "h-4.5 w-4.5", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-left", d: "M7 7.2c-.8-1.5-2.3-1.9-3.2-.8-.8 1-.6 2.5.8 3.4L7 10.9V7.2Z", fill: "#c08457" }),
                    /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-right", d: "M17 7.2c.8-1.5 2.3-1.9 3.2-.8.8 1 .6 2.5-.8 3.4L17 10.9V7.2Z", fill: "#c08457" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "7", fill: "#f5c892" }),
                    /* @__PURE__ */ jsx("circle", { cx: "9.4", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                    /* @__PURE__ */ jsx("circle", { cx: "14.6", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                    /* @__PURE__ */ jsx("ellipse", { cx: "12", cy: "13.7", rx: "1.2", ry: "0.9", fill: "#111827" }),
                    /* @__PURE__ */ jsx("path", { d: "M10.8 15.4c.3.5.7.8 1.2.8s.9-.3 1.2-.8", stroke: "#7c2d12", strokeWidth: "1", strokeLinecap: "round", fill: "none" })
                  ] }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-900", children: "Pet-friendly visits" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setOpenPetTooltip(
                        (prev) => !prev
                      ),
                      className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 transition-colors hover:border-emerald-500 hover:text-emerald-800",
                      "aria-label": "Show pet-friendly information",
                      children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `quote-solid-popover absolute left-0 top-9 z-20 w-[320px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${openPetTooltip ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 group-hover/pet-policy:pointer-events-auto group-hover/pet-policy:opacity-100 group-hover/pet-policy:translate-y-0 group-focus-within/pet-policy:pointer-events-auto group-focus-within/pet-policy:opacity-100 group-focus-within/pet-policy:translate-y-0"}`,
                      children: [
                        /* @__PURE__ */ jsx("p", { children: "We are dog-friendly and happy for them to be around during the visit." }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "If your dog is feeling social, we are always glad to say hello first." }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "During active work, we ask that pets are kept clear of tools and working areas for everyone’s safety." })
                      ]
                    }
                  )
                ] }),
                paymentClientSecret && /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: paymentSectionRef,
                    className: "mt-4 rounded-2xl bg-white p-3",
                    children: /* @__PURE__ */ jsx("div", { ref: paymentElementContainerRef })
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-50/90 text-center mt-3", children: "Card payments are encrypted via Stripe. Approved parts or extra labour are billed separately per our Terms & Conditions." }),
                paymentError && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-100 text-center mt-2 font-semibold", children: paymentError })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(GoogleReview, {})
      ] })
    ] })
  ] });
}
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RepairCheckout
}, Symbol.toStringTag, { value: "Module" }));
const STEPS$1 = [
  // Checkout collects details and visit time, so no pre-checkout duplicate steps here.
  //         {
  //             label: "Room thermostat",
  //         },
  //     ],
  // },
  {
    id: "boiler_type",
    question: "What type of boiler do you have?",
    type: "select",
    options: [
      {
        label: "Combi",
        image: "/images/stepper/combi_boiler.png"
      },
      {
        label: "System",
        image: "/images/stepper/system_boiler.png"
      },
      {
        label: "Heat Only",
        image: "/images/stepper/regular_boiler.png"
      }
    ]
  },
  {
    id: "boiler_model",
    question: "What is the boiler brand & model?",
    type: "make_model",
    brands: [
      "Worcester Bosch",
      "Vaillant",
      "Ideal",
      "Baxi",
      "Viessmann",
      "Glow-worm",
      "Potterton",
      "Vokera",
      "Ferroli",
      "Alpha",
      "Main",
      "Ariston",
      "Sime",
      "Remeha",
      "Ravenheat",
      "ATAG",
      "Intergas",
      "Navien",
      "Keston",
      "Saunier Duval",
      "Grant",
      "Buderus",
      "Other",
      "Not sure"
    ],
    getModels: (brand) => {
      if (!brand || brand === "Not sure") {
        return [{ label: "Not sure" }, { label: "Other" }];
      }
      const modelsByBrand = {
        "Worcester Bosch": [
          "Greenstar 30i",
          "Greenstar 25i",
          "Greenstar 28i",
          "Greenstar 30CDi",
          "Greenstar 32CDi",
          "Greenstar 35CDi",
          "Greenstar 38CDi"
        ],
        Vaillant: [
          "ecoTEC Plus 830",
          "ecoTEC Plus 832",
          "ecoTEC Plus 835",
          "ecoTEC Plus 838",
          "ecoTEC Pro 24",
          "ecoTEC Pro 28"
        ],
        Ideal: [
          "Logic+ 24",
          "Logic+ 30",
          "Logic+ 35",
          "Logic Max 24",
          "Logic Max 30",
          "Logic Max 35",
          "Vogue Max 26",
          "Vogue Max 32",
          "Vogue Max 40"
        ],
        Baxi: [
          "Duo-tec 24",
          "Duo-tec 28",
          "Duo-tec 33",
          "Duo-tec 40",
          "Platinum 24",
          "Platinum 28",
          "Platinum 33"
        ],
        Viessmann: ["Vitodens 050", "Vitodens 100", "Vitodens 111"],
        "Glow-worm": [
          "Energy 25",
          "Energy 30",
          "Energy 35",
          "Compact 24",
          "Compact 28"
        ],
        Potterton: ["Gold 24", "Gold 28", "Gold 33", "Gold 40"],
        Vokera: ["Easi-Heat 24", "Easi-Heat 29", "Easi-Heat 36"],
        Ferroli: ["Modena 32", "Modena 38", "Modena HE 25"],
        Alpha: ["E-Tec 28", "E-Tec 33", "E-Tec 38"],
        Main: ["Eco Compact 25", "Eco Compact 30"],
        Ariston: ["Clas ONE 24", "Clas ONE 30", "Clas ONE 35"],
        Sime: ["Murelle 25", "Murelle 30"],
        Remeha: ["Avanta 24", "Avanta 28", "Avanta 35"],
        Ravenheat: ["HE 80", "HE 85"],
        ATAG: ["iC 24", "iC 28", "iC 35"],
        Intergas: ["Kombi Compact HRE 24", "Kombi Compact HRE 36"],
        Navien: ["NCB 28", "NCB 33"],
        Keston: ["Combi 30", "Combi 35"],
        "Saunier Duval": ["Thema Classic 25", "Thema Classic 30"],
        Grant: ["Vortex 26", "Vortex 36"],
        Buderus: ["Logamax plus 24", "Logamax plus 28"]
      };
      const models = modelsByBrand[brand] || [];
      return [...models.map((label2) => ({ label: label2 })), { label: "Other" }, { label: "Not sure" }];
    }
  },
  {
    id: "boiler_age",
    question: "How old is your boiler?",
    type: "select",
    options: [
      {
        label: "Under 5 years",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%2322c55e' opacity='0.12'/><path d='M22 32c0-6.6 5.4-12 12-12 1.7 0 3 .3 4 .7V18a2 2 0 1 1 4 0v5.5a12 12 0 0 1 4 8.5c0 6.6-5.4 12-12 12S22 38.6 22 32Z' stroke='%2322c55e' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "5–10 years",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23f59e0b' opacity='0.12'/><path d='M22 30c0-5 4-9 9-9 1.3 0 2.4.2 3.4.6l1.6-3.1a2 2 0 1 1 3.6 1.8l-1.6 3.1A9 9 0 0 1 42 30c0 5-4 9-9 9s-11-4-11-9Z' stroke='%23d97706' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "10–15 years",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23f97316' opacity='0.12'/><path d='M22 30c0-4.4 3.6-8 8-8 1.6 0 3 .5 4.3 1.3l1.4-2.3a2 2 0 1 1 3.4 2.1l-1.2 2c1.1 1.4 1.7 3.2 1.7 5.2 0 4.4-3.6 8-8 8s-9.6-3.6-9.6-8Z' stroke='%23ea580c' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "15+ years / Not sure",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='8' y='8' width='48' height='48' rx='12' fill='%23ef4444' opacity='0.12'/><path d='M22 30c0-3.3 2.7-6 6-6 1.5 0 2.8.6 3.9 1.5l2-3.5a2 2 0 1 1 3.4 2l-1.6 2.7a7 7 0 0 1 2.3 5.3c0 3.9-3.1 7-7 7s-9-3.1-9-7Z' stroke='%23b91c1c' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      }
    ]
  },
  {
    id: "fault_type",
    question: "What issue are you experiencing?",
    type: "select",
    options: [
      {
        label: "No heating",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='9' y='12' width='46' height='40' rx='6' fill='%23eff6ff' stroke='%233b82f6' stroke-width='3'/><path d='M18 20v24M26 20v24M34 20v24M42 20v24M50 20v24' stroke='%233b82f6' stroke-width='3' stroke-linecap='round'/><path d='M18 44h28' stroke='%23a5b4fc' stroke-width='3' stroke-linecap='round'/></svg>"
      },
      {
        label: "No hot water",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='12' y='22' width='40' height='16' rx='8' fill='%23fff1f2' stroke='%23ec4899' stroke-width='3'/><path d='M16 34h32M18 38h28' stroke='%23f472b6' stroke-width='3' stroke-linecap='round'/><circle cx='22' cy='22' r='4' stroke='%23ec4899' stroke-width='3'/></svg>"
      },
      {
        label: "Leaking",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='14' width='44' height='36' rx='10' fill='%23ecfeff' stroke='%23089' stroke-width='3'/><path d='M32 20c-2 5-7 10-7 14a7 7 0 1 0 14 0c0-4-5-9-7-14Z' fill='%23067' stroke='%23089' stroke-width='3'/></svg>"
      },
      {
        label: "Error code",
        requiresText: true,
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect x='10' y='10' width='44' height='44' rx='12' fill='%23fef9c3' stroke='%23eab308' stroke-width='3'/><path d='M32 18v14' stroke='%23eab308' stroke-width='4' stroke-linecap='round'/><circle cx='32' cy='40' r='2.5' fill='%23eab308'/></svg>"
      }
    ]
  },
  {
    id: "issue_start",
    question: "When did the issue start?",
    type: "select",
    options: [
      {
        label: "Today",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23ecfdf3' stroke='%2322c55e' stroke-width='3'/><path d='M32 18v14l10 6' stroke='%2322c55e' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "1–3 days ago",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23eef2ff' stroke='%234f46e5' stroke-width='3'/><path d='M32 18v10l8 6' stroke='%234f46e5' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "1–2 weeks ago",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff7ed' stroke='%23f97316' stroke-width='3'/><path d='M32 18v8l6 8' stroke='%23f97316' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      },
      {
        label: "More than 2 weeks ago",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><circle cx='32' cy='32' r='24' fill='%23fff1f2' stroke='%23ef4444' stroke-width='3'/><path d='M32 18v6l5 10' stroke='%23ef4444' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>"
      }
    ]
  },
  {
    id: "access",
    question: "Where is your boiler located?",
    type: "select",
    options: [
      {
        label: "Easy access",
        image: "/images/stepper/location-same-room.svg"
      },
      {
        label: "Cupboard / boxed in",
        image: "/images/stepper/location-cupboard.svg"
      },
      {
        label: "Loft",
        image: "/images/stepper/location-loft.svg"
      },
      {
        label: "Other",
        requiresText: true,
        image: "/images/stepper/location-other-room.svg"
      }
    ]
  }
  // Checkout collects details and visit time, so no pre-checkout duplicate steps here.
];
function RepairQuote() {
  const { basePrice, symbol, title } = usePage().props;
  const onSubmit = () => {
    console.log();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(BlueQuoteSkin, { children: /* @__PURE__ */ jsx(
      Stepper,
      {
        title: "Boiler Repair Quote",
        basePrice,
        steps: STEPS$1,
        serviceKey: SERVICES_KEY_VALUE.BOILER_REPAIR,
        currency: symbol,
        onSubmit,
        autoAdvance: true
      }
    ) })
  ] });
}
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RepairQuote
}, Symbol.toStringTag, { value: "Module" }));
const UK_POSTCODE_RE = /^(GIR\s?0AA|(?:(?:[A-PR-UWYZ][0-9]{1,2})|(?:[A-PR-UWYZ][A-HK-Y][0-9]{1,2})|(?:[A-PR-UWYZ][0-9][A-HJKPSTUW])|(?:[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
const ALLOWED_OUTCODES = ["LS", "WF", "HG", "BD"];
function normalizeUkPostcode(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length <= 3) return raw;
  return `${raw.slice(0, -3)} ${raw.slice(-3)}`.trim();
}
function getOutcode(value) {
  const normalized = normalizeUkPostcode(value);
  if (!normalized) return "";
  return normalized.includes(" ") ? normalized.split(" ")[0] : normalized.length > 3 ? normalized.slice(0, -3) : normalized;
}
function isAllowedOutcode(value) {
  const outcode = getOutcode(value);
  return ALLOWED_OUTCODES.some((prefix) => outcode.startsWith(prefix));
}
function ServiceCheckout() {
  const { answers, basePrice, symbol, title, stripePublishableKey } = usePage().props;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState(null);
  const [paymentBookingId, setPaymentBookingId] = useState(null);
  const [paymentTxId, setPaymentTxId] = useState(null);
  const [paymentReturnUrl, setPaymentReturnUrl] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [openPetTooltip, setOpenPetTooltip] = useState(false);
  const mounted = useRef(true);
  const paymentElementContainerRef = useRef(null);
  const paymentSectionRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const paymentElementRef = useRef(null);
  const lastAutoInitKeyRef = useRef("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!openPetTooltip) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-pet-policy-wrap="true"]')) {
        setOpenPetTooltip(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenPetTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openPetTooltip]);
  const dateRef = useRef(null);
  const titleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const postcodeRef = useRef(null);
  const addressRef = useRef(null);
  const fieldOrder = useMemo(
    () => [
      { key: "appointment", ref: dateRef },
      { key: "title", ref: titleRef },
      { key: "firstName", ref: firstNameRef },
      { key: "lastName", ref: lastNameRef },
      { key: "email", ref: emailRef },
      { key: "phone", ref: phoneRef },
      { key: "postcode", ref: postcodeRef },
      { key: "address", ref: addressRef }
    ],
    []
  );
  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) return null;
    return loadStripe(stripePublishableKey);
  }, [stripePublishableKey]);
  useEffect(() => {
    if (!paymentClientSecret || !paymentElementContainerRef.current || !stripePromise)
      return;
    let disposed = false;
    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe || disposed) return;
        const elements = stripe.elements({
          clientSecret: paymentClientSecret,
          appearance: { theme: "stripe" }
        });
        const paymentElement = elements.create("payment", {
          layout: "tabs"
        });
        paymentElement.mount(paymentElementContainerRef.current);
        stripeRef.current = stripe;
        elementsRef.current = elements;
        paymentElementRef.current = paymentElement;
        setPaymentError("");
      } catch (error) {
        const msg = "Unable to load secure payment form. Please try again, or refresh this page.";
        toast.error(msg);
        setPaymentError(msg);
        setPaymentClientSecret(null);
      }
    })();
    return () => {
      disposed = true;
      paymentElementRef.current?.destroy?.();
      paymentElementRef.current = null;
      elementsRef.current = null;
      stripeRef.current = null;
    };
  }, [paymentClientSecret, stripePromise]);
  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };
  const validateAll = () => {
    const next = {};
    if (!selectedDate) next.appointment = "Please select a visit date.";
    else if (!selectedTime) next.appointment = "Please select a visit time.";
    if (!formData.title) next.title = "Please select a title.";
    if (!formData.firstName?.trim()) next.firstName = "First name is required.";
    if (!formData.lastName?.trim()) next.lastName = "Last name is required.";
    const email = (formData.email || "").trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    const phone = (formData.phone || "").trim();
    if (!phone) next.phone = "Phone number is required.";
    else {
      const digits = phone.replace(/[^\d]/g, "");
      if (digits.length < 10)
        next.phone = "Please enter a valid phone number.";
    }
    const formattedPostcode = normalizeUkPostcode(formData.postcode);
    if (!formattedPostcode) {
      next.postcode = "Postcode is required.";
    } else if (!UK_POSTCODE_RE.test(formattedPostcode)) {
      next.postcode = "Please enter a valid UK postcode.";
    } else if (!isAllowedOutcode(formattedPostcode)) {
      next.postcode = "Checkout is restricted to LS, WF, HG and BD postcodes only.";
    }
    if (!formData.address?.trim()) next.address = "Address is required.";
    return next;
  };
  const checkoutReadyKey = useMemo(() => {
    if (!selectedDate || !selectedTime) return "";
    if (!formData.title?.trim()) return "";
    if (!formData.firstName?.trim()) return "";
    if (!formData.lastName?.trim()) return "";
    if (!formData.email?.trim()) return "";
    if (!formData.phone?.trim()) return "";
    const formattedPostcode = normalizeUkPostcode(formData.postcode);
    if (!formattedPostcode) return "";
    if (!UK_POSTCODE_RE.test(formattedPostcode)) return "";
    if (!isAllowedOutcode(formattedPostcode)) return "";
    if (!formData.address?.trim()) return "";
    return [
      selectedDate,
      selectedTime,
      formData.title,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formattedPostcode,
      formData.address
    ].map((v) => String(v || "").trim()).join("|");
  }, [selectedDate, selectedTime, formData]);
  const scrollToRef = (ref) => {
    const el = ref?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof el.focus === "function") el.focus();
  };
  const showValidationErrors = (errorsObj) => {
    if (!errorsObj || typeof errorsObj !== "object") return;
    const messages = Object.values(errorsObj).flat().filter(Boolean);
    if (!messages.length) return;
    messages.slice(0, 4).forEach((m) => toast.error(m, { duration: 5e3, position: "top-center" }));
    if (messages.length > 4) {
      toast.error("Please review the highlighted fields and try again.", {
        duration: 5e3,
        position: "top-center"
      });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: name === "postcode" ? normalizeUkPostcode(value) : value
    }));
    clearError(name);
  };
  const handleAppointmentChange = ({ date, time }) => {
    setSelectedDate(date);
    setSelectedTime(time);
    clearError("appointment");
  };
  const initialisePaymentElement = async ({ showValidationToast = false } = {}) => {
    const nextErrors = validateAll();
    if (Object.keys(nextErrors).length) {
      if (showValidationToast) {
        setErrors(nextErrors);
        setPaymentError("Please complete the highlighted fields first.");
        const first = fieldOrder.find((f) => nextErrors[f.key]);
        if (first) scrollToRef(first.ref);
        toast.error("Please complete the required details first.");
      }
      return false;
    }
    setPaymentError("");
    const customerName = `${formData.title} ${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      ...answers,
      customer_details: {
        full_name: customerName,
        title: formData.title,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode,
        address: formData.address,
        notes: formData.notes
      },
      visit_time: {
        datetime: {
          date: selectedDate,
          time: selectedTime
        },
        name: customerName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postcode
      },
      product: {},
      addOns: {}
    };
    try {
      setProcessing(true);
      const res = await axios.post(
        "/quote/checkout",
        {
          service: SERVICES_KEY_VALUE.BOILER_SERVICE,
          form: payload,
          amount: basePrice,
          payment_element: true
        },
        { timeout: 15e3 }
      );
      const checkoutClientSecret = res?.data?.data?.checkout_client_secret;
      const checkoutMode = res?.data?.data?.checkout_mode;
      if (checkoutMode === "payment_element" && checkoutClientSecret && stripePublishableKey) {
        setPaymentClientSecret(checkoutClientSecret);
        setPaymentBookingId(res?.data?.data?.booking_id || null);
        setPaymentTxId(res?.data?.data?.transaction_id || null);
        setPaymentReturnUrl(res?.data?.data?.return_url || null);
        setProcessing(false);
        return true;
      }
      throw new Error("Unable to initialise secure payment form.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        if (showValidationToast) showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (showValidationToast) {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
      return false;
    }
  };
  useEffect(() => {
    if (!checkoutReadyKey || paymentClientSecret || processing) return;
    if (lastAutoInitKeyRef.current === checkoutReadyKey) return;
    lastAutoInitKeyRef.current = checkoutReadyKey;
    const timer = setTimeout(() => {
      initialisePaymentElement({ showValidationToast: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [checkoutReadyKey, paymentClientSecret, processing]);
  const handlePayAndBook = async () => {
    if (processing) return;
    if (!paymentClientSecret) {
      await initialisePaymentElement({ showValidationToast: true });
      return;
    }
    setPaymentError("");
    try {
      setProcessing(true);
      if (!stripeRef.current || !elementsRef.current) {
        throw new Error("Payment form is still loading. Please try again.");
      }
      const { error, paymentIntent } = await stripeRef.current.confirmPayment(
        {
          elements: elementsRef.current,
          confirmParams: {
            return_url: paymentReturnUrl || `${window.location.origin}/checkout/success-intent?booking=${paymentBookingId}&tx=${paymentTxId}`
          },
          redirect: "if_required"
        }
      );
      if (error) {
        setPaymentError(
          error.message || "Payment could not be confirmed. Please check your details and try again."
        );
        toast.error(error.message || "Payment failed.");
        setProcessing(false);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        const confirmRes = await axios.post(
          "/quote/checkout/confirm-intent",
          {
            booking_id: paymentBookingId,
            tx_id: paymentTxId,
            payment_intent_id: paymentIntent.id
          },
          { timeout: 15e3 }
        );
        const redirectUrl = confirmRes?.data?.data?.redirect_url;
        if (redirectUrl) {
          window.location.assign(redirectUrl);
          return;
        }
      }
      setProcessing(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        showValidationErrors(err?.response?.data?.errors);
      } else if (status >= 500) {
        toast.error("Payment service is temporarily unavailable. Please try again shortly.", {
          duration: 5e3,
          position: "top-center"
        });
      } else if (err?.code === "ECONNABORTED") {
        toast.error("Request timed out. Please check your connection and try again.", {
          duration: 5e3,
          position: "top-center"
        });
      } else {
        const message = err?.response?.data?.message || err?.message || "Unable to initiate payment. Please try again.";
        toast.error(message, { duration: 5e3, position: "top-center" });
      }
      if (mounted.current) setProcessing(false);
    }
  };
  const summaryItems = [
    { label: "Boiler type", value: answers?.boiler_type?.label || "—" },
    { label: "Make & model", value: answers?.boiler_model?.label || "—" },
    { label: "Boiler age", value: answers?.boiler_age?.label || "—" },
    { label: "Access", value: answers?.access?.label || "—" },
    {
      label: "Known issues",
      value: answers?.any_issue?.label || "—"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx("style", { children: `
                .pet-doggy-wrap {
                    animation: pet-doggy-bob 1.8s ease-in-out infinite;
                    transform-origin: center;
                }

                .pet-doggy-ear-left,
                .pet-doggy-ear-right {
                    animation: pet-doggy-ear 1.2s ease-in-out infinite;
                    transform-origin: center top;
                }

                @keyframes pet-doggy-bob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-1.5px); }
                }

                @keyframes pet-doggy-ear {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(7deg); }
                }
            ` }),
    /* @__PURE__ */ jsxs(BlueQuoteSkin, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50 quote-page-bg" }),
      /* @__PURE__ */ jsxs("div", { className: "min-h-screen quote-page-bg", children: [
        /* @__PURE__ */ jsx(PageHeader, {}),
        /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[12px] font-semibold text-emerald-800", children: [
              /* @__PURE__ */ jsx(FiShield, { className: "h-3.5 w-3.5" }),
              "Secure checkout"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-slate-900", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-slate-600 max-w-2xl", children: "Confirm your visit time and details. Your service is fixed price—no surprises when the engineer arrives." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-8 items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-[0_24px_60px_rgba(16,185,129,0.12)]", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-white" }),
              /* @__PURE__ */ jsxs("div", { className: "relative p-6 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-700 font-semibold", children: "Fixed, all-in price" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-slate-900", children: [
                      symbol,
                      basePrice
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: "If inspection finds worn seals, gaskets, or electrodes, we’ll quote before fitting—often not needed." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800", children: [
                    /* @__PURE__ */ jsx(FiCheck, { className: "h-4 w-4" }),
                    "No hidden fees"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: summaryItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.12em] text-slate-500", children: item.label }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-slate-900 leading-snug break-words", children: item.value })
                ] }, item.label)) }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-900", children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-semibold text-emerald-900 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FiShield, { className: "h-4 w-4" }),
                    " What’s included"
                  ] }),
                  /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 text-slate-700", children: [
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Safety, combustion, and flue checks"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Full clean of burner, condense trap, and seals"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Expansion vessel set & leak-checked"
                    ] }),
                    /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                      "Digital service record for compliance"
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Choose a visit time" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-1 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FiCalendar, { className: "h-4 w-4" }),
                      " Pick a preferred date and time."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700", children: [
                    /* @__PURE__ */ jsx(FiMapPin, { className: "h-4 w-4" }),
                    " Leeds & surrounding areas"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { ref: dateRef, className: "mt-5", children: [
                  /* @__PURE__ */ jsx(
                    AppointmentDateRangePicker,
                    {
                      value: selectedDate && selectedTime ? { date: selectedDate, time: selectedTime } : null,
                      type: SERVICES_KEY_VALUE.BOILER_SERVICE,
                      onChange: handleAppointmentChange
                    }
                  ),
                  errors.appointment && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-2", children: errors.appointment })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 space-y-4", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Your details" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Title" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        ref: titleRef,
                        name: "title",
                        value: formData.title,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "Select" }),
                          "Mr, Mrs, Ms, Miss, Dr".split(", ").map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
                        ]
                      }
                    ),
                    errors.title && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.title })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "First name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: firstNameRef,
                        name: "firstName",
                        value: formData.firstName,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.firstName && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.firstName })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Last name" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: lastNameRef,
                        name: "lastName",
                        value: formData.lastName,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.lastName && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.lastName })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Email" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: emailRef,
                        name: "email",
                        value: formData.email,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Phone" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: phoneRef,
                        name: "phone",
                        value: formData.phone,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Postcode" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        ref: postcodeRef,
                        name: "postcode",
                        value: formData.postcode,
                        onChange: handleInputChange,
                        className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      }
                    ),
                    errors.postcode && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.postcode })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Address" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: addressRef,
                      name: "address",
                      value: formData.address,
                      onChange: handleInputChange,
                      className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    }
                  ),
                  errors.address && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.address })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-slate-500", children: "Notes (optional)" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      name: "notes",
                      value: formData.notes,
                      onChange: handleInputChange,
                      rows: 3,
                      className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_20px_50px_rgba(16,185,129,0.35)] p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
                    /* @__PURE__ */ jsx(FiShield, { className: "h-4 w-4" }),
                    " Secure Stripe checkout"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs bg-white/15 px-3 py-1 rounded-full", children: "Card or Klarna payments" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handlePayAndBook,
                    disabled: processing,
                    "aria-busy": processing,
                    className: `w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition ${processing ? "bg-white/20 cursor-not-allowed" : "bg-white text-emerald-700 hover:bg-emerald-50"}`,
                    children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiLoader, { className: "animate-spin" }),
                      "Processing…"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FiCreditCard, {}),
                      paymentClientSecret ? "Confirm & Book Service" : "Continue to secure payment"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { "data-pet-policy-wrap": "true", className: "relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-800 group/pet-policy", children: [
                  /* @__PURE__ */ jsx("span", { className: "pet-doggy-wrap inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100/90 ring-1 ring-amber-200", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "h-4.5 w-4.5", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-left", d: "M7 7.2c-.8-1.5-2.3-1.9-3.2-.8-.8 1-.6 2.5.8 3.4L7 10.9V7.2Z", fill: "#c08457" }),
                    /* @__PURE__ */ jsx("path", { className: "pet-doggy-ear-right", d: "M17 7.2c.8-1.5 2.3-1.9 3.2-.8.8 1 .6 2.5-.8 3.4L17 10.9V7.2Z", fill: "#c08457" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "7", fill: "#f5c892" }),
                    /* @__PURE__ */ jsx("circle", { cx: "9.4", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                    /* @__PURE__ */ jsx("circle", { cx: "14.6", cy: "11.3", r: "0.9", fill: "#1f2937" }),
                    /* @__PURE__ */ jsx("ellipse", { cx: "12", cy: "13.7", rx: "1.2", ry: "0.9", fill: "#111827" }),
                    /* @__PURE__ */ jsx("path", { d: "M10.8 15.4c.3.5.7.8 1.2.8s.9-.3 1.2-.8", stroke: "#7c2d12", strokeWidth: "1", strokeLinecap: "round", fill: "none" })
                  ] }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-900", children: "Pet-friendly visits" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setOpenPetTooltip(
                        (prev) => !prev
                      ),
                      className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 transition-colors hover:border-emerald-500 hover:text-emerald-800",
                      "aria-label": "Show pet-friendly information",
                      children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `quote-solid-popover absolute left-0 top-9 z-20 w-[320px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 shadow-xl translate-y-1 transition-all duration-200 ${openPetTooltip ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 group-hover/pet-policy:pointer-events-auto group-hover/pet-policy:opacity-100 group-hover/pet-policy:translate-y-0 group-focus-within/pet-policy:pointer-events-auto group-focus-within/pet-policy:opacity-100 group-focus-within/pet-policy:translate-y-0"}`,
                      children: [
                        /* @__PURE__ */ jsx("p", { children: "We are dog-friendly and happy for them to be around during the visit." }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "If your dog is feeling social, we are always glad to say hello first." }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1.5", children: "During active work, we ask that pets are kept clear of tools and working areas for everyone’s safety." })
                      ]
                    }
                  )
                ] }),
                paymentClientSecret && /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: paymentSectionRef,
                    className: "mt-4 rounded-2xl bg-white p-3",
                    children: /* @__PURE__ */ jsx("div", { ref: paymentElementContainerRef })
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-50/90 text-center mt-3", children: "Your details are encrypted and processed by Stripe." }),
                paymentError && /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-100 text-center mt-2 font-semibold", children: paymentError })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(GoogleReview, {})
      ] })
    ] })
  ] });
}
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceCheckout
}, Symbol.toStringTag, { value: "Module" }));
const STEPS = [
  {
    id: "boiler_type",
    question: "What type of boiler do you have?",
    type: "select",
    options: [
      { label: "Combi", image: "/images/stepper/combi_boiler.png" },
      { label: "System", image: "/images/stepper/system_boiler.png" },
      {
        label: "Heat Only",
        image: "/images/stepper/regular_boiler.png"
      }
    ]
  },
  {
    id: "boiler_model",
    question: "What boiler make and model do you have?",
    type: "make_model",
    brands: [
      "Worcester Bosch",
      "Vaillant",
      "Ideal",
      "Baxi",
      "Viessmann",
      "Glow-worm",
      "Potterton",
      "Vokera",
      "Ferroli",
      "Alpha",
      "Main",
      "Ariston",
      "Sime",
      "Remeha",
      "Ravenheat",
      "ATAG",
      "Intergas",
      "Navien",
      "Keston",
      "Saunier Duval",
      "Grant",
      "Buderus",
      "Other",
      "Not sure"
    ],
    getModels: (brand) => {
      if (!brand || brand === "Not sure") {
        return [
          { label: "Not sure" },
          { label: "Other" }
        ];
      }
      const modelsByBrand = {
        "Worcester Bosch": [
          "Greenstar 30i",
          "Greenstar 25i",
          "Greenstar 28i",
          "Greenstar 30CDi",
          "Greenstar 32CDi",
          "Greenstar 35CDi",
          "Greenstar 38CDi"
        ],
        Vaillant: [
          "ecoTEC Plus 830",
          "ecoTEC Plus 832",
          "ecoTEC Plus 835",
          "ecoTEC Plus 838",
          "ecoTEC Pro 24",
          "ecoTEC Pro 28"
        ],
        Ideal: [
          "Logic+ 24",
          "Logic+ 30",
          "Logic+ 35",
          "Logic Max 24",
          "Logic Max 30",
          "Logic Max 35",
          "Vogue Max 26",
          "Vogue Max 32",
          "Vogue Max 40"
        ],
        Baxi: [
          "Duo-tec 24",
          "Duo-tec 28",
          "Duo-tec 33",
          "Duo-tec 40",
          "Platinum 24",
          "Platinum 28",
          "Platinum 33"
        ],
        Viessmann: [
          "Vitodens 050",
          "Vitodens 100",
          "Vitodens 111"
        ],
        "Glow-worm": [
          "Energy 25",
          "Energy 30",
          "Energy 35",
          "Compact 24",
          "Compact 28"
        ],
        Potterton: [
          "Gold 24",
          "Gold 28",
          "Gold 33",
          "Gold 40"
        ],
        Vokera: ["Easi-Heat 24", "Easi-Heat 29", "Easi-Heat 36"],
        Ferroli: ["Modena 32", "Modena 38", "Modena HE 25"],
        Alpha: ["E-Tec 28", "E-Tec 33", "E-Tec 38"],
        Main: ["Eco Compact 25", "Eco Compact 30"],
        Ariston: ["Clas ONE 24", "Clas ONE 30", "Clas ONE 35"],
        Sime: ["Murelle 25", "Murelle 30"],
        Remeha: ["Avanta 24", "Avanta 28", "Avanta 35"],
        Ravenheat: ["HE 80", "HE 85"],
        ATAG: ["iC 24", "iC 28", "iC 35"],
        Intergas: ["Kombi Compact HRE 24", "Kombi Compact HRE 36"],
        Navien: ["NCB 28", "NCB 33"],
        Keston: ["Combi 30", "Combi 35"],
        "Saunier Duval": [
          "Thema Classic 25",
          "Thema Classic 30"
        ],
        Grant: ["Vortex 26", "Vortex 36"],
        Buderus: ["Logamax plus 24", "Logamax plus 28"]
      };
      const models = modelsByBrand[brand] || [];
      return [
        ...models.map((label2) => ({ label: label2 })),
        { label: "Other" },
        { label: "Not sure" }
      ];
    }
  },
  {
    id: "boiler_age",
    question: "How old is your boiler?",
    type: "select",
    options: [
      {
        label: "Under 5 years",
        image: "/images/stepper/option-yes.svg"
      },
      {
        label: "5–10 years",
        image: "/images/stepper/option-yes.svg"
      },
      {
        label: "10–15 years",
        image: "/images/stepper/option-yes.svg"
      },
      {
        label: "15+ years / Not sure",
        image: "/images/stepper/option-yes.svg"
      }
    ]
  },
  {
    id: "access",
    question: "Where is your boiler located?",
    type: "select",
    options: [
      {
        label: "Easy access",
        image: "/images/stepper/location-same-room.svg"
      },
      {
        label: "Tight cupboard",
        image: "/images/stepper/location-cupboard.svg"
      },
      { label: "Loft", image: "/images/stepper/location-loft.svg" },
      {
        label: "Other",
        requiresText: true,
        image: "/images/stepper/location-other-room.svg"
      }
    ]
  },
  {
    id: "any_issue",
    question: "Any known issues?",
    type: "select",
    options: [
      { label: "No", image: "/images/stepper/option-no.svg" },
      {
        label: "Yes",
        requiresText: true,
        image: "/images/stepper/option-yes.svg"
      }
    ]
  }
  // {
  //     id: "summary",
  //     question: "Review & pricing",
  //     type: "summary",
  // },
];
function ServiceQuote() {
  const { basePrice, symbol, title } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(BlueQuoteSkin, { children: /* @__PURE__ */ jsx(
      Stepper,
      {
        title: "Annual Boiler Service",
        basePrice,
        steps: STEPS,
        currency: symbol,
        serviceKey: SERVICES_KEY_VALUE.BOILER_SERVICE,
        autoAdvance: true
      }
    ) })
  ] });
}
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceQuote
}, Symbol.toStringTag, { value: "Module" }));
const tabs = [
  {
    id: "details",
    label: "Performance",
    subtitle: "Core specifications",
    icon: FiInfo,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400"
  },
  {
    id: "whats-included",
    label: "Scope",
    subtitle: "Included works",
    icon: FiCheckSquare,
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400"
  },
  {
    id: "your-selections",
    label: "Selections",
    subtitle: "Survey choices",
    icon: FiTool,
    color: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400"
  }
];
function ProductTabs({
  notes = [],
  includes = [],
  kw = "25",
  warranty = "10",
  brand = "Boiler",
  selectedExtras = [],
  addOnsTotal = 0,
  containerRef
}) {
  const isCompatibilityDependentItem = (label2 = "") => {
    const normalized = String(label2).toLowerCase();
    return ["shock arrestor", "scale reducer", "magnetic filter"].some(
      (term) => normalized.includes(term)
    );
  };
  const compatibilityTooltipText = "Installed subject to site suitability and compatibility with your existing system configuration.";
  const [activeTab, setActiveTab] = useState("details");
  const [isSticky, setIsSticky] = useState(false);
  const isManualScroll = useRef(false);
  const sectionRef = useRef(null);
  const tabRefs = useRef({});
  useEffect(() => {
    const currentContainer = containerRef?.current;
    if (!currentContainer) return;
    const observerOptions = {
      root: currentContainer,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      if (isManualScroll.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);
    Object.values(tabRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [containerRef]);
  useEffect(() => {
    const currentContainer = containerRef?.current;
    if (!currentContainer) return;
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const containerRect = currentContainer.getBoundingClientRect();
        setIsSticky(rect.top - containerRect.top <= 10);
      }
    };
    currentContainer.addEventListener("scroll", handleScroll);
    return () => currentContainer.removeEventListener("scroll", handleScroll);
  }, [containerRef]);
  const scrollToSection = useCallback(
    (tabId) => {
      const element = tabRefs.current[tabId];
      const container = containerRef?.current;
      if (element && container) {
        isManualScroll.current = true;
        setActiveTab(tabId);
        const headerOffset = 160;
        const elementTop = element.getBoundingClientRect().top;
        const containerTop = container.getBoundingClientRect().top;
        const currentScroll = container.scrollTop;
        const targetPosition = currentScroll + (elementTop - containerTop) - headerOffset;
        container.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        setTimeout(() => {
          isManualScroll.current = false;
        }, 1e3);
      }
    },
    [containerRef]
  );
  return /* @__PURE__ */ jsxs("div", { ref: sectionRef, className: "relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `sticky z-40 transition-all duration-300 rounded-2xl ${isSticky ? "top-0 py-3 bg-white/95 backdrop-blur border-b border-slate-200 shadow-lg -mx-2 px-6" : "top-4"}`,
        children: /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto py-2 px-2 no-scrollbar", children: /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => scrollToSection(tab.id),
              className: `relative group min-w-[160px] px-5 py-3 rounded-xl border transition-all duration-300 flex-shrink-0 ${isActive ? "border-primary/30 bg-primary/10 text-primary shadow-md scale-[1.02]" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.01]"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? "bg-white" : "bg-slate-100"}`,
                    children: /* @__PURE__ */ jsx(
                      tab.icon,
                      {
                        className: `text-lg transition-all duration-300 ${isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-800"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `font-bold transition-all duration-300 ${isActive ? "text-primary" : "text-slate-800 group-hover:text-slate-900"}`,
                      children: tab.label
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "text-xs transition-all duration-300 text-slate-500 group-hover:text-slate-700", children: tab.subtitle })
                ] })
              ] })
            },
            tab.id
          );
        }) }) }) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-none mt-6 space-y-8 pb-16", children: [
      /* @__PURE__ */ jsx(
        "section",
        {
          id: "details",
          ref: (el) => tabRefs.current["details"] = el,
          className: "scroll-mt-32",
          children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-8 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiInfo, { className: "text-2xl text-blue-700" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-slate-900", children: "Designed for reliable day-to-day comfort" }),
                /* @__PURE__ */ jsxs("div", { className: "text-slate-600", children: [
                  "A ",
                  brand,
                  " package matched to your property profile, balancing output, efficiency, and long-term usability."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl border border-slate-200 p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(FiCpu, { className: "text-blue-700 text-xl" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-slate-900", children: [
                      kw,
                      "kW"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-[12px] text-slate-600", children: "Output Rating" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-700 text-sm", children: "Sized to support stable heating performance and dependable hot water delivery for your household demand." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl border border-slate-200 p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(FiCalendar, { className: "text-cyan-700 text-xl" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-slate-900", children: [
                      warranty,
                      " Year"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-[12px] text-slate-600", children: "Warranty Included" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-700 text-sm", children: "Clear warranty coverage to protect your installation, with support expectations set out from day one." })
              ] })
            ] }),
            notes && notes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-slate-900 mb-4", children: "Why this model is a strong fit" }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-700 text-sm leading-relaxed mb-4", children: "Key notes from your quote engine analysis, focused on practical performance and installation suitability." }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: notes.map((note, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200",
                  children: [
                    /* @__PURE__ */ jsx(FiCheck, { className: "text-emerald-600 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "text-slate-800 text-[14px]", children: note })
                  ]
                },
                index
              )) })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "section",
        {
          id: "whats-included",
          ref: (el) => tabRefs.current["whats-included"] = el,
          className: "scroll-mt-32",
          children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-8 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiCheckSquare, { className: "text-2xl text-emerald-700" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-[20px] font-bold text-slate-900", children: "Included in your installation scope" }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-600 text-[14px]", children: "Core works and components provided to complete a compliant, handover-ready installation." })
              ] })
            ] }),
            includes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: includes.map((item, index) => /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-slate-50 rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:border-slate-300 hover:scale-[1.02]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(FiPackage, { className: "text-emerald-700 text-lg" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-900 mb-1 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { children: item }),
                  isCompatibilityDependentItem(
                    item
                  ) && /* @__PURE__ */ jsx(
                    "span",
                    {
                      title: compatibilityTooltipText,
                      "aria-label": compatibilityTooltipText,
                      className: "inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500",
                      children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3 w-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Included as standard within your selected package." })
              ] })
            ] }) }) }, index)) }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600", children: "No line-item inclusions were provided for this product profile." })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "section",
        {
          id: "your-selections",
          ref: (el) => tabRefs.current["your-selections"] = el,
          className: "scroll-mt-32",
          children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-8 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiTool, { className: "text-2xl text-violet-700" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-[20px] font-bold text-slate-900", children: "Your selected survey options" }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-600 text-[14px]", children: "These choices carry through to checkout exactly as shown below." })
              ] })
            ] }),
            selectedExtras.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedExtras.map((extra, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-800", children: extra.label }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-700 text-right", children: extra.totalText || extra.value || "Included" })
                  ]
                },
                `${extra.label}-${index}`
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-violet-900", children: "Add-ons total" }),
                /* @__PURE__ */ jsxs("span", { className: "text-base font-bold text-violet-900", children: [
                  "£",
                  Number(addOnsTotal || 0).toLocaleString()
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600", children: "No paid extras were selected in your survey journey." })
          ] })
        }
      )
    ] })
  ] });
}
function DetailsQuoteSidebar({
  detailsQuote,
  onClose,
  answers,
  product,
  selectedPower
}) {
  if (!detailsQuote) return null;
  const isCompatibilityDependentItem = (label2 = "") => {
    const normalized = String(label2).toLowerCase();
    return ["shock arrestor", "scale reducer", "magnetic filter"].some(
      (term) => normalized.includes(term)
    );
  };
  const compatibilityTooltipText = "Installed subject to site suitability and compatibility with your existing system configuration.";
  const scrollContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, []);
  const {
    brand = "",
    model = "",
    tier = "",
    kw = "",
    warrantyYears = "",
    includes = [],
    price = 0,
    productImages = [],
    selectedExtras = [],
    addOnsTotal = 0
  } = detailsQuote;
  const safePrice = Number(price) || 0;
  const getCsrfToken = () => {
    if (typeof document === "undefined") return null;
    return document.head.querySelector('meta[name="csrf-token"]')?.content;
  };
  const withCsrf = (payload) => {
    const token = getCsrfToken();
    return token ? { ...payload, _token: token } : payload;
  };
  const calculatePrice = (productToPrice) => {
    if (productToPrice?.pricing?.total) return productToPrice.pricing.total;
    const base = parseFloat(productToPrice?.pricing?.base || 0);
    const margin = parseFloat(productToPrice?.pricing?.marginApplied || 0);
    const addons = parseFloat(productToPrice?.pricing?.addOnsTotal || 0);
    return base + margin + addons;
  };
  const finalPrice = calculatePrice(product);
  const carouselImages = Array.isArray(productImages) ? productImages : productImages ? [productImages] : ["/images/ideal-20logic.png"];
  const getBrandLogo = (brandName) => {
    const b = String(brandName || "").toLowerCase();
    if (b.includes("worcester"))
      return "/images/brands/worcester-bosch.svg";
    if (b.includes("ideal")) return "/images/idealheating.png";
    if (b.includes("vaillant")) return "/images/brands/vaillant.svg";
    if (b.includes("viessmann")) return "/images/brands/viessmann.svg";
    if (b.includes("baxi")) return "/images/brands/baxi.svg";
    if (b.includes("alpha")) return "/images/brands/alpha.svg";
    if (b.includes("glow")) return "/images/brands/glow-worm.svg";
    if (b.includes("vokera")) return "/images/brands/vokera.svg";
    if (b.includes("intergas")) return "/images/brands/intergas.svg";
    if (b.includes("atag")) return "/images/brands/atag.svg";
    return null;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                .spec-sheet-modal,
                .spec-sheet-modal * {
                    color-scheme: light !important;
                    forced-color-adjust: none !important;
                }

                .spec-sheet-modal {
                    background-color: #00abdb !important;
                }

                .spec-sheet-overlay {
                    background: rgba(2, 6, 23, 0.65) !important;
                }

                /* Only the pop-up bar (sticky top header) gets the 00ABDB look */
                .spec-sheet-modal .sticky.top-0 {
                    background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                    border-bottom-color: rgba(255, 255, 255, 0.32) !important;
                }

                /* Keep the entire sidebar solid (not transparent) */
                .spec-sheet-modal [class*="bg-white"],
                .spec-sheet-modal [class*="bg-white/"],
                .spec-sheet-modal [class*="bg-slate-50"],
                .spec-sheet-modal [class*="bg-slate-50/"],
                .spec-sheet-modal [class*="bg-slate-100"],
                .spec-sheet-modal [class*="bg-slate-100/"],
                .spec-sheet-modal [class*="bg-slate-200"],
                .spec-sheet-modal [class*="bg-slate-200/"] {
                    background-color: #0098c4 !important;
                    background-image: none !important;
                }

                .spec-sheet-modal [class*="border-"] {
                    border-color: rgba(255, 255, 255, 0.35) !important;
                }

                .spec-sheet-modal [class*="text-slate-900"],
                .spec-sheet-modal [class*="text-slate-800"],
                .spec-sheet-modal [class*="text-slate-700"],
                .spec-sheet-modal [class*="text-slate-600"],
                .spec-sheet-modal [class*="text-slate-500"],
                .spec-sheet-modal [class*="text-dark"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }


                .spec-sheet-modal .cta-book-now {
                    background: linear-gradient(90deg, #fb923c 0%, #f97316 100%) !important;
                    border-color: #fdba74 !important;
                    color: #7c2d12 !important;
                    opacity: 1 !important;
                    box-shadow: 0 18px 46px rgba(249, 115, 22, 0.42) !important;
                }

                .spec-sheet-modal .cta-book-now:hover {
                    background: linear-gradient(90deg, #f97316 0%, #ea580c 100%) !important;
                    box-shadow: 0 24px 58px rgba(249, 115, 22, 0.56) !important;
                }

                .spec-sheet-modal .cta-book-now * {
                    color: #7c2d12 !important;
                    -webkit-text-fill-color: #7c2d12 !important;
                }

                .spec-sheet-modal .cta-book-now .cta-book-now-icon,
                .spec-sheet-modal .cta-book-now .cta-book-now-icon * {
                    color: #ea580c !important;
                    -webkit-text-fill-color: #ea580c !important;
                }
                .spec-sheet-modal .sticky.top-0 h2,
                .spec-sheet-modal .sticky.top-0 span,
                .spec-sheet-modal .sticky.top-0 p,
                .spec-sheet-modal .sticky.top-0 svg,
                .spec-sheet-modal .sticky.top-0 [class*="text-"] {
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }

                .spec-sheet-modal .sticky.top-0 button,
                .spec-sheet-modal .sticky.top-0 button * {
                    background-color: rgba(255, 255, 255, 0.14) !important;
                    border-color: rgba(255, 255, 255, 0.30) !important;
                    color: #ffffff !important;
                    -webkit-text-fill-color: #ffffff !important;
                }
            ` }),
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: onClose,
        className: "fixed inset-0 bg-black/70 z-40 spec-sheet-overlay"
      }
    ),
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: "fixed right-0 top-0 h-full w-full overflow-y-auto overscroll-contain [touch-action:pan-y] lg:w-[95vw] xl:w-[1200px] bg-slate-50 z-50 border-l border-slate-200 shadow-2xl animate-slideFromRight isolate spec-sheet-modal",
        style: { WebkitOverflowScrolling: "touch" },
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-30 bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Complete package breakdown" }),
              tier && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold", children: tier })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "h-9 w-9 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors",
                children: /* @__PURE__ */ jsx(FiX, { className: "text-slate-600" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "hidden lg:block w-[360px] p-4 lg:p-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.08)]", children: [
              /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-slate-200 flex justify-between bg-white", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                /* @__PURE__ */ jsx(FiCamera, { className: "text-slate-700" }),
                /* @__PURE__ */ jsx("h3", { className: "text-slate-900 font-semibold", children: "Package overview" })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: carouselImages[currentImageIndex],
                    alt: `${brand} ${model}`,
                    className: "mx-auto max-h-[300px] object-contain",
                    onError: (e) => {
                      e.currentTarget.src = "/images/ideal-20logic.png";
                    }
                  }
                ),
                carouselImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "mt-5 grid grid-cols-4 gap-2", children: carouselImages.slice(0, 4).map((image, idx) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCurrentImageIndex(
                      idx
                    ),
                    className: `h-16 rounded-lg border overflow-hidden transition-all ${currentImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`,
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: image,
                        alt: `${brand} ${model} ${idx + 1}`,
                        className: "h-full w-full object-cover",
                        onError: (e) => {
                          e.currentTarget.src = "/images/ideal-20logic.png";
                        }
                      }
                    )
                  },
                  `${image}-${idx}`
                )) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2", children: "Why homeowners choose this package" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-slate-700", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "text-emerald-600" }),
                      "Clear scope, fixed price, no hidden extras"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "text-emerald-600" }),
                      "Installed and commissioned by Gas Safe engineers"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(FiCheck, { className: "text-emerald-600" }),
                      "Handover and warranty documentation included"
                    ] })
                  ] })
                ] }),
                getBrandLogo(brand) && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-slate-200 bg-white p-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2", children: "Manufacturer" }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 flex items-center justify-center", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: getBrandLogo(brand),
                        alt: `${brand} logo`,
                        className: "h-7 object-contain",
                        loading: "lazy",
                        onError: (e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = "inline";
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "hidden text-xs font-semibold text-slate-600",
                        style: { display: "none" },
                        children: brand
                      }
                    )
                  ] })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                ref: scrollContainerRef,
                className: "flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth relative thin-scroll",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "lg:hidden rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-[0_10px_28px_rgba(15,23,42,0.06)]", children: [
                      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-slate-200 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(FiCamera, { className: "text-slate-700" }),
                        /* @__PURE__ */ jsx("h3", { className: "text-slate-900 font-semibold text-sm", children: "Package overview" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: carouselImages[currentImageIndex],
                            alt: `${brand} ${model}`,
                            className: "mx-auto max-h-[240px] object-contain",
                            onError: (e) => {
                              e.currentTarget.src = "/images/ideal-20logic.png";
                            }
                          }
                        ),
                        carouselImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-4 gap-2", children: carouselImages.slice(0, 4).map((image, idx) => /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setCurrentImageIndex(
                              idx
                            ),
                            className: `h-14 rounded-lg border overflow-hidden transition-all ${currentImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"}`,
                            children: /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: image,
                                alt: `${brand} ${model} ${idx + 1}`,
                                className: "h-full w-full object-cover",
                                onError: (e) => {
                                  e.currentTarget.src = "/images/ideal-20logic.png";
                                }
                              }
                            )
                          },
                          `mobile-${image}-${idx}`
                        )) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.06)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:grid lg:grid-cols-[1fr_auto] lg:items-center gap-6 lg:gap-8", children: [
                      /* @__PURE__ */ jsxs("div", { className: "lg:border-r border-slate-200 lg:pr-8", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2", children: model }),
                        /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold text-slate-900 break-words leading-tight", children: brand }),
                        getBrandLogo(brand) && /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2", children: [
                          /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: getBrandLogo(brand),
                              alt: `${brand} logo`,
                              className: "h-5 w-auto object-contain",
                              loading: "lazy",
                              onError: (e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) fallback.style.display = "inline";
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "hidden text-xs font-semibold text-slate-600",
                              style: { display: "none" },
                              children: brand
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-slate-600 max-w-xl leading-relaxed", children: "Expertly matched to your survey details for strong comfort, efficient performance, and a smooth installation day." })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-left lg:text-right lg:min-w-[200px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-2 uppercase tracking-wider", children: "Total Package" }),
                        /* @__PURE__ */ jsxs("div", { className: "text-4xl lg:text-5xl font-bold text-slate-900", children: [
                          "£",
                          safePrice.toLocaleString()
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500 mt-2", children: "(inc VAT)" })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(FiShield, { className: "text-emerald-700" }),
                        "Gas Safe installation"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs font-semibold text-sky-900 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-sky-700" }),
                        "Fixed quote with full visibility"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(FiFileText, { className: "text-slate-700" }),
                        "Written itemised scope"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: "Boiler output" }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-2xl font-bold text-slate-900", children: [
                          kw,
                          "kW"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: "Warranty" }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-2xl font-bold text-slate-900", children: [
                          warrantyYears,
                          " years"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: "Typical install" }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-2xl font-bold text-slate-900 flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(FiClock, { className: "text-primary" }),
                          "1 day"
                        ] })
                      ] })
                    ] }),
                    selectedExtras.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Your selected extras" }),
                        /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-slate-700", children: [
                          "Add-ons total: £",
                          Number(addOnsTotal || 0).toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: selectedExtras.map((extra, idx) => /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5",
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-slate-800 flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx("span", { children: extra.label }),
                              isCompatibilityDependentItem(
                                extra.label
                              ) && /* @__PURE__ */ jsx(
                                "span",
                                {
                                  title: compatibilityTooltipText,
                                  "aria-label": compatibilityTooltipText,
                                  className: "inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500",
                                  children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3 w-3" })
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-700 text-right", children: extra.totalText || extra.value || "Included" })
                          ]
                        },
                        `${extra.label}-${idx}`
                      )) }),
                      /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-slate-500", children: "Your selected extras above are carried directly into checkout." })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 mb-3", children: "What happens after you continue" }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700", children: [
                          /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-900 mb-1 flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(FiMapPin, { className: "text-primary" }),
                            "1. Confirm details"
                          ] }),
                          "Review address, date, and selected options."
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700", children: [
                          /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-900 mb-1 flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(FiFileText, { className: "text-primary" }),
                            "2. Secure checkout"
                          ] }),
                          "Complete payment through trusted hosted checkout."
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700", children: [
                          /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-900 mb-1 flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(FiCalendar, { className: "text-primary" }),
                            "3. Installation confirmed"
                          ] }),
                          "Receive confirmation and appointment details."
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => router.post(
                          "/book/quote/new/install",
                          withCsrf({
                            boiler_id: product.id,
                            brand: product.brand,
                            model: product.model,
                            includes: product.includes ?? [],
                            images: product.images ?? [],
                            kw: product.kw,
                            warrantyYears: product.warrantyYears,
                            price: finalPrice,
                            power: selectedPower,
                            answers
                          })
                        ),
                        className: "group relative cursor-pointer w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 cta-book-now",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 flex items-center justify-center rounded-xl bg-white shadow-sm shrink-0 cta-book-now-icon", children: /* @__PURE__ */ jsx(FiCalendar, { className: "text-2xl" }) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-xs text-orange-950/85 font-bold uppercase tracking-wider", children: "Ready to book" }),
                            /* @__PURE__ */ jsx("span", { className: "text-orange-950 font-extrabold text-xl leading-tight", children: "BOOK THIS PACKAGE NOW" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[12px] text-orange-950/80 font-semibold mt-1", children: "See live engineer availability next" })
                          ] }),
                          /* @__PURE__ */ jsx(FiArrowRight, { className: "text-orange-950 group-hover:translate-x-1 transition-transform text-2xl shrink-0" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    ProductTabs,
                    {
                      containerRef: scrollContainerRef,
                      notes: detailsQuote.notes,
                      includes: detailsQuote.includes,
                      kw: detailsQuote.kw,
                      warranty: detailsQuote.warrantyYears,
                      brand: detailsQuote.brand,
                      selectedExtras: detailsQuote.selectedExtras,
                      addOnsTotal: detailsQuote.addOnsTotal
                    }
                  )
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function QuoteResultsPage({ answers }) {
  const isCompatibilityDependentItem = (label2 = "") => {
    const normalized = String(label2).toLowerCase();
    return ["shock arrestor", "scale reducer", "magnetic filter"].some(
      (term) => normalized.includes(term)
    );
  };
  const compatibilityTooltipText = "Installed subject to site suitability and compatibility with your existing system configuration.";
  const getCsrfToken = () => {
    if (typeof document === "undefined") return null;
    return document.head.querySelector('meta[name="csrf-token"]')?.content;
  };
  const withCsrf = (payload) => {
    const token = getCsrfToken();
    return token ? { ...payload, _token: token } : payload;
  };
  const products = answers?.products || [];
  const quoteAddOns = answers?.addOns || {};
  const quoteAddOnItems = Array.isArray(quoteAddOns?.items) ? quoteAddOns.items : [];
  const derivedFlueType = quoteAddOns?.derived?.flueType;
  const bathroomsLabel = answers?.inputs?.bathrooms || answers?.answers?.raw?.bathrooms?.label || answers?.bathrooms?.label || null;
  const [activeQuote, setActiveQuote] = useState(null);
  const [detailsQuote, setDetailsQuote] = useState(null);
  const [selectedPower, setSelectedPower] = useState("25");
  const [visibleCount, setVisibleCount] = useState(3);
  const [showInstallTimeInfo, setShowInstallTimeInfo] = useState(false);
  const [showGasSafeInfo, setShowGasSafeInfo] = useState(false);
  const [showNextDayInfo, setShowNextDayInfo] = useState(false);
  const [showWarrantyInfo, setShowWarrantyInfo] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [openCompatibilityTip, setOpenCompatibilityTip] = useState(null);
  const mobileCarouselRef = useRef(null);
  const [productDetails, setProductDetails] = useState({});
  const calculatePrice = (product) => {
    if (product.pricing?.total) return product.pricing.total;
    const base = parseFloat(product.pricing?.base || 0);
    const margin = parseFloat(product.pricing?.marginApplied || 0);
    const addons = parseFloat(product.pricing?.addOnsTotal || 0);
    return base + margin + addons;
  };
  const getTierLabel = (index) => {
    if (index === 0) return "Essential";
    if (index === 1) return "Most popular";
    if (index === 2) return "Premium";
    return "";
  };
  const getConfidenceLine = (index) => {
    if (index === 0) return "Great value with trusted essentials";
    if (index === 1) return "Balanced performance for most homes";
    if (index === 2) return "Maximum comfort and longer-term cover";
    return "Matched to your property answers";
  };
  const getBestFor = (index) => {
    if (index === 0) return "Value-first homeowners";
    if (index === 1) return "Most household setups";
    if (index === 2) return "Premium features and longer cover";
    return "Your selected property profile";
  };
  const getResultsContextLine = () => {
    const raw = String(bathroomsLabel || "").trim();
    if (!raw) return "Results for your home";
    const match = raw.match(/(\d+(?:\.\d+)?\+?)/);
    if (match?.[1]) return `Results for your ${match[1]}-bathroom home`;
    return "Results for your home";
  };
  const formatCurrency = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return null;
    return `£${amount.toLocaleString()}`;
  };
  const selectedExtras = [
    ...derivedFlueType ? [
      {
        label: "Flue type",
        value: String(derivedFlueType).charAt(0).toUpperCase() + String(derivedFlueType).slice(1)
      }
    ] : [],
    ...quoteAddOnItems.map((item) => {
      const qty = Number(item?.qty || 0);
      const unitPrice = Number(item?.unitPrice ?? item?.unit_price ?? 0);
      const total = Number(item?.total ?? 0);
      const quantityText = qty > 0 ? `${qty} × ${formatCurrency(unitPrice) || "£0"}` : null;
      return {
        label: item?.label || item?.key || "Selected extra",
        value: quantityText || "Included",
        totalText: total > 0 ? formatCurrency(total) : "Included"
      };
    })
  ];
  const getBrandLogo = (brandName) => {
    const b = String(brandName || "").toLowerCase();
    if (b.includes("worcester"))
      return "/images/brands/worcester-bosch.svg";
    if (b.includes("ideal")) return "/images/idealheating.png";
    if (b.includes("vaillant")) return "/images/brands/vaillant.svg";
    if (b.includes("viessmann")) return "/images/brands/viessmann.svg";
    if (b.includes("baxi")) return "/images/brands/baxi.svg";
    if (b.includes("alpha")) return "/images/brands/alpha.svg";
    if (b.includes("glow")) return "/images/brands/glow-worm.svg";
    if (b.includes("vokera")) return "/images/brands/vokera.svg";
    if (b.includes("intergas")) return "/images/brands/intergas.svg";
    if (b.includes("atag")) return "/images/brands/atag.svg";
    return null;
  };
  const visibleProducts = products.slice(0, visibleCount);
  useEffect(() => {
    if (activeCardIndex >= visibleProducts.length) {
      setActiveCardIndex(Math.max(0, visibleProducts.length - 1));
    }
  }, [activeCardIndex, visibleProducts.length]);
  const updateActiveCardFromScroll = () => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    const cards2 = Array.from(
      container.querySelectorAll("[data-card-index]")
    );
    if (!cards2.length) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let nearestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;
    cards2.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestIndex = idx;
      }
    });
    setActiveCardIndex(nearestIndex);
  };
  const scrollToProductCard = (index) => {
    const el = document.getElementById(`quote-product-card-${index}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveCardIndex(index);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 px-4 py-8 md:px-6 md:py-10 overflow-hidden quote-page-bg", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto mb-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-stretch", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary", children: [
          /* @__PURE__ */ jsx(FiStar, { className: "h-3.5 w-3.5" }),
          "Personalised results"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 leading-tight", children: "Boiler options matched to your home" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed", children: "Fixed-price packages based on your survey answers." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700", children: getResultsContextLine() }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800", children: [
            /* @__PURE__ */ jsx(FiCheck, { className: "h-3.5 w-3.5" }),
            "Installation included"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-1 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Stay in touch on WhatsApp throughout the process." }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://wa.me/447454796398",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100",
              children: "WhatsApp 24/7"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-slate-200 bg-slate-50 p-3 group flex items-center justify-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/images/gas%20safe%20logo%20mega.png",
                alt: "Gas Safe Register",
                className: "h-6 w-auto object-contain",
                loading: "lazy",
                onError: (e) => {
                  e.currentTarget.src = "/images/511-5113277-gas-safe-register-logo-symbol-gas-safe-logo.png";
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "min-w-0 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-600 font-semibold", children: [
              "Gas Safe Registered",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Gas Safe verification details",
                  onClick: () => setShowGasSafeInfo(
                    (prev) => !prev
                  ),
                  className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700",
                  children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-center text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${showGasSafeInfo ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`,
              children: [
                "Verify our registration on the official Gas Safe Register using business registration number ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: "636354" }),
                ".",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://www.gassaferegister.co.uk/find-an-engineer-or-check-the-register/",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2",
                    children: "Check the register"
                  }
                ),
                "."
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-slate-200 bg-slate-50 p-3 group", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-semibold", children: [
            "Estimated install time",
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": "Estimated install time details",
                onClick: () => setShowInstallTimeInfo(
                  (prev) => !prev
                ),
                className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700",
                children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FiClock, { className: "text-primary" }),
            "1 day typical"
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${showInstallTimeInfo ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`,
              children: "A standard boiler replacement is usually completed in one day. More complex installations, system upgrades, or additional heating works may require extra time."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-emerald-200 bg-gradient-to-r from-white to-emerald-50 p-3 group", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wider text-emerald-800 font-semibold", children: "Delivery priority" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-semibold text-slate-900 leading-snug", children: "Next day installation when ordered before 3pm" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Delivery priority terms",
              onClick: () => setShowNextDayInfo((prev) => !prev),
              className: "mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900",
              children: [
                /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" }),
                "See terms"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${showNextDayInfo ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`,
              children: [
                "Next-day order slots apply to standard, in-stock products confirmed and paid before 3:00pm Monday to Friday. Subject to final survey checks, engineer availability, postcode coverage, and supplier cut-off times. Excludes weekends, bank holidays, special-order items, and complex upgrade works. Installation dates may be adjusted for safety, access, weather, or third-party supply delays.",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/terms-conditions#next-day",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "mt-2 inline-block font-semibold text-emerald-700 underline underline-offset-2",
                    children: "See full next-day installation terms"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-slate-200 bg-slate-50 p-3 group", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-900 font-semibold leading-snug", children: [
            "Warranty & workmanship cover",
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": "Warranty cover details",
                onClick: () => setShowWarrantyInfo((prev) => !prev),
                className: "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700",
                children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `quote-solid-popover absolute left-4 right-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg transition-opacity ${showWarrantyInfo ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`,
              children: "All packages include at least a 5-year manufacturer-backed warranty. We also provide 12 months workmanship cover to support the quality of our installation and give you added peace of mind."
            }
          )
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden", children: visibleProducts.map((product, index) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => scrollToProductCard(index),
          className: `shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeCardIndex === index ? "border-primary/30 bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-700"}`,
          children: getTierLabel(index) || `Option ${index + 1}`
        },
        `switch-${product.id || index}`
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm lg:hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => scrollToProductCard(Math.max(0, activeCardIndex - 1)),
            disabled: activeCardIndex <= 0,
            className: "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40",
            children: [
              /* @__PURE__ */ jsx("span", { className: "-ml-0.5", children: "‹" }),
              "Prev"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900 tracking-wide", children: visibleProducts.length ? `${activeCardIndex + 1} / ${visibleProducts.length}` : "0 / 0" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500", children: "Swipe or tap next" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => scrollToProductCard(
              Math.min(visibleProducts.length - 1, activeCardIndex + 1)
            ),
            disabled: activeCardIndex >= visibleProducts.length - 1,
            className: "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40",
            children: [
              "Next",
              /* @__PURE__ */ jsx("span", { className: "-mr-0.5", children: "›" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: mobileCarouselRef,
          onScroll: updateActiveCardFromScroll,
          className: "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible",
          children: visibleProducts.map((product, index) => {
            const finalPrice = calculatePrice(product);
            const tierLabel = getTierLabel(index);
            const confidenceLine = getConfidenceLine(index);
            const bestFor = getBestFor(index);
            const brandLogo = getBrandLogo(product.brand);
            const cardKey = product.id || index;
            const remainingIncludes = Array.isArray(product.includes) ? product.includes.slice(2) : [];
            return /* @__PURE__ */ jsxs(
              "div",
              {
                id: `quote-product-card-${index}`,
                "data-card-index": index,
                className: "relative min-w-[88%] snap-center rounded-3xl bg-slate-50 shadow-[0_16px_40px_rgba(15,23,42,0.10)] overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.16)] hover:-translate-y-1 sm:min-w-[72%] lg:min-w-0",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-secondary" }),
                  /* @__PURE__ */ jsx("div", { className: "h-28 bg-slate-50 relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "relative p-6 flex justify-between items-start", children: [
                    tierLabel && /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm border border-slate-200", children: /* @__PURE__ */ jsx("span", { className: "text-[14px] font-semibold tracking-wide", children: tierLabel }) }),
                    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("span", { className: "text-[14px] font-bold uppercase tracking-wider text-slate-600", children: [
                      product.kw,
                      " kW"
                    ] }) })
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center -mt-16 relative z-10 px-6", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-10 bg-gradient-to-r from-primary/25 to-secondary/20 blur-2xl" }),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.images?.[0],
                        alt: `${product.brand} ${product.model}`,
                        className: "h-44 object-contain drop-shadow-2xl",
                        onError: (e) => {
                          e.target.src = "/images/ideal-20logic.png";
                        }
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "px-7 pb-7", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-slate-500 font-semibold", children: product.brand }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-dark", children: [
                      product.model,
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold uppercase tracking-wider text-dark/70", children: [
                        product.kw,
                        "kW"
                      ] })
                    ] }) }),
                    brandLogo && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 inline-flex items-center", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: brandLogo,
                          alt: `${product.brand} logo`,
                          className: "h-5 w-auto object-contain",
                          loading: "lazy",
                          onError: (e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = "inline";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "hidden text-xs font-semibold text-slate-600",
                          style: { display: "none" },
                          children: product.brand
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600 leading-relaxed", children: confidenceLine }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 font-semibold", children: "Best for" }),
                        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-semibold text-slate-800", children: bestFor })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 font-semibold", children: "Warranty cover" }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-slate-800", children: [
                          product.warrantyYears,
                          " years included"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(FiShield, { className: "text-primary" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("div", { className: "font-semibold text-dark", children: [
                          product.warrantyYears,
                          " Year Warranty"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "Included in price" })
                      ] })
                    ] }),
                    Array.isArray(product.includes) && product.includes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "relative mt-4 flex flex-wrap items-center gap-2", children: [
                      product.includes.slice(0, 2).map((item, i) => /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: "inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700",
                          children: [
                            /* @__PURE__ */ jsx(FiCheck, { className: "h-3.5 w-3.5 text-primary" }),
                            /* @__PURE__ */ jsx("span", { className: "truncate max-w-[220px]", children: item })
                          ]
                        },
                        `${product.id}-inc-${i}`
                      )),
                      remainingIncludes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "relative group/moreIncludes", children: [
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            className: "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition",
                            children: [
                              "+",
                              remainingIncludes.length,
                              " more included",
                              /* @__PURE__ */ jsx(
                                FiChevronDown,
                                {
                                  className: "h-3.5 w-3.5 transition-transform group-hover/moreIncludes:rotate-180 group-focus-within/moreIncludes:rotate-180"
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "quote-solid-popover pointer-events-none absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl opacity-0 translate-y-1 transition-all duration-200 group-hover/moreIncludes:pointer-events-auto group-hover/moreIncludes:opacity-100 group-hover/moreIncludes:translate-y-0 group-focus-within/moreIncludes:pointer-events-auto group-focus-within/moreIncludes:opacity-100 group-focus-within/moreIncludes:translate-y-0", children: /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: remainingIncludes.map(
                          (item, moreIndex) => /* @__PURE__ */ jsxs(
                            "div",
                            {
                              className: "flex items-start gap-2 text-xs text-slate-700",
                              children: [
                                /* @__PURE__ */ jsx(FiCheck, { className: "mt-0.5 h-3.5 w-3.5 text-primary flex-shrink-0" }),
                                /* @__PURE__ */ jsx("span", { children: item })
                              ]
                            },
                            `${cardKey}-more-${moreIndex}`
                          )
                        ) }) })
                      ] })
                    ] }),
                    Array.isArray(product.notes) && product.notes.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiInfo, { className: "text-primary" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "font-semibold text-dark", children: "Expert Opinion" }),
                        /* @__PURE__ */ jsx("ul", { className: "mt-1 space-y-1 list-disc list-inside text-sm text-slate-700 leading-relaxed", children: product.notes && product.notes.map(
                          (note, index2) => /* @__PURE__ */ jsx(
                            "li",
                            {
                              children: note
                            },
                            index2
                          )
                        ) })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl bg-slate-50 text-slate-900 p-5 relative overflow-hidden border border-slate-200", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-16 translate-x-16" }),
                      /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 group z-30", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => setActiveQuote({
                              ...product,
                              price: finalPrice,
                              selectedExtras,
                              addOnsTotal: Number(
                                product?.pricing?.addOnsTotal || 0
                              )
                            }),
                            "aria-label": "What's included in my installation",
                            className: "h-8 w-8 rounded-full bg-white cursor-pointer hover:bg-emerald-50 border border-emerald-200 flex items-center justify-center transition",
                            children: /* @__PURE__ */ jsx(AiOutlineQuestion, { className: "h-3 w-3 text-emerald-700 transition-transform group-hover:scale-110" })
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "quote-solid-popover pointer-events-none absolute right-0 mt-2 w-max max-w-[220px] rounded-lg bg-white px-3 py-1.5 text-xs text-dark opacity-0 translate-y-1 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0", children: "What's included in my installation?" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600 flex items-center gap-2", children: "Total Price" }),
                        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
                          /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold tracking-tight", children: [
                            "£",
                            finalPrice.toLocaleString()
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "mb-1 text-xs font-medium uppercase tracking-wide text-slate-500", children: "(inc VAT)" })
                        ] }) }),
                        /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-slate-600", children: "Includes labour, materials, commissioning & certification" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => {
                            setProductDetails(product);
                            setDetailsQuote({
                              id: product.id,
                              // title
                              brand: product.brand,
                              model: product.model,
                              productImages: product.images,
                              kw: product.kw,
                              warrantyYears: product.warrantyYears,
                              // badge / tier
                              tier: tierLabel,
                              badge: tierLabel ? "bg-primary text-white" : "",
                              // pricing (VERY IMPORTANT)
                              price: finalPrice,
                              // extras
                              notes: product.notes,
                              includes: product.includes,
                              selectedExtras,
                              addOnsTotal: Number(
                                product?.pricing?.addOnsTotal || 0
                              )
                            });
                          },
                          className: "w-full rounded-xl border-2 cursor-pointer border-primary/25 hover:border-primary hover:bg-primary/5 active:scale-[0.99] py-3.5 text-primary font-semibold transition-all duration-200 flex items-center justify-center gap-2 group",
                          children: [
                            "See Full Specification",
                            /* @__PURE__ */ jsx(FiChevronRight, { className: "group-hover:translate-x-1 transition-transform" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => router.post(
                            "/book/quote/new/install",
                            withCsrf({
                              boiler_id: product.id,
                              brand: product.brand,
                              model: product.model,
                              includes: product.includes ?? [],
                              images: product.images ?? [],
                              kw: product.kw,
                              warrantyYears: product.warrantyYears,
                              price: finalPrice,
                              power: selectedPower,
                              answers
                            })
                          ),
                          className: "w-full rounded-2xl cursor-pointer hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 active:scale-[0.99] text-white py-3.5 font-semibold shadow-lg transition-all duration-300 group",
                          style: {
                            background: "linear-gradient(90deg, #fb923c 0%, #f97316 100%)",
                            boxShadow: "0 20px 50px rgba(249, 115, 22, 0.30)"
                          },
                          children: [
                            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                              "Continue With This Package",
                              /* @__PURE__ */ jsx(FiChevronRight, { className: "transition-transform group-hover:translate-x-1" })
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-medium text-white/85 mt-0.5", children: "Secure checkout • takes ~2 minutes" })
                          ]
                        }
                      )
                    ] })
                  ] })
                ]
              },
              cardKey
            );
          })
        }
      )
    ] }),
    products.length > 3 && /* @__PURE__ */ jsx(
      "div",
      {
        className: "max-w-7xl mx-auto mt-12 hidden justify-center transition-all duration-300 ease-out lg:flex\n",
        children: visibleCount < products.length ? /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setVisibleCount(
              (prev) => Math.min(prev + 3, products.length)
            ),
            className: "px-8 py-3 rounded-xl border border-primary/20 bg-white cursor-pointer text-primary font-semibold hover:bg-primary/5 transition-all shadow",
            children: "Show more packages"
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setVisibleCount(3),
            className: "px-8 py-3 rounded-xl bg-slate-200 cursor-pointer text-dark font-semibold hover:bg-slate-300 transition-all shadow",
            children: "Show fewer packages"
          }
        )
      }
    ),
    activeQuote && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: `
                        .question-include-sidebar {
                            background: linear-gradient(180deg, #00abdb 0%, #008db6 100%) !important;
                            border-left: 1px solid rgba(255, 255, 255, 0.32) !important;
                        }

                        .question-include-sidebar .sidebar-surface {
                            background: rgba(0, 143, 182, 0.92) !important;
                            border-color: rgba(255, 255, 255, 0.32) !important;
                        }

                        .question-include-sidebar,
                        .question-include-sidebar h1,
                        .question-include-sidebar h2,
                        .question-include-sidebar h3,
                        .question-include-sidebar p,
                        .question-include-sidebar span,
                        .question-include-sidebar div,
                        .question-include-sidebar [class*="text-"] {
                            color: #ffffff !important;
                            -webkit-text-fill-color: #ffffff !important;
                        }

                        .question-include-sidebar [class*="border-slate"],
                        .question-include-sidebar [class*="border-gray"] {
                            border-color: rgba(255, 255, 255, 0.30) !important;
                        }

                        .question-include-sidebar [class*="bg-white"],
                        .question-include-sidebar [class*="bg-slate"],
                        .question-include-sidebar [class*="bg-gray"] {
                            background-color: rgba(255, 255, 255, 0.10) !important;
                            background-image: none !important;
                        }

                        .question-include-sidebar .question-sidebar-close {
                            background: rgba(255, 255, 255, 0.14) !important;
                            border-color: rgba(255, 255, 255, 0.42) !important;
                            color: #ffffff !important;
                            -webkit-text-fill-color: #ffffff !important;
                        }
                    ` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => setActiveQuote(null),
          className: "fixed inset-0 bg-primary/10 backdrop-blur-sm z-40 animate-fadeIn"
        }
      ),
      /* @__PURE__ */ jsx("aside", { className: "question-include-sidebar quote-solid-sidebar fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-2xl animate-slideFromRight", children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "sidebar-surface p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-dark", children: "Full package breakdown" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 mt-1", children: [
              "Everything included in your ",
              activeQuote.brand,
              " ",
              activeQuote.model,
              " installation"
            ] }),
            getBrandLogo(activeQuote.brand) && /* @__PURE__ */ jsxs("div", { className: "sidebar-surface mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: getBrandLogo(activeQuote.brand),
                  alt: `${activeQuote.brand} logo`,
                  className: "h-5 w-auto object-contain",
                  loading: "lazy",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = "inline";
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "hidden text-xs font-semibold text-slate-600",
                  style: { display: "none" },
                  children: activeQuote.brand
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveQuote(null),
              className: "question-sidebar-close h-10 sm:h-10 w-auto min-w-[2.75rem] px-3 rounded-xl cursor-pointer border-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx(FiX, { className: "text-white" }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-white sm:hidden", children: "Close" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 ", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activeQuote.includes?.map(
            (itemString, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "sidebar-surface flex gap-4 items-start p-4 rounded-2xl border border-slate-100 hover:border-primary/40 hover:bg-primary/5 transition-all group",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors font-bold", children: /* @__PURE__ */ jsx(FiCheck, { size: 20 }) }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-dark pt-3 leading-snug flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("span", { children: itemString }),
                    isCompatibilityDependentItem(
                      itemString
                    ) && /* @__PURE__ */ jsxs("span", { className: "relative inline-flex items-center group", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": compatibilityTooltipText,
                          onClick: () => setOpenCompatibilityTip(
                            openCompatibilityTip === i ? null : i
                          ),
                          className: "inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-slate-500",
                          children: /* @__PURE__ */ jsx(FiInfo, { className: "h-3 w-3" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `quote-solid-popover absolute right-0 top-[calc(100%+0.35rem)] z-30 w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-medium leading-relaxed text-slate-700 shadow-lg transition-opacity ${openCompatibilityTip === i ? "opacity-100" : "pointer-events-none opacity-0 group-hover:opacity-100"}`,
                          children: compatibilityTooltipText
                        }
                      )
                    ] })
                  ] }) })
                ]
              },
              i
            )
          ) }),
          Array.isArray(activeQuote.selectedExtras) && activeQuote.selectedExtras.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-900", children: "Carried-over extras from your answers" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2.5", children: activeQuote.selectedExtras.map(
              (extra, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-start justify-between gap-3 text-sm",
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-medium text-slate-800", children: extra.label }),
                      extra.value && /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: extra.value })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-slate-700 whitespace-nowrap", children: extra.totalText || "Included" })
                  ]
                },
                `active-extra-${index}`
              )
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sidebar-surface mt-8 p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 text-slate-900", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-4", children: "Price summary" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-200", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Boiler + installation" }),
                /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                  "£",
                  activeQuote.price?.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-200", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-600", children: [
                  "Warranty (",
                  activeQuote.warrantyYears,
                  " ",
                  "Years)"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Included" })
              ] }),
              Number(activeQuote.addOnsTotal || 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-200", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: "Selected extras" }),
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-800", children: [
                  "£",
                  Number(
                    activeQuote.addOnsTotal
                  ).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Total (inc VAT)" }),
                /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold", children: [
                  "£",
                  activeQuote.price?.toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    detailsQuote && /* @__PURE__ */ jsx(
      DetailsQuoteSidebar,
      {
        detailsQuote,
        onClose: () => setDetailsQuote(null),
        selectedPower,
        answers,
        product: productDetails
      }
    )
  ] });
}
function ServiceResults() {
  const { answers, title } = usePage().props;
  console.log("ServiceResults answers:", answers);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(BlueQuoteSkin, { children: [
      /* @__PURE__ */ jsx(PageHeader, {}),
      /* @__PURE__ */ jsx(QuoteResultsPage, { answers })
    ] })
  ] });
}
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceResults
}, Symbol.toStringTag, { value: "Module" }));
function ComingSoon() {
  const { title } = usePage().props;
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [waveOffset, setWaveOffset] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  useEffect(() => {
    setMounted(true);
    const waveInterval = setInterval(
      () => setWaveOffset((p) => (p + 1) % 360),
      30
    );
    const rotationInterval = setInterval(
      () => setRotationAngle((p) => (p + 0.5) % 360),
      20
    );
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 3e3);
    return () => {
      clearInterval(waveInterval);
      clearInterval(rotationInterval);
      clearInterval(glitchInterval);
    };
  }, []);
  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX / window.innerWidth * 100,
      y: e.clientY / window.innerHeight * 100
    });
  };
  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20
  }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "min-h-screen relative overflow-hidden",
        style: {
          "--primary": "#0067ff",
          "--secondary": "#172a44",
          background: "linear-gradient(135deg, var(--secondary), #0f1f33, var(--secondary))"
        },
        onMouseMove: handleMouseMove,
        children: [
          floatingElements.map((el) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute rounded-full blur-3xl opacity-20",
              style: {
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
                background: "radial-gradient(circle, rgba(0,103,255,0.35) 0%, rgba(0,103,255,0.15) 50%, transparent 100%)",
                animation: `float ${el.duration}s ease-in-out infinite`,
                animationDelay: `${el.delay}s`
              }
            },
            el.id
          )),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "fixed inset-0 pointer-events-none opacity-30 transition-all duration-500",
              style: {
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,103,255,0.35) 0%, transparent 50%)`
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "fixed inset-0 pointer-events-none opacity-10",
              style: {
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)"
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-screen flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative mb-12 flex justify-center", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute w-32 h-32",
                  style: {
                    transform: `rotate(${rotationAngle}deg)`
                  },
                  children: [...Array(8)].map((_, i) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute top-1/2 left-1/2 w-1",
                      style: {
                        height: "120px",
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
                        background: "linear-gradient(to bottom, var(--primary), transparent)",
                        opacity: 0.35
                      }
                    },
                    i
                  ))
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${mounted ? "opacity-60 scale-150" : "opacity-0 scale-0"}`,
                    style: {
                      background: "var(--primary)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `relative p-4 rounded-full border-4 transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-0"}`,
                    style: {
                      background: "linear-gradient(135deg, var(--primary), #004bb8)",
                      borderColor: "var(--primary)"
                    },
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: "/favicon.png",
                        alt: "MD Gas Logo",
                        className: "h-20"
                      }
                    )
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "relative mb-4", children: /* @__PURE__ */ jsx(
              "h1",
              {
                className: `text-7xl md:text-9xl font-black transition-all duration-100 ${glitchActive ? "translate-x-1" : "translate-x-0"}`,
                style: {
                  color: "white",
                  textShadow: glitchActive ? `2px 2px var(--primary), -2px -2px rgba(0,103,255,0.6)` : `4px 4px 20px rgba(0,103,255,0.6)`,
                  fontFamily: "Arial Black, sans-serif"
                },
                children: "NEW BOILER"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "relative h-2 max-w-3xl mx-auto mb-8", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-full h-full",
                preserveAspectRatio: "none",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: `M 0 ${1 + Math.sin(waveOffset * Math.PI / 180)} Q 25 ${0.5 + Math.sin(
                      (waveOffset + 45) * Math.PI / 180
                    )}, 50 ${1 + Math.sin(waveOffset * Math.PI / 180)} T 100 ${1 + Math.sin(waveOffset * Math.PI / 180)}`,
                    stroke: "var(--primary)",
                    strokeWidth: "3",
                    fill: "none"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: `text-5xl md:text-7xl font-bold transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`,
                style: {
                  backgroundImage: "linear-gradient(90deg, var(--primary), #3b82f6, var(--primary))",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  backgroundSize: "200% auto",
                  animation: "shine 3s linear infinite"
                },
                children: "QUOTE"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center justify-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-px transition-all duration-1000 ${mounted ? "w-32" : "w-0"}`,
                  style: { background: "var(--primary)" }
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-2xl tracking-[0.4em] text-white/80", children: "COMING SOON" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-px transition-all duration-1000 ${mounted ? "w-32" : "w-0"}`,
                  style: { background: "var(--primary)" }
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-12 flex gap-3 justify-center", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-3 h-3 rounded-full animate-pulse",
                style: {
                  background: "var(--primary)",
                  animationDelay: `${i * 0.3}s`
                }
              },
              i
            )) })
          ] }) }),
          ["tl", "tr", "bl", "br"].map((pos) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `fixed ${pos.includes("t") ? "top-8" : "bottom-8"} ${pos.includes("l") ? "left-8" : "right-8"} w-20 h-20`,
              style: {
                borderColor: "var(--primary)",
                borderStyle: "solid",
                borderWidth: pos === "tl" ? "2px 0 0 2px" : pos === "tr" ? "2px 2px 0 0" : pos === "bl" ? "0 0 2px 2px" : "0 2px 2px 0",
                opacity: 0.4
              }
            },
            pos
          )),
          /* @__PURE__ */ jsx("style", { children: `
                @keyframes float {
                    0%,100% { transform: translate(0,0); }
                    25% { transform: translate(20px,-20px); }
                    50% { transform: translate(-20px,20px); }
                    75% { transform: translate(20px,10px); }
                }
                @keyframes shine {
                    to { background-position: 200% center; }
                }
            ` })
        ]
      }
    )
  ] });
}
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ComingSoon
}, Symbol.toStringTag, { value: "Module" }));
function Dashboard() {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Dashboard" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: "You're logged in!" }) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-emerald-600 text-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-wide text-emerald-100", children: "Scheduling" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold", children: "Control slots, gaps, cutoffs, and blackouts." }),
            /* @__PURE__ */ jsx("div", { className: "text-emerald-50 text-sm", children: "Manage availability rules and mark blackout days." }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: route("admin.scheduling.index"),
                className: "inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50",
                children: [
                  "Open Scheduling",
                  /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "→" })
                ]
              }
            ) })
          ] }) })
        ] }) }) })
      ]
    }
  );
}
const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn$2(
        "bg-card text-card-foreground flex flex-col gap-3 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn$2(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn$2("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn$2("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn$2("px-6", className),
      ...props
    }
  );
}
const services = [
  {
    id: "repair",
    title: "Boiler Repair",
    description: "Same‑week slots for Leeds boiler repairs.",
    image: "/images/product_boiler.png",
    highlight: "Same‑week slots",
    href: "/book/quote?service=repair",
    theme: {
      hoverBg: "hover:bg-emerald-50",
      hoverBorder: "hover:border-emerald-400",
      labelBg: "bg-emerald-600",
      rippleColor: "text-emerald-200",
      arrowHoverBg: "group-hover:bg-emerald-600"
    }
  },
  {
    id: "service",
    title: "Boiler Service",
    description: "Gas Safe servicing with clear, upfront pricing.",
    image: "/images/product_boiler.png",
    highlight: "Gas Safe",
    href: "/book/quote?service=service",
    theme: {
      hoverBg: "hover:bg-emerald-50",
      hoverBorder: "hover:border-emerald-400",
      labelBg: "bg-emerald-600",
      rippleColor: "text-emerald-200",
      arrowHoverBg: "group-hover:bg-emerald-600"
    }
  },
  {
    id: "quote",
    title: "Get your fixed-price boiler quote in under 60 seconds",
    description: "",
    priceLine: "From £1,395 inc VAT",
    brands: [
      { name: "Worcester Bosch", logo: "/images/brands/worcester-bosch.svg" },
      { name: "Ideal", logo: "/images/idealheating.png" },
      { name: "& many more...", logo: null }
    ],
    boilerImages: [
      "/assets/productImages/greenstar-boiler.png",
      "/assets/productImages/max-combi-image.png",
      "/assets/productImages/baxi-image.png"
    ],
    specs: [
      "Manufacturer warranties from 5 to 12 years",
      "Magnetic filter + system flush included",
      "Wireless thermostat included"
    ],
    image: "/assets/productImages/greenstar-boiler.png",
    highlight: "Most booked this month",
    href: "/book",
    featured: true,
    theme: {
      hoverBg: "hover:bg-emerald-50",
      hoverBorder: "hover:border-emerald-400",
      labelBg: "bg-emerald-600",
      rippleColor: "text-emerald-200",
      arrowHoverBg: "group-hover:bg-emerald-600"
    }
  },
  {
    id: "powerflush",
    title: "Magnacleanse",
    description: "A gentler system cleanse for radiators and pipework.",
    image: "/images/product_boiler.png",
    highlight: "Cleaner system",
    href: "/book/quote?service=powerflush",
    theme: {
      hoverBg: "hover:bg-emerald-50",
      hoverBorder: "hover:border-emerald-400",
      labelBg: "bg-emerald-600",
      rippleColor: "text-emerald-200",
      arrowHoverBg: "group-hover:bg-emerald-600"
    }
  }
];
function HeroServices() {
  const featuredService = services.find((service) => service.featured);
  const otherServices = services.filter((service) => !service.featured);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    featuredService && /* @__PURE__ */ jsxs(Card, { className: "group relative flex flex-col overflow-hidden rounded-[28px] border border-emerald-200 bg-white p-7 text-center shadow-[0_22px_55px_rgba(15,23,42,0.12)]", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 mx-auto", children: featuredService.highlight }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex flex-col items-center lg:items-start", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "p-0 w-full", children: /* @__PURE__ */ jsx(CardTitle, { className: "w-full text-[24px] font-semibold text-slate-900 text-center lg:text-left", children: featuredService.title }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-0 w-full", children: [
            /* @__PURE__ */ jsx(CardDescription, { className: "text-[14px] leading-relaxed text-slate-600 text-center lg:text-left", children: featuredService.description }),
            featuredService.priceLine && /* @__PURE__ */ jsx(
              Link,
              {
                href: featuredService.href,
                className: "mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[16px] font-bold text-emerald-800 transition hover:bg-emerald-100",
                children: featuredService.priceLine
              }
            ),
            featuredService.brands?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center lg:text-left", children: "Available makes" }),
              /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start", children: featuredService.brands.map((brand) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5",
                  children: [
                    brand.logo ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: brand.logo,
                        alt: brand.name,
                        className: "h-4 w-auto object-contain"
                      }
                    ) : null,
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-700", children: brand.name })
                  ]
                },
                brand.name
              )) })
            ] }),
            featuredService.specs?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-1 text-sm text-slate-600", children: featuredService.specs.map((spec) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-center gap-2 lg:justify-start", children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
              /* @__PURE__ */ jsx("span", { children: spec })
            ] }, spec)) })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: featuredService.href,
              className: "mt-3 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700",
              children: [
                "Get fixed quote",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 text-center lg:text-left", children: "Rated 5.0 on Google • No-obligation quote" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative grid h-56 grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3", children: (featuredService.boilerImages?.length ? featuredService.boilerImages : [featuredService.image]).map((imgSrc, idx) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex items-center justify-center rounded-xl bg-white border border-slate-200 p-2",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: imgSrc,
                alt: `${featuredService.title} ${idx + 1}`,
                className: `h-36 w-full object-contain ${idx === 0 ? "scale-[1.38]" : "scale-125"}`
              }
            )
          },
          `${imgSrc}-${idx}`
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: otherServices.map((service) => /* @__PURE__ */ jsxs(
      Card,
      {
        className: "group relative flex flex-col items-center text-center overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700", children: service.highlight }),
          /* @__PURE__ */ jsx("div", { className: "relative mt-4 flex h-32 w-full items-center justify-center rounded-2xl bg-slate-50", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: service.image,
              alt: service.title,
              className: "max-h-24 object-contain"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 w-full", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-0", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-[18px] font-semibold text-slate-900", children: service.title }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx(CardDescription, { className: "text-[14px] leading-relaxed text-slate-600", children: service.description }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: service.href,
                className: "inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400",
                children: [
                  "Book now",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                ]
              }
            ) })
          ] })
        ]
      },
      service.id
    )) })
  ] });
}
function HeroSection() {
  const scrollToServices = () => {
    const target = document.getElementById("hero-services-grid");
    if (!target) return;
    const top = window.scrollY + target.getBoundingClientRect().top - 24;
    window.scrollTo({ top, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "services",
      className: "relative overflow-hidden py-20 rounded-b-[45px] bg-slate-50 no-auto-dark-surface pt-40",
      children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative mb-12", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-8 left-0 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200 via-emerald-100/40 to-transparent blur-2xl" }),
          /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-center flex flex-col items-center", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-4xl sm:text-[40px] lg:text-[52px] font-semibold tracking-tight text-slate-900", children: [
                /* @__PURE__ */ jsx("span", { className: "uppercase", children: "Boiler, heating & gas services in Leeds & Surrounding" }),
                /* @__PURE__ */ jsx("span", { className: "mt-3 block text-xl sm:text-2xl font-medium text-slate-600", children: "Booking slots are available seven days a week for installations, servicing and repairs." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/book",
                    className: "inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700",
                    children: "Get a fixed quote"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: scrollToServices,
                    className: "inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100",
                    children: "See services below"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mx-auto", children: "Big blue prices? Not here. Local engineers, fixed quotes." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white no-auto-dark-card p-4 sm:p-5 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]", children: [
              /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/images/gas%20safe%20logo%20mega.png",
                    alt: "Gas Safe Register",
                    className: "h-10 w-10"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Gas Safe Register 636354" }),
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-slate-900", children: "Certified local engineers" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 no-auto-dark-card px-3 py-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-900", children: "Order before 3pm" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "Next‑day installs available" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-slate-600", children: "We will contact you with confirmation." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white no-auto-dark-card px-3 py-2.5", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-emerald-600" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Fully insured workmanship" }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Public liability & workmanship protection on every job." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white no-auto-dark-card px-3 py-2.5", children: [
                    /* @__PURE__ */ jsx(BadgeCheck, { className: "h-5 w-5 text-emerald-600" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Approved brand installer" }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-center gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: "/images/idealheating.png",
                            alt: "Ideal Heating",
                            className: "h-6 w-16 object-contain"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Ideal Heating" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white no-auto-dark-card px-3 py-2.5", children: [
                    /* @__PURE__ */ jsx(Clock4, { className: "h-5 w-5 text-emerald-600" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Fast booking" }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "Slots for this week with real‑time availability." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white no-auto-dark-card px-3 py-2.5", children: [
                    /* @__PURE__ */ jsx(PhoneCall, { className: "h-5 w-5 text-emerald-600" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-slate-900", children: "Engineer support" }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: "WhatsApp 24/7 or request a callback." })
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { id: "hero-services-grid", children: /* @__PURE__ */ jsx(HeroServices, {}) }),
        /* @__PURE__ */ jsx(GoogleReview, {})
      ] })
    }
  );
}
const homeTypes = [
  {
    name: "Terrace",
    icon: Home$2,
    tag: "Home type",
    description: "Compact, efficient boilers for Leeds terrace homes."
  },
  {
    name: "Semi-detached",
    icon: Building2,
    tag: "Home type",
    description: "Balanced options for everyday family heating."
  },
  {
    name: "Detached",
    icon: Castle,
    tag: "Home type",
    description: "High-capacity systems for larger Leeds properties."
  },
  {
    name: "Flat",
    icon: Building,
    tag: "Home type",
    description: "Space‑saving installs for flats and apartments."
  }
];
function HomeTypesStrip() {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const scrollByStep = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const step = container.clientWidth / 2;
    const delta = direction === "left" ? -step : step;
    container.scrollBy({
      left: delta,
      behavior: "smooth"
    });
  };
  const handlePrev = () => scrollByStep("left");
  const handleNext = () => scrollByStep("right");
  const onMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = true;
    container.classList.add("cursor-grabbing");
    startX.current = e.clientX;
    startScrollLeft.current = container.scrollLeft;
  };
  const onMouseMove = (e) => {
    const container = scrollRef.current;
    if (!container || !isDragging.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    container.scrollLeft = startScrollLeft.current - dx;
  };
  const endDrag = () => {
    const container = scrollRef.current;
    if (!container) return;
    isDragging.current = false;
    container.classList.remove("cursor-grabbing");
  };
  useEffect(() => {
    const end = () => endDrag();
    window.addEventListener("mouseup", end);
    return () => window.removeEventListener("mouseup", end);
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "bg-white py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 lg:flex lg:items-center lg:gap-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[40%] flex flex-col items-center text-center justify-between gap-10 mb-12 lg:mb-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm font-semibold tracking-wide text-emerald-600", children: "Tailored for Leeds & Surrounding homes" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl", children: "The right boiler for every home in Leeds & Surrounding." }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-xl mx-auto text-sm leading-relaxed text-slate-600", children: "We match your home size, usage and budget with a fixed‑price quote and a clean install." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handlePrev,
            className: "flex h-11 w-11 items-center cursor-pointer justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-900 hover:text-white",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleNext,
            className: "flex h-11 w-11 items-center cursor-pointer justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-900 hover:text-white",
            children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:w-[60%] relative", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollRef,
        className: "\n                                flex gap-6 \n                                overflow-x-auto \n                                scroll-smooth \n                                snap-x snap-mandatory \n                                cursor-grab \n                                no-scrollbar\n                            ",
        onMouseDown,
        onMouseMove,
        onMouseLeave: endDrag,
        children: homeTypes.map((type) => /* @__PURE__ */ jsx(
          "article",
          {
            className: "\n                                        snap-center\n                                        shrink-0\n                                        basis-[85%]\n                                        sm:basis-[70%]\n                                        lg:basis-1/2\n                                        xl:basis-[45%]\n                                    ",
            children: /* @__PURE__ */ jsx("div", { className: "flex h-full relative flex-col items-center text-center justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-50 w-12 text-center h-12 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[8px] font-medium text-emerald-700 leading-2.5", children: type.tag }),
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col items-center gap-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 shrink-0", children: /* @__PURE__ */ jsx(type.icon, { className: "h-6 w-6 text-emerald-700" }) }),
                /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold leading-7 max-w-xs text-slate-900 sm:text-3xl", children: [
                  type.name,
                  " homes"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "max-w-md mx-auto text-sm leading-relaxed text-slate-600", children: type.description })
            ] }) })
          },
          type.name
        ))
      }
    ) }) })
  ] }) });
}
function InstagramFeed() {
  useEffect(() => {
    if (document.getElementById("EmbedSocialHashtagScript")) return;
    const script = document.createElement("script");
    script.id = "EmbedSocialHashtagScript";
    script.async = true;
    script.src = "https://embedsocial.com/cdn/ht.js";
    document.head.appendChild(script);
    return () => {
    };
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "bg-white py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center text-center gap-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600", children: "Recent work" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 text-3xl sm:text-4xl font-semibold text-slate-900", children: "Leeds installs, call-outs & behind-the-scenes" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm sm:text-base text-slate-600", children: "Expect everything from installs to fixes and day‑to‑day updates — all real, all local." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-3xl border border-slate-200 bg-white p-4", children: [
      /* @__PURE__ */ jsx("style", { children: `
                        .embedsocial-hashtag .feed-powered-by-es {
                            display: none !important;
                        }
                    ` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "embedsocial-hashtag",
          "data-ref": "98d397d59cef083016e0312428376fe3ae4f8fe1"
        }
      )
    ] })
  ] }) });
}
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Home" }),
    /* @__PURE__ */ jsx("main", { className: "min-h-screen", children: /* @__PURE__ */ jsxs(GuestLayout, { children: [
      /* @__PURE__ */ jsx(HeroSection, {}),
      /* @__PURE__ */ jsx(InstagramFeed, {}),
      /* @__PURE__ */ jsx(HomeTypesStrip, {}),
      /* @__PURE__ */ jsx(ServiceCards, {}),
      /* @__PURE__ */ jsx(WhyChooseUs, {}),
      /* @__PURE__ */ jsx(Faq, {})
    ] }) })
  ] });
}
const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
function OrderSummary() {
  const { title } = usePage().props;
  const [mounted, setMounted] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 8
    }));
    setParticles(newParticles);
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 3e3);
    return () => clearInterval(interval);
  }, []);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  const orderData = {
    id: "ORD-847392",
    date: "Dec 27, 2025",
    time: "2:34 PM",
    items: [
      { name: "Premium Wireless Headphones", qty: 1, price: 299.99 },
      { name: "Smart Watch Series X", qty: 1, price: 449.99 },
      { name: "Leather Laptop Bag", qty: 2, price: 89.99 }
    ],
    subtotal: 929.96,
    tax: 74.4,
    total: 1004.36
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 opacity-40", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0",
          style: {
            background: `
                            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.03) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 60%)
                        `
          }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 pointer-events-none", children: particles.map((p) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bg-black rounded-full",
          style: {
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.15,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`
          }
        },
        p.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "relative min-h-screen flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-16 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-12", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `transition-all duration-1200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative inline-block mb-10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative w-2 h-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black rounded-full" }),
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black rounded-full animate-ping" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium tracking-[0.3em] uppercase text-gray-500", children: "Confirmed" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute bottom-0 left-0 h-px bg-black transition-all duration-1000",
                      style: {
                        width: mounted ? "100%" : "0%"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("h1", { className: "text-8xl font-extralight mb-8 leading-none tracking-tight text-black", children: [
                  "Thank",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "You" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-700 leading-relaxed font-light", children: "Your payment has been processed successfully." }),
                  /* @__PURE__ */ jsx("p", { className: "text-base text-gray-500 leading-relaxed", children: "We've sent a confirmation email with your order details. You'll receive shipping updates as your order moves." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative border border-gray-200 p-10 transition-all duration-1200 delay-200 group hover:border-black ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`,
              onMouseMove: handleMouseMove,
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none",
                    style: {
                      background: `radial-gradient(circle 200px at ${glowPosition.x}px ${glowPosition.y}px, black, transparent)`
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative space-y-6", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2", children: "Order Number" }),
                    /* @__PURE__ */ jsx("div", { className: "text-3xl font-mono font-bold text-black tracking-tight", children: orderData.id })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-200" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2", children: "Date" }),
                      /* @__PURE__ */ jsx("div", { className: "text-base font-medium text-black", children: orderData.date })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2", children: "Time" }),
                      /* @__PURE__ */ jsx("div", { className: "text-base font-medium text-black", children: orderData.time })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: ` pt-5 transition-all duration-1200 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
              children: /* @__PURE__ */ jsxs("p", { className: "text-[13px] uppercase tracking-[0.3em] text-dark/90", children: [
                "Need Help?",
                " ",
                /* @__PURE__ */ jsx("span", { children: " Contact support@store.com " })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 space-y-12", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `transition-all duration-1200 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`,
              children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xs uppercase tracking-[0.3em] text-gray-400 mb-10", children: "Order Summary" }),
                /* @__PURE__ */ jsx("div", { className: "space-y-0 border border-gray-200", children: orderData.items.map((item, idx) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "relative group",
                    onMouseEnter: () => setHoveredItem(idx),
                    onMouseLeave: () => setHoveredItem(null),
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `absolute inset-0 bg-black transition-all duration-500 ${hoveredItem === idx ? "opacity-[0.02]" : "opacity-0"}`
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between p-8 transition-all duration-500", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `text-xl text-black font-light transition-all duration-500 ${hoveredItem === idx ? "translate-x-2" : ""}`,
                              children: item.name
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
                            "Quantity: ",
                            item.qty
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "text-right ml-8", children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-mono font-medium text-black", children: [
                          "$",
                          item.price.toFixed(2)
                        ] }) })
                      ] }),
                      idx < orderData.items.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-200 mx-8" })
                    ]
                  },
                  idx
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `transition-all duration-1200 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`,
              children: /* @__PURE__ */ jsx("div", { className: "bg-black text-white p-12", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-gray-400", children: "Subtotal" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-mono text-base", children: [
                      "$",
                      orderData.subtotal.toFixed(
                        2
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-gray-400", children: "Shipping" }),
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-base", children: "Free" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-gray-400", children: "Tax" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-mono text-base", children: [
                      "$",
                      orderData.tax.toFixed(2)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-white/20" }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end pt-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-extralight", children: "Total Paid" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-6xl font-mono font-bold tracking-tight", children: [
                    "$",
                    orderData.total.toFixed(2)
                  ] })
                ] })
              ] }) })
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("style", { jsx: true, children: `
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    33% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    66% {
                        transform: translateY(10px) translateX(-10px);
                    }
                }
            ` })
    ] })
  ] });
}
const __vite_glob_0_30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderSummary
}, Symbol.toStringTag, { value: "Module" }));
const SECTIONS$1 = [
  { id: "overview", title: "Overview" },
  { id: "who-we-are", title: "1. Who we are" },
  { id: "contacting-us", title: "2. Contacting us" },
  { id: "what-we-collect", title: "3. What information we collect" },
  { id: "how-we-use", title: "4. How we use your information" },
  { id: "sharing", title: "5. Information sharing" },
  { id: "security", title: "6. Data security" },
  { id: "retention", title: "7. Data retention" },
  { id: "rights", title: "8. Your rights" },
  { id: "cookies", title: "9. Cookies" },
  { id: "children", title: "10. Children" },
  { id: "third-party", title: "11. Third-party services" },
  { id: "changes", title: "12. Changes to this policy" },
  { id: "contact", title: "Contact us" }
];
const getActiveIdFromHash$1 = () => {
  if (typeof window !== "undefined" && window.location.hash) {
    return window.location.hash.substring(1);
  }
  return null;
};
function PrivacyPolicyPage() {
  const { props } = usePage();
  const pageTitle2 = props.pageTitle ?? "Privacy Policy";
  const lastUpdated = "28 January 2026";
  const [activeSectionId, setActiveSectionId] = useState(
    getActiveIdFromHash$1()
  );
  useEffect(() => {
    const handleHashChange = () => {
      setActiveSectionId(getActiveIdFromHash$1());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: pageTitle2 }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: pageTitle2 }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-16 pt-28 md:pt-32", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 md:mb-16 mt-6 flex flex-col items-center justify-center md:flex-row md:justify-between md:items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-3xl sm:text-5xl font-extrabold leading-tight tracking-tighter text-center md:text-left", children: [
              "Data ",
              /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Trust" }),
              " ",
              "Policy"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg sm:text-xl w-full max-w-84 text-gray-700 font-light text-center md:text-left", children: "Everything you need to know about your personal data security." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
            "Last updated:",
            /* @__PURE__ */ jsx("br", { className: "md:flex" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: lastUpdated })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-4", children: [
          /* @__PURE__ */ jsxs(
            "nav",
            {
              "aria-label": "Table of contents",
              className: "md:col-span-1",
              children: [
                /* @__PURE__ */ jsx("div", { className: "md:hidden mb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar px-1 pb-2", children: SECTIONS$1.map((s) => {
                    const isActive = s.id === activeSectionId;
                    return /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: `#${s.id}`,
                        className: `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
                                ${isActive ? "bg-primary text-white shadow-sm" : "bg-light-grey/80 text-dark hover:bg-light-grey"}`,
                        children: s.title
                      },
                      s.id
                    );
                  }) }),
                  /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" }),
                  /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "hidden md:block md:sticky md:top-10 self-start", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-50 border border-gray-200 p-5 shadow-md md:max-h-[calc(100vh-4rem)] md:overflow-y-auto", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200", children: "Navigation" }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-base", children: SECTIONS$1.map((s) => {
                    const isActive = s.id === activeSectionId;
                    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: `#${s.id}`,
                        className: `block px-3 py-1.5 transition-all border-l-4
                                    ${isActive ? "border-primary text-primary font-bold" : "border-transparent text-gray-600 hover:text-primary hover:border-secondary/70"}`,
                        children: s.title
                      }
                    ) }, s.id);
                  }) })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("article", { className: "md:col-span-3 space-y-8 md:space-y-12 md:border-l md:border-gray-200 md:pl-8", children: [
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "overview",
                title: "Overview",
                isActive: activeSectionId === "overview",
                children: /* @__PURE__ */ jsxs("p", { children: [
                  "Our priority at ",
                  /* @__PURE__ */ jsx("strong", { children: "MD Gas" }),
                  " is keeping your data secure and treating it with respect. We handle your data fairly and lawfully at all times. This statement explains how we collect, use and store personal data and outlines your rights under UK GDPR."
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "who-we-are",
                title: "1. Who we are",
                isActive: activeSectionId === "who-we-are",
                children: /* @__PURE__ */ jsx("p", { children: "MD Gas is the data controller. We comply with the UK Data Protection Act 2018 and UK GDPR." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "contacting-us",
                title: "2. Contacting us",
                isActive: activeSectionId === "contacting-us",
                children: /* @__PURE__ */ jsx("p", { children: "You can reach us via the details in the **Contact us** section at the bottom of this policy." })
              }
            ),
            /* @__PURE__ */ jsxs(
              PolicyTimelineSection,
              {
                id: "what-we-collect",
                title: "3. What information we collect",
                isActive: activeSectionId === "what-we-collect",
                children: [
                  /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-3 text-gray-700", children: [
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Personal data:" }),
                      " ",
                      "Name, address, email, and phone."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Vulnerability info:" }),
                      " ",
                      "Any information you choose to share so we can accommodate your service safely."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Financial info:" }),
                      " ",
                      "Payment details and finance application status (when using third‑party finance)."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Property info:" }),
                      " ",
                      "Property details and heating system information needed to provide a quote."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Communications:" }),
                      " ",
                      "Messages and chat history for support and service delivery."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-4 border-l-4 border-gray-200 pl-4 text-sm text-gray-500 italic", children: "We do not store complete credit card details; they are processed securely by a PCI DSS compliant third-party payment provider." })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              PolicyTimelineSection,
              {
                id: "how-we-use",
                title: "4. How we use your information",
                isActive: activeSectionId === "how-we-use",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-base text-gray-700", children: "We use data to deliver requested services (installation/repair), provide accurate quotes, manage orders, register products for warranty, process secure payments, improve services, and send marketing only where consent has been given." }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 border-l-4 border-secondary bg-secondary/5 p-4 text-base text-primary rounded-r-lg", children: [
                    /* @__PURE__ */ jsx("strong", { children: "Legal Basis:" }),
                    " Our primary legal basis for processing is the performance of a contract and legitimate interests."
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "sharing",
                title: "5. Information sharing",
                isActive: activeSectionId === "sharing",
                children: /* @__PURE__ */ jsx("p", { children: "We do not sell or rent your data. Sharing occurs only with trusted providers strictly as required to fulfil services or legal duties." })
              }
            ),
            /* @__PURE__ */ jsxs(
              PolicyTimelineSection,
              {
                id: "security",
                title: "6. Data security",
                isActive: activeSectionId === "security",
                children: [
                  /* @__PURE__ */ jsx("p", { children: "We maintain robust technical and organisational security measures including encryption, access controls, and staff training." }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 border-l-4 border-yellow-500 bg-yellow-50 p-4 text-base text-yellow-800 rounded-r-lg", children: [
                    /* @__PURE__ */ jsx("strong", { children: "Security Note:" }),
                    " If you suspect a security issue, contact our DPO immediately."
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              PolicyTimelineSection,
              {
                id: "retention",
                title: "7. Data retention",
                isActive: activeSectionId === "retention",
                children: [
                  /* @__PURE__ */ jsx("p", { children: "Data is only kept as long as necessary." }),
                  /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-gray-700", children: [
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Service records:" }),
                      " ",
                      "up to 6 years."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Financial records:" }),
                      " ",
                      "up to 7 years."
                    ] }),
                    /* @__PURE__ */ jsxs("li", { children: [
                      /* @__PURE__ */ jsx("strong", { className: "text-primary", children: "Usage data:" }),
                      " ",
                      "12–24 months."
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "rights",
                title: "8. Your rights",
                isActive: activeSectionId === "rights",
                children: /* @__PURE__ */ jsx("p", { children: "Under GDPR, you have rights to access, correct, erase, restrict, port, and object to processing of your data." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "cookies",
                title: "9. Cookies",
                isActive: activeSectionId === "cookies",
                children: /* @__PURE__ */ jsx("p", { children: "We use cookies for functionality and basic analytics. You can control cookies through your browser settings." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "children",
                title: "10. Children",
                isActive: activeSectionId === "children",
                children: /* @__PURE__ */ jsx("p", { children: "Our services are not designed for children under 16." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "third-party",
                title: "11. Third-party services",
                isActive: activeSectionId === "third-party",
                children: /* @__PURE__ */ jsx("p", { children: "We are not responsible for third‑party privacy practices." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "changes",
                title: "12. Changes to this policy",
                isActive: activeSectionId === "changes",
                children: /* @__PURE__ */ jsx("p", { children: "This policy is reviewed annually or as required by law." })
              }
            ),
            /* @__PURE__ */ jsx(
              PolicyTimelineSection,
              {
                id: "contact",
                title: "Contact us",
                isContact: true,
                isActive: activeSectionId === "contact",
                children: /* @__PURE__ */ jsxs("div", { className: "mt-4 p-5 rounded-lg border border-primary/60 bg-primary/5 space-y-3", children: [
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Contact:" }),
                    " WhatsApp chat or request an engineer callback."
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Email:" }),
                    " info@mdgasleeds.co.uk"
                  ] })
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const PolicyTimelineSection = ({
  id,
  title,
  children,
  isContact = false,
  isActive = false
}) => /* @__PURE__ */ jsxs("section", { id, className: "relative", children: [
  /* @__PURE__ */ jsx(
    "div",
    {
      className: `hidden md:block absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 ${isActive ? "bg-primary border-secondary/60" : "bg-white border-gray-300"}`
    }
  ),
  /* @__PURE__ */ jsx(
    "h3",
    {
      className: `text-xl sm:text-2xl font-extrabold mb-4 ${isContact || isActive ? "text-primary" : "text-gray-900"}`,
      children: title
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "space-y-4 text-base text-gray-700 leading-relaxed", children })
] });
const __vite_glob_0_31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicyPage
}, Symbol.toStringTag, { value: "Module" }));
function DangerButton({
  className = "",
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: `inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 ${disabled && "opacity-25"} ` + className,
      disabled,
      children
    }
  );
}
function Modal({
  children,
  show = false,
  maxWidth = "2xl",
  closeable = true,
  onClose = () => {
  }
}) {
  const close = () => {
    if (closeable) {
      onClose();
    }
  };
  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl"
  }[maxWidth];
  return /* @__PURE__ */ jsx(Transition, { show, leave: "duration-200", children: /* @__PURE__ */ jsxs(
    Dialog,
    {
      as: "div",
      id: "modal",
      className: "fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0",
      onClose: close,
      children: [
        /* @__PURE__ */ jsx(
          TransitionChild,
          {
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gray-500/75" })
          }
        ),
        /* @__PURE__ */ jsx(
          TransitionChild,
          {
            enter: "ease-out duration-300",
            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            enterTo: "opacity-100 translate-y-0 sm:scale-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
            children: /* @__PURE__ */ jsx(
              DialogPanel,
              {
                className: `mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`,
                children
              }
            )
          }
        )
      ]
    }
  ) });
}
function SecondaryButton({
  type = "button",
  className = "",
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      type,
      className: `inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${disabled && "opacity-25"} ` + className,
      disabled,
      children
    }
  );
}
function DeleteUserForm({ className = "" }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors
  } = useForm({
    password: ""
  });
  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current.focus(),
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };
  return /* @__PURE__ */ jsxs("section", { className: `space-y-6 ${className}`, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Delete Account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain." })
    ] }),
    /* @__PURE__ */ jsx(DangerButton, { onClick: confirmUserDeletion, children: "Delete Account" }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingUserDeletion, onClose: closeModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: deleteUser, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Are you sure you want to delete your account?" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password",
            value: "Password",
            className: "sr-only"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            type: "password",
            name: "password",
            ref: passwordInput,
            value: data.password,
            onChange: (e) => setData("password", e.target.value),
            className: "mt-1 block w-3/4",
            isFocused: true,
            placeholder: "Password"
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(DangerButton, { className: "ms-3", disabled: processing, children: "Delete Account" })
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DeleteUserForm
}, Symbol.toStringTag, { value: "Module" }));
function UpdatePasswordForm({ className = "" }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        if (errors2.password) {
          reset("password", "password_confirmation");
          passwordInput.current.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          currentPasswordInput.current.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Update Password" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Ensure your account is using a long, random password to stay secure." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "current_password",
            value: "Current Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "current_password",
            ref: currentPasswordInput,
            value: data.current_password,
            onChange: (e) => setData("current_password", e.target.value),
            type: "password",
            className: "mt-1 block w-full",
            autoComplete: "current-password"
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.current_password,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "New Password" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password",
            ref: passwordInput,
            value: data.password,
            onChange: (e) => setData("password", e.target.value),
            type: "password",
            className: "mt-1 block w-full",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          InputLabel,
          {
            htmlFor: "password_confirmation",
            value: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "password_confirmation",
            value: data.password_confirmation,
            onChange: (e) => setData("password_confirmation", e.target.value),
            type: "password",
            className: "mt-1 block w-full",
            autoComplete: "new-password"
          }
        ),
        /* @__PURE__ */ jsx(
          InputError,
          {
            message: errors.password_confirmation,
            className: "mt-2"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Save" }),
        /* @__PURE__ */ jsx(
          Transition,
          {
            show: recentlySuccessful,
            enter: "transition ease-in-out",
            enterFrom: "opacity-0",
            leave: "transition ease-in-out",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Saved." })
          }
        )
      ] })
    ] })
  ] });
}
const __vite_glob_0_34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UpdatePasswordForm
}, Symbol.toStringTag, { value: "Module" }));
function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = ""
}) {
  const user = usePage().props.auth.user;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Profile Information" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Update your account's profile information and email address." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "name",
            className: "mt-1 block w-full",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            required: true,
            isFocused: true,
            autoComplete: "name"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "email",
            type: "email",
            className: "mt-1 block w-full",
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            required: true,
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.email })
      ] }),
      mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-800", children: [
          "Your email address is unverified.",
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("verification.send"),
              method: "post",
              as: "button",
              className: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
              children: "Click here to re-send the verification email."
            }
          )
        ] }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-medium text-green-600", children: "A new verification link has been sent to your email address." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Save" }),
        /* @__PURE__ */ jsx(
          Transition,
          {
            show: recentlySuccessful,
            enter: "transition ease-in-out",
            enterFrom: "opacity-0",
            leave: "transition ease-in-out",
            leaveTo: "opacity-0",
            children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Saved." })
          }
        )
      ] })
    ] })
  ] });
}
const __vite_glob_0_35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UpdateProfileInformation
}, Symbol.toStringTag, { value: "Module" }));
function Edit({ mustVerifyEmail, status }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Profile" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Profile" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(
            UpdateProfileInformation,
            {
              mustVerifyEmail,
              status,
              className: "max-w-xl"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(DeleteUserForm, { className: "max-w-xl" }) })
        ] }) })
      ]
    }
  );
}
const __vite_glob_0_32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit
}, Symbol.toStringTag, { value: "Module" }));
function Quotation() {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "New Quotation Management" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "New Quotation Management" }),
        /* @__PURE__ */ jsx("div", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-white shadow-sm sm:rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-gray-900", children: "New quotation Management page" }) }) }) })
      ]
    }
  );
}
const __vite_glob_0_36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Quotation
}, Symbol.toStringTag, { value: "Module" }));
function NewBoilerQuoteCta() {
  return /* @__PURE__ */ jsx("section", { className: "mt-10 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 ring-1 ring-white/20", children: "FAST QUOTE" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight", children: "Get a new boiler quote in 60 secs from £1395 (24kw)" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-blue-100", children: "Instant online price, no pressure, and clear options." })
    ] }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "/book/quote/new",
        className: "inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-700",
        children: "Get New Boiler Quote"
      }
    )
  ] }) });
}
const generatedBrands = ["Ideal", "Vaillant", "Worcester"];
const generatedIssueLibrary = [
  "boiler-losing-pressure",
  "boiler-pressure-too-high",
  "boiler-ignition-lockout",
  "boiler-fan-fault",
  "boiler-kettling-noise",
  "boiler-ticking-noise",
  "boiler-no-hot-water",
  "radiators-not-heating",
  "boiler-resetting",
  "boiler-short-cycling",
  "frozen-condensate-pipe",
  "thermostat-not-responding",
  "pilot-or-flame-sensing-fault",
  "boiler-leak-near-case",
  "hot-water-temperature-fluctuating",
  "boiler-overheating-warning",
  "boiler-pressure-drops-overnight",
  "boiler-pressure-rises-when-hot",
  "boiler-noisy-pump-symptoms",
  "boiler-stops-during-hot-water",
  "boiler-cycles-every-few-minutes",
  "boiler-lockout-in-cold-weather",
  "one-radiator-not-heating",
  "all-radiators-lukewarm",
  "zone-valve-not-switching",
  "programmer-not-following-schedule",
  "heating-not-reaching-setpoint",
  "prv-discharge-pipe-dripping",
  "boiler-condensate-backup",
  "boiler-magnetic-filter-sludge-signs"
];
const brandFaultCodes = {
  ideal: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f9", "l2", "l5", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "0"],
  vaillant: ["f22", "f23", "f24", "f25", "f26", "f27", "f28", "f29", "f32", "f49", "f54", "f61", "f62", "f64", "f65", "f67", "f68", "f70", "f71", "f72", "f73", "f74", "f75", "f76", "f77", "f83"],
  worcester: ["ea", "c6", "c7", "a1", "e9", "d1", "d5", "227", "229", "232", "233", "286", "295", "296", "297", "298", "1017", "1021"]
};
const brandModels = {
  ideal: ["logic-combi", "logic-plus", "logic-max", "vogue-max", "independent-c", "esprit-eco", "mexi-he", "icos", "mini-c24", "isar-he", "exclusive-2", "instinct-combi"],
  vaillant: ["ecotec-pro", "ecotec-plus", "ecotec-exclusive", "ecofit-pure", "turbomax", "atmomax", "ecotec-plus-825", "ecotec-plus-832", "ecotec-plus-837", "ecotec-pro-28", "ecotec-pro-30", "ecotec-plus-630"],
  worcester: ["greenstar-25i", "greenstar-30i", "greenstar-4000", "greenstar-8000", "greenstar-cdi", "greenstar-ri", "greenstar-heatslave", "greenstar-junior", "greenstar-si", "greenstar-cdi-classic", "greenstar-compact", "greenstar-system"]
};
const homeScenarios = [
  "new-boiler-making-noise",
  "boiler-after-power-cut",
  "boiler-after-radiator-bleed",
  "boiler-after-repressurising",
  "heating-upstairs-not-downstairs",
  "heating-downstairs-not-upstairs",
  "morning-heating-slow-to-start",
  "hot-water-runs-cold-then-hot",
  "boiler-lockout-in-cold-weather",
  "boiler-overheating-warning",
  "boiler-whistling-when-firing",
  "boiler-humming-at-night",
  "pipe-banging-when-heating-on",
  "radiator-cold-at-bottom",
  "radiator-cold-at-top",
  "one-radiator-not-heating",
  "all-radiators-lukewarm",
  "zone-valve-not-switching",
  "programmer-not-following-schedule",
  "boiler-pressure-rises-when-hot",
  "boiler-pressure-drops-overnight",
  "prv-discharge-pipe-dripping",
  "boiler-condensate-backup",
  "boiler-relight-after-gas-work",
  "boiler-noisy-pump-symptoms",
  "boiler-flame-failure-intermittent",
  "boiler-stops-during-hot-water",
  "heating-turns-off-before-temperature",
  "boiler-needs-frequent-top-up",
  "boiler-magnetic-filter-sludge-signs",
  "thermostatic-radiator-valve-stuck",
  "heating-pump-running-constantly",
  "boiler-after-system-flush",
  "new-thermostat-not-controlling-boiler",
  "boiler-cycles-every-few-minutes",
  "boiler-loses-hot-water-at-peak-time",
  "hot-water-delay-at-taps",
  "boiler-freezes-in-loft-pipework",
  "boiler-noise-after-service",
  "boiler-fault-after-long-idle-period",
  "heating-not-reaching-setpoint",
  "boiler-restarts-when-windy",
  "boiler-safety-lockout-explained",
  "boiler-neutraliser-or-condensate-issues",
  "gas-boiler-annual-checklist"
];
const leedsAreas = ["city-centre", "headingley", "chapeltown", "roundhay", "meanwood", "armley", "burley", "horsforth", "guiseley", "otley", "morley", "beeston", "crossgates", "garforth", "rothwell", "pudsey", "farsley", "york-road", "kirkstall", "seacroft", "harehills", "hyde-park", "adel", "alwoodley", "churwell", "east-end-park", "halton", "hunslet", "middleton", "oakwood", "whinmoor", "woodlesford", "yeadon", "pool-in-wharfedale", "shadwell", "wetherby"];
const titleCase$1 = (value) => value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const buildGeneratedArticle = (slug, title, context, category = "general") => ({
  slug,
  title,
  excerpt: `${context} Causes, safe checks, warning signs, and when to book service or repair.`,
  summary: `This guide covers ${context.toLowerCase()} for Leeds homeowners, including symptom pattern checks, escalation thresholds, and what a professional diagnosis typically includes.`,
  causes: [
    "Normal wear in circulation, ignition, sensing, or control components",
    "Pressure or flow instability across the wider heating system",
    "Setup, controls, or system condition issues that need engineer diagnosis"
  ],
  checks: [
    "Record exactly when the fault appears (startup, hot water, heating demand, or weather change)",
    "Check system pressure and control settings safely without removing boiler casing",
    "If the issue repeats, book service or repair rather than repeatedly resetting"
  ],
  dangerSigns: [
    "Recurring lockout codes after reset",
    "Rapid pressure swings or repeated discharge pipe dripping",
    "Persistent combustion/noise symptoms with reduced heating reliability"
  ],
  whatNotToDo: [
    "Do not remove the boiler case or attempt internal gas appliance work",
    "Do not rely on repeated resets as a long-term fix",
    "Do not keep topping up pressure repeatedly without diagnosis"
  ],
  diagnosisPath: [
    "Engineer confirms symptom pattern and appliance fault history",
    "System pressure, circulation, sensors, and controls are tested in sequence",
    "Root cause is confirmed and a targeted service/repair plan is provided"
  ],
  serviceVsRepair: "If the boiler is still operating but inconsistent, service-first is often efficient for full-condition checks. If the fault is persistent and obvious, repair-first can be faster.",
  prevention: [
    "Keep annual servicing consistent",
    "Act early on pressure/noise changes",
    "Maintain inhibitor/water quality and address circulation issues promptly"
  ],
  category,
  faqs: [
    {
      q: "Can this clear on its own?",
      a: "Intermittent symptoms can appear to clear, but recurring patterns usually indicate an underlying issue that should be diagnosed."
    },
    {
      q: "Should I book service or repair first?",
      a: "Service-first gives full-condition context; repair-first is suitable when the same fault keeps returning."
    },
    {
      q: "Is this safe for DIY internal repair?",
      a: "No. Gas appliance diagnostics and internal repairs should be completed by a qualified Gas Safe engineer."
    }
  ]
});
const articles = [];
const pushArticle = (article) => {
  if (!articles.some((existing) => existing.slug === article.slug)) {
    articles.push(article);
  }
};
generatedBrands.forEach((brand) => {
  const brandKey = brand.toLowerCase();
  generatedIssueLibrary.forEach((issue) => {
    pushArticle(
      buildGeneratedArticle(
        `guide-${brandKey}-${issue}`,
        `${brand} ${titleCase$1(issue)}: Causes, Checks and Next Steps`,
        `${brand} ${titleCase$1(issue)}`,
        "brand-issue"
      )
    );
  });
  brandModels[brandKey].forEach((model) => {
    ["boiler-losing-pressure", "boiler-no-hot-water", "boiler-resetting", "boiler-fan-fault", "boiler-kettling-noise", "thermostat-not-responding", "boiler-short-cycling"].forEach((issue) => {
      pushArticle(
        buildGeneratedArticle(
          `guide-${brandKey}-${model}-${issue}`,
          `${brand} ${titleCase$1(model)} ${titleCase$1(issue)} Guide`,
          `${brand} ${titleCase$1(model)} ${titleCase$1(issue)}`,
          "model-issue"
        )
      );
    });
  });
  brandFaultCodes[brandKey].forEach((code) => {
    pushArticle(
      buildGeneratedArticle(
        `guide-${brandKey}-fault-code-${code}`,
        `${brand} Fault Code ${code.toUpperCase()}: Meaning and Next Steps`,
        `${brand} fault code ${code.toUpperCase()}`,
        "fault-code"
      )
    );
    ["reset-guide", "causes", "when-to-call-engineer"].forEach((angle) => {
      pushArticle(
        buildGeneratedArticle(
          `guide-${brandKey}-fault-code-${code}-${angle}`,
          `${brand} Fault Code ${code.toUpperCase()} ${titleCase$1(angle)} Guide`,
          `${brand} fault code ${code.toUpperCase()} ${titleCase$1(angle)}`,
          "fault-code-support"
        )
      );
    });
  });
});
homeScenarios.forEach((scenario) => {
  pushArticle(
    buildGeneratedArticle(
      `guide-home-${scenario}`,
      `${titleCase$1(scenario)}: Boiler Advice Guide`,
      titleCase$1(scenario),
      "home-scenario"
    )
  );
});
leedsAreas.forEach((area) => {
  ["boiler-service-advice", "boiler-repair-advice", "boiler-fault-guide"].forEach((intent) => {
    pushArticle(
      buildGeneratedArticle(
        `guide-leeds-${area}-${intent}`,
        `Leeds ${titleCase$1(area)} ${titleCase$1(intent)}: What to Check First`,
        `Leeds ${titleCase$1(area)} ${titleCase$1(intent)}`,
        "location-intent"
      )
    );
  });
});
const generatedAdviceArticles = articles;
const baseAdviceArticles = [
  {
    slug: "boiler-losing-pressure",
    title: "Boiler Losing Pressure: Causes and Next Steps",
    excerpt: "If pressure keeps dropping, small leaks, valve issues, or internal boiler faults are common causes.",
    summary: "A sealed heating system should hold pressure fairly steadily. If you repeatedly top up your boiler, there is usually an underlying fault that needs identifying.",
    causes: [
      "Small leaks on radiator valves, joints, or hidden pipework",
      "Pressure relief valve (PRV) passing water",
      "Internal boiler component or expansion vessel issues"
    ],
    checks: [
      "Check visible radiator valves and pipe joints for moisture",
      "Look for discharge pipe drips outside",
      "Note pressure cold vs after heating cycle"
    ],
    faqs: [
      {
        q: "Can I keep topping up pressure?",
        a: "Topping up repeatedly is a temporary workaround and can hide a worsening fault."
      },
      {
        q: "Should I book service or repair?",
        a: "A service may resolve some issues and can identify whether repair is required. You can also book repair directly."
      }
    ]
  },
  {
    slug: "boiler-pressure-too-high",
    title: "Boiler Pressure Too High: Why It Happens",
    excerpt: "Over-pressurisation often points to a filling loop, expansion vessel, or pressure-control issue.",
    summary: "When pressure climbs well above normal, your system is under extra stress. This should be investigated before it causes repeated lockouts or valve discharge.",
    causes: [
      "Filling loop not fully closed",
      "Expansion vessel charge loss",
      "Pressure relief or control component fault"
    ],
    checks: [
      "Confirm filling loop valves are fully closed",
      "Check gauge readings with heating off and on",
      "Watch for discharge pipe dripping"
    ],
    faqs: [
      {
        q: "Is high pressure dangerous?",
        a: "It can strain parts and trigger protective shutdowns. Repeated high pressure should be diagnosed."
      },
      {
        q: "Will a service help?",
        a: "A service may resolve performance-related issues and helps identify whether a targeted repair is needed."
      }
    ]
  },
  {
    slug: "vaillant-f75-error-code",
    title: "Vaillant F75 Error Code: Common Causes",
    excerpt: "F75 usually means no detectable pressure change when the pump starts.",
    summary: "Vaillant F75 is commonly linked with pressure sensing, pump operation, or low circulation. It often needs engineer-level diagnosis.",
    causes: [
      "Faulty or blocked pressure sensor",
      "Pump performance issue",
      "System leak or low circulation"
    ],
    checks: [
      "Check system pressure on gauge",
      "Listen for pump start behaviour",
      "Look for visible leaks"
    ],
    faqs: [
      { q: "Can I just reset it?", a: "A reset may temporarily clear the lockout, but recurring F75 needs root-cause diagnosis." },
      { q: "Best booking route?", a: "Book a service first for full checks, or book repair directly if you want fault-first handling." }
    ]
  },
  {
    slug: "vaillant-f72-error-code",
    title: "Vaillant F72 Error Code: Sensor Mismatch Guide",
    excerpt: "F72 commonly indicates flow/return thermistor mismatch or circulation-related sensor issues.",
    summary: "This fault is often caused by NTC sensor reading differences, poor flow through the heat exchanger, or wiring/sensor issues.",
    causes: [
      "Flow and return NTC sensor discrepancy",
      "Poor circulation through heat exchanger",
      "Wiring or connector faults"
    ],
    checks: [
      "Check whether code returns after reset",
      "Monitor heating stability and hot water behaviour",
      "Book diagnostics if lockout recurs"
    ],
    faqs: [
      { q: "Is this DIY-fixable?", a: "Not safely in most cases. Sensor and electrical checks should be carried out by a Gas Safe engineer." },
      { q: "Service or repair?", a: "Service can help identify underlying causes; repair is appropriate if fault is already clear." }
    ]
  },
  {
    slug: "ideal-f2-error-code",
    title: "Ideal F2 Error Code: Flame Loss Explained",
    excerpt: "F2 usually indicates flame loss or ignition lockout on Ideal boilers.",
    summary: "Ideal F2 can be linked to combustion, airflow, gas supply, fan, or control faults. Recurring lockout should be assessed professionally.",
    causes: [
      "Ignition/flame sensing fault",
      "Fan or flue airflow problem",
      "Gas supply or gas valve issue"
    ],
    checks: [
      "Check if other gas appliances are operating normally",
      "Look for repeated lockout pattern",
      "Avoid repeated unsafe DIY resets"
    ],
    faqs: [
      { q: "Can a service fix F2?", a: "A service may resolve related performance issues and identify if a specific repair is required." },
      { q: "When to book repair directly?", a: "If F2 is persistent and heating is unreliable, repair booking is often the fastest route." }
    ]
  },
  {
    slug: "worcester-ea-fault-code",
    title: "Worcester EA Fault Code: What It Usually Means",
    excerpt: "EA typically points to ignition/flame detection problems.",
    summary: "Worcester EA is commonly associated with failed ignition or unstable flame detection. A proper combustion and controls check is recommended.",
    causes: [
      "Ignition or flame sensing issue",
      "Gas supply consistency problem",
      "Combustion airflow fault"
    ],
    checks: [
      "Check if code is persistent after reset",
      "Note if issue occurs only on hot water or heating",
      "Arrange professional diagnosis if recurring"
    ],
    faqs: [
      { q: "Is EA serious?", a: "It is a lockout condition and should be diagnosed promptly if it returns." },
      { q: "Service or repair booking?", a: "Both are valid: service for full condition checks, repair for direct fault handling." }
    ]
  },
  {
    slug: "boiler-ticking-noise",
    title: "Boiler Ticking Noise: Normal or Fault?",
    excerpt: "Ticking can be normal expansion, but can also indicate loose parts, trapped air, or scaling.",
    summary: "Some ticking is harmless pipe expansion. Persistent or worsening noise, especially with poor heating, should be checked.",
    causes: [
      "Pipe expansion/contraction",
      "Trapped air in radiators or pipework",
      "Loose components or limescale-related flow noise"
    ],
    checks: [
      "Check if noise only happens at startup",
      "Bleed radiators where needed",
      "Track pressure and heating performance together"
    ],
    faqs: [
      { q: "When is ticking a warning sign?", a: "If noise is louder, continuous, or paired with heating faults or pressure instability." },
      { q: "What should I book?", a: "Book a service first in most cases; book repair directly if fault symptoms are clear and persistent." }
    ]
  },
  {
    slug: "boiler-kettling-noise",
    title: "Boiler Kettling Noise: Why It Happens",
    excerpt: "Kettling often sounds like a whistling kettle and is linked with heat exchanger scaling or poor flow.",
    summary: "Kettling usually indicates restricted flow and local overheating in the heat exchanger. This can reduce efficiency and stress components.",
    causes: [
      "Limescale buildup in heat exchanger",
      "Poor circulation through system",
      "Debris/sludge restriction"
    ],
    checks: [
      "Check system pressure and flow consistency",
      "Note if noise increases under heat demand",
      "Book service to assess water quality and circulation"
    ],
    faqs: [
      { q: "Can inhibitor help?", a: "Inhibitor helps prevention, but existing restriction may still need professional treatment." },
      { q: "Is repair always needed?", a: "Not always. A service may resolve some causes and identify whether repair is required." }
    ]
  },
  {
    slug: "boiler-fan-not-working",
    title: "Boiler Fan Not Working: Signs and Action",
    excerpt: "Fan faults can trigger lockouts due to unsafe combustion airflow conditions.",
    summary: "The fan is safety-critical for combustion airflow. If it fails, the boiler often locks out to prevent unsafe operation.",
    causes: [
      "Fan motor wear/failure",
      "Air pressure proving issue",
      "Control board or wiring fault"
    ],
    checks: [
      "Check for repeated fault codes and lockouts",
      "Do not run repeated unsafe resets",
      "Arrange Gas Safe diagnosis promptly"
    ],
    faqs: [
      { q: "Can I keep using boiler with fan fault?", a: "No. Persistent fan-related lockouts should be professionally assessed." },
      { q: "Service vs repair?", a: "Repair is often appropriate for clear fan faults, though service can still provide full condition checks." }
    ]
  },
  {
    slug: "boiler-no-hot-water",
    title: "Boiler Working But No Hot Water",
    excerpt: "If heating works but hot water fails, diverter, plate exchanger, sensor or controls may be involved.",
    summary: "No hot water with partial boiler function often points to domestic hot water pathway faults rather than total appliance failure.",
    causes: [
      "Diverter valve issue",
      "Plate heat exchanger restriction",
      "Sensor or control fault"
    ],
    checks: [
      "Test heating and hot water separately",
      "Note any fault code on display",
      "Book service or repair based on urgency"
    ],
    faqs: [
      { q: "Could pressure be related?", a: "Yes, low pressure can affect operation on some systems." },
      { q: "Best first booking?", a: "Service may identify broader issues; repair is suitable for urgent fault-first resolution." }
    ]
  },
  {
    slug: "radiators-not-heating-up",
    title: "Radiators Not Heating Up Properly",
    excerpt: "Cold radiators can be caused by airlocks, balancing issues, low pressure, or circulation faults.",
    summary: "Uneven or cold radiators are usually a circulation issue in the wider system, not always the boiler core itself.",
    causes: [
      "Air trapped in radiators",
      "System balancing issues",
      "Low pressure or pump circulation problems"
    ],
    checks: [
      "Bleed affected radiators",
      "Check pressure after bleeding",
      "Compare heat output across rooms"
    ],
    faqs: [
      { q: "Do I need a boiler repair for one cold radiator?", a: "Not always. System balancing or venting may be enough." },
      { q: "When to escalate?", a: "If multiple radiators remain cold after basic checks, book a service or repair visit." }
    ]
  },
  {
    slug: "boiler-overflow-pipe-leaking",
    title: "Boiler Overflow / Discharge Pipe Leaking",
    excerpt: "A leaking discharge pipe often means pressure relief is activating due to overpressure or valve issues.",
    summary: "Water from the discharge pipe is a useful fault clue. It can indicate pressure control faults or a PRV that no longer seals correctly.",
    causes: [
      "Over-pressurised heating system",
      "Pressure relief valve not reseating",
      "Expansion vessel fault causing pressure spikes"
    ],
    checks: [
      "Track when dripping occurs (heating on/off)",
      "Monitor gauge behaviour",
      "Avoid repeated top-up cycles without diagnosis"
    ],
    faqs: [
      { q: "Is this an emergency?", a: "Not always, but persistent discharge should be checked quickly to avoid further faults." },
      { q: "Service first?", a: "Service may identify and sometimes resolve cause; repair may still be required." }
    ]
  },
  {
    slug: "expansion-vessel-fault",
    title: "Expansion Vessel Fault Symptoms",
    excerpt: "Pressure swings and discharge pipe leaks are common signs of an expansion vessel issue.",
    summary: "A failing expansion vessel can cause unstable pressure, frequent top-ups, and stress on safety components.",
    causes: [
      "Loss of vessel charge",
      "Internal diaphragm failure",
      "Long-term pressure cycling wear"
    ],
    checks: [
      "Observe pressure rise during heating",
      "Check for discharge pipe activity",
      "Arrange professional vessel assessment"
    ],
    faqs: [
      { q: "Can inhibitor fix this?", a: "No. This is usually a mechanical pressure-management fault." },
      { q: "Service or repair?", a: "Service can identify the issue; repair is required if vessel or related parts fail." }
    ]
  },
  {
    slug: "filling-loop-left-open",
    title: "Filling Loop Left Open: Pressure Problems",
    excerpt: "An open filling loop can cause gradual over-pressurisation and repeated discharge.",
    summary: "If system pressure keeps climbing unexpectedly, check filling loop valves first. Small valve seepage can mimic deeper faults.",
    causes: [
      "Valves not fully closed",
      "Valve seat wear allowing seepage",
      "Incorrect repressurisation process"
    ],
    checks: [
      "Confirm both loop valves are fully shut",
      "Recheck pressure trend over 24 hours",
      "Book service if pressure still rises"
    ],
    faqs: [
      { q: "Could this damage the boiler?", a: "Persistent overpressure can stress components and trigger safety discharge." },
      { q: "Should I book repair immediately?", a: "If pressure remains unstable after loop checks, repair booking is sensible." }
    ]
  },
  {
    slug: "frozen-condensate-pipe",
    title: "Frozen Condensate Pipe: Boiler Not Firing",
    excerpt: "In cold weather, frozen condensate can cause lockouts and no-heat symptoms.",
    summary: "A frozen condensate line can stop normal boiler operation, especially during winter cold spells.",
    causes: [
      "External condensate run freezing",
      "Insufficient insulation on pipework",
      "Poor route/fall for condensate line"
    ],
    checks: [
      "Inspect external condensate section",
      "Look for lockout code recurrence",
      "Book service for route/insulation improvement advice"
    ],
    faqs: [
      { q: "Will this keep happening?", a: "It can recur if pipe routing and insulation are not improved." },
      { q: "Service or repair?", a: "Service can address setup/prevention; repair may be needed if component damage occurred." }
    ]
  },
  {
    slug: "boiler-ignition-lockout",
    title: "Boiler Ignition Lockout: What to Do",
    excerpt: "Ignition lockout means the boiler failed to light safely and has shut down for protection.",
    summary: "Lockouts are protective. If the issue keeps returning after reset, there is usually an ignition, gas, airflow, or control fault.",
    causes: [
      "Ignition electrode/flame sensing issue",
      "Gas supply inconsistency",
      "Fan/airflow proving fault"
    ],
    checks: [
      "Note exact code and pattern",
      "Check if other gas appliances are normal",
      "Book service or repair for full diagnosis"
    ],
    faqs: [
      { q: "Can I keep resetting?", a: "Repeated resets without diagnosis are not recommended." },
      { q: "Best booking path?", a: "Service for broad checks; repair for direct fault-first approach." }
    ]
  },
  {
    slug: "boiler-keeps-needing-reset",
    title: "Boiler Keeps Needing Reset",
    excerpt: "Frequent resets indicate unresolved underlying faults, not a permanent fix.",
    summary: "A healthy boiler should not require regular manual resets. Recurrence points to a persistent safety or control issue.",
    causes: [
      "Intermittent sensor or wiring faults",
      "Combustion or ignition instability",
      "Pressure or circulation issues"
    ],
    checks: [
      "Track how often reset is needed",
      "Record displayed fault code",
      "Arrange professional investigation"
    ],
    faqs: [
      { q: "Does reset mean fixed?", a: "Usually temporary only when the fault condition returns." },
      { q: "Service or repair?", a: "Either can work; service may identify broader condition while repair targets immediate fault." }
    ]
  },
  {
    slug: "boiler-short-cycling",
    title: "Boiler Short Cycling: Causes and Fixes",
    excerpt: "Short cycling means the boiler turns on and off too frequently.",
    summary: "Frequent cycling can reduce efficiency and increase wear. Common causes include flow issues, controls setup, and sensor faults.",
    causes: [
      "Restricted system flow",
      "Thermostat/control setup mismatch",
      "Sensor feedback inconsistencies"
    ],
    checks: [
      "Observe burner run-time pattern",
      "Check radiator heat distribution",
      "Book service to assess setup and system health"
    ],
    faqs: [
      { q: "Can this increase bills?", a: "Yes, short cycling often reduces efficiency and increases component wear." },
      { q: "Is repair always needed?", a: "Not always. Service and controls optimisation may improve behaviour." }
    ]
  },
  {
    slug: "air-in-heating-system",
    title: "Air in Heating System: Symptoms and Action",
    excerpt: "Airlocks can cause gurgling, cold spots, weak circulation and unstable pressure readings.",
    summary: "Trapped air disrupts flow and can mimic boiler faults. Correct venting and system setup checks are important.",
    causes: [
      "Recent radiator bleeding without proper top-up",
      "Minor leaks allowing air ingress",
      "Poor system venting"
    ],
    checks: [
      "Bleed radiators in sequence",
      "Recheck system pressure afterward",
      "Monitor for recurring air symptoms"
    ],
    faqs: [
      { q: "Will bleeding fix everything?", a: "It can help, but recurring air suggests an underlying issue needing diagnosis." },
      { q: "Service useful here?", a: "Yes, service can review full system condition and identify root causes." }
    ]
  },
  {
    slug: "boiler-service-vs-repair",
    title: "Boiler Service vs Boiler Repair: Which One to Book?",
    excerpt: "Service is preventative/condition-focused, repair is fault-focused. Both can be valid first steps.",
    summary: "If your boiler still runs but behaves inconsistently, service is often a strong first option. If there is a clear persistent fault or lockout, repair-first can be faster.",
    causes: [
      "Service booking suits broad checks and maintenance",
      "Repair booking suits known fault symptoms",
      "Hybrid approach often works best: service findings followed by repair if required"
    ],
    checks: [
      "List your main symptom and frequency",
      "Check for any fault code",
      "Choose service-first or repair-first based on urgency"
    ],
    faqs: [
      { q: "Will a service always fix faults?", a: "No. A service may resolve some issues and can identify repair requirements." },
      { q: "Can I skip service and book repair?", a: "Yes, direct repair booking is available if you prefer." }
    ]
  },
  {
    slug: "how-often-service-boiler",
    title: "How Often Should You Service a Boiler?",
    excerpt: "Annual servicing is the standard recommendation for safety, reliability and warranty support.",
    summary: "Regular servicing helps keep performance stable, catches wear early, and supports safer operation over time.",
    causes: [
      "Combustion and safety checks drift over time",
      "System debris and minor faults can build gradually",
      "Warranty and reliability benefits from routine maintenance"
    ],
    checks: [
      "Book annual service reminders",
      "Track pressure/noise trends between visits",
      "Act early on recurring symptoms"
    ],
    faqs: [
      { q: "Can I service less often?", a: "Long gaps increase risk of avoidable faults and reduced efficiency." },
      { q: "What if fault appears before service date?", a: "Book a repair visit or service sooner depending on severity." }
    ]
  },
  {
    slug: "leeds-boiler-service-guide",
    title: "Boiler Service in Leeds: What to Expect",
    excerpt: "What happens during a local boiler service and when it should become a repair visit.",
    summary: "A professional service reviews combustion safety, pressure behaviour, controls, and overall system condition.",
    causes: [
      "Annual safety/performance checks",
      "Early detection of wear and pressure issues",
      "Clear recommendation on whether repair is needed"
    ],
    checks: [
      "Have fault notes/codes ready for engineer",
      "Confirm access to boiler and controls",
      "Discuss symptoms in order of priority"
    ],
    faqs: [
      { q: "Can service become repair on same journey?", a: "Sometimes, depending on fault, parts, and appointment scope." },
      { q: "Why service if I can book repair?", a: "Service offers full-condition context that can prevent repeat issues." }
    ]
  },
  {
    slug: "leeds-boiler-repair-guide",
    title: "Boiler Repair in Leeds: Fault-First Booking Guide",
    excerpt: "Repair visits are fault-focused and suitable for persistent lockouts or clear failures.",
    summary: "If you have a recurring fault code, no hot water, or repeated resets, repair-first booking is often appropriate.",
    causes: [
      "Persistent lockout/fault codes",
      "Loss of heating or hot water",
      "Recurring pressure or circulation failure"
    ],
    checks: [
      "Capture fault code and timing",
      "Note recent pressure/noise changes",
      "Provide model details if available"
    ],
    faqs: [
      { q: "Does repair include full service?", a: "Repair appointments are fault-focused and do not automatically include a full service." },
      { q: "Can I book service instead?", a: "Yes. Service can still be chosen first if you want full-condition checks." }
    ]
  },
  {
    slug: "vaillant-fan-fault",
    title: "Vaillant Fan Fault Symptoms",
    excerpt: "Fan and airflow proving faults can trigger lockouts and unstable combustion behaviour.",
    summary: "If a Vaillant boiler reports fan-related faults or repeatedly fails to light, airflow and fan operation should be professionally checked.",
    causes: [
      "Fan speed/proving anomaly",
      "Air pressure switch/proving chain issue",
      "Flue path resistance or control fault"
    ],
    checks: [
      "Track code recurrence",
      "Avoid repeated unsafe reset loops",
      "Book Gas Safe diagnosis"
    ],
    faqs: [
      { q: "Can weather affect this?", a: "External conditions can influence flue performance in some cases." },
      { q: "Service or repair?", a: "Repair-first is common for clear fan faults; service can still help evaluate whole system condition." }
    ]
  },
  {
    slug: "ideal-low-water-pressure",
    title: "Ideal Low Water Pressure Faults",
    excerpt: "Low pressure on Ideal systems often shows as reduced performance or lockout codes.",
    summary: "Persistent low pressure should be investigated rather than repeatedly topped up.",
    causes: [
      "External system leaks",
      "PRV or expansion vessel issues",
      "Internal boiler pressure-management faults"
    ],
    checks: [
      "Check gauge below normal range",
      "Inspect visible joints and valves",
      "Book service/repair if recurrence continues"
    ],
    faqs: [
      { q: "Is one top-up okay?", a: "Occasional top-up can happen, but frequent top-ups indicate a fault." },
      { q: "Best first booking?", a: "Service-first is common; repair-first is valid for persistent hard faults." }
    ]
  },
  {
    slug: "worcester-c6-c7-faults",
    title: "Worcester C6 / C7 Faults Explained",
    excerpt: "C6/C7 usually relate to fan speed/proving or fan control behaviour.",
    summary: "These faults are typically linked to airflow safety checks and fan response. They should be diagnosed professionally.",
    causes: [
      "Fan speed below expected range",
      "Fan control feedback issue",
      "Airflow proving chain anomaly"
    ],
    checks: [
      "Capture exact code and timing",
      "Check recurrence after reset",
      "Arrange engineer assessment"
    ],
    faqs: [
      { q: "Can I ignore intermittent C6/C7?", a: "Intermittent safety faults can become persistent and should be checked." },
      { q: "Service or repair?", a: "Repair-first is usually suitable for code-specific faults." }
    ]
  },
  {
    slug: "boiler-pressure-guide-1-to-1-5-bar",
    title: "Boiler Pressure Guide: Why 1 to 1.5 Bar Matters",
    excerpt: "Most sealed domestic systems operate best around 1 to 1.5 bar when cold.",
    summary: "Keeping pressure in the normal cold range supports stable circulation and fewer nuisance lockouts.",
    causes: [
      "Pressure below range can reduce circulation",
      "Pressure above range can stress safety components",
      "Frequent fluctuations suggest underlying faults"
    ],
    checks: [
      "Read gauge when system is cold",
      "Compare with reading when heating is active",
      "Investigate repeated deviations"
    ],
    faqs: [
      { q: "Is slight movement normal?", a: "Yes. Minor changes between cold and hot operation are expected." },
      { q: "When should I book?", a: "Book if pressure repeatedly drops below or rises above normal range." }
    ]
  }
];
const TARGET_TOTAL_ADVICE_PAGES = 461;
const mergedAdviceArticles = [...baseAdviceArticles, ...generatedAdviceArticles];
const adviceArticles = mergedAdviceArticles.slice(0, TARGET_TOTAL_ADVICE_PAGES);
const adviceBySlug = Object.fromEntries(
  adviceArticles.map((article) => [article.slug, article])
);
const titleCase = (value = "") => value.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const extractFaultCode = (slug = "") => {
  const match = slug.match(/fault-code-([a-z0-9]+)/i);
  return match ? match[1].toUpperCase() : null;
};
const profileForSlug = (slug = "", article = {}) => {
  const isResetGuide = slug.includes("reset-guide");
  const isFaultCodeGuide = slug.includes("fault-code");
  const code = extractFaultCode(slug);
  const subject = article?.title || titleCase(slug.replace(/^guide-/, ""));
  const resetSteps = [
    "Wait 3 to 5 minutes after lockout so components cool and controls stabilise.",
    "Check system pressure is in your normal range and confirm gas/electrical supply is available.",
    "Use the manufacturer reset procedure once only (button or menu depending on model).",
    "Run hot water or heating demand and observe whether the fault returns.",
    "If the same code returns, stop resetting repeatedly and book an engineer diagnosis."
  ];
  if (isResetGuide || isFaultCodeGuide) {
    return {
      heading: code ? `How to safely handle ${code} before booking` : "How to safely handle this fault before booking",
      steps: resetSteps,
      legalLead: "Resetting is only a temporary user action. Internal diagnostics, combustion checks, gas train work, and component replacement are engineer-only tasks."
    };
  }
  return {
    heading: `Step-by-step checks for ${subject}`,
    steps: [
      "Confirm the exact symptom pattern (startup only, hot-water demand, heating demand, or constant).",
      "Check pressure and controls safely without removing casing or touching internal components.",
      "Look for external clues like discharge pipe dripping, uneven radiator heat, or recurring lockout codes.",
      "Book service for full-condition diagnosis, or repair-first if the same hard fault is repeating."
    ],
    legalLead: "Homeowner checks should stay external and non-invasive. Internal gas appliance work is restricted by law."
  };
};
function AdviceArticlePage() {
  const { props } = usePage();
  const slug = props?.articleSlug;
  const article = adviceBySlug[slug];
  const profile = profileForSlug(slug, article);
  if (!article) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Head, { title: "Boiler Advice" }),
      /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
        /* @__PURE__ */ jsx(Header, { title: "Boiler Advice" }),
        /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold", children: "Advice page not found" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700", children: "This advice page is not available. Browse all guides below." }),
          /* @__PURE__ */ jsx(Link, { href: "/advice/boiler-problems", className: "inline-flex mt-6 rounded-lg bg-primary px-5 py-3 text-white font-semibold", children: "View Boiler Advice Hub" })
        ] }),
        /* @__PURE__ */ jsx(Footer, {})
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: article.title }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: article.title }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsxs("article", { className: "max-w-4xl", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: article.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-gray-600", children: article.excerpt }),
          /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "What this usually means" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-700 leading-7", children: article.summary })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Common causes" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-3 list-disc pl-5 space-y-2 text-gray-700", children: article.causes.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Checks you can do safely" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-3 list-disc pl-5 space-y-2 text-gray-700", children: article.checks.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: profile.heading }),
            /* @__PURE__ */ jsx("ol", { className: "mt-3 list-decimal pl-5 space-y-2 text-gray-700", children: profile.steps.map((step) => /* @__PURE__ */ jsx("li", { children: step }, step)) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100", children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "h-6 w-6 animate-spin text-red-600",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "2", opacity: "0.35" }),
                    /* @__PURE__ */ jsx("path", { d: "M12 7V13", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "16.5", r: "1.25", fill: "currentColor" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Legal and safety warning" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-blue-900 leading-7", children: [
              profile.legalLead,
              " Under the Gas Safety (Installation and Use) Regulations 1998 (Regulation 3), gas work must be carried out by a Gas Safe registered engineer. Illegal gas work can lead to prosecution, substantial fines, and potential imprisonment. If fault codes persist, stop DIY attempts and book a qualified engineer."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Book service or repair" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900 leading-7", children: "Book a boiler service first if you want full-condition checks. A service may resolve some issues and also help identify whether a repair is needed. If you prefer, you can book a repair directly." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/book/quote/service",
                  className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700",
                  children: "Book a Boiler Service"
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/book/quote/repair",
                  className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50",
                  children: "Book a Boiler Repair"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(NewBoilerQuoteCta, {}),
          /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Frequently asked questions" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-4", children: article.faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: faq.q }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-gray-700", children: faq.a })
            ] }, faq.q)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-12", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "More boiler help" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: adviceArticles.filter((x) => x.slug !== article.slug).slice(0, 8).map((item) => /* @__PURE__ */ jsxs(
            Link,
            {
              href: `/advice/${item.slug}`,
              className: "rounded-lg border border-gray-200 p-4 hover:shadow-sm",
              children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: item.excerpt })
              ]
            },
            item.slug
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdviceArticlePage
}, Symbol.toStringTag, { value: "Module" }));
function BoilerPressureDroppingPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Boiler Pressure Keeps Dropping" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Boiler Pressure Keeps Dropping" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Boiler pressure keeps dropping: common causes" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Repeated pressure loss usually points to a small system leak, radiator bleed loss, PRV issues, or an internal boiler component problem." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "What you can check" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-4 list-disc pl-5 space-y-2 text-gray-700", children: [
            /* @__PURE__ */ jsx("li", { children: "Inspect visible radiator valves and pipe joints." }),
            /* @__PURE__ */ jsx("li", { children: "Check if pressure drops after bleeding radiators." }),
            /* @__PURE__ */ jsx("li", { children: "Monitor if drops happen overnight when system is cold." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "When to book" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "If you are topping up pressure repeatedly, book a boiler service first. A full service may resolve some issues and also help identify whether you need a repair. If you prefer, you can book a repair directly." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/boiler-problems", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "More boiler problem guides" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BoilerPressureDroppingPage
}, Symbol.toStringTag, { value: "Module" }));
function BoilerPressureIncreasingPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Boiler Pressure Keeps Increasing" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Boiler Pressure Keeps Increasing" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Boiler pressure keeps increasing: what it means" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "If pressure rises above normal and you need to keep releasing water, likely causes include a faulty filling loop, expansion vessel charge issue, or internal valve faults." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Quick checks" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-4 list-disc pl-5 space-y-2 text-gray-700", children: [
            /* @__PURE__ */ jsx("li", { children: "Ensure the filling loop is fully closed." }),
            /* @__PURE__ */ jsx("li", { children: "Note pressure when cold vs when heating is on." }),
            /* @__PURE__ */ jsx("li", { children: "Look for any discharge pipe dripping outside." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Next best step" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "Book a boiler service first. A full service may resolve some issues and also help identify whether you need a repair. If you prefer, you can book a repair directly." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/boiler-problems", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "More boiler problem guides" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BoilerPressureIncreasingPage
}, Symbol.toStringTag, { value: "Module" }));
const cards = [
  {
    title: "Ideal boiler making a noise",
    description: "Banging, whistling, humming, or vibrating noises often indicate scale build-up, pump issues, or trapped air.",
    href: "/advice/ideal-boiler-making-a-noise"
  },
  {
    title: "Boiler pressure keeps increasing",
    description: "Rising pressure can indicate a faulty filling loop, expansion vessel problem, or internal leak path.",
    href: "/advice/boiler-pressure-keeps-increasing"
  },
  {
    title: "Boiler pressure keeps dropping",
    description: "Pressure loss is commonly caused by small leaks, bleeding radiators, or component faults.",
    href: "/advice/boiler-pressure-keeps-dropping"
  }
];
function BoilerProblemsHubPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Boiler Problems Advice Leeds" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Boiler Problems Advice" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsxs("section", { className: "text-center max-w-3xl mx-auto", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Boiler problem guides for Leeds homeowners" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-gray-600", children: "Quick fault guides for common symptoms. If the issue remains, book a boiler service first, then a repair visit if required." })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "grid gap-6 md:grid-cols-3 mt-12", children: cards.map((card) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: card.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-600 text-sm leading-6", children: card.description }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: card.href,
                  className: "inline-flex mt-6 text-primary font-semibold hover:underline",
                  children: "Read guide →"
                }
              )
            ]
          },
          card.href
        )) }),
        /* @__PURE__ */ jsxs("section", { className: "mt-14 rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Need an engineer now?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-600", children: "If your heating or hot water is unreliable, book a service to diagnose system condition. If a fault is confirmed, book a repair appointment." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/book/quote/service",
                className: "inline-flex items-center rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700",
                children: "Book a Boiler Service"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/book/quote/repair",
                className: "inline-flex items-center rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50",
                children: "Book a Boiler Repair"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BoilerProblemsHubPage
}, Symbol.toStringTag, { value: "Module" }));
function IdealBoilerHelpPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Ideal Boiler Problems & Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Ideal Boiler Help" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Ideal boiler problems in Leeds: what they usually mean" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "If your Ideal boiler is noisy, losing pressure, or showing a fault code, the issue is often not user-fixable. We focus on safe diagnosis first, then the right repair." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("a", { href: "/advice/ideal-boiler-making-a-noise", className: "rounded-xl border border-gray-200 p-5 hover:shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-bold text-xl", children: "Ideal boiler making a noise" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Ticking, kettling, vibrating and fan/pump sounds." })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "/advice/boiler-pressure-keeps-dropping", className: "rounded-xl border border-gray-200 p-5 hover:shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-bold text-xl", children: "Pressure keeps dropping" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "If no external leaks are visible, the fault is often internal." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Ideal fault codes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-700", children: "We have a dedicated lookup with likely causes and next-step advice for common Ideal codes." }),
          /* @__PURE__ */ jsx("a", { href: "/advice/ideal-boiler-fault-codes", className: "inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold", children: "View Ideal Fault Code Guide" })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Service or repair?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "If your boiler still heats but behaves inconsistently, a full service can restore performance and may resolve minor issues. If a component fault is identified, repair is then targeted and efficient." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
            /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IdealBoilerHelpPage
}, Symbol.toStringTag, { value: "Module" }));
function IdealBoilerNoisePage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Ideal Boiler Making a Noise" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Ideal Boiler Making a Noise" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Why is my Ideal boiler making a noise?" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Common noises include banging, kettling, humming, and vibrating. Causes can include limescale in the heat exchanger, trapped air, poor circulation, or pump and fan wear." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Safe checks first" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-4 list-disc pl-5 space-y-2 text-gray-700", children: [
            /* @__PURE__ */ jsx("li", { children: "Check system pressure is in the normal range." }),
            /* @__PURE__ */ jsx("li", { children: "Bleed noisy radiators if air is trapped." }),
            /* @__PURE__ */ jsx("li", { children: "Confirm boiler settings are not maxed unnecessarily." }),
            /* @__PURE__ */ jsx("li", { children: "Listen for repeat pattern (startup only or constant)." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "When to call an engineer" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "If noise is getting louder, heating performance drops, or pressure swings, book a boiler service. A full service may resolve some issues and also help identify whether a repair is needed. If you prefer, you can book a repair directly." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/boiler-problems", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "More boiler problem guides" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IdealBoilerNoisePage
}, Symbol.toStringTag, { value: "Module" }));
const codes$2 = [
  ["F1", "Low system pressure", "Check pressure and system for leaks. Internal issue likely if recurring."],
  ["F2", "Flame loss / ignition lockout", "Possible gas valve, fan, flue, ignition or gas supply issue."],
  ["L2", "Ignition lockout", "Repeated failed ignition. Engineer diagnosis required."],
  ["L5", "Too many resets / lockout", "Control lockout after repeated faults; needs root-cause fix."],
  ["F3", "Fan fault", "Fan or airflow proving issue."],
  ["F4", "Flow thermistor fault", "Temperature sensor reading abnormal."],
  ["F5", "Return thermistor fault", "Return NTC sensor/wiring issue."],
  ["F6", "Outside sensor fault", "External temperature sensor fault on compatible setups."],
  ["F7", "Low mains / flame signal fault", "Electrical or combustion signal issue."],
  ["F9", "Printed circuit board fault", "Control PCB fault likely."],
  ["FD", "Incorrect setup / code", "Commissioning or control parameter issue."],
  ["C0-C9", "Status codes", "Operational/status states. Some are normal, some indicate waiting or protection modes."],
  ["0", "Standby", "No active demand. Usually normal if heating/hot water off."]
];
function IdealFaultCodesPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Ideal Boiler Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Ideal Fault Codes" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Ideal boiler fault codes: likely causes and next steps" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "This page covers common Ideal domestic fault and status codes seen across Logic/Vogue-style ranges. Exact meaning can vary by model generation and controller." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-x-auto rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-left", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Code" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Likely meaning" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "What to do" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: codes$2.map(([code, meaning, action]) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-gray-200 align-top", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-bold text-primary whitespace-nowrap", children: code }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-800", children: meaning }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-700", children: action })
          ] }, code)) })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-gray-700", children: "Legal warning: if a fault code returns repeatedly after reset, do not open the case or attempt internal gas/appliance work. Under the Gas Safety (Installation and Use) Regulations 1998 (Regulation 3), gas work must be done by a Gas Safe registered engineer. Illegal gas work can result in prosecution, heavy fines, and potential imprisonment." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/ideal-boiler-help", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "Back to Ideal help" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IdealFaultCodesPage
}, Symbol.toStringTag, { value: "Module" }));
function VaillantBoilerHelpPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Vaillant Boiler Problems & Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Vaillant Boiler Help" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Vaillant boiler issues and fault code guidance" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Common Vaillant issues include pressure instability, ignition lockouts, and sensor faults. Codes like F75 and F72 often point to pressure sensing, pump, flow, or thermistor problems that need professional diagnosis." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Vaillant fault codes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-700", children: "Use our Vaillant code page for likely causes, urgency, and whether to book service first or go straight to repair." }),
          /* @__PURE__ */ jsx("a", { href: "/advice/vaillant-boiler-fault-codes", className: "inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold", children: "View Vaillant Fault Codes" })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Safe next step" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "If the code returns after a reset or your heating/hot water is unreliable, book an engineer visit. We can service the appliance and diagnose underlying faults, then carry out repair if required." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
            /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VaillantBoilerHelpPage
}, Symbol.toStringTag, { value: "Module" }));
const codes$1 = [
  ["F.22", "Low water pressure / dry fire protection", "Repressurise if safe. If recurring, check for leak/internal fault."],
  ["F.23", "Temperature rise too fast (flow/return issue)", "Possible low circulation, pump, or sensor mismatch."],
  ["F.24", "Rapid temperature rise", "Circulation restriction, pump or heat exchanger issue."],
  ["F.25", "Flue gas temperature high", "Combustion/flue safety fault. Engineer required."],
  ["F.26", "Gas valve stepper motor current fault", "Gas valve/electrical control issue."],
  ["F.27", "Flame signal with gas off", "Ionisation/PCB or gas valve anomaly."],
  ["F.28", "Ignition failed", "No flame established. Gas supply, ignition or combustion issue."],
  ["F.29", "Flame lost during operation", "Intermittent combustion failure."],
  ["F.32", "Fan speed / air pressure fault", "Fan, venturi, air pressure proving or flue-related issue."],
  ["F.49", "eBUS low voltage/communication", "Controls/electrical communication problem."],
  ["F.54", "Gas supply interruption", "Supply pressure interruption or valve issue."],
  ["F.61", "Gas valve control fault", "Gas valve electronics/wiring fault."],
  ["F.62", "Gas valve delayed close", "Valve/control safety fault."],
  ["F.64", "Electronics/sensor plausibility fault", "Sensor or PCB processing fault."],
  ["F.65", "Electronics overheat", "PCB overheating or cooling issue."],
  ["F.67", "Flame signal plausibility fault", "Combustion sensing inconsistency."],
  ["F.68", "Unstable flame signal", "Ignition/combustion instability."],
  ["F.70", "Invalid appliance code", "Configuration/PCB replacement coding issue."],
  ["F.71", "Flow sensor stuck", "Flow NTC not changing as expected."],
  ["F.72", "Flow/return NTC mismatch", "Thermistor/wiring/flow-rate related issue."],
  ["F.73", "Water pressure sensor signal too low", "Pressure sensor/wiring fault."],
  ["F.74", "Water pressure sensor out of range", "Sensor plausibility issue."],
  ["F.75", "No pressure change when pump starts", "Commonly pressure sensor, pump, or system leak."],
  ["F.76", "Primary heat exchanger overheat safety", "Overheat safety lockout."],
  ["F.77", "Flue gas flap/condensate pump fault (model dependent)", "Auxiliary safety device fault."],
  ["F.83", "Flow/return sensor temperature no change", "Poor circulation or sensor issue."]
];
function VaillantFaultCodesPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Vaillant Boiler Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Vaillant Fault Codes" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Vaillant fault codes explained (F.22 to F.83)" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Based on widely seen UK Vaillant domestic code families including common faults like F75 and F72. Exact interpretation can vary by model and firmware." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-x-auto rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-left", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Code" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Likely meaning" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "What to do" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: codes$1.map(([code, meaning, action]) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-gray-200 align-top", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-bold text-primary whitespace-nowrap", children: code }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-800", children: meaning }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-700", children: action })
          ] }, code)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/vaillant-boiler-help", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "Back to Vaillant help" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {}),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-gray-700", children: "Legal warning: recurring combustion or lockout faults should not be handled with internal DIY work. Under the Gas Safety (Installation and Use) Regulations 1998 (Regulation 3), gas work must be completed by a Gas Safe registered engineer. Illegal gas work can lead to prosecution, significant fines, and possible imprisonment." })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VaillantFaultCodesPage
}, Symbol.toStringTag, { value: "Module" }));
function WorcesterBoilerHelpPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Worcester Boiler Problems & Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Worcester Boiler Help" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Worcester boiler faults: practical homeowner guidance" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Worcester faults are often shown as EA/C/A or numeric code families depending on model and controller. Many are linked to ignition, fan, sensor, pressure, or circulation issues." }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Worcester fault codes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-700", children: "See our Worcester lookup for likely causes and what to do next without risky DIY work." }),
          /* @__PURE__ */ jsx("a", { href: "/advice/worcester-boiler-fault-codes", className: "inline-flex mt-4 rounded-lg bg-primary px-5 py-3 text-white font-semibold", children: "View Worcester Fault Codes" })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Service first, repair if needed" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-blue-900", children: "A full service can resolve performance issues and reveal root causes early. If a hard component fault is found, a repair appointment gets the boiler back to reliable operation." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
            /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: WorcesterBoilerHelpPage
}, Symbol.toStringTag, { value: "Module" }));
const codes = [
  ["EA", "No flame detected / ignition fault", "Combustion or gas/ignition issue. Common lockout code."],
  ["C6", "Fan speed too low / fan fault", "Fan, air pressure proving, or flue airflow issue."],
  ["C7", "Fan continues running unexpectedly", "Fan control or PCB/fan feedback issue."],
  ["A1", "Pump running dry / circulation issue", "Low flow or pump/circulation problem."],
  ["E9", "Overheat trip", "Over-temperature safety lockout, often circulation/sensor related."],
  ["D1", "Flow sensor fault (model dependent)", "Temperature sensor or wiring issue."],
  ["D5", "Return sensor fault (model dependent)", "Return NTC/wiring fault."],
  ["227", "Flame not detected after ignition", "Ignition sequence failed."],
  ["229", "Flame lost during burner operation", "Intermittent combustion issue."],
  ["232", "Air pressure/fan proving fault", "Fan or pressure proving device issue."],
  ["233", "No fan speed signal", "Fan hall-sensor/speed feedback fault."],
  ["295", "Internal electronics/PCB fault", "Control board fault condition."],
  ["296", "Electronics parameter/plausibility fault", "Control consistency fault."],
  ["297", "Gas valve control fault", "Gas valve actuation/control issue."],
  ["298", "Burner control fault", "Combustion control chain issue."],
  ["286", "Pump speed/control issue", "Pump operation outside expected range."],
  ["1017", "System pressure too low", "Repressurise and investigate for leaks if recurring."],
  ["1021", "System pressure too high", "Check filling loop and pressure control."]
];
function WorcesterFaultCodesPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Worcester Boiler Fault Codes" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: "Worcester Fault Codes" }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-16", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight", children: "Worcester fault codes: EA, C6, C7 and numeric codes" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700 leading-7", children: "Worcester displays differ by appliance generation (alphanumeric and numeric styles). Use this guide as a practical first interpretation before booking diagnosis." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-x-auto rounded-xl border border-gray-200", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-left", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Code" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "Likely meaning" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold", children: "What to do" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: codes.map(([code, meaning, action]) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-gray-200 align-top", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-bold text-primary whitespace-nowrap", children: code }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-800", children: meaning }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-700", children: action })
          ] }, code)) })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-gray-700", children: "Note: exact code wording varies by model (e.g. Greenstar generations). Legal warning: internal gas appliance work must be carried out by a Gas Safe registered engineer under the Gas Safety (Installation and Use) Regulations 1998 (Regulation 3). Illegal gas work can lead to prosecution, large fines, and possible imprisonment." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("a", { href: "/book/quote/service", className: "inline-flex rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700", children: "Book a Boiler Service" }),
          /* @__PURE__ */ jsx("a", { href: "/book/quote/repair", className: "inline-flex rounded-lg border border-red-600 bg-white px-5 py-3 text-red-700 font-semibold hover:bg-red-50", children: "Book a Boiler Repair" }),
          /* @__PURE__ */ jsx("a", { href: "/advice/worcester-boiler-help", className: "inline-flex rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-semibold", children: "Back to Worcester help" })
        ] }),
        /* @__PURE__ */ jsx(NewBoilerQuoteCta, {})
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const __vite_glob_0_47 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: WorcesterFaultCodesPage
}, Symbol.toStringTag, { value: "Module" }));
const SECTIONS = [
  { id: "agreement", title: "1. Agreement to Terms" },
  { id: "services", title: "2. Services" },
  { id: "bookings", title: "3. Bookings & Appointments" },
  { id: "pricing", title: "4. Pricing & Payment" },
  { id: "warranties", title: "5. Warranties & Guarantees" },
  { id: "liability", title: "6. Liability" },
  { id: "safety", title: "7. Safety Requirements" },
  { id: "complaints", title: "8. Complaints" },
  { id: "changes", title: "9. Changes to Terms" },
  { id: "next-day", title: "10. Next-Day Installation Terms" },
  { id: "contact", title: "11. Contact Information" }
];
const getActiveIdFromHash = () => {
  if (typeof window !== "undefined" && window.location.hash) {
    return window.location.hash.substring(1);
  }
  return null;
};
function TermsConditionsPage() {
  const { props } = usePage();
  const pageTitle2 = props.pageTitle ?? "Terms & Conditions";
  const lastUpdated = "28 January 2026";
  const [activeSectionId, setActiveSectionId] = useState(
    getActiveIdFromHash()
  );
  useEffect(() => {
    const handleHashChange = () => {
      setActiveSectionId(getActiveIdFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    setActiveSectionId(getActiveIdFromHash());
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: pageTitle2 }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full bg-white text-gray-900 rounded-b-3xl", children: [
      /* @__PURE__ */ jsx(Header, { title: pageTitle2 }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-16 pt-28", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 md:mb-16 mt-6 flex flex-col items-center justify-center md:flex-row md:justify-between md:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-3xl sm:text-5xl font-extrabold leading-tight tracking-tighter text-center md:text-left", children: [
              "Terms &",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Conditions" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg sm:text-xl w-full max-w-84 text-gray-700 font-light text-center md:text-left", children: "The terms that govern your use of MD Gas services." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-gray-400", children: [
            "Last updated: ",
            /* @__PURE__ */ jsx("br", { className: "md:flex" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: lastUpdated })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:hidden mb-10", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar px-1 pb-2", children: SECTIONS.map((s) => {
            const isActive = s.id === activeSectionId;
            return /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${s.id}`,
                className: `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
                                                ${isActive ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: s.title
              },
              s.id
            );
          }) }),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" }),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-12", children: [
          /* @__PURE__ */ jsx(
            "nav",
            {
              "aria-label": "Table of contents",
              className: "hidden md:block md:col-span-1 md:sticky md:top-10 self-start",
              children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-50 border border-gray-200 p-6 shadow-md max-h-[calc(100vh-4rem)] overflow-y-auto", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200", children: "Contents" }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-base", children: SECTIONS.map((s) => {
                  const isActive = s.id === activeSectionId;
                  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: `#${s.id}`,
                      className: `block px-3 py-1.5 transition-all border-l-4
                                                        ${isActive ? "border-primary text-primary font-semibold" : "border-transparent text-gray-600 hover:text-primary hover:border-secondary/70"}`,
                      children: s.title
                    }
                  ) }, s.id);
                }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("article", { className: "md:col-span-3 space-y-12 md:border-l md:border-gray-200 md:pl-8", children: [
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "agreement",
                title: "1. Agreement to Terms",
                isActive: activeSectionId === "agreement",
                children: /* @__PURE__ */ jsx("p", { children: 'By accessing or using the services provided by MD Gas ("Company", "we", "our", or "us"), you agree to be bound by these Terms & Conditions.' })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "services",
                title: "2. Services",
                isActive: activeSectionId === "services",
                children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
                  /* @__PURE__ */ jsxs("li", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Boiler Repairs:" }),
                    " Fixed labour rates with parts priced separately where required."
                  ] }),
                  /* @__PURE__ */ jsxs("li", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Servicing:" }),
                    " Annual servicing with clear fixed pricing."
                  ] }),
                  /* @__PURE__ */ jsxs("li", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Installations:" }),
                    " Fixed‑price online quotes and packages."
                  ] }),
                  /* @__PURE__ */ jsxs("li", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Power Flush:" }),
                    " Price based on radiator count and system size."
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "bookings",
                title: "3. Bookings & Appointments",
                isActive: activeSectionId === "bookings",
                children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
                  /* @__PURE__ */ jsx("li", { children: "Provide accurate booking details." }),
                  /* @__PURE__ */ jsx("li", { children: "An adult must be present." }),
                  /* @__PURE__ */ jsx("li", { children: "Ensure safe access." }),
                  /* @__PURE__ */ jsx("li", { children: "Please give notice if you need to reschedule." })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "pricing",
                title: "4. Pricing & Payment",
                isActive: activeSectionId === "pricing",
                children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
                  /* @__PURE__ */ jsx("li", { children: "All prices include VAT." }),
                  /* @__PURE__ */ jsx("li", { children: "Labour fixed, parts extra where required." }),
                  /* @__PURE__ */ jsx("li", { children: "Payment is taken upfront." }),
                  /* @__PURE__ */ jsx("li", { children: "We accept card payments and Klarna." })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "warranties",
                title: "5. Warranties & Guarantees",
                isActive: activeSectionId === "warranties",
                children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
                  /* @__PURE__ */ jsx("li", { children: "12-month workmanship guarantee." }),
                  /* @__PURE__ */ jsx("li", { children: "Manufacturer warranties apply." })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "liability",
                title: "6. Liability",
                isActive: activeSectionId === "liability",
                children: /* @__PURE__ */ jsx("p", { children: "Liability is limited to the cost of the service provided and excludes pre‑existing faults." })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "safety",
                title: "7. Safety Requirements",
                isActive: activeSectionId === "safety",
                children: /* @__PURE__ */ jsx("p", { children: "All work complies with Gas Safe regulations." })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "complaints",
                title: "8. Complaints",
                isActive: activeSectionId === "complaints",
                children: /* @__PURE__ */ jsx("p", { children: "Contact us as soon as possible if you are unhappy with a service and we will work to put it right." })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "changes",
                title: "9. Changes to Terms",
                isActive: activeSectionId === "changes",
                children: /* @__PURE__ */ jsx("p", { children: "Terms may be updated at any time." })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "next-day",
                title: "10. Next-Day Installation Terms",
                isActive: activeSectionId === "next-day",
                children: /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [
                  /* @__PURE__ */ jsx("li", { children: "Next-day installation refers to the next available appointment window, not a guaranteed time slot." }),
                  /* @__PURE__ */ jsx("li", { children: "Applies to eligible, in-stock products ordered and paid before 3:00pm Monday to Friday." }),
                  /* @__PURE__ */ jsx("li", { children: "Subject to final technical review, engineer and supplier availability, service-area coverage, and safe site access." }),
                  /* @__PURE__ */ jsx("li", { children: "Excludes bank holidays, weekends, special-order materials, and complex upgrade or remedial works." }),
                  /* @__PURE__ */ jsx("li", { children: "We may reschedule where required for safety, compliance, access, weather, or third-party delays." })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              TermsSection,
              {
                id: "contact",
                title: "11. Contact Information",
                isActive: activeSectionId === "contact",
                isContact: true,
                children: /* @__PURE__ */ jsxs("div", { className: "mt-4 p-5 rounded-lg border border-primary/60 bg-primary-5 space-y-3", children: [
                  /* @__PURE__ */ jsx("p", { children: "Contact: WhatsApp chat or request a callback." }),
                  /* @__PURE__ */ jsx("p", { children: "Email: info@mdgasleeds.co.uk" }),
                  /* @__PURE__ */ jsx("p", { children: "Service area: Leeds & Surrounding." })
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const TermsSection = ({
  id,
  title,
  children,
  isContact = false,
  isActive = false
}) => /* @__PURE__ */ jsxs("section", { id, className: "relative", children: [
  /* @__PURE__ */ jsx(
    "div",
    {
      className: `hidden md:block absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 ${isActive ? "bg-primary border-secondary/60" : "bg-white border-light-grey"}`
    }
  ),
  /* @__PURE__ */ jsx(
    "h3",
    {
      className: `text-xl sm:text-2xl font-extrabold mb-4 ${isContact || isActive ? "text-primary" : "text-gray-900"}`,
      children: title
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "space-y-4 text-base text-gray-700 leading-relaxed", children })
] });
const __vite_glob_0_48 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsConditionsPage
}, Symbol.toStringTag, { value: "Module" }));
function Welcome({ auth, laravelVersion, phpVersion }) {
  const handleImageError = () => {
    document.getElementById("screenshot-container")?.classList.add("!hidden");
    document.getElementById("docs-card")?.classList.add("!row-span-1");
    document.getElementById("docs-card-content")?.classList.add("!flex-row");
    document.getElementById("background")?.classList.add("!hidden");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Welcome" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 text-black/50 dark:bg-black dark:text-white/50", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          id: "background",
          className: "absolute -left-20 top-0 max-w-[877px]",
          src: "https://laravel.com/assets/img/welcome/background.svg"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-2xl px-6 lg:max-w-7xl", children: [
        /* @__PURE__ */ jsxs("header", { className: "grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex lg:col-start-2 lg:justify-center", children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "h-12 w-auto text-white lg:h-16 lg:text-[#FF2D20]",
              viewBox: "0 0 62 65",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z",
                  fill: "currentColor"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("nav", { className: "-mx-3 flex flex-1 justify-end", children: auth.user ? /* @__PURE__ */ jsx(
            Link,
            {
              href: route("dashboard"),
              className: "rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white",
              children: "Dashboard"
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("login"),
                className: "rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white",
                children: "Log in"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("register"),
                className: "rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white",
                children: "Register"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("main", { className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2 lg:gap-8", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://laravel.com/docs",
              id: "docs-card",
              className: "flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]",
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    id: "screenshot-container",
                    className: "relative flex w-full flex-1 items-stretch",
                    children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "https://laravel.com/assets/img/welcome/docs-light.svg",
                          alt: "Laravel documentation screenshot",
                          className: "aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.06)] dark:hidden",
                          onError: handleImageError
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "https://laravel.com/assets/img/welcome/docs-dark.svg",
                          alt: "Laravel documentation screenshot",
                          className: "hidden aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.25)] dark:block"
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-16 -left-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-zinc-900 dark:to-zinc-900" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-6 lg:items-end", children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      id: "docs-card-content",
                      className: "flex items-start gap-6 lg:flex-col",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16", children: /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            className: "size-5 sm:size-6",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  fill: "#FF2D20",
                                  d: "M23 4a1 1 0 0 0-1.447-.894L12.224 7.77a.5.5 0 0 1-.448 0L2.447 3.106A1 1 0 0 0 1 4v13.382a1.99 1.99 0 0 0 1.105 1.79l9.448 4.728c.14.065.293.1.447.1.154-.005.306-.04.447-.105l9.453-4.724a1.99 1.99 0 0 0 1.1-1.789V4ZM3 6.023a.25.25 0 0 1 .362-.223l7.5 3.75a.251.251 0 0 1 .138.223v11.2a.25.25 0 0 1-.362.224l-7.5-3.75a.25.25 0 0 1-.138-.22V6.023Zm18 11.2a.25.25 0 0 1-.138.224l-7.5 3.75a.249.249 0 0 1-.329-.099.249.249 0 0 1-.033-.12V9.772a.251.251 0 0 1 .138-.224l7.5-3.75a.25.25 0 0 1 .362.224v11.2Z"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "path",
                                {
                                  fill: "#FF2D20",
                                  d: "m3.55 1.893 8 4.048a1.008 1.008 0 0 0 .9 0l8-4.048a1 1 0 0 0-.9-1.785l-7.322 3.706a.506.506 0 0 1-.452 0L4.454.108a1 1 0 0 0-.9 1.785H3.55Z"
                                }
                              )
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("div", { className: "pt-3 sm:pt-5 lg:pt-0", children: [
                          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-black dark:text-white", children: "Documentation" }),
                          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm/relaxed", children: "Laravel has wonderful documentation covering every aspect of the framework. Whether you are a newcomer or have prior experience with Laravel, we recommend reading our documentation from beginning to end." })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "size-6 shrink-0 stroke-[#FF2D20]",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      strokeWidth: "1.5",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          d: "M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                        }
                      )
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://laracasts.com",
              className: "flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "size-5 sm:size-6",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsx("g", { fill: "#FF2D20", children: /* @__PURE__ */ jsx("path", { d: "M24 8.25a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5v12a2.5 2.5 0 0 0 2.5 2.5h19a2.5 2.5 0 0 0 2.5-2.5v-12Zm-7.765 5.868a1.221 1.221 0 0 1 0 2.264l-6.626 2.776A1.153 1.153 0 0 1 8 18.123v-5.746a1.151 1.151 0 0 1 1.609-1.035l6.626 2.776ZM19.564 1.677a.25.25 0 0 0-.177-.427H15.6a.106.106 0 0 0-.072.03l-4.54 4.543a.25.25 0 0 0 .177.427h3.783c.027 0 .054-.01.073-.03l4.543-4.543ZM22.071 1.318a.047.047 0 0 0-.045.013l-4.492 4.492a.249.249 0 0 0 .038.385.25.25 0 0 0 .14.042h5.784a.5.5 0 0 0 .5-.5v-2a2.5 2.5 0 0 0-1.925-2.432ZM13.014 1.677a.25.25 0 0 0-.178-.427H9.101a.106.106 0 0 0-.073.03l-4.54 4.543a.25.25 0 0 0 .177.427H8.4a.106.106 0 0 0 .073-.03l4.54-4.543ZM6.513 1.677a.25.25 0 0 0-.177-.427H2.5A2.5 2.5 0 0 0 0 3.75v2a.5.5 0 0 0 .5.5h1.4a.106.106 0 0 0 .073-.03l4.54-4.543Z" }) })
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "pt-3 sm:pt-5", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-black dark:text-white", children: "Laracasts" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm/relaxed", children: "Laracasts offers thousands of video tutorials on Laravel, PHP, and JavaScript development. Check them out, see for yourself, and massively level up your development skills in the process." })
                ] }),
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "size-6 shrink-0 self-center stroke-[#FF2D20]",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    strokeWidth: "1.5",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://laravel-news.com",
              className: "flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "size-5 sm:size-6",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsxs("g", { fill: "#FF2D20", children: [
                      /* @__PURE__ */ jsx("path", { d: "M8.75 4.5H5.5c-.69 0-1.25.56-1.25 1.25v4.75c0 .69.56 1.25 1.25 1.25h3.25c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25Z" }),
                      /* @__PURE__ */ jsx("path", { d: "M24 10a3 3 0 0 0-3-3h-2V2.5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2V20a3.5 3.5 0 0 0 3.5 3.5h17A3.5 3.5 0 0 0 24 20V10ZM3.5 21.5A1.5 1.5 0 0 1 2 20V3a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 .5.5v17c0 .295.037.588.11.874a.5.5 0 0 1-.484.625L3.5 21.5ZM22 20a1.5 1.5 0 1 1-3 0V9.5a.5.5 0 0 1 .5-.5H21a1 1 0 0 1 1 1v10Z" }),
                      /* @__PURE__ */ jsx("path", { d: "M12.751 6.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 7.3v-.5a.75.75 0 0 1 .751-.753ZM12.751 10.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 11.3v-.5a.75.75 0 0 1 .751-.753ZM4.751 14.047h10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-10A.75.75 0 0 1 4 15.3v-.5a.75.75 0 0 1 .751-.753ZM4.75 18.047h7.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-7.5A.75.75 0 0 1 4 19.3v-.5a.75.75 0 0 1 .75-.753Z" })
                    ] })
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "pt-3 sm:pt-5", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-black dark:text-white", children: "Laravel News" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm/relaxed", children: "Laravel News is a community driven portal and newsletter aggregating all of the latest and most important news in the Laravel ecosystem, including new package releases and tutorials." })
                ] }),
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "size-6 shrink-0 self-center stroke-[#FF2D20]",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    strokeWidth: "1.5",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800", children: [
            /* @__PURE__ */ jsx("div", { className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-5 sm:size-6",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("g", { fill: "#FF2D20", children: /* @__PURE__ */ jsx("path", { d: "M16.597 12.635a.247.247 0 0 0-.08-.237 2.234 2.234 0 0 1-.769-1.68c.001-.195.03-.39.084-.578a.25.25 0 0 0-.09-.267 8.8 8.8 0 0 0-4.826-1.66.25.25 0 0 0-.268.181 2.5 2.5 0 0 1-2.4 1.824.045.045 0 0 0-.045.037 12.255 12.255 0 0 0-.093 3.86.251.251 0 0 0 .208.214c2.22.366 4.367 1.08 6.362 2.118a.252.252 0 0 0 .32-.079 10.09 10.09 0 0 0 1.597-3.733ZM13.616 17.968a.25.25 0 0 0-.063-.407A19.697 19.697 0 0 0 8.91 15.98a.25.25 0 0 0-.287.325c.151.455.334.898.548 1.328.437.827.981 1.594 1.619 2.28a.249.249 0 0 0 .32.044 29.13 29.13 0 0 0 2.506-1.99ZM6.303 14.105a.25.25 0 0 0 .265-.274 13.048 13.048 0 0 1 .205-4.045.062.062 0 0 0-.022-.07 2.5 2.5 0 0 1-.777-.982.25.25 0 0 0-.271-.149 11 11 0 0 0-5.6 2.815.255.255 0 0 0-.075.163c-.008.135-.02.27-.02.406.002.8.084 1.598.246 2.381a.25.25 0 0 0 .303.193 19.924 19.924 0 0 1 5.746-.438ZM9.228 20.914a.25.25 0 0 0 .1-.393 11.53 11.53 0 0 1-1.5-2.22 12.238 12.238 0 0 1-.91-2.465.248.248 0 0 0-.22-.187 18.876 18.876 0 0 0-5.69.33.249.249 0 0 0-.179.336c.838 2.142 2.272 4 4.132 5.353a.254.254 0 0 0 .15.048c1.41-.01 2.807-.282 4.117-.802ZM18.93 12.957l-.005-.008a.25.25 0 0 0-.268-.082 2.21 2.21 0 0 1-.41.081.25.25 0 0 0-.217.2c-.582 2.66-2.127 5.35-5.75 7.843a.248.248 0 0 0-.09.299.25.25 0 0 0 .065.091 28.703 28.703 0 0 0 2.662 2.12.246.246 0 0 0 .209.037c2.579-.701 4.85-2.242 6.456-4.378a.25.25 0 0 0 .048-.189 13.51 13.51 0 0 0-2.7-6.014ZM5.702 7.058a.254.254 0 0 0 .2-.165A2.488 2.488 0 0 1 7.98 5.245a.093.093 0 0 0 .078-.062 19.734 19.734 0 0 1 3.055-4.74.25.25 0 0 0-.21-.41 12.009 12.009 0 0 0-10.4 8.558.25.25 0 0 0 .373.281 12.912 12.912 0 0 1 4.826-1.814ZM10.773 22.052a.25.25 0 0 0-.28-.046c-.758.356-1.55.635-2.365.833a.25.25 0 0 0-.022.48c1.252.43 2.568.65 3.893.65.1 0 .2 0 .3-.008a.25.25 0 0 0 .147-.444c-.526-.424-1.1-.917-1.673-1.465ZM18.744 8.436a.249.249 0 0 0 .15.228 2.246 2.246 0 0 1 1.352 2.054c0 .337-.08.67-.23.972a.25.25 0 0 0 .042.28l.007.009a15.016 15.016 0 0 1 2.52 4.6.25.25 0 0 0 .37.132.25.25 0 0 0 .096-.114c.623-1.464.944-3.039.945-4.63a12.005 12.005 0 0 0-5.78-10.258.25.25 0 0 0-.373.274c.547 2.109.85 4.274.901 6.453ZM9.61 5.38a.25.25 0 0 0 .08.31c.34.24.616.561.8.935a.25.25 0 0 0 .3.127.631.631 0 0 1 .206-.034c2.054.078 4.036.772 5.69 1.991a.251.251 0 0 0 .267.024c.046-.024.093-.047.141-.067a.25.25 0 0 0 .151-.23A29.98 29.98 0 0 0 15.957.764a.25.25 0 0 0-.16-.164 11.924 11.924 0 0 0-2.21-.518.252.252 0 0 0-.215.076A22.456 22.456 0 0 0 9.61 5.38Z" }) })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 sm:pt-5", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-black dark:text-white", children: "Vibrant Ecosystem" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-4 text-sm/relaxed", children: [
                "Laravel's robust library of first-party tools and libraries, such as",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://forge.laravel.com",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white dark:focus-visible:ring-[#FF2D20]",
                    children: "Forge"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://vapor.laravel.com",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Vapor"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://nova.laravel.com",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Nova"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://envoyer.io",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Envoyer"
                  }
                ),
                ", and",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://herd.laravel.com",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Herd"
                  }
                ),
                " ",
                "help you take your projects to the next level. Pair them with powerful open source libraries like",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/billing",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Cashier"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/dusk",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Dusk"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/broadcasting",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Echo"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/horizon",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Horizon"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/sanctum",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Sanctum"
                  }
                ),
                ",",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://laravel.com/docs/telescope",
                    className: "rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white",
                    children: "Telescope"
                  }
                ),
                ", and more."
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("footer", { className: "py-16 text-center text-sm text-black dark:text-white/70", children: [
          "Laravel v",
          laravelVersion,
          " (PHP v",
          phpVersion,
          ")"
        ] })
      ] }) })
    ] })
  ] });
}
const __vite_glob_0_49 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Welcome
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/About/AboutPage.jsx": __vite_glob_0_0, "./Pages/Admin/BasePrice.jsx": __vite_glob_0_1, "./Pages/Admin/BoilerCatalog.jsx": __vite_glob_0_2, "./Pages/Admin/CheckoutCoupons.jsx": __vite_glob_0_3, "./Pages/Admin/Orders/Management.jsx": __vite_glob_0_4, "./Pages/Admin/PricingOverrides.jsx": __vite_glob_0_5, "./Pages/Admin/RadiatorPrice.jsx": __vite_glob_0_6, "./Pages/Admin/Scheduling.jsx": __vite_glob_0_7, "./Pages/Auth/ConfirmPassword.jsx": __vite_glob_0_8, "./Pages/Auth/ForgotPassword.jsx": __vite_glob_0_9, "./Pages/Auth/Login.jsx": __vite_glob_0_10, "./Pages/Auth/Register.jsx": __vite_glob_0_11, "./Pages/Auth/ResetPassword.jsx": __vite_glob_0_12, "./Pages/Auth/VerifyEmail.jsx": __vite_glob_0_13, "./Pages/Book/Home.jsx": __vite_glob_0_14, "./Pages/Book/InstallPage.jsx": __vite_glob_0_15, "./Pages/Book/NewBoilerPage.jsx": __vite_glob_0_16, "./Pages/Book/Payment/Cancelled.jsx": __vite_glob_0_17, "./Pages/Book/Payment/Confirmed.jsx": __vite_glob_0_18, "./Pages/Book/Payment/Failed.jsx": __vite_glob_0_19, "./Pages/Book/PowerFlushPage.jsx": __vite_glob_0_20, "./Pages/Book/QuotePage.jsx": __vite_glob_0_21, "./Pages/Book/RepairCheckout.jsx": __vite_glob_0_22, "./Pages/Book/RepairPage.jsx": __vite_glob_0_23, "./Pages/Book/ServiceCheckout.jsx": __vite_glob_0_24, "./Pages/Book/ServicePage.jsx": __vite_glob_0_25, "./Pages/Book/ServiceResults.jsx": __vite_glob_0_26, "./Pages/ComingSoon/ComingSoon.jsx": __vite_glob_0_27, "./Pages/Dashboard.jsx": __vite_glob_0_28, "./Pages/Home.jsx": __vite_glob_0_29, "./Pages/OrderSummary/OrderSummary.jsx": __vite_glob_0_30, "./Pages/PrivacyPolicyPage.jsx": __vite_glob_0_31, "./Pages/Profile/Edit.jsx": __vite_glob_0_32, "./Pages/Profile/Partials/DeleteUserForm.jsx": __vite_glob_0_33, "./Pages/Profile/Partials/UpdatePasswordForm.jsx": __vite_glob_0_34, "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": __vite_glob_0_35, "./Pages/Quotation.jsx": __vite_glob_0_36, "./Pages/Seo/AdviceArticlePage.jsx": __vite_glob_0_37, "./Pages/Seo/BoilerPressureDroppingPage.jsx": __vite_glob_0_38, "./Pages/Seo/BoilerPressureIncreasingPage.jsx": __vite_glob_0_39, "./Pages/Seo/BoilerProblemsHubPage.jsx": __vite_glob_0_40, "./Pages/Seo/IdealBoilerHelpPage.jsx": __vite_glob_0_41, "./Pages/Seo/IdealBoilerNoisePage.jsx": __vite_glob_0_42, "./Pages/Seo/IdealFaultCodesPage.jsx": __vite_glob_0_43, "./Pages/Seo/VaillantBoilerHelpPage.jsx": __vite_glob_0_44, "./Pages/Seo/VaillantFaultCodesPage.jsx": __vite_glob_0_45, "./Pages/Seo/WorcesterBoilerHelpPage.jsx": __vite_glob_0_46, "./Pages/Seo/WorcesterFaultCodesPage.jsx": __vite_glob_0_47, "./Pages/TermsConditionsPage.jsx": __vite_glob_0_48, "./Pages/Welcome.jsx": __vite_glob_0_49 });
      return pages[`./Pages/${name}.jsx`];
    },
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
