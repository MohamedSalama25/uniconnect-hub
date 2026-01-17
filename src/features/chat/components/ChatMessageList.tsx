import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatMessage } from '@/features/chat/types';

interface ChatMessageListProps {
    messages: ChatMessage[];
    currentUserId: string;
    otherUserId?: string;
}

export const ChatMessageList = ({ messages, currentUserId, otherUserId }: ChatMessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
