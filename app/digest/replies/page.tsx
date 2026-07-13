"use client";

import { useEffect, useState } from "react";
import { getMyReplies } from "@/lib/db-queries";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import RepliesIcon from "@/components/icons/RepliesIcon";


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
        <div className="w-full pb-20 space-y-8">

            <Link
                href="/digest"
                className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {displayReplies.length === 0 ? (
                <div className="bg-gradient-to-br from-violet-50 to-white rounded-[2rem] p-12 border border-violet-100 shadow-sm text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-white border border-violet-100 shadow-sm flex items-center justify-center">
                            <RepliesIcon className="w-10 h-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[#1C2541] font-serif text-xl">No replies yet</p>
                        <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
                            When someone responds to one of your bottles, their reply will drift back to you here.
                        </p>
                    </div>
                    <Link
                        href="/drop"
                        className="inline-block bg-[#7C3AED] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#6D28D9] transition-all"
                    >
                        Drop a Bottle
                    </Link>
                </div>
            ) : (
                <>
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
    );
}