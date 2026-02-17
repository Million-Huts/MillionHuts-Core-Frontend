import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Floor } from "@/pages/Floor/Floors";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (floor: Floor) => void;
    pgId: string;
}

export default function CreateFloorModal({
    open,
    onClose,
    onCreated,
    pgId,
}: Props) {
    const [placeInput, setPlaceInput] = useState("");
    const [publicPlaces, setPublicPlaces] = useState<string[]>([]);

    const addPlace = () => {
        if (!placeInput.trim()) return;
        setPublicPlaces((prev) => [...prev, placeInput.trim()]);
        setPlaceInput("");
    };

    const removePlace = (index: number) => {
        setPublicPlaces((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            pgId,
            label: formData.get("label"),
            totalRooms: Number(formData.get("totalRooms")),
            publicPlaces,
        };

        try {
            const res = await apiPrivate.post(
                `/pgs/${pgId}/floors`,
                payload
            );
            onCreated(res.data.floor);
            toast.success("Floor created");
            onClose();
        } catch {
            toast.error("Failed to create floor");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Floor</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="label" placeholder="Floor Label (G, 1, 2)" required />
                    <Input
                        name="totalRooms"
                        type="number"
                        placeholder="Total Rooms"
                        required
                    />

                    {/* Public places */}
                    <div>
                        <div className="flex gap-2">
                            <Input
                                value={placeInput}
                                onChange={(e) => setPlaceInput(e.target.value)}
                                placeholder="Add public area (Kitchen, Hall)"
                            />
                            <Button type="button" variant="outline" onClick={addPlace}>
                                Add
                            </Button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {publicPlaces.map((place, i) => (
                                <span
                                    key={i}
                                    className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs"
                                >
                                    {place}
                                    <button
                                        type="button"
                                        onClick={() => removePlace(i)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
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
