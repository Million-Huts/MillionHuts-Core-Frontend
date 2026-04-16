// /context/SubscriptionContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import type { Subscription } from "@/interfaces/subscription";

type SubscriptionContextType = {
    subscription: Subscription | null;
    loading: boolean;

    isActive: boolean;
    isExpired: boolean;
    isNone: boolean;

    features: Record<string, any>;

    refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider = ({ children }: any) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubscription = async () => {
        try {
            setLoading(true);

            const res = await api.get("/subscriptions/me");

            const current = res.data.current;

            setSubscription(current);
        } catch (err) {
            console.error(err);
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    // ================= DERIVED STATES =================

    const isNone = !subscription;

    const isExpired =
        subscription &&
        subscription.expiresAt &&
        new Date(subscription.expiresAt) < new Date();

    const isActive =
        subscription &&
        subscription.status === "ACTIVE" &&
        !isExpired;

    const features = subscription?.planSnapshot?.features || {
        limits: {},
        modules: {},
        financial: {},
        analytics: {},
        support: {},
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                loading,
                isActive: !!isActive,
                isExpired: !!isExpired,
                isNone,
                features,
                refresh: fetchSubscription,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const ctx = useContext(SubscriptionContext);

    if (!ctx) {
        throw new Error("useSubscription must be used inside provider");
    }

    return ctx;
};