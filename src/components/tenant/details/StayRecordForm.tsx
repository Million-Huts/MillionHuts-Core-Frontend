// components/tenant/details/StayRecordForm.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { TenantStay } from "@/pages/Tenant/TenantDetails";
import { Label } from "@/components/ui/label";
import { usePG } from "@/context/PGContext";
import type { Room } from "@/interfaces/room";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toISODateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Home, IndianRupee, Calendar, Activity, Save, X } from "lucide-react";

interface Props {
    stayInfo: TenantStay;
    onSave: () => void;
    onCancel: () => void;
}

export default function StayRecordForm({ stayInfo, onSave, onCancel }: Props) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { currentPG } = usePG();
    const [rooms, setRooms] = useState<Room[] | []>([]);
    const pgId = currentPG?.id;

    const getRooms = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.data.rooms);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRooms();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);

        const payload = {
            id: stayInfo.id,
            pgId: stayInfo.pgId,
            tenantId: stayInfo.tenantId,
            roomId: formData.get("roomId"),
            rent: Number(formData.get("rent")),
            deposit: Number(formData.get("deposit")),
            startDate: toISODateTime(formData.get("startDate")),
            endDate: toISODateTime(formData.get("endDate")) || null,
            status: formData.get("status"),
        };

        try {
            const res = await apiPrivate.patch(`/pgs/${pgId}/stays/${stayInfo.id}`, payload);
            toast.success(res.data.message || "Stay updated successfully");
            onSave();
            onCancel();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update stay");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingOverlay isLoading={loading} />;

    return (
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Activity size={20} />
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight">Edit Stay Agreement</CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Room Assignment */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Home size={14} className="text-primary" /> Assigned Room
                            </Label>
                            <Select name="roomId" defaultValue={stayInfo.roomId}>
                                <SelectTrigger className="bg-background/50 border-border rounded-sm focus:ring-primary/20 transition-all">
                                    <SelectValue placeholder="Select a room" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border shadow-xl">
                                    {rooms.map((room) => (
                                        <SelectItem value={room.id} key={room.id} className="rounded-sm">
                                            Room {room.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Rent Input */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <IndianRupee size={14} className="text-primary" /> Monthly Rent
                            </Label>
                            <div className="relative">
                                <Input
                                    name="rent"
                                    type="number"
                                    defaultValue={stayInfo.rent}
                                    className="pl-4 bg-background/50 border-border rounded-sm font-bold focus:ring-primary/20 transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Deposit Input */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Save size={14} className="text-primary" /> Security Deposit
                            </Label>
                            <Input
                                name="deposit"
                                type="number"
                                defaultValue={stayInfo.deposit}
                                className="bg-background/50 border-border rounded-sm font-bold focus:ring-primary/20 transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Calendar size={14} className="text-primary" /> Onboarding Date
                            </Label>
                            <Input
                                name="startDate"
                                type="date"
                                defaultValue={stayInfo.startDate?.split("T")[0]}
                                className="bg-background/50 border-border rounded-sm font-bold focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Calendar size={14} className="text-primary" /> Vacating Date
                            </Label>
                            <Input
                                name="endDate"
                                type="date"
                                defaultValue={stayInfo.endDate?.split("T")[0]}
                                className="bg-background/50 border-border rounded-sm font-bold focus:ring-primary/20 transition-all"
                            />
                        </div>

                        {/* Status Select */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Activity size={14} className="text-primary" /> Agreement Status
                            </Label>
                            <Select name="status" defaultValue={stayInfo.status}>
                                <SelectTrigger className="bg-background/50 border-border rounded-sm focus:ring-primary/20 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border shadow-xl">
                                    <SelectItem value="ACTIVE" className="rounded-sm text-emerald-500 font-bold">Active</SelectItem>
                                    <SelectItem value="VACATED" className="rounded-sm text-amber-500 font-bold">Vacated</SelectItem>
                                    <SelectItem value="TERMINATED" className="rounded-sm text-destructive font-bold">Terminated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border/50">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="h-12 px-6 rounded-sm font-bold text-muted-foreground hover:bg-muted"
                        >
                            <X size={18} className="mr-2" /> Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-12 px-10 rounded-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {submitting ? "Processing..." : "Commit Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}