import { Badge } from "@/components/ui/badge";
import type { Complaint } from "@/interfaces/complaints";
import { Calendar, User as UserIcon, Tag, Fingerprint } from "lucide-react";

export default function ComplaintHeader({ complaint }: { complaint: Complaint }) {
    return (
        <div className="space-y-6">
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4">
                <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                    <Tag className="w-3 h-3 mr-2 opacity-70" />
                    {complaint.category}
                </Badge>

                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />

                <div className="flex items-center text-[11px] font-bold text-muted-foreground uppercase tracking-tight gap-2 bg-muted/30 px-3 py-1.5 rounded-sm border border-border/40">
                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Title Section */}
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                    {complaint.title}
                </h1>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 bg-muted/20 px-4 py-2 rounded-2xl border border-border/30">
                        <Fingerprint className="w-3.5 h-3.5" />
                        Ref: {complaint.id?.substring(0, 8).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Author Attribution */}
            <div className="inline-flex items-center gap-3 bg-card px-4 py-2 rounded-sm border border-border shadow-sm group hover:border-primary/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">
                        Originator
                    </span>
                    <span className="text-sm font-bold text-foreground leading-none">
                        Reported as <span className="text-primary">{complaint.raisedByType}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}