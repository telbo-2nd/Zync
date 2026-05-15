import { useState } from "react";
import { useSelector } from "react-redux";
import { Send, CornerDownRight } from "lucide-react";
import postService from "../../services/postService";
import Avatar from "../layout/Avatar";
export default function CommentSection({ post, onUpdate }) {
    const { user } = useSelector((state) => state.auth);
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setLoading(true);
        try {
        await postService.createComment(post.id, comment);
        setComment("");
        onUpdate();
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleReply = async (commentId) => {
        if (!replyText.trim()) return;
        setLoading(true);
        try {
        await postService.replyComment(post.id, commentId, replyText);
        setReplyTo(null);
        setReplyText("");
        onUpdate();
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    
    return (
        <div className="pt-3">
        {/* Comments List */}
        <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
            {post.Comments?.map((c) => (
            <div key={c.id}>
                {/* Comment */}
                <div className="flex gap-2">
                <Avatar src={c.User?.profilePicture} size={6} />
                <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-gray-800">{c.User?.username}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                    </div>
                    <button
                    onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                    className="text-xs text-gray-400 hover:text-[#4c3bcf] mt-1 ml-2 transition-colors"
                    >
                    Reply
                    </button>
                </div>
                </div>

                {/* Replies */}
                {c.replies?.map((r) => (
                <div key={r.id} className="flex gap-2 ml-8 mt-2">
                    <CornerDownRight size={12} className="text-gray-300 mt-2 flex-shrink-0" />
                    <Avatar src={r.User?.profilePicture} size={6} />
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-gray-800">{r.User?.username}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{r.content}</p>
                    </div>
                </div>
                ))}

                {/* Reply Input */}
                {replyTo === c.id && (
                <div className="flex gap-2 ml-8 mt-2">
                    <Avatar src={user?.profilePicture} size={6} />
                    <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-gray-50 rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#4c3bcf]/20"
                    />
                    <button
                        onClick={() => handleReply(c.id)}
                        disabled={loading}
                        className="text-[#4c3bcf] hover:text-[#3a2db0] transition-colors"
                    >
                        <Send size={14} />
                    </button>
                    </div>
                </div>
                )}
            </div>
            ))}
        </div>

        {/* New Comment Input */}
        <div className="flex gap-2">
            <Avatar src={user?.profilePicture} size={8} />
            <form onSubmit={handleComment} className="flex-1 flex gap-2">
            <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4c3bcf]/20"
            />
            <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="text-[#4c3bcf] hover:text-[#3a2db0] transition-colors disabled:opacity-40"
            >
                <Send size={18} />
            </button>
            </form>
        </div>
        </div>
    );
}