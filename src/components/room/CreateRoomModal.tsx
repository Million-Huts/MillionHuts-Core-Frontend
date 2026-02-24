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
import { AlertCircle, Loader2, Sparkles, X, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";

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

const COMMON_AMENITIES = ["Wardrobe", "Study Table", "Attached Washroom", "Balcony", "Window", "Mirror", "Chairs"];

export default function CreateRoomModal({ open, onClose, onCreated, pgId }: Props) {
    const [floors, setFloors] = useState<Floor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [floorError, setFloorError] = useState(false);

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
        // Reset local states
        setFeatures([]);
        setShowCustomFeature(false);
    }, [open, pgId]);

    const toggleFeature = (feature: string) => {
        setFeatures(prev =>
            prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
        );
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
        const payload = {
            ...formData,
            pgId,
            rent: Number(formData.rent),
            features
        };

        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/rooms`, payload);
            onCreated(res.data.data.room);
            toast.success("Room registered successfully");
            onClose();
        } catch {
            toast.error("Failed to create room");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="mt-4 font-bold text-muted-foreground tracking-tight">Syncing floors...</p>
                    </div>
                ) : floorError ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold italic">Missing Infrastructure</h3>
                            <p className="text-muted-foreground mt-2 text-sm">You need at least one floor before adding rooms.</p>
                        </div>
                        <Button asChild className="w-full rounded-xl h-12 shadow-lg shadow-red-100 bg-red-600 hover:bg-red-700">
                            <Link to="/floors">Go to Floor Settings</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-2">
                                <Sparkles className="h-6 w-6 text-indigo-600" />
                            </div>
                            <DialogTitle className="text-2xl font-black">Register Room</DialogTitle>
                            <DialogDescription>Define the specifics for this new unit.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            {/* Identity Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Room Name / No</Label>
                                    <Input
                                        placeholder="e.g. 101"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Assign to Floor</Label>
                                    <Select onValueChange={v => setFormData({ ...formData, floorId: v })} required>
                                        <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Floor" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {floors.map(f => <SelectItem key={f.id} value={f.id!}>{f.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Configuration Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Sharing</Label>
                                    <Select
                                        defaultValue="SINGLE"
                                        onValueChange={v => setFormData({ ...formData, sharing: v, capacity: SHARING_OPTIONS.find(s => s.type === v)?.capacity || 1 })}
                                    >
                                        <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {SHARING_OPTIONS.map(s => <SelectItem key={s.type} value={s.type}>{s.type}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Room Type</Label>
                                    <Select defaultValue="NORMAL" onValueChange={v => setFormData({ ...formData, roomType: v })}>
                                        <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="NORMAL">Normal</SelectItem>
                                            <SelectItem value="AC">AC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Rent (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        required
                                        value={formData.rent}
                                        onChange={e => setFormData({ ...formData, rent: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Room Amenities (Chip Selection) */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Room Amenities</Label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_AMENITIES.map((item) => {
                                        const isSelected = features.includes(item);
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => toggleFeature(item)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                                    }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3" />}
                                                {item}
                                            </button>
                                        );
                                    })}

                                    {!showCustomFeature && (
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomFeature(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Other
                                        </button>
                                    )}
                                </div>

                                {showCustomFeature && (
                                    <div className="flex gap-2 animate-in slide-in-from-left-1 duration-200 mt-2">
                                        <Input
                                            autoFocus
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            placeholder="Enter amenity..."
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                                            className="rounded-xl h-9 text-sm"
                                        />
                                        <Button type="button" size="sm" onClick={addCustomFeature} className="rounded-xl h-9">Add</Button>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => setShowCustomFeature(false)} className="rounded-xl h-9 px-2"><X className="h-4 w-4" /></Button>
                                    </div>
                                )}

                                {/* Custom Items Display */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {features.filter(f => !COMMON_AMENITIES.includes(f)).map((f, i) => (
                                        <span key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black animate-in zoom-in-50">
                                            {f}
                                            <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleFeature(f)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
                                <Button type="submit" disabled={submitting} className="rounded-xl px-12 h-12 shadow-xl shadow-indigo-100 font-black">
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