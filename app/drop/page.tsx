"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@/lib/utils/supabase/client';
const supabase = createClient();
import Image from "next/image";
import BottleIcon from "@/components/icons/BottleIcon";

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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#FAF9F6] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl flex flex-col md:flex-row bg-white mt-[8vh]">
        <div className="relative w-full h-56 md:h-auto md:w-[42%] overflow-hidden">
          <Image
            src="/assets/imagery/drop.png"
            alt="Drop Your Bottle"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="font-serif text-xl font-medium flex items-center gap-3">
              <BottleIcon className="w-9 h-9" />
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