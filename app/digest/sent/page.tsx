"use client";

import { Eye, MessageCircle, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMySentBottles } from "@/lib/db-queries";
import { getCurrentUserId } from "@/lib/auth";

export default function SentDigestPage() {
    const [bottles, setBottles] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const uid = await getCurrentUserId();
            if (!uid) return;
            const data = await getMySentBottles(uid);
            setBottles(data || []);
        }
        load();
    }, []);

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
                {bottles.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center space-y-2">
                        <p className="text-[#1C2541] font-serif text-lg">You haven't dropped any bottles yet.</p>
                        <p className="text-stone-400 text-sm">Every bottle you send into KindSphere will appear here.</p>
                    </div>
                ) : (
                    bottles.map((bottle) => (
                        <div key={bottle.id} className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-stone-400 font-medium tracking-wide uppercase">
                                    {new Date(bottle.created_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                                <span
                                    className="px-4 py-1.5 rounded-full font-semibold border"
                                    style={{
                                        background: bottle.status === "drifting" ? "rgba(132,169,140,0.1)" : "rgba(168,218,220,0.15)",
                                        borderColor: bottle.status === "drifting" ? "rgba(132,169,140,0.2)" : "rgba(168,218,220,0.3)",
                                        color: bottle.status === "drifting" ? "#84A98C" : "#5d8e91",
                                    }}
                                >
                                    {bottle.status.charAt(0).toUpperCase() + bottle.status.slice(1)}
                                </span>
                            </div>

                            <p className="text-[#1C2541] leading-relaxed font-serif text-lg">
                                &ldquo;{bottle.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-6 pt-4 text-xs font-medium text-stone-400 border-t border-stone-50">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    Drifting through KindSphere
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MessageCircle className="h-4 w-4" style={{ color: "#84A98C" }} />
                                    <span className="text-stone-600">0 replies</span>
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
