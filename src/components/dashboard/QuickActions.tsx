import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function QuickActions({ actions }: { actions: any[] }) {
    return (
        <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 mr-2 bg-slate-100 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">Shortcuts</span>
            </div>
            {actions.map((action, i) => (
                <Button key={i} asChild variant="outline" className="rounded-full bg-white border-slate-200 hover:bg-slate-50 shadow-sm text-xs font-bold">
                    <Link to={action.url}>{action.label}</Link>
                </Button>
            ))}
        </div>
    );
}