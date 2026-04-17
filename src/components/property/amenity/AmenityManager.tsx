import { useMemo, useState } from "react";
import { Search, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category } from "@/interfaces/amenities";

interface ManagerProps {
    categories: Category[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onSave: () => void;
    isChanged: boolean;
    loading: boolean;
}

export function AmenityManager({ categories, selectedIds, onToggle, onSave, isChanged, loading }: ManagerProps) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search) return categories;
        return categories.map(cat => ({
            ...cat,
            amenities: cat.amenities.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
        })).filter(cat => cat.amenities.length > 0);
    }, [categories, search]);

    return (
        <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full bg-background border-l border-border px-4 overflow-y-auto">
            <SheetHeader className="pb-4">
                <SheetTitle className="text-2xl font-black">Manage Amenities</SheetTitle>
                <SheetDescription>Select the standard amenities available at your property.</SheetDescription>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter amenities..."
                        className="pl-10 rounded-sm bg-muted/50 border-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </SheetHeader>

            <ScrollArea className="flex-1 mt-4 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    {filtered.map((cat) => (
                        <div key={cat.id} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
                                    {cat.name}
                                </h3>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {cat.amenities.map((a) => (
                                    <label
                                        key={a.id}
                                        className={`flex items-center justify-between p-3 rounded-sm transition-all cursor-pointer group
                                            ${selectedIds.includes(a.id) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
                                        `}
                                    >
                                        <span className="text-sm font-medium">{a.name}</span>
                                        <Checkbox
                                            checked={selectedIds.includes(a.id)}
                                            onCheckedChange={() => onToggle(a.id)}
                                            className="rounded-full border-primary/50 data-[state=checked]:bg-primary"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <SheetFooter className="flex flex-row items-center justify-end gap-2 pt-4 border-t border-dashed">
                <SheetClose asChild>
                    <Button
                        className="w-fit rounded-sm "
                        variant={"outline"}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Close
                    </Button>
                </SheetClose>
                <Button
                    disabled={!isChanged || loading}
                    onClick={onSave}
                    className="w-fit rounded-sm shadow-lg shadow-primary/20"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Update Amenities
                </Button>

            </SheetFooter>
        </SheetContent>
    );
}