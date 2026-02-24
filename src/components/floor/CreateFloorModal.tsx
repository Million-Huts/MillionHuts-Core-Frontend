import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Floor } from "@/pages/Floor/Floors";
import { X, Plus, Sparkles, Check } from "lucide-react";

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

    // Auto-initialize label when modal opens
    useEffect(() => {
        if (open) {
            setLabel(`Floor ${currentFloorCount + 1}`);
            setRoomCount("1");
            setPublicPlaces([]);
            setShowCustomInput(false);
        }
    }, [open, currentFloorCount]);

    const togglePlace = (place: string) => {
        if (publicPlaces.includes(place)) {
            setPublicPlaces(publicPlaces.filter(p => p !== place));
        } else {
            setPublicPlaces([...publicPlaces, place]);
        }
    };

    const addCustomPlace = () => {
        const val = placeInput.trim();
        if (!val) return;
        if (publicPlaces.includes(val)) {
            toast.error("Area already added");
            return;
        }
        setPublicPlaces([...publicPlaces, val]);
        setPlaceInput("");
        setShowCustomInput(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            pgId,
            label,
            totalRooms: Number(roomCount),
            publicPlaces,
            autoIncreaseLimit,
            currentFloorCount
        };

        try {
            const res = await apiPrivate.post(`/pgs/${pgId}/floors`, payload);
            onCreated(res.data.data.floor);
            toast.success("New floor added successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create floor");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] rounded-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                <DialogHeader>
                    <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Add New Floor</DialogTitle>
                    <DialogDescription>Setup the structural details for this level.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Floor Label</Label>
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g. 2nd Floor"
                                required
                                className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Room Capacity</Label>
                            <Select value={roomCount} onValueChange={setRoomCount}>
                                <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all">
                                    <SelectValue placeholder="Rooms" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {[...Array(15)].map((_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {i + 1} {i === 0 ? 'Room' : 'Rooms'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Common Areas Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Common Areas</Label>

                        <div className="flex flex-wrap gap-2">
                            {COMMON_SUGGESTIONS.map((suggestion) => {
                                const isSelected = publicPlaces.includes(suggestion);
                                return (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => togglePlace(suggestion)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${isSelected
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                            }`}
                                    >
                                        {isSelected && <Check className="h-3 w-3" />}
                                        {suggestion}
                                    </button>
                                );
                            })}

                            {!showCustomInput && (
                                <button
                                    type="button"
                                    onClick={() => setShowCustomInput(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                                >
                                    <Plus className="h-3 w-3" />
                                    Other
                                </button>
                            )}
                        </div>

                        {showCustomInput && (
                            <div className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                                <Input
                                    autoFocus
                                    value={placeInput}
                                    onChange={(e) => setPlaceInput(e.target.value)}
                                    placeholder="Enter custom area..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPlace())}
                                    className="rounded-xl h-9"
                                />
                                <Button type="button" size="sm" onClick={addCustomPlace} className="rounded-xl h-9">Add</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowCustomInput(false)} className="rounded-xl h-9 px-2"><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        {/* Visual Display for custom items */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {publicPlaces.filter(p => !COMMON_SUGGESTIONS.includes(p)).map((place, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in-50">
                                    {place}
                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => togglePlace(place)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-semibold">Cancel</Button>
                        <Button type="submit" disabled={submitting} className="rounded-xl px-8 font-bold shadow-lg shadow-indigo-100">
                            {submitting ? "Processing..." : "Confirm Floor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}