// app/digest/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import * as Switch from "@radix-ui/react-switch";
import { Lock } from "lucide-react";

const METRICS = [
  { value: "14", label: "People You Helped", color: "text-secondary" },
  { value: "8", label: "Feedback Received", color: "text-primary" },
  { value: "3", label: "Connections Made", color: "text-foreground" },
] as const;

const SWITCH_CLS =
  "w-9 h-5 rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0 cursor-pointer";
const THUMB_CLS =
  "block w-4 h-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0";

export default function DigestPage() {
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(true);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-x-hidden">

      {/* ── Underlying content (intentionally visible-but-locked) ── */}
      <div className="w-full py-12 pb-24 px-6 select-none pointer-events-none" aria-hidden="true">
        <div className="w-full max-w-6xl mx-auto md:px-12 space-y-12">

          <header className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground tracking-tight">Your June Digest</h1>
            <p className="text-lg text-muted-foreground">A quiet reflection on the kindness you gave and received.</p>
          </header>

          <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="font-medium text-sm sm:text-base text-primary">
              KindSphere helped 48,291 people across 127 countries this month.
            </p>
          </div>

          {/* Impact metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {METRICS.map(({ value, label, color }) => (
              <div key={label} className="bg-white rounded-2xl p-8 text-center border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center">
                <span className={`font-serif text-6xl leading-none mb-3 ${color}`}>{value}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          {/* Monthly summary quote */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.05)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 opacity-50"
              style={{ background: "linear-gradient(to right, hsl(150,25%,61%), hsl(14,66%,62%), hsl(150,25%,61%))" }} />
            <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground max-w-2xl mx-auto">
              &ldquo;This month, you reached 14 strangers across 9 countries. Your words were described as{" "}
              <em className="text-secondary not-italic">&lsquo;clarifying&rsquo;</em> and{" "}
              <em className="text-primary not-italic">&lsquo;grounding&rsquo;</em> by 6 people.
              You sent 12 responses and received 8 in return.&rdquo;
            </p>
          </div>

          {/* Meaningful Exchanges */}
          <section className="space-y-8">
            <h2 className="font-serif text-3xl font-medium text-center">Meaningful Exchanges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <article className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-stone-100">
                  You received feedback on: <strong className="text-foreground font-medium">Career Growth</strong>
                </p>
                <blockquote className="text-base md:text-lg leading-relaxed text-foreground italic flex-grow mb-6">
                  &ldquo;It sounds like you&rsquo;re outgrowing the container they built for you. Don&rsquo;t shrink yourself to fit their expectations.&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-serif select-none shrink-0">DW</div>
                  <span className="text-sm font-medium text-muted-foreground">From @DesertWind_41</span>
                </div>
                <div className="mt-auto bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-foreground">Reveal Identity via Mutual Consent</p>
                      <p className="text-xs text-muted-foreground mt-1">Both parties must consent.</p>
                    </div>
                    <Switch.Root checked={consent1} onCheckedChange={setConsent1} className={SWITCH_CLS}>
                      <Switch.Thumb className={THUMB_CLS} />
                    </Switch.Root>
                  </div>
                  <span className={`inline-flex mt-3 px-3 py-1.5 rounded-md text-xs font-medium ${consent1 ? "bg-orange-100 text-orange-700" : "bg-stone-200/50 text-muted-foreground"}`}>
                    {consent1 ? "Consent Pending\u2026" : "Awaiting your consent"}
                  </span>
                </div>
              </article>

              <article className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-stone-100">
                  You received feedback on: <strong className="text-foreground font-medium">Creative Block</strong>
                </p>
                <blockquote className="text-base md:text-lg leading-relaxed text-foreground italic flex-grow mb-6">
                  &ldquo;Stop trying to make art. Just make a mess. The pressure to make something &lsquo;good&rsquo; is what&rsquo;s paralyzing you.&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-serif select-none shrink-0">NR</div>
                  <span className="text-sm font-medium text-muted-foreground">From @NightRain_8</span>
                </div>
                <div className="mt-auto bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-foreground">Reveal Identity via Mutual Consent</p>
                      <p className="text-xs text-muted-foreground mt-1">Both parties must consent.</p>
                    </div>
                    <Switch.Root checked={consent2} onCheckedChange={setConsent2} disabled className={`${SWITCH_CLS} disabled:opacity-50 disabled:cursor-not-allowed`}>
                      <Switch.Thumb className={THUMB_CLS} />
                    </Switch.Root>
                  </div>
                  <span className="inline-flex mt-3 px-3 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
                    Matched &mdash; Identity Revealed
                  </span>
                  <div className="mt-3 bg-white p-3 rounded-lg border border-secondary/20 text-sm text-foreground">
                    <span className="font-medium">Elena Rostova</span>{" "}
                    <span className="text-muted-foreground">(elena.art@example.com)</span>
                  </div>
                </div>
              </article>

            </div>
          </section>

        </div>
      </div>

      {/* ── Glassmorphic locked overlay ── */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        style={{
          backdropFilter: "blur(18px) saturate(1.2)",
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
          background: "linear-gradient(160deg, rgba(250,249,246,0.82) 0%, rgba(129,178,154,0.10) 60%, rgba(224,122,95,0.08) 100%)",
        }}
      >
        {/* Card */}
        <div className="w-full max-w-md bg-white/70 border border-stone-200/80 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.10)] px-8 py-10 flex flex-col items-center text-center gap-6"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Lock icon with ambient glow */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" style={{ animationDuration: "3s" }} />
            <div className="relative w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lock className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-tight">
              Join KindSphere to see your records
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Your digest tracks every connection you've made — the people you've helped, feedback you've received, and the strangers who became something more.
            </p>
          </div>

          {/* Metrics preview — deliberately teasing */}
          <div className="w-full grid grid-cols-3 gap-3">
            {METRICS.map(({ value, label, color }) => (
              <div key={label} className="bg-stone-50/80 rounded-xl py-3 px-2 text-center border border-stone-100">
                <span className={`font-serif text-2xl leading-none block mb-1 ${color}`}>{value}</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-tight block">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full pt-1">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-[#E07A5F] text-white text-sm font-semibold px-6 py-3.5 hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(224,122,95,0.28)] min-h-[48px]"
            >
              Create Your Account — It&rsquo;s Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 text-foreground text-sm font-semibold px-6 py-3.5 hover:bg-stone-50 active:scale-[0.98] transition-all min-h-[48px]"
            >
              Sign In
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No email verification. No tracking. Just kindness.
          </p>
        </div>
      </div>

    </div>
  );
}