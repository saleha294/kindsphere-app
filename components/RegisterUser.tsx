"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/utils/supabase";
import { Sparkles, ShieldCheck, X } from "lucide-react";
import confetti from "canvas-confetti";

const LOADING_STEPS = [
    "Securing your unique handle...",
    "Carving out your space in the sphere...",
    "We are letting you in...",
    "Preparing your quiet digest..."
];

export default function RegisterUser({ isOpen, onClose, onAccountCreated }: {
    isOpen: boolean;
    onClose: () => void;
    onAccountCreated: (handle: string, id: string) => void;
}) {
    const [handle, setHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [stepIndex, setStepIndex] = useState(0);

    // Dynamic state script to cycle steps smoothly when loading is triggered
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            setStepIndex(0);
            interval = setInterval(() => {
                setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
            }, 1400);
        }
        return () => clearInterval(interval);
    }, [loading]);

    if (!isOpen) return null;

    function triggerCalmConfetti() {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 15,
            spread: 180,
            ticks: 150,
            zIndex: 100,
            colors: ["#E07A5F", "#81B29A", "#F4F1DE", "#F2CC8F"]
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 12 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: Math.random(), y: Math.random() * 0.2 }
            });
        }, 200);
    }

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
            const { data, error } = await supabase
                .from("users")
                .insert([{ anonymous_handle: cleanHandle }])
                .select()
                .single();

            if (error) {
                if (error.code === "23505") {
                    setErrorMsg("This handle is already drifting out there. Choose another unique one!");
                } else {
                    setErrorMsg(error.message);
                }
                setLoading(false);
                return;
            }

            // Artificial split fallback pause to let the character morph and loop gracefully
            await new Promise((resolve) => setTimeout(resolve, 3200));

            triggerCalmConfetti();

            localStorage.setItem("kindsphere_user_id", data.id);
            localStorage.setItem("kindsphere_handle", data.anonymous_handle);

            onAccountCreated(data.anonymous_handle, data.id);
            setHandle("");
            onClose();
        } catch (err) {
            setErrorMsg("Could not connect to the database currently.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative min-h-[400px] flex flex-col justify-between">
                <div>
                    <div className="h-1.5 w-full bg-[#E07A5F]" />

                    {/* Close Button Cross out layout link */}
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-all disabled:opacity-0 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* ── 13. Dynamic State Conditional Renderer ── */}
                    {loading ? (
                        /* Cute Character Interface Layout Container Overlay */
                        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center mt-8 animate-fade-in">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                {/* Ambient pulsing soft light backdrop shadow layer glow */}
                                <div className="absolute inset-0 rounded-full bg-emerald-100/50 blur-2xl animate-pulse scale-125" />

                                {/* Morphing Shape character block */}
                                <div
                                    className="w-16 h-16 bg-gradient-to-tr from-[#81B29A] via-[#A2D2DF] to-[#E07A5F]/50 shadow-sm"
                                    style={{
                                        animation: "blobMorph 5s infinite ease-in-out, spinSlow 10s infinite linear"
                                    }}
                                />

                                {/* Interactive Eyes Layer (CSS Blink controlled) */}
                                <div className="absolute flex gap-2.5 translate-y-[-2px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C2541] animate-eyeBlink" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C2541] animate-eyeBlink" />
                                </div>
                            </div>

                            <div className="mt-8 min-h-[24px]">
                                <h4 className="text-sm font-semibold text-[#1C2541] tracking-wide animate-pulse">
                                    {LOADING_STEPS[stepIndex]}
                                </h4>
                            </div>

                            <p className="text-[11px] text-stone-400 mt-2 italic font-serif">
                                Taking a brief breath...
                            </p>
                        </div>
                    ) : (
                        /* Standard Claim input submission layout form block */
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
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
                                    disabled={!handle.trim()}
                                    className="w-full inline-flex items-center justify-center rounded-xl bg-[#1C2541] text-white text-sm font-semibold py-3.5 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
                                >
                                    Step Inside the Sphere
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Bottom Privacy Statement Footer Anchor */}
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-4 border-t border-stone-100">
                        <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
                        Once set, your data is isolated dynamically using your session key.
                    </div>
                </div>
            </div>

            {/* Injected style blocks targeting the micro-keyframes sequence */}
            <style jsx global>{`
                @keyframes blobMorph {
                    0%, 100% { border-radius: 45% 55% 70% 30% / 45% 50% 50% 55%; }
                    33% { border-radius: 65% 35% 50% 50% / 55% 40% 60% 45%; }
                    66% { border-radius: 50% 50% 35% 65% / 40% 55% 45% 60%; }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes eyeBlink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                .animate-eyeBlink {
                    animation: eyeBlink 3.2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}