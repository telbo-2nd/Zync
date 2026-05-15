import { useState } from "react";
import { useSelector } from "react-redux";
import { Search, MessageCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/layout/Avatar";
import ChatWindow from "../components/chat/ChatWindow";
import useConversations from "../hooks/useConversations";
import {useEffect, useRef } from "react";
import { Loader, Send } from "lucide-react";
import useMessages from "../hooks/useMessages";
import { jwtDecode } from "jwt-decode";


export default function MessagesPage() {
    const { user } = useSelector((state) => state.auth);
    const { conversations: initialConvs, loading} = useConversations();
    const [activeConv, setActiveConv] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [search, setSearch] = useState("");
    const [conversations, setConversations] = useState([]);
    const [showNewMsg, setShowNewMsg] = useState(false);
    const [following, setFollowing] = useState([]);
    const [followingSearch, setFollowingSearch] = useState("");
    const token = useSelector((state) => state.auth.token);
    const myId = user?.id || (token ? jwtDecode(token).id : null);

    useEffect(() => {
    if (showNewMsg) fetchFollowing();
    }, [showNewMsg]);

    const fetchFollowing = async () => {
    try {
        const res = await userService.getFollowing(user?.id);
        setFollowing(res.data);
    } catch (err) {
        console.error(err);
    }
    };

    const handleStartConversation = async (otherUser) => {
    try {
        const res = await conversationService.getOrCreateConversation(otherUser.id);
        setActiveConv(res);
        setOtherUser(otherUser);
        setShowNewMsg(false);
    } catch (err) {
        console.error(err);
    }
    };
    useEffect(() => {
    setConversations(initialConvs);
    }, [initialConvs]);


    const getOtherUser = (conv) =>
        conv.user1?.id === myId ? conv.user2 : conv.user1;

    const filtered = conversations.filter((conv) => {
        const other = getOtherUser(conv);
        return (
        other?.username?.toLowerCase().includes(search.toLowerCase()) ||
        other?.firstname?.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 max-w-5xl mx-auto px-4 py-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex h-[calc(100vh-8rem)]">

            {/* Left - Conversations List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg mb-3">Messages</h2>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm outline-none"
                    />
                </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="space-y-3 p-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-100" />
                        <div className="flex-1 space-y-1">
                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                        </div>
                        </div>
                    ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">No conversations yet</p>
                ) : (
                    filtered.map((conv) => {
                    const other = getOtherUser(conv);
                    const lastMsg = conv.Messages?.[0];
                    const isActive = activeConv?.id === conv.id;
                    return (
                        <button
                        key={conv.id}
                        onClick={() => { setActiveConv(conv); setOtherUser(other);setConversations(prev =>prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                            isActive ? "bg-[#4c3bcf]/5 border-r-2 border-[#4c3bcf]" : "hover:bg-gray-50"
                        }`}
                        >
                        <Avatar src={other?.profilePicture} size={12} />
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {other?.firstname} {other?.lastname}
                            </p>
                            {/* ✅ Counter */}
                            {conv.unreadCount > 0 && !isActive && (
                                <span className="bg-[#4c3bcf] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0 ml-2">
                                {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                </span>
                            )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                            {lastMsg?.text || "Start a conversation"}
                            </p>
                        </div>
                        </button>
                    );
                    })
                )}
                </div>
            </div>

            {/* Right - Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeConv ? (
                <FullChatWindow conversation={activeConv} otherUser={otherUser} />
                ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <MessageCircle size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400">Select a conversation</h3>
                    <p className="text-sm text-gray-300 mt-1">Choose from your existing conversations</p>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    }

    // Full chat window للـ Messages Page
    function FullChatWindow({ conversation, otherUser }) {
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
        <>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <Avatar src={otherUser?.profilePicture} size={10} />
            <div>
            <p className="font-semibold text-gray-800">
                {otherUser?.firstname} {otherUser?.lastname}
            </p>
            <p className="text-xs text-gray-400">@{otherUser?.username}</p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {loading ? (
            <div className="flex justify-center py-4">
                <Loader size={24} className="animate-spin text-[#4c3bcf]" />
            </div>
            ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
                Start a conversation with {otherUser?.firstname}!
            </p>
            ) : (
            messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[60%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                        ? "bg-[#4c3bcf] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}>
                    {msg.text}
                    <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-gray-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    </div>
                </div>
                );
            })
            )}
            <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
            <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4c3bcf]/20"
            />
            <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-10 h-10 bg-[#4c3bcf] text-white rounded-full flex items-center justify-center hover:bg-[#3a2db0] transition-colors disabled:opacity-50"
            >
            {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
        </form>
        </>
    );
}