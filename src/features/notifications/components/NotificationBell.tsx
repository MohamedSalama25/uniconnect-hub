import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NotificationList } from './NotificationList';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export function NotificationBell() {
    const { unreadCount, markAllAsRead } = useNotificationStore();

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
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all as read
                        </Button>
                    )}
                </div>
                <NotificationList />
            </PopoverContent>
        </Popover>
    );
}
