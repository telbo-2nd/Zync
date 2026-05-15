import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../store/slices/authSlice";
import { markAllAsRead, markAsRead } from "../../store/slices/notificationSlice";
import notificationService from "../../services/notificationService";
import { Bell, MessageCircle, Search, LogOut, User } from "lucide-react";
import Avatar from "./Avatar";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { notifications, unreadCount, unreadMessagesCount } = useSelector((state) => state.notifications);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        dispatch(markAllAsRead());
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
    };
    const handleNotificationClick = async (n) => {
        setShowNotifications(false);

        //  mark as read
        if (!n.isRead) {
            try {
            await notificationService.markAsRead(n.id);
            dispatch(markAsRead(n.id));
            } catch (err) {
            console.error(err);
            }
        }

        //  navigate
        if (n.type === "like" || n.type === "comment") {
            navigate(`/post/${n.postId}`);
        } else if (n.type === "follow") {
            navigate(`/profile/${n.senderId}`);
        } else if (n.type === "message") {
            navigate("/messages");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 flex items-center px-6 gap-4">

        {/* Logo */}
        <div
            onClick={() => navigate("/home")}
            className="cursor-pointer flex items-center gap-2 min-w-fit"
        >
            <span className="text-2xl font-bold text-[#4c3bcf]">Zync</span>
            <span className="hidden md:block text-xs text-gray-400">Sync with your people</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
            <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4c3bcf]/30"
            />
            </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">

            {/* Messages */}
            <button
            onClick={() => navigate("/messages")}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
            <MessageCircle size={22} className="text-gray-600" />
            {/*  unread messages counter */}
            {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                </span>
            )}
            </button>

            {/* Notifications */}
            <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell size={22} className="text-gray-600" />
                {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#4c3bcf] hover:underline"
                    >
                        Mark all as read
                    </button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">No notifications yet</p>
                    ) : (
                    notifications.map((n) => (
                        <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            !n.isRead ? "bg-[#4c3bcf]/5" : ""
                        }`}
                        >
                        <Avatar
                            src={n.sender?.profilePicture}
                            size={6}
                            className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">
                            <span className="font-semibold">{n.sender?.username}</span>
                            {n.type === "like" && " liked your post"}
                            {n.type === "comment" && " commented on your post"}
                            {n.type === "follow" && " started following you"}
                            {n.type === "message" && " sent you a message"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {!n.isRead && (
                            <div className="w-2 h-2 bg-[#4c3bcf] rounded-full flex-shrink-0" />
                        )}
                        </div>
                    ))
                    )}
                </div>
                </div>
            )}
            </div>

            {/* Profile */}
            <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
            >
            <Avatar src={user?.profilePicture} size={6} />
            <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.username}
            </span>
            </button>

            {/* Logout */}
            <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
            >
            <LogOut size={20} />
            </button>
        </div>
        </nav>
    );
}