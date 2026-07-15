"use client";

import { useState, useEffect } from "react";
import { Shield, Sparkles } from "lucide-react";
import { createClient } from '@/lib/utils/supabase/client';
const supabase = createClient();

import RepliesIcon from "@/components/icons/RepliesIcon";
import { SpreadPositivityIcon } from "@/components/icons/SpreadPositivityIcon";
import Footer from "@/components/Footer";

import {
  castBottle,
  privatelyDeliverBottle,
} from "@/lib/db-queries";


const CATEGORIES = ["Career", "Relationships", "Creative", "Health", "Other"] as const;
type Category = (typeof CATEGORIES)[number];


export default function DropPage() {
  const [category, setCategory] = useState<Category>("Career");
  const [content, setContent] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPrivatePrompt, setShowPrivatePrompt] = useState(false);
  const [currentBottleId, setCurrentBottleId] = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const PROMPTS = [
    "What is one small victory you had today?",
    "Who is someone you are grateful for right now?",
    "What is a piece of advice that changed your life?",
    "Share a happy memory that makes you smile.",
    "What is something you're proud of yourself for?"
  ];

  // Add this line with your other state variables
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);

  const getRandomPrompt = () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  useEffect(() => {
    setIsClient(true);

    const savedHandle = localStorage.getItem("kindsphere_handle");
    setUserHandle(savedHandle);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const syncHandle = () => {
      setUserHandle(localStorage.getItem("kindsphere_handle"));
    };
    window.addEventListener("auth-changed", syncHandle);

    supabase.auth.getSession().then(({ data }) => {
      console.log("DROP SESSION:", data.session);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT:", event, session);
    });

    return () => window.removeEventListener("auth-changed", syncHandle);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("No session");
      setSubmitting(false);
      return;
    }

    try {
      const result = await castBottle(content, category);
      const bottle = result[0];
      setCurrentBottleId(bottle.id);
      setSubmitting(false);
      setShowPrivatePrompt(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePrivateChoice(choice: boolean) {
    if (choice && currentBottleId) {
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
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12"
        style={{ background: "radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)" }}>
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="font-serif text-4xl font-medium text-foreground">Bottle Dropped</h2>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setShowPrivatePrompt(true)}
            className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)" }}
          >
            {isSubmitting ? "Dropping..." : "Drop This Bottle"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 pt-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 pb-24 md:pb-32">
        {/* Two-column on md+, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-24 items-start">

          {/* ── LEFT: Greeting + Form ─────────────────────────── */}
          <div className="space-y-10">
            {/* Page header */}
            <div className="space-y-2 enter enter-d1">
              <h1 className="font-serif text-4xl text-stone-900">
                <span className="text-[#7C3AED] italic">Drop</span> a Bottle
              </h1>
              <p className="text-stone-600">
                Share your thoughts anonymously with the KindSphere community.
                Encourage someone, share a moment of your life, or just send a message out into the world.
              </p>
            </div>

            {/* Form */}
            <section className="space-y-6 enter enter-d2">
              <h2 className="font-serif text-2xl text-stone-900 border-b border-stone-200 pb-2">
                Your Bottle
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Category
                  </label>
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
                  minLength={30}
                  className="w-full min-h-[270px] rounded-[24px] border border-[#E9DDFD] bg-[#F8F5FF] p-6 text-stone-600 placeholder:text-stone-400 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
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
          </div>

          {/* ── RIGHT: What happens next + Widget ────────────────── */}
          <div className="flex flex-col mt-12 md:mt-0 enter enter-d3 gap-12">

            {/* What happens next (Always visually first on Desktop, second on Mobile) */}
            <section className="order-last md:order-first space-y-8">
              <h2 className="font-serif text-2xl text-stone-900 border-b border-stone-200 pb-2">
                What happens next?
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="text-[#7C3AED] mt-1 shrink-0"><Shield size={24} /></div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-lg">Your identity stays hidden</h4>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      We take anonymity seriously. Your name, age, and location are never attached
                      to your bottle. It's just you and your thoughts, floating freely in the sphere.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-[#7C3AED] mt-1 shrink-0"><RepliesIcon className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-lg">Thoughtful, kind replies</h4>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      Once your bottle is live, community members can respond with empathy and advice.
                      You'll be notified whenever someone takes a moment to offer you kindness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-[#7C3AED] mt-1 shrink-0"><SpreadPositivityIcon className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-lg">A growing impact</h4>
                    <p className="text-stone-500 mt-1 leading-relaxed">
                      Every bottle you drop helps build a more supportive, understanding world.
                      Your vulnerability often becomes the exact comfort someone else needs to hear today.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Kindness Spark Widget (Gradient Background) */}
            <div className="order-first md:order-last p-8 rounded-[24px] bg-gradient-to-br from-violet-50 to-white border border-[#E9DDFD]">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[#7C3AED]">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-serif text-xl text-stone-900">Need some inspiration?</h3>
              </div>
              <p className="text-stone-600 leading-relaxed mb-6 italic">
                "{currentPrompt}"
              </p>
              <button
                onClick={() => setCurrentPrompt(getRandomPrompt())}
                className="text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                Try a different prompt →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPrivatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-6">
            <h2 className="font-serif text-2xl text-[#1C2541] mb-4">One more thing...</h2>
            <p className="text-stone-600 mb-6">Your bottle will always appear in the public feed.</p>
            <p className="text-stone-600 mb-8">Would you also like to anonymously send it to one random person?</p>
            <div className="space-y-3">
              <button className="w-full border rounded-xl py-3" onClick={() => handlePrivateChoice(false)}>
                No, public feed only
              </button>
              <button className="w-full bg-[#7C3AED] text-white rounded-xl py-3" onClick={() => handlePrivateChoice(true)}>
                Yes, send privately too
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
