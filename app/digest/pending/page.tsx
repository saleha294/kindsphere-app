"use client";

import { MessageSquarePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="space-y-8 max-w-3xl pb-10">
            {/* Back Button */}
            <Link
                href="/digest"
                className="inline-flex items-center gap-2 text-white bg-[#E07A5F] hover:bg-[#d66d52] transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                    Bottles waiting for your perspective.
                </h1>
                <p className="text-stone-500 text-[15px] leading-relaxed max-w-2xl">
                    These are the thoughts that specifically resonated with your journey.
                </p>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-5">
                {MOCK_PENDING_BOTTLES.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs text-stone-400 font-medium tracking-wide">
                                <span>@{item.handle}</span>
                                <span className="uppercase">{item.timeHeading}</span>
                            </div>
                            <p className="text-[#1C2541] font-serif text-lg leading-relaxed">
                                &ldquo;{item.excerpt}&rdquo;
                            </p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-stone-50">
                            <button
                                className="inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3 transition-transform hover:scale-105 active:scale-95 text-white shadow-md"
                                style={{ background: "#84A98C" }}
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