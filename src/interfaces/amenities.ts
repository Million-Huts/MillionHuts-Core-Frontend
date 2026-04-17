export interface Amenity {
    id: string;
    name: string;
    isActive: boolean;
}

export interface Category {
    id: string;
    name: string;
    amenities: Amenity[];
}

export interface CustomAmenity {
    id: string;
    name: string;
}

export interface PGAmenitiesResponse {
    amenities: { amenityId: string }[];
    customAmenities: CustomAmenity[];
}