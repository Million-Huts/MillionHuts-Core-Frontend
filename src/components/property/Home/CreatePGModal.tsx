import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Building2, Loader2, MapPinned } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { usePG } from "@/context/PGContext";
import type { PG } from "@/interfaces/pg";
import { cn } from "@/lib/utils";

// Data Import (Assuming constants file or direct JSON)
import regionData from "../../../../public/data/india-regions.json";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (pg: PG) => void;
}

export default function CreatePGModal({ open, onClose, onCreated }: Props) {
    const { pgs, setPGs } = usePG();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States for Comboboxes
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [cityOpen, setCityOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);

        // Merge Combobox values and locality
        const payload = {
            ...rawData,
            city: city,
            state: state,
        };

        setIsSubmitting(true);
        const toastId = toast.loading("Establishing your new property...");

        try {
            const res = await apiPrivate.post("/pgs", payload);
            const newPG: PG = res.data.data.pg;

            onCreated(newPG);
            setPGs([...pgs, { id: newPG.id, name: newPG.name, role: newPG.role, staffType: newPG.staffType }]);

            toast.success(`${newPG.name} is now live!`, { id: toastId });
            onClose();
            setCity("");
            setState("");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create property", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => !isSubmitting && onClose()}>
            <DialogContent className="sm:max-w-[520px] border-none shadow-2xl max-h-[95vh] overflow-y-auto p-0 bg-card">
                <div className="h-1.5 bg-primary w-full" />

                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                New Establishment
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Set up the foundation of your property. Location details help in SEO and user discovery.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Property Name */}
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Property Name</Label>
                            <Input name="name" placeholder="e.g. Royal Orchid PG" required disabled={isSubmitting} className="h-11 rounded-sm bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary" />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                            <Input name="address" placeholder="Building no, Street name..." required disabled={isSubmitting} className="h-11 rounded-sm bg-muted/30 border-none" />
                        </div>

                        {/* Locality (New Field) */}
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Locality / Landmark</Label>
                            <div className="relative">
                                <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input name="locality" placeholder="e.g. Near HSR Club" required disabled={isSubmitting} className="h-11 pl-10 rounded-sm bg-muted/30 border-none" />
                            </div>
                        </div>

                        {/* City & State Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* City Combobox */}
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">City</Label>
                                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={cityOpen} className="h-11 justify-between rounded-sm bg-muted/30 border-none font-normal">
                                            {city ? city : "Select City"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search city..." onValueChange={setCitySearch} />
                                            <CommandList>
                                                <CommandEmpty className="p-2">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-xs gap-2"
                                                        onClick={() => { setCity(citySearch); setCityOpen(false); }}
                                                    >
                                                        Use "{citySearch}"
                                                    </Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {regionData.popularCities.map((item) => (
                                                        <CommandItem
                                                            key={item}
                                                            value={item}
                                                            onSelect={(currentValue) => {
                                                                setCity(currentValue);
                                                                setCityOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", city === item ? "opacity-100" : "opacity-0")} />
                                                            {item}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* State Combobox */}
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">State</Label>
                                <Popover open={stateOpen} onOpenChange={setStateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={stateOpen} className="h-11 justify-between rounded-sm bg-muted/30 border-none font-normal">
                                            {state ? state : "Select State"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search state..." />
                                            <CommandList>
                                                <CommandEmpty>No state found.</CommandEmpty>
                                                <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                    {regionData.states.map((item) => (
                                                        <CommandItem
                                                            key={item}
                                                            value={item}
                                                            onSelect={(currentValue) => {
                                                                setState(currentValue);
                                                                setStateOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", state === item ? "opacity-100" : "opacity-0")} />
                                                            {item}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Pincode */}
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pincode</Label>
                            <Input name="pincode" placeholder="6-digit code" required maxLength={6} pattern="\d{6}" disabled={isSubmitting} className="h-11 rounded-sm bg-muted/30 border-none" />
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-sm font-bold">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !city || !state} className="rounded-sm px-8 h-11 font-black shadow-xl shadow-primary/20 min-w-[160px]">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Establish Property"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}