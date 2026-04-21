// components/tenant/TenantSearchModal.tsx
import { useState } from "react";
import { Search, UserPlus, SearchX, Plus, Loader2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import CreateTempTenantForm from "./CreateTempTenantForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            setResults(res.data.data || []);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-card shadow-2xl rounded-sm">
                {/* Dynamic Header */}
                <div className="p-6 border-b border-border bg-muted/20 backdrop-blur-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {showTempForm && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowTempForm(false)}
                                    className="h-8 w-8 rounded-sm"
                                >
                                    <ArrowLeft size={16} />
                                </Button>
                            )}
                            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                {showTempForm ? "Guest Profile" : "Find Resident"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {!showTempForm ? (
                        <div className="space-y-6">
                            {/* Search Input Bar */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    {isSearching ? (
                                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    )}
                                </div>
                                <Input
                                    className="pl-11 bg-muted/30 border-border focus:ring-2 focus:ring-primary/20 rounded-sm transition-all"
                                    placeholder="Name, email or phone..."
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {/* Results Area */}
                            <ScrollArea className="max-h-[350px] pr-4">
                                <div className="space-y-2">
                                    {results.map((t: any) => (
                                        <div
                                            key={t.id}
                                            className="group flex items-center justify-between p-3 rounded-sm border border-transparent hover:border-primary/20 hover:bg-primary/5 cursor-pointer transition-all active:scale-[0.98]"
                                            onClick={() => onSelectTenant(t)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-sm bg-primary/10 flex items-center justify-center font-bold text-primary shadow-inner">
                                                    {t.fullName?.[0] || "?"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{t.fullName}</p>
                                                    <p className="text-xs text-muted-foreground font-medium">{t.phone}</p>
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                <Plus className="h-4 w-4" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Empty & Helper States */}
                                    {query.length > 0 && query.length < 3 && (
                                        <p className="text-center py-4 text-xs text-muted-foreground animate-pulse">
                                            Keep typing to search...
                                        </p>
                                    )}

                                    {query.length >= 3 && results.length === 0 && !isSearching && (
                                        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                                            <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <SearchX className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium mb-6">
                                                No results for "{query}"
                                            </p>
                                            <Button
                                                onClick={() => setShowTempForm(true)}
                                                className="bg-primary text-primary-foreground rounded-sm px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Create Guest Profile
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
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