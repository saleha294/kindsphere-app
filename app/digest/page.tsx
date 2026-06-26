"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- CONFIGURATION ---
const METRICS = [
  { value: "14", label: "People You Helped", color: "text-secondary" },
  { value: "8", label: "Feedback Received", color: "text-primary" },
  { value: "3", label: "Connections Made", color: "text-foreground" },
] as const;

const NAV_ITEMS = [
  { href: "/digest/sent", label: "My Sent Bottles", color: "#E07A5F", hoverBg: "hover:bg-[#E07A5F]/10 hover:text-[#E07A5F]" },
  { href: "/digest/pending", label: "Awaiting My Voice", color: "#81B29A", hoverBg: "hover:bg-[#81B29A]/10 hover:text-[#81B29A]" },
  { href: "/digest/connections", label: "Mutual Connections", color: "#E07A5F", hoverBg: "hover:bg-[#E07A5F]/10 hover:text-[#E07A5F]" },
  { href: "/digest/replies", label: "Replies", color: "#3D5A80", hoverBg: "hover:bg-[#3D5A80]/10 hover:text-[#3D5A80]" }, // New tab
];

// --- SUB-COMPONENTS ---
function ResonanceList() {
  const interactions = [
    { name: "@QuietThunder_7", percentage: 85 },
    { name: "@DreamWeaver", percentage: 65 },
    { name: "@Stargazer", percentage: 40 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm mt-4 md:mt-6">
      <h3 className="font-serif text-xl text-stone-800 mb-6 md:mb-8">Interaction Resonance</h3>
      <div className="space-y-5 md:space-y-6">
        {interactions.map((user) => (
          <div key={user.name} className="flex items-center gap-3 md:gap-4">
            <span className="w-28 sm:w-32 text-xs sm:text-sm font-medium text-stone-700 truncate shrink-0">{user.name}</span>
            <div className="flex-1 h-2.5 md:h-3 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E07A5F] rounded-full"
                style={{ width: `${user.percentage}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-stone-400 font-mono shrink-0">{user.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function DigestPage() {
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Sync auth state and re-read on auth-changed events
    const syncAuth = () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      setUserHandle(savedHandle);
    };

    syncAuth(); // Read on mount
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <div className="w-full space-y-8">

      {/* Header */}
      <header className="text-center space-y-2 pt-2">
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
          {METRICS.map(({ value, label, color }) => (
            <div key={label} className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-sm">
              <span className={`font-serif text-5xl block mb-2 ${color}`}>{value}</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        <ResonanceList />
      </div>

    </div>
  );
}