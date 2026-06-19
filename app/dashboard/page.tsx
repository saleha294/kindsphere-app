"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
// --- Importing Image component for asset usage ---
import Image from "next/image";

// --- DUMMY DATA (USING DATE OBJECTS FOR REAL-TIME CALCULATIONS) ---
const ALL_REQUESTS = [
  { id: 1, handle: "DriftingLeaf_92", category: "Career", excerpt: "I've been at my first job for a year and feel completely stuck. My manager is nice but doesn't give me any real responsibility. Should I leave or try to push harder here?", time: new Date(Date.now() - 2 * 3600000), views: 127, responses: 8 },
  { id: 2, handle: "QuietThunder_7", category: "Relationships", excerpt: "My best friend is making choices that are genuinely hurting them, but whenever I bring it up they get defensive. How do you support someone who won't listen?", time: new Date(Date.now() - 4 * 3600000), views: 84, responses: 3 },
  { id: 3, handle: "SilverMoon_44", category: "Creative", excerpt: "I used to paint every day. Now I haven't picked up a brush in 6 months. Every time I try, I feel paralyzed by the blank canvas. How do I break this block?", time: new Date(Date.now() - 6 * 3600000), views: 210, responses: 14 },
  { id: 4, handle: "WanderingStar_12", category: "Health", excerpt: "Trying to rebuild a healthy relationship with food after years of tracking every calorie. The anxiety of not knowing is overwhelming. Does it get easier?", time: new Date(Date.now() - 11 * 3600000), views: 156, responses: 9 },
  { id: 5, handle: "OceanBreeze_88", category: "Career", excerpt: "Just got promoted to manager and I feel like an imposter. My team is older and more experienced than me. How do I earn their respect without being overbearing?", time: new Date(Date.now() - 24 * 3600000), views: 342, responses: 21 },
  { id: 6, handle: "EmberGlow_3", category: "Relationships", excerpt: "I realized I don't actually like my friend group, I'm just afraid of being alone. How do you start over and find your real people in your late 20s?", time: new Date(Date.now() - 30 * 3600000), views: 412, responses: 35 },
] as const;

type Category = "All" | "Career" | "Relationships" | "Creative" | "Health";

const TAG_STYLES: Record<string, string> = {
  Career: "bg-[hsl(14,66%,62%)]/10 text-[hsl(14,66%,62%)] border-[hsl(14,66%,62%)]/20",
  Relationships: "bg-[hsl(150,25%,61%)]/10 text-[hsl(150,25%,61%)] border-[hsl(150,25%,61%)]/20",
  Creative: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Health: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

// --- DYNAMIC LIVE STATS COMPONENT ---
function LiveStats() {
  const [stats, setStats] = useState({ users: 48291, words: 2100000 });
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 3),
        words: prev.words + Math.floor(Math.random() * 5),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-stone-100/80 border-b border-stone-200/60 py-2.5">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 text-xs font-medium text-stone-500">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          Live
        </span>
      </div>
    </div>
  );
}

