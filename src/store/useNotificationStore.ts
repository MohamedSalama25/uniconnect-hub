import { create } from 'zustand';
import { notificationService } from '@/features/notifications/services/notification.service';
import { Notification } from '@/features/notifications/types/notification.types';

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await notificationService.getAllNotifications();
            if (response.success) {
                // Sort interactions by date descending (newest first)
                const sortedNotifications = response.data.sort((a, b) =>
                    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
                );

                const unreadCount = sortedNotifications.filter(n => !n.isRead).length;
                set({ notifications: sortedNotifications, unreadCount, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch notifications', isLoading: false });
        }
    },

    markAsRead: async (id: number) => {
        // Optimistic update
        const previousNotifications = get().notifications;
        const previousUnreadCount = get().unreadCount;

        set(state => {
            const notification = state.notifications.find(n => n.id === id);
            if (!notification || notification.isRead) return state;

            return {
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            };
        });

        try {
            await notificationService.markAsRead(id);
        } catch (error) {
            // Revert if failed
            set({ notifications: previousNotifications, unreadCount: previousUnreadCount });
            console.error('Failed to mark notification as read', error);
        }
    },

    markAllAsRead: async () => {
        // Note: The API doesn't seem to have a bulk mark-as-read endpoint based on the plan.
        // For now we will iterate or just implement client-side optimism if we had one.
        // But since the user didn't ask for a bulk endpoint and I didn't see one in the screenshots,
        // I will implement this by marking all visible ones as read locally and calling the API for each unread one (or just skip bulk if inefficient).
        // Actually, let's just mark them one by one for now if needed, or leave it client-side optimistic only if the backend doesn't support it.
        // Wait, the plan says "markAllAsRead (optimistic updates)".
        // I'll leave it as a placeholder or implement iteration if critical.
        // Let's implement iteration for now to be safe, but it might be slow. 
        // BETTER APPROACH: Just fetch again or limit this feature.
        // Let's stick to the requested "markAsRead" for single items first as that's confirmed API.
        // I'll implement a simple client-side optimistic loop for now.

        const unreadIds = get().notifications.filter(n => !n.isRead).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic
        set(state => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0
        }));

        // Real calls
        try {
            await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));
        } catch (error) {
            console.error('Failed to mark all as read', error);
            // Re-fetch to sync state in case of partial failure
            get().fetchNotifications();
        }
    },

    addNotification: (notification: Notification) => {
        set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));
