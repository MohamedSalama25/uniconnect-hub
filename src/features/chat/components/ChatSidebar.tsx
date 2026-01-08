import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { chatConversations } from '@/data/mockData';

interface ChatSidebarProps {
    conversations: typeof chatConversations;
    selectedId: string;
    onSelect: (conversation: typeof chatConversations[0]) => void;
    showConversations: boolean;
}

export const ChatSidebar = ({
    conversations,
    selectedId,
    onSelect,
    showConversations,
}: ChatSidebarProps) => {
    return (
        <div className={cn(
            'w-full md:w-80 border-l border-border flex flex-col',
            !showConversations && 'hidden md:flex'
        )}>
            {/* Search */}
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="ابحث في المحادثات..."
                        className="pr-10"
                    />
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        onClick={() => onSelect(conversation)}
                        className={cn(
                            'w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors',
                            selectedId === conversation.id && 'bg-secondary'
                        )}
                    >
                        <div className="relative">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                                <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conversation.unread > 0 && (
                                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                                    {conversation.unread}
                                </Badge>
                            )}
                        </div>
                        <div className="flex-1 text-right">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{conversation.time}</span>
                                <span className="font-medium">{conversation.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {conversation.lastMessage}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
