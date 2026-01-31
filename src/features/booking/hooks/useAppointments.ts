import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentQueryParams } from '../services/appointment.service';
import { toast } from 'sonner';
import { notificationService } from '@/features/notifications/services/notification.service';

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
        onSuccess: async (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("تم إرسال طلب الحجز بنجاح");

            try {
                // Fetch house details to get the owner ID
                // We use getPublicHouseById because the user booking might be a student
                const house = await import('@/features/accommodation-list/services/house.service').then(m => m.houseService.getPublicHouseById(variables.houseId));

                if (house.createdUser?.id || house.createdById) {
                    notificationService.sendNotification({
                        userId: house.createdUser?.id || house.createdById,
                        title: "طلب حجز جديد",
                        message: `لديك طلب حجز جديد على السكن: ${house.name}`
                    });
                }
            } catch (error) {
                console.error("Failed to notify house owner", error);
            }
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
        onSuccess: async (initialResponse, variables) => {
            // Fetch the full appointment details to ensure we have all fields (names, ids, etc.)
            // The update response might be partial or missing joined fields.
            const updatedAppointment = await appointmentService.getAppointmentById(variables.id);

            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success("تم تحديث الحجز بنجاح");

            if (updatedAppointment.status === 'Accepted' || updatedAppointment.status === 'Rejected') {
                try {
                    notificationService.sendNotification({
                        userId: updatedAppointment.tenantId,
                        title: updatedAppointment.status === 'Accepted' ? "تم قبول طلب الحجز" : "تم رفض طلب الحجز",
                        message: updatedAppointment.status === 'Accepted'
                            ? `وافق المالك ${updatedAppointment.ownerName} على طلب حجز الموعد للسكن ${updatedAppointment.houseName}.`
                            : `نعتذر، تم رفض طلب حجز الموعد للسكن ${updatedAppointment.houseName}.`
                    });
                } catch (error) {
                    console.error("Failed to notify tenant", error);
                }
            }

            // Notify Tenant on Owner Reply
            // Check variables.data since that's what triggered the change, but use updatedAppointment for the content
            if (variables.data.ownerResponseMessage) {
                try {
                    notificationService.sendNotification({
                        userId: updatedAppointment.tenantId,
                        title: "رد جديد من المالك",
                        message: `قام المالك ${updatedAppointment.ownerName} بالرد على استفسارك بخصوص السكن ${updatedAppointment.houseName}.`
                    });
                } catch (error) {
                    console.error("Failed to notify tenant of reply", error);
                }
            }
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
