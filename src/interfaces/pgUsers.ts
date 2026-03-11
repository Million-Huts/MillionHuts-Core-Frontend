export interface PGUser {
    userId: string;
    pgId?: string;
    role: "OWNER" | "MANAGER" | "STAFF";
    isActive: boolean;
    user: UserSummary;
}

export interface UserSummary {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    lastLoginAt?: string | null;
    createdAt?: string | null;
};

export interface CreateUserPayload {
    name: string;
    phone: string;
    email?: string;
    role: "MANAGER" | "STAFF";
}