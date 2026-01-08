import { ChatBubble } from '@/components/chat/ChatBubble';
import type { chatMessages } from '@/data/mockData';

interface ChatMessageListProps {
    messages: typeof chatMessages;
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
            ))}
        </div>
    );
};
