"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDriftingBottles } from "@/lib/db-queries";
import { sendConnectionRequest } from "@/lib/db-queries";
import { isUserOwner } from "@/lib/utils/authGuard";
import { getCurrentUserId } from "@/lib/auth";

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

  // New state for dynamic greeting and date
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const syncAuth = async () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      const savedUid = await getCurrentUserId();
      if (savedHandle) setUserHandle(savedHandle);
      else setUserHandle(null);
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
    <div className="w-full flex flex-col min-h-screen pb-20 bg-stone-50">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-10 space-y-10">

        {/* --- PREMIUM WELCOME HERO --- */}
        <div className="w-full mb-12">
          {userHandle ? (
            <div className="flex flex-col gap-8">
              <div className="space-y-3">
                <p className="text-sm font-medium text-stone-500 uppercase tracking-widest">
                  {currentDate} • {greeting}
                </p>
                <div className="space-y-1">
                  <h1 className="text-5xl font-serif text-stone-900">
                    Welcome back, <span className="italic text-[#7C3AED]">{userHandle}.</span>
                  </h1>
                </div>
                <p className="text-lg text-stone-600 max-w-lg pt-2">
                  The world is a little kinder because you're in it. Ready to drop something beautiful today?
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/drop"
                  className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-semibold transition-all shadow-lg shadow-violet-200"
                >
                  Drop a Bottle
                </Link>
                <Link
                  href="/globe"
                  className="px-8 py-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-full font-semibold transition-all"
                >
                  Explore Sphere
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h1 className="text-2xl font-serif text-stone-800 mb-2">
                👋 Welcome to KindSphere
              </h1>
              <p className="text-stone-600">
                You’re browsing as a guest.{" "}
                <button
                  onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                  className="underline font-semibold text-stone-800 cursor-pointer"
                >
                  Pick an anonymous handle
                </button>{" "}
                to start dropping messages.
              </p>
            </div>
          )}
        </div>

        {/* --- CATEGORY FILTER BAR --- */}
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
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

          <h3 className="font-serif text-2xl font-medium text-stone-800">
            See Who Needs Kindness
          </h3>

          <Suspense fallback={<div className="h-64 bg-stone-100 rounded-2xl" />}>
            <FeedGrid
              bottles={liveBottles}
              activeFilter={activeFilter}
              currentUserId={currentUserId}
              handleResponseClick={handleResponseClick}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// FeedGrid function remains unchanged as requested
function FeedGrid({
  bottles,
  activeFilter,
  currentUserId,
  handleResponseClick,
}: {
  bottles: any[];
  activeFilter: string;
  currentUserId: string | null;
  handleResponseClick: (e: React.MouseEvent) => void;
}) {
  const visible = useMemo(
    () =>
      activeFilter === "All"
        ? bottles
        : bottles.filter((b) => b.category === activeFilter),
    [activeFilter, bottles]
  );

  if (visible.length === 0) {
    return <div className="text-stone-500 py-10">No requests found in this category.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.map((req) => (
        <div
          key={req.id}
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
                      alert("Connect request sent!");
                    } catch (err) {
                      alert("Could not send request. Please try again.");
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
      ))}
    </div>
  );
}