import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import { CreateServiceRequest } from '../types/service.types';
import { toast } from 'sonner';

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateServiceRequest> }) =>
            serviceService.updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            toast.success("تم تحديث الخدمة بنجاح");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "فشل في تحديث الخدمة");
        },
    });
};
