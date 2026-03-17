// pages/Tenant/Tenants.tsx
import { useEffect, useState, useCallback } from "react";
import { Users, FileText, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";

import TenantGrid from "@/components/tenant/TenantGrid";
import ApplicationList from "@/components/tenant/ApplicationList";
import TenantStats from "@/components/tenant/TenantStats";
import TenantSearchModal from "@/components/tenant/TenantSearchModal";
import AssignStayModal from "@/components/tenant/AssignStayModal";
import EmptyState from "@/components/shared/EmptyState";
import type { Application } from "@/interfaces/application";
import type { Tenant } from "@/interfaces/tenant";
import { useSearchParams } from "react-router-dom";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function Tenants() {
    const { currentPG } = usePG();
    const [searchParams] = useSearchParams();

    const [tenants, setTenants] = useState([]);
    const [applications, setApplications] = useState<Application[] | []>([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState("residents");

    const [openSearch, setOpenSearch] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [selectedTenantForStay, setSelectedTenantForStay] = useState<Tenant | null>(null);

    const fetchData = useCallback(async () => {
        if (!currentPG?.id) return;
        setLoading(true);
        await apiPrivate
            .get(`/tenants/${currentPG.id}`)
            .then((tRes) => setTenants(tRes!.data.tenants || []))
            .catch(() => toast.error("No Tenant Found!"));

        await apiPrivate
            .get(`/pgs/${currentPG.id}/applications`)
            .then((aRes) => setApplications(aRes!.data.data || []))
            .catch(() => toast.error("No Applications Found!"));

        await apiPrivate
            .get(`/pgs/${currentPG.id}/rooms`)
            .then((rRes) => setRooms(rRes!.data.data.rooms || []))
            .catch(() => toast.error("No Room Data Found!"));
        setLoading(false);
    }, [currentPG]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (searchParams.get("create") === "true") setOpenSearch(true);
        if (searchParams.get("applications") === "true") setTabValue("apps");
    }, [searchParams]);

    if (loading) return (
        <div className="relative min-h-screen bg-background">
            <LoadingOverlay isLoading={loading} message="Fetching latest data..." />
        </div>
    );

    return (
        // Main container uses background and foreground from your @theme
        <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Resident Management
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Monitor stays, track occupancy, and process incoming applications.
                        </p>
                    </div>

                    <Button
                        onClick={() => setOpenSearch(true)}
                        size="lg"
                        className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all rounded-sm px-6"
                    >
                        <UserPlus className="h-5 w-5" />
                        <span className="font-semibold">Add New Resident</span>
                    </Button>
                </div>

                {/* Stats Section - Pass semantic colors down */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <TenantStats
                        totalTenants={tenants.length}
                        pendingApps={applications.filter(a => a.status === "PENDING").length}
                        rooms={rooms}
                    />
                </section>

                {/* Main Tabs */}
                <Tabs value={tabValue} onValueChange={(val) => setTabValue(val)} className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-muted/30 backdrop-blur-sm border border-border rounded-sm">
                            <TabsTrigger
                                value="residents"
                                className="rounded-sm px-6 py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                <Users className="h-4 w-4" />
                                <span className="font-medium">Staying Tenants</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="apps"
                                className="relative rounded-sm px-6 py-4 gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">Applications</span>
                                {applications.some(a => a.status === "PENDING") && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="residents" className="outline-none">
                        {tenants.length === 0 ? (
                            <div className="bg-card border border-dashed border-border rounded-sm p-12">
                                <EmptyState
                                    title="No residents yet"
                                    desc="Your resident roster is currently empty. Start by adding a tenant manually or approving a pending application."
                                    onAction={() => setOpenSearch(true)}
                                />
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500">
                                <TenantGrid tenants={tenants} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="apps" className="outline-none animate-in fade-in duration-500">
                        <div className="bg-card rounded-sm border border-border overflow-hidden shadow-sm">
                            <ApplicationList
                                applications={applications}
                                onApprove={(app) => {
                                    setSelectedApp(app);
                                    setSelectedTenantForStay(app.tenant!);
                                }}
                                onReject={() => setSelectedApp(null)}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Modals - These will inherit theme colors via standard shadcn/ui portals */}
                <TenantSearchModal
                    open={openSearch}
                    onClose={() => setOpenSearch(false)}
                    onSelectTenant={(t: Tenant) => {
                        setOpenSearch(false);
                        setSelectedTenantForStay(t);
                    }}
                />

                <AssignStayModal
                    open={!!selectedApp || !!selectedTenantForStay}
                    tenant={selectedTenantForStay}
                    applicationId={selectedApp?.id}
                    rooms={rooms}
                    onClose={() => {
                        setSelectedApp(null);
                        setSelectedTenantForStay(null);
                    }}
                    onSuccess={fetchData}
                />
            </div>
        </div>
    );
}



