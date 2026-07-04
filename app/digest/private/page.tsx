"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Send } from "lucide-react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { getPrivateBottles, replyToPrivateBottle } from "@/lib/db-queries";

export default function PrivateBottlesPage() {
    const [bottles, setBottles] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Per-bottle reply draft state
    const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
    const [sending, setSending] = useState<Record<string, boolean>>({});
    const [sent, setSent] = useState<Record<string, boolean>>({});

    useEffect(() => {
        async function load() {
            const uid = await getCurrentUserId();
            if (!uid) return;
            setCurrentUserId(uid);
            const data = await getPrivateBottles(uid);
            setBottles(data || []);
        }
        load();
    }, []);

    const handleReply = async (deliveryId: string, bottleId: string) => {
        const content = replyDrafts[deliveryId]?.trim();
        if (!content || !currentUserId) return;

        setSending((prev) => ({ ...prev, [deliveryId]: true }));
        try {
            await replyToPrivateBottle(deliveryId, bottleId, currentUserId, content);
            // Remove from local list immediately so it leaves the inbox
            setSent((prev) => ({ ...prev, [deliveryId]: true }));
            setTimeout(() => {
                setBottles((prev) => prev.filter((b) => b.id !== deliveryId));
            }, 1200);
        } catch (err) {
            console.error("[replyToPrivateBottle] error:", err);
            alert("Could not send reply. Please try again.");
        } finally {
            setSending((prev) => ({ ...prev, [deliveryId]: false }));
        }
    };

    return (
        <div className="space-y-8 max-w-3xl pb-10">
            {/* Back Button */}
            <Link
                href="/digest"
                className="inline-flex items-center gap-2 text-white bg-[#7C3AED] hover:bg-[#7C3AED] transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {/* Header */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[#7C3AED]" />
                    <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                        Private Bottles
                    </h1>
                </div>
                <p className="text-stone-500 text-[15px] leading-relaxed max-w-2xl">
                    Someone dropped a bottle and it found its way to you — anonymously.
                    Only you can see these. Reply kindly, then they drift on.
                </p>
            </div>

            {/* List */}
            <div className="space-y-5">
                {bottles.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center space-y-2">
                        <p className="text-[#1C2541] font-serif text-lg">No private bottles waiting.</p>
                        <p className="text-stone-400 text-sm">When someone sends a bottle your way, it will appear here.</p>
                    </div>
                ) : (
                    bottles.map((delivery) => {
                        const bottle = Array.isArray(delivery.bottle)
                            ? delivery.bottle[0]
                            : delivery.bottle;

                        const isSent = sent[delivery.id];
                        const isSending = sending[delivery.id];

                        return (
                            <div
                                key={delivery.id}
                                className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5"
                            >
                                {/* Anonymous sender badge */}
                                <div className="flex justify-between items-center text-xs text-stone-400 font-medium tracking-wide">
                                    <span className="flex items-center gap-1.5">
                                        <Lock className="h-3 w-3" />
                                        Anonymous · Private delivery
                                    </span>
                                    <span className="uppercase">
                                        {new Date(delivery.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                {/* Bottle content */}
                                <p className="text-[#1C2541] font-serif text-lg leading-relaxed">
                                    &ldquo;{bottle?.content}&rdquo;
                                </p>

                                {/* Reply form */}
                                {isSent ? (
                                    <p className="text-[#A78BFA] text-sm font-medium pt-2 border-t border-stone-50">
                                        ✓ Your reply has been sent anonymously.
                                    </p>
                                ) : (
                                    <div className="pt-4 border-t border-stone-50 space-y-3">
                                        <textarea
                                            value={replyDrafts[delivery.id] ?? ""}
                                            onChange={(e) =>
                                                setReplyDrafts((prev) => ({
                                                    ...prev,
                                                    [delivery.id]: e.target.value,
                                                }))
                                            }
                                            rows={3}
                                            className="w-full p-4 border border-stone-200 rounded-xl text-sm resize-none focus:outline-none focus:border-stone-300"
                                            placeholder="Write an anonymous reply…"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                disabled={isSending || !replyDrafts[delivery.id]?.trim()}
                                                onClick={() => handleReply(delivery.id, bottle?.id)}
                                                className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#7C3AED] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                                {isSending ? "Sending…" : "Send Anonymously"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
