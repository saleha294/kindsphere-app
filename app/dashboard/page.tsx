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

  useEffect(() => {
    // Read initial auth state
    const syncAuth = async () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      const savedUid = await getCurrentUserId();
      if (savedHandle) setUserHandle(savedHandle);
      else setUserHandle(null);
      setCurrentUserId(savedUid);
    };

    syncAuth(); // Read on mount

    // Sync instantly when auth changes (login/logout/register)
    window.addEventListener("auth-changed", syncAuth);

    getDriftingBottles().then((data: any) => {
      if (data) setLiveBottles(data);
    });

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  const handleResponseClick = (e: React.MouseEvent) => {
    // Add your click logic here if needed
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-20 bg-stone-50">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-10 space-y-10">

        {/* --- BIG BOLD WELCOME BANNER --- */}
        <div className="w-full">
          {userHandle ? (
            <h1 className="text-3xl font-serif text-stone-800 font-medium">
              👋 Welcome back, {userHandle}!
            </h1>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
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
            Active Requests
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
          className="
relative
overflow-hidden
rounded-3xl
border
border-violet-100
bg-gradient-to-b
from-violet-50/40
to-white
p-6
shadow-sm
hover:-translate-y-1
hover:shadow-lg
transition-all
duration-300
flex
flex-col
h-full
"
        >

          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#C4B5FD]" />

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold tracking-wide text-[#7C3AED]">
              @{req.anonymous_handle || "Anonymous"}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${TAG_STYLES[req.category] || "bg-stone-100"
                }`}
            >
              {req.category}
            </span>
          </div>

          {/* Content */}
          <p className="text-stone-700 text-[15px] leading-7 flex-grow line-clamp-4 mb-6">
            {req.content}
          </p>

          {/* Action Buttons — Enforce Ownership Logic */}
          <div className="flex gap-3 pt-4 mt-auto border-t border-violet-100 bg-violet-50/40 -mx-6 px-6 pb-1 rounded-b-3xl">

            {isUserOwner(req.sender_id, currentUserId) ? (
              /* STATE 1: Logged in, own bottle */
              <div className="flex-1 text-center text-xs font-semibold text-stone-500 py-2 bg-stone-100 rounded-lg">
                This is your portal
              </div>
            ) : !currentUserId ? (
              /* STATE 2: Not logged in */
              <button
                onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
                className="flex-1 bg-violet-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-violet-600 transition-colors"
              >
                Login to interact
              </button>
            ) : (
              /* STATE 3: Logged in, someone else's bottle */
              <>
                <Link
                  href={`/dashboard/${req.id}`}
                  onClick={handleResponseClick}
                  className="flex-1 text-center rounded-xl border border-[#DDD6FE] bg-white py-2.5 text-sm font-semibold text-[#7C3AED] hover:bg-[#F5F3FF] hover:border-[#C4B5FD] transition-all duration-200"
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
                    console.log("[Connect] myId:", myId, "| receiver:", req.sender_id);
                    try {
                      await sendConnectionRequest(myId, req.sender_id);
                      alert("Connect request sent!");
                    } catch (err) {
                      console.error("[sendConnectionRequest] error:", err);
                      alert("Could not send request. Please try again.");
                    }
                  }}
                  className="flex-1 bg-[#7C3AED] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7C3AED] transition-all duration-200"
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