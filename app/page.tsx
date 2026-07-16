"use client";

import Link from "next/link";
import { useEffect, useRef, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterUser from "@/components/RegisterUser";
import HowToUseSection from "@/components/HowToUseSection";
import DiscoverSection from "@/components/DiscoverSection";


/* ─────────────────────────────────────────────
   Subtle scroll-reveal hook
   Animates children into view with a gentle
   upward drift — no pop, no fade flash.
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-wrap ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const DiscoverKindSphereData = [
  {
    alt: "Explore the Shore ",
    number: "01",
    title: "Explore the Shore",
    body: "Discover bottles waiting to be found. Reply, connect, and let conversations grow.",
    image: null,
  },
  {
    alt: "Unexpected Connections",
    number: "02",
    title: "Unexpected Connections",
    body: "Receive anonymous private bottles from new connections.",
    image: "/assets/imagery/unexpectedconnections.png",
  },
  {
    alt: "My Drift",
    number: "03",
    title: "My Drift",
    body: "Keep track of your bottles, replies, connections, and personal activity.",
    image: null,
  },
  {
    alt: "The Sphere",
    number: "04",
    title: "The Sphere",
    body: "See who's currently active around the sphere and explore the community in real time.",
    image: null,
  },
] as const;


const GUIDELINES = [
  {
    title: "Racism & Hate Speech",
    description: "Content that targets or demeans individuals or communities.",
  },
  {
    title: "Bullying & Harassment",
    description: "Messages intended to intimidate, shame, or repeatedly harm others.",
  },
  {
    title: "Personal Attacks or Nudity",
    description: "Insults, abusive language, or sexually explicit imagery and content.",
  },
  {
    title: "Passive-Aggressive Tone",
    description: "Indirect hostility, sarcasm, or intentionally hurtful remarks.",
  },
  {
    title: "Spam & Self-Promotion",
    description: "Advertisements, repetitive messages, or promotional content.",
  },
  {
    title: "Explicit or Offensive Content",
    description: "Profanity, graphic material, or inappropriate language.",
  },
];



/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Thin horizontal rule with optional label */
function Rule({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="h-px flex-1 bg-stone-200/60" />
      {label && (
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-400 shrink-0">
          {label}
        </span>
      )}
      <div className="h-px flex-1 bg-stone-200/60" />
    </div>
  );
}

/** Section eyebrow label */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-400">
      {children}
    </p>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function LandingPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const router = useRouter();

  // Reuse the same auth mechanism as Navbar, dashboard, digest, drop, etc.:
  // read "kindsphere_handle" from localStorage and listen for "auth-changed".
  useEffect(() => {
    const sync = () => setUserHandle(localStorage.getItem("kindsphere_handle"));
    sync();
    window.addEventListener("auth-changed", sync);
    return () => window.removeEventListener("auth-changed", sync);
  }, []);

  return (
    <>
      {/* Global animation styles — scoped to this page */}
      <style>{`
          /* Hide page content while splash is active — prevents flash */
          html.ks-splash body > main {
            visibility: hidden;
            pointer-events: none;
          }
        .reveal-wrap {
          opacity: 0;
          will-change: opacity, transform;
        }
        .reveal-wrap.revealed {
          opacity: 1;
        }

        /* Hero Section Reveal */
        .reveal-hero {
          transform: translate3d(0, 30px, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-hero.revealed {
          transform: translate3d(0, 0, 0);
        }

        /* Discover Reveal ("Everything you need to spread kindness") */
        .reveal-kindness-feed {
          transform: translate3d(-30px, 0, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-kindness-feed.revealed {
          transform: translate3d(0, 0, 0);
        }

        /* How It Works Reveal step cards */
        .reveal-how-it-works-card {
          transform: translate3d(0, 25px, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-how-it-works-card.revealed {
          transform: translate3d(0, 0, 0);
        }

        /* Values Reveal ("OUR VALUES") */
        .reveal-testimonials {
          transform: translate3d(30px, 0, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-testimonials.revealed {
          transform: translate3d(0, 0, 0);
        }

        /* Guidelines Reveal ("OUR GUIDELINES. A safe space, held gently...") */
        .reveal-guidelines {
          transform: scale3d(0.98, 0.98, 1);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-guidelines.revealed {
          transform: scale3d(1, 1, 1);
        }

        /* Footer Reveal */
        .reveal-footer {
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Hero entrance animation */
        @keyframes hero-entrance {
          from {
            opacity: 0;
            transform: translate3d(0, 28px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .hero-animate {
          animation: hero-entrance 0.9s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        .hero-animate-delay-1 { animation-delay: 0.1s; }
        .hero-animate-delay-2 { animation-delay: 0.22s; }
        .hero-animate-delay-3 { animation-delay: 0.34s; }
        .hero-animate-delay-4 { animation-delay: 0.46s; }
        .hero-animate-delay-5 { animation-delay: 0.58s; }
        @media (prefers-reduced-motion: reduce) {
          .hero-animate { animation: none !important; opacity: 1 !important; transform: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-wrap,
          .reveal-hero,
          .reveal-kindness-feed,
          .reveal-how-it-works-card,
          .reveal-testimonials,
          .reveal-guidelines,
          .reveal-footer {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        /* Mobile layout refinements - uniform spacing and left alignment */
        @media (max-width: 767px) {
          .homepage-section,
          .homepage-section section {
            text-align: left !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }

          /* Hero gets its own mobile top padding — more than the generic 2rem
             so the content has breathing room below the 64px fixed navbar.
             The generic rule above would collapse this to 32px which is too tight. */
          .homepage-section.hero-section {
            padding-top: 5rem !important;   /* 80px — navbar(64) + 16px air */
            padding-bottom: 3rem !important;
          }
          
          /* DiscoverSection: no extra bottom — HowToUse provides its own top */
          .homepage-section.discover-section {
            padding-top: 2rem !important;
            padding-bottom: 0 !important;
          }

          /* HowToUse outer wrapper: let the inner <section> handle its own spacing */
          .homepage-section.how-to-use-wrapper {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .homepage-section .text-center,
          .homepage-section section .text-center {
            text-align: left !important;
          }
          
          .homepage-section p.mx-auto,
          .homepage-section section p.mx-auto {
            margin-left: 0 !important;
            margin-right: auto !important;
          }
          
          .homepage-section:not(.how-it-works) .mt-16.flex.justify-center {
            justify-content: flex-start !important;
          }
        }

        /* Sweeping gradient border on Kindness cards */
        @keyframes spin-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .card-sweep-border {
          position: relative;
          z-index: 1;
        }
        .card-sweep-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1.5px;
          background: conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0) 40%, #7C3AED 80%, #A78BFA 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s ease;
          animation: spin-gradient 2.5s linear infinite;
          pointer-events: none;
          z-index: -1;
        }
        .card-sweep-border:hover::before, .card-sweep-border:active::before {
          opacity: 1;
        }

        /* Sphere image subtle scale */
        .sphere-img {
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .sphere-img:hover { transform: scale(1.04); }

        /* Hairline divider */
        .hairline { border: none; border-top: 1px solid rgba(28,37,65,0.07); }

        /* Hero join button hover */
        .hero-join-btn:hover {
          box-shadow: 0 12px 36px rgba(139,92,246,0.45), 0 4px 12px rgba(139,92,246,0.25);
          transform: translateY(-1px);
        }

        /* Floating Card Animations */
        @keyframes float-anonymous {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-0.5deg);
          }
          50% {
            transform: translate3d(0, -10px, 0) rotate(0.5deg);
          }
        }

        @keyframes float-request {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0.5deg);
          }
          50% {
            transform: translate3d(0, 8px, 0) rotate(-0.5deg);
          }
        }

        .animate-float-slow {
          animation: float-anonymous 5.5s ease-in-out infinite;
          will-change: transform;
        }

        .animate-float-delayed {
          animation: float-request 6.5s ease-in-out infinite;
          will-change: transform;
          animation-delay: -2s; /* Offsets animation timing so they never move together */
        }

        .animate-float-slow:hover,
        .animate-float-delayed:hover {
          animation-play-state: paused;
        }

        .hover-card-trigger {
          transition: transform 250ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 250ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .animate-float-slow:hover .hover-card-trigger {
          transform: translate3d(0, -6px, 0) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .animate-float-delayed:hover .hover-card-trigger {
          transform: translate3d(0, -6px, 0) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-delayed {
            animation: none !important;
          }
          .hover-card-trigger {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="w-full flex flex-col overflow-x-hidden bg-[#FAF9F6] font-sans">

        {/* ── HERO ─────────────────────────────────── */}
        <section className="homepage-section hero-section relative w-full min-h-[calc(100vh-80px)] bg-slate-50 overflow-hidden pt-24 pb-20 md:pb-28">
          <div className="absolute inset-0 opacity-[0.6]" style={{ background: 'radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)' }} />

          <Reveal className="reveal-hero relative w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              <div className="lg:col-span-6 text-left z-10 space-y-8 md:space-y-10 mt-2 md:mt-10">
                <div className="inline-flex items-center gap-2.5 text-violet-800 bg-violet-100/80 border border-violet-200 px-5 py-2 rounded-full shadow-sm hero-animate">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    Join 10+ kind souls making a difference
                  </span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl xl:text-[80px] text-slate-950 leading-[0.95] tracking-tight hero-animate hero-animate-delay-1">
                  A kinder world<br />
                  <span className="text-violet-600 italic">starts with
                    a single message.</span><br />
                </h1>

                <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-normal hero-animate hero-animate-delay-2">
                  Share anonymous kindness, connect with others, and brighten someone's day — no judgment, just warmth.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 hero-animate hero-animate-delay-3">
                  <button
                    onClick={() =>
                      userHandle
                        ? router.push("/dashboard")
                        : window.dispatchEvent(new Event("open-register-modal"))
                    }
                    className="group inline-flex items-center justify-center gap-2.5 text-base font-semibold text-white px-6 py-4 rounded-full bg-violet-600 hover:bg-violet-700 transition-all duration-300 shadow-lg shadow-violet-200 active:scale-[0.98]"
                  >
                    Start Spreading Kindness
                  </button>
                </div>
              </div>

              {/*floating cards*/}
              <div className="lg:col-span-6 relative h-[320px] md:h-[600px] w-full mt-6 lg:mt-0 flex items-center justify-center lg:justify-end">
                <div className="absolute -top-0 lg:top-28 -top-8 right-0 md:right-10 lg:-right-5 z-20 w-[300px] md:w-[350px] animate-float-slow hero-animate hero-animate-delay-4">
                  <div className="relative bg-white p-7 rounded-3xl shadow-xl border border-slate-100 space-y-8 hover-card-trigger">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-violet-100" />
                        <div>
                          <p className="text-sm font-semibold text-slate-950">Anonymous Soul</p>
                          
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 bg-violet-50/50 px-2 py-1 rounded-full">
                        <span className="text-sm text-violet-400">♡</span>
                        <span className="text-xs font-medium text-violet-800">24+</span>
                      </div>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed">
                      "You are exactly where you need to be. This moment is temporary, but your light is permanent."
                    </p>

                  </div>
                </div>

                <div className="hidden md:block absolute bottom-20 md:bottom-32 left-0 md:left-10 z-30 w-[260px] md:w-[290px] animate-float-delayed hero-animate hero-animate-delay-5">
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-3 hover-card-trigger">
                    <div className="flex items-center gap-2.5 text-amber-600">
                      <span className="text-sm">★</span>
                      <p className="text-[11px] font-semibold uppercase tracking-wider">Today's Request</p>
                    </div>
                    <p className="text-sm text-slate-800 leading-snug font-medium">
                      Respond to someone who wants to connect with you.
                    </p>

                  </div>
                </div>


                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-100/60 rounded-full blur-[100px] opacity-50 z-0"></div>

                <div className="absolute -bottom-8 right-0 z-40 flex items-center gap-3 bg-violet-700 text-white px-4 py-3 rounded-full shadow-lg shadow-violet-300/60">
                  <span className="text-sm font-medium">5+ bottles dropped today</span>
                </div>

              </div>
              {/*floating cards end*/}
            </div>
          </Reveal>
        </section>

        {/* ── PHILOSOPHY DIVIDER ───────────────── */}
        <section className="relative w-full overflow-hidden py-2">

          <div className="
    w-full
    bg-gradient-to-r
    from-violet-100
    via-purple-20
    to-pink-20
    py-3
    opacity-80
  ">

            <div className="flex animate-marquee whitespace-nowrap">

              {[
                "Anonymous by design",
                "Human by nature",
                "Simple by choice",
                "Safe expression",
                "Real emotions",
                "No pressure",
              ]
                .concat([
                  "Anonymous by design",
                  "Human by nature",
                  "Simple by choice",
                  "Safe expression",
                  "Real emotions",
                  "No pressure",
                ])
                .map((item, index) => (
                  <span
                    key={index}
                    className="
              mx-12
              text-xl
              md:text-2xl
              font-serif
              text-black/80
            "
                  >
                    {item}
                  </span>
                ))}

            </div>

          </div>

        </section>


        <DiscoverSection />


        {/* ── HOW TO USE ─────────────────────────── */}
        <div className="homepage-section how-to-use-wrapper">
          <HowToUseSection />
        </div>

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />

        {/* ── values ─────────────────────────── */}
        <section className="homepage-section w-full py-24 bg-white">
          <Reveal className="reveal-testimonials w-full max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-left md:text-center mb-16 space-y-4">
              <p className="text-[11px] font-serif bold uppercase tracking-widest text-violet-600">OUR VALUES</p>
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                One Small Action.<br />
                <span className="text-violet-600 italic">A Lasting Ripple.</span>
              </h2>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "💜",
                  title: "Anonymous by Design",
                  description:
                    "Kindness is shared without profiles, followers, or expectations.",
                },
                {
                  icon: "🌍",
                  title: "Built for Everyone",
                  description:
                    "Send and receive messages from people anywhere in the world.",
                },
                {
                  icon: "🕊️",
                  title: "A Safe Space",
                  description:
                    "Every interaction is designed to encourage empathy and respect.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:border-violet-100 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif semibold text-slate-950 mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>



        {/* ── COMMUNITY GUIDELINES ─────────────────── */}
        <section className="homepage-section w-full py-24 bg-white border-t border-slate-100">
          <Reveal className="reveal-guidelines w-full max-w-7xl mx-auto px-6">

            {/* Heading Section */}
            <div className="mb-16 space-y-4 text-left md:text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">OUR GUIDELINES</p>
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">

             Please<span className="text-violet-600 italic"> avoid the following</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl ml-0 mr-auto md:mx-auto leading-relaxed">
                To keep KindSphere a place worth returning to, we ask everyone to avoid:
              </p>
            </div>

            {/* Guidelines Container */}
            <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              <div className="flex md:grid md:grid-cols-3 min-w-max md:min-w-0 border-y border-slate-200">
                {GUIDELINES.map((item, index) => (
                  <div
                    key={index}
                    className={`
          flex-none w-[260px] md:w-auto
          px-8 py-8
          border-r border-slate-200
          ${index === 0
                        ? "border-l border-slate-200"
                        : ""
                      }
          transition-all duration-300
          hover:bg-slate-50
        `}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal className="reveal-guidelines">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-violet-100 bg-gradient-to-br from-[#fcfbff] via-[#f8f6ff] to-[#fffdfb] px-8 py-20 text-center">

            {/* Soft Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_55%)]" />
            <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">

              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-xs font-serif semibold uppercase tracking-[0.2em] text-orange-500">
                ✨ Our Purpose
              </span>

              <h2 className="mt-8 text-5xl font-serif bold leading-tight text-slate-900">
                The world needs
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text italic text-transparent">
                  you & your kindness
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
             Not every thought is easy to share. KindSphere lets you express yourself anonymously—no names, no identities, just a safe space to be heard.
              </p>
              <Link href="/dashboard">
                <button className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(124,58,237,0.35)]">
                  Start Sharing Anonymously
                </button>
              </Link>
            </div>
          </section>
        </Reveal>

        {/* ── FOOTER ───────────────────── */}
        <section
          className="w-full relative overflow-hidden border-t border-black/10 rounded-t-[40px] pt-10 pb-6"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)'
          }}
        >
          <Reveal className="reveal-footer w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

            {/* Footer Links */}
            <div className="grid grid-cols-1 md:grid-cols-4 mb-10 -ml-5">

              {/* About */}
              <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
                <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                  About
                </h4>

                <p className="text-[14px] text-black/70 leading-relaxed max-w-[220px]">
                  KindSphere is a safe haven built to inspire daily kindness, one anonymous
                  drop at a time.
                </p>
              </div>

              {/* Mission */}
              <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
                <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                  Our Mission
                </h4>

                <ul className="space-y-2">
                  {[
                    "Anonymous by Design",
                    "Built on Kindness",
                    "Meaningful Connections",
                    "Safe & Respectful Community",
                    "Honest Conversations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-purple-500 text-[9px] mt-[7px]">◆</span>

                      <span className="text-[14px] text-black/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore */}
              <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
                <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                  Explore
                </h4>

                <div className="flex flex-col gap-2">
                  {[
                    "Home",
                    "Shore",
                    "Drop a Bottle",
                    "My Drift",
                    "The Sphere",
                  ].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[14px] text-black hover:text-purple-600 transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Creator */}
              <div className="w-full px-6 py-8 hover:bg-violet-900/30 transition-colors duration-300">
                <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                  Creator
                </h4>

                <div className="flex flex-col gap-2">
                  <p className="text-[14px] text-black/80 font-medium">
                    Saleha Zeeshan
                  </p>

                  <a
                    href="https://github.com/saleha294"
                    target="_blank"
                    className="text-[14px] text-black hover:text-purple-600 transition"
                  >
                    GitHub
                  </a>

                  <a
                    href="mailto:salehacorner@gmail.com"
                    className="text-[14px] text-black hover:text-purple-600 transition"
                  >
                    Gmail
                  </a>
                </div>
              </div>

            </div>
            {/*branding*/}
            <div className="flex flex-col items-start md:items-center text-left md:text-center -mt-4 mb-2">

              <h2 className="font-serif text-4xl md:text-5xl tracking-wide">
                <span className="text-black">Kind</span>
                <span className="text-purple-600 italic">Sphere</span>
              </h2>

              <p className="mt-1 text-sm text-black/70">
                A kinder world starts with you.
              </p>

            </div>

            <div className="pt-4 border-t border-black/10 flex flex-col items-start md:items-center gap-2 text-left md:text-center">

              <p className="text-[10px] text-black/60 uppercase tracking-widest">
                © {new Date().getFullYear()} KindSphere. All rights reserved ♥ For my lovely friend - Fatima
              </p>

              <div className="flex items-center gap-1 text-[11px] uppercase tracking-widest">

              </div>

            </div>

          </Reveal>
        </section>
      </div>
    </>
  );
}