import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone } from "lucide-react";

export const UserProfileHeader = ({ user, pgRole }: any) => (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User size={40} />
        </div>
        <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <Badge variant={pgRole === 'OWNER' ? 'default' : 'secondary'}>
                    {pgRole}
                </Badge>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                    <Mail size={14} /> {user.email || "No email provided"}
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={14} /> {user.phone || "No phone"}
                </div>
            </div>
        </div>
    </div>
);