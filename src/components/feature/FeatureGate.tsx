import { UpgradeCard } from "./UpgradeCard";

type FeatureGateProps = {
    allowed: boolean;
    feature: string;
    children: React.ReactNode;
};

export function FeatureGate({ allowed, feature, children }: FeatureGateProps) {
    if (allowed) return <>{children}</>;

    return <UpgradeCard feature={feature} />;
}