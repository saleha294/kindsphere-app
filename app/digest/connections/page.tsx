"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { acceptConnection } from "@/lib/services/connectionService";
import { sendMessage, getMessages } from "@/lib/db-queries";
import { getCurrentUserId } from "@/lib/auth";

interface Chat {
    id: string;
    partner: string;
    hasConsent: boolean;
    termsAccepted: boolean;
    messages: { sender: string; text: string }[];
}

export default function ConnectionsPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    // Drives the slide-in animation on chat open
    const [chatVisible, setChatVisible] = useState(false);

    useEffect(() => {
        getCurrentUserId().then(setCurrentUserId);
    }, []);

    const openChat = async (chatId: string) => {
        // Scroll to top before showing chat so header is always first
        window.scrollTo({ top: 0, behavior: "instant" });
        setActiveChatId(chatId);
        setChatVisible(false);
        // Slight delay lets the DOM commit before triggering the slide
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setChatVisible(true));
        });

        const uid = currentUserId ?? await getCurrentUserId();
        if (!uid) return;
        try {
            const dbMessages = await getMessages(chatId);
            setChats(prev => prev.map(c =>
                c.id === chatId
                    ? {
                        ...c,
                        messages: (dbMessages ?? []).map(m => ({
                            sender: m.sender_id === uid ? "me" : "them",
                            text: m.content,
                        })),
                    }
                    : c
            ));
        } catch (err) {
            console.error("[getMessages] failed to load history:", err);
        }
    };

    const closeChat = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setActiveChatId(null);
        setChatVisible(false);
    };

    // ── Load connections from Supabase ────────────────────────────────────
    useEffect(() => {
        async function fetchRequests() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("connections")
                .select("*")
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (error) { console.error(error); return; }

            const ids = [...new Set(data.flatMap(c => [c.sender_id, c.receiver_id]))];
            const { data: users } = await supabase
                .from("users")
                .select("id, anonymous_handle")
                .in("id", ids);
            const userMap = Object.fromEntries(users?.map(u => [u.id, u.anonymous_handle]) ?? []);

            setChats(
                data.map(req => {
                    const partnerId = req.sender_id === user.id ? req.receiver_id : req.sender_id;
                    return {
                        id: req.id,
                        partner: userMap[partnerId] ?? "Anonymous",
                        hasConsent: req.status === "accepted",
                        termsAccepted: false,
                        messages: [],
                    };
                })
            );
        }
        fetchRequests();
    }, []);

    // ── Accept request ────────────────────────────────────────────────────
    const handleAcceptRequest = async (id: string) => {
        const result = await acceptConnection(id);
        if (result.success) {
            setChats(prev => prev.map(chat =>
                chat.id === id ? { ...chat, hasConsent: true } : chat
            ));
        }
    };

    const activeChat = chats.find(c => c.id === activeChatId);

    // ── Chat view ─────────────────────────────────────────────────────────
    if (activeChat) {
        return (
            /* Layout already provides pt-28 — just add bottom padding */
            <div
                className="w-full pb-20"
                style={{
                    transform: chatVisible ? "translateX(0)" : "translateX(40px)",
                    opacity: chatVisible ? 1 : 0,
                    transition: "transform 0.28s cubic-bezier(0.25,1,0.5,1), opacity 0.22s ease",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Conversation panel ─────────────────────────────────── */}
                    <div className="lg:col-span-8">
                        <div className="rounded-[2rem] border border-violet-200/70 bg-[#FAF9F6] p-6 md:p-10 flex flex-col gap-7 shadow-sm">

                            {/* Back + header */}
                            <div className="space-y-3">
                                <button
                                    onClick={closeChat}
                                    className="text-stone-400 hover:text-[#7C3AED] transition-colors flex items-center gap-2 text-sm"
                                >
                                    <ArrowLeft size={15} />
                                    Back to connections
                                </button>
                                <h1 className="font-serif text-3xl md:text-5xl text-stone-900 tracking-tight">
                                    @{activeChat.partner}
                                </h1>
                                {activeChat.hasConsent && (
                                    <div className="flex items-center gap-2 text-emerald-600/80">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-medium uppercase tracking-wider">Connected</span>
                                    </div>
                                )}
                            </div>

                            {!activeChat.hasConsent ? (
                                /* Terms & Safety Agreement */
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <h2 className="font-serif text-3xl text-stone-900">🌿 Before you begin...</h2>
                                        <p className="text-stone-500 text-[15px] leading-relaxed">
                                            You're about to start a private conversation with another KindSphere member.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 space-y-3 text-sm text-stone-600 border border-stone-100">
                                        <p className="font-medium text-stone-800">
                                            KindSphere is built around kindness. Please remember:
                                        </p>
                                        <ul className="space-y-2.5 list-none">
                                            <li>• Be kind and respectful.</li>
                                            <li>• Never share personal or financial information.</li>
                                            <li>• End conversations immediately if you feel uncomfortable.</li>
                                            <li>• Conversations are private and moderated only by kindness.</li>
                                        </ul>
                                    </div>
                                    <label className="flex items-center gap-3 text-sm text-stone-700 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-violet-600 focus:ring-violet-500" />
                                        I understand and agree to chat responsibly.
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={closeChat}
                                            className="px-8 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleAcceptRequest(activeChat.id)}
                                            className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold shadow-md hover:bg-violet-700 hover:shadow-lg transition-all"
                                        >
                                            Accept & Start Chat
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Messages + input */
                                <>
                                    {/* Divider */}
                                    <div className="h-px bg-violet-100" />

                                    {/* Message bubbles */}
                                    <div className="flex flex-col gap-5 min-h-[360px]">
                                        {activeChat.messages.length === 0 && (
                                            <p className="text-stone-400 text-sm italic text-center mt-8">
                                                No messages yet. Say something kind ✨
                                            </p>
                                        )}
                                        {activeChat.messages.map((m, i) => (
                                            <div key={i} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[80%] md:max-w-[72%] px-5 py-4 rounded-[1.5rem] text-[15px] leading-relaxed ${m.sender === "me"
                                                    ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-br-md shadow-sm shadow-violet-200"
                                                    : "bg-white border border-stone-100 text-stone-800 rounded-bl-md shadow-sm"
                                                    }`}>
                                                    {m.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Input — send button contained inside, no overflow */}
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const senderId = await getCurrentUserId();
                                            if (!senderId || !newMessage.trim()) return;
                                            try {
                                                await sendMessage(activeChat.id, senderId, newMessage);
                                                setChats(prev => prev.map(c =>
                                                    c.id === activeChat.id
                                                        ? { ...c, messages: [...c.messages, { sender: "me", text: newMessage }] }
                                                        : c
                                                ));
                                                setNewMessage("");
                                                const dbMessages = await getMessages(activeChat.id);
                                                setChats(prev => prev.map(c =>
                                                    c.id === activeChat.id
                                                        ? { ...c, messages: (dbMessages ?? []).map(m => ({ sender: m.sender_id === senderId ? "me" : "them", text: m.content })) }
                                                        : c
                                                ));
                                            } catch (err) {
                                                console.error("Failed to send:", err);
                                                alert("Could not send message.");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2 bg-white border border-violet-200 rounded-full px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-violet-100 transition-all overflow-hidden">
                                            <input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="flex-1 min-w-0 bg-transparent px-3 py-2.5 outline-none text-stone-700 placeholder:text-stone-400 text-sm"
                                                placeholder="Write something kind..."
                                            />
                                            <button
                                                type="submit"
                                                className="shrink-0 bg-violet-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-violet-700 transition-all"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Reminder card — desktop sidebar, mobile stacked below */}
                    <div className="lg:col-span-4 block">
                        <div className="bg-gradient-to-br from-violet-50/60 to-white p-7 rounded-[2rem] border border-violet-100/50 shadow-sm lg:sticky lg:top-8">
                            <div className="text-2xl mb-4">🌿</div>
                            <h3 className="font-serif text-xl text-stone-900 mb-2">Kind Conversation</h3>
                            <p className="text-sm text-stone-600 mb-5 leading-relaxed">
                                Every conversation on KindSphere begins with kindness.
                            </p>
                            <ul className="space-y-3 text-sm text-stone-700">
                                <li className="flex gap-3"><span>🌿</span> Be respectful and compassionate.</li>
                                <li className="flex gap-3"><span>🔒</span> Never share personal or financial information.</li>
                                <li className="flex gap-3"><span>🚩</span> Leave if anything makes you uncomfortable.</li>
                                <li className="flex gap-3"><span>💜</span> If you continue elsewhere, KindSphere can no longer keep it safe.</li>
                                <li className="flex gap-3"><span>🤝</span> Respect boundaries and consent.</li>
                            </ul>
                            <div className="mt-7 pt-5 border-t border-violet-100/50 text-center">
                                <p className="text-[11px] text-stone-400 uppercase tracking-widest">
                                    Messages are private. Chat responsibly.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // ── List view ─────────────────────────────────────────────────────────
    const activeChats = chats.filter(c => c.hasConsent);
    const pendingChats = chats.filter(c => !c.hasConsent);

    return (
        <div className="w-full pb-20 space-y-8">

            <Link
                href="/digest"
                className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {/* Header card */}
            <div className="relative w-full rounded-[2rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <h1 className="font-serif text-4xl font-medium text-stone-900">
                            Your Mutual Connections
                        </h1>
                        <p className="text-stone-600 text-lg leading-relaxed">
                            Every connection here began with a moment of kindness. Continue the conversation in a safe, private space.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-sm font-semibold shadow-sm hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                    >
                        <Users size={16} />
                        Meet Someone New
                    </Link>
                </div>
            </div>

            {/* Active Connections */}
            <section className="space-y-5">
                <h2 className="font-serif text-2xl text-stone-800">Active Connections</h2>
                {activeChats.length === 0 ? (
                    <p className="text-stone-400 text-sm italic">No active connections yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {activeChats.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white rounded-[2rem] p-6 md:p-5 md:pr-8 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                                    {/* Avatar + text */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center font-serif text-xl shadow-inner bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700">
                                            {chat.partner.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-stone-800 text-lg leading-tight">@{chat.partner}</p>
                                            <p className="text-sm text-stone-500">Your conversation is ready.</p>
                                        </div>
                                    </div>
                                    {/* Button */}
                                    <button
                                        onClick={() => openChat(chat.id)}
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 hover:border-violet-300 hover:text-[#7C3AED] transition-all"
                                    >
                                        Open Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Pending Requests */}
            <section className="space-y-5">
                <h2 className="font-serif text-2xl text-stone-800">Pending Requests</h2>
                {pendingChats.length === 0 ? (
                    <p className="text-stone-400 text-sm italic">No pending requests.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingChats.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                {/* Avatar + name row */}
                                <div className="flex items-center gap-5 mb-5">
                                    <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center font-serif text-xl shadow-inner bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700">
                                        {chat.partner.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-stone-800 text-lg leading-tight">@{chat.partner}</p>
                                        <p className="text-sm text-stone-400">Received recently</p>
                                    </div>
                                </div>

                                <p className="text-stone-500 text-sm leading-relaxed mb-5">
                                    Accept this request to begin a private conversation.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAcceptRequest(chat.id)}
                                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3.5 rounded-full text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Accept
                                    </button>
                                    <button className="px-6 py-3.5 rounded-full border border-stone-200 text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
