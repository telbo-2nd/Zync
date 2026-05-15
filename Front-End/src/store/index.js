import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        notifications: notificationReducer,
    },
});

export default store;