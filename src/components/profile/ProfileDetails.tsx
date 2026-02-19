import { Mail, Phone, User as UserIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface Props { onEdit: () => void; }

export default function ProfileDetails({ onEdit }: Props) {
    const { user } = useAuth();

    const InfoRow = ({ icon: Icon, label, value }: any) => (
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-card/50">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value || "Not provided"}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Account Details</h3>
                <Button onClick={onEdit} variant="outline" size="sm" className="rounded-full px-6">
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={UserIcon} label="Full Name" value={user?.name} />
                <InfoRow icon={Mail} label="Email Address" value={user?.email} />
                <InfoRow icon={Phone} label="Contact Number" value={user?.phone} />
                <InfoRow icon={ShieldCheck} label="Account Role" value={user?.role} />
            </div>

            <div className="p-4 rounded-xl border bg-accent/20 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold">Status</p>
                    <p className="text-xs text-muted-foreground">Your account is currently {user?.isActive ? 'active' : 'inactive'}</p>
                </div>
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                    {user?.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>
        </div>
    );
}