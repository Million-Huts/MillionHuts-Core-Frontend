// pages/Tenant/Tenants.tsx
import { useEffect, useState, useCallback } from "react";
import { Users, FileText, Plus, Loader2 } from "lucide-react";
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

export default function Tenants() {
    const { currentPG } = usePG();
    const [tenants, setTenants] = useState([]);
    const [applications, setApplications] = useState<Application[] | []>([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resident Management</h1>
                    <p className="text-muted-foreground">Manage staying tenants and incoming applications.</p>
                </div>
                <Button onClick={() => setOpenSearch(true)} className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                    <Plus className="h-4 w-4" /> Add New Resident
                </Button>
            </div>

            <TenantStats
                totalTenants={tenants.length}
                pendingApps={applications.filter(a => a.status === "PENDING").length}
                rooms={rooms}
            />

            <Tabs defaultValue="residents" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="residents" className="rounded-lg gap-2">
                        <Users className="h-4 w-4" /> Staying Tenants
                    </TabsTrigger>
                    <TabsTrigger value="apps" className="rounded-lg gap-2">
                        <FileText className="h-4 w-4" />
                        Applications
                        {applications.some(a => a.status === "PENDING") && (
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="residents">
                    {tenants.length === 0 ? (
                        <EmptyState
                            title="No residents yet"
                            desc="Once you add tenants or approve applications, they will appear here."
                            action={() => setOpenSearch(true)}
                        />
                    ) : (
                        <TenantGrid tenants={tenants} />
                    )}
                </TabsContent>

                <TabsContent value="apps">
                    <ApplicationList
                        applications={applications}
                        onApprove={(app) => {
                            setSelectedApp(app)
                            setSelectedTenantForStay(app.tenant!)
                        }}
                        onReject={() => setSelectedApp(null)}
                    />
                </TabsContent>
            </Tabs>

            {/* Modals */}
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
                tenant={selectedTenantForStay} // Assume app includes tenantInfo
                applicationId={selectedApp?.id}
                rooms={rooms}
                onClose={() => {
                    setSelectedApp(null);
                    setSelectedTenantForStay(null);
                }}
                onSuccess={fetchData}
            />
        </div>
    );
}