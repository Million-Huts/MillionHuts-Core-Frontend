import { Button } from "@/components/ui/button";
import { type LucideIcon, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    desc: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: LucideIcon;
    className?: string;
}

export default function EmptyState({
    title,
    desc,
    actionLabel = "Get Started",
    onAction,
    icon: Icon,
    className
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-border bg-muted/20 p-12 text-center transition-all",
                className
            )}
        >
            {/* Icon Container with Theme-Aware Glow */}
            <div className="relative flex h-24 w-24 items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                    {Icon ? (
                        <Icon className="h-10 w-10 text-primary/60" />
                    ) : (
                        <Plus className="h-10 w-10 text-muted-foreground/30" />
                    )}
                </div>
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
            </h2>
            <p className="mt-3 max-w-[320px] text-sm text-muted-foreground leading-relaxed">
                {desc}
            </p>

            {/* Action Button */}
            {onAction && (
                <Button
                    size="lg"
                    onClick={onAction}
                    className="mt-8 group rounded-sm px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    {actionLabel}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            )}
        </motion.div>
    );
}