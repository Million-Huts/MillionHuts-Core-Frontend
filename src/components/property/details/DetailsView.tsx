// pages/Property/PGDetails/components/DetailsView.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Info as InfoIcon, Utensils, IndianRupee, PlusCircle } from "lucide-react";
import type { Details } from "@/interfaces/pg";

export default function DetailsView({ details, onEdit }: { details: Details | null; onEdit: () => void }) {
    if (!details) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/30">
                <p className="text-muted-foreground mb-4 text-center">No extended details configured for this property yet.</p>
                <Button onClick={onEdit} className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Add Property Details
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Technical Details</h2>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                    <Edit3 className="h-4 w-4" /> Edit Details
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Logistics */}
                <SectionCard title="Logistics" icon={InfoIcon}>
                    <Info label="PG Type" value={details.pgType} isBadge />
                    <Info label="Contact" value={details.contactNumber} />
                    <Info label="Floors" value={details.totalFloors} />
                    <Info label="Reg No." value={details.registrationNo} />
                </SectionCard>

                {/* Food & Mess */}
                <SectionCard title="Mess & Food" icon={Utensils}>
                    <Info label="Mess Availability" value={details.messAvailable ? "Available" : "Not Available"} />
                    <Info label="Dietary Preference" value={details.messType} />
                </SectionCard>

                {/* Financials */}
                <SectionCard title="Rent & Financials" icon={IndianRupee} className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Info label="Min Rent" value={`₹${details.rentStart ?? 0}`} />
                        <Info label="Max Rent" value={`₹${details.rentUpto ?? 0}`} />
                        <Info label="Rent Cycle Day" value={`${details.rentCycleDay}${getOrdinal(details.rentCycleDay)}`} />
                        <Info label="Notice Period" value={`${details.noticePeriod} Days`} />
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, className }: any) {
    return (
        <Card className={className}>
            <CardHeader className="pb-3 border-b mb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                    <Icon className="h-4 w-4" /> {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

function Info({ label, value, isBadge }: { label: string; value?: any; isBadge?: boolean }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            {isBadge && value ? (
                <Badge variant="secondary" className="font-medium">{value}</Badge>
            ) : (
                <p className="font-semibold text-sm">{value ?? "—"}</p>
            )}
        </div>
    );
}

function getOrdinal(d: any) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}