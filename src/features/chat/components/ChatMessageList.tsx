import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatMessage } from '@/features/chat/types';

interface ChatMessageListProps {
    messages: ChatMessage[];
    currentUserId: string;
}

export const ChatMessageList = ({ messages, currentUserId }: ChatMessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} currentUserId={currentUserId} />
            ))}
        </div>
    );
};
