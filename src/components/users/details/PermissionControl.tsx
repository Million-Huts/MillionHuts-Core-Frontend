import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Info } from "lucide-react";

export const PermissionControl = ({ currentRole, onRoleChange, onToggleStatus, isActive, isDisabled, reason }: any) => (
    <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">Access Control</h2>
        </div>

        {isDisabled && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-100 flex items-center gap-2">
                <Info size={14} />
                {reason}
            </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">System Role</label>
                <Select value={currentRole} onValueChange={onRoleChange} disabled={isDisabled}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="OWNER">Owner (Full System Access)</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Account Status</label>
                <div className="flex items-center gap-3">
                    <Button
                        variant={isActive ? "outline" : "default"}
                        className="w-full"
                        onClick={onToggleStatus}
                        disabled={isDisabled}
                    >
                        {isActive ? "Deactivate Account" : "Activate Account"}
                    </Button>
                </div>
            </div>
        </div>
    </Card>
);