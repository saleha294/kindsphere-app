// app/drop/page.tsx
"use client";

import { useState } from "react";
import { Shield, Upload } from "lucide-react";

const CATEGORIES = ["Career", "Relationships", "Creative", "Health", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

export default function DropPage() {
  const [category, setCategory]       = useState<Category>("Career");
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
  }

  if (submitted) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-foreground">Bottle Dropped</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your message is floating into the world, completely anonymized. You will be notified when someone responds.
          </p>
          <button
            onClick={() => { setSubmitted(false); setCategory("Career"); }}
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 text-foreground text-sm font-semibold px-6 py-3 hover:bg-stone-50 active:scale-95 transition-all"
          >
            Drop another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-12 px-6 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto md:px-12">
        <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 md:p-10 border border-stone-200/60 shadow-[0_12px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
          <div aria-hidden className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-60" style={{ background: "hsl(14 66% 62% / 0.1)" }} />

          <div className="mb-8 relative z-10">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-3 tracking-tight">Drop Your Bottle</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">Your identity is completely hidden. What would you like honest feedback on?</p>
          </div>

          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex gap-3 items-start mb-8">
            <Shield className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm font-medium text-foreground">Your submission is end-to-end anonymized. No IP address, device ID, or identity markers are ever stored.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-foreground">Select a Topic</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} aria-pressed={category === cat}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${category === cat ? "bg-foreground text-white shadow-sm" : "bg-stone-100 text-muted-foreground hover:bg-stone-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label htmlFor="request-body" className="text-sm font-semibold text-foreground flex justify-between items-center">
                <span>Your Request</span>
                <span className="text-muted-foreground font-normal text-xs">Markdown supported</span>
              </label>
              <textarea id="request-body" name="request-body" required minLength={20}
                placeholder="Describe your situation or question. Be as detailed as you need — only the content is sent, never your identity."
                className="w-full min-h-[160px] rounded-xl border border-stone-200 bg-white px-4 py-3 text-base placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow resize-y" />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground block">Attachments</span>
              <label htmlFor="file-upload" className="w-full border-2 border-dashed border-stone-200 hover:border-primary/40 bg-stone-50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
                  <Upload className="h-5 w-5" aria-hidden />
                </div>
                <span className="font-medium text-foreground text-sm">Attach a file (optional)</span>
                <span className="text-xs text-muted-foreground text-center max-w-xs">PDF, image, or document. Anonymized on upload. Max&nbsp;10&nbsp;MB.</span>
                <input id="file-upload" type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx" />
              </label>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-white text-base font-semibold px-6 py-3 min-h-[48px] hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all">
              {isSubmitting ? "Dropping\u2026" : "Drop This Bottle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}