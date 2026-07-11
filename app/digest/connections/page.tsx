"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { acceptConnection } from "@/lib/services/connectionService";
// Add this to your imports in digest/connections/page.tsx
import { sendMessage, getMessages } from "@/lib/db-queries";
import { getCurrentUserId } from "@/lib/auth";

interface Chat {
    id: string;
    partner: string;
    hasConsent: boolean; // This will map to 'accepted' status
    termsAccepted: boolean; // Local UI gate
    messages: { sender: string; text: string }[];
}

export default function ConnectionsPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUserId().then(setCurrentUserId);
    }, []);

    const openChat = async (chatId: string) => {
        setActiveChatId(chatId);
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

    // 1. LOAD DATA FROM SUPABASE
    useEffect(() => {
        async function fetchRequests() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("connections")
                .select("*")
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (error) {
                console.error(error);
                return;
            }
            const ids = [
                ...new Set(
                    data.flatMap(c => [c.sender_id, c.receiver_id])
                ),
            ];
            const { data: users } = await supabase
                .from("users")
                .select("id, anonymous_handle")
                .in("id", ids);
            const userMap = Object.fromEntries(
                users?.map(u => [u.id, u.anonymous_handle]) ?? []
            );

            setChats(
                data.map(req => {
                    const partnerId =
                        req.sender_id === user.id
                            ? req.receiver_id
                            : req.sender_id;

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

    // 2. ACCEPT REQUEST (DATABASE UPDATE)
    const handleAcceptRequest = async (id: string) => {
        const result = await acceptConnection(id);
        if (result.success) {
            setChats(prev => prev.map(chat =>
                chat.id === id ? { ...chat, hasConsent: true } : chat
            ));
        }
    };

    const activeChat = chats.find(c => c.id === activeChatId);

    // --- RENDER LOGIC ---
    if (activeChat) {
        // --- RENDER LOGIC ---
        if (activeChat) {
            return (
                <div className="max-w-7xl mx-auto px-6 mt-16 animate-fade-in">

                    {/* Minimal Header */}
                    <div className="mb-12">
                        <button
                            onClick={() => setActiveChatId(null)}
                            className="mb-4 text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-2"
                        >
                            ← Back
                        </button>
                        <h1 className="font-serif text-5xl text-stone-900 tracking-tight">@{activeChat.partner}</h1>
                        {activeChat.hasConsent && (
                            <div className="flex items-center gap-2 mt-3 text-emerald-600/80">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium uppercase tracking-wider">Connected</span>
                            </div>
                        )}
                    </div>

                    {!activeChat.hasConsent ? (
                        /* Terms & Safety Agreement Screen */
                        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm space-y-8">
                            <div className="space-y-3">
                                <h2 className="font-serif text-3xl text-stone-900">🌿 Before you begin...</h2>
                                <p className="text-stone-500">You're about to start a private conversation with another KindSphere member.</p>
                            </div>

                            <div className="bg-[#FAF9F6] rounded-2xl p-6 space-y-4 text-sm text-stone-600">
                                <p className="font-medium text-stone-800">KindSphere is built around kindness and meaningful conversations. Please remember:</p>
                                <ul className="space-y-3 list-none">
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
                                    onClick={() => setActiveChatId(null)}
                                    className="px-8 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAcceptRequest(activeChat.id)}
                                    className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold shadow-md hover:scale-102 hover:shadow-lg transition-all"
                                >
                                    Accept & Start Chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Main Chat Layout */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                            {/* LEFT SIDE: Chat (70%) */}
                            <div className="lg:col-span-8 flex flex-col min-h-[500px]">
                                <div className="flex-1 space-y-8 pb-10">
                                    {activeChat.messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] px-6 py-4 rounded-[2rem] shadow-sm text-sm leading-relaxed ${m.sender === 'me'
                                                ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-br-none shadow-violet-200'
                                                : 'bg-white border border-stone-100 text-stone-800 rounded-bl-none'
                                                }`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const senderId = await getCurrentUserId();
                                        if (!senderId || !newMessage.trim()) return;
                                        try {
                                            await sendMessage(activeChat.id, senderId, newMessage);
                                            setChats(prev => prev.map(c =>
                                                c.id === activeChat.id
                                                    ? { ...c, messages: [...c.messages, { sender: 'me', text: newMessage }] }
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
                                    className="sticky bottom-6"
                                >
                                    <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-full p-2 shadow-lg focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                                        <input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 bg-transparent px-4 py-3 outline-none text-stone-700 placeholder:text-stone-400"
                                            placeholder="Write something kind..."
                                        />
                                        <button type="submit" className="bg-violet-600 text-white p-3 rounded-full hover:scale-105 hover:shadow-md transition-all">
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* RIGHT SIDE: Reminder Card (30%) */}
                            <div className="lg:col-span-4 lg:-mt-28">
                                <div className="bg-gradient-to-br from-violet-50/50 to-white p-8 rounded-[2rem] border border-violet-100/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                                    <div className="text-2xl mb-4">🌿</div>
                                    <h3 className="font-serif text-xl text-stone-900 mb-2">Kind Conversation</h3>
                                    <p className="text-sm text-stone-600 mb-6 leading-relaxed">Every conversation on KindSphere begins with kindness.</p>

                                    <ul className="space-y-4 text-sm text-stone-700">
                                        <li className="flex gap-3"><span>🌿</span> Be respectful and compassionate.</li>
                                        <li className="flex gap-3"><span>🔒</span> Never share personal, financial or sensitive information.</li>
                                        <li className="flex gap-3"><span>🚩</span> Leave the conversation if anything makes you uncomfortable.</li>
                                        <li className="flex gap-3"><span>💜</span> If you continue on another platform, KindSphere can no longer help keep it safe.</li>
                                        <li className="flex gap-3"><span>🤝</span> Respect boundaries and consent.</li>
                                    </ul>

                                    <div className="mt-8 pt-6 border-t border-violet-100/50 text-center">
                                        <p className="text-[11px] text-stone-400 uppercase tracking-widest">Messages are private. Please chat responsibly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }

    const activeChats = chats.filter(c => c.hasConsent);
    const pendingChats = chats.filter(c => !c.hasConsent);

    return (
        <div className="w-full min-h-screen pb-20 bg-stone-50">
            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-10 space-y-8">

                <Link
                    href="/digest"
                    className="inline-flex items-center gap-1.5 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors w-max"
                >
                    <ArrowLeft size={16} />
                    Back to Drift
                </Link>
                {/* --- Header --- */}
                <div className="relative w-full rounded-[2rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm animate-fade-in">

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        {/* Left */}
                        <div className="space-y-3 max-w-2xl">
                            <h1 className="font-serif text-4xl font-medium text-stone-900">
                                Mutual Connections
                            </h1>

                            <p className="text-stone-600 text-lg leading-relaxed">
                                Every connection here began with a moment of kindness. Continue the conversation in a safe, private space.
                            </p>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/shore"
                            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-sm font-semibold shadow-sm hover:bg-[#6D28D9] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                        >
                            <Users size={16} />
                            Meet Someone New
                        </Link>

                    </div>

                </div>

                {/* --- Active Connections --- */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl text-stone-800">Active Connections</h2>
                    {activeChats.length === 0 ? (
                        <p className="text-stone-400 text-sm italic">No active connections yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {activeChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="bg-white rounded-[2rem] p-5 pr-8 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-lg flex justify-between items-center group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-serif text-lg shadow-inner bg-gradient-to-br from-teal-100 to-teal-200">
                                            {chat.partner.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 text-lg">@{chat.partner}</p>
                                            <p className="text-sm text-stone-500">Your conversation is ready.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => openChat(chat.id)}
                                            className="px-6 py-2.5 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 hover:border-stone-300 transition-all"
                                        >
                                            Open Chat
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* --- Pending Requests --- */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl text-stone-800">Pending Requests</h2>
                    {pendingChats.length === 0 ? (
                        <p className="text-stone-400 text-sm italic">No pending requests.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-serif text-lg shadow-inner bg-gradient-to-br from-amber-100 to-amber-200">
                                            {chat.partner.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 text-lg">@{chat.partner}</p>
                                            <p className="text-sm text-stone-400">Received recently</p>
                                        </div>
                                    </div>

                                    <p className="text-stone-600 text-sm italic">Accept this request to begin a private conversation.</p>

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => handleAcceptRequest(chat.id)}
                                            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-full text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-95"
                                        >
                                            Accept
                                        </button>
                                        <button className="px-6 py-3 rounded-full border border-stone-200 text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}