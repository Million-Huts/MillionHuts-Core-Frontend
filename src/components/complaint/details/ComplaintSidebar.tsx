import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Edit2, Save, X, Trash2, AlertTriangle, User, ShieldCheck, Activity } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface PGStaff {
    role: string;
    isActive: boolean;
    user: {
        id: string;
        name: string;
    };
}

export default function ComplaintSidebar({ complaint, users, onRefresh }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValues, setTempValues] = useState({
        status: complaint.status,
        priority: complaint.priority,
        assignedToId: complaint.assignedToId || "unassigned",
    });

    const navigate = useNavigate();

    const getAssigneeName = (id: string) => {
        const staff = users.find((u: PGStaff) => u.user.id === id);
        return staff ? staff.user.name : "Unassigned";
    };

    const handleSave = async () => {
        try {
            const updates = [];
            if (tempValues.status !== complaint.status)
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/status`, { status: tempValues.status }));

            if (tempValues.priority !== complaint.priority)
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/priority`, { priority: tempValues.priority }));

            if (tempValues.assignedToId !== complaint.assignedToId) {
                const isUnassigned = tempValues.assignedToId === "unassigned";
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/assign`, {
                    assignedToId: isUnassigned ? null : tempValues.assignedToId,
                    assignedToType: isUnassigned ? null : "STAFF"
                }));
            }

            await Promise.all(updates);
            toast.success("System updated");
            setIsEditing(false);
            onRefresh();
        } catch {
            toast.error("Update failed");
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-sm shadow-xl overflow-hidden bg-card">
                <CardHeader className="bg-slate-950 text-white py-5 px-6 flex flex-row items-center justify-between border-b-0">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em]">Control</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`h-9 w-9 p-0 rounded-full transition-colors ${isEditing ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                    >
                        {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </Button>
                </CardHeader>

                <CardContent className="space-y-8 pt-8 px-6 pb-8">
                    {/* Status Engine */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Status Engine
                        </Label>
                        {isEditing ? (
                            <Select
                                value={tempValues.status}
                                onValueChange={(v) => setTempValues({ ...tempValues, status: v })}
                            >
                                <SelectTrigger className="w-full bg-muted/50 border-border rounded-sm h-12 font-bold focus:ring-primary/20">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border shadow-2xl">
                                    <SelectItem value="OPEN" className="font-bold">OPEN</SelectItem>
                                    <SelectItem value="IN_PROGRESS" className="font-bold">IN PROGRESS</SelectItem>
                                    <SelectItem value="RESOLVED" className="font-bold">RESOLVED</SelectItem>
                                    <SelectItem value="CLOSED" className="font-bold">CLOSED</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex">
                                <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                                    {complaint.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Priority Matrix */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Priority Matrix</Label>
                        {isEditing ? (
                            <Select
                                value={tempValues.priority}
                                onValueChange={(v) => setTempValues({ ...tempValues, priority: v })}
                            >
                                <SelectTrigger className="w-full bg-muted/50 border-border rounded-sm h-12 font-bold focus:ring-primary/20">
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border shadow-2xl">
                                    <SelectItem value="LOW" className="font-bold">LOW</SelectItem>
                                    <SelectItem value="MEDIUM" className="font-bold">MEDIUM</SelectItem>
                                    <SelectItem value="HIGH" className="font-bold">HIGH</SelectItem>
                                    <SelectItem value="URGENT" className="font-bold text-rose-500">URGENT</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-sm border border-border/50">
                                <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px] ${complaint.priority === 'URGENT' || complaint.priority === 'HIGH' ? 'bg-rose-500 shadow-rose-500/50' : 'bg-amber-500 shadow-amber-500/50'
                                    }`} />
                                <span className="text-xs font-black uppercase tracking-widest text-foreground">{complaint.priority}</span>
                            </div>
                        )}
                    </div>

                    {/* Active Handler */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Handler</Label>
                        {isEditing ? (
                            <Select
                                value={tempValues.assignedToId}
                                onValueChange={(v) => setTempValues({ ...tempValues, assignedToId: v })}
                            >
                                <SelectTrigger className="w-full bg-muted/50 border-border rounded-sm h-12 font-bold focus:ring-primary/20">
                                    <SelectValue placeholder="Assign Staff" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-border shadow-2xl">
                                    <SelectItem value="unassigned" className="font-bold text-muted-foreground">UNASSIGNED</SelectItem>
                                    {users.map((staff: PGStaff) => (
                                        <SelectItem key={staff.user.id} value={staff.user.id} className="font-bold">
                                            {staff.user.name.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center gap-4 bg-slate-950/5 p-4 rounded-sm border border-slate-950/5">
                                <div className="h-10 w-10 bg-slate-950 rounded-full flex items-center justify-center text-white">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground leading-none mb-1">Assigned Staff</p>
                                    <p className="text-sm font-bold text-foreground leading-none">
                                        {getAssigneeName(complaint.assignedToId)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full rounded-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] mt-2 group">
                                    Commit Changes <Save className="w-3.5 h-3.5 ml-2 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-sm border-none p-8">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-black tracking-tighter">Sync Updates?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground font-medium">
                                        This will modify the ticket state in the global ledger.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="rounded-sm font-bold">Abort</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSave} className="rounded-sm font-black bg-slate-950">Execute Update</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-rose-500/60 hover:text-rose-600 gap-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">
                        <Trash2 className="w-3.5 h-3.5" /> Purge Ticket Data
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-sm border-4 border-rose-500/20 shadow-2xl">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 text-rose-600 mb-4 bg-rose-50 w-fit mx-auto px-4 py-2 rounded-sm">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Permanent Destruction</span>
                        </div>
                        <AlertDialogTitle className="text-3xl font-black text-center w-full tracking-tighter leading-none">Delete this record?</AlertDialogTitle>
                        <AlertDialogDescription className="pt-4 text-base font-medium text-center">
                            This action is final. All logs, media attachments, and thread history for this complaint will be wiped fully.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="rounded-sm font-bold px-6">Keep Record</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await apiPrivate.delete(`pgs/${complaint.pgId}/complaints/${complaint.id}`);
                                    toast.success("Ticket purged");
                                    navigate(`/pgs/${complaint.pgId}/complaints`);
                                } catch {
                                    toast.error("Purge failed");
                                }
                            }}
                            className="bg-background text-white rounded-sm font-black px-8 uppercase tracking-widest text-[10px]"
                        >
                            Confirm Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}