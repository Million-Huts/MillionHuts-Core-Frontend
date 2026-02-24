// components/property/Home/PGCard.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { PG } from "@/interfaces/pg";

export default function PGCard({ pg }: { pg: PG }) {
    const navigate = useNavigate();
    const image = pg.coverImage?.url || "/defaults/default_pg.png";

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card
                className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/pgs/${pg.id}/basic`)}
            >
                <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                        src={image}
                        alt={pg.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                            View Details <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground border-none">
                        {pg.status}
                    </Badge>
                </div>

                <CardContent className="p-5 space-y-4">
                    <div>
                        <h3 className="text-lg font-bold leading-none mb-2 group-hover:text-primary transition-colors">
                            {pg.name}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <p className="text-xs truncate">{pg.city}, {pg.state}</p>
                        </div>
                    </div>

                    {pg.completionPercent !== undefined && pg.completionPercent < 100 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Setup Progress</span>
                                <span>{pg.completionPercent}%</span>
                            </div>
                            <Progress value={pg.completionPercent} className="h-1.5" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}