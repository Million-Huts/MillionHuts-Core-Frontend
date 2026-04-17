import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UpgradeCard({ feature }: { feature: string }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <h2 className="text-xl font-semibold">
                {feature} is not available in your plan
            </h2>

            <p className="text-muted-foreground text-sm max-w-md">
                Upgrade your subscription to unlock this feature and get full access.
            </p>

            <Button onClick={() => navigate("/subscription")}>
                Upgrade Plan
            </Button>
        </div>
    );
}