import { useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationItem } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellOff, Loader2 } from 'lucide-react';

export function NotificationList() {
    const { notifications, isLoading, fetchNotifications, markAsRead } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();

        // Optional polling every 60s
        const interval = setInterval(() => {
            fetchNotifications();
        }, 60000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    if (isLoading && notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm">Loading notifications...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground px-4 text-center">
                <BellOff className="h-10 w-10 mb-2 opacity-50" />
                <p className="font-medium">No notifications</p>
                <p className="text-xs mt-1">You're all caught up! Check back later.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px] w-full">
            <div className="flex flex-col">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}
