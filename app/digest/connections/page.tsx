"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";

interface Message {
    sender: string;
    text: string;
    time: string;
}

interface Chat {
    id: string;
    partner: string;
    topic: string;
    lastMessage: string;
    unread: boolean;
    hasConsent: boolean;
    termsAccepted: boolean;
    messages: Message[];
}

// Your actual dynamic data (in a real app, this comes from an API)
const INITIAL_CHATS: Chat[] = [
    {
        id: "c1",
        partner: "QuietThunder_7",
        topic: "Shared reflections on creative paralysis",
        lastMessage: "...",
        unread: true,
        hasConsent: false,
        termsAccepted: false,
        messages: [{ sender: "them", text: "Hey... I read your bottle.", time: "Yesterday" }],
    }
];

export default function ConnectionsPage() {
    const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");

    // Target specific ID for Consent
    const toggleConsent = (id: string) => {
        setChats(prev => prev.map(chat =>
            chat.id === id ? { ...chat, hasConsent: true } : chat
        ));
    };

    // Target specific ID for Terms
    const handleAcceptTerms = (id: string) => {
        setChats(prev => prev.map(chat =>
            chat.id === id ? { ...chat, termsAccepted: true } : chat
        ));
    };

    // Only updates the message list for the active chat ID
    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId) return;

        setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, { sender: "me", text: newMessage, time: "Just now" }]
                };
            }
            return chat;
        }));
        setNewMessage("");
    }

    const activeChat = chats.find(c => c.id === activeChatId);

    // VIEW 1: Active Chat Panel
    if (activeChat) {
        return (
            <div className="max-w-3xl mx-auto flex flex-col h-[550px] bg-white border border-stone-200 rounded-3xl overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <button onClick={() => setActiveChatId(null)}><ArrowLeft size={20} /></button>
                    <span className="font-bold">@{activeChat.partner}</span>
                </div>

                {/* Dynamic Gate Logic */}
                {!activeChat.hasConsent ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <button onClick={() => toggleConsent(activeChat.id)} className="bg-[#E07A5F] text-white px-6 py-2 rounded-full">
                            Accept Request
                        </button>
                    </div>
                ) : !activeChat.termsAccepted ? (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Terms & Conditions</h2>
                        <p className="mb-6 text-sm">
                            You are about to connect with @{activeChat.partner}. Please respect privacy and do not share personal information.
                            This platform is intended for positive and respectful connections. Harassment, bullying, discrimination, or abusive
                            behavior will not be tolerated.

                            <br /><br />

                            If you feel uncomfortable or unsafe at any time, end the conversation immediately. Any communication outside this
                            platform is solely your responsibility, and the platform or developer cannot be held liable for external interactions.

                            <br /><br />

                            By proceeding, you agree to these terms.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => handleAcceptTerms(activeChat.id)} className="bg-[#81B29A] text-white px-6 py-2 rounded-full">Yes</button>
                            <button onClick={() => setActiveChatId(null)} className="text-stone-400">No</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 overflow-y-auto bg-stone-50">
                            {activeChat.messages.map((m, i) => (
                                <div key={i} className={`p-2 my-2 ${m.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                    <span className="bg-white p-2 rounded-lg border">{m.text}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-lg p-2" />
                            <button type="submit" className="ml-2 bg-[#E07A5F] text-white p-2 rounded-lg"><Send size={16} /></button>
                        </form>
                    </>
                )}
            </div>
        );
    }

    // VIEW 2: Dashboard
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mutual Connections</h1>
            {chats.map(chat => (
                <div key={chat.id} className="p-4 border-b flex justify-between items-center">
                    <div>
                        <p className="font-medium">@{chat.partner}</p>
                        <p className="text-xs text-stone-500">{chat.topic}</p>
                    </div>
                    {/* Dashboard action depends solely on that specific chat's state */}
                    <button
                        onClick={() => setActiveChatId(chat.id)}
                        className="bg-[#81B29A] text-white px-4 py-2 rounded-full text-xs"
                    >
                        {chat.hasConsent && chat.termsAccepted ? "Open Chat" : "View Request"}
                    </button>
                </div>
            ))}
        </div>
    );
}