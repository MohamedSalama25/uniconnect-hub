import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/features/notifications/types/notification.types';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    return (
        <div
            dir="rtl"
            className={cn(
                "flex flex-col gap-1 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors text-right",
                !notification.isRead && "bg-muted/30"
            )}
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1">
                    <p className={cn("text-sm font-medium leading-none", !notification.isRead && "text-primary")}>
                        {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                    </p>
                </div>
                {!notification.isRead && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                        }}
                        title="Mark as read"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <span className="text-xs text-muted-foreground/60">
                {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true, locale: ar })}
            </span>
        </div>
    );
}
