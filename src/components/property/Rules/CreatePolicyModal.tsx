// components/property/Rules/CreatePolicyModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldPlus, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreatePolicyModal({ pgId, open, onClose, onCreated }: any) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections`, {
                title: formData.get("title"),
            });
            toast.success("New policy category created");
            onCreated();
            onClose();
        } catch {
            toast.error("Failed to create policy");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center pt-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <ShieldPlus className="h-6 w-6" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Create Policy Category</DialogTitle>
                        <DialogDescription className="text-center">
                            Group your rules under a clear heading (e.g., "Visitor Policy" or "Security").
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Input
                            name="title"
                            placeholder="e.g. Late Night Entry"
                            required
                            className="h-12 border-muted-foreground/20 focus-visible:ring-primary"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Create Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}