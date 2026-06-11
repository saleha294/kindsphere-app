"use client";

import ActiveGlobe from "@/components/ActiveGlobe";
import Link from "next/link";

interface SphereUser {
    id: number;
    anonymousHandle: string;
    status: "active" | "idle";
}

// Defining the array right here guarantees Next.js sees it as a valid function array!
const SPHERE_USERS: SphereUser[] = [
    { id: 1, anonymousHandle: "DriftingLeaf_92", status: "active" },
    { id: 2, anonymousHandle: "QuietThunder_7", status: "active" },
    { id: 3, anonymousHandle: "SilverMoon_44", status: "active" },
    { id: 4, anonymousHandle: "WanderingStar_12", status: "active" },
    { id: 5, anonymousHandle: "OceanBreeze_88", status: "idle" },
    { id: 6, anonymousHandle: "EmberGlow_3", status: "idle" },
    { id: 7, anonymousHandle: "Solitary_Thinker", status: "active" },
    { id: 8, anonymousHandle: "KindEcho_4", status: "idle" }
];

export default function GlobePage() {
    const activeUsers = SPHERE_USERS.filter((u) => u.status === "active");
    const idleUsers = SPHERE_USERS.filter((u) => u.status === "idle");

    return (
        <div
            className="w-full min-h-screen flex flex-col overflow-hidden"
            style={{ background: "#FAF9F6" }}
        >

            {/* ── Page header ── */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p
                        className="text-xs font-medium uppercase tracking-[0.18em]"
                        style={{ color: "#81B29A" }}
                    >
                        The Sphere — Live
                    </p>
                    <h1
                        className="font-serif text-4xl md:text-5xl font-medium leading-tight"
                        style={{ color: "#1C2541" }}
                    >
                        Thinkers in the sphere
                        <br />
                        <span style={{ color: "#E07A5F" }} className="italic">right now.</span>
                    </h1>
                    <p className="text-base max-w-md leading-relaxed" style={{ color: "#6b7280" }}>
                        Every ripple is a real person — anonymous, present, and open to
                        connection. Hover a dot to glimpse their handle.
                    </p>
                </div>

                {/* Stat pills */}
                <div className="flex gap-3 shrink-0 flex-wrap">
                    <div
                        className="px-5 py-3 rounded-2xl flex flex-col gap-0.5 text-center min-w-[90px]"
                        style={{ background: "rgba(129,178,154,0.10)", border: "1px solid rgba(129,178,154,0.22)" }}
                    >
                        <span className="font-serif text-3xl leading-none" style={{ color: "#81B29A" }}>
                            {activeUsers.length}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider" style={{ color: "#4a7c64" }}>
                            Active
                        </span>
                    </div>
                    <div
                        className="px-5 py-3 rounded-2xl flex flex-col gap-0.5 text-center min-w-[90px]"
                        style={{ background: "rgba(224,122,95,0.08)", border: "1px solid rgba(224,122,95,0.18)" }}
                    >
                        <span className="font-serif text-3xl leading-none" style={{ color: "#E07A5F" }}>
                            {SPHERE_USERS.length}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider" style={{ color: "#a0522d" }}>
                            Total
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Canvas — fills remaining height ── */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pb-6" style={{ minHeight: 420 }}>
                <div
                    className="w-full h-full rounded-3xl overflow-hidden relative"
                    style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(250,249,246,0.9) 100%)",
                        border: "1px solid rgba(214,211,209,0.5)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.04)",
                        minHeight: 420,
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse at 30% 50%, rgba(129,178,154,0.07) 0%, transparent 60%), " +
                                "radial-gradient(ellipse at 75% 40%, rgba(224,122,95,0.05) 0%, transparent 55%)",
                        }}
                    />
                    <ActiveGlobe className="relative z-10" />
                </div>
            </div>

            {/* ── Active user list ── */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pb-16 space-y-5">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#81B29A" }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#81B29A" }} />
                    </span>
                    <h2 className="font-serif text-xl font-medium" style={{ color: "#1C2541" }}>
                        Active right now
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {activeUsers.map((u) => (
                        <span
                            key={u.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                                background: "rgba(129,178,154,0.10)",
                                border: "1px solid rgba(129,178,154,0.25)",
                                color: "#1C2541",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: "#81B29A" }} />
                            @{u.anonymousHandle}
                        </span>
                    ))}
                    {idleUsers.map((u) => (
                        <span
                            key={u.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                                background: "rgba(196,187,179,0.12)",
                                border: "1px solid rgba(196,187,179,0.25)",
                                color: "#9ca3af",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0 bg-stone-300" />
                            @{u.anonymousHandle}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/drop"
                        className="inline-flex items-center justify-center rounded-full text-sm font-semibold px-7 py-3 transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "#E07A5F", color: "#FAF9F6", boxShadow: "0 4px 20px rgba(224,122,95,0.25)" }}
                    >
                        Drop your bottle into the sphere
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-full text-sm font-semibold px-7 py-3 border transition-all hover:bg-stone-50 active:scale-95"
                        style={{ borderColor: "#d6d3d1", color: "#1C2541" }}
                    >
                        Browse the feed
                    </Link>
                </div>
            </div>

        </div>
    );
}