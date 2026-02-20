import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, QrCode, MapPin, Building, Hash, Save, X, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Standard for React QR codes

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

interface PGData {
    id: string;
    pgCode: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    status: string;
}

export default function PGBasic() {
    const { pgId } = useParams();
    const [pg, setPg] = useState<PGData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchPG = async () => {
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}`);
                setPg(res.data.data.pg);
            } catch {
                toast.error("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };
        fetchPG();
    }, [pgId]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!pg) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <PGView pg={pg} onEdit={() => setEditing(true)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <PGEditForm
                            pg={pg}
                            onCancel={() => setEditing(false)}
                            onUpdated={(updated) => {
                                setPg((prev) => ({ ...prev!, ...updated }));
                                setEditing(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ================= VIEW COMPONENT ================= */

function PGView({ pg, onEdit }: { pg: PGData; onEdit: () => void }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Property Profile</h2>
                    <p className="text-muted-foreground">Manage your property's core identification and location</p>
                </div>
                <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-4 w-4" /> Edit Info
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <Card className="lg:col-span-2 border-none bg-card/50 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem icon={Building} label="Property Name" value={pg.name} />
                            <InfoItem
                                icon={Hash}
                                label="Property Code"
                                value={pg.pgCode}
                                badge={pg.pgCode ? "Public ID" : "Not Set"}
                            />
                            <InfoItem icon={MapPin} label="City" value={pg.city} />
                            <InfoItem icon={MapPin} label="State" value={pg.state} />
                            <div className="md:col-span-2">
                                <InfoItem icon={MapPin} label="Full Address" value={pg.address} full />
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Account Status:</span>
                            <Badge variant={pg.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                {pg.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Code Section */}
                <Card className="border-primary/10 bg-primary/5 shadow-none">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="p-3 bg-background rounded-xl shadow-sm">
                            {pg.pgCode ? (
                                <QRCodeSVG value={pg.pgCode} size={140} className="rounded-sm" />
                            ) : (
                                <div className="h-[140px] w-[140px] flex items-center justify-center bg-muted rounded-sm text-muted-foreground">
                                    <QrCode className="h-10 w-10 opacity-20" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold flex items-center justify-center gap-2">
                                Property QR
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 px-2">
                                Scan to quickly find this property or share with potential tenants.
                            </p>
                        </div>
                        {pg.pgCode && (
                            <code className="bg-background px-3 py-1 rounded text-xs font-mono border">
                                {pg.pgCode}
                            </code>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon: Icon, badge, full }: any) {
    return (
        <div className={full ? "space-y-1.5" : ""}>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
                {badge && <Badge variant="outline" className="text-[9px] h-4 py-0 leading-none">{badge}</Badge>}
            </div>
            <p className="text-sm font-medium pl-5.5">{value || "—"}</p>
        </div>
    );
}

/* ================= EDIT FORM COMPONENT ================= */

function PGEditForm({ pg, onCancel, onUpdated }: { pg: PGData; onCancel: () => void; onUpdated: (data: Partial<PGData>) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get("name"),
            address: formData.get("address"),
            city: formData.get("city"),
            state: formData.get("state"),
            pincode: formData.get("pincode"),
            pgCode: formData.get("pgCode"), // Now editable/viewable here
        };

        try {
            await apiPrivate.patch(`/pgs/${pg.id}`, payload);
            toast.success("Property updated successfully");
            onUpdated(payload as Partial<PGData>);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Property Details</h2>
                <p className="text-muted-foreground">Update your property information and access codes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Property Name</Label>
                                <Input id="name" name="name" defaultValue={pg.name} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgCode">Property Code (Unique)</Label>
                                <Input id="pgCode" name="pgCode" defaultValue={pg.pgCode} placeholder="e.g. MH-CITY-01" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" defaultValue={pg.city} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" defaultValue={pg.state} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" name="pincode" defaultValue={pg.pincode} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Textarea id="address" name="address" defaultValue={pg.address} rows={4} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                    <Button type="button" variant="ghost" onClick={onCancel} className="gap-2">
                        <X className="h-4 w-4" /> Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}