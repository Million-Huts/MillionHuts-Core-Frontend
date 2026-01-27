import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Tenant } from "@/pages/Tenant/Tenants";

export default function TenantCard({ tenant }: { tenant: Tenant }) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/tenants/${tenant.id}`)}
            className="cursor-pointer hover:shadow-md transition"
        >
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {tenant.fullName[0]}
                    </div>

                    <div>
                        <p className="font-medium">{tenant.fullName}</p>
                        <p className="text-sm text-gray-500">
                            {tenant.email || tenant.phone}
                        </p>
                    </div>
                </div>

                {tenant.isKycVerified && (
                    <span className="text-xs text-green-600">KYC Verified</span>
                )}
            </CardContent>
        </Card>
    );
}
