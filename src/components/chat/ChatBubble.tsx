import { cn } from '@/lib/utils';
import { ChatMessage } from '@/features/chat/types';

interface ChatBubbleProps {
  message: ChatMessage;
  currentUserId: string;
  otherUserId?: string; // Add otherUserId to help determine isMe if ID is missing
}

export function ChatBubble({ message, currentUserId, otherUserId }: ChatBubbleProps) {
  // Logic: if we have currentUserId, use it. 
  // If not, assume if it's NOT the other person, it's ME.
  const isMe = currentUserId ? message.senderId === currentUserId : message.senderId !== otherUserId;

  return (
    <div className={cn(
      'flex',
      // In RTL: justify-start is Right, justify-end is Left
      // User wants: Me on Right, Other on Left
      isMe ? 'justify-start' : 'justify-end'
    )}>
      <div className={cn(
        'max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2',
        isMe 
          ? 'bg-primary text-primary-foreground rounded-br-none ml-12' 
          : 'bg-muted text-foreground rounded-bl-none mr-12'
      )}>
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
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

