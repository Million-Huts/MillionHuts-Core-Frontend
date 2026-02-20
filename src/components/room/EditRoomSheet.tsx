// components/room/EditRoomSheet.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import type { Room } from "@/pages/Room/Rooms";

interface Props {
    room: Room;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditRoomSheet({ room, open, onClose, onSuccess }: Props) {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);

    // Form States
    const [roomType, setRoomType] = useState(room.roomType);
    const [sharing, setSharing] = useState(room.sharing);
    const [status, setStatus] = useState(room.status);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get("name"),
            rent: Number(formData.get("rent")),
            sizeSqFt: Number(formData.get("sizeSqFt")),
            roomType,
            sharing,
            status,
        };

        try {
            await apiPrivate.patch(`/pgs/${currentPG?.id}/rooms/${room.id}`, payload);
            toast.success("Room updated successfully");
            onSuccess();
            onClose();
        } catch (err) {
            toast.error("Failed to update room details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[400px] overflow-y-auto md:p-4 p-2">
                <SheetHeader className="mb-6">
                    <SheetTitle>Edit Room Details</SheetTitle>
                    <SheetDescription>
                        Modify the configuration for Room {room.name}. Changes reflect instantly.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name/Number</Label>
                        <Input id="name" name="name" defaultValue={room.name} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Room Type</Label>
                            <Select value={roomType} onValueChange={(val: "AC" | "NORMAL") => setRoomType(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AC">AC</SelectItem>
                                    <SelectItem value="NORMAL">Normal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sharing</Label>
                            <Select value={sharing} onValueChange={setSharing}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SINGLE">Single</SelectItem>
                                    <SelectItem value="DOUBLE">Double</SelectItem>
                                    <SelectItem value="TRIPLE">Triple</SelectItem>
                                    <SelectItem value="FOUR">Four</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rent">Monthly Rent (₹)</Label>
                            <Input id="rent" name="rent" type="number" defaultValue={room.rent} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="size">Size (Sq. Ft.)</Label>
                            <Input id="size" name="sizeSqFt" type="number" defaultValue={room.sizeSqFt} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Availability Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="OCCUPIED">Fully Occupied</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}