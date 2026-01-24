import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentQueryParams } from '../services/appointment.service';
import { toast } from 'sonner';

export const useAppointments = (params?: AppointmentQueryParams) => {
    return useQuery({
        queryKey: ['appointments', params],
        queryFn: () => appointmentService.getAllAppointments(params),
    });
};

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAppointmentRequest) => appointmentService.addAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("تم إرسال طلب الحجز بنجاح");
        },
        onError: () => {
            toast.error("فشل في إرسال طلب الحجز");
        }
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateAppointmentRequest }) =>
            appointmentService.updateAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("تم تحديث الحجز بنجاح");
        },
        onError: () => {
            toast.error("فشل في تحديث الحجز");
        }
    });
};

export const useDeleteAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => appointmentService.deleteAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("تم حذف الحجز بنجاح");
        },
        onError: () => {
            toast.error("فشل في حذف الحجز");
        }
    });
};
