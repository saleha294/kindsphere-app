"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/lib/utils/supabase";
import { acceptConnection } from "@/lib/services/connectionService";

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

            // Fetch only connections where the current user is the receiver
            const { data, error } = await supabase
                .from('connections')
                .select('*')
                .eq('receiver_id', user.id);

            if (data) {
                setChats(data.map(req => ({
                    id: req.id,
                    partner: req.sender_id,
                    hasConsent: req.status === 'accepted',
                    termsAccepted: false,
                    messages: []
                })));
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
                        <div className="flex-1 p-6 bg-stone-50 overflow-y-auto">
                            {activeChat.messages.map((m, i) => (
                                <div key={i} className={`p-2 ${m.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                    <span className="bg-white p-2 rounded-lg border">{m.text}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); /* Add your message insert logic here */ }} className="p-4 border-t flex">
                            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-lg p-2" />
                            <button type="submit" className="ml-2 bg-[#E07A5F] text-white p-2 rounded-lg"><Send size={16} /></button>
                        </form>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mutual Connections</h1>
            {chats.map(chat => (
                <div key={chat.id} className="p-4 border-b flex justify-between items-center">
                    <p className="font-medium">@{chat.partner}</p>
                    <button onClick={() => setActiveChatId(chat.id)} className="bg-[#81B29A] text-white px-4 py-2 rounded-full text-xs">
                        {chat.hasConsent && chat.termsAccepted ? "Open Chat" : "View Request"}
                    </button>
                </div>
            ))}
        </div>
    );
}