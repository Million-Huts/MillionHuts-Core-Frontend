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
            bg: "bg-blue-50"
        },
        {
            label: "In Progress",
            value: stats.inProgress,
            icon: PlayCircle,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: "Resolved",
            value: stats.resolved,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Closed",
            value: stats.closed,
            icon: Archive,
            color: "text-slate-600",
            bg: "bg-slate-100"
        },
        {
            label: "Urgent",
            value: stats.urgent,
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {items.map((item) => (
                <Card key={item.label} className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                        <div className={`p-2 rounded-xl ${item.bg}`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                {item.label}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {item.value}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}