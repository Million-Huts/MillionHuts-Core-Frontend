import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Room } from "@/interfaces/room";
import type { Floor } from "@/interfaces/floor";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { AlertCircle, Loader2, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface FloorAvailability {
    floorId: string;
    isAvailable: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (room: Room) => void;
    pgId: string;
    floors: Floor[];
    floorError: boolean;
    floorAvailability: FloorAvailability[];
    selectedFloor: string | null;
}

const SHARING_OPTIONS = [
    { type: "SINGLE", capacity: 1 },
    { type: "DOUBLE", capacity: 2 },
    { type: "TRIPLE", capacity: 3 },
    { type: "FOUR", capacity: 4 },
    { type: "FIVE", capacity: 5 }
];

const COMMON_AMENITIES = ["Wardrobe", "Study Table", "Attached Washroom", "Balcony", "Window", "Mirror", "Chairs"];

export default function CreateRoomModal({ open, onClose, onCreated, pgId, floors, floorError, floorAvailability, selectedFloor }: Props) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");
    const [showCustomFeature, setShowCustomFeature] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        floorId: "",
        roomType: "NORMAL",
        sharing: "SINGLE",
        capacity: 1,
        rent: ""
    });

    useEffect(() => {
        if (!open || !pgId) return;
        setFeatures([]);
        setShowCustomFeature(false);
        setLoading(false);
    }, [open, pgId]);

    const toggleFeature = (feature: string) => {
        setFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
    };

    const addCustomFeature = () => {
        const val = featureInput.trim();
        if (!val) return;
        if (features.includes(val)) {
            toast.error("Amenity already added");
            return;
        }
        setFeatures([...features, val]);
        setFeatureInput("");
        setShowCustomFeature(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/rooms`, {
                ...formData,
                pgId,
                rent: Number(formData.rent),
                features
            });
            onCreated(res.data.data.room);
            toast.success("Room registered successfully");
            handleClose();
        } catch {
            toast.error("Failed to create room");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            floorId: "",
            roomType: "NORMAL",
            sharing: "SINGLE",
            capacity: 1,
            rent: ""
        });
        onClose();
    }


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px] rounded-sm max-h-[90vh] overflow-y-scroll p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="mt-4 font-bold text-muted-foreground">Syncing structure...</p>
                    </div>
                ) : floorError ? (
                    <div className="text-center space-y-6">
                        <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Missing Infrastructure</h3>
                            <p className="text-muted-foreground mt-2">You need to set up floors before adding rooms.</p>
                        </div>
                        <Button asChild className="w-full rounded-sm">
                            <Link to="/floors">Configure Floors</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="mb-6">
                            <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-7 w-7 text-primary" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tighter">Register Room</DialogTitle>
                            <DialogDescription className="text-base font-medium">Add a new unit to your PG inventory.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Room ID / No</Label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className=" rounded-sm bg-muted/30 border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Floor Assignment</Label>
                                    <Select onValueChange={v => setFormData({ ...formData, floorId: v })} defaultValue={selectedFloor ?? ""} required>
                                        <SelectTrigger className="rounded-sm bg-muted/30 border-none"><SelectValue placeholder="Select floor" /></SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            {floors.map((f) => {
                                                const availability = floorAvailability.find(a => a.floorId === f.id);

                                                return (
                                                    <SelectItem
                                                        key={f.id}
                                                        value={f.id!}
                                                        disabled={!availability?.isAvailable}
                                                    >
                                                        {f.label}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sharing</Label>
                                    <Select defaultValue="SINGLE" onValueChange={v => setFormData({ ...formData, sharing: v, capacity: SHARING_OPTIONS.find(s => s.type === v)?.capacity || 1 })}>
                                        <SelectTrigger className="rounded-sm bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            {SHARING_OPTIONS.map(s => <SelectItem key={s.type} value={s.type} >{s.type}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Room Type</Label>
                                    <Select defaultValue="NORMAL" onValueChange={v => setFormData({ ...formData, roomType: v })}>
                                        <SelectTrigger className="rounded-sm bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            <SelectItem value="NORMAL">Normal</SelectItem>
                                            <SelectItem value="AC">AC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rent (₹)</Label>
                                    <Input type="number" required value={formData.rent} onChange={e => setFormData({ ...formData, rent: e.target.value })} className="rounded-sm bg-muted/30 border-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amenities</Label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_AMENITIES.map((item) => (
                                        <button key={item} type="button" onClick={() => toggleFeature(item)} className={`px-4 py-2 rounded-sm text-xs font-bold transition-all border-2 ${features.includes(item) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 border-transparent hover:border-primary/50"}`}>
                                            {item}
                                        </button>
                                    ))}
                                    {!showCustomFeature && (
                                        <button type="button" onClick={() => setShowCustomFeature(true)} className="px-4 py-2 rounded-sm text-xs font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary text-muted-foreground">
                                            <Plus className="h-3 w-3 inline mr-1" /> Add Custom
                                        </button>
                                    )}
                                </div>
                                {showCustomFeature && (
                                    <div className="flex gap-2 mt-2 animate-in fade-in">
                                        <Input autoFocus value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="New amenity..." className="h-10 rounded-sm" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())} />
                                        <Button type="button" size="sm" onClick={addCustomFeature} className="h-10 px-4 rounded-sm">Add</Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row gap-3 items-center justify-end">
                                <Button
                                    variant={"ghost"}
                                    onClick={handleClose}
                                    className="rounded-sm"
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={submitting} className="rounded-sm font-black">
                                    {submitting ? "Creating..." : "Register Room"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}