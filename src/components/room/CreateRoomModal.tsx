import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Room } from "@/pages/Room/Rooms";
import type { Floor } from "@/pages/Floor/Floors";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { toNumber } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (room: Room) => void;
    pgId: string;
}

const SHARING: { type: string, capacity: number }[] = [
    {
        type: "SINGLE",
        capacity: 1
    },
    {
        type: "Double",
        capacity: 2
    },
    {
        type: "TRIPLE",
        capacity: 3
    },
    {
        type: "FOUR",
        capacity: 4
    },
    {
        type: "FIVE",
        capacity: 5
    }
]

export default function CreateRoomModal({
    open,
    onClose,
    onCreated,
    pgId,
}: Props) {
    const [floors, setFloors] = useState<Floor[]>([]);
    const [loading, setLoading] = useState(true);
    const [floorError, setFloorError] = useState(false);

    const [featureInput, setFeatureInput] = useState("");
    const [features, setFeatures] = useState<string[]>([]);

    const [selectFloor, setSelectFloor] = useState<string>("");
    const [selectSharing, setSelectSharing] = useState<string>("");
    const [selectCapacity, setSelectCapacity] = useState<number>();
    const [selectRoomType, setSelectRoomType] = useState<string>("NORMAL");

    const addFeature = () => {
        if (!featureInput.trim()) return;
        setFeatures((prev) => [...prev, featureInput.trim()]);
        setFeatureInput("");
    };

    const removeFeature = (index: number) => {
        setFeatures((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            pgId,
            name: formData.get("name"),
            floorId: formData.get("floorId"),
            roomType: formData.get("roomType"),
            sharing: formData.get("sharing"),
            capacity: Number(formData.get("capacity")),
            rent: Number(formData.get("rent")),
            sizeSqFt: Number(formData.get("sizeSqFt")),
            features,
        };

        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/rooms/create`, payload);
            onCreated(res.data.room);
            toast.success("Room created");
            onClose();
        } catch {
            toast.error("Failed to create room");
        }
    };

    useEffect(() => {
        if (!open || !pgId) return;

        const fetchFloors = async () => {
            setFloorError(false);
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/floors`);
                if (!res.data.floors || res.data.floors.length === 0)
                    setFloorError(true);
                else
                    setFloors(res.data.floors);
            } catch (error: any) {
                toast.error(error.response.data.message);
                setFloorError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchFloors();
    }, [open, pgId])

    const changeCapacity = (sharing: string) => {
        const capacity = SHARING.find((s) => s.type === sharing);
        setSelectCapacity(capacity?.capacity);
    }

    const changeSharing = (capacity: number) => {
        const sharing = SHARING.find((s) => s.capacity === capacity);
        setSelectSharing(sharing?.type!);
    }

    return (

        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Fetching configuration...</p>
                    </div>
                ) : floorError ? (
                    /* --- ERROR / REDIRECT STATE --- */
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogHeader>
                            <DialogTitle>No Floors Found</DialogTitle>
                            <DialogDescription>
                                You need to configure floors for this PG before you can add rooms.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 w-full flex flex-col gap-2">
                            <Button asChild className="w-full">
                                <Link to={`/floors`}>
                                    Go to Floor Configuration
                                </Link>
                            </Button>
                            <Button variant="outline" onClick={onClose} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Add Room</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="mb-1 ml-2">Room Name</Label>
                                <Input name="name" placeholder="Room Name (G1, 101)" required />
                            </div>

                            <div>
                                <Label className="mb-1 ml-2">Floor</Label>
                                <Select value={selectFloor} name="floorId" onValueChange={(val) => setSelectFloor(val)} required>
                                    <SelectTrigger className="w-full h-8 cursor-pointer">
                                        <SelectValue placeholder="Select Floor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {floors.length > 0 && floors.map((floor) => (
                                            <SelectItem value={floor.id!} key={floor.id}>{floor.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                            <div>
                                <Label className="mb-1 ml-2">Sharing Type</Label>
                                <Select
                                    name="sharing"
                                    value={selectSharing}
                                    onValueChange={(val) => {
                                        setSelectSharing(val)
                                        changeCapacity(val)
                                    }}
                                    required
                                >
                                    <SelectTrigger className="w-full h-8 cursor-pointer">
                                        <SelectValue placeholder="Sharing Type (Single,Double etc...)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SHARING.length > 0 && SHARING.map((share) => (
                                            <SelectItem value={share.type} key={share.capacity}>{share.type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-1 ml-2">Room Type</Label>
                                <Select value={selectRoomType} name="roomType" onValueChange={(val) => setSelectRoomType(val)} required>
                                    <SelectTrigger className="w-full h-8 cursor-pointer">
                                        <SelectValue placeholder="Room Type (AC/Normal)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"NORMAL"}>Normal</SelectItem>
                                        <SelectItem value={"AC"}>AC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-1 ml-2">Total Room Capacity</Label>
                                <Select
                                    value={selectCapacity?.toString()}
                                    name="capacity"
                                    onValueChange={(val) => {
                                        setSelectCapacity(toNumber(val)!);
                                        changeSharing(toNumber(val)!);
                                    }}
                                    required
                                >
                                    <SelectTrigger className="w-full h-8 cursor-pointer">
                                        <SelectValue placeholder="Sharing Type (Single,Double etc...)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SHARING.length > 0 && SHARING.map((share) => (
                                            <SelectItem value={share.capacity.toString()} key={share.capacity}>{share.capacity}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1 ml-2">Room Rent</Label>
                                <Input name="rent" type="number" placeholder="Rent" />
                            </div>
                            <div>
                                <Label className="mb-1 ml-2">Room Size(sqft)</Label>
                                <Input name="sizeSqFt" type="number" placeholder="Size (sqft)" />
                            </div>
                            {/* Features */}
                            <div>
                                <div className="flex gap-2">
                                    <Input
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        placeholder="Add feature (Fan, Balcony)"
                                    />
                                    <Button type="button" variant="outline" onClick={addFeature}>
                                        Add
                                    </Button>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {features.map((feature, i) => (
                                        <span
                                            key={i}
                                            className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs"
                                        >
                                            {feature}
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(i)}
                                                className="hover:text-red-500"
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
