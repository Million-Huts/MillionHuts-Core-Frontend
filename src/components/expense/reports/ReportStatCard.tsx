import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    description?: string;
}

export default function ReportStatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden relative">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            {title}
                        </p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {value}
                        </h3>
                        {description && (
                            <p className="text-xs text-slate-400 mt-1">{description}</p>
                        )}
                    </div>
                    <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>
                {/* Subtle decorative background shape */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${color.replace('text', 'bg')}`} />
            </CardContent>
        </Card>
    );
}