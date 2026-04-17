import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { PG } from "@/interfaces/pg";
import LocationPicker from "./LocationPicker";

interface Props {
    pg: PG;
    onCancel: () => void;
    onUpdated: (data: Partial<PG>) => void;
}

export default function PGEditForm({ pg, onCancel, onUpdated }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coords, setCoords] = useState({ lat: pg.latitude || 12.9716, lng: pg.longitude || 77.5946 });
    const [status, setStatus] = useState(pg.status);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const payload = {
            ...Object.fromEntries(formData),
            status,
            latitude: coords.lat,
            longitude: coords.lng
        };

        try {
            await apiPrivate.patch(`/pgs/${pg.id}`, payload);
            toast.success("Establishment updated");
            onUpdated(payload as Partial<PG>);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Configure Property</h2>
                    <p className="text-muted-foreground font-medium">Update operational status and physical location.</p>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <Card className="lg:col-span-2 rounded-xl border-none bg-card shadow-sm">
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Property Name</Label>
                                <Input name="name" defaultValue={pg.name} className="rounded-lg bg-muted/30 border-none h-12" required />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Operational Status</Label>
                                <Select value={status} onValueChange={(val: "DRAFT" | "ACTIVE" | "INACTIVE") => setStatus(val)}>
                                    <SelectTrigger className="h-12 bg-muted/30 border-none rounded-lg font-bold">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT" className="font-bold text-orange-600">DRAFT</SelectItem>
                                        <SelectItem value="ACTIVE" className="font-bold text-green-600">ACTIVE</SelectItem>
                                        <SelectItem value="INACTIVE" className="font-bold text-destructive">INACTIVE</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Locality</Label>
                                <Input name="locality" defaultValue={pg.locality} className="rounded-lg bg-muted/30 border-none h-12" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">City</Label>
                                <Input name="city" defaultValue={pg.city} className="rounded-lg bg-muted/30 border-none h-12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Address</Label>
                            <Textarea name="address" defaultValue={pg.address} className="rounded-lg bg-muted/30 border-none min-h-[100px]" />
                        </div>
                    </CardContent>
                </Card>

                {/* Map Selection Card */}
                <Card className="rounded-xl border-none bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pin Location</span>
                    </div>
                    <div className="h-[300px] w-full relative bg-muted">
                        <LocationPicker
                            initialCoords={coords}
                            onChange={(c) => setCoords(c)}
                        />
                    </div>
                    <div className="p-4 bg-primary/5">
                        <p className="text-[9px] text-muted-foreground leading-tight">
                            Drag the map to center the marker on your property. These coordinates are used for tenant navigation.
                        </p>
                    </div>
                </Card>
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" className="rounded-xl px-10 h-14 font-black shadow-lg shadow-primary/20" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Updates
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl px-8 h-14 font-bold">
                    Discard
                </Button>
            </div>
        </motion.form>
    );
}