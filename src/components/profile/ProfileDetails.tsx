import { Mail, Phone, User as UserIcon, ShieldCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props { onEdit: () => void; }

export default function ProfileDetails({ onEdit }: Props) {
    const { user } = useAuth();

    const InfoBlock = ({ icon: Icon, label, value }: any) => (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
                <Icon size={12} /> {label}
            </p>
            <p className="text-sm font-semibold text-foreground/90">{value || "—"}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between border-b pb-6">
                <div>
                    <h3 className="text-2xl font-bold">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Manage your public profile and contact details.</p>
                </div>
                <Button onClick={onEdit} variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5">
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <InfoBlock icon={UserIcon} label="Full Name" value={user?.name} />
                <InfoBlock icon={Mail} label="Email Address" value={user?.email} />
                <InfoBlock icon={Phone} label="Contact Number" value={user?.phone} />
                <InfoBlock icon={ShieldCheck} label="Primary Role" value={user?.role} />
            </div>

            <div className="pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2 italic">
                    <Calendar size={14} /> Account active since {new Date().getFullYear()}
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    System Verified
                </div>
            </div>
        </div>
    );
}