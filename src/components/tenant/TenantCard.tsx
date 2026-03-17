// components/tenant/TenantCard.tsx
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ShieldCheck, ArrowRight, User } from "lucide-react";
import { usePG } from "@/context/PGContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TenantCard({ tenant }: any) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    return (
        <Card
            onClick={() => navigate(`/pgs/${currentPG?.id}/tenants/${tenant.id}`)}
            className="group cursor-pointer overflow-hidden border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-sm"
        >
            <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="relative">
                        <Avatar className="h-16 w-16 rounded-full border-2 border-background ring-2 ring-border shadow-sm group-hover:ring-primary/30 transition-all">
                            <AvatarImage
                                src={tenant.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.fullName}`}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/5 text-primary">
                                <User size={24} />
                            </AvatarFallback>
                        </Avatar>

                        {tenant.isKycVerified && (
                            <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-1 shadow-lg ring-2 ring-background animate-in zoom-in duration-500">
                                <ShieldCheck size={14} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full"
                    >
                        Active Resident
                    </Badge>
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors">
                        {tenant.fullName}
                    </h3>
                    <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            <div className="p-1.5 rounded-full bg-muted/50">
                                <Mail size={14} className="text-primary/70" />
                            </div>
                            <span className="text-sm truncate font-medium">
                                {tenant.email || 'No email provided'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            <div className="p-1.5 rounded-full bg-muted/50">
                                <Phone size={14} className="text-primary/70" />
                            </div>
                            <span className="text-sm font-medium">
                                {tenant.phone || 'No phone provided'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glassy Footer with hover interaction */}
            <div className="px-6 py-4 bg-muted/20 backdrop-blur-md border-t border-border/50 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-all">
                <span>View Full Profile</span>
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <ArrowRight
                        size={16}
                        className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300"
                    />
                </div>
            </div>
        </Card>
    );
}