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
          className="fixed inset-0 z-[9999] overflow-hidden"
        >

          {/* ── DESKTOP (md+) ────────────────────────────────────────────
              laptopwelcome.png fills the screen exactly as-is.
              No overlays. No filters. No gradients.
              Text block positioned on the RIGHT via absolute CSS.        */}
          <div className="hidden md:block w-full h-full relative">

            <img
              src="/assets/imagery/laptopwelcome.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Content — left of center, pure CSS, no backing box */}
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
                marginTop: "-140px", // Add this line to shift it up
                alignItems: "flex-start",
                textAlign: "left",
                padding: 10,
                gap: "0",
              }}
            >
              {/* Wordmark */}
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src="/favicon.ico" alt="" aria-hidden="true" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                <span className="font-serif text-xl tracking-tight" style={{ color: "#1C1240" }}>KindSphere</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-serif leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.8rem)", color: "#1C1240", marginBottom: "1rem" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                A kinder world<br />
                <span style={{ color: "#7C3AED" }}>starts with you.</span>
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", marginBottom: "1rem", maxWidth: "22rem" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                KindSphere is a safe, anonymous space to share kindness, find connection, and make someone's day a little brighter.
              </motion.p>

              {/* Button */}
              <motion.button
                onClick={dismiss}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-white rounded-full cursor-pointer"
                style={{
                  padding: "0.875rem 1.75rem",
                  background: "linear-gradient(135deg,#8B5CF6 0%,#6366F1 60%,#818CF8 100%)",
                  boxShadow: "0 8px 28px rgba(139,92,246,0.4)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                Enter KindSphere
                <span style={{ opacity: 0.8, fontSize: "1rem", lineHeight: 1 }}>→</span>
              </motion.button>
            </div>
          </div>

          {/* ── MOBILE (<md) ─────────────────────────────────────────────
              phonewelcome.png fills the screen exactly as-is.
              No overlays. No filters. No gradients.
              Text block centered horizontally, anchored at top:18% so it
              sits clearly above the bottle graphic at the bottom.           */}
          <div className="md:hidden w-full h-full relative">

            <img
              src="/assets/imagery/phonewelcome.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Content — centered, positioned in upper area */}
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                padding: "0 2rem",
                gap: "1.1rem",
              }}
            >
              {/* Wordmark */}
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src="/favicon.ico" alt="" aria-hidden="true" style={{ width: 24, height: 24, borderRadius: "50%" }} />
                <span className="font-serif text-base tracking-tight" style={{ color: "#1C1240" }}>KindSphere</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-serif leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 6.5vw, 2.1rem)", color: "#1C1240" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                A kinder world<br />
                <span style={{ color: "#7C3AED" }}>starts with you.</span>
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", maxWidth: "17rem" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                KindSphere is a safe, anonymous space to share kindness, find connection, and make someone's day a little brighter.
              </motion.p>

              {/* Button */}
              <motion.button
                onClick={dismiss}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full cursor-pointer"
                style={{
                  padding: "0.875rem 1.75rem",
                  background: "linear-gradient(135deg,#8B5CF6 0%,#6366F1 60%,#818CF8 100%)",
                  boxShadow: "0 8px 28px rgba(139,92,246,0.4)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Enter KindSphere
                <span style={{ opacity: 0.8, fontSize: "1rem", lineHeight: 1 }}>→</span>
              </motion.button>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
