import api from "./api";

const conversationService = {

    getConversations: async () => {
        const res = await api.get("/conversations");
        return res.data;
    },

    getOrCreateConversation: async (userId) => {
        const res = await api.post(`/conversations/${userId}`);
        return res.data;
    },

    getMessages: async (conversationId, page = 1) => {
        const res = await api.get(`/conversations/${conversationId}/messages?page=${page}`);
        return res.data;
    },

    sendMessage: async (conversationId, data) => {
        const res = await api.post(`/conversations/${conversationId}/messages`, data);
        return res.data;
    },

    deleteMessage: async (conversationId, messageId) => {
        const res = await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
        return res.data;
    },
};

export default conversationService;