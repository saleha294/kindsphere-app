"use client";
import { useEffect, useRef, ReactNode, useState } from "react";

/* ─────────────────────────────────────────────
   Subtle scroll-reveal hook
───────────────────────────────────────────── */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("revealed");
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string; }) {
    const ref = useReveal();
    return (
        <div ref={ref} className={`reveal-wrap ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}

export default function DiscoverSection() {
    const [activeCard, setActiveCard] = useState(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number((entry.target as HTMLElement).dataset.index);
                        setActiveCard(index);
                    }
                });
            },
            { threshold: 0.6 }
        );

        cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const cards = [
        { color: "bg-violet-500", icon: "🔒", title: "Anonymous Kindness", desc: "Share kind messages, encouragement, and warmth without revealing who you are. Pure kindness, no strings attached.", bg: "bg-[#F5F3FF]", border: "border-[#E0D7FF]", text: "text-violet-800", iconColor: "text-violet-600" },
        { color: "bg-amber-500", icon: "🏆", title: "Connections and Chatting", desc: "Have meaningful conversations with people from different walks of life, all united by the desire to spread positivity.", bg: "bg-[#faf4e5ff]", border: "border-[#FDEFC8]", text: "text-amber-800", iconColor: "text-amber-600" },
        { color: "bg-rose-500", icon: "💬", title: "Community Stories", desc: "Read uplifting stories from people around the world who chose kindness and changed someone's day forever.", bg: "bg-[#FDF2F4]", border: "border-[#F9E1E5]", text: "text-rose-800", iconColor: "text-rose-500" },
        { color: "bg-indigo-500", icon: "🌐", title: "Positive Impact", desc: "Track how your anonymous kindness ripples outward. See the collective impact of a global community choosing love.", bg: "bg-white", border: "border-slate-100", text: "text-indigo-800", iconColor: "text-indigo-600" },
    ];

    return (
        <section className="homepage-section discover-section w-full pt-20 pb-8 bg-slate-50">
            <Reveal className="w-full max-w-7xl mx-auto px-6">
                <div className="text-left md:text-center mb-8 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">YOUR GUIDE</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-slate-950 leading-[1.1] tracking-tight">
                        Everything you need to<br />
                        <span className="text-violet-600 italic">spread kindness</span>
                    </h2>
                </div>

                <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            data-index={i}
                            className={`flex-none w-[280px] md:w-auto snap-center ${card.bg} ${card.border} border rounded-[2rem] p-8 flex flex-col gap-6 transition-all hover:-translate-y-2 hover:shadow-xl`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${card.iconColor} shadow-sm`}>
                                <span className="text-xl">{card.icon}</span>
                            </div>
                            <div className="space-y-2">
                                <p className={`text-[11px] font-bold uppercase tracking-widest ${card.text}`}>
                                    {i === 0 ? "Private & Safe" : i === 1 ? "Daily Missions" : i === 2 ? "Real Moments" : "Measured Warmth"}
                                </p>
                                <h3 className="font-serif text-2xl text-slate-950">{card.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Dots: Hidden on md (tablet) and larger */}
                <div className="flex md:hidden justify-center items-center gap-2 mt-8">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${i === activeCard
                                ? `w-6 h-2 ${card.color}`
                                : "w-2 h-2 bg-slate-300"
                                }`}
                        />
                    ))}
                </div>
            </Reveal>
        </section>
    );
}