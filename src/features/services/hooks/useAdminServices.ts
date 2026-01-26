import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import { ServiceFilterParams } from '../types/service.types';

export const useAdminServices = (params: ServiceFilterParams) => {
    return useQuery({
        queryKey: ['admin-services', params],
        queryFn: () => serviceService.getDashboardServices(params),
        placeholderData: (previousData) => previousData,
    });
};
