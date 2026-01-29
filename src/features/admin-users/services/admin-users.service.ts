import { API_CONFIG } from "@/lib/api.config";
import clientAxios from "@/lib/axios";
import { UsersPageResponse, UserQueryParams, UserActionResponse, UserPostsResponse } from "../types";

export const adminUsersService = {
  getAllUsers: async (params: UserQueryParams): Promise<UsersPageResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.GET_ALL;

    // Filter out undefined/null/empty params
    const cleanParams: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });

    const response = await clientAxios.get(url, {
      params: cleanParams
    });

    return response.data;
  },

  assignRole: async (emailOrUsername: string, role: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.ASSIGN_ROLE;
    const response = await clientAxios.put(url, { emailOrUsername, role });
    return response.data;
  },

  removeRole: async (emailOrUsername: string, role: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.REMOVE_ROLE;
    const response = await clientAxios.put(url, { emailOrUsername, role });
    return response.data;
  },

  acceptUser: async (userId: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.ACCEPT(userId);
    const response = await clientAxios.put(url);
    return response.data;
  },

  blockUser: async (userId: string, isBlocked: boolean): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.BLOCK(userId);
    const response = await clientAxios.put(url, null, {
      params: { isBlocked }
    });
    return response.data;
  },

  getUserPosts: async (userId: string): Promise<UserPostsResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.GET_USER_POSTS(userId);
    const response = await clientAxios.get<UserPostsResponse>(url);
    return response.data;
  }
};
