// pages/tenants/TenantDetails.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    ClipboardList,
    History,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { usePG } from "@/context/PGContext";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import BasicInfoHero from "@/components/tenant/details/BasicInfoHero";
import KYCSection from "@/components/tenant/details/KYCSection";
import StayRecordInfo from "@/components/tenant/details/StayRecordInfo";
import RoomTransferModal from "@/components/tenant/details/RoomTransferModal";
import MoveOutModal from "@/components/tenant/details/MoveOutModal";

import type { Tenant } from "@/interfaces/tenant";
import type { Room } from "@/interfaces/room";
import type { TenantStay } from "@/interfaces/stay";

export default function TenantDetails() {
    const { tenantId } = useParams();
    const { currentPG } = usePG();
    const navigate = useNavigate();

    const [tenantInfo, setTenantInfo] = useState<Tenant | null>(null);
    const [stayInfo, setStayInfo] = useState<TenantStay | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔥 modal states
    const [openTransfer, setOpenTransfer] = useState(false);
    const [openMoveOut, setOpenMoveOut] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await apiPrivate.get(
                `/tenants/${tenantId}`
            );

            setTenantInfo(res.data.data.tenant);
            setStayInfo(res.data.data.stay);

            // rooms for transfer modal
            const rRes = await apiPrivate.get(
                `/pgs/${currentPG?.id}/rooms`
            );
            setRooms(rRes.data.data.rooms || []);

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load tenant"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentPG?.id && tenantId) {
            fetchData();
        }
    }, [currentPG?.id, tenantId]);

    if (loading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">
                    Synchronizing Resident Profile...
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full border-border bg-card/50 hover:bg-primary/10 hover:text-primary"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div>
                        <h1 className="text-2xl font-black">
                            Resident Dashboard
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            Management & Compliance
                        </p>
                    </div>

                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 border border-primary/10">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-primary">
                        Live Profile
                    </span>
                </div>
            </div>

            {/* Hero */}
            <BasicInfoHero tenant={tenantInfo!} stay={stayInfo} />

            {/* Tabs */}
            <Tabs defaultValue="stay" className="w-full">

                <TabsList className="bg-muted/30 border border-border/50 rounded-sm">
                    <TabsTrigger value="stay">
                        <ClipboardList size={16} /> Stay
                    </TabsTrigger>

                    <TabsTrigger value="kyc">
                        <ShieldCheck size={16} /> KYC
                    </TabsTrigger>

                    <TabsTrigger value="payments">
                        <History size={16} /> Ledger
                    </TabsTrigger>
                </TabsList>

                {/* Stay Tab */}
                <TabsContent value="stay" className="mt-8">

                    <StayRecordInfo
                        stayInfo={stayInfo}
                        onTransfer={() => setOpenTransfer(true)}
                        onMoveOut={() => setOpenMoveOut(true)}
                    />

                </TabsContent>

                {/* KYC */}
                <TabsContent value="kyc" className="mt-8">
                    <KYCSection kyc={tenantInfo?.kycs ?? []} />
                </TabsContent>

                {/* Payments Placeholder */}
                <TabsContent value="payments" className="mt-8">
                    <div className="p-16 border-2 border-dashed border-border/60 rounded-xl text-center">
                        <CreditCard className="mx-auto mb-4 opacity-30" />
                        <h3 className="font-bold">Billing Coming Soon</h3>
                        <p className="text-sm text-muted-foreground">
                            Ledger & invoices will appear here
                        </p>
                    </div>
                </TabsContent>

            </Tabs>

            {/* 🔥 Modals */}

            <RoomTransferModal
                open={openTransfer}
                onClose={() => setOpenTransfer(false)}
                stay={stayInfo}
                rooms={rooms}
                onSuccess={fetchData}
            />

            <MoveOutModal
                open={openMoveOut}
                onClose={() => setOpenMoveOut(false)}
                stay={stayInfo}
                onSuccess={fetchData}
            />

        </div>
    );
}