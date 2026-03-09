import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Floor } from "@/interfaces/floor";
import { X, Plus, Check, Building2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (floor: Floor) => void;
    pgId: string;
    autoIncreaseLimit: boolean;
    currentFloorCount: number;
}

const COMMON_SUGGESTIONS = ["Kitchen", "Balcony", "Lobby", "Terrace", "Study Room", "Gym"];

export default function CreateFloorModal({ open, onClose, onCreated, pgId, autoIncreaseLimit, currentFloorCount }: Props) {
    const [label, setLabel] = useState("");
    const [roomCount, setRoomCount] = useState("1");
    const [placeInput, setPlaceInput] = useState("");
    const [publicPlaces, setPublicPlaces] = useState<string[]>([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setLabel(`Floor ${currentFloorCount + 1}`);
            setRoomCount("1");
            setPublicPlaces([]);
            setShowCustomInput(false);
        }
    }, [open, currentFloorCount]);

    const togglePlace = (place: string) => {
        setPublicPlaces(prev => prev.includes(place) ? prev.filter(p => p !== place) : [...prev, place]);
    };

    const addCustomPlace = () => {
        const val = placeInput.trim();
        if (val && !publicPlaces.includes(val)) {
            setPublicPlaces([...publicPlaces, val]);
            setPlaceInput("");
            setShowCustomInput(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/floors`, {
                pgId, label, totalRooms: Number(roomCount), publicPlaces, autoIncreaseLimit, currentFloorCount
            });
            onCreated(res.data.data.floor);
            toast.success("Floor added successfully");
            onClose();
        } catch {
            toast.error("Failed to create floor");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                <div className="p-8 pb-4 bg-muted/20">
                    <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-inner">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tighter">Add New Floor</DialogTitle>
                    <DialogDescription className="font-medium text-muted-foreground mt-1">
                        Define structural details for this level.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Label</Label>
                            <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-12 rounded-2xl bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Capacity</Label>
                            <Select value={roomCount} onValueChange={setRoomCount}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {[...Array(15)].map((_, i) => <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Rooms</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Common Areas</Label>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_SUGGESTIONS.map(place => (
                                <button key={place} type="button" onClick={() => togglePlace(place)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${publicPlaces.includes(place) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-transparent hover:border-primary/50"}`}>
                                    {publicPlaces.includes(place) && <Check className="h-3 w-3 inline mr-2" />}
                                    {place}
                                </button>
                            ))}

                            {!showCustomInput && (
                                <button type="button" onClick={() => setShowCustomInput(true)} className="px-4 py-2 rounded-full text-sm font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="h-3 w-3 inline mr-1" /> Add Custom
                                </button>
                            )}
                        </div>

                        {showCustomInput && (
                            <div className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                                <Input autoFocus value={placeInput} onChange={(e) => setPlaceInput(e.target.value)} placeholder="e.g. Yoga Room" className="h-10 rounded-xl" />
                                <Button type="button" onClick={addCustomPlace} className="rounded-xl h-10 px-4">Add</Button>
                                <Button type="button" variant="ghost" onClick={() => setShowCustomInput(false)} className="rounded-xl h-10 px-2"><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                            {publicPlaces.filter(p => !COMMON_SUGGESTIONS.includes(p)).map((place, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                    {place} <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => togglePlace(place)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-full h-12 px-6 font-bold">Cancel</Button>
                        <Button type="submit" disabled={submitting} className="rounded-full h-12 px-8 font-black shadow-lg shadow-primary/20">
                            {submitting ? "Processing..." : "Confirm Floor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}