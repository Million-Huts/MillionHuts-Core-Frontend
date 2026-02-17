import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function CreatePolicyModal({
    pgId,
    open,
    onClose,
    onCreated,
}: {
    pgId: string;
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections`, {
                title: formData.get("title"),
            });
            toast.success("Policy created");
            onCreated();
            onClose();
        } catch {
            toast.error("Failed to create policy");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Policy</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Policy title" required />
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