// --- DYNAMIC TIME COMPONENT ---
function TimeAgo({ date }: { date: Date }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = (Date.now() - date.getTime()) / 60000;
      setDisplay(diff < 60 ? `${Math.floor(diff)}m ago` : `${Math.floor(diff / 60)}h ago`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date]);
  return <span>{display}</span>;
}

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedHandle = localStorage.getItem("kindsphere_handle");
    if (savedHandle) setUserHandle(savedHandle);
    setIsLoaded(true);
    
    const syncHandleState = () => setUserHandle(localStorage.getItem("kindsphere_handle"));
    window.addEventListener("local-handle-updated", syncHandleState);
    return () => window.removeEventListener("local-handle-updated", syncHandleState);
  }, []);

  function handleResponseClick(e: React.MouseEvent) {
    if (!userHandle) {
      e.preventDefault();
      window.dispatchEvent(new Event("open-login-modal"));
    }
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-4rem)] pb-20 overflow-x-hidden bg-stone-50">
      {/* INTEGRATED LIVE STATS */}
      <LiveStats />

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-10">
        {isLoaded && userHandle && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden relative shrink-0">
                <div className="absolute bottom-0 w-9 h-9 bg-white/20 rounded-t-full" />
                <div className="absolute top-2 w-5 h-5 bg-white/20 rounded-full" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">Welcome back, {userHandle} 👋</h2>
                <p className="text-muted-foreground mt-1 text-sm">A quiet day in the sphere. You have matching requests available.</p>
              </div>
            </div>
          </div>
        )}

        {isLoaded && !userHandle && (
          <div className="w-full rounded-2xl px-5 py-4 flex items-center justify-start text-left gap-4" style={{ background: "linear-gradient(135deg, rgba(224,122,95,0.07) 0%, rgba(129,178,154,0.07) 100%)", border: "1px solid rgba(224,122,95,0.15)" }}>
            {/* Integrated Small Character Image */}
            <Image
              src="/assets/imagery/anonymous_handle.png"
              alt="Anonymous Handle Character"
              width={28}
              height={28}
              className="shrink-0 rounded-full"
              style={{ width: "28px", height: "28px" }} // Explicitly setting both via style
            />
            <p className="text-sm text-stone-600 leading-relaxed">You&rsquo;re browsing as a guest. <span className="text-stone-900 font-medium">Pick an anonymous handle</span> to start dropping messages in bottles and reply back.</p>
          </div>
        )}

        {/* Skeleton spacer for stable height during client hydration */}
        {!isLoaded && (
          <div className="w-full h-[76px] rounded-2xl bg-stone-200/30 animate-pulse" />
        )}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
            <h3 className="font-serif text-2xl font-medium text-stone-800">Active Requests Near You</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 sm:pb-0 -mx-1 px-1 mb-4 sm:mb-0">
              {(["All", "Career", "Relationships", "Creative", "Health"] as Category[]).map((tag) => (
                <button key={tag} onClick={() => setActiveFilter(tag)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shrink-0 ${activeFilter === tag ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-stone-100 rounded-2xl" />)}</div>}>
            <FeedGrid activeFilter={activeFilter} handleResponseClick={handleResponseClick} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function FeedGrid({ activeFilter, handleResponseClick }: { activeFilter: Category; handleResponseClick: (e: React.MouseEvent) => void }) {
  const visible = useMemo(() => activeFilter === "All" ? ALL_REQUESTS : ALL_REQUESTS.filter((r) => r.category === activeFilter), [activeFilter]);

  // We use a local state to track connections for this session
  const [connections, setConnections] = useState<Record<number, 'none' | 'pending' | 'accepted'>>({});

  const handleConnect = (e: React.MouseEvent, id: number) => {
    handleResponseClick(e); // Trigger login check
    // If logged in, update status
    setConnections(prev => ({ ...prev, [id]: 'pending' }));
    console.log(`Connection request sent to bottle ${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visible.map((req) => (
        <div key={req.id} className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-sm font-medium text-stone-400 truncate">@{req.handle}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${TAG_STYLES[req.category]}`}>{req.category}</span>
          </div>
          <p className="text-stone-700 leading-relaxed flex-grow line-clamp-3 mb-6 text-[15px]">&ldquo;{req.excerpt}&rdquo;</p>

          <div className="mt-auto pt-4 border-t border-stone-100 space-y-4">
            <div className="text-xs text-stone-400 flex items-center gap-4">
              <TimeAgo date={req.time} />
              <span>{req.views} views &bull; {req.responses} responses</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/dashboard/${req.id}`} onClick={handleResponseClick} className="flex-1 text-center rounded-lg border text-sm font-semibold px-4 py-2 hover:bg-stone-50 transition-all border-stone-200 text-stone-700">
                Reply
              </Link>

              {connections[req.id] === 'pending' ? (
                <button disabled className="flex-1 rounded-lg border text-sm font-semibold px-4 py-2 bg-stone-100 text-stone-400 cursor-not-allowed">
                  Requested
                </button>
              ) : (
                <button onClick={(e) => handleConnect(e, req.id)} className="flex-1 rounded-lg border text-sm font-semibold px-4 py-2 transition-all bg-[#E07A5F] text-white hover:opacity-90">
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}