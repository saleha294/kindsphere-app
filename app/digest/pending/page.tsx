"use client";

import { MessageSquarePlus } from "lucide-react";

const MOCK_PENDING_BOTTLES = [
    {
        id: "p1",
        handle: "Solitary_Wave",
        excerpt: "I’ve spent the last year working completely isolated as a freelance contractor. The isolation is starting to degrade my daily mental stamina. How do you find camaraderie when you work for yourself?",
        timeHeading: "Intercepted 4 hours ago",
    },
    {
        id: "p2",
        handle: "Grounded_Tree",
        excerpt: "How do you learn to gracefully accept praise or constructive feedback when your immediate defensive default reaction is to look for an ulterior motive?",
        timeHeading: "Intercepted 1 day ago",
    },
];

export default function PendingDigestPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">Awaiting Your Perspective</h1>
                <p className="text-stone-500 text-sm mt-1">Bottles that have washed ashore specifically onto your dashboard. Your insight could re-anchor them.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {MOCK_PENDING_BOTTLES.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs text-stone-400">
                                <span>@{item.handle}</span>
                                <span>{item.timeHeading}</span>
                            </div>
                            <p className="text-stone-700 leading-relaxed text-[15px] italic">
                                &ldquo;{item.excerpt}&rdquo;
                            </p>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-stone-100">
                            <button
                                className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2.5 transition-all hover:opacity-95 active:scale-98 text-white"
                                style={{ background: "#81B29A" }}
                            >
                                <MessageSquarePlus className="h-4 w-4" />
                                Offer Reflection
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}