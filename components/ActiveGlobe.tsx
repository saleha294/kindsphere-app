// app/components/ActiveGlobe.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Mock user data — no hardcoded coordinates ─── */
export type SphereUser = {
    id: number;
    anonymousHandle: string;
    status: "active" | "idle";
    /* Logical position 0–1 on the canvas, derived from id only */
    _tx: number;
    _ty: number;
};

/* Golden-ratio scatter — deterministic, no geo coords */
function goldenPosition(i: number, total: number): { tx: number; ty: number } {
    const phi = (1 + Math.sqrt(5)) / 2;
    const tx = ((i * phi) % 1);
    const ty = ((i * phi * 1.3) % 1);
    return { tx, ty };
}

const RAW_USERS = [
    { id: 1, anonymousHandle: "DriftingLeaf_92", status: "active" },
    { id: 2, anonymousHandle: "QuietThunder_7", status: "active" },
    { id: 3, anonymousHandle: "SilverMoon_44", status: "idle" },
    { id: 4, anonymousHandle: "WanderingStar_12", status: "active" },
    { id: 5, anonymousHandle: "OceanBreeze_88", status: "active" },
    { id: 6, anonymousHandle: "EmberGlow_3", status: "idle" },
    { id: 7, anonymousHandle: "CedarSmoke_19", status: "active" },
    { id: 8, anonymousHandle: "TidalPulse_55", status: "active" },
    { id: 9, anonymousHandle: "FernWhisper_6", status: "idle" },
    { id: 10, anonymousHandle: "AmberReed_27", status: "active" },
    { id: 11, anonymousHandle: "StoneCircle_14", status: "active" },
    { id: 12, anonymousHandle: "LoamSong_88", status: "idle" },
    { id: 13, anonymousHandle: "RavenCroft_2", status: "active" },
    { id: 14, anonymousHandle: "MistGrove_71", status: "active" },
    { id: 15, anonymousHandle: "CoralEdge_39", status: "idle" },
    { id: 16, anonymousHandle: "PineSilt_66", status: "active" },
    { id: 17, anonymousHandle: "HollowBirch_5", status: "active" },
    { id: 18, anonymousHandle: "SedgeField_30", status: "idle" },
    { id: 19, anonymousHandle: "GlintRock_48", status: "active" },
    { id: 20, anonymousHandle: "VeilMoss_11", status: "active" },
] as const;

export const SPHERE_USERS: SphereUser[] = RAW_USERS.map((u, i) => {
    const { tx, ty } = goldenPosition(i, RAW_USERS.length);
    return { ...u, status: u.status as "active" | "idle", _tx: tx, _ty: ty };
});

/* ─── Ripple state per active user ─── */
type Ripple = { userId: number; phase: number; speed: number };

