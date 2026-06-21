"use client";

import { useEffect, useState } from "react";

const LOADING_STEPS = [
    "Securing your unique handle...",
    "Carving out your space in the sphere...",
    "We are letting you in...",
    "Preparing your quiet drift..."
];

export default function RegistrationLoader() {
    const [stepIndex, setStepIndex] = useState(0);

    // Slowly cycle through friendly, calming text steps
    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            {/* Morphing Geometric Blob Character */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer Ambient Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-100/40 blur-xl animate-pulse scale-110" />

                {/* The Character Shape - Continually morphs border-radius and rotates slowly */}
                <div
                    className="w-16 h-16 bg-gradient-to-tr from-[#81B29A] via-[#A2D2DF] to-[#E07A5F]/40 animate-blob shadow-md"
                    style={{
                        animation: "blobMorph 6s infinite ease-in-out, spinSlow 12s infinite linear"
                    }}
                />

                {/* Cute Minimalist Face (Two blinking eyes) */}
                <div className="absolute flex gap-2.5 translate-y-[-2px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C2541] animate-blink" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C2541] animate-blink" />
                </div>
            </div>

            {/* Stepper Status Text */}
            <div className="mt-6 min-h-[24px]">
                <p className="text-sm font-medium text-[#1C2541]/80 tracking-wide transition-all duration-300 animate-pulse">
                    {LOADING_STEPS[stepIndex]}
                </p>
            </div>

            {/* Premium Subtle Subtext */}
            <p className="text-[11px] text-stone-400 mt-1.5 italic font-serif">
                Taking a brief breath...
            </p>

            {/* Custom Tailwind/CSS keyframes embedded directly so you don't mess up global styles */}
            <style jsx global>{`
                @keyframes blobMorph {
                    0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
                    33% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
                    66% { border-radius: 50% 50% 30% 70% / 40% 60% 30% 70%; }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                .animate-blob {
                    animation: blobMorph 6s infinite ease-in-out;
                }
                .animate-blink {
                    animation: blink 3.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}