import { useQuery } from '@tanstack/react-query';
import clientAxios from '@/lib/axios';
import { PaginatedServices, ServiceFilterParams } from '../types/service.types';

export const usePublicServices = (params: ServiceFilterParams) => {
    return useQuery({
        queryKey: ['public-services', params],
        queryFn: async () => {
            const response = await clientAxios.get<PaginatedServices>('/api/Services', {
                params: {
                    Search: params.Search,
                    CatogeryId: params.CatogeryId,
                    PageIndex: params.PageIndex,
                    PageSize: params.PageSize,
                    Sort: params.Sort
                }
            });
            return response.data;
        },
        placeholderData: (previousData) => previousData,
    });
};
