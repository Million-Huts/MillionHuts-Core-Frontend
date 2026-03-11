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
        <Card className="border-none shadow-sm bg-card rounded-sm overflow-hidden relative">
            <CardContent className="p-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {title}
                        </p>
                        <h3 className="text-3xl font-black tracking-tighter text-foreground">
                            {value}
                        </h3>
                        {description && (
                            <p className="text-xs font-medium text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <div className="p-4 rounded-full bg-muted/30">
                        <Icon className={`w-7 h-7 ${color}`} />
                    </div>
                </div>

                {/* Decorative background accent */}
                <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-sm opacity-[0.03] ${color.replace('text', 'bg')}`} />
            </CardContent>
        </Card>
    );
}