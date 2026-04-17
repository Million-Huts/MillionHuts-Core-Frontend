import { useEffect, useState } from "react";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import type { Category, CustomAmenity } from "@/interfaces/amenities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Settings2,
    Trash2,
    Edit3,
    Sparkles,
    LayoutGrid,
    Loader2,
    X
} from "lucide-react";
import { AmenityManager } from "@/components/property/amenity/AmenityManager";

export default function PGAmenitiesPage() {
    const { currentPG } = usePG();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [initialAmenities, setInitialAmenities] = useState<string[]>([]);
    const [customAmenities, setCustomAmenities] = useState<CustomAmenity[]>([]);

    const [newCustom, setNewCustom] = useState("");
    const [editingCustom, setEditingCustom] = useState<CustomAmenity | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [globalRes, pgRes] = await Promise.all([
                apiPrivate.get(`/pgs/${currentPG?.id}/amenities/global`),
                apiPrivate.get(`/pgs/${currentPG?.id}/amenities`),
            ]);
            setCategories(globalRes.data.data);
            const assignedIds = pgRes.data.data.amenities.map((a: any) => a.amenityId);
            setSelectedAmenities(assignedIds);
            setInitialAmenities(assignedIds);
            setCustomAmenities(pgRes.data.data.customAmenities);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [currentPG]);

    const toggleAmenity = (id: string) => {
        setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const saveAmenities = async () => {
        await apiPrivate.post(`/pgs/${currentPG?.id}/amenities`, { amenityIds: selectedAmenities });
        setInitialAmenities(selectedAmenities);
        fetchData();
    };

    const removeAmenity = async (id: string) => {
        await apiPrivate.delete(`/pgs/${currentPG?.id}/amenities/${id}`);
        setSelectedAmenities(prev => prev.filter(a => a !== id));
        setInitialAmenities(prev => prev.filter(a => a !== id));
    };

    const addCustomAmenity = async () => {
        if (!newCustom) return;
        await apiPrivate.post(`/pgs/${currentPG?.id}/amenities/custom`, { name: newCustom });
        setNewCustom("");
        fetchData();
    };

    const updateCustomAmenity = async () => {
        if (!editingCustom) return;
        await apiPrivate.patch(`/pgs/${currentPG?.id}/amenities/custom/${editingCustom.id}`, { name: editingCustom.name });
        setEditingCustom(null);
        fetchData();
    };

    const deleteCustomAmenity = async (id: string) => {
        await apiPrivate.delete(`/pgs/${currentPG?.id}/amenities/custom/${id}`);
        fetchData();
    };

    const isChanged = JSON.stringify([...initialAmenities].sort()) !== JSON.stringify([...selectedAmenities].sort());

    return (
        <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight">Facility Hub</h1>
                    <p className="text-muted-foreground font-medium italic">Configure what makes your property special.</p>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="lg" className="rounded-sm h-14 px-8 gap-2 shadow-xl shadow-primary/20">
                            <Settings2 className="h-5 w-5" />
                            Manage Global Amenities
                        </Button>
                    </SheetTrigger>
                    <AmenityManager
                        categories={categories}
                        selectedIds={selectedAmenities}
                        onToggle={toggleAmenity}
                        onSave={saveAmenities}
                        isChanged={isChanged}
                        loading={loading}
                    />
                </Sheet>
            </div>

            {loading && !categories.length ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Active Standard Amenities */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="text-primary h-6 w-6" />
                            <h2 className="text-xl font-bold">Live Facilities</h2>
                        </div>

                        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
                            <div className="flex flex-wrap gap-3">
                                {selectedAmenities.length > 0 ? (
                                    selectedAmenities.map(id => {
                                        const name = categories.flatMap(c => c.amenities).find(a => a.id === id)?.name || "Unknown";
                                        return (
                                            <Badge key={id} variant="secondary" className="pl-4 pr-2 py-2 rounded-sm text-sm border-none bg-muted/50 hover:bg-destructive/10 hover:text-destructive group transition-all">
                                                {name}
                                                <button onClick={() => removeAmenity(id)} className="ml-2 p-1 rounded-md group-hover:bg-destructive/20">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted-foreground py-10 text-center w-full italic">No standard amenities selected.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Custom Amenities Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-primary h-6 w-6" />
                            <h2 className="text-xl font-bold">Unique Add-ons</h2>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-sm p-6 space-y-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., PS5 Zone"
                                    className="rounded-sm border-primary/20 bg-background"
                                    value={newCustom}
                                    onChange={e => setNewCustom(e.target.value)}
                                />
                                <Button onClick={addCustomAmenity} size="icon" className="shrink-0 rounded-full">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {customAmenities.map(c => (
                                    <div key={c.id} className="flex items-center justify-between p-3 bg-background rounded-2xl border border-border group">
                                        <span className="font-semibold text-sm">{c.name}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingCustom(c)} className="h-8 w-8 rounded-lg">
                                                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="rounded-3xl">
                                                    <DialogHeader><DialogTitle>Rename Custom Amenity</DialogTitle></DialogHeader>
                                                    <Input
                                                        value={editingCustom?.name || ""}
                                                        onChange={e => setEditingCustom(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                        className="rounded-xl"
                                                    />
                                                    <Button onClick={updateCustomAmenity} className="rounded-xl">Update Name</Button>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" onClick={() => deleteCustomAmenity(c.id)} className="h-8 w-8 rounded-lg hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}