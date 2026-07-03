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

  if (displayReplies.length === 0) {
    return (
        <div className="text-center py-20 text-stone-500">
            No replies yet.
        </div>
    );
}

    return (
        <div className="space-y-8 max-w-3xl pb-10">
            {/* Back Button */}
            <Link
                href="/digest"
                className="inline-flex items-center gap-2 text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                    Your Replies
                </h1>
                <p className="text-stone-500 text-[15px] leading-relaxed max-w-2xl">
                    These are the answers and thoughts people have returned to your drifting bottles.
                </p>
            </div>

            {/* List Section */}
            <div className="space-y-5">
                {displayReplies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
                        {/* Reference to original bottle */}
                        <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-100 text-sm text-stone-500 italic">
                            &ldquo;{reply.bottle.content}&rdquo;
                        </div>

                        {/* Reply content */}
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
        </div>
    );
}