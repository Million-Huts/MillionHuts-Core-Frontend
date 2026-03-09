import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Plus, UserPlus, Receipt, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Action {
    label: string;
    url: string;
    type?: 'tenant' | 'expense' | 'floor' | 'default';
}

// Helper to map icons to action types if your backend provides them
const getActionIcon = (type?: string) => {
    switch (type) {
        case 'tenant': return <UserPlus className="w-3.5 h-3.5 mr-2" />;
        case 'expense': return <Receipt className="w-3.5 h-3.5 mr-2" />;
        case 'floor': return <Plus className="w-3.5 h-3.5 mr-2" />;
        default: return <ArrowRight className="w-3.5 h-3.5 mr-2" />;
    }
};

export default function QuickActions({ actions }: { actions: Action[] }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Shortcut Indicator with Glassmorphism */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-inner">
                <Zap className="w-3 h-3 text-primary animate-pulse fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                    Quick Access
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {actions.map((action, i) => (
                    <Button
                        key={i}
                        asChild
                        variant="outline"
                        className={cn(
                            "rounded-full border-border bg-card/50 backdrop-blur-sm",
                            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                            "transition-all duration-300 shadow-sm text-xs font-bold px-5"
                        )}
                    >
                        <Link to={action.url} className="flex items-center">
                            {getActionIcon(action.type)}
                            {action.label}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}