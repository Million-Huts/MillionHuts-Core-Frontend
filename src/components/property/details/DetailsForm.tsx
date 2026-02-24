import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { apiPrivate } from "@/lib/api";
import { toNumber } from "@/lib/utils";
import toast from "react-hot-toast";
import { Building2, UtensilsCrossed, Info } from "lucide-react";

interface Floor {
    label: string;
    totalRooms: number;
}

export default function DetailsForm({ details, pgId, onCancel, onUpdated }: any) {
    const [isMessAvailable, setIsMessAvailable] = useState(details?.messAvailable ?? false);
    const [numFloors, setNumFloors] = useState<number>(details?.totalFloors || 0);
    const [floorConfig, setFloorConfig] = useState<Floor[]>(details?.floorConfig || []);

    // Check if floors are already initialized
    const isAlreadyInitialized = details?.totalFloors !== null;


    // Handle floor count changes and auto-generate labels
    const handleFloorCountChange = (val: string) => {
        const count = toNumber(val);
        if (!count)
            return;
        setNumFloors(count);

        if (isAlreadyInitialized) return;

        // Create new array based on count
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
            // Only send floorConfig if it's the first time setup
            ...(!isAlreadyInitialized && { floorConfig })
        };

        try {
            await apiPrivate.patch(`/pgs/${pgId}/details`, payload);
            toast.success("Property settings saved");
            onUpdated(payload);
        } catch (err: any) {
            toast.error("Failed to update details");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Property Configuration</h2>
                <p className="text-muted-foreground text-sm">Set up your PG's operational and structural rules.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-8">
                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Contact Number">
                            <Input name="contactNumber" defaultValue={details?.contactNumber} placeholder="+91 ..." required />
                        </FormField>

                        <FormField label="Registration No (Optional)">
                            <Input name="registrationNo" defaultValue={details?.registrationNo ?? ""} placeholder="GST/Registration No" />
                        </FormField>

                        <FormField label="PG Type">
                            <Select name="pgType" defaultValue={details?.pgType}>
                                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MENS">Gents PG</SelectItem>
                                    <SelectItem value="WOMENS">Ladies PG</SelectItem>
                                    <SelectItem value="COLIVING">Co-Living</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Total Number of Floors">
                            <Input
                                type="number"
                                name="totalFloors"
                                value={numFloors}
                                onChange={(e) => handleFloorCountChange(e.target.value)}
                                min={0}
                                disabled={isAlreadyInitialized}
                            />
                        </FormField>
                    </div>

                    {/* DYNAMIC FLOOR CONFIGURATION (Only for first-time init) */}
                    {!isAlreadyInitialized && numFloors > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Building2 className="w-4 h-4" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Floor Initialization</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {floorConfig.map((floor, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50/50">
                                        <div className="flex-1">
                                            <Label className="text-[10px] uppercase text-slate-400">Label</Label>
                                            <Input
                                                value={floor.label}
                                                onChange={(e) => updateFloorData(idx, 'label', e.target.value)}
                                                className="h-8 bg-white"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <Label className="text-[10px] uppercase text-slate-400">Rooms</Label>
                                            <Select
                                                value={floor.totalRooms.toString()}
                                                onValueChange={(val) => updateFloorData(idx, 'totalRooms', toNumber(val))}
                                            >
                                                <SelectTrigger className="h-8 bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[...Array(10)].map((_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Rooms</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isAlreadyInitialized && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex gap-3 text-sm text-blue-700">
                            <Info className="w-4 h-4 mt-0.5" />
                            <p>Floor structure is already configured. Visit the "Floors" management page to add or remove rooms.</p>
                        </div>
                    )}

                    {/* RENT & MESS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400">Rent Settings</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Min Rent"><Input type="number" name="rentStart" defaultValue={details?.rentStart} /></FormField>
                                <FormField label="Max Rent"><Input type="number" name="rentUpto" defaultValue={details?.rentUpto} /></FormField>
                                <FormField label="Bill Cycle Day"><Input type="number" name="rentCycleDay" defaultValue={details?.rentCycleDay} placeholder="e.g. 1st" /></FormField>
                                <FormField label="Late Fee"><Input type="number" name="lateFee" defaultValue={details?.lateFee} /></FormField>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400">Food & Mess</h3>
                            <div className="flex items-center space-x-2 p-4 rounded-xl border border-dashed border-slate-200">
                                <Switch
                                    id="mess"
                                    checked={isMessAvailable}
                                    onCheckedChange={setIsMessAvailable}
                                />
                                <Label htmlFor="mess" className="flex items-center gap-2 cursor-pointer">
                                    <UtensilsCrossed className="w-4 h-4" /> Mess Facility Available
                                </Label>
                            </div>

                            {isMessAvailable && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <FormField label="Mess Type">
                                        <Select name="messType" defaultValue={details?.messType}>
                                            <SelectTrigger><SelectValue placeholder="Choose Diet Type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VEG">Vegetarian Only</SelectItem>
                                                <SelectItem value="NON_VEG">Non-Veg Included</SelectItem>
                                                <SelectItem value="MIXED">Mixed (Both)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button type="submit" className="px-8 shadow-md shadow-indigo-200">Save Configuration</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

function FormField({ label, children }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">{label}</Label>
            {children}
        </div>
    );
}