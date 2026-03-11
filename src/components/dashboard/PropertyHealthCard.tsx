import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SetupFlags {
    missingDetails: boolean;
    missingRules: boolean;
    missingImages: boolean;
}

interface PropertySetupCardProps {
    score: number;
    flags: SetupFlags;
}

export default function PropertySetupCard({ score, flags }: PropertySetupCardProps) {
    const isComplete = score === 100;

    return (
        <Card className="relative border-none bg-primary overflow-hidden rounded-sm shadow-2xl shadow-primary/20 text-primary-foreground">
            {/* Background Decorative Pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <CardContent className="p-6 space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 opacity-80" />
                            <h3 className="font-bold text-lg tracking-tight">Setup Health</h3>
                        </div>
                        <p className="text-xs opacity-70 font-medium">Property optimization score</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-black tracking-tighter">{score}%</span>
                        {isComplete && <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress
                        value={score}
                        className="h-2.5 bg-black/20 border border-white/10"
                        indicatorClassName="bg-white transition-all duration-1000 ease-out"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                    <SetupItem
                        label="Identity & Location"
                        missing={flags.missingDetails}
                    />
                    <SetupItem
                        label="Policies & Guidelines"
                        missing={flags.missingRules}
                    />
                    <SetupItem
                        label="Visual Presentation"
                        missing={flags.missingImages}
                    />
                </div>

                {!isComplete && (
                    <motion.button
                        whileHover={{ x: 5 }}
                        className="w-full mt-2 flex items-center justify-between p-3 rounded-sm bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                        Complete Setup
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                )}
            </CardContent>
        </Card>
    );
}

function SetupItem({ label, missing }: { label: string; missing: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-sm transition-colors",
            missing ? "bg-black/5 border border-white/5" : "bg-white/5"
        )}>
            <div className="flex items-center gap-3 text-sm">
                <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    missing ? "bg-white/10 text-white/50" : "bg-white text-primary shadow-sm"
                )}>
                    {missing ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                </div>
                <span className={cn(
                    "font-bold text-[11px] uppercase tracking-wide",
                    missing ? "opacity-60" : "opacity-100"
                )}>
                    {label}
                </span>
            </div>

            {!missing && (
                <span className="text-[9px] font-black uppercase opacity-40">Ready</span>
            )}
        </div>
    );
}