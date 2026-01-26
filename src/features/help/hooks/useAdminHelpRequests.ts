import { useQuery } from '@tanstack/react-query';
import { helpRequestService } from '../services/help-request.service';
import { HelpRequestFilterParams } from '../types/help-request.types';

export const useHelpRequests = (params: HelpRequestFilterParams) => {
    return useQuery({
        queryKey: ['help-requests', params],
        queryFn: () => helpRequestService.getHelpRequests(params),
    });
};

export const useAdminHelpRequests = (params: HelpRequestFilterParams) => {
    return useQuery({
        queryKey: ['admin-help-requests', params],
        queryFn: () => helpRequestService.getDashboardHelpRequests(params),
    });
};

export const useHelpRequestDetail = (id: string | undefined, isDashboard: boolean = false) => {
    return useQuery({
        queryKey: ['help-request-detail', id, isDashboard],
        queryFn: () => {
            if (!id) throw new Error("ID is required");
            if (isDashboard) {
                return helpRequestService.getDashboardHelpRequestById(Number(id));
            }
            return helpRequestService.getHelpRequestById(Number(id));
        },
        enabled: !!id,
    });
};
