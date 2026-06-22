"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ─── Brand palette ────────────────────────────────────────────────────────────
const SAGE           = "#81B29A";
const SAGE_DEEP      = "#5E9379";
const SAGE_BLUE      = "#A8D5E2";
const SAGE_BLUE_DEEP = "#7FB8CC";
const TERRACOTTA     = "#E07A5F";
const INK            = "#1C2541";

// ─── Googly-eye globe ─────────────────────────────────────────────────────────
function EarthGlobe() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const faceRef  = useRef<HTMLDivElement>(null);
  const center   = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    }
    function updateCenter() {
      const el = faceRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      center.current = { x: r.left + r.width / 2, y: r.top + r.height * 0.42 };
    }
    updateCenter();
    pointerX.set(window.innerWidth / 2);
    pointerY.set(window.innerHeight / 2);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", updateCenter);
    const tid = setInterval(updateCenter, 200);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", updateCenter);
      clearInterval(tid);
    };
  }, [pointerX, pointerY]);

  const travel = 9;
  function useEye() {
    const rawX = useTransform(pointerX, (px) => {
      const dx   = px - center.current.x;
      const dist = Math.hypot(dx, pointerY.get() - center.current.y) || 1;
      return Math.min(Math.max((dx / dist) * travel, -travel), travel);
    });
    const rawY = useTransform(pointerY, (py) => {
      const dy   = py - center.current.y;
      const dist = Math.hypot(pointerX.get() - center.current.x, dy) || 1;
      return Math.min(Math.max((dy / dist) * travel, -travel), travel);
    });
    return {
      x: useSpring(rawX, { stiffness: 340, damping: 22, mass: 0.28 }),
      y: useSpring(rawY, { stiffness: 340, damping: 22, mass: 0.28 }),
    };
  }

  const leftEye  = useEye();
  const rightEye = useEye();

  return (
    <motion.div
      ref={faceRef}
      className="relative select-none"
      style={{ width: 160, height: 160 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Ground shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: "70%", height: "10%",
          background: "radial-gradient(ellipse, rgba(28,37,65,0.11) 0%, transparent 75%)",
          filter: "blur(4px)",
        }}
      />

      {/* Sphere */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ boxShadow: "0 16px 40px rgba(28,37,65,0.13), inset 0 -6px 14px rgba(28,37,65,0.06)" }}
      >
        <div className="absolute inset-0" style={{ background: SAGE_BLUE }} />

        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
          <path d="M18,38 C10,52 14,70 28,78 C24,92 34,104 50,102 C58,116 80,118 92,104 C108,108 122,96 118,80 C132,74 134,56 120,46 C124,30 110,16 92,20 C80,6 56,6 46,20 C30,14 16,24 18,38 Z" fill={SAGE} />
          <path d="M128,118 C120,128 124,144 138,148 C138,162 154,170 166,160 C180,162 190,150 184,138 C192,128 186,114 172,114 C166,102 148,102 142,112 C134,108 124,110 128,118 Z" fill={SAGE} />
          <circle cx="158" cy="60" r="6"   fill={SAGE} />
          <circle cx="170" cy="74" r="3.5" fill={SAGE} />
          <circle cx="44"  cy="130" r="5"  fill={SAGE} />
        </svg>

        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 18%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 24%, transparent 48%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 130%, rgba(28,37,65,0.28) 0%, transparent 52%)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, transparent 55%, ${SAGE_BLUE_DEEP}33 78%, ${SAGE_DEEP}22 100%)` }} />

        {/* Eyes */}
        <div className="absolute left-0 right-0 flex items-center justify-center gap-[14%]" style={{ top: "28%" }}>
          {([leftEye, rightEye] as const).map((eye, i) => (
            <div
              key={i}
              className="relative rounded-full flex items-center justify-center"
              style={{ width: 34, height: 34, background: "#fff", boxShadow: "0 2px 6px rgba(28,37,65,0.14), inset 0 -3px 5px rgba(28,37,65,0.05)" }}
            >
              <motion.div className="absolute rounded-full" style={{ width: "42%", height: "42%", background: INK, x: eye.x, y: eye.y }} />
              <div className="absolute rounded-full bg-white" style={{ width: "14%", height: "14%", top: "20%", left: "26%", opacity: 0.9 }} />
            </div>
          ))}
        </div>

        {/* Smile */}
        <svg viewBox="0 0 200 100" className="absolute left-0 right-0 w-full pointer-events-none" style={{ top: "56%", height: "18%" }}>
          <path d="M76,30 Q100,54 124,30" stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none" opacity={0.55} />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Splash overlay ───────────────────────────────────────────────────────────
export default function WelcomeSplash() {
  // `active` reflects whether the `ks-splash` class is on <html>.
  // The inline blocking script in <head> already set it before this component
  // mounts, so we simply read it — no guessing, no flash.
  const [active,  setActive]  = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // If the blocking script added the class, we should show the splash
    if (document.documentElement.classList.contains("ks-splash")) {
      setActive(true);
    }
  }, []);

  function dismiss() {
    if (exiting) return;
    setExiting(true);
    // Remove the class so page content becomes visible again
    document.documentElement.classList.remove("ks-splash");
    // Set session flag so subsequent navigations skip the splash
    try { sessionStorage.setItem("ks_welcomed", "1"); } catch (_) {}
    // Unmount after exit animation completes
    setTimeout(() => setActive(false), 520);
  }

  if (!active) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          id="ks-splash-overlay"
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#FAF9F6" }}
        >
          {/* Ambient colour blobs */}
          <div className="absolute pointer-events-none" style={{ top: "-10%", left: "-8%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle, ${SAGE_BLUE}55 0%, transparent 70%)`, filter: "blur(40px)" }} />
          <div className="absolute pointer-events-none" style={{ bottom: "-8%", right: "-6%", width: "36vw", height: "36vw", borderRadius: "50%", background: `radial-gradient(circle, ${TERRACOTTA}30 0%, transparent 70%)`, filter: "blur(40px)" }} />

          {/* Content card */}
          <motion.div
            className="relative flex flex-col items-center gap-6 px-8 text-center"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <EarthGlobe />

            <div className="space-y-2 max-w-xs">
              <h1
                className="font-serif text-2xl md:text-3xl tracking-tight flex items-center justify-center gap-2.5"
                style={{ color: INK }}
              >
                <motion.span
                  aria-hidden="true"
                  style={{ display: "inline-block", transformOrigin: "70% 80%" }}
                  animate={{ rotate: [0, 20, -8, 20, -4, 0] }}
                  transition={{ delay: 0.65, duration: 1.4, ease: "easeInOut" }}
                >
                  👋
                </motion.span>
                Hello, kind soul.
              </h1>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#78716c" }}>
                Welcome to KindSphere — a quiet, anonymous space built for honest human connection.
              </p>
            </div>

            <motion.button
              onClick={dismiss}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer"
              style={{ background: TERRACOTTA }}
            >
              Enter the Sphere →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
