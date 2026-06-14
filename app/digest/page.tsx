"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const METRICS = [
  { value: "14", label: "People You Helped", color: "text-secondary" },
  { value: "8", label: "Feedback Received", color: "text-primary" },
  { value: "3", label: "Connections Made", color: "text-foreground" },
] as const;

export default function DigestPage() {
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const savedHandle = localStorage.getItem("kindsphere_handle");
    setUserHandle(savedHandle);
  }, []);

  const navLinks = [
    { href: "/digest/sent", label: "My Sent Bottles" },
    { href: "/digest/pending", label: "Awaiting My Voice" },
    { href: "/digest/connections", label: "Mutual Connections" },
  ];

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

        {/* Real Navigation (Points to your existing sub-folders) */}
        <div className="flex justify-center border-b border-stone-200">
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 capitalize font-medium text-sm transition-all border-b-2 ${pathname === link.href
                    ? "border-[#E07A5F] text-[#E07A5F]"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Dashboard Overview (Metrics) */}
        <div className="pt-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {METRICS.map(({ value, label, color }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-sm">
                <span className={`font-serif text-5xl block mb-2 ${color}`}>{value}</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}