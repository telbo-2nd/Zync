import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        totalPages: 1,
        hasNextPage: false,
    },
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
        },
        appendPosts: (state, action) => {
        state.posts = [...state.posts, ...action.payload.data];
        state.pagination = action.payload.pagination;
        },
        addPost: (state, action) => {
        state.posts = [action.payload, ...state.posts];
        },
        updatePost: (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
        },
        removePost: (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        },
        toggleLike: (state, action) => {
        const { postId, liked, likesCount } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
            post.isLiked = liked;
            post.likesCount = likesCount;
        }
        },
        setLoading: (state, action) => {
        state.loading = action.payload;
        },
        setError: (state, action) => {
        state.error = action.payload;
        },
    },
});

export const {
    setPosts, appendPosts, addPost,
    updatePost, removePost, toggleLike,
    setLoading, setError,
} = postSlice.actions;
export default postSlice.reducer;