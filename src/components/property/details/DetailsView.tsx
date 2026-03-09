import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Info as InfoIcon, Utensils, IndianRupee, PlusCircle, Building2, Phone, FileText, Layers } from "lucide-react";
import type { Details } from "@/interfaces/pg";

export default function DetailsView({ details, onEdit }: { details: Details | null; onEdit: () => void }) {
    if (!details) {
        return (
            <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-[2rem] bg-muted/20 border-border/50">
                <div className="p-4 rounded-full bg-primary/10 mb-4 text-primary">
                    <InfoIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black tracking-tight mb-1">Configuration Needed</h3>
                <p className="text-muted-foreground mb-6 max-w-sm text-center">Set up your PG's operational rules to enable booking and tenant management.</p>
                <Button onClick={onEdit} className="rounded-full px-8 h-12 font-bold gap-2">
                    <PlusCircle className="h-4 w-4" /> Configure Property
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Property Specifications</h2>
                    <p className="text-muted-foreground font-medium">Operational, financial, and structural overview.</p>
                </div>
                <Button variant="outline" onClick={onEdit} className="rounded-full gap-2 px-6">
                    <Edit3 className="h-4 w-4" /> Edit Details
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2rem] border-border/50 shadow-sm">
                    <CardContent className="p-8 space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <InfoIcon className="h-4 w-4 text-primary" /> Logistics & Structure
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoRow label="PG Category" value={details.pgType} icon={Building2} />
                            <InfoRow label="Total Floors" value={details.totalFloors} icon={Layers} />
                            <InfoRow label="Contact Number" value={details.contactNumber} icon={Phone} />
                            <InfoRow label="Registration" value={details.registrationNo} icon={FileText} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-border/50 shadow-sm">
                    <CardContent className="p-8 space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-primary" /> Food & Dining
                        </h4>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="p-3 bg-background rounded-xl border shadow-sm text-primary">
                                <Utensils className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mess Status</p>
                                <p className="text-sm font-semibold">{details.messAvailable ? "Available" : "Not Provided"}</p>
                            </div>
                            {details.messAvailable && (
                                <Badge variant="secondary" className="ml-auto font-bold rounded-full">{details.messType}</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 rounded-[2rem] border-border/50 shadow-sm">
                    <CardContent className="p-8 space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-primary" /> Financial Framework
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Stat label="Min Rent" value={`₹${details.rentStart}`} />
                            <Stat label="Max Rent" value={`₹${details.rentUpto}`} />
                            <Stat label="Rent Cycle" value={`${details.rentCycleDay}${getOrdinal(details.rentCycleDay)}`} />
                            <Stat label="Notice Period" value={`${details.noticePeriod} Days`} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value || "—"}</p>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">{label}</p>
            <p className="text-xl font-black mt-1">{value}</p>
        </div>
    );
}

function getOrdinal(d: any) {
    if (!d) return "";
    const n = parseInt(d);
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}