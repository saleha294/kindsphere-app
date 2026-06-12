// app/page.tsx
import { Shield, Globe, Sprout, HeartHandshake, User } from "lucide-react";
import Link from "next/link";
import ActiveGlobe from "@/components/ActiveGlobe";

/* ── How It Works steps ── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Drop your bottle anonymously.",
    body: "Write whatever is weighing on you, a decision, a feeling, a question you can't ask anyone in your life.",
  },
  {
    n: "02",
    title: "It drifts into the global feed.",
    body: "Your message enters the sphere and becomes visible to strangers from every corner of the world, people with no stake in your outcome and no reason to be anything but honest.",
  },
  {
    n: "03",
    title: "Receive judgment-free perspectives.",
    body: "Real people respond with care. You can do the same for others, no metrics, no likes, just one human moment at a time.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden bg-[#FAF9F6]">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="w-full">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-12 lg:pt-24 lg:pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE: Heading & Intro (Perfectly Preserved) */}
          <div className="flex flex-col items-start text-left gap-6">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[#1C2541]">
              Be Heard. <br />
              Be Kind. <br />
              <span className="text-[#E07A5F] italic">Anonymously.</span>
            </h1>

            <p className="text-base md:text-lg text-stone-500 max-w-md leading-relaxed">
              A quiet, humane space where people send and receive anonymous
              feedback from strangers around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-[#E07A5F] text-white text-sm font-semibold px-8 py-3.5 hover:opacity-95 active:scale-[0.97] transition-all min-h-[48px]"
              >
                Explore Feed
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive D3 Globe Block */}
          <div className="flex flex-col items-center md:items-end justify-center gap-6 pt-8 md:pt-0">
            <div className="relative w-full max-w-[340px] md:max-w-[380px] aspect-square flex items-center justify-center">

              {/* Soft, matching ambient radial glow behind the globe */}
              <div
                className="absolute w-[85%] h-[85%] rounded-full opacity-60 pointer-events-none blur-3xl animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(129,178,154,0.4) 0%, rgba(224,122,95,0.1) 50%, transparent 70%)",
                  animationDuration: "8s"
                }}
              />

              {/* Your native D3 Globe Component */}
              <ActiveGlobe
                className="w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                users={[]} // 0 setup overhead on landing page
              />
            </div>

            {/* Connection Indicator Stats */}
            <p className="text-xs text-stone-400 font-medium flex items-center gap-2 pr-4">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A5F]" />
              </span>
              3,847 kind connections made today
            </p>
          </div>

        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────── */}
      <section className="w-full bg-stone-50/40 border-t border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Shield,
                title: "Anonymous by Design",
                body: "No profiles, no histories, no judgments. Your real identity is stripped away, leaving only your honest words.",
              },
              {
                Icon: Globe,
                title: "Global Reach",
                body: "Drop a bottle into the digital ocean and receive perspectives from people living completely different lives.",
              },
              {
                Icon: Sprout,
                title: "Real Growth",
                body: "Experience the clarity that comes when strangers offer kindness and truth without expecting anything in return.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/10 flex items-center justify-center mb-5 text-[#E07A5F] shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2.5 text-[#1C2541]">{title}</h3>
                <p className="text-stone-500 leading-relaxed text-[14px]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="w-full border-t border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20">

          {/* Left aligned section header */}
          <div className="max-w-xl text-left mb-12 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              How it works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#1C2541]">
              Three quiet steps to{" "}
              <span className="text-[#E07A5F] italic">genuine connection.</span>
            </h2>
          </div>

          {/* Steps list */}
          <div className="relative max-w-3xl space-y-0">
            <div
              className="absolute left-[27px] top-8 bottom-8 w-px hidden sm:block bg-gradient-to-b from-[#E07A5F]/30 to-transparent"
              aria-hidden
            />

            {HOW_STEPS.map(({ n, title, body }, i) => (
              <div key={n} className="relative flex gap-6 sm:gap-8 items-start py-6 first:pt-0 last:pb-0">
                <div
                  className="relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-stone-200"
                  style={{
                    borderColor: i === 1 ? "rgba(224,122,95,0.4)" : "rgba(224,122,95,0.2)",
                  }}
                >
                  <span className="font-serif text-base font-semibold text-[#E07A5F]">
                    {n}
                  </span>
                </div>

                <div className="pt-2 space-y-1 flex-1 text-left">
                  <h3 className="font-serif text-xl font-medium leading-snug text-[#1C2541]">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-stone-500 max-w-2xl">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About This Project / Purpose ─────────────── */}
      <section className="w-full border-t border-stone-200/40 bg-stone-50/20">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row gap-10 md:gap-16">

          {/* Left Column: Mission text */}
          <div className="flex-1 space-y-4 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              About this project
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.2] tracking-tight text-[#1C2541]">
              Built on the belief that <span className="text-[#E07A5F] italic">honest words</span> change people.
            </h2>
            <p className="text-[14px] md:text-[15px] text-stone-500 leading-relaxed max-w-xl">
              I wanted to create a meaningful corner on the internet for those moments when we need advice or genuine perspectives, but either have no one around to ask or run into judgmental spaces online. KindSphere protects your complete identity, letting your message (called a <strong>"bottle"</strong>) travel randomly to another human somewhere around the world.
            </p>
          </div>

          {/* Right Column: Platform Framework & Original Purpose */}
          <div className="flex-1 bg-white border border-stone-200/60 rounded-2xl p-6 md:p-8 space-y-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <div className="w-8 h-8 rounded-lg bg-[#E07A5F]/10 flex items-center justify-center text-[#E07A5F]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1C2541]">Our Core Purpose</h3>
            <p className="text-[13px] text-stone-500 leading-relaxed">
              KindSphere was built to be a safe, deeply supportive sanctuary for those who struggle to speak up, identify as introverts, or are simply searching for real human growth and new friendships without the noise of typical social media.
            </p>
            <p className="text-[13px] text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
              The entire platform is architected to ensure constructive, honest interactions that protect your digital dignity. If a genuine connection sparks through your words, you can safely choose to reveal your identities and transition into a personal, mutually consented chat.
            </p>
          </div>

        </div>
      </section>

      {/* ── Developer Profile & Footer Section ───────── */}
      <section className="w-full bg-[#FFFFFF] text-[#1C2541] border-t border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-stone-100">

            <div className="space-y-2.5 max-w-md">
              <div className="flex items-center gap-2.5 text-stone-400">
                <User className="w-4 h-4 text-[#E07A5F]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">The Designer & Developer</span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1C2541]">Saleha Zeeshan</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                An independent designer and engineering student explorer tracking how minimalist layouts and purposeful identity boundaries can establish empathetic communication frameworks.
              </p>
            </div>

            {/* Link Grid - High Contrast Balanced Elements */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
                  Connect on LinkedIn
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
                  Explore my Design Portfolio
                </span>
                <span className="text-stone-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </Link>
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