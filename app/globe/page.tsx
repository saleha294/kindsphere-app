"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createClient } from "@/lib/utils/supabase/client";

// ── SSR-safe dynamic import (No 'suspense' property here) ─────────────────────
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
                        borderTopColor: "#81B29A",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        ),
    }
);

interface SphereUser {
    presence_ref: string;
    id: string;
    anonymousHandle: string;
    status: "active" | "idle";
}

export default function GlobePage() {
    const supabase = createClient();
    const [sphereUsers, setSphereUsers] = useState<SphereUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let channel: any;

        const setupPresence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data: profile } = await supabase
                .from("profiles")
                .select("anonymous_handle")
                .eq("id", user.id)
                .single();

            const userHandle = profile?.anonymous_handle || `User_${user.id.slice(0, 5)}`;

            channel = supabase.channel("sphere_live_viewers", {
                config: { presence: { key: user.id } },
            });

            channel
                .on("presence", { event: "sync" }, () => {
                    const presenceState = channel.presenceState();
                    const transformedUsers: SphereUser[] = Object.keys(presenceState).map((key) => {
                        const instances = presenceState[key];
                        return {
                            id: key,
                            anonymousHandle: instances[0]?.anonymousHandle || "Anonymous",
                            status: instances[0]?.status || "active",
                            presence_ref: instances[0]?.presence_ref,
                        };
                    });
                    setSphereUsers(transformedUsers);
                    setLoading(false);
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

    const activeUsers = sphereUsers.filter((u) => u.status === "active");
    const idleUsers = sphereUsers.filter((u) => u.status === "idle");

    return (
        <div className="w-full min-h-screen flex flex-col overflow-hidden" style={{ background: "#FAF9F6" }}>
            {/* Header Section */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: "#81B29A" }}>The Sphere — Live</p>
                    <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight" style={{ color: "#1C2541" }}>
                        Thinkers in the sphere<br />
                        <span style={{ color: "#E07A5F" }} className="italic">right now.</span>
                    </h1>
                </div>
            </div>

            {/* Globe Section with Suspense Boundary */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pb-6" style={{ minHeight: 420 }}>
                <div className="w-full h-full rounded-3xl overflow-hidden relative" style={{ minHeight: 420 }}>
                    <Suspense fallback={<div className="w-full h-full animate-pulse bg-stone-100 rounded-3xl" />}>
                        <ActiveGlobe className="relative z-10" users={sphereUsers} />
                    </Suspense>
                </div>
            </div>

            {/* User tag cloud */}
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pb-16 space-y-5">
                {/* ... (Keep your existing User Tag Cloud mapping code here) ... */}
            </div>
        </div>
    );
}