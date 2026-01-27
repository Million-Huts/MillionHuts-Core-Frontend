import { Plus } from "lucide-react";
import type { Tenant } from "@/pages/Tenant/Tenants";

export default function TenantSearchResults({
    tenants,
    onSelect,
}: {
    tenants: Tenant[];
    onSelect: (tenant: Tenant) => void;
}) {
    return (
        <div className="space-y-2 mt-4">
            {tenants.map((t) => (
                <div
                    key={t.id}
                    className="flex items-center justify-between rounded-md border p-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {t.fullName[0]}
                        </div>

                        <div>
                            <p className="text-sm font-medium">{t.fullName}</p>
                            <p className="text-xs text-gray-500">
                                {t.email || t.phone}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => onSelect(t)}
                        className="rounded-full p-1 hover:bg-gray-100"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
