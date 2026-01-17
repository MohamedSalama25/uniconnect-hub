import { useEffect, useState, useCallback, useRef } from "react";
import { signalRService } from "../services/signalr.service";
import { chatApi } from "../services/chat.api";
import { ChatMessage, Conversation, ChatUser } from "../types";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // We need to know who WE are

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [convRes, usersRes] = await Promise.all([
          chatApi.getConversations(),
          chatApi.getUsers()
        ]);
        
        if (convRes.success) setConversations(convRes.data);
        if (usersRes.success) setUsers(usersRes.data);

        // Try to decode token to get current user ID (simple approach) or fetch profile
        // For now, we rely on the backend to handle "me"
      } catch (error) {
        console.error("Failed to load chat data", error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
    signalRService.start();

    return () => {
      signalRService.stop();
    };
  }, []);

  // Handle SignalR events
  useEffect(() => {
    signalRService.onMessageReceived((message) => {
      // If message belongs to active conversation, add it
      if (activeConversation && 
          (message.conversationId === activeConversation.conversationId || 
           message.senderId === activeConversation.otherUserId)) {
        setMessages(prev => [...prev, message]);
        // Mark as read if window is focused (simplified)
        if(message.conversationId) chatApi.markAsRead(message.conversationId);
      }

      // Update conversations list (move to top, update last message)
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.otherUserId === message.senderId);
        if (existingIndex > -1) {
          const updated = { ...prev[existingIndex], lastMessage: message.content, lastMessageTime: new Date().toISOString() };
          const newBranch = [...prev];
          newBranch.splice(existingIndex, 1);
          return [updated, ...newBranch];
        } else {
            // New conversation started by someone else? We might need to reload conversations or manually create entry
            // For now, let's reload to be safe and get correct ID
            chatApi.getConversations().then(res => {
                if(res.success) setConversations(res.data);
            });
            return prev;
        }
      });
    });

    signalRService.onMessageSent((message) => {
        if (activeConversation && 
            (message.conversationId === activeConversation.conversationId || 
             message.receiverId === activeConversation.otherUserId)) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update conversation list
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.otherUserId === message.receiverId);
            if (existingIndex > -1) {
              const updated = { ...prev[existingIndex], lastMessage: message.content, lastMessageTime: new Date().toISOString() };
              const newBranch = [...prev];
              newBranch.splice(existingIndex, 1);
              return [updated, ...newBranch];
            }
            return prev;
        });
    });
  }, [activeConversation]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    setActiveConversation(conversation);
    setIsLoading(true);
    try {
      const res = await chatApi.getMessages(conversation.conversationId);
      if (res.success || Array.isArray(res.data)) {
         // API might return array directly or inside data
         setMessages(Array.isArray(res.data) ? res.data : []); 
      }
      chatApi.markAsRead(conversation.conversationId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversation) return;

    try {
        await signalRService.sendMessage(activeConversation.otherUserId, content);
    } catch (error) {
        console.error("Failed to send message:", error);
        // We could also set an error state here to show in UI
    }
  }, [activeConversation]);

  // Start chat with a user from search
  const startChatWithUser = useCallback((userId: string) => {
      // Check if conversation exists
      const existing = conversations.find(c => c.otherUserId === userId);
      if (existing) {
          selectConversation(existing);
      } else {
          // Create a temporary conversation object or handle backend creation
          // If the backend creates conversation on first message, we can just set active state
          // We need details of the user
          const user = users.find(u => u.id === userId);
          if (user) {
              const newConv: Conversation = {
                  conversationId: 0, // 0 indicates new/temporary
                  otherUserId: userId,
                  otherUserName: `${user.firstName} ${user.lastName}`, 
                  lastMessage: "",
                  lastMessageTime: new Date().toISOString()
              };
              setActiveConversation(newConv);
              setMessages([]);
          }
      }
  }, [conversations, users, selectConversation]);

  return {
    conversations,
    activeConversation,
    messages,
    users,
    isLoading,
    selectConversation,
    sendMessage,
    startChatWithUser
  };
}

