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

    // Status UI Configuration
    const statusConfig = {
        PENDING: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending Review" },
        APPROVED: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2, label: "Approved" },
        REJECTED: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Rejected" },
        CANCELLED: { color: "bg-gray-50 text-gray-700 border-gray-200", icon: Ban, label: "Cancelled" },
    };

    const config = statusConfig[application.status];

    return (
        <Card className={`p-5 transition-all ${isPending ? "border-l-4 border-l-amber-400 shadow-sm" : "opacity-80 bg-muted/20"}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={application.tenant?.profileImage} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                {application.tenant?.fullName?.[0] || "T"}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-lg">{application.tenant?.fullName || "Unknown Tenant"}</h4>
                                <Badge variant="outline" className={`${config.color} flex items-center gap-1 py-0 px-2`}>
                                    <config.icon size={12} />
                                    {config.label}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Calendar size={12} /> Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {application.message && (
                        <div className="bg-background/50 border p-3 rounded-xl flex gap-2 items-start">
                            <MessageSquare size={14} className="mt-1 text-muted-foreground shrink-0" />
                            <p className="text-sm italic text-muted-foreground">"{application.message}"</p>
                        </div>
                    )}

                    {!isPending && (
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                            Process complete • No further actions required
                        </p>
                    )}
                </div>

                {/* Conditional Action Buttons */}
                {isPending && (
                    <div className="flex items-center gap-3 self-end md:self-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReject(application.id)}
                            className="text-destructive hover:bg-destructive/5 border-destructive/20 rounded-lg"
                        >
                            <UserX className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onApprove(application)}
                            className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 rounded-lg"
                        >
                            <UserCheck className="mr-2 h-4 w-4" /> Assign Room & Approve
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}