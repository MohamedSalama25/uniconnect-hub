import { API_CONFIG } from "@/lib/api.config";
import clientAxios from "@/lib/axios";
import { UsersPageResponse, UserQueryParams, UserActionResponse } from "../types";

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

  assignRole: async (userId: string, role: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.ASSIGN_ROLE;
    const response = await clientAxios.put(url, null, {
        params: { userId, role }
    });
    return response.data;
  },

  removeRole: async (userId: string, role: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.REMOVE_ROLE;
    const response = await clientAxios.put(url, null, {
        params: { userId, role }
    });
    return response.data;
  },

  acceptUser: async (userId: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.ACCEPT(userId);
    const response = await clientAxios.put(url);
    return response.data;
  },

  blockUser: async (userId: string): Promise<UserActionResponse> => {
    const url = API_CONFIG.ENDPOINTS.USERS.BLOCK(userId);
    const response = await clientAxios.put(url);
    return response.data;
  }
};
