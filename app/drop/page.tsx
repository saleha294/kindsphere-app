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
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");

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
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12" style={{ background: 'radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)' }}>
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-4xl font-medium text-foreground">Bottle Dropped</h2>
          <button
            type="button" // Use 'button' since you are triggering a modal, not a native form submit
            disabled={isSubmitting}
            onClick={() => setShowPrivatePrompt(true)}
            className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)"
            }}
          >
            {isSubmitting ? "Dropping..." : "Drop This Bottle"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] pt-28 md:pt-32 pb-20">
      {/* Primary alignment container matching navbar values */}
      <div className="max-w-6xl mx-auto px-6 md:px-8">

        {/* Inner reading-width container */}
        <div className="max-w-2xl space-y-16">
          <div className="mb-8">
            <p className="text-sm font-medium text-stone-500">
              {greeting},
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1C2541] leading-tight">
              Hey, <span className="text-[#7C3AED] italic">{userHandle}</span> 👋
            </h2>
          </div>
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl text-stone-900"><span className="text-[#7C3AED] italic">Drop</span> a Bottle</h1>
            <p className="text-stone-600">Share your thoughts anonymously with the KindSphere community. Encourage someone, share a moment of your life, or just send a message out into the world.</p>
          </div>

          {/* Your Story Section */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl text-stone-900 border-b border-stone-200 pb-2">Your Bottle</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${category === cat
                        ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                        : "bg-white border-stone-200 text-stone-600 hover:border-violet-300"
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
                className="w-full min-h-[200px] rounded-[24px] border border-[#E9DDFD] bg-[#F8F5FF] p-6 text-stone-600 placeholder:text-stone-400 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                placeholder="What do you want to send into the world today? A thought, a feeling, a small kindness..."
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#7C3AED] text-white rounded-full text-sm font-semibold hover:bg-[#6D28D9] transition-all"
              >
                {isSubmitting ? "Dropping..." : "Drop This Bottle"}
              </button>
            </form>
          </section>

          {/* Section 2: What happens next */}
          <section className="space-y-8 pt-8 border-t border-stone-200">
            <h2 className="font-serif text-2xl text-stone-900">What happens next?</h2>
            <div className="grid gap-8">
              <div className="flex items-start gap-4">
                <div className="text-[#7C3AED] mt-1"><Shield size={24} /></div>
                <div>
                  <h4 className="font-medium text-stone-900 text-lg">Your identity stays hidden</h4>
                  <p className="text-stone-500 mt-1">We take anonymity seriously. Your name, email, and location are never attached to your bottle. It’s just you and your thoughts, floating freely in the sphere.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#7C3AED] mt-1"><RepliesIcon className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-medium text-stone-900 text-lg">Thoughtful, kind replies</h4>
                  <p className="text-stone-500 mt-1">Once your bottle is live, community members can respond with empathy and advice. You’ll be notified whenever someone takes a moment to offer you kindness.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#7C3AED] mt-1"><SpreadPositivityIcon className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-medium text-stone-900 text-lg">A growing impact</h4>
                  <p className="text-stone-500 mt-1">Every bottle you drop helps build a more supportive, understanding world. Your vulnerability often becomes the exact comfort someone else needs to hear today.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal remains fixed */}
      {showPrivatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-6">
            <h2 className="font-serif text-2xl text-[#1C2541] mb-4">One more thing...</h2>
            <p className="text-stone-600 mb-6">Your bottle will always appear in the public feed.</p>
            <p className="text-stone-600 mb-8">Would you also like to anonymously send it to one random person?</p>
            <div className="space-y-3">
              <button className="w-full border rounded-xl py-3" onClick={() => handlePrivateChoice(false)}>No, public feed only</button>
              <button className="w-full bg-[#7C3AED] text-white rounded-xl py-3" onClick={() => handlePrivateChoice(true)}>Yes, send privately too</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
