"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { castBottle } from "@/lib/db-queries";
import { createClient } from '@/lib/utils/supabase/client';
const supabase = createClient();

const CATEGORIES = ["Career", "Relationships", "Creative", "Health", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

export default function DropPage() {
  const [category, setCategory] = useState<Category>("Career");
  const [content, setContent] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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

        await castBottle(content, category);

        console.log("STEP 6");

        alert("Bottle sent!");

    } catch (err: any) {

        console.log("STEP ERROR", err);

        alert(err.message);

    } finally {

        console.log("STEP 7");

        setSubmitting(false);
    }
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
            onClick={() => { setSubmitted(false); setContent(""); setCategory("Career"); }}
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
      <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl flex flex-col md:flex-row bg-white">
        <div className="w-full h-44 md:h-auto md:w-[42%] shrink-0 relative bg-stone-200">
          {/* Replace this with your image if available */}
        </div>

        <div className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="font-serif text-xl font-medium">Drop your thoughts...</h1>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-xs py-2 rounded-lg border ${category === cat ? "bg-[#E07A5F] text-white border-[#E07A5F]" : "bg-white border-stone-200 text-stone-600"
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
              className="w-full bg-[#E07A5F] text-white py-3 rounded-xl text-sm font-semibold"
            >
              {isSubmitting ? "Dropping..." : "Drop This Bottle"}
            </button>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}