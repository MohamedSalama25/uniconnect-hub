import { useState } from 'react';
import { Phone, Video, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { chatConversations, chatMessages } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatMessageList } from '../components/ChatMessageList';
import { ChatInput } from '../components/ChatInput';

export const ChatTemplate = () => {
    const [selectedConversation, setSelectedConversation] = useState(chatConversations[0]);
    const [showConversations, setShowConversations] = useState(true);

    const handleSend = (message: string) => {
        console.log('Sending message:', message);
        // Mock send logic
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-180px)] animate-fade-in">
                <div className="bg-card rounded-2xl shadow-card h-full overflow-hidden flex">
                    <ChatSidebar
                        conversations={chatConversations}
                        selectedId={selectedConversation.id}
                        onSelect={(conv) => {
                            setSelectedConversation(conv);
                            setShowConversations(false);
                        }}
                        showConversations={showConversations}
                    />

                    {/* Chat Area */}
                    <div className={cn(
                        'flex-1 flex flex-col',
                        showConversations && 'hidden md:flex'
                    )}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setShowConversations(true)}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Avatar>
                                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                                    <p className="text-xs text-muted-foreground">متصل الآن</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <Video className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <ChatMessageList messages={chatMessages} />
                        <ChatInput onSend={handleSend} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
