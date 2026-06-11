"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ALL_REQUESTS = [
  {
    id: 1,
    handle: "DriftingLeaf_92",
    category: "Career",
    excerpt: "I've been at my first job for a year and feel completely stuck. My manager is nice but doesn't give me any real responsibility. Should I leave or try to push harder here?",
    time: "2h ago",
    views: 127,
    responses: 8,
  },
  {
    id: 2,
    handle: "QuietThunder_7",
    category: "Relationships",
    excerpt: "My best friend is making choices that are genuinely hurting them, but whenever I bring it up they get defensive. How do you support someone who won't listen?",
    time: "4h ago",
    views: 84,
    responses: 3,
  },
  {
    id: 3,
    handle: "SilverMoon_44",
    category: "Creative",
    excerpt: "I used to paint every day. Now I haven't picked up a brush in 6 months. Every time I try, I feel paralyzed by the blank canvas. How do I break this block?",
    time: "6h ago",
    views: 210,
    responses: 14,
  },
  {
    id: 4,
    handle: "WanderingStar_12",
    category: "Health",
    excerpt: "Trying to rebuild a healthy relationship with food after years of tracking every calorie. The anxiety of not knowing is overwhelming. Does it get easier?",
    time: "11h ago",
    views: 156,
    responses: 9,
  },
  {
    id: 5,
    handle: "OceanBreeze_88",
    category: "Career",
    excerpt: "Just got promoted to manager and I feel like an imposter. My team is older and more experienced than me. How do I earn their respect without being overbearing?",
    time: "Yesterday",
    views: 342,
    responses: 21,
  },
  {
    id: 6,
    handle: "EmberGlow_3",
    category: "Relationships",
    excerpt: "I realized I don't actually like my friend group, I'm just afraid of being alone. How do you start over and find your real people in your late 20s?",
    time: "Yesterday",
    views: 412,
    responses: 35,
  },
] as const;

type Category = "All" | "Career" | "Relationships" | "Creative" | "Health";

const TAG_STYLES: Record<string, string> = {
  Career: "bg-[hsl(14,66%,62%)]/10  text-[hsl(14,66%,62%)]  border-[hsl(14,66%,62%)]/20",
  Relationships: "bg-[hsl(150,25%,61%)]/10 text-[hsl(150,25%,61%)] border-[hsl(150,25%,61%)]/20",
  Creative: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Health: "bg-blue-500/10   text-blue-600   border-blue-500/20",
};

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [userHandle, setUserHandle] = useState<string | null>(null);

  // Read saved handle from localStorage on component mount
  useEffect(() => {
    const savedHandle = localStorage.getItem("kindsphere_handle");
    if (savedHandle) {
      setUserHandle(savedHandle);
    }
  }, []);

  const visible =
    activeFilter === "All"
      ? ALL_REQUESTS
      : ALL_REQUESTS.filter((r) => r.category === activeFilter);

  // If a user clicks 'Give Feedback' while logged out, trigger the Navbar's modal button
  function handleFeedbackClick(e: React.MouseEvent) {
    if (!userHandle) {
      e.preventDefault();
      // Find and click the 'Join KindSphere' button from the Navbar to open the login modal
      const navbarJoinBtn = document.querySelector('button:has-text("Join KindSphere")') as HTMLButtonElement;
      if (navbarJoinBtn) {
        navbarJoinBtn.click();
      } else {
        // Fallback banner trigger if structural text varies
        const backupBtn = document.getElementById("banner-join-trigger");
        if (backupBtn) alert("Please use the 'Join KindSphere' button in the navbar above to claim your handle!");
      }
    }
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-4rem)] pb-20 overflow-x-hidden bg-stone-50">

      {/* Global Metrics Bar */}
      <div className="w-full bg-stone-100/80 border-b border-stone-200/60 py-2.5">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 text-xs font-medium text-stone-500">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            Live
          </span>
          <span>48,291 active users</span>
          <span className="hidden sm:inline text-stone-300" aria-hidden>&bull;</span>
          <span>127 countries</span>
          <span className="hidden sm:inline text-stone-300" aria-hidden>&bull;</span>
          <span>2.1M kind words shared</span>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-10">

        {/* Profile banner — Visible ONLY when logged in */}
        {userHandle && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden relative shrink-0">
                <div className="absolute bottom-0 w-9 h-9 bg-white/20 rounded-t-full" />
                <div className="absolute top-2 w-5 h-5 bg-white/20 rounded-full" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
                  Welcome back, {userHandle} 👋
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  A quiet day in the sphere. You have matching requests available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guest welcome strip — Visible ONLY when logged out */}
        {!userHandle && (
          <div
            className="w-full rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(224,122,95,0.07) 0%, rgba(129,178,154,0.07) 100%)",
              border: "1px solid rgba(224,122,95,0.15)",
            }}
          >
            <p className="text-sm text-stone-600 leading-relaxed">
              You&rsquo;re browsing as a guest.{" "}
              <span className="text-stone-900 font-medium">Pick an anonymous handle</span>{" "}
              to start giving feedback.
            </p>
            <button
              id="banner-join-trigger"
              onClick={() => {
                // Programmatically trigger the navbar's button
                const mainBtn = document.querySelector('header button') as HTMLButtonElement;
                if (mainBtn) mainBtn.click();
              }}
              className="inline-flex items-center justify-center rounded-lg text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 active:scale-95 transition-all shrink-0"
              style={{ background: "#E07A5F" }}
            >
              Join the Sphere
            </button>
          </div>
        )}

        {/* Feed Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-medium text-stone-800">Active Requests Near You</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
              {(["All", "Career", "Relationships", "Creative", "Health"] as Category[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shrink-0 ${activeFilter === tag
                      ? "bg-stone-800 text-white border-stone-800"
                      : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span className="text-sm font-medium text-stone-400 truncate">@{req.handle}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${TAG_STYLES[req.category]}`}>
                    {req.category}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed flex-grow line-clamp-3 mb-6 text-[15px]">
                  &ldquo;{req.excerpt}&rdquo;
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100 gap-3">
                  <div className="text-xs text-stone-400 space-y-0.5 min-w-0">
                    <div>{req.time}</div>
                    <div>{req.views} views &bull; {req.responses} responses</div>
                  </div>
                  <Link
                    href={`/dashboard/${req.id}`}
                    onClick={handleFeedbackClick}
                    className="inline-flex items-center justify-center rounded-lg border text-sm font-semibold px-4 py-2 transition-all shrink-0"
                    style={{ borderColor: "#E07A5F", color: "#E07A5F" }}
                  >
                    Give Feedback
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}