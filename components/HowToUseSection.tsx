"use client";

import { useState } from "react";
import RegisterUser from "@/components/RegisterUser";

const HowToUseSectionData = [
  {
    icon: "/assets/imagery/createyourhandle.png",
    alt: "Create Your Handle",
    number: "1",
    title: "Create Your Handle",
    body: "Choose an anonymous handle and step into KindSphere without revealing your identity.",
    badge: "#8B5CF6",
  },
  {
    icon: "/assets/imagery/dropyourbottle.png",
    alt: "Drop Your Bottle",
    number: "2",
    title: "Drop Your Bottle",
    body: "Share a thought, question, feeling, or story by sending your anonymous bottle into the sea.",
    badge: "#E8A33D",
  },
  {
    icon: "/assets/imagery/receivereplies.png",
    alt: "Receive Kind Replies",
    number: "3",
    title: "Receive Replies",
    body: "Read thoughtful responses from strangers around the sphere.",
    badge: "#7C3AED",
  },
  {
    icon: "/assets/imagery/buildconnections.png",
    alt: "Build Meaningful Connections",
    number: "4",
    title: "Build Connections",
    body: "Build lasting anonymous connections on kindness and trust.",
    badge: "#E8A33D",
  },
] as const;

export default function HowToUseSection() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <section className="w-full py-16 md:py-20">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12">

          <div className="mb-10 space-y-2">
            <div className="flex items-center gap-4">
              <span className="hidden md:block h-px flex-1 bg-stone-300" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight shrink-0">
                <span className="text-black">How</span> <span className="text-[#7C3AED]">it works</span>
              </h2>
              <span className="hidden md:block h-px flex-1 bg-stone-300" />
            </div>
            <p className="text-[17px] text-stone-500 leading-relaxed max-w-xl pt-1 text-left md:text-center md:mx-auto">
              Four simple steps to start sharing kindness with the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {HowToUseSectionData.map((step) => (
              <div
                key={step.number}
                className="card-lift relative bg-white rounded-3xl border border-stone-200/60 shadow-sm pt-8 pb-7 px-6 min-h-[320px] flex flex-col items-start text-left gap-4"
              >
                {/* icon circle */}
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center bg-white border border-[#E4D5FB]/70 shadow-sm"
                  >
                    <img
                      src={step.icon}
                      alt={step.alt}
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                </div>

                {/* title */}
                <h3 className="text-[17px] font-semibold text-[#1C2541] leading-snug mt-1">
                  {step.title}
                </h3>

                {/* body */}
                <p className="text-sm leading-6 text-stone-500 text-left">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-start md:justify-center">
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