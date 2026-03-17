// components/tenant/ApplicationCard.tsx
import { Calendar, MessageSquare, UserCheck, UserX, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Application } from "@/interfaces/application";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    application: Application;
    onApprove: (app: Application) => void;
    onReject: (id: string) => void;
}

export default function ApplicationCard({ application, onApprove, onReject }: Props) {
    const isPending = application.status === "PENDING";

    // Status UI Configuration - Refactored to use semantic theme variables
    const statusConfig = {
        PENDING: {
            className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            icon: Clock,
            label: "Pending Review"
        },
        APPROVED: {
            className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            icon: CheckCircle2,
            label: "Approved"
        },
        REJECTED: {
            className: "bg-destructive/10 text-destructive border-destructive/20",
            icon: XCircle,
            label: "Rejected"
        },
        CANCELLED: {
            className: "bg-muted text-muted-foreground border-border",
            icon: Ban,
            label: "Cancelled"
        },
    };

    const config = statusConfig[application.status];

    return (
        <Card
            className={`group p-5 transition-all duration-300 border-border shadow-sm hover:shadow-md
                ${isPending
                    ? "border-l-4 border-l-primary bg-card"
                    : "opacity-75 bg-muted/10 grayscale-[0.2] hover:grayscale-0"
                }`}
        >
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                    {/* Header: Avatar & Name */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-border shadow-inner">
                            <AvatarImage src={application.tenant?.profileImage} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {application.tenant?.fullName?.[0] || "T"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-xl tracking-tight text-foreground">
                                    {application.tenant?.fullName || "Unknown Tenant"}
                                </h4>
                                <Badge
                                    variant="outline"
                                    className={`${config.className} flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors`}
                                >
                                    <config.icon size={12} strokeWidth={2.5} />
                                    {config.label}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Calendar size={14} className="text-primary/60" />
                                Applied on <span className="font-medium text-foreground/80">
                                    {new Date(application.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Message Bubble - Uses the Glass utility from your CSS */}
                    {application.message && (
                        <div className="glass bg-muted/30 p-4 rounded-sm flex gap-3 items-start border-border/50 group-hover:border-primary/20 transition-colors">
                            <MessageSquare size={16} className="mt-1 text-primary shrink-0" />
                            <p className="text-sm italic leading-relaxed text-foreground/80">
                                "{application.message}"
                            </p>
                        </div>
                    )}

                    {!isPending && (
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-1 w-1 rounded-sm bg-muted-foreground/40" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                                Archive • Decision Finalized
                            </p>
                        </div>
                    )}
                </div>

                {/* Conditional Action Buttons */}
                {isPending && (
                    <div className="flex items-center gap-3 self-end md:self-center bg-muted/20 p-2 md:p-0 rounded-sn md:bg-transparent">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReject(application.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold transition-colors"
                        >
                            <UserX className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                            size="default"
                            onClick={() => onApprove(application)}
                            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 rounded-sm font-bold transition-all px-5"
                        >
                            <UserCheck className="mr-2 h-4 w-4" /> Approve & Assign
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}