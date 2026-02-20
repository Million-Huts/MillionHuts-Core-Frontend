// components/tenant/TenantCard.tsx
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import { usePG } from "@/context/PGContext";

export default function TenantCard({ tenant }: any) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    return (
        <Card
            onClick={() => navigate(`/pgs/${currentPG?.id}/tenants/${tenant.id}`)}
            className="group cursor-pointer overflow-hidden border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="relative">
                        <img
                            src={tenant.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.fullName}`}
                            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-background shadow-sm"
                        />
                        {tenant.isKycVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                <ShieldCheck size={12} />
                            </div>
                        )}
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 uppercase text-[10px] tracking-wider">
                        Active
                    </Badge>
                </div>

                <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {tenant.fullName}
                    </h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Mail size={12} /> {tenant.email || 'No email provided'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Phone size={12} /> {tenant.phone || 'No phone provided'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3 bg-muted/30 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
                View Detailed Profile
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
        </Card>
    );
}