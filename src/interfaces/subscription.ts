// ================= PLAN =================

export type PlanInterval = "MONTHLY" | "YEARLY";

export interface PlanDiscount {
    id: string;
    type: "PERCENTAGE" | "AMOUNT";
    value: number;
    validFrom: string;
    validTill: string;
}

export interface Plan {
    id: string;
    name: string;
    description?: string;

    price: number; // in paise
    currency: string;

    interval: PlanInterval;

    features: Record<string, any>;
    badge?: string[];

    isActive: boolean;
    isPublic: boolean;

    discounts?: PlanDiscount[];

    createdAt: string;
    updatedAt: string;
}

// ================= SUBSCRIPTION =================

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface Subscription {
    id: string;

    userId: string;
    planId: string;

    status: SubscriptionStatus;

    startedAt: string;
    expiresAt: string | null;

    planSnapshot: {
        name: string;
        features: Record<string, any>;
    };

    pricePaid: number;
    currency: string;

    paymentStatus: "FREE" | "PENDING" | "SUCCESS" | "FAILED";

    createdAt: string;
    updatedAt?: string;
}

// ================= API RESPONSES =================

export interface GetMySubscriptionResponse {
    current: Subscription | null;
    history: Subscription[];
}

export interface GetPlansResponse {
    data: Plan[];
}