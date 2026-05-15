import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/slices/authSlice";
import { setNotifications } from "../store/slices/notificationSlice";
import userService from "../services/userService";
import notificationService from "../services/notificationService";
import useSocket from "../hooks/useSocket";
import Navbar from "../components/layout/Navbar";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import CreatePost from "../components/post/CreatePost";
import PostList from "../components/post/PostList";
import ChatManager from "../components/chat/ChatManager";

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);

    useSocket();

    useEffect(() => {
        
        if (!token) {
        navigate("/");
        return;
        }

        fetchUserData();
        fetchNotifications();
    }, [token]);

    const fetchUserData = async () => {
        try {
            const res = await userService.getMe();
            dispatch(setUser(res.user));
        
        } catch (err) {
        console.error(err);
        }
    };

    const fetchNotifications = async () => {
        try {
        const res = await notificationService.getNotifications();
        dispatch(setNotifications(res.data));
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-16 flex">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Feed */}
            <main className="flex-1 lg:ml-64 xl:mr-72 max-w-2xl mx-auto px-4 py-6">
            <CreatePost />
            <PostList />
            </main>

            {/* Right Sidebar */}
            <RightSidebar />
        </div>
        <ChatManager />
        </div>
    );
}