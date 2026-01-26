import clientAxios from '@/lib/axios';
import { API_CONFIG } from '@/lib/api.config';
import {
    PaginatedServices,
    ServiceFilterParams,
    Service,
    CreateServiceRequest,
    ServiceStatus,
    ApiResponse
} from '../types/service.types';

export const serviceService = {
    getDashboardServices: async (params?: ServiceFilterParams): Promise<PaginatedServices> => {
        const response = await clientAxios.get<PaginatedServices>(API_CONFIG.ENDPOINTS.SERVICES.GET_ALL, {
            params: {
                Search: params?.Search,
                Sort: params?.Sort,
                CatogeryId: params?.CatogeryId,
                PageSize: params?.PageSize,
                PageIndex: params?.PageIndex,
                Status: params?.Status !== 'All' ? params?.Status : undefined
            }
        });
        return response.data;
    },

    getServiceById: async (id: number): Promise<Service> => {
        const response = await clientAxios.get<ApiResponse<Service>>(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_ID(id));
        return response.data.data;
    },

    getDashboardServiceById: async (id: number): Promise<Service> => {
        const response = await clientAxios.get<ApiResponse<Service>>(API_CONFIG.ENDPOINTS.SERVICES.DASHBOARD_GET_BY_ID(id));
        return response.data.data;
    },

    createService: async (data: CreateServiceRequest): Promise<Service> => {
        const response = await clientAxios.post<ApiResponse<Service>>(API_CONFIG.ENDPOINTS.SERVICES.CREATE, data);
        return response.data.data;
    },

    updateService: async (id: number, data: Partial<CreateServiceRequest>): Promise<Service> => {
        const response = await clientAxios.put<ApiResponse<Service>>(API_CONFIG.ENDPOINTS.SERVICES.UPDATE(id), data);
        return response.data.data;
    },

    deleteService: async (id: number): Promise<void> => {
        await clientAxios.delete(API_CONFIG.ENDPOINTS.SERVICES.DELETE(id));
    },

    updateServiceStatus: async (id: number, status: 'Accepted' | 'Rejected'): Promise<Service> => {
        const response = await clientAxios.patch<ApiResponse<Service>>(API_CONFIG.ENDPOINTS.SERVICES.UPDATE_STATUS(id), status, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    }
};
