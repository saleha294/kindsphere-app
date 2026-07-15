"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
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
    emoji: "👋🏻",
    alt: "Create Your Handle",
    number: "1",
    title: "Create Your Handle",
    body: "Choose an anonymous handle and step into KindSphere without revealing your identity.",
  },
  {
    icon: "/assets/imagery/dropyourbottle.png",
    emoji: "🌊",
    alt: "Drop Your Bottle",
    number: "2",
    title: "Drop Your Bottle",
    body: "Share a thought, question, feeling, or story by sending your anonymous bottle into the sea.",
  },
  {
    icon: "/assets/imagery/receivereplies.png",
    emoji: "💬",
    alt: "Receive Kind Replies",
    number: "3",
    title: "Receive Replies",
    body: "Read thoughtful responses from strangers around the sphere where they share their stories.",
  },
  {
    icon: "/assets/imagery/buildconnections.png",
    emoji: "🤝",
    alt: "Build Meaningful Connections",
    number: "4",
    title: "Build Connections",
    body: "Build lasting anonymous connections by sending or receiving connection requests.",
  },
] as const;

export default function HowToUseSection() {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  const handleCTA = () => {
    const handle = localStorage.getItem("kindsphere_handle");
    if (handle) {
      router.push("/dashboard");
    } else {
      setShowRegister(true);
    }
  };

  return (
    <>
      <section className="w-full bg-slate-50 pb-16 md:pb-28">
        <div className="w-full max-w-7xl mx-auto px-6 pt-8 md:pt-20">

          {/* Header */}
          <Reveal className="reveal-how-it-works-card">
            <div className="text-center mb-16 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">SIMPLE BY DESIGN</p>
              <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                How it <span className="text-violet-600 italic">works</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
                Three simple steps between you and someone whose day you'll change forever.
              </p>
            </div>
          </Reveal>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x scrollbar-hide">
            {HowToUseSectionData.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 120}
                className="reveal-how-it-works-card min-w-[280px] md:min-w-0 snap-center"
              >
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl shadow-sm h-full">
                  <div className="relative w-16 h-16 shrink-0">
                    {/* Violet square with emoji */}
                    <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 text-2xl">
                      {step.emoji}
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
          <div className="mt-16 flex w-full justify-center items-center">
            <button
              onClick={handleCTA}
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

