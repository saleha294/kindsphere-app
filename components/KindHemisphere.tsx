"use client";

/**
 * KindDome.tsx
 *
 * A friendly half-sphere "Earth" character with cursor-tracking googly eyes.
 * Sits flat-bottomed on a surface (dome shape, not a floating full sphere).
 * Smooth flat-color land/water — no illustrated linework, no halo.
 *
 * Install once:
 *   npm install framer-motion
 *
 * Usage (drop-in, no props required):
 *   <KindDome />
 *
 * Usage inside a hero column:
 *   <div className="relative w-full max-w-[380px] aspect-square">
 *     <KindDome />
 *   </div>
 */

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Brand palette ───────────────────────────────────────────────────────────
const SAGE = "#81B29A"; // land
const SAGE_DEEP = "#5E9379"; // land shadow side
const SAGE_BLUE = "#A8D5E2"; // water
const SAGE_BLUE_DEEP = "#7FB8CC"; // water shadow side
const INK = "#1C2541"; // pupils / smile

export default function KindDome({ className = "" }: { className?: string }) {
  // ── Raw pointer position in viewport space ────────────────────────────────
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const faceRef = useRef<HTMLDivElement>(null);
  const faceCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    }
    function updateFaceCenter() {
      const el = faceRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Eyes sit in the upper portion of the dome — bias center upward
      // slightly so tracking direction feels correct from the eyes' actual
      // position, not the bounding box midpoint of the whole hemisphere.
      faceCenter.current = { x: r.left + r.width / 2, y: r.top + r.height * 0.38 };
    }

    updateFaceCenter();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", updateFaceCenter);
    const interval = setInterval(updateFaceCenter, 250);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateFaceCenter);
      clearInterval(interval);
    };
  }, [pointerX, pointerY]);

  const leftEye = useEyeTracking(pointerX, pointerY, faceCenter);
  const rightEye = useEyeTracking(pointerX, pointerY, faceCenter);

  return (
    <div className={`relative flex items-end justify-center select-none ${className}`}>
      {/* ── Sizing wrapper — large and fluid, fills a hero column ────────── */}
      <div className="relative w-[clamp(280px,38vw,560px)] aspect-[2/1.15]">

        {/* ── Idle bounce wrapper — affects the whole dome + face together ─ */}
        <motion.div
          ref={faceRef}
          className="absolute inset-0 flex items-end justify-center"
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Soft ambient shadow puddle beneath the dome, sells the "object
              resting on a surface" feeling without needing real 3D */}
          <div
            className="absolute bottom-[1%] left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              width: "72%",
              height: "9%",
              background: "radial-gradient(ellipse, rgba(28,37,65,0.14) 0%, transparent 75%)",
              filter: "blur(3px)",
            }}
          />

          {/* ── The hemisphere itself ──────────────────────────────────── */}
          <div
            className="relative w-full"
            style={{
              height: "94%",
              borderRadius: "999px 999px 0 0",
              overflow: "hidden",
              boxShadow:
                "0 20px 40px rgba(28,37,65,0.14), inset 0 -8px 18px rgba(28,37,65,0.07)",
            }}
          >
            {/* Layer 0 — base ocean fill, smooth flat color, the canvas the
                continents sit on. No texture, no gradient noise. */}
            <div className="absolute inset-0" style={{ background: SAGE_BLUE }} />

            {/* Layer 1 — the continent map. Smooth flat-color SVG land
                silhouettes (single fill, no shading gradient inside the
                shapes themselves — all the dimensionality comes from the
                lighting layers above, keeping the land/water edges crisp
                and clean rather than illustrated/textured). Swap the
                <path> shapes below for your own continent art if you have
                it — see notes at the bottom of this file. */}
            <svg
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
            >
              {/* "Continent" A — large landmass, upper-left, wrapping the
                  brow the way the reference image's main continent does */}
              <path
                d="M18,38
                   C10,52 14,70 28,78
                   C24,92 34,104 50,102
                   C58,116 80,118 92,104
                   C108,108 122,96 118,80
                   C132,74 134,56 120,46
                   C124,30 110,16 92,20
                   C80,6 56,6 46,20
                   C30,14 16,24 18,38 Z"
                fill={SAGE}
              />
              {/* "Continent" B — smaller landmass, lower-right, breaks up
                  symmetry so it reads as a map rather than a single blob */}
              <path
                d="M128,118
                   C120,128 124,144 138,148
                   C138,162 154,170 166,160
                   C180,162 190,150 184,138
                   C192,128 186,114 172,114
                   C166,102 148,102 142,112
                   C134,108 124,110 128,118 Z"
                fill={SAGE}
              />
              {/* small island specks for an archipelago feel */}
              <circle cx="158" cy="60" r="6" fill={SAGE} />
              <circle cx="170" cy="74" r="3.5" fill={SAGE} />
              <circle cx="44" cy="128" r="5" fill={SAGE} />
            </svg>

            {/* Layer 2 — directional light, top-left highlight that curves
                with the dome; smooth and soft, this is what reads as "3D
                sphere" rather than texture/illustration doing the work */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 32% 18%,
                  rgba(255,255,255,0.55) 0%,
                  rgba(255,255,255,0.18) 22%,
                  transparent 48%)`,
              }}
            />

            {/* Layer 3 — rim shadow, darkens the lower curved edge to fake
                ambient occlusion against the "ground" */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 130%,
                  rgba(28,37,65,0.30) 0%,
                  transparent 55%)`,
              }}
            />

            {/* Layer 4 — soft terminator shadow on the side away from the
                light, reinforces curvature on the right edge, smoothly
                blended so it never reads as a hard seam */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(115deg,
                  transparent 55%,
                  ${SAGE_BLUE_DEEP}33 78%,
                  ${SAGE_DEEP}22 100%)`,
              }}
            />

            {/* ── Face — eyes + smile sit on top of all map/shading layers ── */}
            <div
              className="absolute left-0 right-0 flex items-center justify-center gap-[14%]"
              style={{ top: "30%" }}
            >
              <EyeSocket eyeMotion={leftEye} />
              <EyeSocket eyeMotion={rightEye} />
            </div>

            <svg
              viewBox="0 0 200 100"
              className="absolute left-0 right-0 w-full pointer-events-none"
              style={{ top: "58%", height: "20%" }}
            >
              <path
                d="M76,30 Q100,52 124,30"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
                opacity={0.6}
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Eye socket sub-component ──────────────────────────────────────────────

function EyeSocket({
  eyeMotion,
}: {
  eyeMotion: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> };
}) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center shrink-0"
      style={{
        width: "clamp(46px, 11vw, 84px)",
        height: "clamp(46px, 11vw, 84px)",
        background: "#FFFFFF",
        boxShadow: "0 3px 8px rgba(28,37,65,0.16), inset 0 -4px 7px rgba(28,37,65,0.06)",
      }}
    >
      {/* Tracking pupil — only this element moves */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "44%",
          height: "44%",
          background: INK,
          x: eyeMotion.x,
          y: eyeMotion.y,
        }}
      />
      {/* Glossy specular highlight — fixed position regardless of pupil */}
      <div
        className="absolute rounded-full bg-white"
        style={{ width: "15%", height: "15%", top: "20%", left: "27%", opacity: 0.9 }}
      />
    </div>
  );
}

// ─── Eye-tracking hook ──────────────────────────────────────────────────────
// Pupils move toward cursor direction, clamped to a small radius so they
// never leave the white of the eye, with a fast/light spring so they feel
// instantly responsive.

function useEyeTracking(
  pointerX: ReturnType<typeof useMotionValue<number>>,
  pointerY: ReturnType<typeof useMotionValue<number>>,
  faceCenter: React.RefObject<{ x: number; y: number }>
) {
  const travel = 11; // px radius the pupil can roam from eye center

  const rawX = useTransform(pointerX, (px) => {
    const dx = px - faceCenter.current.x;
    const dist = Math.hypot(dx, pointerY.get() - faceCenter.current.y) || 1;
    const norm = dx / dist;
    return clamp(norm * travel, -travel, travel);
  });
  const rawY = useTransform(pointerY, (py) => {
    const dy = py - faceCenter.current.y;
    const dist = Math.hypot(pointerX.get() - faceCenter.current.x, dy) || 1;
    const norm = dy / dist;
    return clamp(norm * travel, -travel, travel);
  });

  const x = useSpring(rawX, { stiffness: 320, damping: 20, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 320, damping: 20, mass: 0.3 });

  return { x, y };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * ── Swapping in a custom continent asset ──────────────────────────────────
 *
 * If you have a real continent silhouette (e.g. exported from Illustrator,
 * or a simplified GeoJSON-to-SVG-path conversion), replace the contents of
 * the `<svg viewBox="0 0 200 200">` block above:
 *
 *   1. Keep viewBox="0 0 200 200" and preserveAspectRatio="xMidYMid slice"
 *      on the wrapping <svg> so it keeps filling the dome edge-to-edge.
 *   2. Paste your <path> elements in place of the illustrative ones,
 *      fill={SAGE} — flat fill only, no gradient, to keep the smooth look.
 *   3. Keep the ocean <div style={{ background: SAGE_BLUE }} /> beneath it
 *      as Layer 0 — your path only needs to draw the land, not the water.
 *
 * This keeps the lighting/eyes/smile/animation layers untouched and only
 * changes what the map itself looks like.
 *
 * ── What changed from the floating full-sphere version ────────────────────
 * - Shape: back to a flat-bottomed dome (borderRadius: "999px 999px 0 0"
 *   on an aspect-[2/1.15] box) instead of a full rounded-full circle — this
 *   matches the reference image's "resting on a surface" silhouette.
 * - Color: continents are a single flat SAGE fill (no inner gradient), and
 *   the ocean is a flat SAGE_BLUE — all the roundness/depth now comes
 *   entirely from the lighting/shadow overlay layers, not from texture or
 *   gradients baked into the land shapes themselves. This is what makes it
 *   read as smooth rather than illustrated.
 * - Halo: removed. There is no ring element above the dome at all anymore.
 * - Ground contact shadow restored: since this sits on a surface again, the
 *   blurred shadow puddle beneath it is back, replacing the floating
 *   sphere's self-contained underside shadow.
 */