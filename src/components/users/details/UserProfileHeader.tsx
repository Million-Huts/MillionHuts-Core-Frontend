import { Badge } from "@/components/ui/badge";
import type { UserSummary } from "@/interfaces/pgUsers";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";

type Props = {
    user: UserSummary;
    pgRole: "OWNER" | "MANAGER" | "STAFF";
}

export const UserProfileHeader = ({ user, pgRole }: Props) => (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-card p-8 rounded-sm border border-border shadow-sm">
        {/* Avatar Placeholder */}
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
            <User size={40} />
        </div>

        {/* Identity Details */}
        <div className="space-y-4 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tighter">
                    {user.name}
                </h1>
                <Badge
                    variant={pgRole === 'OWNER' ? 'default' : 'secondary'}
                    className="w-fit rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest"
                >
                    {pgRole}
                </Badge>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground tracking-widest">
                    <div className="p-1.5 bg-muted rounded-lg"><Mail size={12} className="text-primary" /></div>
                    {user.email || "NO EMAIL PROVIDED"}
                </div>
                {user.phone ? (
                    <a href={`tel:+91${user.phone}`} className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="p-1.5 bg-muted rounded-lg"><Phone size={12} className="text-primary" /></div>
                        +91 {user.phone}
                    </a>
                ) : (
                    <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="p-1.5 bg-muted rounded-lg"><Phone size={12} className="text-primary" /></div>
                        NO PHONE
                    </div>
                )}
                <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="p-1.5 bg-muted rounded-lg"><ShieldCheck size={12} className="text-primary" /></div>
                    VERIFIED STAFF
                </div>
            </div>
        </div>
    </div>
);