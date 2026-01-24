import { useQuery } from '@tanstack/react-query';
import { houseService } from '@/features/accommodation-list/services/house.service';
import { HousingFilterParams } from '@/features/accommodation-list/types/house.types';

export const useAdminHouses = (params: HousingFilterParams) => {
  return useQuery({
    queryKey: ['admin-houses', params],
    queryFn: () => houseService.getHouses(params),
    // Keep data fresh while navigating/typing if needed, or use keepPreviousData for smoother transitions
    placeholderData: (previousData) => previousData,
  });
};
