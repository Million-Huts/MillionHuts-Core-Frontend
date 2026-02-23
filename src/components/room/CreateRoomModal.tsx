import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Room } from "@/pages/Room/Rooms";
import type { Floor } from "@/pages/Floor/Floors";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { AlertCircle, Loader2, Sparkles, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (room: Room) => void;
    pgId: string;
}

const SHARING_OPTIONS = [
    { type: "SINGLE", capacity: 1 },
    { type: "DOUBLE", capacity: 2 },
    { type: "TRIPLE", capacity: 3 },
    { type: "FOUR", capacity: 4 },
    { type: "FIVE", capacity: 5 }
];

export default function CreateRoomModal({ open, onClose, onCreated, pgId }: Props) {
    const [floors, setFloors] = useState<Floor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [floorError, setFloorError] = useState(false);

    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        floorId: "",
        roomType: "NORMAL",
        sharing: "SINGLE",
        capacity: 1,
        rent: "",
        sizeSqFt: ""
    });

    useEffect(() => {
        if (!open || !pgId) return;
        const fetchFloors = async () => {
            setLoading(true);
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/floors`);
                const floorList = res.data.data.floors || [];
                setFloors(floorList);
                if (floorList.length === 0) setFloorError(true);
            } catch {
                setFloorError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchFloors();
    }, [open, pgId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            ...formData,
            pgId,
            rent: Number(formData.rent),
            sizeSqFt: Number(formData.sizeSqFt),
            features
        };

        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/rooms`, payload);
            onCreated(res.data.data.room);
            toast.success("Room assigned successfully");
            onClose();
        } catch {
            toast.error("Failed to create room");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] max-h-[90vh] overflow-y-scroll">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="mt-4 font-bold text-muted-foreground">Configuring inventory...</p>
                    </div>
                ) : floorError ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">No Floors Available</h3>
                            <p className="text-muted-foreground mt-2">You must define floors before adding rooms to this PG.</p>
                        </div>
                        <Button asChild className="w-full rounded-xl h-12 shadow-lg shadow-red-100">
                            <Link to="/floors">Go to Floor Settings</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                                <Sparkles className="h-6 w-6 text-indigo-600" />
                            </div>
                            <DialogTitle className="text-2xl font-black">Register New Room</DialogTitle>
                            <DialogDescription>Fill in the unit details below to update your inventory.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Room Name</Label>
                                <Input
                                    placeholder="e.g. 101, A-1"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Select Floor</Label>
                                <Select onValueChange={v => setFormData({ ...formData, floorId: v })} required>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Which floor?" /></SelectTrigger>
                                    <SelectContent>
                                        {floors.map(f => <SelectItem key={f.id} value={f.id!}>{f.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Sharing Mode</Label>
                                <Select onValueChange={v => setFormData({ ...formData, sharing: v, capacity: SHARING_OPTIONS.find(s => s.type === v)?.capacity || 1 })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sharing Type" /></SelectTrigger>
                                    <SelectContent>
                                        {SHARING_OPTIONS.map(s => <SelectItem key={s.type} value={s.type}>{s.type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Climate Control</Label>
                                <Select onValueChange={v => setFormData({ ...formData, roomType: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="AC / Normal" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NORMAL">Normal</SelectItem>
                                        <SelectItem value="AC">Air Conditioned (AC)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Monthly Rent (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="8500"
                                    required
                                    value={formData.rent}
                                    onChange={e => setFormData({ ...formData, rent: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="col-span-1 space-y-1.5">
                                <Label className="text-xs font-black uppercase ml-1">Sq. Footage</Label>
                                <Input
                                    type="number"
                                    placeholder="250"
                                    value={formData.sizeSqFt}
                                    onChange={e => setFormData({ ...formData, sizeSqFt: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="col-span-2 space-y-2 mt-2">
                                <Label className="text-xs font-black uppercase ml-1">Room Amenities</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Fan, TV, Table..."
                                        value={featureInput}
                                        onChange={e => setFeatureInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setFeatures([...features, featureInput]), setFeatureInput(""))}
                                        className="rounded-xl"
                                    />
                                    <Button type="button" variant="secondary" onClick={() => { setFeatures([...features, featureInput]); setFeatureInput(""); }} className="rounded-xl"><Plus className="h-4 w-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {features.map((f, i) => (
                                        <Badge key={i} className="rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1">
                                            {f} <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="rounded-xl px-12 h-12 shadow-xl shadow-indigo-100">
                                    {submitting ? "Processing..." : "Create Room"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}