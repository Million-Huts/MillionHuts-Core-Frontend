import { Button } from "@/components/ui/button";
import { Building2, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
    onCreate: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
    return (
        <div className="relative w-full max-w-2xl overflow-hidden md:rounded-[3rem] rounded-2xl border-2 border-dashed border-border/60 bg-card/30 p-12 md:p-20 text-center transition-colors hover:border-primary/20">
            {/* Background Decorative Elements */}
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Icon Stack */}
                <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-muted/50 text-muted-foreground/40 shadow-inner">
                        <Building2 className="h-10 w-10" />
                    </div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                    >
                        <Sparkles className="h-4 w-4" />
                    </motion.div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                    <h2 className="text-2xl font-black tracking-tighter text-foreground">
                        No Properties Established
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        Your portfolio is currently empty. Initialize your first establishment to start managing floors, rooms, and tenant applications.
                    </p>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8"
                >
                    <Button
                        size="lg"
                        onClick={onCreate}
                        className="rounded-full px-8 font-black tracking-tight shadow-xl shadow-primary/20 transition-all"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Get Started
                    </Button>
                </motion.div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                    MillionHuts Establishment Wizard
                </p>
            </div>
        </div>
    );
}