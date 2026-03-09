export interface Floor {
    id?: string;
    pgId: string;
    label: string;
    order?: string;
    totalRooms: number;
    publicPlaces: string[];
} 