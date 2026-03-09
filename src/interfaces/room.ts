export interface Room {
    id: string;
    pgId: string;
    floorId: string;
    name: string;
    roomType: "AC" | "NORMAL";
    sharing: string;
    status: string;
    capacity: number;
    occupiedCount: number;
    rent: number;
    sizeSqFt?: number;
    features: string[];
}