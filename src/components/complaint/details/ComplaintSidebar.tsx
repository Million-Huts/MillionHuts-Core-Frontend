import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X, Trash2, AlertTriangle, User } from "lucide-react";
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

// Define the nested staff interface to match the new response
interface PGStaff {
    role: string;
    isActive: boolean;
    user: {
        id: string;
        name: string;
    };
}

interface ComplaintSidebarProps {
    complaint: any;
    users: PGStaff[]; // Updated type
    onRefresh: () => void;
}

export default function ComplaintSidebar({ complaint, users, onRefresh }: ComplaintSidebarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValues, setTempValues] = useState({
        status: complaint.status,
        priority: complaint.priority,
        assignedToId: complaint.assignedToId || "",
    });

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await apiPrivate.delete(`pgs/${complaint.pgId}/complaints/${complaint.id}`);
            toast.success("Ticket deleted successfully");
            // Redirect back to the complaints list after deletion
            navigate(`/pgs/${complaint.pgId}/complaints`);
        } catch {
            toast.error("Failed to delete ticket");
        }
    };

    // Helper to find staff name from the nested structure
    const getAssigneeName = (id: string) => {
        const staff = users.find((u) => u.user.id === id);
        return staff ? staff.user.name : "Not assigned";
    };

    const handleSave = async () => {
        try {
            const updates = [];
            if (tempValues.status !== complaint.status)
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/status`, { status: tempValues.status }));

            if (tempValues.priority !== complaint.priority)
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/priority`, { priority: tempValues.priority }));

            if (tempValues.assignedToId !== complaint.assignedToId)
                updates.push(apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/assign`, {
                    assignedToId: tempValues.assignedToId || null,
                    assignedToType: tempValues.assignedToId ? "STAFF" : null
                }));

            await Promise.all(updates);
            toast.success("Ticket updated successfully");
            setIsEditing(false);
            onRefresh();
        } catch {
            toast.error("Failed to update ticket");
        }
    };

    return (
        <div className="space-y-4">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold">Management</CardTitle>
                    {!isEditing ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4 text-slate-500" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0 text-rose-500">
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-5 pt-5">
                    {/* Status */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</Label>
                        {isEditing ? (
                            <select
                                className="w-full p-2 rounded-md border text-sm bg-white"
                                value={tempValues.status}
                                onChange={(e) => setTempValues({ ...tempValues, status: e.target.value })}
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        ) : (
                            <div>
                                <Badge variant="secondary" className="capitalize font-semibold">
                                    {complaint.status.replace('_', ' ').toLowerCase()}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</Label>
                        {isEditing ? (
                            <select
                                className="w-full p-2 rounded-md border text-sm bg-white"
                                value={tempValues.priority}
                                onChange={(e) => setTempValues({ ...tempValues, priority: e.target.value })}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <div className={`h-2 w-2 rounded-full ${complaint.priority === 'HIGH' || complaint.priority === 'URGENT' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                {complaint.priority}
                            </div>
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</Label>
                        {isEditing ? (
                            <select
                                className="w-full p-2 rounded-md border text-sm bg-white"
                                value={tempValues.assignedToId}
                                onChange={(e) => setTempValues({ ...tempValues, assignedToId: e.target.value })}
                            >
                                <option value="">Unassigned</option>
                                {users.map((staff) => (
                                    <option key={staff.user.id} value={staff.user.id}>
                                        {staff.user.name} ({staff.role})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <User size={14} className="text-slate-400" />
                                <span className={complaint.assignedToId ? "font-medium" : "italic"}>
                                    {getAssigneeName(complaint.assignedToId)}
                                </span>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full gap-2 font-bold mt-2" size="sm">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Changes?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Updating the status or priority may notify the tenant. Are you sure you want to proceed?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardContent>
            </Card>

            {/* Delete Section */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Ticket
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2 text-rose-600 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <AlertDialogTitle>Permanent Action</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            This will permanently remove the ticket and all associated discussion logs. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-rose-600 hover:bg-rose-700"
                        >Delete Permanently</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}