import { useQuery } from '@tanstack/react-query';
import { houseService } from '@/features/accommodation-list/services/house.service';

export const useHouseDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['house-detail', id],
    queryFn: () => houseService.getHouseById(Number(id)),
    enabled: !!id,
  });
};
