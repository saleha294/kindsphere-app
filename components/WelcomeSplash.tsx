"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeSplash() {
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("ks-splash")) {
      setActive(true);
    }
  }, []);

  function dismiss() {
    if (exiting) return;
    setExiting(true);
    document.documentElement.classList.remove("ks-splash");
    try { sessionStorage.setItem("ks_welcomed", "1"); } catch (_) { }
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
          className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden"
        >
          {/* ── DESKTOP (md+) ──────────────────────────────────────────── */}
          <div className="hidden md:block w-full h-full relative">
            <img src="/assets/imagery/laptopwelcome.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "25%",
                bottom: 0,
                width: "34%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "-80px",
                alignItems: "flex-start",
                padding: 10,
              }}
            >
              {/* FIXED: Removed conflicting tailwind text size overrides to prevent the shrinking loop */}
              {/* Wordmark (Text Only, Left Aligned) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <h2 className="font-serif text-5xl font-medium tracking-tight" style={{ color: "#1C1240" }}>
                  KindSphere
                </h2>
              </motion.div>
              {/* Tagline cleanly adjusted 4 visual values lower than header sizing */}
              <motion.h1
                className="font-serif leading-[1.1] tracking-tight"
                style={{ fontSize: "1.95rem", color: "#1C1240", marginBottom: "1.5rem" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                A kinder world<br />
                <span style={{ color: "#7C3AED" }}>starts with you.</span>
              </motion.h1>

              <motion.p
                style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", marginBottom: "2rem", maxWidth: "22rem" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
              >
                KindSphere is a safe, anonymous space to share kindness, find connection, and make someone's day a little brighter.
              </motion.p>

              <motion.button
                onClick={dismiss}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white rounded-full px-8 py-4"
                style={{ background: "linear-gradient(135deg,#8B5CF6 0%,#6366F1 60%,#818CF8 100%)" }}
              >
                Enter KindSphere →
              </motion.button>
            </div>
          </div>

          {/* ── MOBILE (<md) ───────────────────────────────────────────── */}
          <div className="md:hidden w-full h-full relative">
            <img src="/assets/imagery/phonewelcome.png" alt="" className="absolute inset-0 w-full h-full object-cover object-[25%_50%]" />
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0 2rem",
                gap: "1.5rem",
              }}
            >
              {/* FIXED: Removed broken text class overrides to allow explicit mobile formatting scale */}

              {/* Wordmark (Text Only, Left Aligned) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <h2 className="font-serif text-5xl font-medium tracking-tight" style={{ color: "#1C1240" }}>
                  KindSphere
                </h2>
              </motion.div>
              <motion.h1
                className="font-serif leading-[1.1] tracking-tight"
                style={{ fontSize: "1.65rem", color: "#1C1240" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
              >
                A kinder world<br />
                <span style={{ color: "#7C3AED" }}>starts with you.</span>
              </motion.h1>

              <motion.p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", maxWidth: "17rem" }}>
                KindSphere is a safe, anonymous space to share kindness, find connection, and make someone's day a little brighter.
              </motion.p>

              <motion.button
                onClick={dismiss}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full px-8 py-4"
                style={{
                  background: "linear-gradient(135deg,#8B5CF6 0%,#6366F1 60%,#818CF8 100%)",
                  boxShadow: "0 8px 28px rgba(139,92,246,0.4)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Enter KindSphere →
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
