"use client";


import { ArrowLeft, Eye, MessageCircle, Send, Plus } from "lucide-react";
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
        <div className="w-full pb-20 space-y-8">

            <Link
                href="/digest"
                className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max enter"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

                {/* List Section */}
                <div className="space-y-5 enter enter-d1">
                    {bottles.length === 0 ? (
                        <div className="bg-gradient-to-br from-violet-50 to-white rounded-[2rem] p-12 border border-violet-100 shadow-sm text-center space-y-4">
                            <div className="text-5xl">🍾</div>
                            <div className="space-y-1">
                                <p className="text-[#1C2541] font-serif text-xl">You haven't dropped any bottles yet</p>
                                <p className="text-stone-500 text-sm max-w-sm mx-auto">Every bottle you release into KindSphere has the chance to reach someone who needs it.</p>
                            </div>
                            <Link
                                href="/drop"
                                className="inline-block bg-[#7C3AED] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6D28D9] transition-all"
                            >
                                Drop Your First Bottle
                            </Link>
                        </div>
                    ) : (
                        bottles.map((bottle) => (
                            <div
                                key={bottle.id}
                                className="group bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-stone-400 font-medium tracking-wide uppercase">
                                        {new Date(bottle.created_at).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span
                                        className="px-5 py-2 rounded-full font-bold border shadow-sm"
                                        style={{
                                            background: bottle.status === "drifting" ? "rgba(167,139,250,0.1)" : "rgba(168,218,220,0.15)",
                                            borderColor: bottle.status === "drifting" ? "rgba(167,139,250,0.2)" : "rgba(168,218,220,0.3)",
                                            color: bottle.status === "drifting" ? "#A78BFA" : "#5d8e91",
                                        }}
                                    >
                                        {bottle.status.charAt(0).toUpperCase() + bottle.status.slice(1)}
                                    </span>
                                </div>

                                <p className="text-[#1C2541] leading-relaxed text-[15px]">
                                    {bottle.content}
                                </p>

                                <div className="flex items-center gap-6 pt-4 text-xs font-medium text-stone-400 border-t border-stone-50 group-hover:text-stone-500 transition-colors">
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        Drifting through KindSphere
                                    </span>
                                    
                                </div>
                            </div>
                        ))
                    )}
                </div>
        </div>
    );
}
