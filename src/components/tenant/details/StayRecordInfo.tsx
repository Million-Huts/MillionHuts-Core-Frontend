// components/tenant/details/StayRecordInfo.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Home, Banknote, CalendarDays, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
    stayInfo: any;
    onEdit: () => void;
}

export default function StayRecordInfo({ stayInfo, onEdit }: Props) {
    if (!stayInfo) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-sm bg-muted/5">
                <div className="p-4 bg-muted/20 rounded-sm mb-4 text-muted-foreground">
                    <ArrowRightLeft size={32} />
                </div>
                <p className="text-muted-foreground font-bold">No active stay record found.</p>
                <Button variant="link" onClick={onEdit} className="text-primary font-black uppercase tracking-widest text-[10px]">
                    Initialize Stay Agreement
                </Button>
            </div>
        );
    }

    const metrics = [
        { label: "Assigned Room", value: stayInfo.room?.name ? `Room ${stayInfo.room.name}` : 'Unassigned', icon: Home, color: "text-primary" },
        { label: "Monthly Rent", value: `₹${stayInfo.rent.toLocaleString()}`, icon: Banknote, color: "text-emerald-500" },
        { label: "Security Deposit", value: `₹${stayInfo.deposit.toLocaleString()}`, icon: ShieldCheck, color: "text-blue-500" },
        { label: "Onboarding Date", value: formatDate(stayInfo.startDate), icon: CalendarDays, color: "text-muted-foreground" },
    ];

    return (
        <Card className="border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-border/40 bg-muted/10">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Agreement Details</p>
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                        Active Stay Configuration
                    </CardTitle>
                </div>
                <Button
                    size="sm"
                    onClick={onEdit}
                    variant="outline"
                    className="rounded-sm px-4 font-bold border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg shadow-primary/5"
                >
                    <Pencil size={14} className="mr-2" /> Modify Agreement
                </Button>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-8 border-b sm:border-b-0 sm:border-r border-border/40 last:border-r-0 hover:bg-primary/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`p-2 rounded-full bg-background border border-border/50 ${item.color}`}>
                                    <item.icon size={14} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">
                                    {item.label}
                                </span>
                            </div>
                            <div className="text-2xl font-black tracking-tight text-foreground">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Strip */}
                <div className="px-8 py-4 bg-primary/5 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Status:</span>
                        <Badge
                            className={`rounded-lg px-3 py-0.5 font-bold text-[10px] uppercase tracking-tighter ${stayInfo.status === 'ACTIVE'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-white'
                                }`}
                        >
                            {stayInfo.status}
                        </Badge>
                    </div>
                    {stayInfo.endDate && (
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Agreement Ends: {formatDate(stayInfo.endDate)}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}