"use client";

import { useState } from "react";
import { supabase } from "@/lib/utils/supabase";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";

export default function HandleModal({ isOpen, onClose, onAccountCreated }: {
    isOpen: boolean;
    onClose: () => void;
    onAccountCreated: (handle: string, id: string) => void;
}) {
    const [handle, setHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    if (!isOpen) return null;

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        const cleanHandle = handle.trim().replace("@", "");

        if (cleanHandle.length < 3) {
            setErrorMsg("Your anonymous handle must be at least 3 characters.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            // 1. Insert the new unique handle into Supabase
            const { data, error } = await supabase
                .from("users")
                .insert([{ anonymous_handle: cleanHandle }])
                .select()
                .single();

            // 2. Handle duplicate username errors safely
            if (error) {
                if (error.code === "23505") { // PostgreSQL unique violation error code
                    setErrorMsg("This handle is already drifting out there. Choose another unique one!");
                } else {
                    setErrorMsg(error.message);
                }
                setLoading(false);
                return;
            }

            // 3. Save session locally so the user stays logged in
            localStorage.setItem("kindsphere_user_id", data.id);
            localStorage.setItem("kindsphere_handle", data.anonymous_handle);

            onAccountCreated(data.anonymous_handle, data.id);
            setHandle("");
            onClose();
        } catch (err) {
            setErrorMsg("Could not connect to the database current.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="h-1.5 w-full bg-[#E07A5F]" />

                <div className="p-6 md:p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-[#E07A5F]">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="font-serif text-2xl font-medium text-[#1C2541]">Claim Your Identity</h3>
                        <p className="text-xs text-stone-500 max-w-xs mx-auto">
                            Pick an entirely anonymous handle. No email, no password, no tracking. Completely secure.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-100 font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-stone-400 select-none">@</span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.replace(/\s+/g, ""))}
                                placeholder="Solitary_Thinker"
                                disabled={loading}
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-4 py-3.5 text-sm outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-800 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !handle.trim()}
                            className="w-full inline-flex items-center justify-center rounded-xl bg-[#1C2541] text-white text-sm font-semibold py-3.5 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-stone-300" />
                            ) : (
                                "Step Inside the Sphere"
                            )}
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                        <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
                        Once set, your data is isolated dynamically using your session key.
                    </div>
                </div>
            </div>
        </div>
    );
}