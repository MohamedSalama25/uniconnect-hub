import { cn } from '@/lib/utils';
import { ChatMessage } from '@/features/chat/types';

interface ChatBubbleProps {
  message: ChatMessage;
  currentUserId: string;
}

export function ChatBubble({ message, currentUserId }: ChatBubbleProps) {
  const isMe = message.senderId === currentUserId;

  return (
    <div className={cn(
      'flex',
      isMe ? 'justify-start' : 'justify-end'
    )}>
      <div className={cn(
        'max-w-[70%] px-4 py-3 rounded-2xl',
        isMe 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-secondary text-secondary-foreground rounded-tl-sm'
      )}>
        <p className="text-sm">{message.content}</p>
        <p className={cn(
          'text-xs mt-1',
          isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {new Date(message.sentAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

