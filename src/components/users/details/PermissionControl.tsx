import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Info, Lock } from "lucide-react";

type Props = {
    currentRole: "OWNER" | "MANAGER" | "STAFF";
    onRoleChange: (role: string) => Promise<void>;
    onToggleStatus: () => void;
    isActive: boolean;
    isDisabled: boolean;
    reason: string;
}

export const PermissionControl = ({ currentRole, onRoleChange, onToggleStatus, isActive, isDisabled, reason }: Props) => (
    <Card className="rounded-sm border-border p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDisabled ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                    {isDisabled ? <Lock className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                    <h2 className="font-black text-lg tracking-tighter">Access Control</h2>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Configure Hierarchy</p>
                </div>
            </div>
        </div>

        {isDisabled && (
            <div className="mb-8 p-4 bg-amber-500/10 text-amber-600 text-[11px] font-black uppercase tracking-widest rounded-sm border border-amber-500/20 flex items-center gap-3">
                <Info size={14} className="shrink-0" />
                {reason}
            </div>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Role</label>
                <Select value={currentRole} onValueChange={onRoleChange} disabled={isDisabled}>
                    <SelectTrigger className="h-12 rounded-sm border-border bg-muted/30 font-bold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-border">
                        <SelectItem value="OWNER" className="font-bold">OWNER (FULL ACCESS)</SelectItem>
                        <SelectItem value="MANAGER" className="font-bold">MANAGER</SelectItem>
                        <SelectItem value="STAFF" className="font-bold">STAFF</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Status</label>
                <Button
                    variant={isActive ? "outline" : "default"}
                    className={`h-12 w-full rounded-sm font-black uppercase tracking-widest text-[10px] ${isActive ? "border-rose-200 text-rose-600" : "bg-primary shadow-lg shadow-primary/20"
                        }`}
                    onClick={onToggleStatus}
                    disabled={isDisabled}
                >
                    {isActive ? "Deactivate Account" : "Activate Account"}
                </Button>
            </div>
        </div>
    </Card>
);