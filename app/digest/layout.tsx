"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Clock, MessageSquare, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function DigestLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [userHandle, setUserHandle] = useState<string | null>(null);

    // Sync handle state live with local storage activity
    useEffect(() => {
        const checkHandle = () => {
            const savedHandle = localStorage.getItem("kindsphere_handle");
            setUserHandle(savedHandle);
        };

        checkHandle();

        window.addEventListener("storage", checkHandle);
        window.addEventListener("local-handle-updated", checkHandle);

        return () => {
            window.removeEventListener("storage", checkHandle);
            window.removeEventListener("local-handle-updated", checkHandle);
        };
    }, []);

    const tabs = [
        { href: "/digest/sent", label: "My Sent Bottles", icon: Send },
        { href: "/digest/pending", label: "Awaiting My Voice", icon: Clock },
        { href: "/digest/connections", label: "Mutual Connections", icon: MessageSquare },
    ];

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#FAF9F6]">

            {/* ── Guest Onboarding Banner ── (Now disappears instantly for registered users!) */}
            {!userHandle && (
                <div className="w-full bg-gradient-to-r from-[#E07A5F]/10 via-[#81B29A]/10 to-transparent border-b border-[#E07A5F]/15 py-3.5 px-6 animate-fade-in">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                        <p className="text-stone-600 font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#E07A5F] shrink-0" />
                            Viewing sandbox archive. These cards demonstrate how your personal space will look.
                        </p>
                        <button
                            onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                            className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                            style={{ background: "#E07A5F" }}
                        >
                            Claim Your Unique Handle
                        </button>
                    </div>
                </div>
            )}

            {/* ── Sub-Navigation Subheader ── */}
            <div className="w-full bg-white border-b border-stone-200/60 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-start gap-1 overflow-x-auto h-14 scrollbar-none">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 h-full px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${isActive
                                    ? "border-[#E07A5F] text-[#1C2541]"
                                    : "border-transparent text-stone-400 hover:text-stone-600"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-[#E07A5F]" : "text-stone-400"}`} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── Render Target for Sub-Pages ── */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10">
                {children}
            </div>
        </div>
    );
}