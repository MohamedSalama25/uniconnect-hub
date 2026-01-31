import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationList } from './NotificationList';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { signalRService } from '@/features/chat/services/signalr.service';
import { useToast } from '@/components/ui/use-toast';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export function NotificationBell() {
    const { unreadCount, markAllAsRead, fetchNotifications, addNotification } = useNotificationStore();
    const { toast } = useToast();

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Connect to SignalR if not connected (optional check, service handles it usually)
        const connectSignalR = async () => {
            // Assuming signalRService.start() is idempotent or handled internally
            await signalRService.start();
        };
        connectSignalR();

        // Subscribe to notifications
        signalRService.onNotificationReceived((notification) => {
            // Play sound
            const audio = new Audio('/notification.mp3'); // Ensure this file exists or use a robust method
            audio.play().catch(e => console.log('Audio play failed', e));

            // Update store
            addNotification({
                ...notification,
                isRead: false, // Ensure new ones are unread
                sentAt: new Date().toISOString()
            });

            // Show toast
            toast({
                title: notification.title,
                description: notification.message,
                duration: 5000,
            });
        });

        return () => {
            signalRService.offNotificationReceived();
        };
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border border-background animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 mr-4" align="end" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40" dir="rtl">
                    <h4 className="font-semibold text-sm">الإشعارات</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="h-3 w-3 ml-1" />
                            تحديد الكل كمقروء
                        </Button>
                    )}
                </div>
                <NotificationList />
            </PopoverContent>
        </Popover>
    );
}
