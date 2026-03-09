import { useEffect, useState } from "react";
import { usePG } from "@/context/PGContext";
import { apiPrivate } from "@/lib/api";
import { motion } from "framer-motion";

// Components
import OverviewStats from "@/components/dashboard/OverviewStats";
import AlertFeed from "@/components/dashboard/AlertFeed";
import PropertyHealthCard from "@/components/dashboard/PropertyHealthCard";
import InfrastructureCard from "@/components/dashboard/InfrastructureCard";
import ApplicationPipeline from "@/components/dashboard/ApplicationPipeline";
import QuickActions from "@/components/dashboard/QuickActions";
import ModuleGrid from "@/components/dashboard/ModuleGrid";
import EmptyPG from "@/components/shared/EmptyPG";
import EmptyState from "@/components/shared/EmptyState";
import { LayoutDashboard } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function Dashboard() {
    const { currentPG } = usePG();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!currentPG?.id) return;
            setLoading(true);
            try {
                const res = await apiPrivate.get(`/pgs/${currentPG.id}/dashboard`);
                setData(res.data.data);
            } catch (err) {
                console.error("Dashboard failed to load", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [currentPG?.id]);

    // Handle case where no PG is selected/exists
    if (!currentPG) return <EmptyPG />;

    // Handle API loading state
    if (loading) return (
        <div className="relative min-h-screen">
            <LoadingOverlay isLoading={loading} message="Loading Dashboard..." variant="block" />
        </div>
    )

    // Handle data not found for a specific PG
    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] p-8">
                <EmptyState
                    title="No Dashboard Data"
                    desc="We couldn't find any operational data for this property. Try completing the property setup."
                    icon={LayoutDashboard}
                />
            </div>
        );
    }

    const { stats, alerts, modules, actions } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
                        {modules.property.info.name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            {modules.property.info.city}
                        </span>
                        <span>•</span>
                        <span>Property Overview</span>
                    </div>
                </div>
                <QuickActions actions={actions} />
            </div>

            {/* Top Operational Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PropertyHealthCard
                    score={modules.property.completionScore}
                    flags={modules.property.flags}
                />
                <InfrastructureCard data={modules.floor} />
                <ApplicationPipeline data={modules.applications} />
            </div>

            {/* High Level Metrics Grid */}
            <OverviewStats stats={stats} />

            {/* Secondary Details Row */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                    <ModuleGrid modules={modules} />
                </div>
                <div className="xl:col-span-1">
                    <AlertFeed alerts={alerts} />
                </div>
            </div>
        </motion.div>
    );
}