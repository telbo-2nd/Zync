import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import usePosts from "../../hooks/usePosts";

export default function PostActions({ post, onCommentClick }) {
    const { user } = useSelector((state) => state.auth);
    const { handleToggleLike, deletePost } = usePosts();

    const isOwner = post.User?.id === user?.id;

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
            {/* Like */}
            <button
            onClick={() => handleToggleLike(post.id)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            >
            <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
            <span>{post.likesCount}</span>
            </button>

            {/* Comment */}
            <button
            onClick={onCommentClick}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#4c3bcf] transition-colors"
            >
            <MessageCircle size={18} />
            <span>{post.commentsCount}</span>
            </button>
        </div>

        {/* Delete - only owner */}
        {isOwner && (
            <button
            onClick={() => deletePost(post.id)}
            className="text-gray-300 hover:text-red-400 transition-colors"
            >
            <Trash2 size={16} />
            </button>
        )}
        </div>
    );
}