export type ComplaintStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | "REJECTED"
    | "REOPENED";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ComplaintCategory =
    | "ELECTRICAL"
    | "PLUMBING"
    | "CLEANING"
    | "INTERNET"
    | "FOOD"
    | "SECURITY"
    | "MAINTENANCE"
    | "OTHER";

export type ActorType = "TENANT" | "STAFF";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface ComplaintMedia {
    id: string;
    fileUrl: string;
    fileType: MediaType;
    complaintId?: string;
    commentId?: string;
    createdAt: string;
}

export interface ComplaintComment {
    id: string;
    complaintId: string;
    message: string;
    authorId: string;
    authorType: ActorType;
    createdAt: string;
    media: ComplaintMedia[];
}

export interface ComplaintActivity {
    id: string;
    complaintId: string;
    action: string;
    actorId: string;
    actorType: ActorType;
    meta?: any;
    createdAt: string;
}

export interface Complaint {
    id: string;
    pgId: string;
    roomId?: string | null;

    title: string;
    description: string;

    category: ComplaintCategory;
    priority: ComplaintPriority;
    status: ComplaintStatus;

    raisedById: string;
    raisedByType: ActorType;

    assignedToId?: string | null;
    assignedToType?: ActorType | null;

    resolvedAt?: string | null;
    closedAt?: string | null;

    createdAt: string;
    updatedAt: string;

    media: ComplaintMedia[];
    comments?: ComplaintComment[];
    activities?: ComplaintActivity[];
}

export interface ComplaintStats {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
}