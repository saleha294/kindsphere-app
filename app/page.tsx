// app/page.tsx
import { User } from "lucide-react";
import Link from "next/link";
import HowToUseSection from "@/components/HowToUseSection";

/* ── How It Works steps ── */
const HOW_STEPS = [
  {
    image: "/assets/imagery/step1.png",
    alt: "Step 1 — Drop your bottle",
    text: "Drop your bottle anonymously. Write whatever is weighing on you, a decision, a feeling, a question you can\u2019t ask anyone in your life. No name required. No audience. Just your words, set free.",
  },
  {
    image: "/assets/imagery/step2.png",
    alt: "Step 2 — Receive perspectives",
    text: "Receive gentle perspectives. From across the ocean or from your own neighborhood, thoughtful people offer quiet words. No debates, just human connection and shared insight.",
  },
  {
    image: "/assets/imagery/step3.png",
    alt: "Step 3 — Savor connection",
    text: "Savor the quiet connection. Every shared word is a reminder that we are all walking slightly lighter by simply listening and being heard. Discover growth in shared, quiet spaces.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden bg-[#FAF9F6]">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative w-full bg-[url('/assets/imagery/background.png')] bg-cover bg-center bg-no-repeat min-h-[500px] md:min-h-[600px] flex items-center justify-center">
        {/* Light semi-transparent overlay to ensure text remains readable */}
        <div className="absolute inset-0 bg-[#FAF9F6]/75 backdrop-blur-[1px]" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center gap-6">

          {/* LEFT SIDE: Heading & Intro (Perfectly Preserved, centered) */}
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[#1C2541]">
              Be Heard. <br />
              Be Kind. <br />
              <span className="text-[#E07A5F] italic">Anonymously.</span>
            </h1>

            <p className="text-base md:text-lg text-stone-600 max-w-md leading-relaxed mx-auto">
              A quiet, humane space where people send and receive anonymous
              responses from strangers around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-[#E07A5F] text-white text-sm font-semibold px-8 py-3.5 hover:opacity-95 active:scale-[0.97] transition-all min-h-[48px]"
              >
                Explore Feed
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Character Block (Temporary Disabled, Commented Out) */}
          {/*
          <div className="flex flex-col items-center md:items-end justify-center gap-6 pt-8 md:pt-0">
            <div className="relative w-full max-w-[340px] md:max-w-[380px] aspect-square flex items-center justify-center">
              <KindBlob className="w-full h-full" />
            </div>
          </div>
          */}

        </div>
      </section>
      {/* ── Feature Cards ────────────────────────────── */}
      <section className="w-full border-t border-stone-200/40 bg-[#FDFBF7]">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20">

          {/* Section Header */}
          <div className="max-w-xl text-left mb-12 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              Feature Cards
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#1C2541]">
              Three <span className="text-[#E07A5F] ">principles behind this project.</span>
            </h2>
          </div>

          {/* Cards Grid - Now sitting directly inside the main section container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: Anonymous Icon */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/50 shadow-sm">
              <div className="mb-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-200/60 shadow-sm bg-stone-50 shrink-0">
                  <img
                    src="/assets/imagery/anonymous.png"
                    alt="Anonymous"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium mb-2.5 text-[#1C2541]">
                Anonymous by Design
              </h3>
              <p className="text-stone-500 leading-relaxed text-[14px]">
                No profiles, no histories, no judgments. Your real identity is stripped away.
              </p>
            </div>

            {/* CARD 2: Global Reach */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/50 shadow-sm">
              <div className="mb-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-200/60 shadow-sm bg-stone-50 shrink-0">
                  <img
                    src="/assets/imagery/GlobalReach.png"
                    alt="Global Reach"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium mb-2.5 text-[#1C2541]">
                Global Reach
              </h3>
              <p className="text-stone-500 leading-relaxed text-[14px]">
                Drop a bottle into the digital ocean and receive perspectives from others.
              </p>
            </div>

            {/* CARD 3: Real Growth */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/50 shadow-sm">
              <div className="mb-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-200/60 shadow-sm bg-stone-50 shrink-0">
                  <img
                    src="/assets/imagery/RealGrowth.png"
                    alt="Real Growth"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium mb-2.5 text-[#1C2541]">
                Real Growth
              </h3>
              <p className="text-stone-500 leading-relaxed text-[14px]">
                Experience the clarity that comes when strangers offer kindness.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works (Rectangle Step Guides) ──────── */}
      <section className="w-full border-t border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">

          {/* Section Header */}
          <div className="text-left mb-14 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">How it works</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#1C2541]">
              Three <span className="text-[#E07A5F] italic">quiet gestures.</span>
            </h2>
          </div>

          {/* Step Guide Modules — 3 col on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {HOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image — fills the top of the rectangle */}
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Body text — directly below image, inside the same card */}
                <div className="px-6 py-6 md:px-7 md:py-7">
                  <p className="font-serif text-[14px] md:text-[15px] leading-[1.7] text-stone-600">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── How to Use ─────────────────────────────── */}
      <HowToUseSection />

      {/* ── Core Purpose Section ─────────────────────────────── */}
      <section className="w-full border-t border-stone-200/40 bg-stone-50/20 py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">

            {/* Text Left */}
            <div className="flex-1 space-y-4 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Our Core Purpose</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541]">
                A sanctuary for <span className="text-[#E07A5F] italic">honest growth.</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-stone-500">
                KindSphere was built to be a safe, supportive sanctuary for those who struggle to speak up or are simply searching for real human growth. We strip away the noise of social media so you can focus on genuine connection.
              </p>
            </div>

            {/* Image Right -> Circular container with soft drop shadow */}
            <div className="flex-1 w-full flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border border-stone-200/50 shadow-xl bg-white shrink-0">
                <img src="/assets/imagery/our_core_purpose.png" alt="Core Purpose" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About This Project Section ────────────────────────── */}
      <section className="w-full py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">

            {/* Text Right - Adjusted to flex-1 */}
            <div className="flex-1 space-y-4 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">About this project</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541]">
                Built on the belief that <span className="text-[#E07A5F] italic">honest words</span> change people.
              </h2>
              {/* Glassmorphism quote container */}
              <div
                className="relative rounded-2xl px-6 py-5 mt-2"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(224, 122, 95, 0.18)",
                  boxShadow: "0 4px 24px rgba(129, 178, 154, 0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                {/* Decorative top accent line */}
                <div
                  className="absolute top-0 left-6 right-6 h-px rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(224,122,95,0.35), transparent)" }}
                />
                <p className="text-[15px] leading-relaxed text-stone-600 font-serif">
                  I wanted to create a meaningful corner on the internet for those moments when we need advice, but run into judgmental spaces online. KindSphere protects your identity, letting your message travel randomly to another human somewhere around the world.
                </p>
              </div>
            </div>

            {/* Image Left -> Circular container with soft drop shadow */}
            <div className="flex-[1.2] w-full flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border border-stone-200/50 shadow-xl bg-white shrink-0 scale-105 transform transition-transform duration-500">
                <img
                  src="/assets/imagery/connection.png"
                  alt="About project"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── Community Guidelines Section ────────────────────────── */}
      <section className="w-full py-20 border-t border-stone-200/40 bg-stone-50/20">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">

            {/* Text Right */}
            <div className="flex-1 space-y-4 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Community Guidelines</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541]">
                A safe space, <span className="text-[#E07A5F] italic">held gently by all of us.</span>
              </h2>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  "Racism and Hate Speech",
                  "Bullying and Harassment",
                  "Personal Attacks or Nudity",
                  "Passive-Aggressive Tone",
                  "Spam and Self-Promotion",
                  "Explicit or Offensive Content"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 bg-white p-3 md:p-4 rounded-xl border border-stone-200/60 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#E07A5F] shrink-0" />
                    <span className="text-[#1C2541] font-medium text-xs md:text-sm leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Left */}
            <div className="flex-1 w-full">
              <img
                src="/assets/imagery/community_guidelines.png"
                alt="Community Guidelines"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer Profile & Footer Section ───────── */}
      <section className="w-full bg-[#FFFFFF] text-[#1C2541] border-t border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 pb-10 border-b border-stone-100">
            
            {/* Owner Image / circular avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-stone-200/60 shadow-sm shrink-0 mx-auto md:mx-0">
              <img
                src="/assets/imagery/owner.png"
                alt="Saleha Zeeshan"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content right on desktop / stacked & centered on mobile */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-5">
              <div className="space-y-2.5 max-w-xl">
                <div className="flex items-center justify-center md:justify-start gap-2.5 text-stone-400">
                  <User className="w-4 h-4 text-[#E07A5F]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">The Designer & Developer</span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C2541]">Saleha Zeeshan</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  An independent designer and engineering student explorer tracking how minimalist layouts and purposeful identity boundaries can establish empathetic communication frameworks.
                </p>
              </div>

              {/* Link Grid - High Contrast Balanced Elements */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  href="https://www.linkedin.com/in/saleha-zeeshan-b846562a7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-xs font-semibold text-[#1C2541] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 fill-current text-stone-500 group-hover:text-[#E07A5F] transition-colors" viewBox="0 0 24 24">
                      <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.977 1.977 0 01-1.972-1.977 1.975 1.975 0 111.972 1.977zm1.709 13.019H3.624V9h3.422v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </span>
                  <span className="text-stone-400 group-hover:translate-x-0.5 transition-transform">↗</span>
                </Link>

                <Link
                  href="https://salehazportfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-xs font-semibold text-[#1C2541] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#E07A5F] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                    Portfolio
                  </span>
                  <span className="text-stone-400 group-hover:translate-x-0.5 transition-transform">↗</span>
                </Link>

                {/* Your New GitHub Link */}
                <Link
                  href="https://github.com/saleha294"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-xs font-semibold text-[#1C2541] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#E07A5F] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </span>
                  <span className="text-stone-400 group-hover:translate-x-0.5 transition-transform">↗</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Footer Metadata */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px] font-medium">
            <div className="flex items-center gap-2 font-serif text-xs text-[#1C2541]">
              <span className="font-semibold tracking-wide">KindSphere</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="font-sans font-normal normal-case text-stone-400">Made with intention.</span>
            </div>
            <p>&copy; {new Date().getFullYear()} KindSphere. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}