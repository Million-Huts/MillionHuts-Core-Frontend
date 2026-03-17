// components/tenant/AssignStayModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import { Home, IndianRupee, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
    open: boolean;
    tenant: any;
    applicationId?: string;
    rooms: any[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignStayModal({ open, tenant, applicationId, rooms, onClose, onSuccess }: Props) {
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
            toast.error("Failed to complete assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 border-border bg-card overflow-hidden rounded-sm shadow-2xl">
                {/* Header with Theme Accent */}
                <div className="bg-primary/5 p-8 border-b border-border/50">
                    <DialogHeader>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Onboarding Process</p>
                        <DialogTitle className="text-2xl font-bold">
                            Assign Stay: <span className="text-primary">{tenant?.fullName}</span>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Room Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <Home size={14} className="text-primary" /> Select Room
                        </Label>
                        <Select name="roomId" required>
                            <SelectTrigger className="h-12 bg-background border-border hover:border-primary/50 transition-all rounded-sm focus:ring-primary/20">
                                <SelectValue placeholder="Choose an available room" />
                            </SelectTrigger>
                            <SelectContent className="rounded-sm border-border bg-popover shadow-xl">
                                {rooms.map((room: any) => {
                                    const isFull = room.occupiedCount >= room.capacity;
                                    return (
                                        <SelectItem
                                            key={room.id}
                                            value={room.id}
                                            disabled={isFull}
                                            className="py-3 focus:bg-primary/10 rounded-sm"
                                        >
                                            <div className="flex justify-between items-center w-[340px]">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{room.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{room.roomType}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-2 py-1 rounded-md font-bold ${isFull ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                                        {room.occupiedCount}/{room.capacity} Beds
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Financials */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                <IndianRupee size={14} className="text-primary" /> Monthly Rent
                            </Label>
                            <Input
                                name="rent"
                                type="number"
                                placeholder="0.00"
                                required
                                className="bg-background rounded-sm border-border focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                <IndianRupee size={14} className="text-muted-foreground" /> Deposit
                            </Label>
                            <Input
                                name="deposit"
                                type="number"
                                placeholder="0.00"
                                className="bg-background rounded-sm border-border focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <CalendarIcon size={14} className="text-primary" /> Move-in Date
                        </Label>
                        <Input
                            name="startDate"
                            type="date"
                            required
                            className="bg-background rounded-sm border-border focus:ring-primary/20 appearance-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-sm font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2] h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-sm font-bold transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : "Confirm Onboarding"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}