import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PGRuleItem } from "@/pages/Property/Details/PGRules";

export default function RuleItemRow({ item, onDelete }: { item: PGRuleItem, onDelete: () => void }) {
    return (
        <div className="group flex items-center justify-between rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-md">
            {/* Content Section */}
            <div className="flex items-start gap-4">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="space-y-1">
                    <p className="text-sm font-bold tracking-tight text-foreground">{item.name}</p>
                    {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    )}
                </div>
            </div>

            {/* Action Section */}
            <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
            >
                <Trash2 size={16} />
            </Button>
        </div>
    );
}