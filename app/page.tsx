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
      { threshold: 0.12 }
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
          transform: translateY(18px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }
        .reveal-wrap.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-wrap { opacity: 1; transform: none; transition: none; }
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
      `}</style>

      <div className="w-full flex flex-col overflow-x-hidden bg-[#FAF9F6] font-sans">

        {/* ── HERO ─────────────────────────────────── */}
        <section
          className="ks-hero"
          style={{
            width: "100%",
            minHeight: "calc(100vh - 80px)",
            marginTop: "0",
            paddingTop: "80px",
            backgroundImage: "url('/assets/imagery/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Content */}
          <div
            className="px-6 md:px-20 pt-12 pb-16 items-start md:items-center text-left md:text-center"
            style={{
              width: "100%",
              maxWidth: "72rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* eyebrow pill */}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(139,92,246,0.15)",
                color: "#5B21B6",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              ✦ Anonymous · Global · Kind
            </span>

            {/* headline */}
            <h1
              className="font-serif leading-[1.07] tracking-tight"
              style={{
                fontSize: "clamp(2.4rem, 4.8vw, 3.6rem)",
                color: "#1C1240",
              }}
            >
              A kinder world<br />
              starts with a<br />
              <em className="not-italic" style={{ color: "#7C3AED" }}>
                single message.
              </em>
            </h1>

            {/* sub-headline */}
            <p
              className="text-[15px] leading-[1.75] w-full"
              style={{ color: "#374151", maxWidth: "22rem" }}
            >
              KindSphere is a safe, anonymous place to share your thoughts, spread kindness, and remind each other that we're never alone.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center justify-start md:justify-center gap-3 w-full">
              <button
                onClick={() => window.dispatchEvent(new Event("open-register-modal"))}
                className="hero-join-btn inline-flex items-center gap-2 text-sm font-semibold text-white px-7 py-3.5 rounded-full cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)",
                  boxShadow: "0 8px 28px rgba(109,40,217,0.35)",
                }}
              >
                ✦ Join KindSphere
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  color: "#5B21B6",
                  border: "1.5px solid rgba(109,40,217,0.35)",
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                ♡ Leave a Kindness
              </button>
            </div>

            {/* tagline */}
            <p
              className="text-[13px] italic"
              style={{ color: "rgba(109,40,217,0.6)", fontFamily: "var(--font-dm-serif)" }}
            >
              You are more connected than you think… ♡
            </p>
          </div>
        </section>


        {/* ── PHILOSOPHY MARQUEE ──────────────────── */}
        <section className="relative z-10 w-full py-16 overflow-hidden px-5 md:px-0">
          <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
            {[
              "Wellbeing", "Friendship", "Kindness", "Conversation", "Safe",
              "Connection", "Humanity", "Kindness", "Secure", "Private"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-12">
                <span className="text-xl font-serif text-[#4A5D4E] opacity-70">
                  {item}
                </span>
                <span className="text-[#7C3AED]/30">•</span>
              </div>
            ))}
          </div>
        </section>

        {/* ──Discover KindSphere ─────────────────────── */}
        <section className="w-full py-20 md:py-24">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            {/* Section header — centered on desktop with lines, left-aligned on mobile */}
            <Reveal className="mb-10 space-y-3">
              <div className="flex items-center gap-4">
                <span className="hidden md:block h-px flex-1 bg-stone-300" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight shrink-0">
                  Discover{" "}
                  <span className="text-[#7C3AED]">KindSphere</span>
                </h2>
                <span className="hidden md:block h-px flex-1 bg-stone-300" />
              </div>
              <p className="text-[17px] text-stone-500 leading-relaxed max-w-lg text-left md:text-center md:mx-auto">
                Dive into the features that make KindSphere a unique space for connection and kindness.
              </p>
            </Reveal>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {DiscoverKindSphereData.map((step, index) => (
                <Reveal key={step.number} delay={index * 80} className="w-full">
                  <div
                    className="
              group relative overflow-hidden
              bg-gradient [color:#ffffff]
              border border-[#DCCFF7]
              rounded-[2rem] p-7
              flex flex-col items-start text-left gap-5
              h-full w-full max-w-[280px] sm:max-w-none               shadow-[0_1px_2px_rgba(109,40,217,0.04)]
              transition-all duration-300
              hover:border-[#C4AFF2] hover:shadow-[0_8px_24px_rgba(109,40,217,0.10)]
            "
                  >
                    {/* eyebrow + icon badge row */}
                    <div className="flex items-center justify-between w-full">

                      <div
                        className="
                  w-24 h-24 rounded-2xl shrink-0
                  bg-white/70 border border-[#DCCFF7]
                  flex items-center justify-center
                  shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]
                "
                      >
                        {step.image ? (
                          <img
                            src={step.image}
                            alt={step.alt}
                            className="w-12 h-12 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#DCCFF7]/40" />
                        )}
                      </div>
                    </div>

                    {/* title + body */}
                    <div className="space-y-2.5">
                      <p className="font-sans text-[18px] font-semibold text-[#2E1F52] leading-[1.3]">
                        {step.title}
                      </p>
                      <p className="font-sans text-[14px] leading-[1.7] text-[#6E6288]">
                        {step.body}
                      </p>
                    </div>

                    {/* soft ambient glow accent, like the dot in the reference */}
                    <div
                      className="
                pointer-events-none absolute -bottom-6 -right-6
                w-24 h-24 rounded-full
                bg-[#B79EF0]/25 blur-2xl
              "
                    />
                  </div>
                </Reveal>


              ))}
            </div>

            {/* Explore More CTA */}
            <Reveal delay={320} className="mt-10">
              <div className="text-left md:text-center max-w-2xl md:mx-auto space-y-4">
                <p className="text-[15px] md:text-base leading-7 text-stone-500">
                  And that's only the beginning.
                </p>

                <button
                  onClick={() => setShowRegister(true)}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)",
                    boxShadow: "0 8px 28px rgba(109,40,217,0.28)",
                  }}
                >
                  Explore More Features
                </button>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── HOW TO USE ─────────────────────────── */}
        <HowToUseSection />

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />



        {/* ── ABOUT ───────────────────────────────── */}
        <section className="w-full py-20 md:py-24 bg-[#FDFBF7]">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            {/* Desktop heading */}
            <div className="hidden md:block mb-8 space-y-2">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-stone-300" />
                <h2 className="font-serif text-4xl text-[#1C2541] leading-tight shrink-0">
                  Why{" "}
                  <span className="text-[#7C3AED]">KindSphere Exists</span>
                </h2>
                <span className="h-px flex-1 bg-stone-300" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-12">

              <Reveal className="flex-1 max-w-xl space-y-6 text-left">

                <h2 className="font-serif text-3xl md:hidden text-[#1C2541] leading-tight">
                  Why{" "}
                  <span className="text-[#7C3AED]">KindSphere Exists</span>
                </h2>

                {/* Glassmorphic quote card */}
                <div
                  className="relative rounded-2xl px-6 py-5 mt-1"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    boxShadow: "0 4px 24px rgba(139,92,246,0.09)",
                  }}
                >
                  <div
                    className="absolute top-0 left-8 right-8 h-px rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent,rgba(139,92,246,0.3),transparent)",
                    }}
                  />
                  <p className="text-[14px] leading-[1.8] text-stone-600">
                    KindSphere was created with a simple belief:
                    the world feels a little brighter when people are kind to each other.

                    This is a space for anyone who needs to speak,
                    be heard, or spread a little hope.
                    You are not alone, there is a whole sphere of kind
                    people here with you.

                    Keep being kind. It matters more than you know.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} className="flex-1 flex justify-start md:justify-end">
                <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border border-stone-200/60 shadow-2xl bg-white shrink-0 md:-translate-x-[4%]">
                  <img
                    src="/assets/imagery/aboutthisproject.png"
                    alt="About the project"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY GUIDELINES ─────────────────── */}
        <section className="w-full py-20 md:py-24 border-t border-stone-200/40">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            {/* Desktop heading */}
            <div className="hidden md:block mb-8 space-y-2">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-stone-300" />
                <h2 className="font-serif text-4xl text-[#1C2541] leading-tight shrink-0">
                  A safe space,{" "}
                  <em className="text-[#8B5CF6]">held gently by all of us.</em>
                </h2>
                <span className="h-px flex-1 bg-stone-300" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

              {/* Image */}
              <Reveal delay={80} className="flex-1 w-full">
                <img
                  src="/assets/imagery/communityguidelines.png"
                  alt="Community Guidelines"
                  className="w-full h-auto rounded-2xl shadow-md object-cover"
                  loading="lazy"
                />
              </Reveal>

              {/* Text */}
              <Reveal className="flex-1 space-y-6 text-left w-full">
                <div className="space-y-2">

                  <h2 className="font-serif text-3xl md:hidden text-[#1C2541] leading-tight">
                    A safe space,{" "}
                    <em className="text-[#8B5CF6]">held gently by all of us.</em>
                  </h2>
                </div>

                <p className="text-[14px] text-stone-500 leading-relaxed">
                  To keep KindSphere a place worth returning to, we ask everyone
                  to avoid:
                </p>

                <div className="rounded-2xl border border-stone-200/60 bg-white px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {GUIDELINES.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                      <span className="text-[#1C2541] text-sm leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────── */}
        <section
          className="w-full relative overflow-hidden border-t border-white/5 rounded-t-[40px] pt-16 pb-8"
          style={{
            backgroundImage: "url('/assets/imagery/footer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-16">

              {/* Brand Column */}
              <div className="space-y-4">
                <h2 className="font-serif text-3xl text-white">KindSphere</h2>
                <p className="text-[12px] text-white leading-relaxed">
                  Anonymous Support Platform<br /><br />
                  A safe place where thoughts drift anonymously, kindness finds strangers, and meaningful connections begin.
                </p>
              </div>

              {/* Mission Column */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Our Mission</h4>
                <ul className="space-y-2">
                  {[
                    "Anonymous by Design",
                    "Built on Kindness",
                    "Meaningful Connections",
                    "Safe & Respectful Community",
                    "Honest Conversations",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-purple-400/60 text-[9px]">◆</span>
                      <span className="text-[12px] text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Creator Column */}
              <div className="space-y-4">
                <p className="text-[10px] text-white/70 uppercase tracking-widest">Created by Saleha Zeeshan</p>
                <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-1.5">
                  <a href="#" className="text-[11px] text-white hover:text-purple-300 transition-colors uppercase">LinkedIn</a>
                  <span className="md:hidden text-white/30 text-[10px]">•</span>
                  <a href="#" className="text-[11px] text-white hover:text-purple-300 transition-colors uppercase">Portfolio</a>
                  <span className="md:hidden text-white/30 text-[10px]">•</span>
                  <a href="#" className="text-[11px] text-white hover:text-purple-300 transition-colors uppercase">GitHub</a>
                  <span className="md:hidden text-white/30 text-[10px]">•</span>
                  <a href="#" className="text-[11px] text-white hover:text-purple-300 transition-colors uppercase">Gmail</a>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] text-white uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} KindSphere. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span>Stay Kind. Stay Hopeful.</span>
                <span className="text-purple-400 animate-pulse">♥</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}