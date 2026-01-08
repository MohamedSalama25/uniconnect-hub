import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/data/mockData';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === 'me';

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
          {message.time}
        </p>
      </div>
    </div>
  );
}
