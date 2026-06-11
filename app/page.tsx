// app/page.tsx
import { Shield, Globe, Sprout } from "lucide-react";
import Link from "next/link";

/* ── How It Works steps ── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Drop your bottle anonymously.",
    body: "Write whatever is weighing on you — a decision, a feeling, a question you can't ask anyone in your life. Your name never travels with it.",
  },
  {
    n: "02",
    title: "It drifts into the global feed.",
    body: "Your message enters the sphere and becomes visible to strangers from every corner of the world — people with no stake in your outcome and no reason to be anything but honest.",
  },
  {
    n: "03",
    title: "Receive judgment-free perspectives.",
    body: "Real people respond with care. You can do the same for others. No metrics, no likes — just one human moment at a time.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-foreground">
              Be Heard. <br />
              Be Kind. <br />
              <span className="text-primary italic">Anonymously.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              A quiet, humane space where people send and receive anonymous
              feedback from strangers around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/drop"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-base font-semibold px-8 py-3 hover:opacity-90 active:scale-95 transition-all min-h-[48px]"
              >
                Send Feedback
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-stone-300 text-foreground text-base font-semibold px-8 py-3 hover:bg-stone-100 active:scale-95 transition-all min-h-[48px]"
              >
                Explore Feed
              </Link>
            </div>
          </div>

          {/* Animated globe */}
          <div className="flex flex-col items-center justify-center gap-8 pt-8 md:pt-0">
            <div className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-stone-200/50 animate-sphereFloat" />
              <div className="absolute w-full h-[90px] rounded-full border border-stone-300/40 rotate-12 animate-sphereFloat" style={{ animationDelay: "-1s" }} />
              <div className="absolute w-full h-[90px] rounded-full border border-stone-300/40 -rotate-8 animate-sphereFloat" style={{ animationDelay: "-3s" }} />
              <div className="absolute w-[240px] h-[240px] md:w-[290px] md:h-[290px] rounded-full animate-sphereFloat"
                style={{ background: "radial-gradient(circle, rgba(129,178,154,0.28) 0%, transparent 70%)", animationDelay: "-2s", animationDuration: "6.5s" }} />
              <div className="absolute w-[160px] h-[160px] md:w-[190px] md:h-[190px] rounded-full animate-sphereFloat"
                style={{ background: "radial-gradient(circle, rgba(224,122,95,0.38) 0%, rgba(129,178,154,0.18) 100%)", animationDelay: "-4s", animationDuration: "7s", boxShadow: "0 0 50px rgba(224,122,95,0.12)" }} />
              <div className="absolute top-8  left-8  w-4   h-4   rounded-full bg-primary/40  animate-ambientDrift" style={{ animationDelay: "0s" }} />
              <div className="absolute bottom-14 right-10 w-3   h-3   rounded-full bg-secondary/50 animate-ambientDrift" style={{ animationDelay: "-3s" }} />
              <div className="absolute top-1/2 -left-3  w-2.5 h-2.5 rounded-full bg-primary/55  animate-ambientDrift" style={{ animationDelay: "-7s" }} />
              <div className="absolute -top-3 right-1/4 w-3.5 h-3.5 rounded-full bg-secondary/40 animate-ambientDrift" style={{ animationDelay: "-1s" }} />
            </div>

            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              3,847 kind connections made today
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────── */}
      <section className="w-full bg-stone-50/60 border-t border-stone-200/50">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Shield,
                title: "Anonymous by Design",
                body: "No profiles, no histories, no judgments. Your identity is stripped away, leaving only your honest words.",
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
                className="bg-white rounded-2xl p-8 border border-stone-200/60 shadow-[0_4px_24px_rgb(0,0,0,0.04)] flex flex-col items-center md:items-start text-center md:text-left hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="w-full border-t border-stone-200/50">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">

          {/* Section label */}
          <div className="max-w-xl mx-auto text-center mb-14 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              How it works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-foreground">
              Three quiet steps to{" "}
              <span className="text-primary italic">genuine connection.</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="relative max-w-2xl mx-auto space-y-0">
            {/* Vertical connector line */}
            <div
              className="absolute left-[27px] top-8 bottom-8 w-px hidden sm:block"
              style={{ background: "linear-gradient(to bottom, rgba(129,178,154,0.35), rgba(129,178,154,0.08))" }}
              aria-hidden
            />

            {HOW_STEPS.map(({ n, title, body }, i) => (
              <div key={n} className="relative flex gap-6 sm:gap-8 items-start py-8 first:pt-0 last:pb-0">

                {/* Step number badge */}
                <div
                  className="relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: i === 0
                      ? "rgba(129,178,154,0.15)"
                      : i === 1
                        ? "rgba(224,122,95,0.10)"
                        : "rgba(129,178,154,0.08)",
                    border: `1px solid ${i === 1 ? "rgba(224,122,95,0.22)" : "rgba(129,178,154,0.25)"}`,
                  }}
                >
                  <span
                    className="font-serif text-base font-medium"
                    style={{ color: i === 1 ? "#E07A5F" : "#81B29A" }}
                  >
                    {n}
                  </span>
                </div>

                {/* Text */}
                <div className="pt-2.5 space-y-2 flex-1">
                  <h3
                    className="font-serif text-xl md:text-2xl font-medium leading-snug"
                    style={{ color: "#1C2541" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sub-CTA */}
          <div className="text-center mt-12">
            <Link
              href="/drop"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold px-8 py-3.5 transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "#E07A5F",
                color: "#FAF9F6",
                boxShadow: "0 4px 20px rgba(224,122,95,0.22)",
              }}
            >
              Drop your first bottle
            </Link>
          </div>

        </div>
      </section>

      {/* ── About / Purpose ──────────────────────────── */}
      <section className="w-full border-t border-stone-200/50">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center space-y-8">

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              About this project
            </p>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-foreground">
              Built on the belief that{" "}
              <span className="text-primary italic">honest words</span>
              {" "}change people.
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              KindSphere is an independent design and engineering project exploring how anonymity
              can foster genuine human connection rather than erode it. Every interaction is
              intentional — no algorithms, no engagement loops, no noise.
            </p>

            <div className="flex items-center gap-4 justify-center pt-2">
              <div className="h-px w-12 bg-stone-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 inline-block" />
              <div className="h-px w-12 bg-stone-200" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.977 1.977 0 01-1.972-1.977 1.975 1.975 0 111.972 1.977zm1.709 13.019H3.624V9h3.422v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </span>
                Connect on LinkedIn
                <span className="text-stone-300 group-hover:text-primary/40 transition-colors text-xs">↗</span>
              </Link>

              <div className="hidden sm:block h-5 w-px bg-stone-200" aria-hidden />

              <Link
                href="https://yourportfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </span>
                Explore the Design Portfolio
                <span className="text-stone-300 group-hover:text-primary/40 transition-colors text-xs">↗</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="w-full border-t border-stone-200/50 mt-auto">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-sm text-muted-foreground tracking-wide">KindSphere</span>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            &copy; {new Date().getFullYear()} KindSphere. Made with intention.
          </p>
        </div>
      </footer>

    </div>
  );
}