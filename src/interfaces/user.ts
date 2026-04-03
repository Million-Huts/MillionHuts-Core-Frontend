export interface UserType {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    profileImageUrl?: string | null;
    role?: "SUPER_ADMIN" | "ADMIN" | "USER";
    isActive?: boolean;
    passwordChangedAt?: string | null; //date time
    lastLoginAt?: string | null; //Date time
    emailVerified?: boolean;
    mfaEnabled?: boolean;
    mfaSecret?: string;
    mfaTempSecret?: string;
    access?: Access[];
}

export interface Access {
    id: string;
    userId: string;
    pgId: string;
    role: "OWNER" | "MANAGER" | "STAFF";
    staffType: "SECURITY" | "CLEANING" | "MESS" | "MAINTENANCE" | "OTHER" | null;
    isActive: boolean;
}