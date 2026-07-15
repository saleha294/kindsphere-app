"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { Sparkle, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface KindSphereSplashProps {
  onEnter?: () => void;
}

interface ParticleConfig {
  id: number;
  radius: number;
  angle: number;
  size: number;
  duration: number;
  delay: number;
}

interface BlurredBlobProps {
  className: string;
  delaySeconds: number;
}

interface PillBadgeProps {
  label: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const PRIMARY_PURPLE = "#7C5CFC";
const SECONDARY_LAVENDER = "#C9B6FF";
const SOFT_GLOW = "rgba(124,92,252,0.18)";
const PARTICLE_COUNT = 9;
const FEATURE_PILLS: readonly string[] = ["Anonymous", "Meaningful", "Safe"];

/* -------------------------------------------------------------------------- */
/*  Animation Variants                                                        */
/* -------------------------------------------------------------------------- */

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
};

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay: 0.3 } },
};

const pillsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } },
};

const pillItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.7 } },
};

const captionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.88 } },
};

/* -------------------------------------------------------------------------- */
/*  Background Blob                                                           */
/* -------------------------------------------------------------------------- */

const BlurredBlob: React.FC<BlurredBlobProps> = ({ className, delaySeconds }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: SECONDARY_LAVENDER }}
      initial={{ opacity: 0.04, scale: 1 }}
      animate={reduced ? { opacity: 0.04 } : { opacity: [0.04, 0.07, 0.04], scale: [1, 1.1, 1] }}
      transition={{ duration: 9, delay: delaySeconds, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  Ambient Background                                                        */
/* -------------------------------------------------------------------------- */

const AmbientBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: `radial-gradient(ellipse at center, ${SOFT_GLOW} 0%, rgba(249,246,241,0) 60%)` }}
    />
    <BlurredBlob className="-top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96" delaySeconds={0} />
    <BlurredBlob className="bottom-0 right-0 h-80 w-80 sm:h-[26rem] sm:w-[26rem]" delaySeconds={3} />
    <BlurredBlob className="top-1/3 right-1/4 h-48 w-48 sm:h-64 sm:w-64" delaySeconds={5.5} />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Glowing Sphere                                                            */
/* -------------------------------------------------------------------------- */

