"use client";

import { useState, useEffect, useMemo, Suspense, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDriftingBottles } from "@/lib/db-queries";
import { sendConnectionRequest } from "@/lib/db-queries";
import { isUserOwner } from "@/lib/utils/authGuard";
import { getCurrentUserId } from "@/lib/auth";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────────
   Subtle scroll-reveal hook
   Animates elements as they enter the viewport
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

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-wrap ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

type Category = "All" | "Career" | "Relationships" | "Creative" | "Health";
const CATEGORIES: Category[] = ["All", "Career", "Relationships", "Creative", "Health"];

const TAG_STYLES: Record<string, string> = {
  Career: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Relationships: "bg-[hsl(150,25%,61%)]/10 text-[hsl(150,25%,61%)] border-[hsl(150,25%,61%)]/20",
  Creative: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Health: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liveBottles, setLiveBottles] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  // New state for dynamic greeting and date
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const syncAuth = async () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      if (savedHandle) setUserHandle(savedHandle);
      else setUserHandle(null);

      const savedUid = await getCurrentUserId();
      setCurrentUserId(savedUid);
    };

    syncAuth();
    window.addEventListener("auth-changed", syncAuth);

    // Dynamic Date/Time Logic
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Good morning ☀️");
    else if (hour < 18) setGreeting("Good afternoon 🌤️");
    else setGreeting("Good evening 🌙");

    setCurrentDate(now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    }));

    getDriftingBottles().then((data: any) => {
      if (data) setLiveBottles(data);
    });

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  const handleResponseClick = (e: React.MouseEvent) => { };

  return (
    <div className="w-full flex flex-col bg-stone-50">
      {/* Scroll Reveal Animation Styles */}
      <style>{`
        .reveal-wrap {
          opacity: 0;
          transform: translate3d(0, 25px, 0);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: opacity, transform;
        }
        .reveal-wrap.revealed {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-wrap {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-20 pt-28 pb-16 space-y-10">

        {/* --- PREMIUM WELCOME HERO --- */}
        <div className="w-full mb-12">
          {userHandle ? (
            <div className="flex flex-col gap-8">
              <div className="space-y-3 enter">
                <p className="text-sm font-medium text-stone-500 uppercase tracking-widest">
                  {currentDate} • {greeting}
                </p>
                <div className="space-y-1">
                  <h1 className="font-serif text-4xl md:text-6xl font-medium text-[#1C2541] leading-[1.1] tracking-tight">
                    Welcome back,<br />
                    <span className="text-[#7C3AED] italic">{userHandle}.</span>
                  </h1>
                </div>
                <p className="text-[18px] text-stone-600 max-w-lg pt-2 leading-relaxed">
                  The world is a little kinder because you're in it. Ready to drop something beautiful today?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 enter enter-d2">
                <Link
                  href="/drop"
                  className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-semibold transition-all shadow-lg shadow-violet-200 text-center"
                >
                  Drop a Bottle
                </Link>
                <Link
                  href="/globe"
                  className="px-8 py-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-full font-semibold transition-all text-center"
                >
                  Explore Sphere
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm p-8 rounded-3xl">
              <h1 className="font-serif text-3xl font-medium text-[#1C2541] mb-2">
                👋 Welcome to KindSphere
              </h1>
              <p className="text-[15px] text-stone-600 leading-relaxed">
                You’re browsing as a guest.{" "}
                <button
                  onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                  className="font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition cursor-pointer"
                >
                  Pick an anonymous handle
                </button>{" "}
                to start dropping messages.
              </p>
            </div>
          )}
        </div>

        {/* --- CATEGORY FILTER BAR --- */}
        <div className="space-y-6 enter enter-d3">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 md:mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilter === cat
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 className="font-serif text-3xl font-medium text-[#1C2541]">
            See Who <span className="text-[#7C3AED] italic">Needs Kindness</span>
          </h3>

          <Suspense fallback={<div className="h-64 bg-stone-100 rounded-2xl" />}>
            <FeedGrid
              bottles={liveBottles}
              activeFilter={activeFilter}
              currentUserId={currentUserId}
              handleResponseClick={handleResponseClick}
              onConnect={(msg) => {
                setNotificationMsg(msg);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 2500);
              }}
            />
          </Suspense>
        </div>
      </div>
      {showNotification && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto bg-[#1C2541] text-white px-6 py-4 rounded-2xl shadow-xl z-50 animate-fade-in flex items-center gap-3">
          <p className="text-sm font-medium">{notificationMsg}</p>
        </div>
      )}
      <Footer />
    </div>
  );
}

// FeedGrid function remains unchanged as requested
function FeedGrid({
  bottles,
  activeFilter,
  currentUserId,
  handleResponseClick,
  onConnect,
}: {
  bottles: any[];
  activeFilter: string;
  currentUserId: string | null;
  handleResponseClick: (e: React.MouseEvent) => void;
  onConnect: (msg: string) => void;
}) {
  const visible = useMemo(
    () =>
      activeFilter === "All"
        ? bottles
        : bottles.filter((b) => b.category === activeFilter),
    [activeFilter, bottles]
  );

  if (visible.length === 0) {
    return <div className="text-[15px] text-stone-500 py-10">No requests found in this category.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.map((req, index) => (
        <Reveal
          key={req.id}
          delay={index * 80}
          className="h-full"
        >
          <div
            className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#C4B5FD] group-hover:via-[#8B5CF6] group-hover:to-[#C4B5FD] transition-colors duration-300" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold tracking-wide text-stone-500 group-hover:text-[#7C3AED] transition-colors">
                @{req.anonymous_handle || "Anonymous"}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full border ${TAG_STYLES[req.category] || "bg-stone-100"}`}
              >
                {req.category}
              </span>
            </div>
            <p className="text-stone-700 text-[15px] leading-7 flex-grow line-clamp-4 mb-6">
              {req.content}
            </p>
            <div className="flex gap-3 pt-4 mt-auto border-t border-stone-100 -mx-6 px-6 pb-1 rounded-b-3xl group-hover:bg-violet-50/30 transition-colors">
              {isUserOwner(req.sender_id, currentUserId) ? (
                <div className="flex-1 text-center text-xs font-semibold text-stone-500 py-2 bg-stone-100 rounded-lg">
                  This is your portal
                </div>
              ) : !currentUserId ? (
                <button
                  onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                  className="flex-1 border border-stone-300 text-stone-600 py-2 rounded-lg text-sm font-semibold hover:border-violet-400 hover:text-violet-600 transition-all"
                >
                  Login to interact
                </button>
              ) : (
                <>
                  <Link
                    href={`/dashboard/${req.id}`}
                    onClick={handleResponseClick}
                    className="flex-1 text-center rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-600 hover:border-[#C4B5FD] hover:text-[#7C3AED] transition-all"
                  >
                    Reply
                  </Link>
                  <button
                    onClick={async () => {
                      const myId = currentUserId;
                      if (!myId) {
                        window.dispatchEvent(new Event("open-login-modal"));
                        return;
                      }
                      try {
                        await sendConnectionRequest(myId, req.sender_id);
                        onConnect("✨ Connection request sent successfully!");
                      } catch (err) {
                        onConnect("Could not send request. Please try again.");
                      }
                    }}
                    className="flex-1 border border-[#7C3AED] text-[#7C3AED] bg-white py-2.5 rounded-xl text-sm font-semibold group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300"
                  >
                    Connect
                  </button>
                </>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}