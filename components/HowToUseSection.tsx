"use client";

import { useState } from "react";
import RegisterUser from "@/components/RegisterUser";

/* ── Step data ── */
const STEPS = [
  {
    icon: "/assets/imagery/presence.png",
    alt: "Create your handle",
    number: "01",
    title: "Create Your Handle",
    body: "Sign up anonymously with a handle that's uniquely you.",
  },
  {
    icon: "/assets/imagery/bottle.png",
    alt: "Share or send kindness",
    number: "02",
    title: "Share or Send Kindness",
    body: "Post a message, send a kind note, or throw a bottle.",
  },
  {
    icon: "/assets/imagery/heart.png",
    alt: "Spread positivity",
    number: "03",
    title: "Spread Positivity",
    body: "Your words might be exactly what someone needs today.",
  },
  {
    icon: "/assets/imagery/connect.png",
    alt: "Keep it kind",
    number: "04",
    title: "Keep It Kind",
    body: "Be respectful, supportive, and help keep this space safe for everyone.",
  },
] as const;

export default function HowToUseSection() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <section className="w-full py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

          {/* Section header — left aligned */}
          <div className="mb-10 space-y-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-400">
              Start Here
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight">
              How to use{" "}
              <span className="text-[#6D28D9]">KindSphere</span>
            </h2>
            <p className="text-[15px] text-stone-500 leading-relaxed max-w-xl pt-1">
              Four simple steps to start sharing kindness with the world.
            </p>
          </div>

          {/* Steps — horizontal on md+, vertical stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-start gap-4">

                <div
                  className="relative w-[5rem] h-[5rem] rounded-full overflow-hidden bg-white border border-stone-200 shadow-lg flex items-center justify-center shrink-0"
                  style={{ outline: "2px solid rgba(139,92,246,0.14)" }}
                >
                  <img
                    src={step.icon}
                    alt={step.alt}
                    className="w-[80%] h-[80%] object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-md"
                    style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[15px] font-semibold text-[#1C2541] leading-snug">
                    {step.title}
                  </p>
                  <p className="text-[12px] leading-[1.7] text-stone-500 md:max-w-[160px]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA — left aligned */}
          <div className="mt-10 flex justify-start">
            <button
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-7 py-3.5 rounded-full cursor-pointer hover:opacity-90 active:scale-[0.97] transition-all"
              style={{
                background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)",
                boxShadow: "0 8px 28px rgba(109,40,217,0.3)",
              }}
            >
              Get started — it's free
            </button>
          </div>
        </div>
      </section>

      <RegisterUser
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onAccountCreated={(handle: string, id: string) => {
          localStorage.setItem("kindsphere_handle", handle);
          localStorage.setItem("kindsphere_uid", id);
          setShowRegister(false);
          window.dispatchEvent(new Event("auth-changed"));
        }}
      />
    </>
  );
}
