"use client";

import { useState } from "react";
import { Shield, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Career", "Relationships", "Creative", "Health", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

export default function DropPage() {
  const [category, setCategory] = useState<Category>("Career");
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 3500);
  }

  /* ── Submitted confirmation screen ── */
  if (submitted) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-[#FAF9F6]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-foreground">Bottle Dropped</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your message is floating into the world, completely anonymized.
          </p>
          <button
            onClick={() => { setSubmitted(false); setCategory("Career"); }}
            className="px-6 py-3 border border-stone-300 rounded-lg text-sm font-semibold hover:bg-stone-50"
          >
            Drop another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#FAF9F6] flex items-center justify-center px-4 py-6">

      {/* ── Immersive submission animation ── */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
          >
            <motion.div
              animate={{ y: [0, -25, 0], rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <img
                src="/assets/imagery/bottle.png"
                className="w-40 h-40 object-contain drop-shadow-2xl"
                alt="Floating bottle"
              />
            </motion.div>
            <motion.p className="mt-8 font-serif text-xl text-stone-700 animate-pulse text-center max-w-sm px-6">
              Please wait.. Choosing the anonymous lucky person and dropping your bottle to sail..
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card ── */}
      <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl flex flex-col md:flex-row">

        {/* ── Image panel — top on mobile, left on desktop ── */}
        <div className="w-full h-44 md:h-auto md:w-[42%] shrink-0 relative">
          <img
            src="/assets/imagery/dropbg.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 md:bg-gradient-to-r md:from-transparent md:to-black/10" />
        </div>

        {/* ── Form panel ── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-5 py-6 md:px-8 md:py-8">

          {/* Heading */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 mb-1">
              Anonymous Message
            </p>
            <h1 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-snug">
              Drop your thoughts like a message in a bottle. What&apos;s weighing on you today?
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Topic selector */}
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">Select a Topic</legend>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      category === cat
                        ? "bg-[#1C2541] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Message textarea */}
            <div className="space-y-1">
              <textarea
                required
                minLength={20}
                className="w-full min-h-[110px] rounded-xl border border-stone-200 p-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/30 focus:border-[#E07A5F]/50 resize-none transition"
                placeholder="Describe your situation..."
              />
              <p className="text-[11px] text-stone-400 pl-0.5">
                You can write freely — even messy thoughts are okay.
              </p>
            </div>

            {/* File attachment */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-foreground block">Attachments</span>
              <label
                htmlFor="file-upload"
                className="w-full border-2 border-dashed border-stone-200 bg-stone-50 rounded-xl p-3.5 flex flex-col items-center cursor-pointer hover:border-[#E07A5F]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
                  <Upload className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-xs mt-1.5 text-stone-500 text-center">
                  Add anything that helps explain (image, screenshot, note)
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E07A5F] text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Dropping..." : "Drop This Bottle"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
