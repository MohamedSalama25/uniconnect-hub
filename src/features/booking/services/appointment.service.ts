import clientAxios from '@/lib/axios';
import { API_CONFIG } from '@/lib/api.config';
import { formatImageUrl } from '@/lib/utils';

export type AppointmentStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';

export interface Appointment {
    id: number;
    houseId: number;
    houseName: string;
    housePrice: number;
    houseAddress: string;
    tenantId: string;
    tenantName: string;
    tenantPhotoUrl: string;
    tenantPhone: string;
    ownerId: string;
    ownerName: string;
    ownerPhotoUrl: string;
    ownerPhone: string;
    appointmentDate: string;
    appointmentTime: string;
    status: AppointmentStatus;
    tenantMessage: string;
    ownerResponseMessage: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentRequest {
    houseId: number;
    appointmentDate: string;
    appointmentTime: string;
    tenantMessage: string;
}

export interface UpdateAppointmentRequest {
    appointmentDate?: string;
    appointmentTime?: string;
    status?: AppointmentStatus;
    ownerResponseMessage?: string;
    tenantMessage?: string;
}

export interface PaginatedAppointmentResponse {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: Appointment[];
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    expectedRevenue: number;
}

export interface AppointmentQueryParams {
    search?: string;
    sort?: string;
    houseId?: number;
    pageSize?: number;
    pageIndex?: number;
}

const mapAppointmentImages = (appointment: Appointment): Appointment => ({
    ...appointment,
    tenantPhotoUrl: formatImageUrl(appointment.tenantPhotoUrl) || appointment.tenantPhotoUrl,
    ownerPhotoUrl: formatImageUrl(appointment.ownerPhotoUrl) || appointment.ownerPhotoUrl,
});

export const appointmentService = {
    getAllAppointments: async (params?: AppointmentQueryParams): Promise<PaginatedAppointmentResponse> => {
        const response = await clientAxios.get<PaginatedAppointmentResponse>(API_CONFIG.ENDPOINTS.HOUSE.GET_ALL_APPOINTMENTS, { params });
        return {
            ...response.data,
            data: response.data.data.map(mapAppointmentImages)
        };
    },

    getAppointmentById: async (id: number): Promise<Appointment> => {
        const response = await clientAxios.get<Appointment>(API_CONFIG.ENDPOINTS.HOUSE.GET_APPOINTMENT(id));
        return mapAppointmentImages(response.data);
    },

    addAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
        const response = await clientAxios.post<Appointment>(API_CONFIG.ENDPOINTS.HOUSE.ADD_APPOINTMENT, data);
        return mapAppointmentImages(response.data);
    },

    updateAppointment: async (id: number, data: UpdateAppointmentRequest): Promise<Appointment> => {
        const response = await clientAxios.put<Appointment>(API_CONFIG.ENDPOINTS.HOUSE.UPDATE_APPOINTMENT(id), data);
        return mapAppointmentImages(response.data);
    },

    deleteAppointment: async (id: number): Promise<void> => {
        await clientAxios.delete(API_CONFIG.ENDPOINTS.HOUSE.DELETE_APPOINTMENT(id));
    },
};
