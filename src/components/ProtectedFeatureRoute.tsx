import { Outlet } from "react-router-dom";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { FeatureGate } from "@/components/feature/FeatureGate";

type Props = {
    type: "module" | "limit" | "financial";
    featureKey: string;
    featureName: string;
};

export function ProtectedFeatureRoute({
    type,
    featureKey,
    featureName,
}: Props) {
    const { canUseModule, canUseLimit, canUseFinancial } = useFeatureAccess();

    let allowed = true;

    if (type === "module") {
        allowed = canUseModule(featureKey as any);
    }

    if (type === "limit") {
        allowed = canUseLimit(featureKey as any);
    }

    if (type === "financial") {
        allowed = canUseFinancial(featureKey as any);
    }

    return (
        <FeatureGate allowed={allowed} feature={featureName}>
            <Outlet />
        </FeatureGate>
    );
}