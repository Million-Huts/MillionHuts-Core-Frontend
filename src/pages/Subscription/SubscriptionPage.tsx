import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Plan } from "@/interfaces/subscription";
import { useEffect, useState } from "react";
import apiPrivate from "@/lib/api";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import toast from "react-hot-toast";
import { Check, ArrowRight, LayoutDashboard } from "lucide-react";
import { SubscriptionStatusHero } from "@/components/subscription/SubscriptionStatusHero";
import { FeatureGrid } from "@/components/subscription/FeatureGrid";
import { formatFeatureUI } from "@/lib/feature-utils";
import { Badge } from "@/components/ui/badge";


export default function SubscriptionPage({ isBillingPage = false }: { isBillingPage: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { subscription, isActive, isExpired, isNone, features, refresh } = useSubscription();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    const reason = location.state?.reason;
    const feature = location.state?.feature;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await apiPrivate.get("/plans?isActive=true&isPublic=true");
                setPlans(res.data.data);
            } catch (err) {
                console.error("Failed to fetch plans", err);
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (plan: Plan) => {
        try {
            if (plan.price === 0) {
                const res = await apiPrivate.post("/subscriptions/activate-free", { planId: plan.id });
                if (res.status === 200) toast.success("Free plan activated!");
                await refresh();
                navigate("/dashboard");
                return;
            }
            toast.success("Proceeding to Upgrade...");
            navigate('/subscription/upgrade')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    const renderMessage = () => {
        if (isNone) return { title: "Unlock Power", description: "Scale your PG business with a professional management plan." };
        if (isExpired) return { title: "Plan Expired", description: "Access to premium modules has been paused. Renew to resume operations." };
        if (isActive) return { title: "Active Plan", description: "Your current toolkit for managing Million Huts properties." };
        return { title: "Subscription", description: "" };
    };

    const message = renderMessage();
    const isCurrentPlan = (p: Plan) => subscription?.planId === p.id;

    const flattenFeatures = (nestedFeatures: any) => {
        const flat: Record<string, any> = {};
        const worker = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    worker(obj[key]);
                } else {
                    flat[key] = obj[key];
                }
            }
        };
        worker(nestedFeatures);
        return flat;
    };

    if (loadingPlans) return <LoadingOverlay isLoading={loadingPlans} message="Configuring Tiers..." />;

    return (
        <div className="p-6 space-y-10 max-w-6xl mx-auto animate-in fade-in duration-700">
            {/* 1. Header & Status */}
            <SubscriptionStatusHero
                subscription={subscription}
                message={message}
                isActive={isActive}
            />

            {/* 2. Limit/Reason Alerts */}
            {reason && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
                    <ArrowRight size={16} />
                    {reason === "limit" ? `Action Required: Limit reached for ${feature}.` : "Action Required: Subscription issue detected."}
                </div>
            )}

            {/* 3. Features Section (Only if Active) */}
            {isActive && (
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Check size={14} className="text-primary" /> Active Capabilities
                    </h2>
                    <FeatureGrid features={features} />
                </div>
            )}


            {/* 3. Pricing Grid - Now shown to everyone so they can upgrade */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black uppercase italic">Tiers & Capabilities</h2>
                    <p className="text-muted-foreground text-sm">Choose a plan that matches your property scale.</p>
                </div>

                <div className={`grid grid-cols-1 ${isBillingPage ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
                    {plans.map((plan) => {
                        const isCurrent = isCurrentPlan(plan);
                        const flatFeatures = flattenFeatures(plan.features);

                        return (
                            <Card key={plan.id} className={`relative flex flex-col border-2 ${isCurrent ? 'border-primary shadow-lg scale-[1.02]' : 'border-border/50 hover:border-primary/50'} transition-all`}>

                                {/* BADGE RENDERING */}
                                <div className="absolute -top-3 left-4 flex gap-2">
                                    {plan.badge?.map((b) => (
                                        <Badge key={b} className="uppercase font-black text-[10px] tracking-tighter">
                                            {b}
                                        </Badge>
                                    ))}
                                    {isCurrent && <Badge variant="secondary" className="uppercase font-black text-[10px]">Current Plan</Badge>}
                                </div>

                                <CardContent className="p-6 flex flex-col h-full space-y-6">
                                    <div className="space-y-1 mt-2">
                                        <h3 className="font-black text-xl uppercase italic">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black">₹{plan.price / 100}</span>
                                            <span className="text-xs text-muted-foreground font-bold tracking-widest">/ Month</span>
                                        </div>
                                    </div>

                                    <ul className="flex-1 space-y-3">
                                        {Object.entries(flatFeatures).map(([key, value]) => {
                                            const featUI = formatFeatureUI(key, value);
                                            // Skip if boolean false
                                            if (typeof value === "boolean" && !value) return null;

                                            return (
                                                <li key={key} className="flex items-start gap-2 text-sm">
                                                    <featUI.icon size={14} className="mt-0.5 text-primary shrink-0" />
                                                    <span className="text-muted-foreground leading-tight">
                                                        {featUI.label}: <strong className="text-foreground">{featUI.status}</strong>
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <Button
                                        className="w-full font-bold uppercase tracking-widest h-11"
                                        variant={isCurrent ? "outline" : "default"}
                                        disabled={isCurrent}
                                        onClick={() => handleSubscribe(plan)}
                                    >
                                        {isCurrent ? "Active" : plan.price === 0 ? "Get Started" : "Upgrade Now"}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* 4. Bottom Actions */}
            {isActive && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t justify-center">
                    <Button variant="ghost" className="gap-2 font-bold uppercase tracking-widest" onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard size={18} /> Back to Management
                    </Button>
                </div>
            )}

        </div>
    );
}