import axios from '@/lib/axios';
import { ApiResponse, Conversation, ChatMessage, ChatUser, PaginatedResponse } from '../types';

export const chatApi = {
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    const response = await axios.get('/api/Chat/conversations');
    return response.data;
  },

  getMessages: async (conversationId: number, page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<ChatMessage> | any>> => {
    // The screenshot shows data might be just the list or a paginated object. 
    // Image 3 shows "data": { "id": 15, ... } inside "data": [ ... ] ?? No wait.
    // Image 3 shows `/api/Chat/messages/{conversationId}` response.
    // The response body in Image 3 shows `data` as a list? No, there is a scroll bar.
    // Wait, Image 3 response body:
    // "data": [ { "id": 15, "senderId": "...", "receiverId": "..." } ]
    // It looks like `data` IS the array. Pagination might be in headers or just simple slice.
    // Let's assume data is the array for now based on the image glimpse.
    const response = await axios.get(`/api/Chat/messages/${conversationId}`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  markAsRead: async (conversationId: number): Promise<ApiResponse<boolean>> => {
    const response = await axios.post(`/api/Chat/markAsRead/${conversationId}`);
    return response.data;
  },

  checkOnlineStatus: async (userId: string): Promise<ApiResponse<boolean>> => {
    const response = await axios.get(`/api/Chat/online/${userId}`);
    return response.data;
  },

  // Users API
  getUsers: async (): Promise<ApiResponse<ChatUser[]>> => {
    try {
        const response = await axios.get('/api/Users/users');
        // The API returns a structure like { users: { data: [...] } } or similar based on admin service.
        // Let's inspect the admin service types:
        // UsersPageResponse { users: { data: UserDto[], ... } }
        // So axios.get returns { data: UsersPageResponse, ... }
        // We need to return ApiResponse<ChatUser[]> which implies { success: true, data: ChatUser[] } wrapper for consistency?
        // Or just return the array. The hook expects `res.data`.
        // Let's standardise on returning { success: true, data: [...] } so the hook logic remains simple.
        
        const pageResponse = response.data as any; 
        // access data deeply
        const userList = pageResponse?.users?.data || pageResponse?.data || [];
        
        const mappedUsers: ChatUser[] = userList.map((u: any) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            avatar: u.profilePictureUrl
        }));

        return {
            success: true,
            message: "Success",
            data: mappedUsers
        };
    } catch (e) {
        console.error("Failed to fetch users", e);
        return { success: false, message: "Failed", data: [] };
    }
  }
};
