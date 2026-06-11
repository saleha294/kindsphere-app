"use client";

import { Compass, Eye, MessageCircle } from "lucide-react";

const MOCK_SENT_BOTTLES = [
    {
        id: "s1",
        excerpt: "Admitting to myself that I want to leave design to study cognitive science, but my family views it as throwing away a steady trajectory. Feels heavy.",
        timestamp: "Casted 3 days ago",
        status: "Drifting",
        reach: 142,
        responses: 4,
    },
    {
        id: "s2",
        excerpt: "Gave honest, tough structural feedback to a stranger on their poetry layout today. It felt incredible to just focus on the craft without ego getting in the middle.",
        timestamp: "Casted 1 week ago",
        status: "Answered",
        reach: 389,
        responses: 12,
    },
];

export default function SentDigestPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">Your Outgoing Echoes</h1>
                <p className="text-stone-500 text-sm mt-1">Every thought you let drift out into the world, tracked completely in the shadows.</p>
            </div>

            <div className="space-y-4">
                {MOCK_SENT_BOTTLES.map((bottle) => (
                    <div key={bottle.id} className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-stone-400 font-medium">{bottle.timestamp}</span>
                            <span
                                className="px-2.5 py-1 rounded-full font-medium border"
                                style={{
                                    background: bottle.status === "Drifting" ? "rgba(129,178,154,0.1)" : "rgba(224,122,95,0.08)",
                                    borderColor: bottle.status === "Drifting" ? "rgba(129,178,154,0.25)" : "rgba(224,122,95,0.22)",
                                    color: bottle.status === "Drifting" ? "#81B29A" : "#E07A5F",
                                }}
                            >
                                {bottle.status}
                            </span>
                        </div>

                        <p className="text-[#1C2541] leading-relaxed font-serif text-base">
                            &ldquo;{bottle.excerpt}&rdquo;
                        </p>

                        <div className="flex items-center gap-6 pt-2 text-xs font-medium text-stone-400 border-t border-stone-100">
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {bottle.reach} thinkers reached
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageCircle className="h-4 w-4 text-[#81B29A]" />
                                <span className="text-[#1C2541]">{bottle.responses} responses received</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}