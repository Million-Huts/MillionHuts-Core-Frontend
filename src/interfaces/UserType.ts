export interface UserType {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "USER";
    isActive?: boolean;
}