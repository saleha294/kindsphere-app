"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
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
        return (
            <div className="max-w-3xl mx-auto flex flex-col h-[550px] bg-white border border-stone-200 rounded-3xl overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <button onClick={() => setActiveChatId(null)}><ArrowLeft size={20} /></button>
                    <span className="font-bold">@{activeChat.partner}</span>
                </div>

                {!activeChat.hasConsent ? (
                    <div className="flex-1 flex items-center justify-center bg-[#FAF9F6] p-8">
                        <div className="max-w-lg w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <h2 className="font-serif text-3xl text-[#1C2541]">
                                    Connect with @{activeChat.partner}
                                </h2>
                                <p className="text-stone-500 leading-relaxed">
                                    You're about to open a private conversation with another KindSphere member.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-[#FAF9F6] border border-stone-100 p-5 space-y-3 text-sm text-stone-600 leading-relaxed">
                                <p>🌿 Be kind and respectful.</p>
                                <p>🔒 Never share phone numbers, addresses, passwords or financial information.</p>
                                <p>💬 Everyone deserves a safe and comfortable conversation.</p>
                                <p>🚪 You can always leave the conversation later if it no longer feels right.</p>
                            </div>
                            <button
                                onClick={() => handleAcceptRequest(activeChat.id)}
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-2xl transition-colors"
                            >
                                Accept Connection
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 bg-[#FAF9F6] overflow-y-auto space-y-4">
                            {activeChat.messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] shadow-sm text-sm leading-relaxed ${
                                        m.sender === 'me' 
                                        ? 'bg-[#7C3AED] text-white rounded-br-md' 
                                        : 'bg-white border border-stone-100 text-stone-800 rounded-bl-md'
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

                                // Safety checks
                                if (!senderId || !newMessage.trim()) return;

                                try {
                                    // 1. Send to Database
                                    await sendMessage(activeChat.id, senderId, newMessage);

                                    // 2. Update local state to show message immediately
                                    setChats(prev => prev.map(c =>
                                        c.id === activeChat.id
                                            ? { ...c, messages: [...c.messages, { sender: 'me', text: newMessage }] }
                                            : c
                                    ));

                                    // 3. Clear the input
                                    setNewMessage("");

                                    // 4. Reload messages from DB to sync with server state
                                    const dbMessages = await getMessages(activeChat.id);
                                    setChats(prev => prev.map(c =>
                                        c.id === activeChat.id
                                            ? {
                                                ...c,
                                                messages: (dbMessages ?? []).map(m => ({
                                                    sender: m.sender_id === senderId ? "me" : "them",
                                                    text: m.content,
                                                })),
                                            }
                                            : c
                                    ));
                                } catch (err) {
                                    console.error("Failed to send:", err);
                                    alert("Could not send message.");
                                }
                            }}
                            className="p-4 border-t flex"
                        >
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border rounded-lg p-2"
                                placeholder="Type a message..."
                            />
                            <button type="submit" className="ml-2 bg-[#7C3AED] text-white p-2 rounded-lg">
                                <Send size={16} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        );
    }

    const activeChats = chats.filter(c => c.hasConsent);
    const pendingChats = chats.filter(c => !c.hasConsent);

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-10">
            {/* Back Button */}
            <Link
                href="/digest"
                className="inline-flex items-center gap-2 text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm w-max"
            >
                <ArrowLeft size={16} />
                Back to Drift
            </Link>

            {/* Header */}
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">
                    Mutual Connections
                </h1>
                <p className="text-stone-500 text-[15px] leading-relaxed max-w-2xl">
                    These are the spaces where you've chosen to connect more deeply.
                </p>
            </div>

            {/* Active Connections */}
            <section className="space-y-4">
                <h2 className="font-serif text-xl text-stone-800 border-b border-stone-100 pb-2">Active Connections</h2>
                {activeChats.length === 0 ? (
                    <p className="text-stone-400 text-sm italic">No active connections yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {activeChats.map(chat => (
                            <div key={chat.id} className="bg-white rounded-[2rem] p-4 pr-6 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex justify-between items-center transition-transform hover:scale-[1.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif text-lg shadow-sm" style={{ backgroundColor: "#A8DADC" }}>
                                        {chat.partner.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-medium text-stone-700">@{chat.partner}</p>
                                </div>
                                <button onClick={() => openChat(chat.id)} className="bg-stone-100 text-stone-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-stone-200 transition-colors">
                                    Open Chat
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Pending Requests */}
            <section className="space-y-4">
                <h2 className="font-serif text-xl text-stone-800 border-b border-stone-100 pb-2">Pending Requests</h2>
                {pendingChats.length === 0 ? (
                    <p className="text-stone-400 text-sm italic">No pending requests.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {pendingChats.map(chat => (
                            <div key={chat.id} className="bg-white rounded-[2rem] p-4 pr-6 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex justify-between items-center transition-transform hover:scale-[1.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif text-lg shadow-sm" style={{ backgroundColor: "#A8DADC" }}>
                                        {chat.partner.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-medium text-stone-700">@{chat.partner}</p>
                                </div>
                                <button onClick={() => openChat(chat.id)} className="text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: "#A78BFA" }}>
                                    View Request
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}