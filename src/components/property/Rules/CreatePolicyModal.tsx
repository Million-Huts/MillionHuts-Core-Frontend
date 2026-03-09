import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldPlus, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    pgId: string;
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function CreatePolicyModal({ pgId, open, onClose, onCreated }: Props) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections`, {
                title: formData.get("title"),
            });
            toast.success("Policy category created");
            onCreated();
            onClose();
        } catch {
            toast.error("Failed to create policy category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                <div className="p-8 pb-4 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                        <ShieldPlus className="h-8 w-8" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter">New Policy Category</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground mt-1">
                            Group your rules under a clear heading, like "Visitor Policy" or "Security."
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                    <Input
                        name="title"
                        placeholder="e.g., House Rules"
                        required
                        className="h-14 rounded-2xl border-border bg-muted/30 px-5 text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                    <Button type="submit" className="w-full h-14 rounded-full font-black tracking-wide shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Create Category"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}