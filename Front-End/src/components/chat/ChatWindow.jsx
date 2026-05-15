import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ArrowLeft, Send, Loader } from "lucide-react";
import { useState } from "react";
import Avatar from "../layout/Avatar";
import useMessages from "../../hooks/useMessages";

export default function ChatWindow({ conversation, otherUser, onBack }) {
    const { user } = useSelector((state) => state.auth);
    const { messages, loading, sending, sendMessage } = useMessages(conversation?.id);
    const [text, setText] = useState("");
    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await sendMessage(text);
        setText("");
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-96">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
            <ArrowLeft size={16} className="text-gray-500" />
            </button>
            <Avatar src={otherUser?.profilePicture} size={8} />
            <div>
            <p className="text-sm font-semibold text-gray-800">
                {otherUser?.firstname} {otherUser?.lastname}
            </p>
            <p className="text-xs text-gray-400">@{otherUser?.username}</p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {loading ? (
            <div className="flex justify-center py-4">
                <Loader size={20} className="animate-spin text-[#4c3bcf]" />
            </div>
            ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 text-xs py-4">
                Start a conversation with {otherUser?.firstname}!
            </p>
            ) : (
            messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                        isMe
                        ? "bg-[#4c3bcf] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                    >
                    {msg.text}
                    </div>
                </div>
                );
            })
            )}
            <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 flex-shrink-0"
        >
            <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4c3bcf]/20"
            />
            <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-8 h-8 bg-[#4c3bcf] text-white rounded-full flex items-center justify-center hover:bg-[#3a2db0] transition-colors disabled:opacity-50"
            >
            {sending ? (
                <Loader size={14} className="animate-spin" />
            ) : (
                <Send size={14} />
            )}
            </button>
        </form>
        </div>
    );
}