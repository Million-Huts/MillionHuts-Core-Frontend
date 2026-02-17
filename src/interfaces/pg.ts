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
