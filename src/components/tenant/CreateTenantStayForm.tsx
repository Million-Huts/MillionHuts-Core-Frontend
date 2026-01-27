import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import type { Tenant } from "@/pages/Tenant/Tenants";
import { usePG } from "@/context/PGContext";
import { toNumber } from "@/lib/utils";

export default function CreateTenantStayForm({
    tenant,
    onCreated,
}: {
    tenant: Tenant;
    onCreated: () => void;
}) {
    const { currentPG } = usePG();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const roomId = formData.get("roomId");
        await apiPrivate.post(`/pgs/${currentPG?.id}/stay/create`, {
            tenantId: tenant.id,
            roomId,
            rent: toNumber(formData.get('rent')),
            deposit: toNumber(formData.get('deposit')),
            startDate: new Date(formData.get("startDate") as string).toISOString()
        });

        onCreated();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-medium">
                Assign stay for {tenant.fullName}
            </h3>

            <Input name="roomId" placeholder="Room ID" required />
            <Input name="rent" placeholder="Rent" required />
            <Input name="deposit" placeholder="Deposit" />
            <Input name="startDate" type="date" required />

            <Button type="submit" className="w-full">
                Create Stay
            </Button>
        </form>
    );
}
