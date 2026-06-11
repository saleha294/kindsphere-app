"use client";

import { useState, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";
import { Send, MessageCircle, Users } from "lucide-react";

const METRICS = [
  { value: "14", label: "People You Helped", color: "text-secondary" },
  { value: "8", label: "Feedback Received", color: "text-primary" },
  { value: "3", label: "Connections Made", color: "text-foreground" },
] as const;

const SWITCH_CLS =
  "w-9 h-5 rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0 cursor-pointer";
const THUMB_CLS =
  "block w-4 h-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0";

type TabType = "sent" | "awaiting" | "mutual";

export default function DigestPage() {
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("sent");
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(true);

  // Sync state and keep listening for identity storage updates
  useEffect(() => {
    const checkHandle = () => {
      const savedHandle = localStorage.getItem("kindsphere_handle");
      setUserHandle(savedHandle);
    };

    checkHandle();

    // Listen for storage changes so the UI unlocks instantly across tabs
    window.addEventListener("storage", checkHandle);
    window.addEventListener("local-handle-updated", checkHandle);

    return () => {
      window.removeEventListener("storage", checkHandle);
      window.removeEventListener("local-handle-updated", checkHandle);
    };
  }, []);

  function handleTabClick(tab: TabType) {
    if (!userHandle) {
      // Shouts to open the pristine white modal!
      window.dispatchEvent(new Event("open-login-modal"));
      return;
    }
    setActiveTab(tab);
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-x-hidden bg-stone-50">

      {/* Guest Invitation Banner — Only visible if unregistered */}
      {!userHandle && (
        <div className="w-full bg-orange-50/60 border-b border-orange-100 py-3 px-6 text-center animate-fade-in pointer-events-auto">
          <p className="text-sm text-stone-600 font-medium">
            You’re browsing as a guest.{" "}
            <button
              onClick={() => window.dispatchEvent(new Event("open-login-modal"))}
              className="text-[#E07A5F] underline font-semibold hover:opacity-80 transition-all cursor-pointer"
            >
              Pick an anonymous handle
            </button>{" "}
            to start giving feedback.
          </p>
        </div>
      )}

      {/* ── Main Layout Wrapper ── */}
      {/* FIXED LAYER: Changed conditional class rendering logic so the content completely unblurs and layout pointer restrictions lift instantly when userHandle updates */}
      <div className={`w-full py-12 pb-24 px-6 transition-all duration-300 ${!userHandle ? "select-none pointer-events-none blur-[1.5px]" : ""}`}>
        <div className="w-full max-w-6xl mx-auto md:px-12 space-y-10">

          <header className="text-center space-y-3">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground tracking-tight">
              {userHandle ? `@${userHandle}'s Personal Digest` : "Your Personalized Digest"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              A quiet reflection on the empathy and clarity you have distributed into the anonymous sphere.
            </p>
          </header>

          {/* Interactive Nav Tabs */}
          <div className="flex justify-center border-b border-stone-200/80 max-w-md mx-auto pointer-events-auto">
            <nav className="flex gap-6 -mb-px" aria-label="Tabs">
              <button
                onClick={() => handleTabClick("sent")}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === "sent" && userHandle
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                <Send className="h-4 w-4" />
                My Sent Bottles
              </button>
              <button
                onClick={() => handleTabClick("awaiting")}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === "awaiting" && userHandle
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                <MessageCircle className="h-4 w-4" />
                Awaiting My Voice
              </button>
              <button
                onClick={() => handleTabClick("mutual")}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === "mutual" && userHandle
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                <Users className="h-4 w-4" />
                Mutual Connections
              </button>
            </nav>
          </div>

          {/* Tab Contents */}
          <div className="pt-4">
            {activeTab === "sent" && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {METRICS.map(({ value, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-6 text-center border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center">
                      <span className={`font-serif text-5xl leading-none mb-2 ${color}`}>{value}</span>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 opacity-60" style={{ background: "linear-gradient(to right, #81B29A, #E07A5F, #81B29A)" }} />
                  <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground max-w-2xl mx-auto">
                    &ldquo;This month, you reached 14 strangers across 9 countries. Your words were described as <em className="text-secondary not-italic">&lsquo;clarifying&rsquo;</em> and <em className="text-primary not-italic">&lsquo;grounding&rsquo;</em> by multiple members.&rdquo;
                  </p>
                </div>
              </div>
            )}

            {activeTab === "awaiting" && (
              <div className="bg-white rounded-2xl p-12 border border-stone-200/60 shadow-sm text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
                <p className="font-serif text-xl font-medium text-stone-800">Your current echo chamber is peaceful</p>
                <p className="text-sm text-stone-500 max-w-md mx-auto">
                  You have addressed all pending incoming message bottles requests near your locale. Explore the discovery grid to pull down a new conversation.
                </p>
              </div>
            )}

            {activeTab === "mutual" && (
              <section className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <article className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-3 border-b border-stone-100">
                      Feedback Category: <strong className="text-stone-800 font-semibold">Career Growth</strong>
                    </p>
                    <blockquote className="text-base leading-relaxed text-stone-700 italic flex-grow mb-6">
                      &ldquo;It sounds like you&rsquo;re outgrowing the container they built for you. Don&rsquo;t shrink yourself to fit their expectations.&rdquo;
                    </blockquote>
                    <div className="mt-auto bg-stone-50 rounded-xl p-4 border border-stone-100 pointer-events-auto">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-sm text-stone-800">Reveal Identity via Mutual Consent</p>
                          <p className="text-xs text-stone-500 mt-0.5">Both internal authors must check this switch to reveal credentials.</p>
                        </div>
                        <Switch.Root checked={consent1} onCheckedChange={setConsent1} className={SWITCH_CLS}>
                          <Switch.Thumb className={THUMB_CLS} />
                        </Switch.Root>
                      </div>
                      <span className={`inline-flex mt-3 px-2.5 py-1 rounded-md text-xs font-medium ${consent1 ? "bg-orange-50 text-orange-700 border border-orange-100" : "bg-stone-200/60 text-stone-600"}`}>
                        {consent1 ? "Consent Pending..." : "Awaiting your verification choice"}
                      </span>
                    </div>
                  </article>
                </div>
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}