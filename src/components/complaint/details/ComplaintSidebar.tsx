import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function ComplaintSidebar({ complaint, users, onRefresh }: any) {
    const update = async (path: string, payload: object) => {
        try {
            await apiPrivate.patch(`pgs/${complaint.pgId}/complaints/${complaint.id}/${path}`, payload);
            toast.success("Updated successfully");
            onRefresh();
        } catch { toast.error("Update failed"); }
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader><CardTitle className="text-md">Management</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400 uppercase">Current Status</Label>
                    <select
                        className="w-full p-2 rounded-md border text-sm font-medium"
                        value={complaint.status}
                        onChange={(e) => update("status", { status: e.target.value })}
                    >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400 uppercase">Priority Level</Label>
                    <select
                        className="w-full p-2 rounded-md border text-sm font-medium"
                        value={complaint.priority}
                        onChange={(e) => update("priority", { priority: e.target.value })}
                    >
                        <option value="LOW">Low Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="URGENT">Urgent (Immediate)</option>
                    </select>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <Label className="text-xs text-slate-400 uppercase">Assignee</Label>
                    <select
                        className="w-full p-2 rounded-md border text-sm font-medium"
                        value={complaint.assignedToId || ""}
                        onChange={(e) => update("assign", { assignedToId: e.target.value, assignedToType: "STAFF" })}
                    >
                        <option value="">Unassigned</option>
                        {users.map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}