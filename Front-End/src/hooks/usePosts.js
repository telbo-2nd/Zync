import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import postService from "../services/postService";
import {
    setPosts, appendPosts, addPost,
    removePost, toggleLike as toggleLikeAction,
    setLoading, setError,
} from "../store/slices/postSlice";

export default function usePosts() {
    const dispatch = useDispatch();
    const { posts, loading, error, pagination } = useSelector((state) => state.posts);

    const fetchFeed = async (page = 1) => {
        dispatch(setLoading(true));
        try {
        const res = await postService.getFeed(page);
        if (page === 1) dispatch(setPosts(res));
        else dispatch(appendPosts(res));
        } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to fetch posts"));
        } finally {
        dispatch(setLoading(false));
        }
    };

    const createPost = async (formData) => {
        try {
        const res = await postService.createPost(formData);
        dispatch(addPost(res.data));
        return true;
        } catch (err) {
        throw err;
        }
    };

    const deletePost = async (postId) => {
        try {
        await postService.deletePost(postId);
        dispatch(removePost(postId));
        } catch (err) {
        throw err;
        }
    };

    const handleToggleLike = async (postId) => {
        try {
        const res = await postService.toggleLike(postId);
        dispatch(toggleLikeAction({
            postId,
            liked: res.liked,
            likesCount: res.likesCount,
        }));
        } catch (err) {
        throw err;
        }
    };

    return {
        posts, loading, error, pagination,
        fetchFeed, createPost, deletePost, handleToggleLike,
    };
}