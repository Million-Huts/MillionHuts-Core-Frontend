import { useEffect, useState } from "react";
import { usePG } from "@/context/PGContext";
import { apiPrivate } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Components
import OverviewStats from "@/components/dashboard/OverviewStats";
import AlertFeed from "@/components/dashboard/AlertFeed";
import PropertyHealthCard from "@/components/dashboard/PropertyHealthCard";
import InfrastructureCard from "@/components/dashboard/InfrastructureCard";
import ApplicationPipeline from "@/components/dashboard/ApplicationPipeline";
import QuickActions from "@/components/dashboard/QuickActions";
import ModuleGrid from "@/components/dashboard/ModuleGrid";

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

    if (loading) return <DashboardLoadingSkeleton />;

    if (!data) return <div className="p-8 text-center">No data found for this property.</div>;

    const { stats, alerts, modules, actions } = data;

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                        {modules.property.info.name}
                    </h1>
                    <p className="text-slate-500 font-medium">{modules.property.info.city} • Dashboard Overview</p>
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
        </div>
    );
}

function DashboardLoadingSkeleton() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between"><Skeleton className="h-12 w-64" /><Skeleton className="h-10 w-48" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Skeleton className="h-48 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" /></div>
            <div className="grid grid-cols-4 gap-4"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
        </div>
    );
}