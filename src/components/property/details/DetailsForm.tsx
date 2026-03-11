import { useState } from "react";
import { Building2, UtensilsCrossed, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { apiPrivate } from "@/lib/api";
import { toNumber } from "@/lib/utils";
import type { Details } from "@/interfaces/pg";

interface Floor {
    label: string;
    totalRooms: number;
}

type Props = {
    details: Details | null;
    pgId: string;
    onCancel: () => void;
    onUpdated: (data: Details) => void;
}

export default function DetailsForm({ details, pgId, onCancel, onUpdated }: Props) {
    const [isMessAvailable, setIsMessAvailable] = useState(details?.messAvailable ?? false);
    const [numFloors, setNumFloors] = useState<number>(details?.totalFloors || 0);
    const [floorConfig, setFloorConfig] = useState<Floor[] | []>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAlreadyInitialized = details?.totalFloors !== null && details?.totalFloors !== undefined;

    const handleFloorCountChange = (val: string) => {
        const count = toNumber(val);
        if (!count) return;
        setNumFloors(count);
        if (isAlreadyInitialized) return;

        const newConfigs: Floor[] = Array.from({ length: count }, (_, i) => ({
            label: i === 0 ? "Ground Floor" : `Floor ${i}`,
            totalRooms: 1
        }));
        setFloorConfig(newConfigs);
    };

    const updateFloorData = (index: number, field: keyof Floor, value: any) => {
        const updated = [...floorConfig];
        updated[index] = { ...updated[index], [field]: value };
        setFloorConfig(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            pgId,
            contactNumber: formData.get("contactNumber"),
            registrationNo: formData.get("registrationNo") || null,
            messAvailable: isMessAvailable,
            pgType: formData.get("pgType") || null,
            messType: isMessAvailable ? formData.get("messType") : null,
            rentStart: toNumber(formData.get("rentStart")),
            rentUpto: toNumber(formData.get("rentUpto")),
            rentCycleDay: toNumber(formData.get("rentCycleDay")),
            noticePeriod: toNumber(formData.get("noticePeriod")),
            lateFee: toNumber(formData.get("lateFee")),
            totalFloors: numFloors,
            ...(!isAlreadyInitialized && { floorConfig })
        };

        try {
            const res = await apiPrivate.patch(`/pgs/${pgId}/details`, payload);
            toast.success("Property settings saved");
            const details: Details = res.data.data.details;
            onUpdated(details);
        } catch {
            toast.error("Failed to update details");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-3xl font-black tracking-tighter">Property Configuration</h2>
                <p className="text-muted-foreground font-medium">Define your operational structure and house rules.</p>
            </div>

            <Card className="rounded-sm border-border/50 shadow-sm">
                <CardContent className="p-8 space-y-8">
                    {/* Basic Settings */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField label="Contact Number">
                            <Input name="contactNumber" defaultValue={details?.contactNumber} className="h-12 rounded-sm" required />
                        </FormField>
                        <FormField label="Registration No (Optional)">
                            <Input name="registrationNo" defaultValue={details?.registrationNo!} className="h-12 rounded-sm" />
                        </FormField>
                        <FormField label="PG Type">
                            <Select name="pgType" defaultValue={details?.pgType}>
                                <SelectTrigger className="h-12 rounded-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MENS">Gents PG</SelectItem>
                                    <SelectItem value="WOMENS">Ladies PG</SelectItem>
                                    <SelectItem value="COLIVING">Co-Living</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Total Number of Floors">
                            <Input type="number" value={numFloors} onChange={(e) => handleFloorCountChange(e.target.value)} disabled={isAlreadyInitialized} className="h-12 rounded-sm" />
                        </FormField>
                    </div>

                    {/* Floor Logic */}
                    {!isAlreadyInitialized && numFloors > 0 && (
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary">
                                <Building2 className="w-4 h-4" /> Floor Initialization
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {floorConfig.map((floor, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-sm bg-muted/30 border border-border/50">
                                        <Input value={floor.label} onChange={(e) => updateFloorData(idx, 'label', e.target.value)} className="h-10 rounded-sm bg-background" />
                                        <Select value={floor.totalRooms.toString()} onValueChange={(val) => updateFloorData(idx, 'totalRooms', toNumber(val))}>
                                            <SelectTrigger className="w-32 h-10 rounded-sm bg-background"><SelectValue /></SelectTrigger>
                                            <SelectContent>{[...Array(10)].map((_, i) => <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Rms</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rent & Mess */}
                    <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Rent Financials</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Min Rent"><Input type="number" name="rentStart" defaultValue={details?.rentStart!} className="rounded-sm" /></FormField>
                                <FormField label="Max Rent"><Input type="number" name="rentUpto" defaultValue={details?.rentUpto!} className="rounded-sm" /></FormField>
                                <FormField label="Cycle Day"><Input type="number" name="rentCycleDay" defaultValue={details?.rentCycleDay!} className="rounded-sm" /></FormField>
                                <FormField label="Late Fee"><Input type="number" name="lateFee" defaultValue={details?.lateFee!} className="rounded-sm" /></FormField>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Food & Dining</h3>
                            <div className="flex items-center justify-between p-5 rounded-sm bg-muted/30 border border-border/50">
                                <Label htmlFor="mess" className="flex items-center gap-3 cursor-pointer font-bold">
                                    <UtensilsCrossed className="w-5 h-5 text-primary" /> Mess Facility
                                </Label>
                                <Switch id="mess" checked={isMessAvailable} onCheckedChange={setIsMessAvailable} />
                            </div>
                            {isMessAvailable && (
                                <FormField label="Mess Type">
                                    <Select name="messType" defaultValue={details?.messType}>
                                        <SelectTrigger className="h-12 rounded-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VEG">Vegetarian</SelectItem>
                                            <SelectItem value="NON_VEG">Non-Vegetarian</SelectItem>
                                            <SelectItem value="MIXED">Mixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button type="submit" className="rounded-sm px-8 h-12 font-bold" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Configuration
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-sm px-8 h-12 font-bold">
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
            </div>
        </form>
    );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</Label>
            {children}
        </div>
    );
}