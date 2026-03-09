import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Building2,
    CreditCard,
    UserCog,
    Wrench,
    ArrowRight,
    type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModuleStats {
    label: string;
    value: string | number;
    highlight?: boolean;
}

interface ModuleCardProps {
    title: string;
    icon: LucideIcon;
    stats: ModuleStats[];
    index: number;
}

export default function ModuleGrid({ modules }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Infrastructure Module */}
            <ModuleCard
                index={0}
                title="Infrastructure"
                icon={Building2}
                stats={[
                    { label: "Floors", value: modules.floor.floors },
                    { label: "Occupancy", value: `${modules.floor.occupiedRooms}/${modules.floor.createdRooms}` }
                ]}
            />

            {/* Maintenance Module */}
            <ModuleCard
                index={1}
                title="Maintenance"
                icon={Wrench}
                stats={[
                    { label: "Open Issues", value: modules.complaints.open, highlight: modules.complaints.open > 0 },
                    { label: "In Progress", value: modules.complaints.inProgress }
                ]}
            />

            {/* Finance Module */}
            <ModuleCard
                index={2}
                title="Finances"
                icon={CreditCard}
                stats={[
                    { label: "Monthly Spend", value: `₹${modules.expenses.totalExpenses.toLocaleString()}` },
                    { label: "Pending Bills", value: modules.expenses.pendingExpenses }
                ]}
            />

            {/* Team Module */}
            <ModuleCard
                index={3}
                title="Team"
                icon={UserCog}
                stats={[
                    { label: "Managers", value: modules.users.managers },
                    { label: "Staff", value: modules.users.staff }
                ]}
            />
        </div>
    );
}

function ModuleCard({ title, icon: Icon, stats, index }: ModuleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="group relative border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 md:rounded-[2rem] rounded-xl overflow-hidden border-2 border-transparent hover:border-primary/10">
                {/* Subtle Background Glow */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                        <Icon className="w-4 h-4" />
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-between items-end mt-4">
                        {stats.map((s, i) => (
                            <div key={i} className={cn("space-y-1", i > 0 && "text-right")}>
                                <p className={cn(
                                    "text-2xl font-black tracking-tighter transition-colors",
                                    s.highlight ? "text-destructive" : "text-foreground"
                                )}>
                                    {s.value}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action Hint */}
                    <div className="mt-6 flex items-center justify-end">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            View Module <ArrowRight className="h-3 w-3" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}