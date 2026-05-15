import { useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import PostCard from "./PostCard";
import { Loader } from "lucide-react";

export default function PostList() {
    const { posts, loading, error, pagination, fetchFeed } = usePosts();

    useEffect(() => {
        fetchFeed(1);
    }, []);

    if (loading && posts.length === 0) return (
        <div className="flex justify-center py-10">
        <Loader size={28} className="animate-spin text-[#4c3bcf]" />
        </div>
    );

    if (error) return (
        <div className="bg-white rounded-2xl p-6 text-center text-red-400 shadow-sm">
        {error}
        </div>
    );

    if (posts.length === 0) return (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
        <p className="text-gray-400 text-sm">No posts yet. Follow people to see their posts!</p>
        </div>
    );

    return (
        <div>
        {posts.map((post) => (
            <PostCard key={post.id} post={post} />
        ))}

        {/* Load More */}
        {pagination.hasNextPage && (
            <button
            onClick={() => fetchFeed(pagination.page + 1)}
            disabled={loading}
            className="w-full py-3 text-sm text-[#4c3bcf] font-semibold hover:bg-[#4c3bcf]/5 rounded-2xl transition-colors"
            >
            {loading ? (
                <Loader size={18} className="animate-spin mx-auto" />
            ) : (
                "Load More"
            )}
            </button>
        )}
        </div>
    );
}