// components/tenant/TenantStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, Home } from "lucide-react";

export default function TenantStats({ totalTenants, pendingApps, rooms }: any) {
    const totalCapacity = rooms.reduce((acc: number, r: any) => acc + (r.capacity || 0), 0);
    const occupancyRate = totalCapacity > 0 ? (totalTenants / totalCapacity) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-primary-foreground/80 text-sm font-medium">Total Residents</p>
                            <h3 className="text-3xl font-bold mt-1">{totalTenants}</h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>Occupancy</span>
                            <span>{Math.round(occupancyRate)}%</span>
                        </div>
                        <Progress value={occupancyRate} className="h-1 bg-white/20" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Pending Apps</p>
                            <h3 className="text-3xl font-bold mt-1">{pendingApps}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <UserPlus size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Needs your review</p>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Free Beds</p>
                            <h3 className="text-3xl font-bold mt-1">{totalCapacity - totalTenants}</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Home size={20} />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Across all floors</p>
                </CardContent>
            </Card>
        </div>
    );
}