const GlowingSphere: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const reduced = useReducedMotion();

  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      radius: (compact ? 70 : 130) + (i % 3) * (compact ? 12 : 22),
      angle: (360 / PARTICLE_COUNT) * i,
      size: compact ? 3 + (i % 3) : 4 + (i % 3) * 2,
      duration: 18 + i * 2.5,
      delay: i * 0.3,
    }));
  }, [compact]);

  const size = compact ? "min(180px, 42vw)" : "min(400px, 75vw)";

  return (
    /* Outer wrapper drifts gently upward */
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label="A glowing sphere representing KindSphere"
      animate={reduced ? undefined : { y: [0, -14, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Ambient outer glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${SOFT_GLOW} 0%, rgba(249,246,241,0) 70%)` }}
      />

      {/* Breathing sphere core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "62%", height: "62%",
          background: `radial-gradient(circle at 35% 30%, ${SECONDARY_LAVENDER} 0%, ${PRIMARY_PURPLE} 55%, rgba(124,92,252,0.35) 100%)`,
          boxShadow: `0 0 ${compact ? 50 : 90}px 10px ${SOFT_GLOW}`,
        }}
        animate={reduced ? undefined : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Highlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at 40% 25%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 45%)" }}
        />
      </motion.div>

      {/* Orbiting ring */}
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: p.size, height: p.size,
              backgroundColor: "#FFFFFF",
              boxShadow: `0 0 6px 2px ${SOFT_GLOW}`,
              transform: `rotate(${p.angle}deg) translateX(${p.radius}px)`,
            }}
            animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: p.duration / 6, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Feature Pill                                                              */
/* -------------------------------------------------------------------------- */

const PillBadge: React.FC<PillBadgeProps> = ({ label }) => (
  <motion.span
    variants={pillItemVariants}
    className="rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide"
    style={{
      borderColor: "rgba(124,92,252,0.28)",
      backgroundColor: "rgba(124,92,252,0.07)",
      color: "#1E1B2E",
    }}
  >
    {label}
  </motion.span>
);

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

const EXIT_ANIMATION_DURATION_MS = 550;

const KindSphereSplash: React.FC<KindSphereSplashProps> = ({ onEnter }) => {
  const [active, setActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (document.documentElement.classList.contains("ks-splash")) {
      setActive(true);
    }
  }, []);

  const handleEnterPress = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    // Remove the class immediately — un-hides <main> so the hero is ready
    document.documentElement.classList.remove("ks-splash");
    // Snap to top before the page fades in so user always lands on the hero
    window.scrollTo({ top: 0 });

    try { sessionStorage.setItem("ks-splash-seen", "1"); } catch (_) { }

    window.setTimeout(() => {
      setActive(false);
      onEnter?.();
    }, EXIT_ANIMATION_DURATION_MS);
  }, [isExiting, onEnter]);

  if (!active) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="ks-splash-overlay"
          key="kindsphere-splash"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          /*
           * Use 100dvh so the splash is always exactly the viewport height —
           * no scrollbar, no overflow — on both mobile and desktop.
           */
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ backgroundColor: "#F9F6F1", color: "#1E1B2E", height: "100dvh" }}
        >
          <AmbientBackground />

          {/* ── DESKTOP (lg+): side-by-side ───────────────────────────── */}
          <div className="hidden lg:flex h-full w-full items-center justify-center px-10">
            <div className="relative z-10 mx-auto flex w-full max-w-[1200px] items-center justify-between gap-12">

              {/* Left — sphere */}
              <div className="flex w-1/2 justify-center">
                <GlowingSphere />
              </div>

              {/* Right — content */}
              <div className="flex w-1/2 flex-col items-start text-left">
                {/* Logo mark */}
                <motion.div
                  className="mb-8 flex items-center gap-2.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Sparkle className="h-5 w-5" style={{ color: PRIMARY_PURPLE }} strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-xs font-serif semibold uppercase tracking-[0.22em]" style={{ color: "#6B6477" }}>
                    KindSphere
                  </span>
                </motion.div>

                <motion.h1
                  variants={headingVariants} initial="hidden" animate="visible"
                  className="text-6xl xl:text-7xl font-serif semibold tracking-tight leading-[1.05]"
                  style={{ color: "#1E1B2E" }}
                >
                  Kind<span className="font-serif italic text-violet-600">Sphere</span>
                </motion.h1>

                <motion.p
                  variants={taglineVariants} initial="hidden" animate="visible"
                  className="mt-5 max-w-md text-xl leading-relaxed"
                  style={{ color: "#6B6477" }}
                >
                  Where kindness finds its way home.
                </motion.p>

                <motion.div
                  variants={pillsContainerVariants} initial="hidden" animate="visible"
                  className="mt-8 flex flex-wrap items-center gap-2.5"
                >
                  {FEATURE_PILLS.map((label) => <PillBadge key={label} label={label} />)}
                </motion.div>

                <motion.div variants={buttonVariants} initial="hidden" animate="visible" className="mt-10">
                  <motion.button
                    type="button"
                    onClick={handleEnterPress}
                    whileHover={reduced ? undefined : { y: -2, boxShadow: "0 16px 40px rgba(124,92,252,0.38)" }}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                    className="group inline-flex items-center gap-2 rounded-full px-9 py-4 text-base font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      background: `linear-gradient(135deg, ${PRIMARY_PURPLE} 0%, ${SECONDARY_LAVENDER} 100%)`,
                      boxShadow: `0 8px 28px ${SOFT_GLOW}`,
                    }}
                  >
                    <span>Enter the Sphere</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
                  </motion.button>
                </motion.div>

                <motion.p
                  variants={captionVariants} initial="hidden" animate="visible"
                  className="mt-5 text-sm" style={{ color: "#6B6477" }}
                >
                  Made for thoughtful conversations.
                </motion.p>
              </div>
            </div>
          </div>

          {/* ── MOBILE / TABLET (<lg): stacked, fits one screen ───────── */}
          <div className="flex lg:hidden h-full w-full flex-col items-center justify-center gap-6 px-7 py-8">
            <div className="relative z-10 flex w-full flex-col items-center text-center">

              {/* Compact sphere */}
              <GlowingSphere compact />

              {/* Logo mark */}
              <motion.div
                className="mt-5 flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Sparkle className="h-4 w-4" style={{ color: PRIMARY_PURPLE }} strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[11px] font-serif semibold uppercase tracking-[0.22em]" style={{ color: "#6B6477" }}>
                  KindSphere
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={headingVariants} initial="hidden" animate="visible"
                className="mt-4 text-[2.4rem] font-serif semibold tracking-tight leading-tight"
                style={{ color: "#1E1B2E" }}
              >
                KindSphere
              </motion.h1>

              {/* Tagline */}
              <motion.p
                variants={taglineVariants} initial="hidden" animate="visible"
                className="mt-3 max-w-[16rem] text-base leading-relaxed"
                style={{ color: "#6B6477" }}
              >
                Where kindness finds its way home.
              </motion.p>

              {/* Pills */}
              <motion.div
                variants={pillsContainerVariants} initial="hidden" animate="visible"
                className="mt-5 flex flex-wrap items-center justify-center gap-2"
              >
                {FEATURE_PILLS.map((label) => <PillBadge key={label} label={label} />)}
              </motion.div>

              {/* CTA */}
              <motion.div variants={buttonVariants} initial="hidden" animate="visible" className="mt-7 w-full">
                <motion.button
                  type="button"
                  onClick={handleEnterPress}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    background: `linear-gradient(135deg, ${PRIMARY_PURPLE} 0%, ${SECONDARY_LAVENDER} 100%)`,
                    boxShadow: `0 8px 28px ${SOFT_GLOW}`,
                  }}
                >
                  <span>Enter the Sphere</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
                </motion.button>
              </motion.div>

              {/* Caption */}
              <motion.p
                variants={captionVariants} initial="hidden" animate="visible"
                className="mt-4 text-xs" style={{ color: "#6B6477" }}
              >
                Made for thoughtful conversations.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KindSphereSplash;
