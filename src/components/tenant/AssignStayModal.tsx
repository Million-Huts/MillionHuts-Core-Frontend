// components/tenant/AssignStayModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";

export default function AssignStayModal({ open, tenant, applicationId, rooms, onClose, onSuccess }: any) {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);

        try {
            // 1. Create the Stay
            await apiPrivate.post(`/pgs/${currentPG?.id}/stays`, {
                tenantId: tenant.id,
                roomId: fd.get("roomId"),
                rent: Number(fd.get("rent")),
                deposit: Number(fd.get("deposit")),
                startDate: new Date(fd.get("startDate") as string).toISOString()
            });

            // 2. If it came from an application, approve it
            if (applicationId) {
                await apiPrivate.patch(`/pgs/${currentPG?.id}/applications/${applicationId}`, { status: "APPROVED" });
            }

            toast.success("Resident successfully onboarded");
            onSuccess();
            onClose();
        } catch (err) {
            console.log(err);

            toast.error("Failed to complete assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 max-h-[90vh] overflow-y-scroll">
                <div className="bg-primary/5 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle>Assign Stay: {tenant?.fullName}</DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Select Room</Label>
                        <Select name="roomId" required>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Choose an available room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room: any) => (
                                    <SelectItem
                                        key={room.id}
                                        value={room.id}
                                        disabled={room.occupiedCount >= room.capacity}
                                    >
                                        <div className="flex justify-between w-[320px]">
                                            <span>{room.name} ({room.roomType})</span>
                                            <span className="text-xs opacity-60">
                                                {room.occupiedCount}/{room.capacity} beds
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Monthly Rent</Label>
                            <Input name="rent" type="number" placeholder="0.00" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Security Deposit</Label>
                            <Input name="deposit" type="number" placeholder="0.00" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Move-in Date</Label>
                        <Input name="startDate" type="date" required className="h-11" />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? "Processing..." : "Confirm & Onboard Resident"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}