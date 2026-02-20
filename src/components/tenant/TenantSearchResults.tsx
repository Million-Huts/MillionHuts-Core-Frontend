// components/tenant/TenantSearchResults.tsx
import { Plus, CheckCircle2 } from "lucide-react";
import type { Tenant } from "@/interfaces/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TenantSearchResults({
    tenants,
    onSelect,
}: {
    tenants: Tenant[];
    onSelect: (tenant: Tenant) => void;
}) {
    return (
        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-3">
                Search Results ({tenants.length})
            </p>
            {tenants.map((t) => (
                <div
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className="group flex items-center justify-between rounded-2xl border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={t.profileImage} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                {t.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold leading-none">{t.fullName}</p>
                                {Array.isArray(t.kycs) && <CheckCircle2 size={14} className="text-blue-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t.phone || t.email}
                            </p>
                        </div>
                    </div>

                    <div className="h-8 w-8 rounded-full border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        <Plus size={16} />
                    </div>
                </div>
            ))}
        </div>
    );
}