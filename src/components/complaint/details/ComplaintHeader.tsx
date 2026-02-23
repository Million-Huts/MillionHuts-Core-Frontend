import { Badge } from "@/components/ui/badge";
import type { Complaint } from "@/interfaces/complaints";
import { Calendar, User as UserIcon, Tag } from "lucide-react";

export default function ComplaintHeader({ complaint }: { complaint: Complaint }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1">
                    <Tag className="w-3 h-3 mr-1" /> {complaint.category}
                </Badge>
                <span className="text-slate-300">|</span>
                <div className="flex items-center text-sm text-slate-500 gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {complaint.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white w-fit px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                </div>
                <span>Raised by <span className="font-semibold text-slate-900">Tenant ID: {complaint.raisedById.slice(-5)}</span></span>
            </div>
        </div>
    );
}