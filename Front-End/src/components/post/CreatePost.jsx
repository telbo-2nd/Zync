import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Image, Video, X, User } from "lucide-react";
import usePosts from "../../hooks/usePosts";
import { getImageUrl } from "../../utils/imageUrl";

export default function CreatePost() {
    const { user } = useSelector((state) => state.auth);
    const { createPost } = usePosts();

    const [content, setContent] = useState("");
    const [privacy, setPrivacy] = useState("Public");
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef();

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
        setPreviews(selected.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith("image/") ? "image" : "video",
        })));
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && files.length === 0) return;
        setError("");
        setLoading(true);
        try {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("privacy", privacy);
        files.forEach((f) => formData.append("media", f));
        await createPost(formData);
        setContent("");
        setFiles([]);
        setPreviews([]);
        } catch (err) {
        console.log("Error details:", err.response); 
        setError(err.response?.data?.message || "Failed to create post");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex gap-3">
            {/* Avatar */}
            {user?.profilePicture ? (
            <img src={getImageUrl(user.profilePicture)} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="" />
            ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4c3bcf] to-[#0f9b72] flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-white" />
            </div>
            )}

            <div className="flex-1">
            <textarea
                placeholder="Share an update or idea..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full resize-none outline-none text-sm text-gray-700 placeholder-gray-400 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-[#4c3bcf]/20"
            />

            {/* Previews */}
            {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((p, i) => (
                    <div key={i} className="relative">
                    {p.type === "image" ? (
                        <img src={p.url} className="w-20 h-20 object-cover rounded-lg" alt="" />
                    ) : (
                        <video src={p.url} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <button
                        onClick={() => removeFile(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        <X size={10} />
                    </button>
                    </div>
                ))}
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            {/* Actions */}
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                {/* Media Upload */}
                <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFiles}
                />
                <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-[#4c3bcf] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#4c3bcf]/5 transition-colors"
                >
                    <Image size={16} />
                    <span className="hidden sm:block">Photo</span>
                </button>
                <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-[#4c3bcf] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#4c3bcf]/5 transition-colors"
                >
                    <Video size={16} />
                    <span className="hidden sm:block">Video</span>
                </button>

                {/* Privacy */}
                <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1.5 outline-none cursor-pointer"
                >
                    <option value="Public">🌍 Public</option>
                    <option value="Friends-only">👥 Friends</option>
                    <option value="Private">🔒 Private</option>
                </select>
                </div>

                <button
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && files.length === 0)}
                className="bg-[#4c3bcf] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#3a2db0] transition-colors disabled:opacity-50"
                >
                {loading ? "Posting..." : "POST"}
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}