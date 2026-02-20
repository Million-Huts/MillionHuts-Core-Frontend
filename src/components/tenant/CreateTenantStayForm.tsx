// components/tenant/CreateTenantStayForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import { toNumber } from "@/lib/utils";
import { Loader2, Home, CreditCard, Calendar } from "lucide-react";
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-muted-foreground/10">
                <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={tenant.profileImage} />
                    <AvatarFallback className="text-[10px] font-black">{tenant.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs text-muted-foreground">Assigning Stay For</p>
                    <p className="text-sm font-bold">{tenant.fullName}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                        <Home size={14} /> Room Selection
                    </Label>
                    <Select name="roomId" required>
                        <SelectTrigger className="h-12 border-muted-foreground/20 focus:ring-primary">
                            <SelectValue placeholder="Select an available room" />
                        </SelectTrigger>
                        <SelectContent>
                            {rooms?.map((room: any) => (
                                <SelectItem key={room.id} value={room.id} disabled={room.occupiedCount >= room.capacity}>
                                    {room.name} - {room.roomType} ({room.occupiedCount}/{room.capacity})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                            <CreditCard size={14} /> Rent
                        </Label>
                        <Input name="rent" type="number" placeholder="₹ Amount" className="h-11 border-muted-foreground/20" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                            Deposit
                        </Label>
                        <Input name="deposit" type="number" placeholder="₹ Security" className="h-11 border-muted-foreground/20" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                        <Calendar size={14} /> Start Date
                    </Label>
                    <Input name="startDate" type="date" required className="h-11 border-muted-foreground/20" />
                </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Confirm Stay Assignment"}
            </Button>
        </form>
    );
}