import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ApplicationData {
    pending: number;
    stalePending: number;
    flags: {
        hasStalePending: boolean;
    };
}

interface ApplicationPipelineProps {
    data: ApplicationData;
}

export default function ApplicationPipeline({ data }: ApplicationPipelineProps) {
    return (
        <Card className="border-border bg-card md:rounded-[2rem] rounded-xl shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Applications
                    </CardTitle>
                    <p className="text-xs font-medium text-muted-foreground/60">Tenant Pipeline</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserPlus className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    {/* Active Pending Applications */}
                    <div className="relative overflow-hidden bg-muted/30 border border-border/50 p-4 rounded-3xl group transition-colors hover:bg-muted/50">
                        <div className="relative z-10">
                            <p className="text-3xl font-black tracking-tighter text-foreground">
                                {data.pending}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mt-1">
                                Pending
                            </p>
                        </div>
                        <ArrowUpRight className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                    </div>

                    {/* Stale Applications Indicator */}
                    <div className={cn(
                        "p-4 rounded-3xl border transition-all",
                        data.stalePending > 0
                            ? "bg-destructive/5 border-destructive/20 shadow-sm"
                            : "bg-muted/30 border-border/50"
                    )}>
                        <p className={cn(
                            "text-3xl font-black tracking-tighter",
                            data.stalePending > 0 ? "text-destructive" : "text-foreground"
                        )}>
                            {data.stalePending}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mt-1">
                            Stale &gt;48h
                        </p>
                    </div>
                </div>

                {/* Conditional Alert Footer */}
                {data.flags.hasStalePending ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/10"
                    >
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider">Attention</span>
                            <span className="text-[10px] font-bold opacity-80">Immediate Review Required</span>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-2 px-1 text-muted-foreground/40">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Pipeline Healthy</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}