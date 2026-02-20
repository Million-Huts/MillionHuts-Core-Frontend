import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, CreditCard, ClipboardList, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePG } from "@/context/PGContext";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import BasicInfoHero from "@/components/tenant/details/BasicInfoHero";
import KYCSection from "@/components/tenant/details/KYCSection";
import StayRecordInfo from "@/components/tenant/details/StayRecordInfo";
import StayRecordForm from "@/components/tenant/details/StayRecordForm";
import type { Tenant } from "@/interfaces/tenant";

export interface TenantStay {
    id?: string;
    pgId: string;
    tenantId: string;
    roomId: string;
    rent: number;
    deposit: number;
    startDate: string;
    endDate?: string;
    status?: "ACTIVE" | "VACATED" | "TERMINATED";
    room?: { name: string };
}

export default function TenantDetails() {
    const { tenantId } = useParams();
    const { currentPG } = usePG();
    const navigate = useNavigate();

    const [editStay, setEditStay] = useState(false);
    const [tenantInfo, setTenantInfo] = useState<Tenant | null>(null);
    const [stayInfo, setStayInfo] = useState<TenantStay | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Fetching with includeKyc=true by default for a better detail view
            const res = await apiPrivate.get(`/tenants/getOne/${tenantId}?includeKyc=true`);
            setTenantInfo(res.data.tenant);
            setStayInfo(res.data.stay);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load tenant");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentPG?.id && tenantId) fetchData();
    }, [currentPG?.id, tenantId]);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Resident Profile...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Resident Dashboard</h1>
            </div>

            <BasicInfoHero tenant={tenantInfo!} stay={stayInfo!} />

            <Tabs defaultValue="stay" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="stay" className="rounded-lg gap-2">
                        <ClipboardList size={16} /> Stay Details
                    </TabsTrigger>
                    <TabsTrigger value="kyc" className="rounded-lg gap-2">
                        <ShieldCheck size={16} /> KYC Documents
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-lg gap-2">
                        <History size={16} /> Payment History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="stay" className="mt-6">
                    {editStay ? (
                        <StayRecordForm
                            stayInfo={stayInfo!}
                            onSave={fetchData}
                            onCancel={() => setEditStay(false)}
                        />
                    ) : (
                        <StayRecordInfo
                            stayInfo={stayInfo!}
                            onEdit={() => setEditStay(true)}
                        />
                    )}
                </TabsContent>

                <TabsContent value="kyc" className="mt-6">
                    <KYCSection kyc={tenantInfo?.kycs ?? []} />
                </TabsContent>

                <TabsContent value="payments" className="mt-6">
                    <div className="p-12 border-2 border-dashed rounded-3xl text-center text-muted-foreground">
                        <CreditCard className="mx-auto h-12 w-12 opacity-20 mb-4" />
                        <p>Payment Ledger Integration Coming Soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}