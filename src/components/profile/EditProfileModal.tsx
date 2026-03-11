import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { UserCog } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

export default function EditProfileModal({ open, onClose }: Props) {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            });
        }
    }, [user, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiPrivate.patch(`/users/profile`, formData);
            setUser({ ...user, ...res.data.data });
            toast.success("Identity registry updated");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Sync failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg rounde-sm p-8 border border-border shadow-2xl max-h-[90vh] overflow-y-scroll">
                <DialogHeader className="mb-6">
                    <DialogTitle className="flex items-center gap-3 text-xl font-black tracking-tighter">
                        <div className="p-2 bg-slate-950 rounded-full">
                            <UserCog className="w-4 h-4 text-white" />
                        </div>
                        Edit Identity
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-2">
                        Modify your account contact registry.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</Label>
                        <Input
                            className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</Label>
                            <Input
                                type="email"
                                className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone</Label>
                            <Input
                                className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-sm font-black uppercase tracking-widest text-[10px]">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-[2] rounded-sm font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                            {loading ? "SYNCING..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}