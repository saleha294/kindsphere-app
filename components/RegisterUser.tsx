"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Ensure this import is correct
import { authUser } from "@/lib/db-queries";

import { Sparkles, ShieldCheck, X, Eye, EyeOff } from "lucide-react";


export default function RegisterUser({ isOpen, onClose, onAccountCreated }: any) {
    const [mode, setMode] = useState<"register" | "login">("register");
    const [handle, setHandle] = useState("");
    const [phrase, setPhrase] = useState("");
    const [showPhrase, setShowPhrase] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const toggleMode = () => {
        setMode(mode === "register" ? "login" : "register");
        setHandle("");
        setPhrase("");
        setErrorMsg("");
    };

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setErrorMsg("");
        setLoading(true);

        try {
            const cleanHandle = handle.trim().toLowerCase();

            if (!cleanHandle) {
                throw new Error("Enter a handle");
            }

            if (!phrase.trim()) {
                throw new Error("Enter a secret phrase");
            }

            const user = await authUser(
                cleanHandle,
                phrase,
                mode
            );


            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log("SESSION:", session);

            console.log(
                "LOCAL STORAGE TOKEN:",
                localStorage.getItem(
                    "sb-fgynntwcltmgjbehvpqy-auth-token"
                )
            );

            const {
                data: { user: authUserObj },
            } = await supabase.auth.getUser();

            console.log("AUTH USER:", authUserObj);

            localStorage.setItem(
                "kindsphere_handle",
                user.anonymous_handle
            );

            localStorage.setItem(
                "kindsphere_uid",
                user.id
            );

            window.dispatchEvent(
                new Event("auth-changed")
            );

            onAccountCreated(
                user.anonymous_handle,
                user.id
            );

            onClose();

        } catch (err: any) {
            setErrorMsg(
                err.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[420px] rounded-3xl bg-white p-5 sm:p-6 shadow-2xl">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-stone-400 transition hover:text-stone-700"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="font-serif text-2xl text-[#1C2541]">
                        {mode === "register"
                            ? "Create Your Identity"
                            : "Welcome Back"}
                    </h2>

                    <p className="mt-2 text-sm text-stone-500">
                        {mode === "register"
                            ? "Join KindSphere with an anonymous handle."
                            : "Sign in to your anonymous space."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {errorMsg && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {/* Handle */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
                            Handle
                        </label>

                        <input
                            placeholder="trail_me"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#7C3AED] focus:bg-white"
                        />

                        <p className="mt-1 text-[11px] text-stone-500">
                            Don't use your real name or email. Join under 10 seconds.
                        </p>
                    </div>

                    {/* Secret Phrase */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1C2541]">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPhrase ? "text" : "password"}
                                placeholder="Create a password"
                                value={phrase}
                                onChange={(e) => setPhrase(e.target.value)}
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#7C3AED] focus:bg-white"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPhrase(!showPhrase)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                                {showPhrase ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <p className="mt-1 text-[11px] text-stone-500">
                            You'll use this whenever you sign in.
                        </p>
                    </div>

                    {/* Privacy Note (Register Only) */}
                    {mode === "register" && (
                        <div className="rounded-xl bg-violet-50 border border-violet-100 px-3 py-2">
                            <p className="text-[11px] leading-relaxed text-violet-700">
                                🔒 Only your anonymous handle is visible inside KindSphere. Your password is encrypted.
                            </p>
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-3.5 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                        style={{
                            background:
                                "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)",
                        }}
                    >
                        {loading
                            ? "Processing..."
                            : mode === "register"
                                ? "Create My Identity"
                                : "Enter My Space"}
                    </button>
                </form>

                {/* Divider */}
                <div className="mt-6 border-t border-stone-100 pt-5 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-sm font-medium text-[#1C2541] transition hover:text-[#7C3AED]"
                    >
                        {mode === "register"
                            ? "Already have an identity? Sign in"
                            : "New here? Create an anonymous identity. Then login"}
                    </button>
                </div>
            </div>
        </div>
    );
}