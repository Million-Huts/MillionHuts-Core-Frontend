// components/tenant/TenantSearchResults.tsx
import { Plus, CheckCircle2, Search } from "lucide-react";
import type { Tenant } from "@/interfaces/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
    tenants: Tenant[];
    onSelect: (tenant: Tenant) => void;
}

export default function TenantSearchResults({ tenants, onSelect }: Props) {
    if (tenants.length === 0) return null;

    return (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
                    <Search size={10} className="text-primary" />
                    Search Results ({tenants.length})
                </p>
                <div className="h-[1px] flex-1 bg-border/40 ml-4" />
            </div>

            <ScrollArea className="h-[380px] pr-4 -mr-4">
                <div className="space-y-3 pb-4">
                    {tenants.map((t, index) => (
                        <div
                            key={t.id}
                            onClick={() => onSelect(t)}
                            style={{ animationDelay: `${index * 40}ms` }}
                            className="group flex items-center justify-between rounded-sm border border-border bg-card/50 p-3.5 transition-all hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-lg hover:shadow-primary/5 cursor-pointer animate-in fade-in slide-in-from-right-4 fill-mode-both"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-background ring-1 ring-border shadow-sm group-hover:ring-primary/20 transition-all">
                                        <AvatarImage src={t.profileImage} className="object-cover" />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                                            {t.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Sub-badge for KYC if verified */}
                                    {Array.isArray(t.kycs) && t.kycs.length > 0 && (
                                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 ring-1 ring-border">
                                            <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-500/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-bold leading-none text-foreground group-hover:text-primary transition-colors">
                                        {t.fullName}
                                    </p>
                                    <p className="text-[11px] font-medium text-muted-foreground/80 font-mono tracking-tight">
                                        {t.phone || t.email || "No contact info"}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button Indicator */}
                            <div className="h-9 w-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:rotate-90 group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                                <Plus size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}