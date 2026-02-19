export interface UserType {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    profileImageUrl?: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "USER";
    isActive?: boolean;
    passwordChangedAt?: string | null; //date time
    lastLoginAt?: string | null; //Date time
    emailVerified?: boolean;
}