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
    // Animation duration set to 3.5s
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 3500);
  }

  if (submitted) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-foreground">Bottle Dropped</h2>
          <p className="text-muted-foreground leading-relaxed">Your message is floating into the world, completely anonymized.</p>
          <button onClick={() => { setSubmitted(false); setCategory("Career"); }} className="px-6 py-3 border border-stone-300 rounded-lg text-sm font-semibold hover:bg-stone-50">
            Drop another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-6 relative">
      {/* --- IMMERSIVE ANIMATION LAYER --- */}
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
              <img src="/assets/bottle.png" className="w-40 h-40 object-contain drop-shadow-2xl" alt="Floating bottle" />
            </motion.div>
            <motion.p className="mt-8 font-serif text-xl text-stone-700 animate-pulse">
              Please wait.. Choosing the anonymous lucky person and dropping your bottle to sail..
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FORM CONTENT (RESTORED) --- */}
      <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-10 border border-stone-200/60 shadow-xl">
        <h1 className="font-serif text-4xl font-medium text-foreground mb-6">Drop Your Bottle</h1>
        <form onSubmit={handleSubmit} className="space-y-7">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">Select a Topic</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-foreground text-white" : "bg-stone-100"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </fieldset>

          <textarea required minLength={20} className="w-full min-h-[160px] rounded-xl border border-stone-200 p-4" placeholder="Describe your situation..." />

          {/* --- RESTORED UPLOAD FUNCTIONALITY --- */}
          <div className="space-y-2">
            <span className="text-sm font-semibold text-foreground block">Attachments</span>
            <label htmlFor="file-upload" className="w-full border-2 border-dashed border-stone-200 bg-stone-50 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-primary/40">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
                <Upload className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm mt-2">Attach a file (optional)</span>
              <input id="file-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx" />
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#E07A5F] text-white py-4 rounded-xl font-semibold hover:opacity-90">
            {isSubmitting ? "Dropping..." : "Drop This Bottle"}
          </button>
        </form>
      </div>
    </div>
  );
}