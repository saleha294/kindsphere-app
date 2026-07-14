"use client";

/**
 * ActiveGlobe.tsx — KindSphere
 *
 * Canvas-based globe renderer.
 * Land, grid, and user markers are all drawn in a single rAF loop
 * using the SAME projection instance per frame — markers can never
 * drift relative to the land because they share one coordinate system.
 *
 * Dependencies: d3-geo, topojson-client (no react-simple-maps)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserStatus = "active" | "idle";

export interface RealtimeUser {
    id: string | number;
    anonymousHandle: string;
    status: UserStatus;
    coordinates?: [number, number];
}

interface ActiveGlobeProps {
    className?: string;
    users: RealtimeUser[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const OCEAN_COLOR   = "#A8D5E2";
const LAND_COLOR    = "#42b04d";
const LAND_STROKE   = "#6A9E87";
const ACTIVE_DOT    = "#7C3AED";
const IDLE_DOT      = "#9E9892";
const GLOBE_OUTLINE = "rgba(162,210,223,0.7)";
const GRID_COLOR    = "rgba(255,255,255,0.18)";

const SIZE      = 600;           // logical canvas resolution
const SCALE     = SIZE * 0.44;
// Globe is stationary — rotation is fixed at initial position

// ─── Land-only fallback coordinates ──────────────────────────────────────────
// 40 verified city centroids — none over water.
const LAND_COORDS: [number, number][] = [
    [-74.006, 40.712],  [-0.128,  51.507],  [2.349,  48.864],  [13.405, 52.520],
    [37.617,  55.756],  [116.407, 39.904],  [139.692,35.690],  [72.878, 19.076],
    [-43.173,-22.907],  [18.423, -33.925],  [151.209,-33.868], [-99.133,19.432],
    [-58.381,-34.603],  [28.047, -26.204],  [103.820,  1.352], [31.235, 30.044],
    [-87.629, 41.878],  [-46.633,-23.548],  [77.209,  28.614], [106.845,-6.208],
    [23.727,  37.983],  [4.900,  52.369],   [-3.703,  40.417], [12.483, 41.895],
    [49.558,  24.688],  [67.082,  24.861],  [90.407,  23.723], [126.978,37.566],
    [-79.383, 43.653],  [-122.419,37.775],  [30.523,  50.450], [55.270, 25.204],
    [174.763,-36.848],  [-70.669,-33.448],  [-66.879, 10.480], [3.379,   6.524],
    [36.817,  -1.286],  [32.582,   0.347],  [47.498,   8.998], [-17.443,14.693],
];

// Module-level cache — survives re-renders and hot reloads.
const coordCache = new Map<string, [number, number]>();

function getStableCoord(id: string | number, override?: [number, number]): [number, number] {
    const key = String(id);
    if (override) { coordCache.set(key, override); return override; }
    if (coordCache.has(key)) return coordCache.get(key)!;
    const num = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const coord = LAND_COORDS[Math.abs(num) % LAND_COORDS.length];
    coordCache.set(key, coord);
    return coord;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActiveGlobe({ className, users = [] }: ActiveGlobeProps) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const rafRef     = useRef<number>(0);
    const lastTRef   = useRef<number>(0);
    const rotRef     = useRef<[number, number, number]>([0, -20, 0]);
    const pausedRef  = useRef(false);
    const geoRef     = useRef<any[]>([]);          // TopoJSON features, loaded once
    const usersRef   = useRef<RealtimeUser[]>([]);  // always current, no re-render needed

    // Tooltip / legend — these are the only pieces that need React state
    const [hovered, setHovered]     = useState<RealtimeUser | null>(null);
    const [tipPos,  setTipPos]      = useState({ x: 0, y: 0 });
    const [counts,  setCounts]      = useState({ active: 0, idle: 0 });

    // Keep usersRef in sync with prop without triggering the rAF loop
    useEffect(() => {
        usersRef.current = users;
        setCounts({
            active: users.filter(u => u.status === "active").length,
            idle:   users.filter(u => u.status !== "active").length,
        });
    }, [users]);

    // ── Load TopoJSON once ────────────────────────────────────────────────
    useEffect(() => {
        fetch(GEO_URL)
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Topology>; })
            .then(topo => {
                const col = feature(topo, topo.objects["countries"] as GeometryCollection);
                geoRef.current = col.features as any[];
            })
            .catch(err => console.error("[ActiveGlobe] geo load failed:", err));
    }, []);

    // ── Single rAF loop — globe + markers drawn with ONE projection ───────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scale canvas for device pixel ratio so it's sharp on retina / mobile
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = SIZE * dpr;
        canvas.height = SIZE * dpr;
        canvas.style.width  = "100%";
        canvas.style.height = "100%";

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);

        const tick = (ts: number) => {
            if (lastTRef.current === 0) lastTRef.current = ts;
            lastTRef.current = ts;

            // Globe is stationary — rotRef.current never changes after mount

            // ── Build projection for THIS frame ──────────────────────────
            const proj = geoOrthographic()
                .translate([SIZE / 2, SIZE / 2])
                .scale(SCALE)
                .rotate(rotRef.current)
                .clipAngle(90);

            const path = geoPath(proj, ctx);

            // ── Clear ─────────────────────────────────────────────────────
            ctx.clearRect(0, 0, SIZE, SIZE);

            // ── Ocean ─────────────────────────────────────────────────────
            ctx.beginPath();
            path({ type: "Sphere" });
            ctx.fillStyle = OCEAN_COLOR;
            ctx.fill();

            // ── Graticule (lat/lng grid) ──────────────────────────────────
            ctx.strokeStyle = GRID_COLOR;
            ctx.lineWidth   = 0.5;
            const latLines = [-60, -30, 0, 30, 60];
            const lngLines = [-120, -60, 0, 60, 120];
            latLines.forEach(lat => {
                ctx.beginPath();
                path({ type: "LineString", coordinates: Array.from({ length: 181 }, (_, i) => [i - 90, lat]) } as any);
                ctx.stroke();
            });
            lngLines.forEach(lng => {
                ctx.beginPath();
                path({ type: "LineString", coordinates: Array.from({ length: 181 }, (_, i) => [lng, i - 90]) } as any);
                ctx.stroke();
            });

            // ── Land ──────────────────────────────────────────────────────
            geoRef.current.forEach(geo => {
                ctx.beginPath();
                path(geo);
                ctx.fillStyle   = LAND_COLOR;
                ctx.fill();
                ctx.strokeStyle = LAND_STROKE;
                ctx.lineWidth   = 0.4;
                ctx.stroke();
            });

            // ── Globe rim ─────────────────────────────────────────────────
            ctx.beginPath();
            path({ type: "Sphere" });
            ctx.strokeStyle = GLOBE_OUTLINE;
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            // ── User markers — same projection, same frame ────────────────
            usersRef.current.forEach(user => {
                const coord = getStableCoord(user.id, user.coordinates);
                const pt    = proj(coord);
                if (!pt) return; // behind the horizon

                const [cx, cy] = pt;
                const isActive = user.status === "active";

                if (isActive) {
                    // Outer pulse ring (static — pulse handled by CSS on the overlay)
                    ctx.beginPath();
                    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(124,58,237,0.35)";
                    ctx.lineWidth   = 1;
                    ctx.stroke();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
                    ctx.fillStyle = ACTIVE_DOT;
                    ctx.shadowColor = "rgba(124,58,237,0.5)";
                    ctx.shadowBlur  = 6;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    ctx.beginPath();
                    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                    ctx.globalAlpha = 0.55;
                    ctx.fillStyle   = IDLE_DOT;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            });

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []); // runs once — usersRef / geoRef are refs, not state

    // ── Hit-test on click/tap for tooltip ────────────────────────────────
    const handlePointer = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // Map client coords → logical SIZE coords
        const mx = ((clientX - rect.left) / rect.width)  * SIZE;
        const my = ((clientY - rect.top)  / rect.height) * SIZE;

        const proj = geoOrthographic()
            .translate([SIZE / 2, SIZE / 2])
            .scale(SCALE)
            .rotate(rotRef.current)
            .clipAngle(90);

        let hit: RealtimeUser | null = null;
        usersRef.current.forEach(user => {
            const coord = getStableCoord(user.id, user.coordinates);
            const pt = proj(coord);
            if (!pt) return;
            const dx = pt[0] - mx;
            const dy = pt[1] - my;
            if (Math.sqrt(dx * dx + dy * dy) < 14) hit = user;
        });

        if (hit) {
            pausedRef.current = true;
            setHovered(hit);
            setTipPos({ x: clientX - rect.left, y: clientY - rect.top });
        } else {
            pausedRef.current = false;
            setHovered(null);
        }
    }, []);

    const handleLeave = useCallback(() => {
        pausedRef.current = false;
        setHovered(null);
    }, []);

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ background: "transparent" }}
        >
            <div className="relative w-full max-w-[560px] aspect-square">

                {/* ── Canvas — the entire globe is drawn here ──────────────── */}
                <canvas
                    ref={canvasRef}
                    style={{ display: "block", width: "100%", height: "100%", cursor: "default" }}
                    onClick={handlePointer}
                    onMouseMove={handlePointer}
                    onMouseLeave={handleLeave}
                    onTouchStart={handlePointer}
                />

                {/* ── Tooltip ──────────────────────────────────────────────── */}
                {hovered && (
                    <div
                        className="pointer-events-none absolute z-20 whitespace-nowrap"
                        style={{ left: tipPos.x + 18, top: tipPos.y, transform: "translateY(-50%)" }}
                    >
                        <div style={{
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                            border: "1px solid rgba(129,178,154,0.3)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                            borderRadius: 12,
                            padding: "7px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            <span style={{ fontSize: 12, color: "#E8A33D", fontWeight: 700 }}>@</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1C2541" }}>
                                {hovered.anonymousHandle}
                            </span>
                            <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
                                textTransform: "uppercase", padding: "2px 7px", borderRadius: 999,
                                background: hovered.status === "active" ? "rgba(129,178,154,0.15)" : "rgba(158,152,146,0.12)",
                                color: hovered.status === "active" ? "#3D8A65" : "#6B6560",
                            }}>
                                {hovered.status}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Status legend ────────────────────────────────────────────── */}
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5"
                style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(200,200,200,0.3)",
                    borderRadius: 999, padding: "6px 16px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    fontSize: 11, fontWeight: 500, color: "#6B6560",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: ACTIVE_DOT, display: "inline-block",
                        boxShadow: "0 0 0 2px rgba(124,58,237,0.25)",
                        animation: "legendPulse 2s ease-in-out infinite",
                    }} />
                    {counts.active} Active
                </span>
                <span style={{ width: 1, height: 12, background: "rgba(0,0,0,0.1)", display: "inline-block" }} />
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: IDLE_DOT, opacity: 0.6, display: "inline-block",
                    }} />
                    {counts.idle} Idle
                </span>
            </div>

            <style>{`
                @keyframes legendPulse {
                    0%, 100% { box-shadow: 0 0 0 2px rgba(124,58,237,0.25); }
                    50%      { box-shadow: 0 0 0 5px rgba(124,58,237,0.04); }
                }
            `}</style>
        </div>
    );
}
