"use client";

import { getCurrentUserId } from "@/lib/auth";
import { getDigestStats } from "@/lib/db-queries";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getInteractionResonance } from "@/lib/db-queries";

const NAV_ITEMS = [
  { href: "/digest/sent", label: "My Sent Bottles", color: "#7C3AED", hoverBg: "hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]" },
  /* { href: "/digest/pending", label: "Awaiting My Voice", color: "#7C3AED", hoverBg: "hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]" }, */
  { href: "/digest/private", label: "Private Bottles", color: "#7C3AED", hoverBg: "hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]" },
  { href: "/digest/connections", label: "Mutual Connections", color: "#7C3AED", hoverBg: "hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]" },
  { href: "/digest/replies", label: "Replies", color: "#7C3AED", hoverBg: "hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]" },
];


// --- SUB-COMPONENTS ---
function ResonanceList({
  interactions,
}: {
  interactions: any[];
}) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm mt-4 md:mt-6">
      <h3 className="font-serif text-xl text-stone-800 mb-6 md:mb-8">Interaction Resonance</h3>
      <div className="space-y-5 md:space-y-6">
        {interactions.length === 0 ? (
          <p className="text-stone-400 italic">
            No meaningful interactions yet.
          </p>
        ) : (
          interactions.map((user) => (
            <div
              key={user.handle}
              className="flex items-center gap-4"
            >
              <span className="w-32 text-sm font-medium truncate">
                @{user.handle}
              </span>

              <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED]"
                  style={{ width: "100%" }}
                />
              </div>

              <span className="text-xs text-stone-500">
                {user.reason}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function DigestPage() {
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const pathname = usePathname();
  const [stats, setStats] = useState({
    bottles: 0,
    replies: 0,
    connections: 0,
  });

  const [resonance, setResonance] = useState<any[]>([]);

  useEffect(() => {
    const syncAuth = () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      setUserHandle(savedHandle);
    };

    syncAuth();

    window.addEventListener("auth-changed", syncAuth);

    async function loadStats() {
      const uid = await getCurrentUserId();

      if (!uid) return;

      const data = await getDigestStats(uid);
      const people = await getInteractionResonance(uid);

      setResonance(people);

      setStats(data);
    }

    loadStats();

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <div className="w-full space-y-12 animate-fade-in">

      {/* --- Premium Header --- */}
      <header className="relative w-full rounded-[2rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2 text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-900 leading-tight">
            {userHandle ? `@${userHandle}'s Personal Drift` : "Your Personalized Drift"}
          </h1>
          <p className="text-lg text-stone-600 max-w-lg">
            A quiet reflection on the empathy and clarity you have distributed.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-stone-200 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
        <nav className="grid grid-cols-2 sm:flex sm:justify-center gap-1 sm:gap-2 place-items-center sm:place-items-auto">
          {NAV_ITEMS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-3 sm:px-5 text-center capitalize font-medium text-xs sm:text-sm transition-all border-b-2 rounded-t-lg whitespace-nowrap ${link.hoverBg} ${isActive
                  ? "border-current"
                  : "border-transparent text-stone-500"
                  }`}
                style={{
                  color: isActive ? link.color : undefined,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- Dashboard Overview --- */}
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Bottles Drifted */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
            <div>
              <span className="text-4xl font-serif font-bold text-stone-900 block">{stats.bottles}</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Bottles Drifted</span>
            </div>
          </div>

          {/* Replies Received */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#DB2777]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <span className="text-4xl font-serif font-bold text-stone-900 block">{stats.replies}</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Replies Received</span>
            </div>
          </div>

          {/* Connections Made */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <span className="text-4xl font-serif font-bold text-stone-900 block">{stats.connections}</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Connections Made</span>
            </div>
          </div>

          {/* Kindness Spread */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <span className="text-4xl font-serif font-bold text-stone-900 block">∞</span>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Kindness Spread</span>
            </div>
          </div>

        </div>

        <ResonanceList interactions={resonance} />
      </div>
    </div>

  );
}