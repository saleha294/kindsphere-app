"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, ReactNode } from "react";
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
    accent: "#E07A5F",
    tint: "rgba(224,122,95,0.07)",
  },
  {
    image: "/assets/imagery/globalreach.png",
    alt: "Global Reach",
    title: "Global Reach",
    body: "Drop a digital bottle and receive perspectives from every corner of the world.",
    accent: "#84A98C",
    tint: "rgba(132,169,140,0.09)",
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
  return (
    <>
      {/* Global animation styles — scoped to this page */}
      <style>{`
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
      `}</style>

      <div className="w-full flex flex-col overflow-x-hidden bg-[#FAF9F6] font-sans">

        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative w-full min-h-[92vh] flex items-center justify-center bg-[url('/assets/imagery/background.png')] bg-cover bg-center bg-no-repeat">
          {/* soft veil */}
          <div className="absolute inset-0 bg-[#FAF9F6]/80" />

          <div className="relative z-10 w-full max-w-2xl mx-auto px-8 py-28 flex flex-col items-start gap-7 md:items-center md:text-center">
            <Eyebrow>Anonymous · Global · Kind</Eyebrow>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.06] tracking-tight text-[#1C2541]">
              Be heard.<br />
              Be kind.<br />
              <em className="text-[#E07A5F] not-italic">Anonymously.</em>
            </h1>

            <p className="text-[15px] md:text-base text-stone-500 max-w-sm leading-relaxed">
              A quiet, humane corner of the internet where people send thoughts
              into the digital ocean — and receive honest kindness in return.
            </p>

            <Link
              href="/dashboard"
              className="mt-2 inline-flex items-center gap-2.5 rounded-xl bg-[#E07A5F] text-white text-sm font-semibold px-7 py-3.5 hover:opacity-90 active:scale-[0.97] transition-all min-h-[48px] shadow-sm"
            >
              Explore the Feed
              <span className="text-white/70 text-base leading-none">→</span>
            </Link>
          </div>



          {/* bottom fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />
        </section>


        {/* ── PHILOSOPHY MARQUEE ──────────────────── */}
        <section className="relative z-10 w-full #f7bb9bff py-16 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
            {/* We duplicate the array to ensure seamless looping */}
            {[
              "Wellbeing", "Friendship", "Kindness", "Conversation", "Safe & Secure",
              "Wellbeing", "Friendship", "Kindness", "Conversation", "Safe & Secure"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-12">
                <span className="text-xl font-serif text-[#4A5D4E] opacity-70">
                  {item}
                </span>
                <span className="text-[#4A5D4E]/30">•</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRINCIPLES (Spheres) ──────────────────── */}
        <section className="w-full bg-[#FDFBF7] py-20 md:py-28">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            <Reveal className="mb-16 space-y-2">
              <Eyebrow>Three principles</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-snug">
                Built on what{" "}
                <span className="text-[#E07A5F]">actually matters.</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {SPHERES.map((s, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Circle image */}
                    <div
                      className="sphere-img w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white shadow-md"
                      style={{ backgroundColor: s.tint, outline: `1px solid ${s.accent}25` }}
                    >
                      <img
                        src={s.image}
                        alt={s.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="space-y-2">
                      <div
                        className="inline-block w-6 h-0.5 rounded-full mx-auto"
                        style={{ backgroundColor: s.accent }}
                      />
                      <h3 className="font-serif text-xl text-[#1C2541]">{s.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed max-w-[240px] mx-auto">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />

        {/* ── HOW IT WORKS ────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

            <Reveal className="mb-16 space-y-2">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-snug">
                Three{" "}
                <em className="text-[#E07A5F]">quiet gestures.</em>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_STEPS.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card-lift group bg-white rounded-2xl overflow-hidden border border-stone-200/50 shadow-sm h-full flex flex-col">
                    {/* Image */}
                    <div className="w-full aspect-[4/3] overflow-hidden relative">
                      <img
                        src={step.image}
                        alt={step.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      {/* Step number badge */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-sans text-[10px] font-bold text-[#E07A5F] tracking-wider">
                          {step.step}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="px-6 py-6 flex-1 flex flex-col gap-2">
                      <p className="font-sans text-sm font-semibold text-[#1C2541] leading-snug">
                        {step.heading}
                      </p>
                      <p className="font-sans text-[13px] leading-[1.75] text-stone-500">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO USE ─────────────────────────── */}
        <HowToUseSection />

        <hr className="hairline mx-6 md:mx-12 lg:mx-auto lg:max-w-5xl" />

        {/* ── CORE PURPOSE ────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

              <Reveal className="flex-1 space-y-5 text-left">
                <Eyebrow>Our core purpose</Eyebrow>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-snug">
                  A sanctuary for{" "}
                  <em className="text-[#E07A5F]">honest growth.</em>
                </h2>
                <p className="text-[15px] leading-relaxed text-stone-500 max-w-sm">
                  KindSphere was built for those moments when we need real advice
                  but run into judgement. We strip away the noise of social media
                  so you can focus on genuine connection.
                </p>
              </Reveal>

              <Reveal delay={120} className="flex-1 flex justify-center">
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border border-stone-200/50 shadow-xl bg-white shrink-0">
                  <img
                    src="/assets/imagery/ourcorepurpose.png"
                    alt="Core Purpose"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── ABOUT ───────────────────────────────── */}
        <section className="w-full py-20 md:py-28 bg-[#FDFBF7]">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">

              <Reveal className="flex-1 space-y-5 text-left">
                <Eyebrow>About this project</Eyebrow>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-snug">
                  Built on the belief that{" "}
                  <span className="text-[#E07A5F]">honest words</span> change people.
                </h2>

                {/* Glassmorphic quote card */}
                <div
                  className="relative rounded-2xl px-6 py-5 mt-1"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(224,122,95,0.15)",
                    boxShadow: "0 4px 24px rgba(129,178,154,0.09)",
                  }}
                >
                  <div
                    className="absolute top-0 left-8 right-8 h-px rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent,rgba(224,122,95,0.3),transparent)",
                    }}
                  />
                  <p className="text-[14px] leading-[1.8] text-stone-600">
                    I wanted to create a meaningful corner on the internet for
                    those moments when we need advice, but run into judgemental
                    spaces online. KindSphere protects your identity, letting
                    your message travel randomly to another human somewhere
                    around the world.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} className="flex-1 flex justify-center">
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border border-stone-200/50 shadow-xl bg-white shrink-0">
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
                  <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-snug">
                    A safe space,{" "}
                    <em className="text-[#E07A5F]">held gently by all of us.</em>
                  </h2>
                </div>

                <p className="text-[14px] text-stone-500 leading-relaxed">
                  To keep KindSphere a place worth returning to, we ask everyone
                  to avoid:
                </p>

                <div className="rounded-2xl border border-stone-200/60 bg-white px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {GUIDELINES.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] shrink-0" />
                      <span className="text-[#1C2541] text-sm leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── DEVELOPER + FOOTER ───────────────────── */}
        <section className="w-full bg-white border-t border-stone-200/40">
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16">

            <Reveal>
              <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 pb-10 border-b border-stone-100">

                {/* Avatar */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-stone-200/60 shadow-sm shrink-0">
                  <img
                    src="/assets/imagery/owner.png"
                    alt="Saleha Zeeshan"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Bio */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-2 text-stone-400">
                      <User className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <Eyebrow>The designer & developer</Eyebrow>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C2541]">Saleha Zeeshan</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      An independent designer and engineering student exploring
                      how minimalist layouts and purposeful identity boundaries
                      can establish empathetic communication frameworks.
                    </p>
                  </div>

                  {/* Social links */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        href: "https://www.linkedin.com/in/saleha-zeeshan-b846562a7",
                        label: "LinkedIn",
                        icon: (
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.977 1.977 0 01-1.972-1.977 1.975 1.975 0 111.972 1.977zm1.709 13.019H3.624V9h3.422v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        ),
                      },
                      {
                        href: "https://salehazportfolio.vercel.app",
                        label: "Portfolio",
                        icon: (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        ),
                      },
                      {
                        href: "https://github.com/saleha294",
                        label: "GitHub",
                        icon: (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                          </svg>
                        ),
                      },
                    ].map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-xs font-medium text-[#1C2541] transition-all"
                      >
                        <span className="text-stone-400 group-hover:text-[#E07A5F] transition-colors">
                          {link.icon}
                        </span>
                        {link.label}
                        <span className="text-stone-300 group-hover:translate-x-0.5 transition-transform">↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Footer */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
              <div className="flex items-center gap-2 font-serif text-xs text-[#1C2541]">
                <span className="font-semibold tracking-wide">KindSphere</span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span className="font-sans font-normal text-stone-400">Made with intention.</span>
              </div>
              <p>&copy; {new Date().getFullYear()} KindSphere. All rights reserved.</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}