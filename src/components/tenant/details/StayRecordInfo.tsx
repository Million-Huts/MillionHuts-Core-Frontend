import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Home, Banknote, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StayRecordInfo({ stayInfo, onEdit }: any) {
    if (!stayInfo) return <div className="p-10 text-center">No active stay record found.</div>;

    const data = [
        { label: "Current Room", value: stayInfo.room?.name || 'N/A', icon: Home },
        { label: "Monthly Rent", value: `₹${stayInfo.rent}`, icon: Banknote },
        { label: "Security Deposit", value: `₹${stayInfo.deposit}`, icon: Banknote },
        { label: "Move-in Date", value: formatDate(stayInfo.startDate), icon: CalendarDays },
        { label: "Status", value: stayInfo.status, icon: CalendarDays },
    ];

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                <CardTitle className="text-lg">Active Stay Configuration</CardTitle>
                <Button size="sm" onClick={onEdit} variant="outline" className="gap-2">
                    <Pencil size={14} /> Update Stay
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {data.map((item, idx) => (
                        <div key={idx} className="p-6 border-r last:border-r-0 flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                <item.icon size={12} /> {item.label}
                            </span>
                            <span className="text-lg font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}