import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/layout/Avatar";
import userService from "../services/userService";
import { Loader, UserPlus, Check } from "lucide-react";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followingIds, setFollowingIds] = useState([]);

    useEffect(() => {
    fetchFollowing();
    }, []);

    useEffect(() => {
    if (!query.trim()) return;
    fetchResults();
    }, [query]);

    const fetchFollowing = async () => {
    try {
        const me = await userService.getMe();
        const res = await userService.getFollowing(me.user.id);
        setFollowingIds(res.data.map(u => u.id));
    } catch (err) {
        console.error(err);
    }
    };
    const fetchResults = async () => {
        setLoading(true);
        try {
        const res = await userService.searchUsers(query);
        setResults(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
        if (followingIds.includes(userId)) {
            await userService.unfollowUser(userId);
            setFollowingIds(prev => prev.filter(id => id !== userId));
        } else {
            await userService.followUser(userId);
            setFollowingIds(prev => [...prev, userId]);
        }
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 max-w-2xl mx-auto px-4">

            {/* Header */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">
            {query ? `Results for "${query}"` : "Search for people"}
            </h2>

            {/* Results */}
            {loading ? (
            <div className="flex justify-center py-10">
                <Loader size={28} className="animate-spin text-[#4c3bcf]" />
            </div>
            ) : results.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <p className="text-gray-400">
                {query ? `No results found for "${query}"` : "Type something to search"}
                </p>
            </div>
            ) : (
            <div className="space-y-3">
                {results.map((user) => (
                <div
                    key={user.id}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                >
                    <button onClick={() => navigate(`/profile/${user.id}`)}>
                    <Avatar src={user.profilePicture} size={12} />
                    </button>
                    <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    >
                    <p className="font-semibold text-gray-800">
                        {user.firstname} {user.lastname}
                    </p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    {user.bio && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{user.bio}</p>
                    )}
                    </div>
                    <button
                    onClick={() => handleFollow(user.id)}
                    className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                        followingIds.includes(user.id)
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-[#4c3bcf] text-white hover:bg-[#3a2db0]"
                    }`}
                    >
                    {followingIds.includes(user.id) ? (
                        <><Check size={14} /> Following</>
                    ) : (
                        <><UserPlus size={14} /> Follow</>
                    )}
                    </button>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}