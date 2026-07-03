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
            <div className="w-full max-w-md bg-white rounded-3xl p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-700">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-serif text-[#1C2541] mb-8 text-center">
                    {mode === "register" ? "Claim Your Identity" : "Welcome Back"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}
                    <input
                        placeholder="Handle"
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                        className="w-full p-4 border border-stone-200 rounded-xl bg-stone-50 text-sm"
                    />

                    <div className="relative">
                        <input
                            type={showPhrase ? "text" : "password"}
                            placeholder="Secret Phrase"
                            value={phrase}
                            onChange={e => setPhrase(e.target.value)}
                            className="w-full p-4 border border-stone-200 rounded-xl bg-stone-50 text-sm pr-12"
                        />
                        <button type="button" onClick={() => setShowPhrase(!showPhrase)} className="absolute right-4 top-4 text-stone-400">
                            {showPhrase ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="w-full text-white p-4 rounded-xl font-semibold" style={{ background: "linear-gradient(135deg,#7C3AED 0%,#6366F1 60%,#818CF8 100%)" }}>
                        {loading ? "Processing..." : mode === "register" ? "Join the Sphere" : "Enter my Space"}
                    </button>
                </form>

                <button onClick={toggleMode} className="w-full text-center mt-6 text-[#1C2541] font-medium text-sm">
                    {mode === "register" ? "Already joined? Login here" : "New to the sphere? Claim an identity"}
                </button>
            </div>
        </div>
    );
}