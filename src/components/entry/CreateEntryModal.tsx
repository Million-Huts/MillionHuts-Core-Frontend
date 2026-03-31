import { useState, useEffect } from "react";
import { Loader2, User, Truck, Info, Check, Plus } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Gate } from "@/interfaces/entry";
import { cn } from "@/lib/utils";

// Custom constants for the new logic
const VISITOR_SUGGESTIONS = [
    "Meeting Friend",
    "Family Visit",
    "Maintenance/Repairs",
    "Interview",
    "Property Tour",
    "Other"
];

const DELIVERY_SERVICES = [
    { label: "Food Delivery", value: "Food Delivery" },
    { label: "Shopping/E-commerce", value: "Shopping Delivery" },
    { label: "Grocery/Instamart", value: "Grocery Delivery" },
    { label: "Courier/Document", value: "Courier" },
    { label: "Other Service", value: "Service Provider" },
];

type Props = {
    open: boolean;
    onClose: () => void;
    pgId: string;
    onSuccess: () => void;
};

export function CreateEntryModal({ open, onClose, pgId, onSuccess }: Props) {
    const [gates, setGates] = useState<Gate[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [type, setType] = useState<"VISITOR" | "DELIVERY">("VISITOR");
    const [gateId, setGateId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [purpose, setPurpose] = useState("");
    const [deliveryService, setDeliveryService] = useState("Food Delivery");

    useEffect(() => {
        if (open) fetchGates();
    }, [open]);

    const fetchGates = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/gates`);
            const data = res.data.data || [];
            setGates(data);
            if (data.length) setGateId(data[0].id);
        } catch {
            toast.error("Could not load gates");
        }
    };

    const handleSubmit = async () => {
        // Validation: Deliveries don't need Name/Phone, Visitors do.
        if (type === "VISITOR" && !name.trim()) return toast.error("Visitor name is required");

        try {
            setLoading(true);
            await apiPrivate.post(`/pgs/${pgId}/entries`, {
                gateId,
                type,
                // For delivery, we use a default placeholder name
                name: type === "DELIVERY" ? "Item Delivery" : name,
                phone: type === "DELIVERY" ? "" : phone,
                purpose: type === "VISITOR" ? purpose : undefined,
                deliveryFrom: type === "DELIVERY" ? deliveryService : undefined,
                createdByType: "GUARD"
            });

            toast.success("Entry logged successfully");
            onSuccess();
            onClose();
            // Reset form
            setName(""); setPhone(""); setPurpose("");
        } catch {
            toast.error("Failed to save entry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-scroll p-0 rounded-sm border-none shadow-2xl bg-background">
                <DialogHeader className="bg-primary md:p-8 p-2 text-primary-foreground">
                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/40 flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        New Gate Log
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* TYPE TOGGLE - REDESIGNED */}
                    <div className="grid grid-cols-2 gap-2 bg-muted p-1.5 rounded-sm ring-1 ring-border">
                        <button
                            onClick={() => setType("VISITOR")}
                            className={cn(
                                "flex items-center justify-center py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all",
                                type === "VISITOR" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <User className="mr-2 h-4 w-4" /> Visitor
                        </button>
                        <button
                            onClick={() => setType("DELIVERY")}
                            className={cn(
                                "flex items-center justify-center py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all",
                                type === "DELIVERY" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Truck className="mr-2 h-4 w-4" /> Delivery
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* COMMON: GATE SELECT */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Arrival Gate</Label>
                            <Select value={gateId} onValueChange={setGateId}>
                                <SelectTrigger className="h-14 rounded-sm bg-muted/30 border-border font-bold">
                                    <SelectValue placeholder="Select Gate" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {gates.map((g) => (
                                        <SelectItem key={g.id} value={g.id} className="font-bold">{g.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* CONDITIONAL: VISITOR FIELDS */}
                        {type === "VISITOR" ? (
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</Label>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className="h-14 rounded-sm bg-muted/30 border-border font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Mobile No.</Label>
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className="h-14 rounded-sm bg-muted/30 border-border font-bold" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Purpose of Visit</Label>
                                    <Textarea
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        placeholder="Specific reason for visit..."
                                        className="rounded-sm bg-muted/30 border-border font-bold min-h-[100px] py-4"
                                    />
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {VISITOR_SUGGESTIONS.map((s) => (
                                            <Badge
                                                key={s}
                                                variant="outline"
                                                className={cn(
                                                    "cursor-pointer px-3 py-1.5 rounded-sm border-border hover:bg-primary hover:text-primary-foreground transition-all",
                                                    purpose === s && "bg-primary text-primary-foreground border-primary"
                                                )}
                                                onClick={() => setPurpose(s)}
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CONDITIONAL: DELIVERY FIELDS */
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="bg-primary/5 border border-primary/10 rounded-sm p-4 flex items-start gap-3">
                                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-[13px] font-medium text-primary/80 leading-relaxed">
                                        Quick Log enabled. Delivery entries are logged as <strong>"Item Delivery"</strong> automatically.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Service Category</Label>
                                    <Select value={deliveryService} onValueChange={setDeliveryService}>
                                        <SelectTrigger className="h-14 rounded-sm bg-muted/30 border-border font-bold">
                                            <SelectValue placeholder="Select Service" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            {DELIVERY_SERVICES.map((s) => (
                                                <SelectItem key={s.value} value={s.value} className="font-bold">
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-12 rounded-sm text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <><Check className="mr-2" /> Complete Entry</>}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}