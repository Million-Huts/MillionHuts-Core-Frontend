/*
========================================
ENUMS
========================================
*/

export type NotificationType =
    | "COMPLAINT_CREATED"
    | "COMPLAINT_ASSIGNED"
    | "COMPLAINT_UPDATED"
    | "COMPLAINT_RESOLVED"
    | "PAYMENT_REMINDER"
    | "PAYMENT_RECEIVED"
    | "ANNOUNCEMENT"
    | "SYSTEM";

export type NotificationEntityType =
    | "COMPLAINT"
    | "PAYMENT"
    | "TENANT"
    | "ROOM"
    | "BILL";

export type ActorType = "TENANT" | "STAFF";



/*
========================================
RECIPIENT
========================================
*/

export interface NotificationRecipient {
    id: string;

    notificationId: string;

    userId: string;
    userType: ActorType;

    isRead: boolean;
    readAt?: string | null;
    deliveredAt?: string | null;

    createdAt: string;
}



/*
========================================
NOTIFICATION
========================================
*/

export interface Notification {
    id: string;

    pgId?: string | null;

    type: NotificationType;

    title: string;
    message: string;

    entityType?: NotificationEntityType | null;
    entityId?: string | null;

    actorId?: string | null;
    actorType?: ActorType | null;

    meta?: Record<string, any> | null;

    createdAt: string;

    recipients?: NotificationRecipient[];
}



/*
========================================
API RESPONSE TYPES
========================================
*/

export interface NotificationListResponse {
    data: Notification[];
    unreadCount: number;
}



/*
========================================
SOCKET PAYLOAD
========================================
*/

export interface NotificationSocketPayload {
    notification: Notification;
}



/*
========================================
HELPER TYPES
========================================
*/

export interface NotificationRedirectParams {
    entityType?: NotificationEntityType | null;
    entityId?: string | null;
    pgId?: string | null;
}