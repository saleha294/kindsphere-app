"use client";

import { useState } from "react";
import { ShieldAlert, ArrowRight, ArrowLeft, Send } from "lucide-react";

const MOCK_CHATS = [
    {
        id: "c1",
        partner: "QuietThunder_7",
        topic: "Shared reflections on creative paralysis",
        lastMessage: "That approach using small morning exercises worked instantly for me today...",
        unread: true,
        messages: [
            { sender: "them", text: "Hey... I read your bottle about being frozen by the blank canvas. I feel that every single morning.", time: "Yesterday" },
            { sender: "me", text: "It's comforting to know I'm not alone in that. How do you break through the initial paralysis?", time: "Yesterday" },
            { sender: "them", text: "That approach using small morning exercises worked instantly for me today... just scribbling random shapes for 5 minutes without judging it.", time: "2h ago" },
        ]
    },
    {
        id: "c2",
        partner: "SilverMoon_44",
        topic: "Career trajectory transitions",
        lastMessage: "Thank you for holding space for me yesterday, it was a massive relief.",
        unread: false,
        messages: [
            { sender: "them", text: "Your perspective on shifting from structured corporate routines to unstructured creative independence saved my sanity this week.", time: "2 days ago" },
            { sender: "me", text: "I am so incredibly glad it brought some clarity. It's a terrifying leap, but staying stuck is worse.", time: "1 day ago" },
            { sender: "them", text: "Thank you for holding space for me yesterday, it was a massive relief.", time: "5h ago" },
        ]
    }
];

export default function ConnectionsPage() {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [chats, setChats] = useState(MOCK_CHATS);

    const activeChat = chats.find(c => c.id === activeChatId);

    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId) return;

        setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    lastMessage: newMessage,
                    messages: [...chat.messages, { sender: "me", text: newMessage, time: "Just now" }]
                };
            }
            return chat;
        }));
        setNewMessage("");
    }

    // ─── VIEW 1: Active Chat Room Panel ───
    if (activeChat) {
        return (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col h-[550px]">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex items-center gap-4">
                    <button
                        onClick={() => setActiveChatId(null)}
                        className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 transition-colors text-stone-500"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <div className="font-serif font-medium text-stone-800">@{activeChat.partner}</div>
                        <div className="text-[11px] text-[#81B29A] font-semibold uppercase tracking-wider">{activeChat.topic}</div>
                    </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF9F6]/40">
                    {activeChat.messages.map((msg, i) => {
                        const isMe = msg.sender === "me";
                        return (
                            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isMe
                                            ? "text-white bg-[#1C2541] rounded-br-none"
                                            : "text-stone-800 bg-white border border-stone-200/50 rounded-bl-none shadow-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-100 bg-white flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Send an anonymous reflection to @${activeChat.partner}...`}
                        className="flex-1 bg-stone-50 rounded-xl px-4 py-3 text-sm placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-200 focus:bg-white transition-all text-stone-800"
                    />
                    <button
                        type="submit"
                        className="p-3 rounded-xl text-white transition-all active:scale-95 flex items-center justify-center shrink-0"
                        style={{ background: "#E07A5F" }}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        );
    }

    // ─── VIEW 2: Chat List Dashboard ───
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="font-serif text-3xl font-medium text-[#1C2541]">Mutual Connections</h1>
                <p className="text-stone-500 text-sm mt-1">Unlocked dialogue spaces where both thinkers voluntarily agreed to reveal their histories to each other.</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
                <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-start gap-3 text-xs text-amber-800 leading-relaxed">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>These channels are cryptographically bound. If either user decides to break contact or disconnect, the entire dialogue thread is cleanly expunged from both interfaces permanently.</span>
                </div>

                <div className="divide-y divide-stone-100">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors cursor-pointer group"
                        >
                            <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-[#1C2541]">@{chat.partner}</span>
                                    {chat.unread && (
                                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#E07A5F" }} />
                                    )}
                                </div>
                                <div className="text-xs text-[#81B29A] font-semibold tracking-wide uppercase">{chat.topic}</div>
                                <p className="text-sm text-stone-500 truncate max-w-xl">{chat.lastMessage}</p>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "#E07A5F" }}>
                                Enter Room
                                <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}