// components/tenant/TenantSearchModal.tsx
import { useState } from "react";
import { Search, UserPlus, SearchX, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import CreateTempTenantForm from "./CreateTempTenantForm";

export default function TenantSearchModal({ open, onClose, onSelectTenant }: any) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showTempForm, setShowTempForm] = useState(false);

    const handleSearch = async (val: string) => {
        setQuery(val);
        if (val.length < 3) return setResults([]);

        setIsSearching(true);
        try {
            const res = await apiPrivate.get(`/tenants/search?q=${val}`);
            setResults(res.data.tenants || []);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md overflow-hidden p-0">
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle>{showTempForm ? "Create Temporary Profile" : "Add New Resident"}</DialogTitle>
                    </DialogHeader>

                    {!showTempForm ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10 h-11"
                                    placeholder="Search by name, email or phone..."
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                {results.map((t: any) => (
                                    <div
                                        key={t.id}
                                        className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => onSelectTenant(t)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {t.fullName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t.fullName}</p>
                                                <p className="text-xs text-muted-foreground">{t.phone}</p>
                                            </div>
                                        </div>
                                        <Plus className="h-4 w-4 text-primary" />
                                    </div>
                                ))}

                                {query.length >= 3 && results.length === 0 && !isSearching && (
                                    <div className="text-center py-8">
                                        <SearchX className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-4">No tenant found with "{query}"</p>
                                        <Button variant="outline" onClick={() => setShowTempForm(true)} className="gap-2">
                                            <UserPlus className="h-4 w-4" /> Create Guest Profile
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <CreateTempTenantForm
                            onCreated={(t) => onSelectTenant(t)}
                            onCancel={() => setShowTempForm(false)}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}