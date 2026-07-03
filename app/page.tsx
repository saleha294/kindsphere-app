"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
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
const HOW_STEPS = [
  {
    image: "/assets/imagery/dropyourbottle.png",
    alt: "Step 1",
    step: "01",
    heading: "Drop your bottle anonymously.",
    body: "Write whatever is weighing on you — a decision, a feeling, a question you can't ask anyone in your life. No name required. Just your words, set free.",
  },
  {
    image: "/assets/imagery/receiveperspectives.jpg",
    alt: "Step 2",
    step: "02",
    heading: "Receive gentle perspectives.",
    body: "From across the ocean or your own neighbourhood, thoughtful people offer quiet words. No debates — just human connection and shared insight.",
  },
  {
    image: "/assets/imagery/savorconnection.png",
    alt: "Step 3",
    step: "03",
    heading: "Savor the quiet connection.",
    body: "Every shared word is a reminder that we are all walking slightly lighter by simply listening and being heard.",
  },
] as const;

const SPHERES = [
  {
    image: "/assets/imagery/anonymous.png",
    alt: "Anonymous by Design",
    title: "Anonymous by Design",
    body: "No profiles, no histories, no judgements. Your real identity is stripped away the moment you enter.",
    accent: "#8B5CF6",
    tint: "rgba(139,92,246,0.07)",
  },
  {
    image: "/assets/imagery/globalreach.png",
    alt: "Global Reach",
    title: "Global Reach",
    body: "Drop a digital bottle and receive perspectives from every corner of the world.",
    accent: "#A78BFA",
    tint: "rgba(167,139,250,0.09)",
  },
  {
    image: "/assets/imagery/realgrowth.png",
    alt: "Real Growth",
    title: "Real Growth",
    body: "Experience the quiet clarity that comes when strangers offer honest kindness without expectation.",
    accent: "#A8DADC",
    tint: "rgba(168,218,220,0.12)",
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

        /* Hover lift on cards */
        .card-lift {
          transition: box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(28,37,65,0.08);
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
          {/* Content — centered block */}
          <div
            className="px-5 md:px-20 pt-12 pb-16"
            style={{
              width: "100%",
              maxWidth: "72rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
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
              <em className="not-italic" style={{ color: "#6D28D9" }}>
                single message.
              </em>
            </h1>

            {/* sub-headline */}
            <p
              className="text-[15px] leading-[1.75]"
              style={{ color: "#374151", maxWidth: "22rem" }}
            >
              KindSphere is a safe, anonymous place to share your thoughts, spread kindness, and remind each other that we're never alone.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
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
                <span className="text-[#6D28D9]/30">•</span>
              </div>
            ))}
          </div>
        </section>


        {/* ── WHAT YOU CAN DO ─────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            {/* Section header — left aligned */}
            <Reveal className="mb-14 space-y-3 text-left">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight">
                Your Guide to{" "}
                <span className="text-[#6D28D9]">Spread Kindness</span>
              </h2>
              <p className="text-[17px] text-stone-500 leading-relaxed max-w-lg">
                Small acts of kindness can brighten someone's world.
              </p>
            </Reveal>

            {/* 4-card grid — 2 cols on sm, 4 cols on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

              {/* Card 1 — Share Anonymously */}
              <Reveal delay={0}>
                <div className="card-lift bg-white rounded-3xl border border-stone-200/60 shadow-sm p-5 md:p-7 flex flex-col items-start gap-5 min-h-[280px] h-full">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0 flex items-center justify-center">
                    <img
                      src="/assets/imagery/chat.png"
                      alt="Share Anonymously"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-sans text-xl font-semibold text-[#1C2541] leading-snug">
                      Share Anonymously
                    </p>
                    <p className="font-sans text-sm leading-[1.7] text-stone-500">
                      Share your thoughts, feelings, or stories without revealing your identity.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 2 — Send Kind Messages */}
              <Reveal delay={80}>
                <div className="card-lift bg-white rounded-3xl border border-stone-200/60 shadow-sm p-5 md:p-7 flex flex-col items-start gap-5 min-h-[280px] h-full">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0 flex items-center justify-center">
                    <img
                      src="/assets/imagery/heart.png"
                      alt="Send Kind Messages"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-sans text-xl font-semibold text-[#1C2541] leading-snug">
                      Send Kind Messages
                    </p>
                    <p className="font-sans text-sm leading-[1.7] text-stone-500">
                      Brighten someone's day with encouraging and kind words — anonymously.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 3 — Throw a Bottle */}
              <Reveal delay={160}>
                <div className="card-lift bg-white rounded-3xl border border-stone-200/60 shadow-sm p-5 md:p-7 flex flex-col items-start gap-5 min-h-[280px] h-full">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0 flex items-center justify-center">
                    <img
                      src="/assets/imagery/bottle.png"
                      alt="Throw a Bottle"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-sans text-xl font-semibold text-[#1C2541] leading-snug">
                      Throw a Bottle
                    </p>
                    <p className="font-sans text-sm leading-[1.7] text-stone-500">
                      Send your message out into the world and let someone find it.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card 4 — Feel Connected */}
              <Reveal delay={240}>
                <div className="card-lift bg-white rounded-3xl border border-stone-200/60 shadow-sm p-5 md:p-7 flex flex-col items-start gap-5 min-h-[280px] h-full">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0 flex items-center justify-center">
                    <img
                      src="/assets/imagery/connect.png"
                      alt="Feel Connected"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-sans text-xl font-semibold text-[#1C2541] leading-snug">
                      Feel Connected
                    </p>
                    <p className="font-sans text-sm leading-[1.7] text-stone-500">
                      You're not alone. Kindness from strangers can make all the difference.
                    </p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── HOW TO USE ─────────────────────────── */}
        <HowToUseSection />

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />



        {/* ── ABOUT ───────────────────────────────── */}
        <section className="w-full py-20 md:py-28 bg-[#FDFBF7]">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-12">

              <Reveal className="flex-1 max-w-xl space-y-6 text-left">
                <Eyebrow>About this project</Eyebrow>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight">
                  Built on the belief that{" "}
                  <span className="text-[#6D28D9]">honest words</span> change people.
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
        <section className="w-full py-20 md:py-28 border-t border-stone-200/40">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
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
                  <Eyebrow>Community guidelines</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight">
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
        <section className="w-full bg-[#111827] relative overflow-hidden border-t border-white/5 rounded-t-[40px] pt-16 pb-8">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} />

          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

              {/* Brand Column */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-white">KindSphere</h2>
                <p className="text-[12px] text-stone-400 leading-relaxed">
                  Anonymous Support Platform<br /><br />
                  A safe place where thoughts drift anonymously, kindness finds strangers, and meaningful connections begin.
                </p>
                <div className="pt-2">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-2">Created by Saleha Zeeshan</p>
                  <div className="flex gap-4">
                    {['LinkedIn', 'Portfolio', 'GitHub'].map((social) => (
                      <a key={social} href="#" className="text-[11px] text-stone-300 hover:text-purple-400 transition-colors uppercase">
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nav Column */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-widest pt-[2px]">Platform</h4>
                <div className="flex gap-8">
                  <ul className="space-y-2">
                    {['Home', 'Shore', 'Drop a Bottle', 'My Drift', 'The Sphere'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-[12px] text-stone-400 hover:text-white transition-colors">{item}</a>
                      </li>
                    ))}
                  </ul>
                  {/* Creator — to the right of Platform links on mobile */}
                  <div className="md:hidden shrink-0">
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-[3px] border-white/10 shadow-[0_15px_40px_rgba(124,58,237,0.25)]">
                        <img
                          src="/assets/imagery/owner.png"
                          alt="Saleha Zeeshan"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Column — desktop only, right-aligned, vertically centered */}
              <div className="hidden md:flex md:justify-end md:items-center">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-[3px] border-white/10 shadow-[0_15px_40px_rgba(124,58,237,0.25)]">
                    <img
                      src="/assets/imagery/owner.png"
                      alt="Saleha Zeeshan"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-600 uppercase tracking-widest">
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