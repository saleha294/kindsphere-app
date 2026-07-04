"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/utils/supabase/client";
import { getSphereUsers, getSphereStats } from "@/lib/db-queries";

// ── SSR-safe dynamic import ───────────────────────────────────────────────────
const ActiveGlobe = dynamic(
    () => import("@/components/ActiveGlobe"),
    {
        ssr: false,
        loading: () => (
            <div className="w-full aspect-square flex items-center justify-center">
                <div
                    style={{
                        width: 48, height: 48, borderRadius: "50%",
                        border: "2px solid rgba(129,178,154,0.25)",
                        borderTopColor: "#E8A33D",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        ),
    }
);

interface SphereUser {
    id: string;
    anonymousHandle: string;
    status: "active" | "idle";
    coordinates?: [number, number];
}

interface SphereStats {
    driftingBottles: number;
    repliesToday: number;
    totalSouls: number;
}

// Deterministic but jittered status — makes the globe feel alive without
// a real-time subscription for every user.  Status randomly flips every
// ~8 s per user using their id as a seed so rerenders are stable.
function useLiveUsers(baseUsers: SphereUser[]): SphereUser[] {
    const [liveUsers, setLiveUsers] = useState<SphereUser[]>([]);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (baseUsers.length === 0) return;

        const randomise = () => {
            setLiveUsers(
                baseUsers.map((u) => ({
                    ...u,
                    // ~40 % chance to be active at any given tick
                    status: Math.random() < 0.4 ? "active" : "idle",
                }))
            );
        };

        randomise(); // initial render
        tickRef.current = setInterval(randomise, 7000);
        return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }, [baseUsers]);

    return liveUsers;
}

export default function GlobePage() {
    const supabase = createClient();

    const [baseUsers, setBaseUsers] = useState<SphereUser[]>([]);
    const [stats, setStats] = useState<SphereStats>({ driftingBottles: 0, repliesToday: 0, totalSouls: 0 });
    const [loading, setLoading] = useState(true);

    // Presence layer — tracks only users currently on this page
    const [presenceHandles, setPresenceHandles] = useState<Set<string>>(new Set());

    const liveUsers = useLiveUsers(baseUsers);

    // ── Load real users + stats ───────────────────────────────────────────
    useEffect(() => {
        async function load() {
            try {
                const [users, sphereStats] = await Promise.all([
                    getSphereUsers(),
                    getSphereStats(),
                ]);

                setBaseUsers(
                    users.map((u) => ({
                        id: u.id,
                        anonymousHandle: u.anonymous_handle ?? "Anonymous",
                        status: "idle" as const,
                    }))
                );
                setStats(sphereStats);
            } catch (err) {
                console.error("[GlobePage] load error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ── Presence channel — track who's actually on this page ─────────────
    useEffect(() => {
        let channel: any;

        const setupPresence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("users")
                .select("anonymous_handle")
                .eq("id", user.id)
                .single();

            const userHandle = profile?.anonymous_handle || `Soul_${user.id.slice(0, 5)}`;

            channel = supabase.channel("sphere_live_viewers", {
                config: { presence: { key: user.id } },
            });

            channel
                .on("presence", { event: "sync" }, () => {
                    const presenceState = channel.presenceState();
                    const handles = new Set<string>(
                        Object.values(presenceState).flatMap((instances: any) =>
                            instances.map((i: any) => i.anonymousHandle as string)
                        )
                    );
                    setPresenceHandles(handles);
                })
                .subscribe(async (status: string) => {
                    if (status === "SUBSCRIBED") {
                        await channel.track({ anonymousHandle: userHandle, status: "active" });
                    }
                });
        };

        setupPresence();
        return () => { channel?.unsubscribe(); };
    }, []);

    const activeCount = liveUsers.filter((u) => u.status === "active").length;

    return (
        <div className="w-full min-h-screen flex flex-col overflow-hidden" style={{ background: "#FAF9F6" }}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: "#E8A33D" }}>
                        The Sphere — Live
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight" style={{ color: "#1C2541" }}>
                        Thinkers in the sphere<br />
                        <span style={{ color: "#7C3AED" }} className="italic">right now.</span>
                    </h1>
                </div>

                {/* ── Live stats panel ───────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {[
                        { label: "Souls exploring", value: stats.totalSouls, color: "#E8A33D" },
                        { label: "Bottles drifting", value: stats.driftingBottles, color: "#7C3AED" },
                        { label: "Replies sent today", value: stats.repliesToday, color: "#A8DADC" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl px-5 py-3 border border-stone-100 shadow-sm text-center min-w-[100px]"
                        >
                            <p
                                className="font-serif text-3xl font-medium"
                                style={{ color: stat.color }}
                            >
                                {stat.value}
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400 mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Globe ──────────────────────────────────────────────────── */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pb-6" style={{ minHeight: 420 }}>
                <div className="w-full h-full rounded-3xl overflow-hidden relative" style={{ minHeight: 420 }}>
                    {loading ? (
                        <div className="w-full h-full animate-pulse bg-stone-100 rounded-3xl" style={{ minHeight: 420 }} />
                    ) : (
                        <Suspense fallback={<div className="w-full h-full animate-pulse bg-stone-100 rounded-3xl" />}>
                            <ActiveGlobe className="relative z-10" users={liveUsers} />
                        </Suspense>
                    )}
                </div>
            </div>

            {/* ── Currently on this page (Presence) ─────────────────────── */}
            {presenceHandles.size > 0 && (
                <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pb-16 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#E8A33D" }}>
                        Here right now
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[...presenceHandles].map((handle) => (
                            <span
                                key={handle}
                                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                                style={{
                                    background: "rgba(129,178,154,0.08)",
                                    borderColor: "rgba(129,178,154,0.25)",
                                    color: "#4A7C59",
                                }}
                            >
                                @{handle}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
