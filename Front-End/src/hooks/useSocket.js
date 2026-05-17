import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../store/slices/notificationSlice";

const SOCKET_URL = "https://zync-production-be45.up.railway.app";

export default function useSocket() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const socketRef = useRef(null);

    useEffect(() => {
        // if no token, don't connect 
        if (!token) return;

        // disconnect previous socket if exists
        if (socketRef.current) {
        socketRef.current.disconnect();
        }

        socketRef.current = io(SOCKET_URL, {
        query: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
        console.log("✅ Socket connected", socket.id);
        });

        socket.on("notification:new", (notification) => {
        console.log("🔔 New notification:", notification);
        dispatch(addNotification(notification));
        });

        
        socket.on("message:new", (data) => {
        console.log("📨 New message:", data);
        
        dispatch(addNotification({
            type: "message",
            isRead: false,
            createdAt: new Date().toISOString(),
        }));
    });

        socket.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
        });
        return () => {
        socket.disconnect();
        };
    }, [token]);

    return socketRef.current;
}