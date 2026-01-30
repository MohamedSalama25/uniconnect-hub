import clientAxios from '@/lib/axios';
import { NotificationResponse, MarkAsReadResponse } from '../types/notification.types';

export const notificationService = {
    getAllNotifications: async (): Promise<NotificationResponse> => {
        const response = await clientAxios.get<NotificationResponse>('/api/Notification');
        return response.data;
    },

    markAsRead: async (notificationId: number): Promise<MarkAsReadResponse> => {
        const response = await clientAxios.post<MarkAsReadResponse>(`/api/Notification/markAsRead/${notificationId}`);
        return response.data;
    },

    sendNotification: async (payload: { userId: string; title: string; message: string; }): Promise<any> => {
        const response = await clientAxios.post('/api/Notification/send', payload);
        return response.data;
    }
};
