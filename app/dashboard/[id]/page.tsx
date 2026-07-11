"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sendReplyToBottle } from "@/lib/db-queries";
import { isUserOwner } from "@/lib/utils/authGuard";
import { getCurrentUserId } from "@/lib/auth";
import Link from "next/link";

export default function ResponseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bottle, setBottle] = useState<any>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

    // --- Pre-flight diagnostic log ---
    const bottleId = id as string;
    console.log("[handleSendReply] bottleId:", bottleId);
    console.log("[handleSendReply] currentUserId:", currentUserId);
    console.log("[handleSendReply] replyContent length:", replyContent.trim().length);

    if (!bottleId) {
      console.error("[handleSendReply] MISSING: bottleId is null/undefined");
      return alert("Error: bottle ID is missing. Please go back and try again.");
    }
    if (!currentUserId) {
      console.error("[handleSendReply] MISSING: currentUserId is null — user not logged in");
      return alert("Please log in to reply.");
    }
    if (!replyContent.trim()) {
      return alert("Please write something before sending.");
    }

    try {
      await sendReplyToBottle(bottleId, currentUserId, replyContent);
      alert("Reply sent!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("[sendReplyToBottle] DB error:", err);
      alert(`Failed to send reply: ${err?.message || "unknown error"}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bottle) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-serif">Request not found.</h1>
      <Link href="/dashboard" className="text-stone-500 underline mt-2">Back to Shore</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pt-28 pb-10 px-6">
      <Link href="/dashboard" className="text-sm text-stone-500 hover:text-stone-800">← Back to Shore</Link>

      <div className="mt-8 p-6 bg-white border border-stone-200 rounded-2xl shadow-sm">
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
        <form onSubmit={handleSendReply} className="mt-8 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
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
          <div className="flex gap-4">
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
  );
}