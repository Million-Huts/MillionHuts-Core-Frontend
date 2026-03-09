import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import { Loader2, Settings2 } from "lucide-react";
import type { Room } from "@/interfaces/room";

interface Props {
    room: Room;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditRoomModal({ room, open, onClose, onSuccess }: Props) {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);

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
        } catch {
            toast.error("Failed to update room details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
                <DialogHeader className="mb-6">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Settings2 className="h-7 w-7 text-primary" />
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tighter">Edit Unit: {room.name}</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                        Modify the configuration for this room. Updates reflect instantly.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Room Name/Number</Label>
                        <Input name="name" defaultValue={room.name} required className="h-12 rounded-2xl bg-muted/30 border-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Room Type</Label>
                            <Select value={roomType} onValueChange={(val: "AC" | "NORMAL") => setRoomType(val)}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="AC">AC</SelectItem>
                                    <SelectItem value="NORMAL">Normal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sharing</Label>
                            <Select value={sharing} onValueChange={setSharing}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
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
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Rent (₹)</Label>
                            <Input name="rent" type="number" defaultValue={room.rent} required className="h-12 rounded-2xl bg-muted/30 border-none" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Size (Sq. Ft.)</Label>
                            <Input name="sizeSqFt" type="number" defaultValue={room.sizeSqFt} className="h-12 rounded-2xl bg-muted/30 border-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Availability Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="OCCUPIED">Fully Occupied</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1 rounded-full font-bold" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1 rounded-full font-black shadow-lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}