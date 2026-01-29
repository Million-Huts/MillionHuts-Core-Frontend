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
    const [loading, setLoading] = useState(false);
    const { currentPG } = usePG();
    const [rooms, setRooms] = useState<Room[] | []>([]);
    const pgId = currentPG?.id;

    const getRooms = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.rooms);
            setLoading(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
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
            const res = await apiPrivate.patch(`/pgs/${pgId}/stay/${stayInfo.id}`, payload);
            toast.success(res.data.message);
            onSave();
            onCancel();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update stay");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/3 rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Edit Stay Details</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <Label className="mb-1 ml-2">Room</Label>
                    <Select name="roomId" defaultValue={stayInfo.roomId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Room" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {rooms && rooms.map((room) => (
                                <SelectItem value={room.id} key={room.id}>{room.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="mb-1 ml-2">Monthly Rent</Label>
                    <Input
                        name="rent"
                        type="number"
                        placeholder="Monthly Rent"
                        defaultValue={stayInfo.rent}
                        required
                    />
                </div>

                <div>
                    <Label className="mb-1 ml-2">Deposit</Label>
                    <Input
                        name="deposit"
                        type="number"
                        placeholder="Deposit"
                        defaultValue={stayInfo.deposit}
                    />
                </div>
                <div>
                    <Label className="mb-1 ml-2">Joining Date</Label>
                    <Input
                        name="startDate"
                        type="date"
                        defaultValue={stayInfo.startDate?.split("T")[0]}
                        required
                    />
                </div>

                <div>
                    <Label className="mb-1 ml-2">Leave Date</Label>
                    <Input
                        name="endDate"
                        type="date"
                        defaultValue={stayInfo.endDate?.split("T")[0]}
                    />
                </div>

                <div>
                    <Label className="mb-1 ml-2">Status</Label>
                    <select
                        name="status"
                        defaultValue={stayInfo.status ?? "ACTIVE"}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="VACATED">Vacated</option>
                        <option value="TERMINATED">Terminated</option>
                    </select>
                </div>


                <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={loading}>
                        Save
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
