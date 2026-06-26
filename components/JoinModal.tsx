"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase"; // adjust based on your supabase client path

interface JoinModalProps {
    onClose: () => void;
    onSuccess: (handle: string) => void;
}

export default function JoinModal({ onClose, onSuccess }: JoinModalProps) {
    const [handle, setHandle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    // Clean username inputs automatically
    const trimmed = handle.trim().replace(/\s+/g, "_").toLowerCase();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (trimmed.length < 3) return;
        setJoining(true);
        setError(null);

        try {
            // 1. Try to insert user directly into Supabase public table
            const { error: dbError } = await supabase
                .from("users")
                .insert([{ username: trimmed }]);

            if (dbError) {
                // Handle unique constraint duplicate handles
                if (dbError.code === "23505") {
                    throw new Error("This anonymous handle is already claimed inside the sphere.");
                }
                throw dbError;
            }

            // 2. If database write passes, cache session in localStorage
            localStorage.setItem("kindsphere_handle", trimmed);

            onSuccess(trimmed);
            onClose();

            // Broadcast auth change so all listening pages update instantly (no full reload needed)
            window.dispatchEvent(new Event("auth-changed"));
        } catch (err: any) {
            setError(err.message || "An expected roadblock occurred.");
            setJoining(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            style={{ background: "rgba(44, 39, 36, 0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full max-w-md rounded-3xl overflow-hidden"
                style={{
                    background: "#E07A5F",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 24px 60px rgba(224, 122, 95, 0.35)",
                }}
            >
                <div className="h-1.5 w-full" style={{ background: "#81B29A" }} />

                <div className="relative px-8 pt-7 pb-9 space-y-6">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/10 text-white/80 active:scale-90"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="space-y-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: "#81B29A" }}>
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl font-medium leading-snug text-white">
                                Pick your anonymous name
                            </h2>
                            <p className="text-xs mt-1 leading-relaxed text-white/85">
                                No email. No tracking. Just a handle that disappears into the sphere with you.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/60 select-none">
                                @
                            </span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                                placeholder="your_sphere_name"
                                maxLength={24}
                                autoFocus
                                className="w-full rounded-xl pl-8 pr-4 py-3.5 text-sm font-medium placeholder:text-stone-400 outline-none bg-white text-stone-800"
                            />
                        </div>

                        {/* Error Message Feedbacks */}
                        {error && (
                            <p className="text-xs font-semibold text-amber-200 bg-black/10 p-2.5 rounded-lg border border-amber-200/20">
                                {error}
                            </p>
                        )}

                        {handle.length > 0 && trimmed.length < 3 && !error && (
                            <p className="text-xs font-medium text-amber-200">
                                At least 3 characters needed
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={joining || trimmed.length < 3}
                            className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 text-white cursor-pointer"
                            style={{ background: "#81B29A" }}
                        >
                            {joining ? "Securing Handle..." : "Enter the Sphere →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}