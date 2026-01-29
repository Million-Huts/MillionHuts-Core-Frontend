import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Tenant } from "@/pages/Tenant/Tenants";
import { Mail, Phone } from "lucide-react";

export default function TenantCard({ tenant }: { tenant: Tenant }) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/tenants/${tenant.id}`)}
            className="cursor-pointer hover:shadow-md transition"
        >
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                    <div >
                        <img src={tenant.profileImage ?? ''} alt="" className="h-16 w-16 object-cover rounded-full" />
                    </div>

                    <div>
                        <p className="font-medium">{tenant.fullName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Mail size={16} />{tenant.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Phone size={16} /> {tenant.phone}
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
