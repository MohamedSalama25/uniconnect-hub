import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';

export const useServiceDetail = (id: string | undefined, isDashboard: boolean = false) => {
    return useQuery({
        queryKey: ['service-detail', id, isDashboard],
        queryFn: () => {
            if (!id) throw new Error("ID is required");
            if (isDashboard) {
                return serviceService.getDashboardServiceById(Number(id));
            }
            return serviceService.getServiceById(Number(id));
        },
        enabled: !!id,
    });
};
