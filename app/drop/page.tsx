"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@/lib/utils/supabase/client';
const supabase = createClient();

import { ShareAnonymouslyIcon } from "@/components/icons/ShareAnonymouslyIcon";
import RepliesIcon from "@/components/icons/RepliesIcon";
import MutualConnectionsIcon from "@/components/icons/MutualConnectionsIcon";
import { SpreadPositivityIcon } from "@/components/icons/SpreadPositivityIcon";

import {
  castBottle,
  privatelyDeliverBottle,
} from "@/lib/db-queries";


const CATEGORIES = ["Career", "Relationships", "Creative", "Health", "Other"] as const;
type Category = (typeof CATEGORIES)[number]


export default function DropPage() {
  const [category, setCategory] = useState<Category>("Career");
  const [content, setContent] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showPrivatePrompt, setShowPrivatePrompt] = useState(false);
  const [sendPrivately, setSendPrivately] = useState(false);
  const [currentBottleId, setCurrentBottleId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    supabase.auth.getSession().then(({ data }) => {
      console.log("DROP SESSION:", data.session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event);
      console.log("AUTH SESSION:", session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("STEP 1");

    setSubmitting(true);
    setError(null);

    console.log("STEP 2");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("STEP 3", session);

    if (!session) {
      console.log("FAILED HERE");
      alert("No session");
      setSubmitting(false);
      return;
    }

    console.log("STEP 4");

    try {
      console.log("STEP 5");

      const result = await castBottle(content, category);

      const bottle = result[0];

      console.log("STEP 6");
      console.log(bottle);

      // Save which bottle was just created
      setCurrentBottleId(bottle.id);

      // Stop loading
      setSubmitting(false);

      // Open the popup
      setShowPrivatePrompt(true);

      // STOP HERE
      return;

    }

    catch (err: any) {

      console.log("STEP ERROR", err);

      alert(err.message);

    } finally {

      console.log("STEP 7");

      setSubmitting(false);
    }
  }
  async function handlePrivateChoice(choice: boolean) {
    if (choice && currentBottleId) {
      // We'll implement this next
      await privatelyDeliverBottle(currentBottleId);
    }

    setShowPrivatePrompt(false);

    setSubmitted(true);

    setContent("");
    setCategory("Career");
  }
  if (!isClient) return null;

  if (submitted) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-[#FAF9F6]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-foreground">Bottle Dropped</h2>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setShowPrivatePrompt(true)}
            className="w-full text-white py-3 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)" }}
          >
            {isSubmitting ? "Dropping..." : "Bottle Dropped!"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#FAF9F6] flex items-center justify-center px-4 py-6 relative">
      {/* Page-level decorative gradients — far corners, desktop only */}
      <div className="hidden md:block absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/[0.05] blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/[0.05] blur-[120px] pointer-events-none" />


      <div className="w-full max-w-3xl md:max-w-5xl mx-auto rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl flex flex-col md:grid md:grid-cols-[28%_44%_28%] bg-white mt-[8vh] relative">
        {/* Decorative purple gradient circles */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#7C3AED]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#7C3AED]/10 blur-3xl pointer-events-none" />

        {/* LEFT PANEL: Image (mobile full-width, desktop left column) */}
        <div className="relative w-full h-56 md:h-full overflow-hidden">
          <img
            src="/assets/imagery/drop.png"
            alt="Drop Your Bottle"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Desktop-only gradient overlay with inspirational text */}
          <div className="hidden md:flex absolute inset-0 bg-gradient-to-b from-[#7C3AED]/70 via-[#7C3AED]/10 to-transparent items-start p-8">
            <div className="max-w-[260px]">
              <h2 className="font-playfair text-white text-[38px] font-bold leading-[1.05] tracking-[-0.03em]">
                Every bottle
                <br />
                carries a story...
              </h2>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Form */}
        <div className="flex-1 md:flex-none px-5 py-6 md:px-10 md:py-10">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <h1 className="font-serif text-xl md:text-2xl font-medium flex items-center gap-3">
              {/*  <BottleIcon className="w-9 h-9" /> */}
              Drop your thoughts...
            </h1>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-xs py-2 rounded-lg border ${category === cat ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white border-stone-200 text-stone-600"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={20}
              className="w-full min-h-[110px] rounded-xl border border-stone-200 p-3 text-sm"
              placeholder="Describe your situation..."
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)" }}
            >
              {isSubmitting ? "Dropping..." : "Drop This Bottle"}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          </form>
        </div>

        {/* RIGHT PANEL: Reassurance (desktop only) */}
        <div className="hidden md:flex flex-col justify-center px-6 py-8 bg-gradient-to-b from-[#7C3AED]/[0.02] to-white border-l border-stone-100">
          <h3 className="font-serif text-xl text-[#1C2541]">You&apos;re not alone.</h3>
          <p className="text-xs text-stone-400 mt-1 mb-6">Here&apos;s what you can expect:</p>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <ShareAnonymouslyIcon className="w-9 h-9 shrink-0" />
              <div>
                <h4 className="font-medium text-[#1C2541] text-sm">Anonymous &amp; Safe</h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">Your identity is never revealed.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RepliesIcon className="w-9 h-9 shrink-0" />
              <div>
                <h4 className="font-medium text-[#1C2541] text-sm">Kind Replies</h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">Receive thoughtful responses from people around the world.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MutualConnectionsIcon className="w-9 h-9 shrink-0" />
              <div>
                <h4 className="font-medium text-[#1C2541] text-sm">Mutual Connections</h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">Meaningful conversations can grow into lasting anonymous connections.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SpreadPositivityIcon className="w-9 h-9 shrink-0" />
              <div>
                <h4 className="font-medium text-[#1C2541] text-sm">Make an Impact</h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">Your words might become exactly what someone needed today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPrivatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-6">

            <h2 className="font-serif text-2xl text-[#1C2541] mb-4">
              One more thing...
            </h2>

            <p className="text-stone-600 mb-6">
              Your bottle will always appear in the public feed.
            </p>

            <p className="text-stone-600 mb-8">
              Would you also like to anonymously send it to one random person?
            </p>

            <div className="space-y-3">

              <button
                className="w-full border rounded-xl py-3"
                onClick={() => handlePrivateChoice(false)}
              >
                No, public feed only
              </button>

              <button
                className="w-full bg-[#7C3AED] text-white rounded-xl py-3"
                onClick={() => handlePrivateChoice(true)}
              >
                Yes, send privately too
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}