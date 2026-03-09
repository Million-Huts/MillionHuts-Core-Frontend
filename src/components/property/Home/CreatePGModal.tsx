import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { usePG } from "@/context/PGContext";
import type { PG } from "@/interfaces/pg";
import { Building2, Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (pg: PG) => void;
}

export default function CreatePGModal({ open, onClose, onCreated }: Props) {
    const { pgs, setPGs } = usePG();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        setIsSubmitting(true);
        const toastId = toast.loading("Configuring your new establishment...");

        try {
            const res = await apiPrivate.post("/pgs", data);
            const newPG: PG = res.data.data.pg;

            // Sync local and global state
            onCreated(newPG);
            setPGs([...pgs, { id: newPG.id, name: newPG.name }]);

            toast.success(`${newPG.name} is now live!`, { id: toastId });
            onClose();
            (e.target as HTMLFormElement).reset(); // Reset form on success
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to establish property", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => !isSubmitting && onClose()}>
            <DialogContent className="sm:max-w-[480px] border-none shadow-2xl overflow-hidden p-0 bg-card">
                {/* Visual Header Accent */}
                <div className="h-2 bg-primary w-full" />

                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tighter">
                                New Establishment
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Initialize a new property in your portfolio. You can configure floors and rooms after creation.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                Property Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Skyline Residency"
                                required
                                className="rounded-xl border-muted bg-muted/30 focus-visible:ring-primary"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                Physical Address
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="123, Sector 5, HSR Layout"
                                required
                                className="rounded-xl border-muted bg-muted/30"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    City
                                </Label>
                                <Input id="city" name="city" placeholder="Bengaluru" required className="rounded-xl border-muted bg-muted/30" disabled={isSubmitting} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    State
                                </Label>
                                <Input id="state" name="state" placeholder="Karnataka" required className="rounded-xl border-muted bg-muted/30" disabled={isSubmitting} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pincode" className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                Pincode
                            </Label>
                            <Input
                                id="pincode"
                                name="pincode"
                                placeholder="560102"
                                required
                                maxLength={6}
                                pattern="\d{6}"
                                title="Please enter a valid 6-digit pincode"
                                className="rounded-xl border-muted bg-muted/30"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-xl font-bold text-muted-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl px-10 font-black tracking-tight shadow-lg shadow-primary/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Establish Property"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}