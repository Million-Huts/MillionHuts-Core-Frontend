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
    status: string;
    coverImage?: CoverImage | null;
    completionPercent?: number;
}

export interface PGSummary {
    id: string;
    name: string;
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
