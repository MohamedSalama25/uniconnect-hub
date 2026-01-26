import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import { CreateServiceRequest } from '../types/service.types';
import { toast } from 'sonner';

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateServiceRequest) => serviceService.createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
            toast.success("تم إضافة الخدمة بنجاح");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "فشل في إضافة الخدمة");
        },
    });
};
