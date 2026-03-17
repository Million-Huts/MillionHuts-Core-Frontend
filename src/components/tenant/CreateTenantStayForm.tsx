// components/tenant/CreateTenantStayForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import { toNumber } from "@/lib/utils";
import { Loader2, Home, CreditCard, Calendar as CalendarIcon, UserCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CreateTenantStayForm({ tenant, rooms, onCreated }: any) {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await apiPrivate.post(`/pgs/${currentPG?.id}/stays`, {
                tenantId: tenant.id,
                roomId: formData.get("roomId"),
                rent: toNumber(formData.get('rent')),
                deposit: toNumber(formData.get('deposit')),
                startDate: new Date(formData.get("startDate") as string).toISOString()
            });
            toast.success("Stay record created successfully");
            onCreated();
        } catch (err) {
            toast.error("Failed to create stay record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            {/* Tenant Info Header - Glassy Profile Summary */}
            <div className="flex items-center gap-4 p-4 rounded-sm bg-muted/30 backdrop-blur-sm border border-border shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-primary/20 shadow-md">
                    <AvatarImage src={tenant.profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                        {tenant.fullName?.[0] || "T"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Assigning Stay For</p>
                    <p className="text-base font-bold text-foreground leading-tight">{tenant.fullName}</p>
                </div>
                <div className="ml-auto bg-primary/10 p-2 rounded-full">
                    <UserCheck className="h-4 w-4 text-primary" />
                </div>
            </div>

            <div className="space-y-5">
                {/* Room Selection */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                        <Home size={14} className="text-primary" /> Room Selection
                    </Label>
                    <Select name="roomId" required>
                        <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-all rounded-sm focus:ring-2 focus:ring-primary/20 outline-none">
                            <SelectValue placeholder="Select an available room" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-border bg-popover shadow-2xl">
                            {rooms?.map((room: any) => {
                                const isFull = room.occupiedCount >= room.capacity;
                                return (
                                    <SelectItem
                                        key={room.id}
                                        value={room.id}
                                        disabled={isFull}
                                        className="py-3 focus:bg-primary/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-center w-full gap-8">
                                            <span className="font-medium">{room.name} • {room.roomType}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFull ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                                {room.occupiedCount}/{room.capacity} Beds
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Financials Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                            <CreditCard size={14} className="text-primary" /> Rent
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                            <Input
                                name="rent"
                                type="number"
                                placeholder="Amount"
                                className="pl-7 bg-background border-border rounded-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                            Security Deposit
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                            <Input
                                name="deposit"
                                type="number"
                                placeholder="Deposit"
                                className="pl-7 bg-background border-border rounded-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1">
                        <CalendarIcon size={14} className="text-primary" /> Start Date
                    </Label>
                    <Input
                        name="startDate"
                        type="date"
                        required
                        className=" bg-background border-border rounded-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Action Button */}
            <Button
                type="submit"
                className="w-full rounded-sm text-base font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-95 transition-all"
                disabled={loading}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Processing Stay...</span>
                    </div>
                ) : (
                    "Confirm Stay Assignment"
                )}
            </Button>
        </form>
    );
}