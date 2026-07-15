"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sendReplyToBottle } from "@/lib/db-queries";
import { isUserOwner } from "@/lib/utils/authGuard";
import { getCurrentUserId } from "@/lib/auth";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ResponseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bottle, setBottle] = useState<any>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);


  useEffect(() => {
    // Sync auth state and re-read on auth-changed events
    const syncAuth = async () => {
      setCurrentUserId(await getCurrentUserId());
    };

    syncAuth(); // Read on mount
    window.addEventListener("auth-changed", syncAuth);

    async function fetchBottle() {
      const { data, error } = await supabase
        .from("bottles")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setBottle(data);
      setLoading(false);
    }
    fetchBottle();

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();

    const bottleId = id as string;

    if (!bottleId) {
      return alert("Error: bottle ID is missing. Please go back and try again.");
    }
    if (!currentUserId) {
      return alert("Please log in to reply.");
    }
    if (!replyContent.trim()) {
      return alert("Please write something before sending.");
    }

    try {
      await sendReplyToBottle(bottleId, currentUserId, replyContent);

      // 1. Remove the alert() so the notification panel can show immediately
      // 2. Set the notification state
      setShowNotification(true);

      // 3. Clear the form or redirect if needed
      setReplyContent("");

      // 4. Optional: Redirect after a small delay so they see the notification
      setTimeout(() => {
        setShowNotification(false);
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("[sendReplyToBottle] DB error:", err);
      alert(`Failed to send reply: ${err?.message || "unknown error"}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bottle) return (
    <div className="flex flex-col items-start justify-start min-h-screen px-4 md:px-8">
      <h1 className="text-2xl font-serif">Request not found.</h1>
      <Link href="/dashboard" className="text-stone-500 underline mt-2">Back to Shore</Link>
    </div>
  );


  return (
    <div className="w-full min-h-screen bg-stone-50 pt-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
        {/* Inner wrapper to keep the content width readable */}
        <div className="max-w-2xl pb-24">
          <Link href="/dashboard" className="text-sm text-stone-500 hover:text-stone-800 enter">← Back to Shore</Link>

          <div className="mt-8 space-y-1 enter enter-d1">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1C2541] leading-[1.1] tracking-tight">
              <span className="text-[#7C3AED] italic">Reply</span> to a bottle
            </h1>
            <p className="text-[18px] text-stone-600 max-w-lg pt-2 leading-relaxed">
              Your words have the power to turn someone's day around. Write with kindness.
            </p>
          </div>

          <div className="mt-8 p-6 bg-[#eee7f9ff] border border-stone-200 rounded-2xl shadow-sm enter enter-d2">
            <p className="text-lg text-stone-800 leading-relaxed">{bottle.content}</p>
          </div>



          {/* Strict auth guardrails — three deterministic states */}
          {isUserOwner(bottle.sender_id, currentUserId) ? (
            // STATE 1: Authenticated but it's their own bottle
            <div className="mt-8 p-6 bg-stone-100 border border-stone-200 rounded-2xl text-center text-stone-600">
              This is your portal. You cannot reply to yourself.
            </div>
          ) : !currentUserId ? (
            // STATE 2: Unauthenticated — show login prompt
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <p className="text-stone-700 font-medium mb-3">Please log in to send a reply.</p>
              <button
                onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                className="inline-block bg-stone-800 text-white py-2.5 px-6 rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors cursor-pointer"
              >
                Log In
              </button>
            </div>
          ) : (
            // Authenticated and it's someone else's bottle — show reply form
            <form onSubmit={handleSendReply} className="mt-8 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6 enter enter-d3">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <span className="text-xl">🍃</span>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Your reply</h3>
                  <p className="text-sm text-stone-500">Only the bottle author will see this</p>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all min-h-[160px]"
                placeholder="Write something warm, honest, or encouraging..."
                maxLength={500}
                required
              />

              {/* Footer & Meta */}
              <div className="flex justify-between items-center text-sm text-stone-500">
                <div className="flex items-center gap-2 text-violet-600 font-medium">
                  <span>💜</span>
                  <span>Be kind. Be real. Be you.</span>
                </div>
                <span>{replyContent.length}/500</span>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="mt-1 shrink-0 text-stone-400">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">Your identity stays hidden</p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    This reply will be delivered anonymously. If they respond and you both consent, you may choose to connect.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>🌊</span> Send with love
                </button>
                <button
                  type="button"
                  className="px-8 py-4 rounded-full border border-stone-200 font-semibold text-stone-700 hover:bg-stone-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        {showNotification && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto bg-[#1C2541] text-white px-6 py-4 rounded-2xl shadow-xl z-50 animate-fade-in flex items-center gap-3">
            <span>✨</span>
            <p className="text-sm font-medium">Your reply has been sent with love!</p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}