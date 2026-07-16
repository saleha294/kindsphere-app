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
import { geoOrthographic, geoPath, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserStatus = "active" | "idle";

export interface RealtimeUser {
    id: string | number;
    anonymousHandle: string;
    status: UserStatus;
    coordinates?: [number, number]; // ignored — land coords are always used
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

const SIZE      = 600;   // logical canvas resolution
const SCALE     = SIZE * 0.44;
const ROT_SPEED = 6;     // degrees per second — subtle, smooth

// ─── Land-only coordinates ────────────────────────────────────────────────────
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

/**
 * Maps a user id deterministically to one of the LAND_COORDS entries.
 * The result is computed once per id and frozen — it never changes for
 * the lifetime of the page, regardless of what `user.coordinates` says.
 */
function landCoordForId(id: string | number): [number, number] {
    const key = String(id);
    const num = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return LAND_COORDS[Math.abs(num) % LAND_COORDS.length];
}

/**
 * True if `coord` is on the visible (near) hemisphere for a globe whose
 * current lon/lat rotation is `rotate` ([lambda, phi, gamma], degrees).
 *
 * IMPORTANT: `clipAngle()` on a d3 projection only affects the stream
 * pipeline used by `geoPath` (land, graticule, sphere outline). It does
 * NOT affect calling the projection directly as a function — `proj(coord)`
 * always returns a valid [x, y], even for points on the far side of the
 * globe. Markers therefore need this explicit visibility test; without it
 * they keep being drawn as they rotate past the horizon, tracing a mirrored
 * path back across the visible disc instead of disappearing.
 */
function isFrontFacing(coord: [number, number], rotate: [number, number, number]): boolean {
    const viewCenter: [number, number] = [-rotate[0], -rotate[1]];
    return geoDistance(coord, viewCenter) <= Math.PI / 2;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActiveGlobe({ className, users = [] }: ActiveGlobeProps) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const rafRef     = useRef<number>(0);
    const lastTRef   = useRef<number>(0);
    const rotRef     = useRef<[number, number, number]>([0, -20, 0]);
    const pausedRef  = useRef(false);
    const geoRef     = useRef<any[]>([]);          // TopoJSON features, loaded once
    const geoReadyRef = useRef(false);             // true only after TopoJSON arrives
    const usersRef   = useRef<RealtimeUser[]>([]);  // always current, no re-render

    // Pre-compute every user's land coord once, keyed by id.
    // This map is rebuilt whenever the users prop changes identity but the
    // coords themselves are deterministic — same id always → same coord.
    const coordMapRef = useRef<Map<string, [number, number]>>(new Map());

    // Tooltip / legend
    const [hovered, setHovered] = useState<RealtimeUser | null>(null);
    const [tipPos,  setTipPos]  = useState({ x: 0, y: 0 });
    const [counts,  setCounts]  = useState({ active: 0, idle: 0 });

    // Keep usersRef + coordMap in sync with prop
    useEffect(() => {
        usersRef.current = users;

        // Assign land coords for any new ids; existing ids are never overwritten
        users.forEach((u) => {
            const key = String(u.id);
            if (!coordMapRef.current.has(key)) {
                coordMapRef.current.set(key, landCoordForId(u.id));
            }
        });

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
                geoReadyRef.current = true;   // signal that land is ready to draw
            })
            .catch(err => console.error("[ActiveGlobe] geo load failed:", err));
    }, []);

    // ── Single rAF loop ───────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width  = SIZE * dpr;
        canvas.height = SIZE * dpr;
        canvas.style.width  = "100%";
        canvas.style.height = "100%";

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);

        const tick = (ts: number) => {
            if (lastTRef.current === 0) lastTRef.current = ts;
            // Clamp dt to one frame max — prevents huge angle jumps when the
            // tab is backgrounded and then brought back to the foreground.
            const dt = Math.min((ts - lastTRef.current) / 1000, 1 / 30);
            lastTRef.current = ts;

            if (!pausedRef.current) {
                rotRef.current[0] += ROT_SPEED * dt;
            }

            // ── Take a snapshot of rotation for this frame ────────────────
            // Both land and dots MUST use the exact same [λ, φ, γ] triple.
            // We snapshot before any drawing so that even if rotRef were
            // mutated mid-frame (impossible in single-threaded JS, but safe),
            // every draw call in this tick uses identical values.
            const lambda = rotRef.current[0];
            const phi    = rotRef.current[1];
            const gamma  = rotRef.current[2];

            const proj = geoOrthographic()
                .translate([SIZE / 2, SIZE / 2])
                .scale(SCALE)
                .rotate([lambda, phi, gamma])
                .clipAngle(90);

            const path = geoPath(proj, ctx);

            // ── Clear ─────────────────────────────────────────────────────
            ctx.clearRect(0, 0, SIZE, SIZE);

            // ── Ocean ─────────────────────────────────────────────────────
            ctx.beginPath();
            path({ type: "Sphere" });
            ctx.fillStyle = OCEAN_COLOR;
            ctx.fill();

            // ── Don't draw anything else until land is ready ──────────────
            // This prevents the "dots floating on ocean" window that exists
            // while the TopoJSON fetch is in-flight.
            if (!geoReadyRef.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // ── Graticule ─────────────────────────────────────────────────
            ctx.strokeStyle = GRID_COLOR;
            ctx.lineWidth   = 0.5;
            // Full-circle latitude rings: longitude -180 → +180
            [-60, -30, 0, 30, 60].forEach(lat => {
                ctx.beginPath();
                path({ type: "LineString", coordinates: Array.from({ length: 361 }, (_, i) => [i - 180, lat]) } as any);
                ctx.stroke();
            });
            // Full-circle longitude meridians: latitude -90 → +90
            [-120, -60, 0, 60, 120].forEach(lng => {
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

            // ── User markers ──────────────────────────────────────────────
            // Every dot uses coordMapRef (pre-computed land coords) projected
            // through the SAME proj instance used above for land.
            // They are physically incapable of being in a different position
            // relative to land features on the same frame.
            usersRef.current.forEach(user => {
                const key   = String(user.id);
                const coord = coordMapRef.current.get(key) ?? landCoordForId(user.id);

                // Explicit front/back visibility test. `proj(coord)` alone
                // does NOT hide back-side points — clipAngle only applies to
                // the geoPath stream pipeline used above for land/graticule,
                // not to direct calls on the projection. Without this check,
                // back-side markers stay drawn and appear to jump/reflect as
                // they cross the horizon.
                if (!isFrontFacing(coord, [lambda, phi, gamma])) return;

                const pt = proj(coord);
                if (!pt) return; // safety net (e.g. numerical edge cases)

                const [cx, cy] = pt;
                const isActive = user.status === "active";

                if (isActive) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(124,58,237,0.35)";
                    ctx.lineWidth   = 1;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
                    ctx.fillStyle   = ACTIVE_DOT;
                    ctx.shadowColor = "rgba(124,58,237,0.5)";
                    ctx.shadowBlur  = 6;
                    ctx.fill();
                    ctx.shadowBlur  = 0;
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
    }, []); // runs once — all data access goes through refs

    // ── Hit-test ─────────────────────────────────────────────────────────
    const handlePointer = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect    = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const mx = ((clientX - rect.left) / rect.width)  * SIZE;
        const my = ((clientY - rect.top)  / rect.height) * SIZE;

        const rotSnapshot: [number, number, number] = [
            rotRef.current[0], rotRef.current[1], rotRef.current[2],
        ];

        const proj = geoOrthographic()
            .translate([SIZE / 2, SIZE / 2])
            .scale(SCALE)
            .rotate(rotSnapshot)
            .clipAngle(90);

        let hit: RealtimeUser | null = null;
        usersRef.current.forEach(user => {
            const key   = String(user.id);
            const coord = coordMapRef.current.get(key) ?? landCoordForId(user.id);

            // Same visibility rule as the draw loop — don't let hidden
            // (back-side) markers be hoverable/clickable.
            if (!isFrontFacing(coord, rotSnapshot)) return;

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

                <canvas
                    ref={canvasRef}
                    style={{ display: "block", width: "100%", height: "100%", cursor: "default" }}
                    onClick={handlePointer}
                    onMouseMove={handlePointer}
                    onMouseLeave={handleLeave}
                    onTouchStart={handlePointer}
                />

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

            {/* Status legend */}
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