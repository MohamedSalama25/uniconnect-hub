import { UserDto } from "@/features/admin-users/types";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface TimeSpan {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    microseconds: number;
    nanoseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMicroseconds: number;
    totalNanoseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export type ServiceStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';

export interface Service {
    id: number;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    workingFrom: TimeSpan;
    workingTo: TimeSpan;
    status: ServiceStatus;
    serviceCategoryId: number;
    serviceCategoryName: string;
    createdUser: UserDto;
    updatedUser: UserDto;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceFilterParams {
    Search?: string;
    Sort?: string;
    CatogeryId?: number; // Backend typo "CatogeryId"
    PageSize?: number;
    PageIndex?: number;
    Status?: ServiceStatus | 'All';
}

export interface PaginatedServices {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: Service[];
    totalServices?: number;
    pendingServices?: number;
    acceptedServices?: number;
    rejectedServices?: number;
}

export interface CreateServiceRequest {
    name: string;
    serviceCategoryId: number;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    workingFrom: string;
    workingTo: string;
}
