"use client";

import { useState } from "react";
import { supabase } from "@/lib/utils/supabase"; // Ensure this import is correct
import bcrypt from "bcryptjs";
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const cleanHandle = handle.trim().replace("@", "");

        // 1. Hash the phrase locally before sending to Supabase
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(phrase, salt);

        if (mode === "register") {
            const { data, error } = await supabase
                .from("users")
                .insert([{ anonymous_handle: cleanHandle, secret_hash: hash }])
                .select()
                .single();

            if (error) {
                setErrorMsg(error.code === "23505" ? "Handle is taken." : "Registration failed.");
            } else {
                onAccountCreated(data.anonymous_handle, data.id);
            }
        } else {
            // Login: Fetch and compare
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("anonymous_handle", cleanHandle)
                .single();

            if (data && bcrypt.compareSync(phrase, data.secret_hash)) {
                onAccountCreated(data.anonymous_handle, data.id);
            } else {
                setErrorMsg("Invalid handle or secret phrase.");
            }
        }
        setLoading(false);
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

                    <button type="submit" disabled={loading} className="w-full bg-[#E07A5F] text-white p-4 rounded-xl font-semibold">
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