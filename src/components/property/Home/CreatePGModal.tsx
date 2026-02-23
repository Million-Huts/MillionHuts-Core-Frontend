// components/property/Home/CreatePGModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { usePG } from "@/context/PGContext";
import type { PG } from "@/interfaces/pg";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (pg: PG) => void;
}

export default function CreatePGModal({ open, onClose, onCreated }: Props) {
    const { pgs, setPGs } = usePG();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const toastId = toast.loading("Creating property...");

        try {
            const res = await apiPrivate.post("/pgs", Object.fromEntries(formData));
            const newPG: PG = res.data.data.pg;

            onCreated(newPG);
            setPGs([...pgs, { id: newPG.id, name: newPG.name }]);

            toast.success("Property created successfully", { id: toastId });
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create PG", { id: toastId });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                        Enter the basic details of your PG establishment.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Property Name</Label>
                        <Input id="name" name="name" placeholder="e.g. Skyline Residency" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="Street details" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" placeholder="City" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" placeholder="State" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" name="pincode" placeholder="6-digit code" required />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="px-8">Create Property</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}