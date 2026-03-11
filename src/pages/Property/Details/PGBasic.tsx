import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, MapPin, Building, Hash, Save, X, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const InfoRow = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-start gap-4 p-4 rounded-sm bg-muted/30 border border-border/50">
        <div className="p-2.5 rounded-full bg-background border shadow-sm text-primary">
            <Icon className="h-4 w-4" />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{value || "—"}</p>
        </div>
    </div>
);

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
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                    Loading Property data...
                </p>
            </div>
        );
    }
    if (!pg) return null;

    return (
        <div className={`max-w-5xl mx-auto space-y-8 pb-20`}>
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter">Identity & Location</h2>
                                <p className="text-muted-foreground font-medium">Core establishment details and QR identifier.</p>
                            </div>
                            <Button onClick={() => setEditing(true)} variant="outline" className="rounded-sm gap-2 px-6">
                                <Edit2 className="h-4 w-4" /> Edit Profile
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 rounded-sm border-border/50 shadow-sm">
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InfoRow label="Property Name" value={pg.name} icon={Building} />
                                        <InfoRow label="Property Code" value={pg.pgCode} icon={Hash} />
                                        <InfoRow label="City" value={pg.city} icon={MapPin} />
                                        <InfoRow label="State" value={pg.state} icon={MapPin} />
                                    </div>
                                    <InfoRow label="Full Physical Address" value={pg.address} icon={MapPin} />
                                    <Badge variant="secondary" className="px-4 py-1 font-bold rounded-full">{pg.status.toUpperCase()}</Badge>
                                </CardContent>
                            </Card>

                            <Card className="rounded-sm border-primary/10 bg-primary/5 shadow-none flex flex-col items-center justify-center p-8">
                                <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
                                    <QRCodeSVG value={pg.pgCode || "N/A"} size={160} />
                                </div>
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-primary">Property QR</h4>
                            </Card>
                        </div>
                    </motion.div>
                ) : (
                    <PGEditForm
                        pg={pg}
                        onCancel={() => setEditing(false)}
                        onUpdated={(updated) => { setPg({ ...pg, ...updated }); setEditing(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function PGEditForm({ pg, onCancel, onUpdated }: { pg: PGData; onCancel: () => void; onUpdated: (data: Partial<PGData>) => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

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
        <motion.form
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} className="space-y-8"
        >
            <div>
                <h2 className="text-3xl font-black tracking-tighter">Edit Property</h2>
                <p className="text-muted-foreground font-medium">Update your property information and access codes.</p>
            </div>

            <Card className="rounded-sm border-border/50">
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</Label>
                            <Input name="name" defaultValue={pg.name} className="rounded-sm h-12" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Property Code</Label>
                            <Input name="pgCode" defaultValue={pg.pgCode} className="rounded-sm h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City</Label>
                            <Input name="city" defaultValue={pg.city} className="rounded-sm h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">State</Label>
                            <Input name="state" defaultValue={pg.state} className="rounded-sm h-12" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pincode</Label>
                            <Input name="pincode" defaultValue={pg.pincode} className="rounded-sm h-12" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Address</Label>
                            <Textarea name="address" defaultValue={pg.address} className="rounded-sm min-h-[120px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-3">
                <Button type="submit" className="rounded-sm px-8 h-12 font-bold" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-sm px-8 h-12 font-bold">
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
            </div>
        </motion.form>
    );
}