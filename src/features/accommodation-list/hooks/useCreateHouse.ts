import { useMutation, useQueryClient } from '@tanstack/react-query';
import { houseService } from '../services/house.service';
import { CreateHouseRequest } from '../types/house.types';
import { toast } from 'sonner';

export const useCreateHouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHouseRequest) => houseService.createHouse(data),
    onSuccess: (response) => {
      // If we got here, axios 2xx was returned. 
      // Some APIs return a wrapper with statusCode, others return the object directly.
      const isError = response.statusCode && response.statusCode >= 400;

      if (!isError) {
        toast.success(response.message || "تم إضافة السكن بنجاح!", {
          description: "سيتم مراجعة طلبك من قبل المشرفين قبل النشر."
        });
        queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      } else {
        toast.error(response.message || "حدث خطأ ما أثناء إضافة السكن");
      }
    },
    onError: (error: any) => {
      console.error('Create House Error:', error);
      const errorMessage = error.response?.data?.message || "فشلت عملية الإضافة، يرجى المحاولة مرة أخرى.";
      toast.error(errorMessage);
    },
  });
};