export default function ActiveGlobe({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const ripples = useRef<Ripple[]>(
        SPHERE_USERS
            .filter((u) => u.status === "active")
            .map((u, i) => ({ userId: u.id, phase: i * 0.42, speed: 0.012 + (i % 5) * 0.003 }))
    );

    const [hovered, setHovered] = useState<SphereUser | null>(null);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        /* Resize handler */
        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas!.getBoundingClientRect();
            canvas!.width = rect.width * dpr;
            canvas!.height = rect.height * dpr;
            ctx!.scale(dpr, dpr);
        }
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        /* Map logical 0–1 tx/ty to canvas pixels with padding */
        function toXY(tx: number, ty: number, w: number, h: number) {
            const pad = 48;
            return { x: pad + tx * (w - pad * 2), y: pad + ty * (h - pad * 2) };
        }

        /* Draw loop */
        function draw(ts: number) {
            const rect = canvas!.getBoundingClientRect();
            const W = rect.width, H = rect.height;
            ctx!.clearRect(0, 0, W, H);

            /* Subtle grid of dots — gives the "map" feel without coordinates */
            ctx!.save();
            for (let gx = 0; gx <= 12; gx++) {
                for (let gy = 0; gy <= 8; gy++) {
                    const x = (gx / 12) * W;
                    const y = (gy / 8) * H;
                    ctx!.beginPath();
                    ctx!.arc(x, y, 1, 0, Math.PI * 2);
                    ctx!.fillStyle = "rgba(129,178,154,0.13)";
                    ctx!.fill();
                }
            }
            ctx!.restore();

            /* Advance ripple phases */
            ripples.current.forEach((r) => { r.phase += r.speed; });

            /* Draw idle users — faint static dot */
            SPHERE_USERS.filter((u) => u.status === "idle").forEach((u) => {
                const { x, y } = toXY(u._tx, u._ty, W, H);
                ctx!.beginPath();
                ctx!.arc(x, y, 3, 0, Math.PI * 2);
                ctx!.fillStyle = "rgba(196,187,179,0.35)";
                ctx!.fill();
            });

            /* Draw active users — ripple rings + core dot */
            SPHERE_USERS.filter((u) => u.status === "active").forEach((u) => {
                const { x, y } = toXY(u._tx, u._ty, W, H);
                const rip = ripples.current.find((r) => r.userId === u.id)!;
                const isHov = hovered?.id === u.id;

                /* Two offset rings */
                [0, 0.45].forEach((offset) => {
                    const t = ((rip.phase + offset) % 1);
                    const radius = 6 + t * 28;
                    const opacity = (1 - t) * (isHov ? 0.55 : 0.28);
                    ctx!.beginPath();
                    ctx!.arc(x, y, radius, 0, Math.PI * 2);
                    ctx!.strokeStyle = isHov
                        ? `rgba(224,122,95,${opacity})`
                        : `rgba(129,178,154,${opacity})`;
                    ctx!.lineWidth = isHov ? 1.5 : 1;
                    ctx!.stroke();
                });

                /* Core dot */
                ctx!.beginPath();
                ctx!.arc(x, y, isHov ? 5.5 : 4, 0, Math.PI * 2);
                ctx!.fillStyle = isHov ? "#E07A5F" : "#81B29A";
                ctx!.shadowColor = isHov ? "rgba(224,122,95,0.5)" : "rgba(129,178,154,0.4)";
                ctx!.shadowBlur = isHov ? 10 : 6;
                ctx!.fill();
                ctx!.shadowBlur = 0;
            });

            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [hovered]);

    /* Mouse hit-test */
    function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const W = rect.width, H = rect.height;
        const pad = 48;

        let found: SphereUser | null = null;
        for (const u of SPHERE_USERS.filter((u) => u.status === "active")) {
            const x = pad + u._tx * (W - pad * 2);
            const y = pad + u._ty * (H - pad * 2);
            if (Math.hypot(mx - x, my - y) < 16) { found = u; break; }
        }
        setHovered(found);
        if (found) setTooltip({ x: mx, y: my });
    }

    const activeCount = SPHERE_USERS.filter((u) => u.status === "active").length;

    return (
        <div className={`relative w-full h-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ cursor: hovered ? "pointer" : "default" }}
                onMouseMove={onMouseMove}
                onMouseLeave={() => setHovered(null)}
            />

            {/* Tooltip */}
            {hovered && (
                <div
                    className="pointer-events-none absolute z-10 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
                    style={{
                        left: tooltip.x + 14,
                        top: tooltip.y - 32,
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(129,178,154,0.35)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        color: "#1C2541",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <span style={{ color: "#81B29A" }}>@</span>{hovered.anonymousHandle}
                    <span
                        className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]"
                        style={{ background: "rgba(129,178,154,0.15)", color: "#4a7c64" }}
                    >
                        active
                    </span>
                </div>
            )}

            {/* Corner legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#81B29A] inline-block" />
                    {activeCount} active now
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" />
                    {SPHERE_USERS.length - activeCount} idle
                </span>
            </div>
        </div>
    );
}