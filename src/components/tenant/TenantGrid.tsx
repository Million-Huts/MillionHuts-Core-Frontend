import TenantCard from "./TenantCard";
import type { Tenant } from "@/interfaces/tenant";

export default function TenantGrid({ tenants }: { tenants: Tenant[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((t) => (
                <TenantCard key={t.id} tenant={t} />
            ))}
        </div>
    );
}
