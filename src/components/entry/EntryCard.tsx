import { format } from "date-fns";
import {
    User,
    Truck,
    MapPin,
    Clock,
    Phone,
    ChevronRight,
    CheckCircle2,
    XCircle,
    LogIn
} from "lucide-react";
import type { EntryLog } from "@/interfaces/entry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EntryCardProps {
    entry: EntryLog;
    onAction: (id: string, action: string) => void;
}

export function EntryCard({ entry, onAction }: EntryCardProps) {
    const isDelivery = entry.type === "DELIVERY";

    // Logic for Dynamic Titles based on your new requirements
    const displayTitle = isDelivery
        ? (entry.deliveryFrom || "Item Delivery")
        : entry.name;

    const displaySubtitle = isDelivery
        ? "Package/Service Delivery"
        : (entry.phone || "No contact provided");

    return (
        <div className="glass group relative flex flex-col overflow-hidden rounded-sm border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">

            {/* Top Section: Icon & Status */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full shadow-inner transition-transform group-hover:scale-110",
                        isDelivery
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary/10 text-primary"
                    )}>
                        {isDelivery ? <Truck size={22} /> : <User size={22} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground">
                            {displayTitle}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1">
                            {isDelivery ? <MapPin size={10} /> : <Phone size={10} />}
                            {displaySubtitle}
                        </p>
                    </div>
                </div>

                <Badge
                    variant="outline"
                    className={cn(
                        "rounded-lg border-none px-2 py-1 text-[10px] font-black uppercase tracking-tighter",
                        entry.status === "CHECKED_IN" ? "bg-green-500/10 text-green-500" :
                            entry.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                                "bg-muted text-muted-foreground"
                    )}
                >
                    {entry.status.replace("_", " ")}
                </Badge>
            </div>

            {/* Purpose/Service Info Box */}
            <div className="mt-5 rounded-sm bg-muted/20 p-4 ring-1 ring-border/50">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1.5">
                    {isDelivery ? "Delivery Details" : "Purpose of Visit"}
                </p>
                <p className="text-sm font-semibold leading-relaxed text-foreground/90">
                    {isDelivery
                        ? `Standard ${entry.deliveryFrom || 'Delivery'} service at gate.`
                        : (entry.purpose || "General Visit")}
                </p>
            </div>

            {/* Footer Info */}
            <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(entry.createdAt), "hh:mm a")}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{entry.gate?.name || "Main Gate"}</span>
                </div>
            </div>

            {/* Action Buttons: Slide up on hover or stay visible if pending */}
            <div className="mt-4 flex gap-2">
                {entry.status === "PENDING" && (
                    <>
                        <Button
                            size="sm"
                            className="flex-1 rounded-sm font-black bg-primary text-primary-foreground hover:opacity-90"
                            onClick={() => onAction(entry.id, "approve")}
                        >
                            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Grant
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-sm font-black text-destructive hover:bg-destructive/10"
                            onClick={() => onAction(entry.id, "reject")}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {entry.status === "APPROVED" && (
                    <Button
                        size="sm"
                        className="w-full rounded-sm font-black bg-foreground text-background"
                        onClick={() => onAction(entry.id, "check-in")}
                    >
                        <LogIn className="mr-2 h-4 w-4" /> Check In
                    </Button>
                )}

                {entry.status === "CHECKED_IN" && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-sm font-black border-primary/20 hover:bg-primary/5"
                        onClick={() => onAction(entry.id, "check-out")}
                    >
                        Check Out <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}