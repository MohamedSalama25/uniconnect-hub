import clientAxios from '@/lib/axios';
import { API_CONFIG } from '@/lib/api.config';
import {
    PaginatedHelpRequests,
    HelpRequestFilterParams,
    HelpRequest,
    HelpRequestType,
    ApiResponse
} from '../types/help-request.types';

export const helpRequestService = {
    getHelpRequests: async (params?: HelpRequestFilterParams): Promise<PaginatedHelpRequests> => {
        const response = await clientAxios.get<PaginatedHelpRequests>(API_CONFIG.ENDPOINTS.HELP_REQUEST.GET_ALL, {
            params: {
                Search: params?.Search,
                Sort: params?.Sort,
                TypeId: params?.TypeId,
                PageSize: params?.PageSize,
                PageIndex: params?.PageIndex,
            }
        });
        return response.data;
    },

    getDashboardHelpRequests: async (params?: HelpRequestFilterParams): Promise<PaginatedHelpRequests> => {
        const response = await clientAxios.get<PaginatedHelpRequests>(API_CONFIG.ENDPOINTS.HELP_REQUEST.DASHBOARD_GET_ALL, {
            params: {
                Search: params?.Search,
                Sort: params?.Sort,
                TypeId: params?.TypeId,
                PageSize: params?.PageSize,
                PageIndex: params?.PageIndex,
                Status: params?.Status !== 'All' ? params?.Status : undefined
            }
        });
        return response.data;
    },

    getHelpRequestById: async (id: number): Promise<HelpRequest> => {
        const response = await clientAxios.get<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.GET_BY_ID(id));
        return response.data.data;
    },

    getDashboardHelpRequestById: async (id: number): Promise<HelpRequest> => {
        const response = await clientAxios.get<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.DASHBOARD_GET_BY_ID(id));
        return response.data.data;
    },

    createHelpRequest: async (data: { title: string; description: string; helpRequestTypeId: number }): Promise<HelpRequest> => {
        const response = await clientAxios.post<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.CREATE, data);
        return response.data.data;
    },

    updateHelpRequestStatus: async (request: HelpRequest, status: 'Accepted' | 'Rejected'): Promise<HelpRequest> => {
        const response = await clientAxios.put<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.UPDATE_STATUS(request.id), {
            ...request,
            status: status
        });
        return response.data.data;
    },

    deleteHelpRequest: async (id: number): Promise<void> => {
        await clientAxios.delete(API_CONFIG.ENDPOINTS.HELP_REQUEST.DELETE(id));
    },

    // Request Types
    getRequestTypes: async (params?: { pageSize?: number; pageIndex?: number }): Promise<ApiResponse<HelpRequestType[]>> => {
        const response = await clientAxios.get<ApiResponse<HelpRequestType[]>>(API_CONFIG.ENDPOINTS.REQUEST_TYPE.GET_ALL, {
            params
        });
        return response.data;
    }
};
