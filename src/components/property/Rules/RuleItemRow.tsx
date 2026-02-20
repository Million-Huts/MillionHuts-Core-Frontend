// components/property/Rules/RuleItemRow.tsx
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RuleItemRow({ item, onDelete }: any) {
    return (
        <div className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary/40" />
                <div>
                    <p className="text-sm font-semibold leading-none">{item.name}</p>
                    {item.description && (
                        <p className="text-xs text-muted-foreground mt-1.5">{item.description}</p>
                    )}
                </div>
            </div>

            <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 size={16} />
            </Button>
        </div>
    );
}