import { useState, useMemo, useEffect } from 'react';
import { Phone, Video, MoreVertical, ArrowRight, X, Trash2 } from 'lucide-react';
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
import { useSearchParams } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Spinner } from '@/components/ui/spinner';

export const ChatTemplate = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const {
        conversations,
        activeConversation,
        selectConversation,
        messages,
        sendMessage,
        users,
        startChatWithUser,
        deleteConversation,
        isLoading
    } = useChat();

    const [showConversations, setShowConversations] = useState(true);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [convToDelete, setConvToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (userId && users.length > 0 && !activeConversation) {
            startChatWithUser(userId);
            setShowConversations(false);
        }
    }, [userId, users, conversations, activeConversation, startChatWithUser]);

    const { fullProfile } = useAuthStore();

    // Get ID from fullProfile or fallback to localStorage if set there
    const currentUserId = fullProfile?.id || localStorage.getItem('userId') || localStorage.getItem('id') || '';

    const sidebarConversations: SidebarConversation[] = useMemo(() => {
        return conversations.map(c => {
            return {
                id: c.conversationId,
                name: c.otherUserName || 'Unknown User',
                avatar: c.otherUserImageUrl,
                lastMessage: c.lastMessage,
                time: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                unread: c.unreadCount || 0,
                otherUserId: c.otherUserId,
                isOnline: c.isOnline
            };
        });
    }, [conversations]);

    const activeSidebarConv = sidebarConversations.find(c => c.id === activeConversation?.conversationId);

    const handleDeleteClick = (id: number) => {
        setConvToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (convToDelete) {
            await deleteConversation(convToDelete);
            setIsDeleteConfirmOpen(false);
            setConvToDelete(null);
            if (activeConversation?.conversationId === convToDelete) {
                setShowConversations(true);
            }
        }
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
                        onDelete={handleDeleteClick}
                        showConversations={showConversations}
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-destructive gap-2 text-right flex-row-reverse"
                                                    onClick={() => handleDeleteClick(activeConversation.conversationId)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>حذف المحادثة</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-right">حذف المحادثة</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-right">
                        هل أنت متأكد من رغبتك في حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
                            إلغاء
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            حذف الآن
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};
