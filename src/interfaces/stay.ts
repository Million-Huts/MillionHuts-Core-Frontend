// @/interfaces/stay.ts
import type { PG } from "./pg";
import type { Room } from "./room";

export type StayStatus = "ACTIVE" | "VACATED" | "TERMINATED";

export interface TenantStay {
    id: string;
    tenantId: string;
    pgId: string;
    roomId?: string | null;

    rent: string | number;
    deposit?: string | number | null;

    startDate: string; // ISO Date
    endDate?: string | null;

    status: StayStatus;

    agreementUrl?: string | null;
    agreementSignedAt?: string | null;

    moveOutReason?: string | null;
    vacatedAt?: string | null;

    // Relations
    pg?: PG;
    room?: Room | null;

    createdAt: string;
}