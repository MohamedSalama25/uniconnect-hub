export interface Notification {
    id: number;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    sentAt: string;
}

export interface NotificationResponse {
    success: boolean;
    message: string;
    data: Notification[];
}

export interface MarkAsReadResponse {
    success: boolean;
    message: string;
    data: number;
}
