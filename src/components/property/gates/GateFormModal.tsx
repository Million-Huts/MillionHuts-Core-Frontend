import { useState } from "react";
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

import { apiPrivate } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
    pgId: string;
    onSuccess: () => void;
};

export default function GateFormModal({
    open,
    onClose,
    pgId,
    onSuccess,
}: Props) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [type, setType] = useState("MAIN");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Gate name is required");
            return;
        }

        try {
            setLoading(true);

            await apiPrivate.post(`/pgs/${pgId}/gates`, {
                name,
                code: code || undefined,
                type,
            });

            toast.success("Gate created successfully");

            // reset
            setName("");
            setCode("");
            setType("MAIN");

            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create gate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-sm">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">
                        Add New Gate
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Gate Name
                        </Label>
                        <Input
                            placeholder="e.g. Gate A - Main Entrance"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11 rounded-sm"
                        />
                    </div>

                    {/* Code */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Gate Code (Optional)
                        </Label>
                        <Input
                            placeholder="e.g. MAIN_GATE"
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

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-sm"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-sm"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Gate
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}