import { Mail, Phone, User as UserIcon, ShieldCheck, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePG } from "@/context/PGContext";

interface Props { onEdit: () => void; }

export default function ProfileDetails({ onEdit }: Props) {
    const { user } = useAuth();
    const { currentPG } = usePG();

    const InfoBlock = ({ icon: Icon, label, value }: any) => (
        <div className="group space-y-1.5 p-4 rounded-sm bg-muted/30 border border-border/50 transition-all hover:bg-primary/5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Icon size={12} className="text-primary" /> {label}
            </p>
            <p className="text-sm font-black tracking-tight text-foreground/90">{value || "—"}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h3 className="font-black text-xl uppercase tracking-tighter">Identity Registry</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manage personal contact data</p>
                </div>
                <Button
                    onClick={onEdit}
                    variant="outline"
                    className="rounded-sm font-black uppercase tracking-widest text-[10px] gap-2 shadow-sm"
                >
                    <Pencil size={12} /> Edit Identity
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoBlock icon={UserIcon} label="Full Name" value={user?.name} />
                <InfoBlock icon={Mail} label="Email Address" value={user?.email} />
                <InfoBlock icon={Phone} label="Contact Number" value={user?.phone} />
                <InfoBlock icon={ShieldCheck} label="System Role" value={currentPG?.role} />
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Calendar size={14} className="text-primary" />
                    <span>Account active since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">System Verified</span>
                </div>
            </div>
        </div>
    );
}