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
  { href: "/digest/sent", label: "My Sent Bottles", color: "#E07A5F" },
  { href: "/digest/pending", label: "Awaiting My Voice", color: "#81B29A" },
  { href: "/digest/connections", label: "Mutual Connections", color: "#E07A5F" },
];

// --- SUB-COMPONENTS ---
function ResonanceList() {
  const interactions = [
    { name: "@QuietThunder_7", percentage: 85 },
    { name: "@DreamWeaver", percentage: 65 },
    { name: "@Stargazer", percentage: 40 },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm mt-6">
      <h3 className="font-serif text-xl text-stone-800 mb-8">Interaction Resonance</h3>
      <div className="space-y-6">
        {interactions.map((user) => (
          <div key={user.name} className="flex items-center gap-4">
            <span className="w-32 text-sm font-medium text-stone-700 truncate">{user.name}</span>
            <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E07A5F] rounded-full"
                style={{ width: `${user.percentage}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs text-stone-400 font-mono">{user.percentage}%</span>
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
    const savedHandle = localStorage.getItem("kindsphere_handle");
    setUserHandle(savedHandle);
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-6">
      <div className="w-full max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="font-serif text-4xl font-medium text-foreground">
            {userHandle ? `@${userHandle}'s Personal Digest` : "Your Personalized Digest"}
          </h1>
          <p className="text-lg text-muted-foreground">
            A quiet reflection on the empathy and clarity you have distributed.
          </p>
        </header>

        {/* Navigation */}
        <div className="flex justify-center border-b border-stone-200">
          <nav className="flex gap-8">
            {NAV_ITEMS.map((link) => {
              // Check if the current route matches the href
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 capitalize font-medium text-sm transition-all border-b-2 hover:text-stone-900 hover:border-stone-300 ${isActive ? "border-current" : "border-transparent text-stone-500"
                    }`}
                  style={{
                    // This forces the text and border to the specific color when active
                    color: isActive ? link.color : undefined
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Overview */}
        <div className="pt-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
    </div>
  );
}