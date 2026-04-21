// components/tenant/CreateTenantStayForm.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import { toNumber } from "@/lib/utils";

import {
    Loader2,
    Home,
    Calendar as CalendarIcon,
    UserCheck
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CreateTenantStayForm({
    tenant,
    rooms,
    onCreated,
    onClose
}: any) {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const formData = new FormData(e.currentTarget);

        const roomId = formData.get("roomId") as string;
        const rent = toNumber(formData.get("rent"));
        const deposit = formData.get("deposit")
            ? toNumber(formData.get("deposit"))
            : null;
        const startDate = formData.get("startDate") as string;

        // 🔒 Basic validations
        if (!roomId || !rent || !startDate) {
            toast.error("Please fill all required fields");
            return;
        }

        if (rent <= 0) {
            toast.error("Rent must be greater than 0");
            return;
        }

        const selectedDate = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error("Start date cannot be in the past");
            return;
        }

        setLoading(true);

        try {
            await apiPrivate.post(`/pgs/${currentPG?.id}/stays`, {
                tenantId: tenant.id,
                roomId,
                rent,
                deposit,
                startDate: selectedDate.toISOString()
            });

            toast.success("Stay created successfully");

            onCreated?.();
            onClose?.();

        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create stay";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400"
        >
            {/* Tenant Header */}
            <div className="flex items-center gap-4 p-4 rounded-sm bg-muted/30 border border-border shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-primary/20">
                    <AvatarImage src={tenant.profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {tenant.fullName?.[0] || "T"}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                        Assigning Stay For
                    </p>
                    <p className="text-base font-bold">
                        {tenant.fullName}
                    </p>
                </div>

                <div className="ml-auto bg-primary/10 p-2 rounded-full">
                    <UserCheck className="h-4 w-4 text-primary" />
                </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-2">
                    <Home size={14} /> Room
                </Label>

                <Select name="roomId" required>
                    <SelectTrigger className="rounded-sm">
                        <SelectValue placeholder="Select room" />
                    </SelectTrigger>

                    <SelectContent>
                        {rooms?.map((room: any) => {
                            const isFull =
                                room.occupiedCount >= room.capacity;

                            return (
                                <SelectItem
                                    key={room.id}
                                    value={room.id}
                                    disabled={isFull}
                                >
                                    {room.name} • {room.roomType} (
                                    {room.occupiedCount}/{room.capacity})
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Rent + Deposit */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Rent</Label>
                    <Input
                        name="rent"
                        type="number"
                        required
                        placeholder="₹"
                    />
                </div>

                <div>
                    <Label>Deposit</Label>
                    <Input
                        name="deposit"
                        type="number"
                        placeholder="Optional"
                    />
                </div>
            </div>

            {/* Start Date */}
            <div>
                <Label className="flex items-center gap-2">
                    <CalendarIcon size={14} /> Start Date
                </Label>

                <Input
                    name="startDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={loading}
                className="w-full"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        Creating...
                    </div>
                ) : (
                    "Confirm Stay"
                )}
            </Button>
        </form>
    );
}