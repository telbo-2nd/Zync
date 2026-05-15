import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../layout/Avatar";

export default function FollowListModal({ title, list, onClose }) {
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        onClose();
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X size={18} className="text-gray-500" />
            </button>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
            {list?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No {title} yet</p>
            ) : (
                list?.map((user) => (
                <button
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                    <Avatar src={user.profilePicture} size={10} />
                    <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.firstname} {user.lastname}
                    </p>
                    <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                    </div>
                </button>
                ))
            )}
            </div>
        </div>
        </div>
    );
}