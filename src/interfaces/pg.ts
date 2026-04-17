export interface CoverImage {
    id?: string;
    url?: string;
}

export interface PG {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
    locality?: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
    coverImage?: CoverImage | null;
    completionPercent?: number;
    role: "OWNER" | "MANAGER" | "STAFF";
    staffType: "SECURITY" | "CLEANING" | "MESS" | "MAINTENANCE" | "OTHER" | null;
}

export interface PGSummary {
    id: string;
    name: string;
    role: "OWNER" | "MANAGER" | "STAFF";
    staffType: "SECURITY" | "CLEANING" | "MESS" | "MAINTENANCE" | "OTHER" | null;
}


export interface Details {
    id?: string;
    pgId: string;
    contactNumber: string;
    registrationNo?: string | null;
    messAvailable?: boolean | null;
    pgType?: "MENS" | "WOMENS" | "COLIVING";
    rentStart?: number | null;
    rentUpto?: number | null;
    messType?: "VEG" | "NON_VEG" | "MIXED";
    rentCycleDay?: number | null;
    noticePeriod?: number | null;
    lateFee?: number | null;
    totalFloors?: number | null;
}
