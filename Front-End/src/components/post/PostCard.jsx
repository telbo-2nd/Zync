import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MoreHorizontal, Globe, Lock, Users } from "lucide-react";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import postService from "../../services/postService";
import { useDispatch } from "react-redux";
import { updatePost } from "../../store/slices/postSlice";
import { getImageUrl } from "../../utils/imageUrl";
import Avatar from "../layout/Avatar";
export default function PostCard({ post }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showComments, setShowComments] = useState(false);

    const privacyIcon = {
        Public: <Globe size={12} />,
        Private: <Lock size={12} />,
        "Friends-only": <Users size={12} />,
    };

    const handleUpdate = async () => {
        try {
        const res = await postService.getPost(post.id);
        dispatch(updatePost(res.data));
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border-l-4 border-[#4c3bcf]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/profile/${post.User?.id}`)}>
                <Avatar src={post.User?.profilePicture} size={10} />
            </button>
            <div>
                <button
                onClick={() => navigate(`/profile/${post.User?.id}`)}
                className="font-semibold text-gray-800 hover:text-[#4c3bcf] transition-colors text-sm"
                >
                {post.User?.firstname} {post.User?.lastname}
                </button>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                    {privacyIcon[post.privacy]}
                    {post.privacy}
                </span>
                </div>
            </div>
            </div>
            <button className="text-gray-300 hover:text-gray-500 transition-colors">
            <MoreHorizontal size={20} />
            </button>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>

        {/* Media */}
        {post.mediaUrls?.length > 0 && (
            <div className={`grid gap-2 mb-3 ${post.mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {post.mediaUrls.map((media, i) => (

                media.type === "image" ? (
                <img 
                    key={i}
                    src={getImageUrl(media.url)}
                    className="w-full rounded-xl object-cover max-h-80" alt="" />
                ) : (
                <video key={i} src={`${import.meta.env.VITE_API_URL}/${media.url}`}
                    className="w-full rounded-xl max-h-80" controls />
                )
            ))}
            </div>
        )}

        {/* Actions */}
        <PostActions
            post={post}
            onCommentClick={() => setShowComments(!showComments)}
        />

        {/* Comments */}
        {showComments && (
            <CommentSection post={post} onUpdate={handleUpdate} />
        )}
        </div>
    );
}