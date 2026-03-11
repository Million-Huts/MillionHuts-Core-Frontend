import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, AlertTriangle, CheckCircle2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfrastructureData {
    createdRooms: number;
    floors: number;
    missingRooms: number;
    floorsWithMissingRooms: number;
}

interface InfrastructureCardProps {
    data: InfrastructureData;
}

export default function InfrastructureCard({ data }: InfrastructureCardProps) {
    const isIncomplete = data.missingRooms > 0;

    return (
        <Card className={cn(
            "border-border bg-card rounded-sm shadow-sm transition-all hover:shadow-md overflow-hidden",
            isIncomplete && "ring-1 ring-amber-500/10"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Infrastructure
                    </CardTitle>
                    <p className="text-xs font-medium text-muted-foreground/60">Property Architecture</p>
                </div>
                <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <Layers className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tighter text-foreground">
                            {data.createdRooms}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Rooms Created
                        </p>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5 text-foreground">
                            <Building2 className="h-4 w-4 text-primary" />
                            <p className="text-xl font-black tracking-tight">{data.floors}</p>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Total Floors
                        </p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className={cn(
                    "p-4 rounded-sm flex items-center gap-4 border transition-colors",
                    isIncomplete
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                )}>
                    <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                        isIncomplete ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                        {isIncomplete ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                            Status
                        </p>
                        <p className="text-xs font-bold leading-tight">
                            {isIncomplete
                                ? `${data.missingRooms} pending setup on ${data.floorsWithMissingRooms} floors`
                                : "Architecture fully configured"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}