import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { Floor } from "@/pages/Floor/Floors";

interface Props {
    open: boolean;
    onClose: () => void;
    floor: Floor;
    pgId: string;
    onUpdated: (updatedFloor: Floor) => void;
}

export default function EditFloorModal({ open, onClose, floor, pgId, onUpdated }: Props) {
    const [label, setLabel] = useState(floor.label);
    const [totalRooms, setTotalRooms] = useState(floor.totalRooms);
    const [publicPlaces, setPublicPlaces] = useState<string[]>(floor.publicPlaces);
    const [newPlace, setNewPlace] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync state if floor changes
    useEffect(() => {
        setLabel(floor.label);
        setTotalRooms(floor.totalRooms);
        setPublicPlaces(floor.publicPlaces);
    }, [floor]);

    const addPlace = () => {
        if (!newPlace.trim() || publicPlaces.includes(newPlace.trim())) return;
        setPublicPlaces([...publicPlaces, newPlace.trim()]);
        setNewPlace("");
    };

    const removePlace = (index: number) => {
        setPublicPlaces(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            label,
            totalRooms: Number(totalRooms),
            publicPlaces // Sending the entire array as requested
        };

        try {
            const res = await apiPrivate.patch(`/pgs/${pgId}/floors/${floor.id}`, payload);
            onUpdated(res.data.data.floor);
            toast.success("Floor layout updated");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Floor Details</DialogTitle>
                    <DialogDescription>Modify the label and common areas for this level.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Floor Label</Label>
                            <Input value={label} onChange={e => setLabel(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Rooms</Label>
                            <Input type="number" value={totalRooms} onChange={e => setTotalRooms(Number(e.target.value))} required className="rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Shared Amenities</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add area (e.g. Balcony)"
                                value={newPlace}
                                onChange={e => setNewPlace(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                                className="rounded-xl"
                            />
                            <Button type="button" variant="secondary" onClick={addPlace} className="rounded-xl">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {publicPlaces.map((place, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold">
                                    {place}
                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removePlace(i)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="rounded-xl px-8">
                            {loading ? "Saving..." : "Update Floor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}