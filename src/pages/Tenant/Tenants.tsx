import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TenantGrid from "@/components/tenant/TenantGrid";
import EmptyTenantState from "@/components/tenant/EmptyTenantState";
import TenantSearchModal from "@/components/tenant/TenantSearchModal";
import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";

export interface Tenant {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    isKycVerified: boolean;
    profileImage?: string;
}

export default function Tenants() {
    const { currentPG } = usePG();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!currentPG) return;
        const getTenants = async () => {
            try {
                const res = await apiPrivate.get(`/tenants/${currentPG?.id}`);
                setTenants(res.data.tenants);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        getTenants();
    }, [currentPG])

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tenants</h1>
                <Button onClick={() => setOpenModal(true)}>Add Tenant</Button>
            </div>

            {tenants.length === 0 ? (
                <EmptyTenantState onAdd={() => setOpenModal(true)} />
            ) : (
                <TenantGrid tenants={tenants} />
            )}

            <TenantSearchModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onTenantAdded={(tenant) =>
                    setTenants((prev) => [...prev, tenant])
                }
            />
        </div>
    );
}
