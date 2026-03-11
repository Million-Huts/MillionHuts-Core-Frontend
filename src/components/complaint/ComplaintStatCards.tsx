import type { ComplaintStats } from "@/interfaces/complaints";
import {
    Clock,
    PlayCircle,
    CheckCircle2,
    Archive,
    AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ComplaintStatCards({ stats }: { stats: ComplaintStats }) {
    const items = [
        {
            label: "Open",
            value: stats.open,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-500/10"
        },
        {
            label: "In Progress",
            value: stats.inProgress,
            icon: PlayCircle,
            color: "text-amber-600",
            bg: "bg-amber-500/10"
        },
        {
            label: "Resolved",
            value: stats.resolved,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10"
        },
        {
            label: "Closed",
            value: stats.closed,
            icon: Archive,
            color: "text-slate-600",
            bg: "bg-slate-500/10"
        },
        {
            label: "Urgent",
            value: stats.urgent,
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-500/10"
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {items.map((item) => (
                <Card key={item.label} className="border-none shadow-sm rounded-sm bg-card overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${item.bg}`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
                                {item.label}
                            </p>
                            <h3 className="text-2xl font-black tracking-tighter text-foreground">
                                {item.value}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}