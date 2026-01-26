import { UserDto } from "@/features/admin-users/types";
import { ApiResponse } from "@/features/services/types/service.types";

export type HelpRequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';

export interface HelpRequestType {
    id: number;
    name: string;
    description?: string;
}

export interface HelpRequest {
    id: number;
    title: string;
    description: string;
    status: HelpRequestStatus;
    helpRequestTypeId: number;
    helpRequestTypeName: string;
    createdUser: UserDto;
    updatedUser: UserDto;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedHelpRequests {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: HelpRequest[];
    totalHelpRequests?: number;
    pendingHelpRequests?: number;
    acceptedHelpRequests?: number;
    rejectedHelpRequests?: number;
}

export interface HelpRequestFilterParams {
    Search?: string;
    Sort?: string;
    TypeId?: number;
    Status?: HelpRequestStatus | 'All' | number; // Number if backend uses enum values as ints
    PageSize?: number;
    PageIndex?: number;
}

export { type ApiResponse };
