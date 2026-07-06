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
      <section className="w-full py-16 md:py-20">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 space-y-2">
            <div className="flex items-center gap-4">
              <span className="hidden md:block h-px flex-1 bg-stone-300" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C2541] leading-tight shrink-0">
                <span className="text-black">How</span> <span className="text-[#7C3AED]">it works</span>
              </h2>
              <span className="hidden md:block h-px flex-1 bg-stone-300" />
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden xl:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 items-start relative z-10">
              {HowToUseSectionData.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 h-auto flex flex-col gap-5 transition-transform hover:-translate-y-1"
                >
                  {/* Upper Row: Icon Left, Number Right */}
                  <div className="flex justify-between items-center w-full">
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                      <img
                        src={step.icon}
                        alt={step.alt}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <div className="text-2xl font-bold text-[#7C3AED]/40 font-serif">
                      {step.number}
                    </div>
                  </div>

                  {/* Lower Section: Text Left-Aligned */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-[19px] font-semibold text-[#1C2541] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[17px] leading-6 text-stone-500">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-4 rounded-full shadow-lg hover:opacity-90 active:scale-[0.97] transition-all"
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