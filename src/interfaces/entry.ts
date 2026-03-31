export type EntryType = "VISITOR" | "DELIVERY";

export type EntryStatus = 
    | "PENDING" 
    | "APPROVED" 
    | "REJECTED" 
    | "CHECKED_IN" 
    | "CHECKED_OUT";

export type EntrySource = "QR" | "GUARD";

export type GateType = "MAIN" | "SIDE" | "BACK" | "SERVICE";

export interface Gate {
    id: string;
    pgId: string;
    name: string;
    code?: string;
    isActive: boolean;
    qrToken: string;
    qrImageUrl?: string;
    type: GateType;
    createdAt: string;
    updatedAt: string;
}

export interface EntryLog {
    id: string;
    pgId: string;
    gateId: string;
    type: EntryType;
    name: string;
    phone?: string;
    purpose?: string;
    deliveryFrom?: string;
    status: EntryStatus;
    createdByType: EntrySource;
    checkInTime?: string;
    checkOutTime?: string;
    createdAt: string;
    updatedAt: string;
    gate?: Gate;
}