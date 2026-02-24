import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Check, Settings2 } from "lucide-react";
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

const COMMON_SUGGESTIONS = ["Kitchen", "Balcony", "Lobby", "Terrace", "Study Room", "Gym"];

export default function EditFloorModal({ open, onClose, floor, pgId, onUpdated }: Props) {
    const [label, setLabel] = useState(floor.label);
    const [totalRooms, setTotalRooms] = useState(floor.totalRooms.toString());
    const [publicPlaces, setPublicPlaces] = useState<string[]>(floor.publicPlaces);
    const [placeInput, setPlaceInput] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sync state if floor data changes (e.g., when clicking a different floor)
    useEffect(() => {
        setLabel(floor.label);
        setTotalRooms(floor.totalRooms.toString());
        setPublicPlaces(floor.publicPlaces || []);
        setShowCustomInput(false);
    }, [floor, open]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            label,
            totalRooms: Number(totalRooms),
            publicPlaces
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
            <DialogContent className="sm:max-w-[480px] rounded-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                <DialogHeader>
                    <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-2">
                        <Settings2 className="h-6 w-6 text-amber-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Edit Floor Details</DialogTitle>
                    <DialogDescription>Update labels and shared amenities for <span className="font-semibold text-foreground">{floor.label}</span>.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Floor Label</Label>
                            <Input
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                required
                                className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Room Capacity</Label>
                            <Select value={totalRooms} onValueChange={setTotalRooms}>
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

                    {/* Shared Amenities Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Shared Amenities</Label>

                        <div className="flex flex-wrap gap-2">
                            {COMMON_SUGGESTIONS.map((suggestion) => {
                                const isSelected = publicPlaces.includes(suggestion);
                                return (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => togglePlace(suggestion)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${isSelected
                                            ? "bg-primary border-primary text-white shadow-md shadow-primary"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-primary"
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary transition-all"
                                >
                                    <Plus className="h-3 w-3" />
                                    Other
                                </button>
                            )}
                        </div>

                        {/* Inline Custom Area Input */}
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
                                <Button type="button" size="sm" onClick={addCustomPlace} className="rounded-xl h-9 bg-primary">Add</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowCustomInput(false)} className="rounded-xl h-9 px-2"><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        {/* Display for unique/custom areas */}
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
                        <Button type="submit" disabled={loading} className="rounded-xl px-8 font-bold shadow-lg shadow-amber-100 bg-primary">
                            {loading ? "Saving..." : "Update Floor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}