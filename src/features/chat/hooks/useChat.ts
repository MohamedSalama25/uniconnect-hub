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

        if (convRes.success) {
          // Fetch online status for each conversation's user
          const conversationsWithStatus = await Promise.all(convRes.data.map(async (c) => {
            try {
              const statusRes = await chatApi.checkOnlineStatus(c.otherUserId);
              return { ...c, isOnline: statusRes.success ? statusRes.data : false };
            } catch {
              return { ...c, isOnline: false };
            }
          }));
          setConversations(conversationsWithStatus);
        }
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
      const isForActive = activeConversation &&
        (message.conversationId === activeConversation.conversationId ||
          message.senderId === activeConversation.otherUserId);

      // If message belongs to active conversation, add it
      if (isForActive) {
        setMessages(prev => [...prev, message]);
        // Mark as read immediately if it's the active conversation
        if (message.conversationId) chatApi.markAsRead(message.conversationId);
      }

      // Update conversations list (move to top, update last message, update unread count)
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.otherUserId === message.senderId);

        if (existingIndex > -1) {
          const conversation = prev[existingIndex];
          const updated = {
            ...conversation,
            lastMessage: message.content,
            lastMessageTime: new Date().toISOString(),
            // Only increment unread if NOT the active conversation
            unreadCount: isForActive ? 0 : (conversation.unreadCount || 0) + 1
          };
          const newBranch = [...prev];
          newBranch.splice(existingIndex, 1);
          return [updated, ...newBranch];
        } else {
          // New conversation started by someone else
          // Look for user in our users list to build the conversation object locally
          const user = users.find(u => u.id === message.senderId);
          if (user) {
            const newConv: Conversation = {
              conversationId: message.conversationId,
              otherUserId: message.senderId,
              otherUserName: `${user.firstName} ${user.lastName}`,
              otherUserImageUrl: user.avatar, // Use avatar from user list for new chats
              lastMessage: message.content,
              lastMessageTime: new Date().toISOString(),
              unreadCount: isForActive ? 0 : 1,
              isOnline: user.isOnline
            };
            return [newConv, ...prev];
          } else {
            // If user not in list (rare but possible), then fetch
            chatApi.getConversations().then(res => {
              if (res.success) setConversations(res.data);
            });
            return prev;
          }
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
    return () => {
      signalRService.offMessageReceived();
      signalRService.offMessageSent();
    };
  }, [activeConversation, users]); // Added users dependency to find info for new conversations

  const selectConversation = useCallback(async (conversation: Conversation | null) => {
    setActiveConversation(conversation);

    if (!conversation) {
      setMessages([]);
      return;
    }

    // Clear unread count locally immediately for better UX
    setConversations(prev => prev.map(c =>
      c.conversationId === conversation.conversationId ? { ...c, unreadCount: 0 } : c
    ));

    setIsLoading(true);
    try {
      const res = await chatApi.getMessages(conversation.conversationId);
      if (res.success || Array.isArray(res.data)) {
        const msgs = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
        // Reverse to show oldest first if the API returns newest first (which it seems to based on IDs)
        setMessages([...msgs].reverse());
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
          otherUserImageUrl: user.avatar,
          lastMessage: "",
          lastMessageTime: new Date().toISOString()
        };
        setActiveConversation(newConv);
        setMessages([]);
      }
    }
  }, [conversations, users, selectConversation]);

  const deleteConversation = useCallback(async (conversationId: number) => {
    try {
      const res = await chatApi.deleteConversation(conversationId);
      if (res.success) {
        setConversations(prev => prev.filter(c => c.conversationId !== conversationId));
        if (activeConversation?.conversationId === conversationId) {
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (e) {
      console.error("Failed to delete conversation", e);
    }
  }, [activeConversation]);

  return {
    conversations,
    activeConversation,
    messages,
    users,
    isLoading,
    selectConversation,
    sendMessage,
    startChatWithUser,
    deleteConversation
  };
}

