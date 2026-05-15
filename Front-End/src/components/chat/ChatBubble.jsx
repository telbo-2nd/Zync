import { MessageCircle, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatBubble({ isOpen, onClick }) {
    const { unreadMessagesCount } = useSelector((state) => state.notifications);

    return (
        <div className="fixed bottom-6 right-6 z-50">
        <button
            onClick={onClick}
            className="w-14 h-14 bg-[#4c3bcf] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#3a2db0] transition-all duration-300 hover:scale-110"
        >
            {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>

        {/* Counter */}
        {!isOpen && unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
            {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
            </span>
        )}
        </div>
    );
}