export interface PGUser {
    role: "OWNER" | "MANAGER" | "STAFF";
    isActive: boolean;
    user: {
        id: string;
        name: string;
        email?: string | null;
        phone?: string | null;
        lastLoginAt?: string | null;
    };
}

export interface CreateUserPayload {
    name: string;
    phone: string;
    email?: string;
    role: "MANAGER" | "STAFF";
}