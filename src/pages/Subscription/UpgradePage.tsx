import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    CreditCard,
    Zap,
    TrendingUp
} from "lucide-react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { formatFeatureUI } from "@/lib/feature-utils";

type Plan = {
    id: string;
    name: string;
    price: number;
    interval: "MONTHLY" | "YEARLY";
    features: Record<string, any>;
    badges?: string[]; // Added to match your new schema
};

// Utility to flatten the nested feature object
const flattenFeatures = (obj: any): Record<string, any> => {
    const flat: Record<string, any> = {};
    const recurse = (current: any) => {
        for (const key in current) {
            if (typeof current[key] === 'object' && current[key] !== null && !Array.isArray(current[key])) {
                recurse(current[key]);
            } else {
                flat[key] = current[key];
            }
        }
    };
    recurse(obj);
    return flat;
};

export default function UpgradePage() {
    const navigate = useNavigate();
    const { subscription, refresh } = useSubscription();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get("/plans?isActive=true&isPublic=true");
                setPlans(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load plans");
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    // ================= HELPERS =================
    const currentPlanId = subscription?.planId;

    const getRemainingDays = () => {
        if (!subscription?.expiresAt) return 0;
        const now = new Date();
        const expiry = new Date(subscription.expiresAt);
        const diff = expiry.getTime() - now.getTime();
        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    };

    const calculateUpgradeAmount = (plan: Plan) => {
        if (!subscription || !subscription.pricePaid) return plan.price;
        const remainingDays = getRemainingDays();

        // Ensure we handle free plans or zero-prices to avoid NaN
        const currentDaily = (subscription.pricePaid || 0) / 30;
        const newDaily = plan.price / 30;
        const amount = (newDaily - currentDaily) * remainingDays;

        return Math.max(Math.ceil(amount), 0);
    };

    const handleUpgrade = async (plan: Plan) => {
        if (plan.id === currentPlanId) return;
        try {
            if (plan.price === 0) {
                await api.post("/subscriptions/activate-free", { planId: plan.id });
                toast.success("Plan updated successfully!");
                await refresh();
                navigate("/dashboard");
                return;
            }

            const res = await api.post("/subscriptions/subscribe", { planId: plan.id });
            console.log(res.data);

            toast.success("Redirecting to checkout...");
            // Handle redirect logic here based on your PG integration
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Upgrade failed");
        }
    };

    if (loading) return <LoadingOverlay isLoading={true} message="Analyzing Tiers..." />;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* BACK ACTION */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2 text-muted-foreground hover:text-foreground font-bold uppercase tracking-tighter"
            >
                <ChevronLeft size={16} /> Back to Subscription
            </Button>

            {/* HEADER */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <TrendingUp className="text-primary" /> Level Up MillionHuts
                </h1>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Switching plans is seamless. We apply a pro-rated credit from your current plan, so you only pay for the value you haven't used yet.
                </p>
            </div>

            {/* CURRENT PLAN SPOTLIGHT */}
            {subscription && (
                <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Zap size={80} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
                                    <Zap size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Current Active Tier</p>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tight">{subscription.planSnapshot?.name}</h2>
                                </div>
                            </div>
                            <div className="flex gap-8 bg-background/50 p-4 rounded-xl border border-primary/10">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Days Left</p>
                                    <p className="font-black text-xl tabular-nums">
                                        {getRemainingDays()}
                                    </p>
                                </div>
                                <div className="text-right border-l pl-8">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Renews On</p>
                                    <p className="font-black text-xl tabular-nums">
                                        {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* UPGRADE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isCurrent = plan.id === currentPlanId;
                    const upgradeAmount = calculateUpgradeAmount(plan);
                    const flatFeatures = flattenFeatures(plan.features);

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col transition-all duration-300 border-2 ${isCurrent
                                ? "opacity-60 bg-muted/20 border-dashed border-border"
                                : "hover:shadow-2xl hover:border-primary/50 border-border/50 shadow-sm"
                                }`}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="font-black uppercase italic text-xl tracking-tight">
                                        {plan.name}
                                    </CardTitle>
                                    {isCurrent && <Badge variant="outline" className="font-black uppercase text-[10px]">Active</Badge>}
                                </div>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-black">₹{plan.price / 100}</span>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                        /{plan.interval === "MONTHLY" ? "Month" : "Year"}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col space-y-6">
                                <ul className="flex-1 space-y-3 border-t pt-4">
                                    {Object.entries(flatFeatures).map(([key, value]) => {
                                        const feature = formatFeatureUI(key, value);
                                        if (typeof value === "boolean" && !value) return null;

                                        return (
                                            <li key={key} className="flex items-start gap-2 text-sm">
                                                <feature.icon size={14} className="mt-0.5 text-primary shrink-0" />
                                                <span className="text-muted-foreground leading-tight font-medium">
                                                    {feature.label}: <strong className="text-foreground">{feature.status}</strong>
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {!isCurrent && (
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Pro-Rata Pay</span>
                                            <span className="text-lg font-black text-emerald-700">₹{(upgradeAmount / 100).toFixed(2)}</span>
                                        </div>
                                        <p className="text-[9px] text-emerald-600/70 font-bold uppercase">Difference for remaining {getRemainingDays()} days</p>
                                    </div>
                                )}

                                <Button
                                    disabled={isCurrent}
                                    onClick={() => handleUpgrade(plan)}
                                    className={`w-full font-black uppercase tracking-widest h-12 ${!isCurrent && "shadow-lg shadow-primary/20"
                                        }`}
                                    variant={isCurrent ? "secondary" : "default"}
                                >
                                    {isCurrent ? "Current Plan" : (
                                        <span className="flex items-center gap-2">
                                            <CreditCard size={18} /> Upgrade Now
                                        </span>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}