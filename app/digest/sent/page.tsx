"use client";

import { Eye, MessageCircle, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyMessages } from "@/lib/db-queries";

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
    // Scaffold for real data later
    // const [bottles, setBottles] = useState([]);
    // useEffect(() => { ...fetch logic... }, []);

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
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="max-w-lg space-y-3">
                    <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                        Welcome to your sent bottles.
                    </h1>
                    <p className="text-stone-500 text-[15px] leading-relaxed">
                        This is the space where all your bottles sent and the journey of what you felt each day is recorded. Navigate and look back to see what you were feeling.
                    </p>
                </div>
                
                {/* Circular Terracotta Button */}
                <Link 
                    href="/drop" 
                    className="shrink-0 flex items-center justify-center w-32 h-32 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: "#E07A5F" }}
                >
                    <div className="flex flex-col items-center gap-2">
                        <Plus size={24} />
                        <span className="font-semibold text-sm">Drop a Bottle</span>
                    </div>
                </Link>
            </div>

            {/* List Section */}
            <div className="space-y-5">
                {MOCK_SENT_BOTTLES.map((bottle) => (
                    <div key={bottle.id} className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-stone-400 font-medium tracking-wide uppercase">{bottle.timestamp}</span>
                            <span
                                className="px-4 py-1.5 rounded-full font-semibold border"
                                style={{
                                    background: bottle.status === "Drifting" ? "rgba(132,169,140,0.1)" : "rgba(168,218,220,0.15)", // Sage Green vs Sage Blue
                                    borderColor: bottle.status === "Drifting" ? "rgba(132,169,140,0.2)" : "rgba(168,218,220,0.3)",
                                    color: bottle.status === "Drifting" ? "#84A98C" : "#5d8e91",
                                }}
                            >
                                {bottle.status}
                            </span>
                        </div>

                        <p className="text-[#1C2541] leading-relaxed font-serif text-lg">
                            &ldquo;{bottle.excerpt}&rdquo;
                        </p>

                        <div className="flex items-center gap-6 pt-4 text-xs font-medium text-stone-400 border-t border-stone-50">
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {bottle.reach} thinkers reached
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageCircle className="h-4 w-4" style={{ color: "#84A98C" }} />
                                <span className="text-stone-600">{bottle.responses} responses received</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}