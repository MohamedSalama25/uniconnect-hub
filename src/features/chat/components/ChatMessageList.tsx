import { useEffect, useRef } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatMessage } from '@/features/chat/types';

interface ChatMessageListProps {
    messages: ChatMessage[];
    currentUserId: string;
    otherUserId?: string;
}

export const ChatMessageList = ({ messages, currentUserId, otherUserId }: ChatMessageListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
            {messages.map((message) => (
                <ChatBubble 
                    key={message.id} 
                    message={message} 
                    currentUserId={currentUserId} 
                    otherUserId={otherUserId}
                />
            ))}
        </div>
    );
};
