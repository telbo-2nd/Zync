import api from "./api";

const postService = {

    getFeed: async (page = 1, limit = 10) => {
        const res = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
        return res.data;
    },

    getPost: async (postId) => {
        const res = await api.get(`/posts/${postId}`);
        return res.data;
    },

    createPost: async (formData) => {
        const res = await api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    updatePost: async (postId, formData) => {
        const res = await api.put(`/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    deletePost: async (postId) => {
        const res = await api.delete(`/posts/${postId}`);
        return res.data;
    },

    toggleLike: async (postId) => {
        const res = await api.post(`/likes/${postId}/like`);
        return res.data;
    },

    createComment: async (postId, content) => {
        const res = await api.post(`/posts/${postId}/comments/make-comment`, { content });
        return res.data;
    },

    replyComment: async (postId, commentId, content) => {
        const res = await api.post(`/posts/${postId}/comments/${commentId}/reply`, { content });
        return res.data;
    },

    deleteComment: async (postId, commentId) => {
        const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return res.data;
    },
};

export default postService;