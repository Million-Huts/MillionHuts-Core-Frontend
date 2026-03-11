import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Complaint } from "@/interfaces/complaints";
import { UserPlus, Clock, ArrowUpRight } from "lucide-react";

interface props {
    complaint: Complaint,
    onAssign: () => void;
    onClick: () => void;
}

export default function ComplaintTableRow({ complaint: c, onAssign, onClick }: props) {
    const priorityColors: Record<string, string> = {
        URGENT: "bg-rose-500/10 text-rose-600 border-rose-200",
        HIGH: "bg-orange-500/10 text-orange-600 border-orange-200",
        MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-200",
        LOW: "bg-slate-500/10 text-slate-600 border-slate-200",
    };

    const statusColors: Record<string, string> = {
        OPEN: "bg-emerald-500/10 text-emerald-600",
        IN_PROGRESS: "bg-amber-500/10 text-amber-600",
        RESOLVED: "bg-slate-500/10 text-slate-500",
    };

    return (
        <tr className="hover:bg-muted/30 transition-all cursor-pointer group border-b border-border/40 last:border-0">
            <td className="p-6" onClick={onClick}>
                <div className="flex flex-col">
                    <span className="font-black tracking-tight text-foreground text-base group-hover:text-primary transition-colors">
                        {c.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{c.category}</span>
                    </div>
                </div>
            </td>

            <td className="p-6 text-center">
                <Badge variant="outline" className={`${priorityColors[c.priority]} rounded-full px-3 py-0.5 font-black text-[10px] tracking-tighter border-none shadow-sm`}>
                    {c.priority}
                </Badge>
            </td>

            <td className="p-6 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase ${statusColors[c.status]}`}>
                    {c.status.replace("_", " ")}
                </div>
            </td>

            <td className="p-6">
                {c.assignedToId && c.assignedUser ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20">
                            {c.assignedUser.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                            {c.assignedUser.name}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-rose-500 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unassigned</span>
                    </div>
                )}
            </td>

            <td className="p-6 text-right">
                <div className="flex items-center justify-end gap-2">
                    {!c.assignedToId && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-sm h-8 px-4 font-black text-[10px] uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            onClick={(e) => { e.stopPropagation(); onAssign(); }}
                        >
                            <UserPlus className="w-3 h-3 mr-2" /> Assign
                        </Button>
                    )}
                    <div className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-muted">
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </td>
        </tr>
    );
}