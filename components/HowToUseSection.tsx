"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import RegisterUser from "@/components/RegisterUser";


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

const HowToUseSectionData = [
  {
    icon: "/assets/imagery/createyourhandle.png",
    alt: "Create Your Handle",
    number: "1",
    title: "Create Your Handle",
    body: "Choose an anonymous handle and step into KindSphere without revealing your identity.",
  },
  {
    icon: "/assets/imagery/dropyourbottle.png",
    alt: "Drop Your Bottle",
    number: "2",
    title: "Drop Your Bottle",
    body: "Share a thought, question, feeling, or story by sending your anonymous bottle into the sea.",
  },
  {
    icon: "/assets/imagery/receivereplies.png",
    alt: "Receive Kind Replies",
    number: "3",
    title: "Receive Replies",
    body: "Read thoughtful responses from strangers around the sphere where they share their stories.",
  },
  {
    icon: "/assets/imagery/buildconnections.png",
    alt: "Build Meaningful Connections",
    number: "4",
    title: "Build Connections",
    body: "Build lasting anonymous connections by sending or receiving connection requests.",
  },
] as const;

export default function HowToUseSection() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <section className="w-full bg-slate-50 ">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">SIMPLE BY DESIGN</p>
            <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
              How it <span className="text-violet-600 italic">works</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
              Three simple steps between you and someone whose day you'll change forever.
            </p>
          </div>

          {/* Cards Carousel/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x scrollbar-hide">
            {HowToUseSectionData.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 120}
                className="reveal-how-it-works-card min-w-[280px] md:min-w-0 snap-center"
              >
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl shadow-sm h-full">
                  <div className="relative w-16 h-16 shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                      <img src={step.icon} alt={step.alt} className="w-8 h-8 object-contain brightness-0 invert" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                      {step.number}
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <h3 className="font-serif text-2xl text-slate-950 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center gap-2 text-base font-semibold text-white px-10 py-4 rounded-full shadow-lg hover:opacity-90 active:scale-[0.97] transition-all"
              style={{
                background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)",
              }}
            >
              Get started — it's free
            </button>
          </div>
        </div>
      </section>
      {/* ── FOOTER ───────────────────── */}
      <section
        className="w-full relative overflow-hidden border-t border-black/10 rounded-t-[40px] pt-10 pb-6"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)'
        }}
      >
        <Reveal className="reveal-footer w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 mb-10">

            {/* About */}
            <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
              <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                About
              </h4>

              <p className="text-[14px] text-black/70 leading-relaxed max-w-[220px]">
                KindSphere is a safe haven built to inspire daily kindness, one anonymous
                drop at a time.
              </p>
            </div>

            {/* Mission */}
            <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
              <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                Our Mission
              </h4>

              <ul className="space-y-2">
                {[
                  "Anonymous by Design",
                  "Built on Kindness",
                  "Meaningful Connections",
                  "Safe & Respectful Community",
                  "Honest Conversations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-purple-500 text-[9px] mt-[7px]">◆</span>

                    <span className="text-[14px] text-black/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore */}
            <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
              <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                Explore
              </h4>

              <div className="flex flex-col gap-2">
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
                    className="text-[14px] text-black hover:text-purple-600 transition"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Creator */}
            <div className="w-full px-6 py-8 hover:bg-violet-900/30 transition-colors duration-300">
              <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
                Creator
              </h4>

              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-black/80 font-medium">
                  Saleha Zeeshan
                </p>

                <a
                  href="https://github.com/saleha294"
                  target="_blank"
                  className="text-[14px] text-black hover:text-purple-600 transition"
                >
                  GitHub
                </a>

                <a
                  href="mailto:salehacorner@gmail.com"
                  className="text-[14px] text-black hover:text-purple-600 transition"
                >
                  Gmail
                </a>
              </div>
            </div>

          </div>

          <div className="flex flex-col items-start md:items-center text-left md:text-center -mt-4 mb-2">



            <h2 className="font-serif text-4xl md:text-5xl tracking-wide">
              <span className="text-black">Kind</span>
              <span className="text-purple-600 italic">Sphere</span>
            </h2>

            <p className="mt-1 text-sm text-black/70">
              A kinder world starts with you.
            </p>

          </div>

          <div className="pt-4 border-t border-black/10 flex flex-col items-start md:items-center gap-2 text-left md:text-center">

            <p className="text-[10px] text-black/60 uppercase tracking-widest">
              © {new Date().getFullYear()} KindSphere. All rights reserved.
            </p>

            <div className="flex items-center gap-1 text-[11px] uppercase tracking-widest">

              <span className="text-purple-600">♥</span>
            </div>

          </div>

        </Reveal>
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