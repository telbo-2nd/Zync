import { useState, useEffect } from "react";
import conversationService from "../services/conversationService";

export default function useConversations() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        setLoading(true);
        try {
        const res = await conversationService.getConversations();
        setConversations(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const getOrCreateConversation = async (userId) => {
        try {
        const res = await conversationService.getOrCreateConversation(userId);
        await fetchConversations();
        return res.data;
        } catch (err) {
        console.error(err);
        }
    };

    return { conversations, loading, fetchConversations, getOrCreateConversation };
}