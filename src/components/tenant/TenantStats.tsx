// components/tenant/TenantStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, Home, TrendingUp } from "lucide-react";

interface Props {
    totalTenants: number;
    pendingApps: number;
    rooms: any[];
}

export default function TenantStats({ totalTenants, pendingApps, rooms }: Props) {
    const totalCapacity = rooms.reduce((acc: number, r: any) => acc + (r.capacity || 0), 0);
    const occupancyRate = totalCapacity > 0 ? (totalTenants / totalCapacity) * 100 : 0;
    const freeBeds = totalCapacity - totalTenants;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Occupancy Card - High Impact Primary */}
            <Card className="relative overflow-hidden border-none shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-sm">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Live Residents</p>
                            <h3 className="text-4xl font-black mt-1 tracking-tighter">{totalTenants}</h3>
                        </div>
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-inner">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/80">
                                <TrendingUp size={12} /> Occupancy Rate
                            </div>
                            <span className="text-lg font-black">{Math.round(occupancyRate)}%</span>
                        </div>
                        <Progress
                            value={occupancyRate}
                            className="h-2 bg-white/20 border-none"
                            // Ensure the progress indicator is white for contrast against primary
                            indicatorClassName="bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                    </div>
                </CardContent>
                {/* Abstract Background Shape */}
                <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </Card>

            {/* Pending Applications Card */}
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 rounded-sm">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Pending Review</p>
                            <h3 className="text-4xl font-black mt-1 tracking-tighter text-foreground">{pendingApps}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 text-primary rounded-full">
                            <UserPlus size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full animate-pulse ${pendingApps > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <p className="text-xs font-semibold text-muted-foreground">
                            {pendingApps > 0 ? "Requires immediate action" : "All caught up"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Vacancy Card */}
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 rounded-sm">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Available Beds</p>
                            <h3 className="text-4xl font-black mt-1 tracking-tighter text-foreground">{freeBeds}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
                            <Home size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-8 flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">Capacity:</span> {totalCapacity} total spots
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}