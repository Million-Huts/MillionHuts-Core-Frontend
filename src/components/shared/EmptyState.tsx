// components/shared/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { type LucideIcon, Plus } from "lucide-react";

interface Props {
    title: string;
    desc: string;
    action?: () => void;
    icon?: LucideIcon;
}

export default function EmptyState({ title, desc, action, icon: Icon }: Props) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-muted/30 p-12 text-center transition-all">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm mb-6">
                {Icon ? <Icon className="h-10 w-10 text-muted-foreground/40" /> : <Plus className="h-10 w-10 text-muted-foreground/20" />}
            </div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 max-w-[280px] text-sm text-muted-foreground leading-relaxed">
                {desc}
            </p>
            {action && (
                <Button className="mt-8 rounded-full px-8 shadow-lg shadow-primary/20" onClick={action}>
                    Get Started
                </Button>
            )}
        </div>
    );
}