import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PG } from "@/interfaces/pg";

export default function PGCard({ pg }: { pg: PG }) {
    const navigate = useNavigate();
    const image = pg.coverImage?.url || "/defaults/default_pg.png";
    const isSetupIncomplete = pg.completionPercent !== undefined && pg.completionPercent < 100;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <Card
                className="group relative h-full overflow-hidden rounded-sm border-border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                onClick={() => navigate(`/pgs/${pg.id}/basic`)}
            >
                {/* Image Section */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <img
                        src={image}
                        alt={pg.name}
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border",
                            pg.status === 'ACTIVE'
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        )}>
                            {pg.status}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-6 pt-4 space-y-4">
                    <div>
                        <h3 className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors mb-1.5">
                            {pg.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <p className="text-xs font-medium truncate">{pg.city}, {pg.state}</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    {isSetupIncomplete ? (
                        <div className="space-y-2 rounded-sm bg-muted/50 p-3 border border-border/50">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Setup Pending
                                </span>
                                <span>{pg.completionPercent}%</span>
                            </div>
                            <Progress value={pg.completionPercent} className="h-1.5 bg-muted-foreground/20" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/5 p-3 rounded-sm border border-emerald-500/10">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Fully Operational</span>
                        </div>
                    )}
                </CardContent>

                {/* Hover Reveal Action */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}