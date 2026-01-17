import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export interface SidebarConversation {
    id: number;
    name: string;
    avatar?: string;
    lastMessage: string;
    time: string;
    unread: number;
    otherUserId: string; // Keep this for reference
    isOnline?: boolean;
}

interface ChatSidebarProps {
    conversations: SidebarConversation[];
    selectedId: number;
    onSelect: (conversation: SidebarConversation) => void;
    onNewChat?: () => void;
    showConversations: boolean;
    isLoading?: boolean;
}

export const ChatSidebar = ({
    conversations,
    selectedId,
    onSelect,
    onNewChat,
    showConversations,
    isLoading
}: ChatSidebarProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={cn(
            'w-full md:w-80 border-l border-border flex flex-col',
            !showConversations && 'hidden md:flex'
        )}>
            {/* Header / Search */}
            <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-lg">المحادثات</h2>
                    {onNewChat && (
                        <Button variant="ghost" size="icon" onClick={onNewChat} title="محادثة جديدة">
                            <Plus className="w-5 h-5" />
                        </Button>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="ابحث في المحادثات..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {isLoading && conversations.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-8">
                        <Spinner size={32} />
                    </div>
                ) : (
                    <>
                        {filteredConversations.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                {searchTerm ? "لا توجد نتائج" : "لا توجد محادثات"}
                            </div>
                        )}
                        {filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => onSelect(conversation)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-4 bg-primary/10 hover:bg-primary/20 transition-colors rounded-sm my-2 text-right',
                                    selectedId === conversation.id && 'bg-primary/20'
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="w-12 h-12 border-2 border-background">
                                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {/* Online Status Indicator */}
                                    {conversation.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden items-center">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium truncate">{conversation.name}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1 truncate">
                                        {conversation.lastMessage || "..."}
                                    </p>
                                </div>
                                {conversation.unread > 0 && (
                                      <span>
                                          <Badge className=" min-w-[20px] h-5 px-1 flex items-center justify-center text-[10px] bg-primary animate-in zoom-in">
                                            {conversation.unread}
                                        </Badge>
                                      </span>
                                    )}
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

