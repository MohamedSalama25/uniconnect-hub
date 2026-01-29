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
        const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HELP_REQUEST.GET_ALL, {
            params: {
                Search: params?.Search,
                Sort: params?.Sort,
                TypeId: params?.TypeId,
                PageSize: params?.PageSize,
                PageIndex: params?.PageIndex,
            }
        });

        // Handle new wrapped response structure: { data: { pageSize, data, ... }, statistics: { ... } }
        const body = response.data;
        const paginatedData = body?.data || body;

        return {
            ...paginatedData,
            data: paginatedData.data || []
        };
    },

    getDashboardHelpRequests: async (params?: HelpRequestFilterParams): Promise<PaginatedHelpRequests> => {
        const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HELP_REQUEST.DASHBOARD_GET_ALL, {
            params: {
                Search: params?.Search,
                Sort: params?.Sort,
                TypeId: params?.TypeId,
                PageSize: params?.PageSize,
                PageIndex: params?.PageIndex,
                Status: params?.Status !== 'All' ? params?.Status : undefined
            }
        });

        // Handle new wrapped response structure: { data: { pageSize, data, ... }, statistics: { ... } }
        const body = response.data;
        const paginatedData = body?.data || body;
        const stats = body?.statistics;

        return {
            ...paginatedData,
            data: paginatedData.data || [],
            // Map new statistics structure to expected format
            totalHelpRequests: stats?.total ?? paginatedData?.totalHelpRequests ?? 0,
            pendingHelpRequests: stats?.pendingTotal ?? paginatedData?.pendingHelpRequests ?? 0,
            acceptedHelpRequests: stats?.acceptedTotal ?? paginatedData?.acceptedHelpRequests ?? 0,
            rejectedHelpRequests: stats?.rejectedTotal ?? paginatedData?.rejectedHelpRequests ?? 0,
        };
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

    updateHelpRequest: async (id: number, data: { title: string; description: string; helpRequestTypeId: number }): Promise<HelpRequest> => {
        const response = await clientAxios.put<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.UPDATE(id), data);
        return response.data.data;
    },

    updateHelpRequestStatus: async (id: number, status: string): Promise<HelpRequest> => {
        const response = await clientAxios.patch<ApiResponse<HelpRequest>>(API_CONFIG.ENDPOINTS.HELP_REQUEST.UPDATE_STATUS(id), null, {
            params: { status }
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
