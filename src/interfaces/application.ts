import type { Tenant } from "./tenant";

export interface Application {
    id: string;
    tenantId: string;
    status: "APPROVED" | "PENDING" | "REJECTED" | "CANCELLED";
    message?: string;
    tenant?: Tenant;
    createdAt: string;
}