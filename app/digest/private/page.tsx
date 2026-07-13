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
        <div className="w-full pb-20 space-y-8">
            {/* Back Button */}
            <Link
                href="/digest"
                className="inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] transition-colors px-4 py-2 rounded-full text-sm font-medium w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

                {/* Kindness Reminder Section */}
                <div className="bg-white p-8 rounded-[2rem] border border-violet-100 shadow-sm space-y-6">
                    <h2 className="flex items-center gap-2 text-[#7C3AED] font-semibold text-sm">
                        <span className="text-lg">🌿</span> Reply with Kindness
                    </h2>
                    <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                        Every anonymous reply has the chance to brighten someone's day.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
                        <div className="flex items-center gap-2">🌿 Encourage instead of judging.</div>
                        <div className="flex items-center gap-2">💜 Listen before giving advice.</div>
                        <div className="flex items-center gap-2">🤝 Respect different experiences.</div>
                        <div className="flex items-center gap-2">🔒 Never ask for personal information.</div>
                    </div>
                </div>

                {/* List Header */}
                <div className="space-y-1 pt-4">
                    <h2 className="text-xl font-serif text-[#1C2541]">Private Bottles</h2>
                    <p className="text-stone-400 text-sm">Every anonymous message waiting for your kindness appears below.</p>
                </div>

                {/* Bottle List */}
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
                                    className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-violet-100"
                                >
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

                                    <p className="text-[#1C2541] text-[15px] leading-relaxed">
                                        {bottle?.content}
                                    </p>

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
                                                className="w-full p-4 bg-white border border-stone-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                                                placeholder="Write an anonymous reply…"
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    disabled={isSending || !replyDrafts[delivery.id]?.trim()}
                                                    onClick={() => handleReply(delivery.id, bottle?.id)}
                                                    className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
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

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-[2rem] text-white shadow-lg space-y-5">
                    <h3 className="font-serif text-xl">💌 Enjoying Private Bottles?</h3>
                    <p className="text-violet-100 text-sm leading-relaxed max-w-2xl">
                        If you enjoy exchanging anonymous conversations, why not send one yourself?
                        When creating your next bottle, choose the Private Delivery option to send it directly to another KindSphere member.
                    </p>
                    <Link
                        href="/drop"
                        className="inline-block bg-white text-[#7C3AED] font-semibold px-6 py-3 rounded-full text-sm transition-transform hover:scale-105 active:scale-95 w-max"
                    >
                        Send a Private Bottle →
                    </Link>
                </div>
        </div>
    );
}
