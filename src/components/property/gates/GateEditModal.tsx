import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { apiPrivate } from "@/lib/api";

type Gate = {
    id: string;
    name: string;
    code?: string;
    type: "MAIN" | "SIDE" | "BACK" | "SERVICE";
    isActive: boolean;
};

type Props = {
    open: boolean;
    onClose: () => void;
    pgId: string;
    gate: Gate | null;
    onSuccess: () => void;
};

export default function GateEditModal({
    open,
    onClose,
    pgId,
    gate,
    onSuccess,
}: Props) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [type, setType] = useState("MAIN");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    /*
    -----------------------------------------------------
    PREFILL DATA
    -----------------------------------------------------
    */
    useEffect(() => {
        if (gate) {
            setName(gate.name);
            setCode(gate.code || "");
            setType(gate.type);
            setIsActive(gate.isActive);
        }
    }, [gate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gate) return;

        if (!name.trim()) {
            toast.error("Gate name is required");
            return;
        }

        try {
            setLoading(true);

            await apiPrivate.patch(
                `/pgs/${pgId}/gates/${gate.id}`,
                {
                    name,
                    code: code || undefined,
                    type,
                    isActive,
                }
            );

            toast.success("Gate updated successfully");

            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update gate");
        } finally {
            setLoading(false);
        }
    };

    if (!gate) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-sm">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">
                        Edit Gate
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Gate Name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11 rounded-sm"
                        />
                    </div>

                    {/* Code */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Gate Code
                        </Label>
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="h-11 rounded-sm"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Gate Type
                        </Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="h-11 rounded-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MAIN">Main</SelectItem>
                                <SelectItem value="SIDE">Side</SelectItem>
                                <SelectItem value="BACK">Back</SelectItem>
                                <SelectItem value="SERVICE">Service</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-sm bg-muted/30 border border-border/50">
                        <Label className="font-bold text-sm">
                            Active Gate
                        </Label>
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Gate
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}