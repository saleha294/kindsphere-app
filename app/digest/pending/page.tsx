"use client";

import { MessageSquarePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth";
import { getChosenBottles } from "@/lib/db-queries";


export default function PendingDigestPage() {
    const [bottles, setBottles] = useState<any[]>([]);
    useEffect(() => {
        async function load() {
            const uid = await getCurrentUserId();

            if (!uid) return;

            const data = await getChosenBottles(uid);

            setBottles(data || []);
        }

        load();
    }, []);
    return (
        <div className="w-full pb-20 space-y-8">

            <Link
                href="/digest"
                className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

                {/* List Section */}
                <div className="grid grid-cols-1 gap-5">
                    {bottles.map((item) => (
                        <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs text-stone-400 font-medium tracking-wide">
                                    <span>@{item.sender?.anonymous_handle}</span>
                                    <span className="uppercase">{item.timeHeading}</span>
                                </div>
                                <p className="text-[#1C2541] font-serif text-lg leading-relaxed">
                                    &ldquo;{item.content}&rdquo;
                                </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-stone-50">
                                <Link
                                    href={`/dashboard/${item.id}`}
                                    className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    <MessageSquarePlus className="h-4 w-4" />
                                    Reply Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
}