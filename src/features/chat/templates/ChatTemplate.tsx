import { useState, useMemo } from 'react';
import { Phone, Video, MoreVertical, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { ChatSidebar, SidebarConversation } from '../components/ChatSidebar';
import { ChatMessageList } from '../components/ChatMessageList';
import { ChatInput } from '../components/ChatInput';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinner';

export const ChatTemplate = () => {
    const { 
        conversations, 
        activeConversation, 
        selectConversation, 
        messages, 
        sendMessage,
        users,
        startChatWithUser,
        isLoading
    } = useChat();

    const [showConversations, setShowConversations] = useState(true);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { fullProfile, user } = useAuthStore();
    
    // Get ID from fullProfile or fallback to localStorage if set there
    // The user's senderId in JSON is a UUID.
    const currentUserId = fullProfile?.id || localStorage.getItem('userId') || localStorage.getItem('id') || ''; 


    const sidebarConversations: SidebarConversation[] = useMemo(() => {
        return conversations.map(c => {
            return {
                id: c.conversationId,
                name: c.otherUserName || 'Unknown User',
                avatar: c.otherUserImageUrl,
                lastMessage: c.lastMessage,
                time: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
                unread: c.unreadCount || 0,
                otherUserId: c.otherUserId,
                isOnline: c.isOnline
            };
        });
    }, [conversations]);

    const activeSidebarConv = sidebarConversations.find(c => c.id === activeConversation?.conversationId);

    const filteredUsers = users.filter(u => 
        (u.firstName?.toLowerCase() + " " + u.lastName?.toLowerCase()).includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserSelect = (userId: string) => {
        startChatWithUser(userId);
        setIsNewChatOpen(false);
        setShowConversations(false);
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-180px)] animate-fade-in relative">
                <div className="bg-card rounded-2xl shadow-card h-full overflow-hidden flex">
                    <ChatSidebar
                        conversations={sidebarConversations}
                        selectedId={activeConversation?.conversationId || 0}
                        onSelect={(conv) => {
                            // Find original conversation object
                            const original = conversations.find(c => c.conversationId === conv.id);
                            if (original) {
                                selectConversation(original);
                                setShowConversations(false);
                            }
                        }}
                        showConversations={showConversations}
                        onNewChat={() => setIsNewChatOpen(true)}
                        isLoading={isLoading}
                    />

                    {/* Chat Area */}
                    <div className={cn(
                        'flex-1 flex flex-col',
                        showConversations && 'hidden md:flex'
                    )}>
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden"
                                            onClick={() => {
                                                setShowConversations(true);
                                                selectConversation(null);
                                            }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                        <Avatar>
                                            <AvatarImage src={activeSidebarConv?.avatar} alt={activeSidebarConv?.name} />
                                            <AvatarFallback>{activeSidebarConv?.name?.charAt(0) || '?'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{activeSidebarConv?.name || '...'}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {/* Online status */}
                                                {activeSidebarConv?.isOnline ? (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                                        متصل الآن
                                                    </span>
                                                ) : "غير متصل"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* <Button variant="ghost" size="icon" className="rounded-xl">
                                            <Phone className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-xl">
                                            <Video className="w-5 h-5" />
                                        </Button> */}
                                        <Button variant="ghost" size="icon" className="rounded-xl">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Spinner size={40} />
                                    </div>
                                ) : (
                                    <ChatMessageList 
                                        messages={messages} 
                                        currentUserId={currentUserId} 
                                        otherUserId={activeConversation.otherUserId}
                                    />
                                )}
                                <ChatInput onSend={sendMessage} />
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                اختر محادثة لبدء المراسلة
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Chat Dialog */}
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>محادثة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="ابحث عن مستخدم..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="h-[300px] overflow-y-auto space-y-2">
                             {filteredUsers.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">لا يوجد مستخدمين</p>
                             )}
                            {filteredUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserSelect(user.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors text-right"
                                >
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};





