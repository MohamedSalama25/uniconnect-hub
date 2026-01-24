import { useMutation, useQueryClient } from '@tanstack/react-query';
import { houseService } from '../services/house.service';
import { CreateHouseRequest, House } from '../types/house.types';
import { toast } from 'sonner';

interface UpdateHouseParams {
    id: number;
    data: CreateHouseRequest;
}

export const useUpdateHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateHouseParams) => houseService.updateHouse(id, data),
        onSuccess: (response) => {
            toast.success("تم تحديث السكن بنجاح");
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            queryClient.invalidateQueries({ queryKey: ['admin-houses'] });
            queryClient.invalidateQueries({ queryKey: ['house-detail'] });
        },
        onError: (error: any) => {
            console.error('Update House Error:', error);
            const errorMessage = error.response?.data?.message || "فشلت عملية التحديث";
            toast.error(errorMessage);
        },
    });
};
