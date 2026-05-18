import { useState, useEffect } from "react";
import { LayoutGrid, List, Image } from "lucide-react";
import PostCard from "../post/PostCard";
import api from "../../services/api";

export default function ProfilePosts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("grid"); // grid | list

    useEffect(() => {
        fetchUserPosts();
    }, [userId]);

    const fetchUserPosts = async () => {
        setLoading(true);
        try {
        const res = await api.get(`/posts/user/${userId}`);
        setPosts(res.data.data || []);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    if (loading) return (
        <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
        ))}
        </div>
    );

    if (posts.length === 0) return (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
        <Image size={40} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No posts yet</p>
        </div>
    );

    return (
        <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Contributions</h2>
            <div className="flex items-center gap-2">
            <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors ${
                view === "grid" ? "bg-[#4c3bcf]/10 text-[#4c3bcf]" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <LayoutGrid size={18} />
            </button>
            <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors ${
                view === "list" ? "bg-[#4c3bcf]/10 text-[#4c3bcf]" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <List size={18} />
            </button>
            </div>
        </div>

        {/* Grid View */}
        {view === "grid" ? (
            <div className="grid grid-cols-3 gap-3">
            {posts.map((post) => (
                <div key={post.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer">
                {post.mediaUrls?.length > 0 ? (
                    post.mediaUrls[0].type === "image" ? (
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${post.mediaUrls[0].url}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt=""
                    />
                    ) : (
                    <video
                        src={`${import.meta.env.VITE_API_URL}/${post.mediaUrls[0].url}`}
                        className="w-full h-full object-cover"
                    />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4c3bcf]/10 to-[#0f9b72]/10 p-3">
                    <p className="text-xs text-gray-600 text-center line-clamp-4">{post.content}</p>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#4c3bcf]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <span className="text-white text-sm font-semibold">❤️ {post.likesCount}</span>
                    <span className="text-white text-sm font-semibold">💬 {post.commentsCount}</span>
                </div>
                </div>
            ))}
            </div>
        ) : (
            // List View
            <div>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>
        )}
        </div>
    );
}
