import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
    unreadMessagesCount: 0,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
        state.notifications = action.payload;
        // ✅ فرق بين message notifications وغيرها
        state.unreadCount = action.payload.filter(
            (n) => !n.isRead && n.type !== "message"
        ).length;
        state.unreadMessagesCount = action.payload.filter(
            (n) => !n.isRead && n.type === "message"
        ).length;
        },
        addNotification: (state, action) => {
        console.log("Adding notification:", action.payload);
        state.notifications = [action.payload, ...state.notifications];
        if (action.payload.type === "message") {
            state.unreadMessagesCount += 1; 
        } else {
            state.unreadCount += 1;
        }
    },
        markAsRead: (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            // ✅ فرق بين message وغيرها
            if (notification.type === "message") {
            state.unreadMessagesCount = Math.max(0, state.unreadMessagesCount - 1);
            } else {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        }
        },
        markAllAsRead: (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
        state.unreadMessagesCount = 0;
        },
    },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } =
    notificationSlice.actions;
export default notificationSlice.reducer;