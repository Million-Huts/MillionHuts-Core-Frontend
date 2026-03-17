// pages/tenants/TenantDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, CreditCard, ClipboardList, History, Loader2 } from "lucide-react";
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
            const res = await apiPrivate.get(`/tenants/getOne/${tenantId}?includeKyc=true`);
            setTenantInfo(res.data.tenant);
            setStayInfo(res.data.stay);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load tenant");
            navigate(-1); // Safety redirect
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentPG?.id && tenantId) fetchData();
    }, [currentPG?.id, tenantId]);

    if (loading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Synchronizing Resident Profile...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full border-border bg-card/50 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-foreground">Resident Dashboard</h1>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                            Management & Compliance
                        </p>
                    </div>
                </div>

                {/* Optional Status Badge for the whole page */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 border border-primary/10">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Live Profile</span>
                </div>
            </div>

            {/* Profile Hero Section */}
            <div className="relative">
                <BasicInfoHero tenant={tenantInfo!} stay={stayInfo!} />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="stay" className="w-full">
                <TabsList className="bg-muted/30 backdrop-blur-md rounded-sm border border-border/50 gap-1">
                    <TabsTrigger
                        value="stay"
                        className="rounded-sm py-4 px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-bold text-xs"
                    >
                        <ClipboardList size={16} /> Stay Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="kyc"
                        className="rounded-sm py-4 px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-bold text-xs"
                    >
                        <ShieldCheck size={16} /> KYC Vault
                    </TabsTrigger>
                    <TabsTrigger
                        value="payments"
                        className="rounded-sm py-4 px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-bold text-xs"
                    >
                        <History size={16} /> Ledger
                    </TabsTrigger>
                </TabsList>

                {/* Stay Tab */}
                <TabsContent value="stay" className="mt-8 outline-none">
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
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
                    </div>
                </TabsContent>

                {/* KYC Tab */}
                <TabsContent value="kyc" className="mt-8 outline-none">
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <KYCSection kyc={tenantInfo?.kycs ?? []} />
                    </div>
                </TabsContent>

                {/* Payments Placeholder */}
                <TabsContent value="payments" className="mt-8 outline-none">
                    <div className="p-16 border-2 border-dashed border-border/60 rounded-[2.5rem] bg-muted/10 text-center animate-in zoom-in-95 duration-500">
                        <div className="bg-card w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-border">
                            <CreditCard className="h-10 w-10 text-primary opacity-40" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Payment History</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                            The automated ledger is being initialized for this resident. Check back soon for billing automation.
                        </p>
                        <Button variant="outline" className="mt-8 rounded-xl border-primary/20 text-primary hover:bg-primary/5" disabled>
                            Configure Billing
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}