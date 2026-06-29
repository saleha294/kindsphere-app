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
    <Link href={`/dashboard/${item.id}`}>
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