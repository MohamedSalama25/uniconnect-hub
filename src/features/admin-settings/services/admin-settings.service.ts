import clientAxios from "@/lib/axios";
import { API_CONFIG } from "@/lib/api.config";
import {
    HouseType,
    HouseTypeResponse,
    HouseTypeParams,
    ServiceCategory,
    ServiceCategoryResponse,
    ServiceCategoryParams
} from "../types/admin-settings.types";

export const adminSettingsService = {
    // House Types
    getHouseTypes: async (params?: HouseTypeParams): Promise<HouseTypeResponse> => {
        const response = await clientAxios.get<HouseTypeResponse>(API_CONFIG.ENDPOINTS.HOUSE.GET_TYPES, {
            params,
        });
        return response.data;
    },

    getHouseTypeById: async (id: number): Promise<HouseType> => {
        const response = await clientAxios.get<HouseType>(API_CONFIG.ENDPOINTS.HOUSE.GET_TYPE_BY_ID(id));
        return response.data;
    },

    createHouseType: async (typeName: string): Promise<any> => {
        const formData = new FormData();
        formData.append('TypeName', typeName);
        const response = await clientAxios.post(API_CONFIG.ENDPOINTS.HOUSE.CREATE_TYPE, formData);
        return response.data;
    },

    updateHouseType: async (id: number, typeName: string): Promise<any> => {
        const formData = new FormData();
        formData.append('TypeName', typeName);
        const response = await clientAxios.put(API_CONFIG.ENDPOINTS.HOUSE.UPDATE_TYPE(id), formData);
        return response.data;
    },

    deleteHouseType: async (id: number): Promise<void> => {
        await clientAxios.delete(API_CONFIG.ENDPOINTS.HOUSE.DELETE_TYPE(id));
    },

    // Service Categories
    getServiceCategories: async (params?: ServiceCategoryParams): Promise<ServiceCategoryResponse> => {
        const response = await clientAxios.get<ServiceCategoryResponse>(API_CONFIG.ENDPOINTS.SERVICE_CATEGORY.GET_ALL, {
            params,
        });
        return response.data;
    },

    getServiceCategoryById: async (id: number): Promise<ServiceCategory> => {
        const response = await clientAxios.get<ServiceCategory>(API_CONFIG.ENDPOINTS.SERVICE_CATEGORY.GET_BY_ID(id));
        return response.data;
    },

    createServiceCategory: async (name: string, icon?: string): Promise<any> => {
        const formData = new FormData();
        formData.append('Name', name);
        if (icon) formData.append('Icon', icon);
        const response = await clientAxios.post(API_CONFIG.ENDPOINTS.SERVICE_CATEGORY.CREATE, formData);
        return response.data;
    },

    updateServiceCategory: async (id: number, name: string, icon?: string): Promise<any> => {
        const formData = new FormData();
        formData.append('Name', name);
        if (icon) formData.append('Icon', icon);
        const response = await clientAxios.put(API_CONFIG.ENDPOINTS.SERVICE_CATEGORY.UPDATE(id), formData);
        return response.data;
    },

    deleteServiceCategory: async (id: number): Promise<void> => {
        await clientAxios.delete(API_CONFIG.ENDPOINTS.SERVICE_CATEGORY.DELETE(id));
    },
};
