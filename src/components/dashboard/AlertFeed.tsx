import { ShieldAlert, Info, AlertCircle, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
    message: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    timestamp?: string;
}

interface AlertFeedProps {
    alerts: Alert[];
}

export default function AlertFeed({ alerts }: AlertFeedProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Attention Required
                </h3>
                {alerts.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">
                        {alerts.length}
                    </span>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {alerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-muted/10 p-10 text-center"
                        >
                            <BellOff className="mb-3 h-8 w-8 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">All clear. No active alerts.</p>
                        </motion.div>
                    ) : (
                        alerts.map((alert, i) => {
                            const isHigh = alert.severity === 'HIGH';
                            const isMedium = alert.severity === 'MEDIUM';

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={cn(
                                        "group relative flex gap-4 rounded-2xl border p-4 transition-all hover:shadow-md",
                                        isHigh
                                            ? "border-destructive/20 bg-destructive/5 text-destructive"
                                            : isMedium
                                                ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-500"
                                                : "border-primary/20 bg-primary/5 text-primary"
                                    )}
                                >
                                    <div className="shrink-0">
                                        {isHigh ? (
                                            <ShieldAlert className="h-5 w-5 animate-pulse" />
                                        ) : isMedium ? (
                                            <AlertCircle className="h-5 w-5" />
                                        ) : (
                                            <Info className="h-5 w-5" />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold leading-snug tracking-tight">
                                            {alert.message}
                                        </p>
                                        {alert.timestamp && (
                                            <span className="text-[10px] opacity-70 font-medium">
                                                {alert.timestamp}
                                            </span>
                                        )}
                                    </div>

                                    {/* Accent line for high priority */}
                                    {isHigh && (
                                        <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-destructive" />
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}