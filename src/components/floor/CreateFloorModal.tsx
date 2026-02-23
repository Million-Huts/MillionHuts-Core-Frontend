import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Floor } from "@/pages/Floor/Floors";
import { X, Plus, Sparkles } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (floor: Floor) => void;
    pgId: string;
}

export default function CreateFloorModal({ open, onClose, onCreated, pgId }: Props) {
    const [placeInput, setPlaceInput] = useState("");
    const [publicPlaces, setPublicPlaces] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const addPlace = () => {
        const val = placeInput.trim();
        if (!val || publicPlaces.includes(val)) return;
        setPublicPlaces([...publicPlaces, val]);
        setPlaceInput("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            pgId,
            label: formData.get("label"),
            totalRooms: Number(formData.get("totalRooms")),
            publicPlaces,
        };

        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/floors`, payload);
            // Adjusted for res.data.data
            onCreated(res.data.data.floor);
            toast.success("New floor added to property!");
            onClose();
            setPublicPlaces([]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create floor");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] rounded-3xl max-h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl">Add New Floor</DialogTitle>
                    <DialogDescription>Define the layout and shared amenities for this level.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Floor Label</Label>
                            <Input name="label" placeholder="e.g. Ground, 1st" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Room Capacity</Label>
                            <Input name="totalRooms" type="number" placeholder="0" required className="rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Common Areas (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={placeInput}
                                onChange={(e) => setPlaceInput(e.target.value)}
                                placeholder="Kitchen, Balcony..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                                className="rounded-xl"
                            />
                            <Button type="button" variant="secondary" onClick={addPlace} className="rounded-xl px-4">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {publicPlaces.map((place, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in-50">
                                    {place}
                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setPublicPlaces(prev => prev.filter((_, idx) => idx !== i))} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
                        <Button type="submit" disabled={submitting} className="rounded-xl px-8">
                            {submitting ? "Creating..." : "Confirm Floor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}