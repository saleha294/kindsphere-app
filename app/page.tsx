"use client";

import Link from "next/link";
import { useEffect, useRef, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterUser from "@/components/RegisterUser";
import HowToUseSection from "@/components/HowToUseSection";


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
  "Racism & Hate Speech",
  "Bullying & Harassment",
  "Personal Attacks or Nudity",
  "Passive-Aggressive Tone",
  "Spam & Self-Promotion",
  "Explicit or Offensive Content",
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
  const router = useRouter();

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

        /* Testimonials Reveal ("STORIES FROM OUR COMMUNITY") */
        .reveal-testimonials {
          transform: translate3d(30px, 0, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-testimonials.revealed {
          transform: translate3d(0, 0, 0);
        }

        /* Guidelines Reveal ("A safe space, held gently...") */
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
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
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
          
          .homepage-section .mt-16.flex.justify-center {
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
        <section className="homepage-section relative w-full min-h-[calc(100vh-80px)] bg-slate-50 overflow-hidden pt-24 pb-20 md:pb-28">
          <div className="absolute inset-0 opacity-[0.6]" style={{ background: 'radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)' }} />

          <Reveal className="reveal-hero relative w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              <div className="lg:col-span-6 text-left z-10 space-y-8 md:space-y-10">
                <div className="inline-flex items-center gap-2.5 text-violet-800 bg-violet-100/80 border border-violet-200 px-5 py-2 rounded-full shadow-sm">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-xs font-medium tracking-wide uppercase">
                    Join 50+ kind souls making a difference
                  </span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl xl:text-[80px] text-slate-950 leading-[0.95] tracking-tight">
                  A kinder world<br />
                  <span className="text-violet-600 italic">starts with
                    a single message.</span><br />
                </h1>

                <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-normal">
                  Share anonymous kindness, connect with others, and brighten someone's day — no judgment, just warmth.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-register-modal"))}
                    className="group inline-flex items-center justify-center gap-2.5 text-base font-semibold text-white px-6 py-4 rounded-full bg-violet-600 hover:bg-violet-700 transition-all duration-300 shadow-lg shadow-violet-200 active:scale-[0.98]"
                  >
                    Start Spreading Kindness
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-white px-8 py-4 text-base font-semibold text-violet-900 shadow-sm transition-all duration-300 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md"
                  >
                    Explore KindSphere
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 relative h-[450px] md:h-[600px] w-full mt-10 lg:mt-0 flex items-center justify-center lg:justify-end">
                <div className="absolute top-0 right-0 md:right-10 lg:-right-5 z-20 w-[300px] md:w-[350px] animate-float-slow">
                  <div className="relative bg-white p-7 rounded-3xl shadow-xl border border-slate-100 space-y-5 hover-card-trigger">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-violet-100" />
                        <div>
                          <p className="text-sm font-semibold text-slate-950">Anonymous Soul</p>
                          <p className="text-xs text-slate-400">just now</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 bg-violet-50/50 px-3 py-1 rounded-full">
                        <span className="text-sm text-violet-400">♡</span>
                        <span className="text-xs font-medium text-violet-800">24+</span>
                      </div>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed">
                      "You are exactly where you need to be. This moment is temporary, but your light is permanent."
                    </p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <button className="text-slate-600 font-medium hover:text-violet-600">Share kindness →</button>
                      <span className="text-slate-400">•••</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 md:bottom-32 left-0 md:left-10 z-30 w-[260px] md:w-[290px] animate-float-delayed">
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-slate-100 space-y-3 hover-card-trigger">
                    <div className="flex items-center gap-2.5 text-amber-600">
                      <span className="text-sm">★</span>
                      <p className="text-[11px] font-semibold uppercase tracking-wider">Today's Request</p>
                    </div>
                    <p className="text-sm text-slate-800 leading-snug font-medium">
                      Respond to someone who wants to connect with you.
                    </p>
                    <button className="text-sm font-semibold text-violet-700 hover:text-violet-800 pt-1.5">Accept request?</button>
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-50 text-violet-400/60 text-xl rotate-12">
                      ✦
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-100/60 rounded-full blur-[100px] opacity-50 z-0"></div>

                <div className="absolute -bottom-8 right-0 z-40 flex items-center gap-3 bg-violet-700 text-white px-4 py-3 rounded-full shadow-lg shadow-violet-300/60">
                  <span className="text-sm font-medium">5+ bottles dropped today</span>
                </div>
              </div>
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

        {/* ── Discover KindSphere ─────────────────────── */}
        <section className="homepage-section w-full py-24 bg-slate-50 py-2">
          <Reveal className="reveal-kindness-feed w-full max-w-7xl mx-auto px-6">

            {/* Section Header */}
            <div className="text-left md:text-center mb-8 space-y-4">
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                Everything you need to<br />
                <span className="text-violet-600 italic">spread kindness</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl ml-0 mr-auto md:mx-auto leading-relaxed">
                Built for people who believe small acts of kindness create enormous waves of positive change.
              </p>
            </div>

            {/* Cards Container */}
            {/* flex (horizontal scroll) on mobile, grid on desktop */}
            <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">

              {/* Card 1: Purple Tint */}
              <div className="flex-none w-[280px] md:w-auto snap-center bg-[#F5F3FF] border border-[#E0D7FF] rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-violet-600 shadow-sm">
                  <span className="text-xl">🔒</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-violet-800">Private & Safe</p>
                  <h3 className="font-serif text-2xl text-slate-950">Anonymous Kindness</h3>
                  <p className="text-slate-600 leading-relaxed">Share kind messages, encouragement, and warmth without revealing who you are. Pure kindness, no strings attached.</p>
                </div>
              </div>

              {/* Card 2: Gold Tint */}
              <div className="flex-none w-[280px] md:w-auto snap-center bg-[#FEF9EC] border border-[#FDEFC8] rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                  <span className="text-xl">🏆</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-amber-800">Daily Missions</p>
                  <h3 className="font-serif text-2xl text-slate-950">Kindness Challenges</h3>
                  <p className="text-slate-600 leading-relaxed">Daily micro-challenges that inspire small acts of kindness — from writing a gratitude note to complimenting a stranger.</p>
                </div>
              </div>

              {/* Card 3: Pink Tint */}
              <div className="flex-none w-[280px] md:w-auto snap-center bg-[#FDF2F4] border border-[#F9E1E5] rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
                  <span className="text-xl">💬</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-rose-800">Real Moments</p>
                  <h3 className="font-serif text-2xl text-slate-950">Community Stories</h3>
                  <p className="text-slate-600 leading-relaxed">Read uplifting stories from people around the world who chose kindness and changed someone's day forever.</p>
                </div>
              </div>

              {/* Card 4: White/Neutral Tint */}
              <div className="flex-none w-[280px] md:w-auto snap-center bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-sm">
                  <span className="text-xl">🌐</span>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-800">Measured Warmth</p>
                  <h3 className="font-serif text-2xl text-slate-950">Positive Impact</h3>
                  <p className="text-slate-600 leading-relaxed">Track how your anonymous kindness ripples outward. See the collective impact of a global community choosing love.</p>
                </div>
              </div>

            </div>
          </Reveal>
        </section>

        {/* ── HOW TO USE ─────────────────────────── */}
        <div className="homepage-section">
          <HowToUseSection />
        </div>

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />

        {/* ── testimonials ─────────────────────────── */}
        <section className="homepage-section w-full py-24 bg-white">
          <Reveal className="reveal-testimonials w-full max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-left md:text-center mb-16 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">STORIES FROM OUR COMMUNITY</p>
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                Real people,<br />
                <span className="text-violet-600 italic">real moments</span>
              </h2>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I was having the worst week of my life. Then a stranger's message appeared: 'Your storm will pass, and the sun is already waiting.' I cried for 20 minutes straight — but they were good tears.",
                  name: "Maria T.",
                  role: "Teacher, Portugal",
                  initials: "MT"
                },
                {
                  quote: "KindSphere gave me a way to act on my values quietly. I write a message every morning before work. It's become a meditation. The anonymity makes it feel pure — no likes, no followers, just kindness.",
                  name: "James O.",
                  role: "Designer, Toronto",
                  initials: "JO"
                },
                {
                  quote: "I've never seen anything like it. My students started sharing it with each other during lunch. A whole cafeteria of teenagers quietly sending kind messages to strangers. It brought me to tears.",
                  name: "Dr. Sarah L.",
                  role: "School Counselor, Melbourne",
                  initials: "SL"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg hover:border-violet-100">
                  <div className="space-y-6">
                    {/* Stars */}
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-slate-700 leading-relaxed text-lg italic">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.role}</p>
                    </div>
                  </div>
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
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                A safe space, <span className="text-violet-600 italic">held gently by all of us.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl ml-0 mr-auto md:mx-auto leading-relaxed">
                To keep KindSphere a place worth returning to, we ask everyone to avoid:
              </p>
            </div>

            {/* Guidelines Container - Flexbox with horizontal scrolling on mobile */}
            <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              {GUIDELINES.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-[280px] md:w-auto snap-center bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4 transition-all hover:border-violet-200 hover:bg-white hover:shadow-md"
                >
                  {/* Bullet Indicator */}
                  <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0 mt-2" />

                  {/* Guideline Text */}
                  <span className="text-slate-800 text-sm md:text-base leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── FOOTER ───────────────────── */}
        <section
          className="w-full relative overflow-hidden border-t border-black/10 rounded-t-[40px] pt-10 pb-6"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)",
          }}
        >
          <Reveal className="reveal-footer w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

            {/* Footer Links */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start">

              {/* Mission */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-black uppercase tracking-widest">
                  Our Mission
                </h4>

                <ul className="space-y-1.5">
                  {[
                    "Anonymous by Design",
                    "Built on Kindness",
                    "Meaningful Connections",
                    "Safe & Respectful Community",
                    "Honest Conversations",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-purple-500 text-[9px]">◆</span>
                      <span className="text-[12px] text-black/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Creator */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-black uppercase tracking-widest">
                  Creator
                </h4>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[12px] text-black/80 font-medium">Saleha Zeeshan</p>
                  <a
                    href="https://github.com/saleha294"
                    target="_blank"
                    className="text-[12px] text-black hover:text-purple-600 transition"
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:salehacorner@gmail.com"
                    className="text-[12px] text-black hover:text-purple-600 transition"
                  >
                    Gmail
                  </a>
                </div>
              </div>

              {/* Explore */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-black uppercase tracking-widest">
                  Explore
                </h4>

                <div className="flex flex-col gap-1.5">
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
                      className="text-[12px] text-black hover:text-purple-600 transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* About Column */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-black uppercase tracking-widest">
                  About
                </h4>
                <p className="text-[12px] text-black/70 leading-relaxed max-w-[200px]">
                  KindSphere is a safe haven built to inspire daily kindness, one anonymous drop at a time.
                </p>
              </div>

            </div>

            {/* Brand */}
            <div className="flex flex-col items-start md:items-center mb-6 text-left md:text-center">

              <img
                src="/favicon.ico"
                alt="KindSphere Logo"
                className="w-12 h-12 md:w-16 md:h-16 mb-2 mx-0 md:mx-auto"
              />

              <h2 className="font-serif text-4xl md:text-5xl tracking-wide">
                <span className="text-black">Kind</span>
                <span className="text-purple-600">Sphere</span>
              </h2>

              <p className="mt-1 text-sm text-black/70">
                A kinder world starts with you.
              </p>

            </div>

            {/* Bottom */}
            <div className="pt-4 border-t border-black/10 flex flex-col items-start md:items-center gap-2 text-left md:text-center">

              <p className="text-[10px] text-black/60 uppercase tracking-widest">
                © {new Date().getFullYear()} KindSphere. All rights reserved.
              </p>

              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-black">
                <span>Stay Kind. Stay Hopeful.</span>
                <span className="text-purple-600">♥</span>
              </div>

            </div>

          </Reveal>
        </section>
      </div>
    </>
  );
}