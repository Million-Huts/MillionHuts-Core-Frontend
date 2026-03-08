import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";

interface Props { open: boolean; onClose: () => void; }

export default function EditProfileModal({ open, onClose }: Props) {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    // Sync form data when user data loads
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
            setUser({ ...user, ...res.data.data }); // Merge new data
            toast.success("Profile updated!");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg rounded-[2rem] p-8">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">Update Profile</DialogTitle>
                    <DialogDescription>Modify your account identity and contact information.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider ml-1">Full Name</Label>
                        <Input
                            id="name"
                            className="rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 h-12"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 h-12"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider ml-1">Phone</Label>
                            <Input
                                id="phone"
                                className="rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 h-12"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl px-6">Cancel</Button>
                        <Button type="submit" disabled={loading} className="rounded-2xl px-8 shadow-lg shadow-primary/20">
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}