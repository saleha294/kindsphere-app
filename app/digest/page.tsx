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
}) 

{
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
    <div className="w-full space-y-8 pt-8 md:pt-14">

      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight">
          {userHandle ? `@${userHandle}'s Personal Drift` : "Your Personalized Drift"}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
          A quiet reflection on the empathy and clarity you have distributed.
        </p>
      </header>

      {/* Navigation */}
      <div className="border-b border-stone-200 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
        <nav className="flex justify-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-3 sm:px-5 capitalize font-medium text-xs sm:text-sm transition-all border-b-2 rounded-t-lg whitespace-nowrap ${link.hoverBg} ${isActive
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

 {/* Dashboard Overview */}
<div className="animate-fade-in">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">

    <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-sm">
      <span className="font-serif text-5xl block mb-2 text-secondary">
        {stats.bottles}
      </span>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Bottles Drifted
      </span>
    </div>

    <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-sm">
      <span className="font-serif text-5xl block mb-2 text-primary">
        {stats.replies}
      </span>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Replies Received
      </span>
    </div>

    <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-sm">
      <span className="font-serif text-5xl block mb-2 text-foreground">
        {stats.connections}
      </span>
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Connections Made
      </span>
    </div>

  </div>

<ResonanceList interactions={resonance} />
</div>

    </div>
  );
}