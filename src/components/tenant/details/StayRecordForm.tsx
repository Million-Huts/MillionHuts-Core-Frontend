import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { TenantStay } from "@/pages/Tenant/TenantDetails";
import { Label } from "@/components/ui/label";
import { usePG } from "@/context/PGContext";
import type { Room } from "@/pages/Room/Rooms";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toISODateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
interface Props {
    stayInfo: TenantStay;
    onSave: () => void;
    onCancel: () => void;
}

export default function StayRecordForm({
    stayInfo,
    onSave,
    onCancel,
}: Props) {
    const [loading, setLoading] = useState(true);
    const { currentPG } = usePG();
    const [rooms, setRooms] = useState<Room[] | []>([]);
    const pgId = currentPG?.id;

    const getRooms = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.data.rooms);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getRooms();
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

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
            toast.success(res.data.message);
            onSave();
            onCancel();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update stay");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="relative">
                <LoadingOverlay isLoading={loading} />
            </div>
        )


    return (
        <Card className="border-primary/20 shadow-xl bg-white">
            <CardHeader>
                <CardTitle>Update Stay Record</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Assigned Room</Label>
                            <Select name="roomId" defaultValue={stayInfo.roomId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms && rooms.map((room) => (
                                        <SelectItem value={room.id} key={room.id}>{room.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Monthly Rent (₹)</Label>
                            <Input name="rent" type="number" defaultValue={stayInfo.rent} className="h-11" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Security Deposit (₹)</Label>
                            <Input name="deposit" type="number" defaultValue={stayInfo.deposit} className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input name="startDate" type="date" defaultValue={stayInfo.startDate?.split("T")[0]} className="h-11" required />
                        </div>

                        <div className="space-y-2">
                            <Label>End Date (Optional)</Label>
                            <Input name="endDate" type="date" defaultValue={stayInfo.endDate?.split("T")[0]} className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label>Stay Status</Label>
                            <select
                                name="status"
                                defaultValue={stayInfo.status}
                                className="w-full rounded-md border border-input h-11 px-3 text-sm focus:ring-2 focus:ring-primary"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="VACATED">Vacated</option>
                                <option value="TERMINATED">Terminated</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="px-8">
                            {loading ? "Updating..." : "Save Stay Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
