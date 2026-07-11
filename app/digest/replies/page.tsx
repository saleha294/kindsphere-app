"use client";

import { useEffect, useState } from "react";
import { getMyReplies } from "@/lib/db-queries";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";


export default function RepliesPage() {
    const [replies, setReplies] = useState<any[]>([]);
    useEffect(() => {
        async function loadReplies() {
            const uid = await getCurrentUserId();

            if (!uid) return;

            const data = await getMyReplies(uid);
            setReplies(data || []);
        }

        loadReplies();
    }, []);


    const displayReplies = replies;

    return (
        <div className="w-full min-h-screen pb-20 bg-stone-50">
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-10 space-y-8">

                <Link
                    href="/digest"
                    className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max"
                >
                    <ArrowLeft size={16} />
                    Back to Drift
                </Link>

                {displayReplies.length === 0 ? (
                    <div className="text-center py-20 text-stone-500">
                        No replies yet.
                    </div>
                ) : (
                    <>
                        {/* Redesigned Header Section */}
                        <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-[2rem] border border-violet-100 shadow-sm relative overflow-hidden animate-fade-in">
                            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-transparent to-transparent pointer-events-none" />
                            <div className="relative z-10 space-y-3">
                                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                                    Your Replies
                                </h1>
                                <p className="text-stone-600 text-[15px] leading-relaxed max-w-2xl">
                                    These are the answers and thoughts people have returned to your drifting bottles.
                                </p>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="space-y-5">
                            {displayReplies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
                                >
                                    {/* Updated Bottle Quote background */}
                                    <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100 text-sm text-stone-600 italic">
                                        &ldquo;{reply.bottle.content}&rdquo;
                                    </div>
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 text-[#A78BFA] font-semibold text-sm">
                                            <MessageCircle size={16} />
                                            <span>@{reply.sender?.anonymous_handle || 'Anonymous'}</span>
                                        </div>
                                        <p className="text-[#1C2541] font-serif text-lg leading-relaxed">
                                            {reply.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}