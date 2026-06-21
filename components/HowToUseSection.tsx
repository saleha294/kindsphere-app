"use client";

import { useState } from "react";
import Link from "next/link";
import RegisterUser from "@/components/RegisterUser";

/* ── Section data ── */
const STEPS = [
  {
    image: "/assets/imagery/presence.png",
    alt: "Create your anonymous presence",
    title: "Create your presence",
    body: "Sign in or log in to generate your unique, anonymous handle and start your journey.",
    button: { label: "Sign up", variant: "terracotta" as const, href: null },
  },
  {
    image: "/assets/imagery/dropyourbottle.png",
    alt: "Drop a bottle into the ocean",
    title: "Drop a Bottle",
    body: 'Use the "Drop a Bottle" option to share messages, queries, or advice for the world to hear.',
    button: { label: "Drop a bottle", variant: "sage" as const, href: "/drop" },
  },
  {
    image: "/assets/imagery/connectandgrow.png",
    alt: "Connect and grow together",
    title: "Connect & Grow",
    body: "Receive responses, track your records, maintain connections, and help others grow!",
    button: { label: "Feed", variant: "terracotta" as const, href: "/dashboard" },
  },
] as const;

export default function HowToUseSection() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <section className="w-full py-16 md:py-24 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">

          {/* Section header */}
          <div className="mb-12 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 mb-2">
              How to use
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1C2541]">
              Become a {" "}
              <span className="text-[#E07A5F]"> part of KindSphere</span>
            </h2>
          </div>

          {/* Step cards — image-left / content-right on desktop, stacked on mobile */}
          <div className="max-w-3xl flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-stone-200/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image — 35% width on desktop, full width on mobile */}
                <div className="w-full md:w-[35%] aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-100 shrink-0 relative min-h-[180px] md:min-h-0">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>

                {/* Content — 65% width on desktop */}
                <div className="flex-1 flex flex-col justify-center px-6 py-6 md:px-8 md:py-6 gap-3.5">
                  <h3 className="font-serif text-lg md:text-xl font-medium text-[#1C2541]">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-stone-500 leading-relaxed">
                    {step.body}
                  </p>

                  {/* CTA button */}
                  {step.button.href ? (
                    <Link
                      href={step.button.href}
                      className={`inline-flex items-center justify-center rounded-xl text-white text-xs font-semibold px-6 py-2.5 mt-1 w-fit hover:opacity-90 active:scale-[0.97] transition-all min-h-[40px] ${
                        step.button.variant === "terracotta"
                          ? "bg-[#E07A5F]"
                          : "bg-[#81B29A]"
                      }`}
                    >
                      {step.button.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => setShowRegister(true)}
                      className={`inline-flex items-center justify-center rounded-xl text-white text-xs font-semibold px-6 py-2.5 mt-1 w-fit hover:opacity-90 active:scale-[0.97] transition-all min-h-[40px] cursor-pointer ${
                        step.button.variant === "terracotta"
                          ? "bg-[#E07A5F]"
                          : "bg-[#81B29A]"
                      }`}
                    >
                      {step.button.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration modal */}
      <RegisterUser
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onAccountCreated={(handle: string, id: string) => {
          localStorage.setItem("kindsphere_handle", handle);
          localStorage.setItem("kindsphere_uid", id);
          setShowRegister(false);
          window.location.reload();
        }}
      />
    </>
  );
}
