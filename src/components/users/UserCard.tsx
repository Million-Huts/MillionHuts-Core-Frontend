import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, ShieldAlert, User } from "lucide-react";
import type { PGUser } from "@/interfaces/pgUsers";

interface UserCardProps {
    user: PGUser;
    onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
    const isPending = !user.user.email;

    return (
        <Card
            className="group relative overflow-hidden p-6 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer bg-card border-border rounded-sm"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm tracking-tight text-foreground group-hover:text-primary transition-colors uppercase tracking-widest">
                            {user.user.name}
                        </h3>
                        <Badge
                            variant={user.role === 'MANAGER' ? 'default' : 'secondary'}
                            className="mt-1 rounded-full text-[9px] font-black tracking-widest uppercase px-3"
                        >
                            {user.role}
                        </Badge>
                    </div>
                </div>
                <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-300'}`} />
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-[11px] font-bold text-muted-foreground gap-3">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    {user.user.phone || "NO CONTACT DATA"}
                </div>

                <div className="flex items-center text-[11px] font-bold text-muted-foreground gap-3">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{user.user.email || "PENDING VERIFICATION"}</span>
                </div>

                {user.user.lastLoginAt && (
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 gap-3 pt-4 border-t border-border">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(user.user.lastLoginAt).toLocaleDateString()}
                    </div>
                )}
            </div>

            {isPending && (
                <div className="mt-4 flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    PROFILE INCOMPLETE
                </div>
            )}
        </Card>
    );
};