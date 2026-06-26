"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { acceptConnection } from "@/lib/services/connectionService";
// Add this to your imports in digest/connections/page.tsx
import { sendMessage } from "@/lib/db-queries";

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

    // 1. LOAD DATA FROM SUPABASE
    useEffect(() => {
        async function fetchRequests() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('connections')
                .select(`
                id, 
                status, 
                sender:users!connections_sender_id_fkey(anonymous_handle)
            `)
                .eq('receiver_id', user.id);

            if (data) {
                setChats(data.map(req => {
                    // FIX: Handle 'sender' which might come as an array
                    const senderData = Array.isArray(req.sender) ? req.sender[0] : req.sender;

                    return {
                        id: req.id,
                        partner: senderData?.anonymous_handle || "Anonymous",
                        hasConsent: req.status === 'accepted',
                        termsAccepted: false,
                        messages: []
                    };
                }));
            }
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
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <button onClick={() => handleAcceptRequest(activeChat.id)} className="bg-[#E07A5F] text-white px-6 py-2 rounded-full">
                            Accept Request
                        </button>
                    </div>
                ) : !activeChat.termsAccepted ? (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Terms & Conditions</h2>
                        <p className="mb-6 text-sm">By proceeding, you agree to respect privacy and maintain a kind atmosphere.</p>
                        <button onClick={() => setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, termsAccepted: true } : c))} className="bg-[#81B29A] text-white px-6 py-2 rounded-full">Yes, I agree</button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 bg-[#FAF9F6] overflow-y-auto space-y-4">
                            {activeChat.messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] shadow-sm text-sm leading-relaxed ${
                                        m.sender === 'me' 
                                        ? 'bg-[#E07A5F] text-white rounded-br-md' 
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
                                const senderId = localStorage.getItem("kindsphere_uid");

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
                            <button type="submit" className="ml-2 bg-[#E07A5F] text-white p-2 rounded-lg">
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
                className="inline-flex items-center gap-2 text-white bg-[#E07A5F] hover:bg-[#d66d52] transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm w-max"
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
                                <button onClick={() => setActiveChatId(chat.id)} className="bg-stone-100 text-stone-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-stone-200 transition-colors">
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
                                <button onClick={() => setActiveChatId(chat.id)} className="text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: "#84A98C" }}>
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