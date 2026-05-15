import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Home, MessageCircle, Bell, User, Users } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

export default function LeftSidebar() {
    const navigate = useNavigate();
    const { unreadCount } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);
    if (!user) return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] p-4 hidden lg:block">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
    </aside>
    );

    const menuItems = [
        { icon: Home, label: "Feed", path: "/home" },
        { icon: Users, label: "My Network", path: `/profile/${user?.id}` },
        { icon: MessageCircle, label: "Messages", path: "/messages" },
        { icon: Bell, label: "Alerts", path: null, badge: unreadCount },
    ];

    return (
        <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto hidden lg:block">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
            {user?.profilePicture ? (
                <img src={getImageUrl(user?.profilePicture)}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#4c3bcf]/20"
                alt=""
                />
            ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4c3bcf] to-[#0f9b72] flex items-center justify-center">
                <User size={28} className="text-white" />
                </div>
            )}
            </div>
            <h3 className="font-bold text-gray-800">
            {user?.firstname} {user?.lastname}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">@{user?.username}</p>
            {user?.bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{user.bio}</p>
            )}
            <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center">
                <p className="font-bold text-gray-800">{user?.postsCount || 0}</p>
                <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-[#4c3bcf]">{user?.followersCount || 0}</p>
                <p className="text-xs text-gray-400">Followers</p>
            </div>
            </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl p-2 shadow-sm">
            {menuItems.map(({ icon: Icon, label, path, badge }) => (
            <button
                key={label}
                onClick={() => path && navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === path
                    ? "bg-[#4c3bcf]/10 text-[#4c3bcf] font-semibold"  // ✅ active
                    : "text-gray-600 hover:bg-[#4c3bcf]/5 hover:text-[#4c3bcf]"
                }`}
            >
                <div className="relative">
                <Icon size={20} />
                {badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                    </span>
                )}
                </div>
                <span className="text-sm font-medium">{label}</span>
            </button>
            ))}
        </div>
        </aside>
    );
}