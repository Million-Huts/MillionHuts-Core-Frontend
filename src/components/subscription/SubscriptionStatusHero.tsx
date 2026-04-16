import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ShieldCheck, Zap } from "lucide-react";
import type { Subscription } from "@/interfaces/subscription";

interface Props {
    subscription: Subscription | null;
    message: { title: string; description: string };
    isActive: boolean;
}

export const SubscriptionStatusHero = ({ subscription, message, isActive }: Props) => {
    return (
        <Card className="border-none bg-gradient-to-br from-primary/5 via-transparent to-primary/5 shadow-inner">
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">{message.title}</h1>
                            {isActive && <Badge className="bg-emerald-500 hover:bg-emerald-600 animate-pulse">Live</Badge>}
                        </div>
                        <p className="text-muted-foreground max-w-md">{message.description}</p>
                    </div>

                    {subscription && (
                        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-background/50 backdrop-blur border border-border/50 min-w-[240px]">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Zap size={16} className="text-primary" />
                                <span>{subscription.planSnapshot?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck size={14} />
                                <span className="capitalize">Status: {subscription.status.toLowerCase()}</span>
                            </div>
                            {subscription.expiresAt && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar size={14} />
                                    <span>Renews: {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};