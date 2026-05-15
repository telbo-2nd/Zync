import { useState, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatConversations from "./ChatConversations";
import ChatWindow from "./ChatWindow";
import useConversations from "../../hooks/useConversations";

export default function ChatManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeConv, setActiveConv] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const { conversations: initialConvs, loading, fetchConversations } = useConversations();
    
    // local state 
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        setConversations(initialConvs);
    }, [initialConvs]);

    const handleSelectConv = (conv, other) => {
    console.log("Selected conv:", conv); // ← شوف الـ id
    setActiveConv(conv);
    setOtherUser(other);
    setConversations(prev =>
        prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
    );
    setTimeout(() => fetchConversations(), 1000);
    };

    const handleBack = () => {
        setActiveConv(null);
        setOtherUser(null);
    };

    const handleBubbleClick = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
        setActiveConv(null);
        setOtherUser(null);
        }
    };

    return (
        <>
        <ChatBubble isOpen={isOpen} onClick={handleBubbleClick} />

        {isOpen && !activeConv && (
            <ChatConversations
            conversations={conversations}  
            loading={loading}
            onSelect={handleSelectConv}
            />
        )}

        {isOpen && activeConv && (
            <ChatWindow
            conversation={activeConv}
            otherUser={otherUser}
            onBack={handleBack}
            />
        )}
        </>
    );
}