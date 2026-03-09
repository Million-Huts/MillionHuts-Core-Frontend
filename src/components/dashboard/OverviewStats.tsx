import { Users, Layout, ClipboardList, Wallet, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsData {
    activeTenants: number;
    openComplaints: number;
    occupancyRate: number;
    pendingExpenses: number;
}

interface OverviewStatsProps {
    stats: StatsData;
}

interface StatCardProps {
    label: string;
    val: string | number;
    icon: LucideIcon;
    variant: "primary" | "destructive" | "success" | "warning";
    index: number;
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
    const cards: Omit<StatCardProps, "index">[] = [
        {
            label: "Active Tenants",
            val: stats.activeTenants,
            icon: Users,
            variant: "primary"
        },
        {
            label: "Open Complaints",
            val: stats.openComplaints,
            icon: ClipboardList,
            variant: "destructive"
        },
        {
            label: "Occupancy",
            val: `${stats.occupancyRate}%`,
            icon: Layout,
            variant: "success"
        },
        {
            label: "Pending Expenses",
            val: `₹${stats.pendingExpenses.toLocaleString()}`,
            icon: Wallet,
            variant: "warning"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <StatCard key={card.label} {...card} index={i} />
            ))}
        </div>
    );
}

function StatCard({ label, val, icon: Icon, variant, index }: StatCardProps) {
    const variants = {
        primary: "bg-primary/10 text-primary border-primary/10",
        destructive: "bg-destructive/10 text-destructive border-destructive/10",
        success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
        warning: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/10",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative bg-card p-5 md:rounded-[2rem] rounded-2xl shadow-sm border border-border flex items-center gap-5 transition-all hover:shadow-md hover:border-primary/20"
        >
            {/* Icon Container */}
            <div className={cn(
                "p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300",
                variants[variant]
            )}>
                <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-black tracking-tighter text-foreground leading-none">
                        {val}
                    </p>
                    {/* Subtle aesthetic arrow for high-level metrics */}
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1.5 tracking-widest">
                    {label}
                </p>
            </div>

            {/* Interactive hover line */}
            <div className={cn(
                "absolute bottom-4 right-6 h-1 w-8 rounded-full opacity-20 transition-all group-hover:w-12 group-hover:opacity-100",
                variant === "primary" ? "bg-primary" :
                    variant === "destructive" ? "bg-destructive" :
                        variant === "success" ? "bg-emerald-500" : "bg-amber-500"
            )} />
        </motion.div>
    );
}