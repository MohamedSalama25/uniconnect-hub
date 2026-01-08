import { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { chatConversations, chatMessages } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(chatConversations[0]);
  const [message, setMessage] = useState('');
  const [showConversations, setShowConversations] = useState(true);

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      setMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-180px)] animate-fade-in">
        <div className="bg-card rounded-2xl shadow-card h-full overflow-hidden flex">
          {/* Conversations List */}
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
              {chatConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowConversations(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors',
                    selectedConversation.id === conversation.id && 'bg-secondary'
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  onClick={handleSend}
                  className="btn-hover"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
