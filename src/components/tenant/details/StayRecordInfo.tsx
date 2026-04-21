// components/tenant/details/StayRecordInfo.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Home,
    Banknote,
    CalendarDays,
    ShieldCheck,
    ArrowRightLeft,
    Download,
    LogOut
} from "lucide-react";

import { formatDate } from "@/lib/utils";

interface Props {
    stayInfo: any;
    onTransfer: () => void;
    onMoveOut: () => void;
}

export default function StayRecordInfo({
    stayInfo,
    onTransfer,
    onMoveOut
}: Props) {

    if (!stayInfo) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-sm bg-muted/5">
                <p className="text-muted-foreground font-bold">No active stay record found.</p>
            </div>
        );
    }

    const metrics = [
        {
            label: "Assigned Room",
            value: stayInfo.room?.name ? `Room ${stayInfo.room.name}` : 'Unassigned',
            icon: Home
        },
        {
            label: "Monthly Rent",
            value: `₹${stayInfo.rent.toLocaleString()}`,
            icon: Banknote
        },
        {
            label: "Security Deposit",
            value: `₹${stayInfo.deposit?.toLocaleString() || 0}`,
            icon: ShieldCheck
        },
        {
            label: "Onboarding Date",
            value: formatDate(stayInfo.startDate),
            icon: CalendarDays
        },
    ];

    return (
        <Card className="border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden">

            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-border/40 bg-muted/10">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                        Agreement Details
                    </p>
                    <CardTitle className="text-xl font-black tracking-tight">
                        Active Stay Configuration
                    </CardTitle>
                </div>

                {/* Actions */}
                <div className="flex gap-2">

                    {/* Agreement Download */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(stayInfo.agreementUrl)}
                    >
                        <Download size={14} className="mr-2" />
                        Agreement
                    </Button>

                    {/* Room Transfer */}
                    <Button
                        size="sm"
                        onClick={onTransfer}
                        variant="outline"
                    >
                        <ArrowRightLeft size={14} className="mr-2" />
                        Transfer
                    </Button>

                    {/* Move Out */}
                    <Button
                        size="sm"
                        onClick={onMoveOut}
                        className="bg-destructive text-white"
                    >
                        <LogOut size={14} className="mr-2" />
                        Move Out
                    </Button>

                </div>
            </CardHeader>

            {/* Metrics */}
            <CardContent className="p-0">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {metrics.map((item, idx) => (
                        <div key={idx} className="p-6 border-r border-border/40">
                            <div className="text-xs text-muted-foreground uppercase mb-1">
                                {item.label}
                            </div>
                            <div className="text-xl font-bold">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status */}
                <div className="px-8 py-4 bg-primary/5 border-t flex justify-between items-center">
                    <Badge className="bg-emerald-500 text-white">
                        {stayInfo.status}
                    </Badge>

                    {stayInfo.endDate && (
                        <span className="text-xs text-muted-foreground">
                            Ends: {formatDate(stayInfo.endDate)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}