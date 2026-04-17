import { motion } from "framer-motion";
import { Edit2, MapPin, Building2, Map, ShieldCheck, Navigation, MapPinned } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PG } from "@/interfaces/pg";
import { cn } from "@/lib/utils";

const InfoRow = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
        <div className="p-3 rounded-xl bg-background border shadow-sm text-primary">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{value || "—"}</p>
        </div>
    </div>
);

export default function PGInfoDisplay({ pg, onEdit }: { pg: PG, onEdit: () => void, onUpdated: (data: any) => void }) {

    // Status color mapping based on your specific literal types
    const statusStyles: Record<string, string> = {
        ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        DRAFT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        INACTIVE: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        ARCHIVED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("px-3 py-1 font-black rounded-md border", statusStyles[pg.status])}>
                            {pg.status}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 font-bold rounded-md flex gap-2 items-center">
                            <ShieldCheck className="h-3 w-3" /> {pg.role}
                        </Badge>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">{pg.name}</h2>
                    <p className="flex items-center gap-2 text-muted-foreground font-medium">
                        <MapPinned className="h-4 w-4" /> {pg.locality}, {pg.city}
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Button onClick={onEdit} variant="outline" className="flex-1 md:flex-none rounded-xl gap-2 px-8 h-12 font-bold border-2 shadow-sm bg-card">
                        <Edit2 className="h-4 w-4" /> Edit Profile
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Information Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Regional Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow label="Name" value={pg.name} icon={Building2} />
                        <InfoRow label="City" value={pg.city} icon={Building2} />
                        <InfoRow label="State" value={pg.state} icon={Map} />
                        <InfoRow label="Locality / Landmark" value={pg.locality || "Not provided"} icon={MapPin} />
                        <InfoRow label="Address" value={pg.address || "Not provided"} icon={MapPin} />
                    </div>

                    {/* Address & Map Section */}
                    <Card className="rounded-2xl border-none shadow-sm bg-card overflow-hidden">
                        <div className="p-8 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Physical Address</h3>
                            <p className="text-lg font-semibold leading-relaxed text-foreground/80">{pg.address}</p>
                        </div>

                        {/* Map Preview Area */}
                        <div className="h-[300px] w-full bg-muted/50 relative">
                            {pg.latitude && pg.longitude ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={`https://maps.google.com/maps?q=${pg.latitude},${pg.longitude}&z=15&output=embed`}
                                    className="contrast-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <MapPin className="h-8 w-8 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Coordinates Not Set</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Identification Column */}
                <div className="space-y-6">
                    {/* QR Identifier Card */}
                    <Card className="rounded-3xl border-none bg-primary text-primary-foreground shadow-2xl p-8 flex flex-col items-center text-center">
                        <div className="p-5 bg-white rounded-3xl shadow-inner mb-6">
                            <QRCodeSVG
                                value={`${window.location.origin}/pg/${pg.id}`}
                                size={180}
                                level="H"
                                includeMargin={false}
                                imageSettings={{
                                    src: "/logo.png", // If you have a logo
                                    x: undefined,
                                    y: undefined,
                                    height: 30,
                                    width: 30,
                                    excavate: true,
                                }}
                            />
                        </div>
                        <h4 className="font-black text-[12px] uppercase tracking-[0.3em] mb-1">Property Passport</h4>
                        <p className="text-[10px] opacity-60 font-medium">SCAN TO VIEW TENANT PORTAL</p>
                    </Card>

                    {/* Quick Navigation Button */}
                    <Button
                        disabled={!pg.latitude}
                        className="w-full h-16 rounded-2xl font-black gap-3 text-lg shadow-xl shadow-primary/10 transition-transform active:scale-95"
                        variant="secondary"
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pg.latitude},${pg.longitude}`)}
                    >
                        <Navigation className="h-6 w-6" />
                        Navigate
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}