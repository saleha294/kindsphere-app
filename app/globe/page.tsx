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

const quotes = [
    { text: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" },
    { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
    { text: "Be kind, for everyone you meet is fighting a hard battle.", author: "Plato" },
    { text: "The smallest act of kindness is worth more than the grandest intention.", author: "Oscar Wilde" },
    { text: "Always be a little kinder than necessary.", author: "J.M. Barrie" },
    { text: "Kindness is the golden chain by which society is bound together.", author: "Johann Wolfgang von Goethe" },
    { text: "A warm smile is the universal language of kindness.", author: "William Arthur Ward" },
    { text: "In a world where you can be anything, be kind.", author: "Unknown" },
    { text: "Kindness is the sunshine in which virtue grows.", author: "Robert Green Ingersoll" },
    { text: "The best portion of a good man's life is his little, nameless, unremembered acts of kindness and love.", author: "William Wordsworth" }
];

// Logic: Changes index every hour (3600000ms = 1 hour)
const quoteIndex = Math.floor(Date.now() / 3600000) % quotes.length;
const currentQuote = quotes[quoteIndex];

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

// ─── Land-only fallback coordinates (mirrors ActiveGlobe's LAND_COORDS) ──────
const LAND_COORDS_PAGE: [number, number][] = [
    [-74.006, 40.712], [-0.128, 51.507],  [2.349, 48.864],   [13.405, 52.52],
    [37.617, 55.756],  [116.407, 39.904], [139.692, 35.690], [72.878, 19.076],
    [-43.173, -22.907],[18.423, -33.925], [151.209, -33.868],[-99.133, 19.432],
    [-58.381, -34.603],[28.047, -26.204], [103.820, 1.352],  [31.235, 30.044],
    [-87.629, 41.878], [-46.633, -23.548],[77.209, 28.614],  [106.845, -6.208],
    [23.727, 37.983],  [4.900, 52.369],   [-3.703, 40.417],  [12.483, 41.895],
    [49.558, 24.688],  [67.082, 24.861],  [90.407, 23.723],  [126.978, 37.566],
    [-79.383, 43.653], [-122.419, 37.775],[30.523, 50.450],  [55.270, 25.204],
    [174.763, -36.848],[-70.669, -33.448],[-66.879, 10.480], [3.379, 6.524],
    [36.817, -1.286],  [32.582, 0.347],   [47.498, 8.998],   [-17.443, 14.693],
];

function pinCoord(id: string): [number, number] {
    const num = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return LAND_COORDS_PAGE[Math.abs(num) % LAND_COORDS_PAGE.length];
}

// ─── Stable-coordinate live-status hook ──────────────────────────────────────
// Coordinates are assigned ONCE when baseUsers first arrives and never change.
// Only `status` is toggled on each tick so markers never jump.
function useLiveUsers(baseUsers: SphereUser[]): SphereUser[] {
    const [liveUsers, setLiveUsers] = useState<SphereUser[]>([]);
    // Stable coords keyed by user id — assigned once, reused forever.
    const coordMapRef = useRef<Map<string, [number, number]>>(new Map());
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (baseUsers.length === 0) return;

        // Assign coordinates once; skip any id that already has one.
        baseUsers.forEach((u) => {
            if (!coordMapRef.current.has(u.id)) {
                coordMapRef.current.set(
                    u.id,
                    u.coordinates ?? pinCoord(u.id)
                );
            }
        });

        const tick = () => {
            setLiveUsers(
                baseUsers.map((u) => ({
                    ...u,
                    coordinates: coordMapRef.current.get(u.id),
                    // ~40% chance to be active at any given tick
                    status: Math.random() < 0.4 ? "active" : "idle",
                }))
            );
        };

        tick(); // initial render
        tickRef.current = setInterval(tick, 7000);
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
            {/* ── Live stats panel ───────────────────────────────────── */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-wrap gap-4">
                    {[
                        { label: "Souls exploring", value: stats.totalSouls, color: "#E8A33D", desc: "Active wanderers currently in the sphere." },
                        { label: "Bottles drifting", value: stats.driftingBottles, color: "#7C3AED", desc: "Unopened messages awaiting a kind heart." },
                        { label: "Replies sent", value: stats.repliesToday, color: "#10B981", desc: "Acts of kindness shared in the last 24h." },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="group relative bg-white rounded-2xl p-5 border border-stone-100 shadow-sm min-w-[240px] flex-1 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Subtle hover gradient background */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                                style={{ background: `linear-gradient(135deg, ${stat.color}, transparent)` }} />

                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400 mb-1 relative z-10">
                                {stat.label}
                            </p>
                            <p className="font-serif text-3xl font-medium mb-1 relative z-10" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                            <p className="text-xs text-stone-500 leading-relaxed relative z-10">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── users here ───────────────────────────────────── */}
            {presenceHandles.size > 0 && (
                <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-6 md:flex-row md:items-end justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#E8A33D] animate-pulse" />
                        <p className="text-3xl] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
                            Here right now
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {[...presenceHandles].map((handle) => (
                            <span
                                key={handle}
                                className="px-4 py-2.5 rounded-full mt-4 text-xs font-medium border transition-all duration-300 hover:scale-105 cursor-default"
                                style={{
                                    backgroundColor: "rgba(124, 58, 237, 0.08)", // Light Purple background
                                    borderColor: "rgba(124, 58, 237, 0.3)",      // Purple border
                                    color: "#7C3AED",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(129,178,154,0.15)";
                                    e.currentTarget.style.borderColor = "rgba(129,178,154,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(129,178,154,0.05)";
                                    e.currentTarget.style.borderColor = "rgba(129,178,154,0.2)";
                                }}
                            >
                                @{handle}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Quote Sphere ───────────────────────────────────── */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                {[0, 1, 2].map((i) => {
                    const quoteIndex = (Math.floor(Date.now() / 3600000) + i) % quotes.length;
                    const { text, author } = quotes[quoteIndex];

                    return (
                        <div
                            key={i}
                            className="animate-float group relative w-full md:w-1/3 aspect-square rounded-full flex flex-col items-center justify-center p-8 text-center transition-all duration-700 hover:scale-105"
                            style={{
                                backgroundImage: "url('/assets/imagery/background.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                animationDelay: `${i * 0.3}s`
                            }}
                        >
                            {/* Semi-transparent overlay for readability */}
                            <div className="absolute inset-0 bg-white/60 rounded-full" />

                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <p className="font-serif text-lg italic text-stone-800 leading-relaxed px-4">
                                    "{text}"
                                </p>
                                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                                    — {author}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
