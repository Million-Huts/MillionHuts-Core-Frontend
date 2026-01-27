import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { PG } from "@/pages/Property/PropertyList";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (pg: PG) => void;
}

export default function CreatePGModal({ open, onClose, onCreated }: Props) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const res = await apiPrivate.post("/pgs/create", Object.fromEntries(formData));
            onCreated(res.data);
            toast.success("PG created");
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create PG");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create PG</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="PG Name" required />
                    <Input name="address" placeholder="Address" required />
                    <Input name="city" placeholder="City" required />
                    <Input name="state" placeholder="State" required />
                    <Input name="pincode" placeholder="Pincode" required />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
