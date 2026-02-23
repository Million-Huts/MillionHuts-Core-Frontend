import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Clock } from "lucide-react";

export default function ComplaintTableRow({ complaint: c, onAssign, onClick }: any) {
    const priorityColors: any = {
        URGENT: "bg-red-100 text-red-700 border-red-200",
        HIGH: "bg-orange-100 text-orange-700 border-orange-200",
        MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
        LOW: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const statusColors: any = {
        OPEN: "bg-emerald-50 text-emerald-700",
        IN_PROGRESS: "bg-amber-50 text-amber-700",
        RESOLVED: "bg-slate-100 text-slate-600",
    };

    return (
        <tr className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
            <td className="p-4" onClick={onClick}>
                <div className="font-semibold text-slate-900">{c.title}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}
                </div>
            </td>
            <td className="p-4 text-center">
                <Badge variant="outline" className={`${priorityColors[c.priority]} font-bold text-[10px]`}>
                    {c.priority}
                </Badge>
            </td>
            <td className="p-4 text-center">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                    {c.status.replace("_", " ")}
                </div>
            </td>
            <td className="p-4">
                <span className="text-slate-600 font-medium">{c.category}</span>
            </td>
            <td className="p-4 text-slate-500">
                {c.assignedToId ? (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">ST</div>
                        Staff Member
                    </div>
                ) : (
                    <span className="text-rose-500 font-semibold italic text-xs">Waiting for staff...</span>
                )}
            </td>
            <td className="p-4 text-right">
                <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onAssign(); }}
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Assign
                </Button>
            </td>
        </tr>
    );
}