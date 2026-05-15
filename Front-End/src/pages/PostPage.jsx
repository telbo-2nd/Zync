import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/post/PostCard";
import postService from "../services/postService";
import { Loader } from "lucide-react";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
        try {
            const res = await postService.getPost(id);
            setPost(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchPost();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 max-w-2xl mx-auto px-4 py-8">
            {loading ? (
            <div className="flex justify-center py-10">
                <Loader size={28} className="animate-spin text-[#4c3bcf]" />
            </div>
            ) : post ? (
            <PostCard post={post} />
            ) : (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <p className="text-gray-400">Post not found</p>
            </div>
            )}
        </div>
        </div>
    );
}