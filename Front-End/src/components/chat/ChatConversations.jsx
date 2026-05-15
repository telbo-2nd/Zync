import { useSelector } from "react-redux";
import { Search, Edit, X } from "lucide-react";
import { useState, useEffect } from "react";
import Avatar from "../layout/Avatar";
import userService from "../../services/userService";
import conversationService from "../../services/conversationService";

export default function ChatConversations({ conversations, loading, onSelect }) {
    const { user } = useSelector((state) => state.auth);
    const [search, setSearch] = useState("");
    const [showNewMsg, setShowNewMsg] = useState(false);
    const [following, setFollowing] = useState([]);
    const [starting, setStarting] = useState(false);

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
    setStarting(true);
    try {
        const res = await conversationService.getOrCreateConversation(otherUser.id);
        
        setShowNewMsg(false);
        setSearch("");
        onSelect(res.data, otherUser); // ✅ بعت res.data
    } catch (err) {
        console.error(err);
    } finally {
        setStarting(false);
    }
    };

    const getOtherUser = (conv) =>
        conv.user1?.id === user?.id ? conv.user2 : conv.user1;

    // فلتر الـ conversations
    const filteredConvs = conversations.filter((conv) => {
        const other = getOtherUser(conv);
        return (
        other?.username?.toLowerCase().includes(search.toLowerCase()) ||
        other?.firstname?.toLowerCase().includes(search.toLowerCase())
        );
    });

    // فلتر الـ following
    const filteredFollowing = following.filter((f) =>
        f.username?.toLowerCase().includes(search.toLowerCase()) ||
        f.firstname?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">
            {showNewMsg ? "New Message" : "Messages"}
            </h3>
            <button
        onClick={() => {
        console.log("Edit clicked, showNewMsg:", showNewMsg);
        setShowNewMsg(!showNewMsg);
        setSearch("");
        }}
        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
    >
        {showNewMsg
        ? <X size={16} className="text-gray-500" />
        : <Edit size={16} className="text-gray-500" />
        }
    </button>
        </div>

        {/* Search - واحدة بس */}
        <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder={showNewMsg ? "Search following..." : "Search conversations..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm outline-none"
            />
            </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
            {showNewMsg ? (
            // Following List
            filteredFollowing.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">No users found</p>
            ) : (
                filteredFollowing.map((f) => (
                <button
                    key={f.id}
                    onClick={() => handleStartConversation(f)}
                    disabled={starting}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                    <Avatar src={f.profilePicture} size={10} />
                    <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                        {f.firstname} {f.lastname}
                    </p>
                    <p className="text-xs text-gray-400 truncate">@{f.username}</p>
                    </div>
                </button>
                ))
            )
            ) : (
            // Conversations List
            loading ? (
                <div className="space-y-3 p-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                    </div>
                ))}
                </div>
            ) : filteredConvs.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">No conversations yet</p>
            ) : (
                filteredConvs.map((conv) => {
                const other = getOtherUser(conv);
                const lastMsg = conv.Messages?.[0];
                return (
                    <button
                    key={conv.id}
                    onClick={() => onSelect(conv, other)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                    <Avatar src={other?.profilePicture} size={10} />
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {other?.firstname} {other?.lastname}
                        </p>
                        {conv.unreadCount > 0 && (
                            <span className="bg-[#4c3bcf] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ml-2">
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
            )
            )}
        </div>
        </div>
    );
}