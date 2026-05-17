import { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { markAsRead } from "../store/slices/notificationSlice";
import notificationService from "../services/notificationService";
import conversationService from "../services/conversationService";

export default function useMessages(conversationId) {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const notifications = useSelector((state) => state.notifications.notifications);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!conversationId) return;
        fetchMessages();
        setupSocket();
        markMessageNotificationsAsRead(); 

        return () => {
        if (socketRef.current) socketRef.current.disconnect();
        };
    }, [conversationId]);

    
    const markMessageNotificationsAsRead = async () => {
        try {
        const unread = notifications.filter(
            (n) => n.type === "message" && !n.isRead
        );
        for (const n of unread) {
            await notificationService.markAsRead(n.id);
            dispatch(markAsRead(n.id));
        }
        } catch (err) {
        console.error(err);
        }
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
        const res = await conversationService.getMessages(conversationId);
        setMessages(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const setupSocket = () => {
        socketRef.current = io("https://zync-production-be45.up.railway.app", {
        query: { token },
        transports: ["websocket"],
        });

        socketRef.current.on("message:new", (data) => {
        if (data.conversationId === conversationId) {
            setMessages((prev) => [...prev, data.message]);
        }
        });
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        setSending(true);
        try {
        const res = await conversationService.sendMessage(conversationId, { text });
        setMessages((prev) => [...prev, res.data]);
        } catch (err) {
        console.error(err);
        } finally {
        setSending(false);
        }
    };

    return { messages, loading, sending, sendMessage };
}