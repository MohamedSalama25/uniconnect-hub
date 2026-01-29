import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export const useMainPageData = () => {
    return useQuery({
        queryKey: ["main-page-data"],
        queryFn: dashboardService.getMainPageData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
