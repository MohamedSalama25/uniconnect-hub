export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string; // Optional if not provided by backend yet
}

export interface Conversation {
  conversationId: number;
  otherUserId: string;
  otherUserName?: string; // Added for UI convenience, might need to fetch user details
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
