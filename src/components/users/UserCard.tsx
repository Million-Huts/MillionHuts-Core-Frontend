import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, ShieldAlert } from "lucide-react";

interface UserCardProps {
    user: any;
    onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
    const isPending = !user.user.email;

    return (
        <Card
            className="group relative overflow-hidden p-5 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {user.user.name}
                    </h3>
                    <Badge variant={user.role === 'MANAGER' ? 'default' : 'secondary'} className="text-[10px] font-bold tracking-wider uppercase">
                        {user.role}
                    </Badge>
                </div>
                <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center text-sm text-slate-500 gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    {user.user.phone || "No phone"}
                </div>

                <div className="flex items-center text-sm text-slate-500 gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{user.user.email || "Email pending"}</span>
                </div>

                {user.user.lastLoginAt && (
                    <div className="flex items-center text-xs text-slate-400 gap-2 pt-2 border-t border-slate-50">
                        <Clock className="w-3.5 h-3.5" />
                        Last active: {new Date(user.user.lastLoginAt).toLocaleDateString()}
                    </div>
                )}
            </div>

            {isPending && (
                <div className="mt-4 flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[11px] font-bold border border-amber-100">
                    <ShieldAlert className="w-3 h-3" />
                    PROFILE INCOMPLETE
                </div>
            )}
        </Card>
    );
};