// /hooks/useFeatureAccess.ts

import { useSubscription } from "@/context/SubscriptionContext";

export const useFeatureAccess = () => {
    const { features, isActive, isExpired } = useSubscription();

    // ================= LIMIT ACCESS =================
    const canUseLimit = (
        key: keyof typeof features.limits,
        currentValue?: number
    ) => {
        if (!isActive) return false;

        const value = features?.limits?.[key];

        // UNLIMITED
        if (value === "UNLIMITED") return true;

        // numeric limit
        if (typeof value === "number") {
            if (currentValue === undefined) return true;
            return currentValue < value;
        }

        return false;
    };

    // ================= MODULE ACCESS =================
    const canUseModule = (
        key: keyof typeof features.modules
    ) => {
        if (!isActive) return false;

        return !!features?.modules?.[key];
    };

    // ================= FINANCIAL =================
    const canUseFinancial = (
        key: keyof typeof features.financial
    ) => {
        if (!isActive) return false;

        return !!features?.financial?.[key];
    };

    // ================= ANALYTICS =================
    const canUseAnalytics = (
        key: keyof typeof features.analytics
    ) => {
        if (!isActive) return false;

        return !!features?.analytics?.[key];
    };

    // ================= SUPPORT =================
    const canUseSupport = (
        key: keyof typeof features.support
    ) => {
        if (!isActive) return false;

        return !!features?.support?.[key];
    };

    // ================= GENERIC ACCESS (OPTIONAL) =================
    const canAccess = (path: string, currentValue?: number) => {
        if (!isActive) return false;

        const [section, key] = path.split(".");

        const value = features?.[section]?.[key];

        if (value === "UNLIMITED") return true;

        if (typeof value === "boolean") return value;

        if (typeof value === "number") {
            if (currentValue === undefined) return true;
            return currentValue < value;
        }

        return false;
    };

    return {
        features,

        isActive,
        isExpired,

        // 🔥 main helpers
        canUseLimit,
        canUseModule,
        canUseFinancial,
        canUseAnalytics,
        canUseSupport,

        // 🔥 flexible fallback
        canAccess,
    };
};