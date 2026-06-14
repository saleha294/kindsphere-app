"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, MessageCircle, Clock } from "lucide-react";
import { ALL_REQUESTS, TAG_STYLES } from "@/lib/requests";
// ─── Import your database connection ───
import { supabase } from "@/lib/utils/supabase";

export default function ResponseDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const request = ALL_REQUESTS.find((r) => r.id === id);

  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Track database issues

  // ─── Real Async Supabase Insertion ───
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim() || feedback.trim().length < 15) return;

    setSending(true);
    setErrorMessage("");

    try {
      // 1. Temporary System User ID for Prototyping
      // (Once authentication is wired, this will be the active logged-in user's true ID)
      const temporarySystemUserId = "00000000-0000-0000-0000-000000000000";

      // 2. Perform the database insert operation
      const { error } = await supabase
        .from("bottles")
        .insert([
          {
            sender_id: temporarySystemUserId, // Who cast it
            content: feedback,                // The raw text area block
            category: request?.category || "General",
            status: "drifting"
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error.message);
        setErrorMessage("The digital currents are heavy right now. Please try casting again.");
        setSending(false);
        return;
      }

      // 3. Success! Clear input and show the success view state
      setSending(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Network Exception:", err);
      setErrorMessage("Could not reach the sphere network. Check your connection.");
      setSending(false);
    }
  }

  /* ── 404-like fallback ── */
  if (!request) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 gap-4">
        <p className="font-serif text-3xl text-foreground">Request not found.</p>
        <Link href="/dashboard" className="text-sm text-primary underline underline-offset-4">
          Back to the feed
        </Link>
      </div>
    );
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">
        <div className="text-center space-y-5 max-w-sm">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "1.8s" }} />
            <div className="relative w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
              <MessageCircle className="h-9 w-9 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-medium text-foreground">
            Your words are on the ocean.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your kind, anonymous feedback has been sent into the sphere.
            @{request.handle} will receive it without ever knowing it came from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 text-foreground text-sm font-semibold px-6 py-3 hover:bg-stone-50 active:scale-95 transition-all"
            >
              Back to Feed
            </Link>
            <Link
              href="/drop"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold px-6 py-3 hover:opacity-90 active:scale-95 transition-all"
            >
              Drop Your Own Bottle
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = request.fullText.split("\n\n");

  /* ── Main detail view ── */
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-10 px-6 pb-20 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto space-y-8">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to feed
        </Link>

        {/* ── Request card ── */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-[0_8px_40px_rgb(0,0,0,0.05)] overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(to right, hsl(14,66%,62%), hsl(150,25%,61%))" }} />

          <div className="p-7 md:p-10">
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8">
              <span className="font-medium text-foreground text-sm">@{request.handle}</span>
              <span className="text-stone-300 hidden sm:inline" aria-hidden>&bull;</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TAG_STYLES[request.category]}`}>
                {request.category}
              </span>
              <span className="text-stone-300 hidden sm:inline" aria-hidden>&bull;</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />{request.time}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />{request.views.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5" />{request.responses} responses
              </span>
            </div>

            {/* Full request text */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="font-serif text-lg md:text-xl leading-[1.75] text-foreground">
                  {i === 0 && <>&ldquo;</>}
                  {para}
                  {i === paragraphs.length - 1 && <>&rdquo;</>}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Feedback form ── */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-[0_8px_40px_rgb(0,0,0,0.04)] p-7 md:p-10 space-y-5">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-2">
              Pour your thoughts into the sphere
            </h2>
            <p className="text-sm text-muted-foreground">
              Your response is completely anonymous. Write as honestly and kindly as you can.
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-4">

            {/* Error Alert Display */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-100 font-medium animate-fade-in">
                {errorMessage}
              </div>
            )}

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              minLength={15}
              rows={6}
              placeholder="Pour your kind, constructive thoughts into the sphere..."
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-sans placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white transition-all resize-y leading-relaxed"
            />

            <p className={`text-xs text-right transition-colors ${feedback.length > 0 && feedback.length < 15
              ? "text-orange-500"
              : "text-muted-foreground"
              }`}>
              {feedback.length > 0 && feedback.length < 15
                ? `${15 - feedback.length} more characters needed`
                : feedback.length > 0
                  ? `${feedback.length} characters`
                  : "Minimum 15 characters"}
            </p>

            <button
              type="submit"
              disabled={sending || feedback.trim().length < 15}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#E07A5F] text-white text-base font-semibold px-8 py-3.5 min-h-[52px] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(224,122,95,0.3)]"
            >
              {sending ? "Sending into the ocean\u2026" : "Send Feedback via the Ocean"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block shrink-0" />
            Your identity is never revealed. Only your words travel through KindSphere.
          </p>
        </div>

      </div>
    </div>
  );
}