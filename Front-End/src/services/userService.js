import api from "./api";

const userService = {

    getMe: async () => {
        const res = await api.get("/auth/me");
        return res.data;
    },

    getUserProfile: async (userId) => {
        const res = await api.get(`/users/${userId}/profile`);
        return res.data;
    },

    updateProfile: async (data) => {
        const res = await api.put("/users/profile", data);
        return res.data;
    },

    getFollowers: async (userId) => {
    const res = await api.get(`/users/${userId}/followers`);
    return res.data;
},

getFollowing: async (userId) => {
    const res = await api.get(`/users/${userId}/following`);
    return res.data;
},


    followUser: async (userId) => {
        const res = await api.post(`/users/${userId}/follow`);
        return res.data;
    },

    unfollowUser: async (userId) => {
        const res = await api.delete(`/users/${userId}/unfollow`);
        return res.data;
    },

    searchUsers: async (query) => {
        const res = await api.get(`/users/search?q=${query}`);
        return res.data;
    },
};

export default userService;