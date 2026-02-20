// pages/Property/PGDetails/components/DetailsForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { apiPrivate } from "@/lib/api";
import { toNumber } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DetailsForm({ details, pgId, onCancel, onUpdated }: any) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            pgId,
            contactNumber: formData.get("contactNumber"),
            registrationNo: formData.get("registrationNo") || null,
            messAvailable: formData.get("messAvailable") === "on",
            pgType: formData.get("pgType") || null,
            messType: formData.get("messType") || null,
            rentStart: toNumber(formData.get("rentStart")),
            rentUpto: toNumber(formData.get("rentUpto")),
            rentCycleDay: toNumber(formData.get("rentCycleDay")),
            noticePeriod: toNumber(formData.get("noticePeriod")),
            lateFee: toNumber(formData.get("lateFee")),
            totalFloors: toNumber(formData.get("totalFloors")),
        };

        try {
            await apiPrivate.patch(`/pgs/${pgId}/details`, payload);
            toast.success("Settings updated");
            onUpdated(payload);
        } catch (err: any) {
            toast.error("Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Details</h2>
                <p className="text-muted-foreground text-sm">Configure operational settings and financial rules.</p>
            </div>

            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormField label="Contact Number">
                        <Input name="contactNumber" defaultValue={details?.contactNumber} required />
                    </FormField>

                    <FormField label="Registration No">
                        <Input name="registrationNo" defaultValue={details?.registrationNo ?? ""} />
                    </FormField>

                    <FormField label="PG Type">
                        <Select name="pgType" defaultValue={details?.pgType}>
                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MENS">Mens</SelectItem>
                                <SelectItem value="WOMENS">Womens</SelectItem>
                                <SelectItem value="COLIVING">Co-living</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="Total Floors">
                        <Input type="number" name="totalFloors" defaultValue={details?.totalFloors ?? ""} />
                    </FormField>

                    <div className="md:col-span-2 py-4 border-t border-b my-2">
                        <h3 className="text-sm font-bold uppercase mb-4 text-primary">Rent & Billing</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField label="Min Rent"><Input type="number" name="rentStart" defaultValue={details?.rentStart ?? ""} /></FormField>
                            <FormField label="Max Rent"><Input type="number" name="rentUpto" defaultValue={details?.rentUpto ?? ""} /></FormField>
                            <FormField label="Cycle Day"><Input type="number" name="rentCycleDay" defaultValue={details?.rentCycleDay ?? ""} /></FormField>
                            <FormField label="Late Fee"><Input type="number" name="lateFee" defaultValue={details?.lateFee ?? ""} /></FormField>
                        </div>
                    </div>

                    <FormField label="Mess Type">
                        <Select name="messType" defaultValue={details?.messType ?? undefined}>
                            <SelectTrigger><SelectValue placeholder="Dietary" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VEG">Veg</SelectItem>
                                <SelectItem value="NON_VEG">Non-Veg</SelectItem>
                                <SelectItem value="MIXED">Mixed</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <div className="flex items-center gap-3 pt-8">
                        <Switch id="mess" name="messAvailable" defaultChecked={details?.messAvailable ?? false} />
                        <Label htmlFor="mess">Mess Available</Label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button type="submit">Save Settings</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

function FormField({ label, children }: any) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{label}</Label>
            {children}
        </div>
    );
}