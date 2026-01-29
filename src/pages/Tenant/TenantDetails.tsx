import BasicInfo from "@/components/tenant/details/BasicInfo";
import KYCInfo from "@/components/tenant/details/KYCInfo";
import StayRecordForm from "@/components/tenant/details/StayRecordForm";
import StayRecordInfo from "@/components/tenant/details/StayRecordInfo";
import { usePG } from "@/context/PGContext";
import type { Tenant } from "@/interfaces/tenant";
import { apiPrivate } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

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
}

export default function TenantDetails() {
    const { tenantId } = useParams();
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const [editStay, setEditStay] = useState(false);
    const [requestKyc, setRequestKyc] = useState(false);
    const [tenantInfo, setTenantInfo] = useState<Tenant | null>(null);
    const [stayInfo, setStayInfo] = useState<TenantStay | null>(null);
    const fetchTenantInfo = async () => {
        try {
            const res = await apiPrivate.get(`/tenants/getOne/${tenantId}?includeKyc=${requestKyc}`);
            setTenantInfo(res.data.tenant);
            setStayInfo(res.data.stay);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        if (!pgId || !tenantId) return;
        fetchTenantInfo();
    }, [pgId, tenantId, requestKyc])
    return (
        <div>
            <div className="flex md:flex-row flex-col">
                <div className="md:w-[30%]">

                    <BasicInfo tenant={tenantInfo!} />
                </div>
                <div className="md:w-[35%]">

                    <KYCInfo kyc={tenantInfo?.kycs ?? []} requestKyc={() => setRequestKyc(true)} />
                </div>
                <div className="md:w-[35%]">
                    {editStay ? (
                        <StayRecordForm stayInfo={stayInfo!} onSave={fetchTenantInfo} onCancel={() => setEditStay(false)} />
                    ) : (
                        <StayRecordInfo stayInfo={stayInfo!} changeEdit={() => setEditStay(!editStay)} />
                    )}
                </div>
            </div>

        </div>
    )
}
