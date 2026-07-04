"use client";

/**
 * ActiveGlobe.tsx — KindSphere
 *
 * Zero react-simple-maps dependency. Uses only:
 * - d3-geo        (projection math — React 19 safe, no prop-types)
 * - topojson-client (converts TopoJSON → GeoJSON features)
 */

import { useEffect, useRef, useState } from "react";
import { geoOrthographic, geoPath, GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserStatus = "active" | "idle";

// This represents the real user shape coming from your real-time presence channel
export interface RealtimeUser {
    id: string | number;
    anonymousHandle: string;
    status: UserStatus;
    coordinates?: [number, number]; // Optional, will fallback gracefully
}

interface ActiveGlobeProps {
    className?: string;
    users: RealtimeUser[];
}

type GeoFeature = {
    type: "Feature";
    geometry: GeoPermissibleObjects;
    properties: Record<string, unknown>;
    rsmKey?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const OCEAN_COLOR = "#A8D5E2";
const LAND_COLOR = "#E8A33D";
const LAND_STROKE = "#6A9E87";
const ACTIVE_DOT = "#7C3AED";
const IDLE_DOT = "#9E9892";
const GLOBE_OUTLINE = "rgba(162, 210, 223, 0.45)";

const SVG_W = 600;
const SVG_H = 600;

// Deterministic fallback generator so empty coords spread across different parts of the map nicely
const getDeterministicCoordinates = (id: string | number): [number, number] => {
    const num = typeof id === "number" ? id : id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lng = ((num * 17) % 360) - 180; // Spread between -180 and 180
    const lat = ((num * 31) % 120) - 60;  // Spread between -60 and 60
    return [lng, lat];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActiveGlobe({ className, users = [] }: ActiveGlobeProps) {
    const [rotation, setRotation] = useState<[number, number, number]>([0, -20, 0]);
    const [countries, setCountries] = useState<GeoFeature[]>([]);
    const [hoveredUser, setHoveredUser] = useState<RealtimeUser | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const rotationRef = useRef<[number, number, number]>([0, -20, 0]);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const isPausedRef = useRef(false);

    // ── Fetch world TopoJSON ──────────────────────────────────────────────────
    useEffect(() => {
        fetch(GEO_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<Topology>;
            })
            .then((topo) => {
                const collection = feature(
                    topo,
                    topo.objects["countries"] as GeometryCollection
                );
                const feats = collection.features as GeoFeature[];
                setCountries(feats);
            })
            .catch((err) => console.error("[ActiveGlobe] geography load failed:", err));
    }, []);

    // ── Smooth auto-rotation ────────────────────────────────────────────────────
    useEffect(() => {
        // Rotation disabled to keep users stationary
    }, []);

    // ── Build projection per frame ─────────────────────────────────────────────
    const projection = geoOrthographic()
        .translate([SVG_W / 2, SVG_H / 2])
        .scale(SVG_W * 0.44)
        .rotate(rotation)
        .clipAngle(90);

    const pathGen = geoPath(projection);
    const spherePath = pathGen({ type: "Sphere" }) ?? "";

    // 🌟 FIXED: Reading numbers directly from your live database presence array!
    const activeCount = users.filter((u) => u.status === "active").length;
    const idleCount = users.length - activeCount;

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ background: "transparent" }}
        >
            <div className="relative w-full max-w-[560px] aspect-square">

                {/* ── Globe SVG ──────────────────────────────────────────────────── */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    width="100%"
                    height="100%"
                    style={{ display: "block", background: "transparent", overflow: "visible" }}
                    onMouseLeave={() => {
                        isPausedRef.current = false;
                        setHoveredUser(null);
                    }}
                >
                    {/* Ocean fill */}
                    <path d={spherePath} fill={OCEAN_COLOR} />

                    {/* Latitudinal grid */}
                    {[-60, -30, 0, 30, 60].map((lat) => {
                        const gratPath = pathGen({
                            type: "LineString",
                            coordinates: Array.from({ length: 181 }, (_, i) => [i - 90, lat] as [number, number]),
                        });
                        return gratPath ? (
                            <path
                                key={`lat-${lat}`}
                                d={gratPath}
                                fill="none"
                                stroke="rgba(255,255,255,0.18)"
                                strokeWidth={0.5}
                            />
                        ) : null;
                    })}

                    {/* Longitudinal grid */}
                    {[-120, -60, 0, 60, 120].map((lng) => {
                        const gratPath = pathGen({
                            type: "LineString",
                            coordinates: Array.from({ length: 181 }, (_, i) => [lng, i - 90] as [number, number]),
                        });
                        return gratPath ? (
                            <path
                                key={`lng-${lng}`}
                                d={gratPath}
                                fill="none"
                                stroke="rgba(255,255,255,0.18)"
                                strokeWidth={0.5}
                            />
                        ) : null;
                    })}

                    {/* Countries */}
                    {countries.map((geo, idx) => {
                        const d = pathGen(geo.geometry);
                        if (!d) return null;
                        return (
                            <path
                                key={idx}
                                d={d}
                                fill={LAND_COLOR}
                                stroke={LAND_STROKE}
                                strokeWidth={0.4}
                                strokeLinejoin="round"
                            />
                        );
                    })}

                    {/* Globe rim */}
                    <path d={spherePath} fill="none" stroke={GLOBE_OUTLINE} strokeWidth={1.5} />

                    {/* ── 🌟 DYNAMIC USER MARKERS ─────────────────────────────────────────── */}
                    {users.map((user) => {
                        // Safe coordinates determination: use real ones, or fall back dynamically using their ID
                        const targetCoords = user.coordinates || getDeterministicCoordinates(user.id);
                        const pt = projection(targetCoords);

                        if (!pt) return null; // Dot falls behind the visible horizon

                        const [cx, cy] = pt;
                        const isHov = hoveredUser?.id === user.id;

                        const handleEnter = (e: React.MouseEvent<SVGGElement>) => {
                            isPausedRef.current = true;
                            setHoveredUser(user);
                            const svgEl = (e.currentTarget as SVGGElement).closest("svg");
                            if (!svgEl) return;
                            const r = svgEl.getBoundingClientRect();
                            const scaleX = r.width / SVG_W;
                            const scaleY = r.height / SVG_H;
                            setTooltipPos({ x: cx * scaleX, y: cy * scaleY });
                        };

                        const handleLeave = () => {
                            isPausedRef.current = false;
                            setHoveredUser(null);
                        };

                        return (
                            <g
                                key={user.id}
                                transform={`translate(${cx},${cy})`}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={handleEnter}
                                onMouseLeave={handleLeave}
                            >
                                {user.status === "active" ? (
                                    <>
                                        <circle
                                            r={isHov ? 20 : 15}
                                            fill="none"
                                            stroke={ACTIVE_DOT}
                                            strokeWidth={isHov ? 1.5 : 1}
                                            style={{
                                                animation: "kindPulse 2.6s ease-out infinite",
                                                transformOrigin: "center",
                                            }}
                                        />
                                        <circle
                                            r={isHov ? 20 : 15}
                                            fill="none"
                                            stroke={ACTIVE_DOT}
                                            strokeWidth={isHov ? 1.5 : 1}
                                            style={{
                                                animation: "kindPulse 2.6s ease-out 1.3s infinite",
                                                transformOrigin: "center",
                                            }}
                                        />
                                        <circle
                                            r={isHov ? 7 : 4.5}
                                            fill={isHov ? "#d4644a" : ACTIVE_DOT}
                                            style={{
                                                filter: isHov
                                                    ? "drop-shadow(0 0 8px rgba(224,122,95,0.75))"
                                                    : "drop-shadow(0 0 3px rgba(224,122,95,0.4))",
                                                transition: "r 0.18s ease, filter 0.18s ease",
                                            }}
                                        />
                                    </>
                                ) : (
                                    <circle
                                        r={isHov ? 5.5 : 3.5}
                                        fill={IDLE_DOT}
                                        opacity={isHov ? 0.85 : 0.55}
                                        style={{ transition: "r 0.18s ease, opacity 0.18s ease" }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* ── Tooltip ──────────────────────────────────────────────────── */}
                {hoveredUser && (
                    <div
                        className="pointer-events-none absolute z-20 whitespace-nowrap"
                        style={{
                            left: tooltipPos.x + 18,
                            top: tooltipPos.y,
                            transform: "translateY(-50%)",
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                border: "1px solid rgba(129,178,154,0.3)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                                borderRadius: 12,
                                padding: "7px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span style={{ fontSize: 12, color: "#E8A33D", fontWeight: 700 }}>@</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1C2541", letterSpacing: "-0.01em" }}>
                                {hoveredUser.anonymousHandle}
                            </span>
                            <span
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: "0.07em",
                                    textTransform: "uppercase",
                                    padding: "2px 7px",
                                    borderRadius: 999,
                                    background: hoveredUser.status === "active"
                                        ? "rgba(129,178,154,0.15)"
                                        : "rgba(158,152,146,0.12)",
                                    color: hoveredUser.status === "active" ? "#3D8A65" : "#6B6560",
                                }}
                            >
                                {hoveredUser.status}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Status legend ───────────────────────────────────────────────── */}
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5"
                style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(200,200,200,0.3)",
                    borderRadius: 999,
                    padding: "6px 16px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#6B6560",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span
                        style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: ACTIVE_DOT,
                            display: "inline-block",
                            boxShadow: "0 0 0 2px rgba(224,122,95,0.25)",
                            animation: "legendPulse 2s ease-in-out infinite",
                        }}
                    />
                    {activeCount} Active
                </span>
                <span style={{ width: 1, height: 12, background: "rgba(0,0,0,0.1)", display: "inline-block" }} />
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span
                        style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: IDLE_DOT, opacity: 0.6,
                            display: "inline-block",
                        }}
                    />
                    {idleCount} Idle
                </span>
            </div>

            {/* ── Keyframe animations ─────────────────────────────────────────── */}
            <style>{`
        @keyframes kindPulse {
          0%   { opacity: 0.6; transform: scale(0.3); }
          70%  { opacity: 0;   transform: scale(1);   }
          100% { opacity: 0;   transform: scale(1);   }
        }
        @keyframes legendPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(224,122,95,0.25); }
          50%       { box-shadow: 0 0 0 5px rgba(224,122,95,0.04); }
        }
      `}</style>
        </div>
    );
}