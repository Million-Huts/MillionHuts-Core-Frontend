// components/tenant/details/MoveOutModal.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function MoveOutModal({
    open,
    onClose,
    stay,
    onSuccess
}: any) {

    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleMoveOut = async () => {
        if (!date) return toast.error("Select date");

        setLoading(true);

        try {
            await apiPrivate.post(
                `/pgs/${stay.pgId}/stays/${stay.id}/move-out`,
                { endDate: date }
            );

            toast.success("Tenant moved out");
            onSuccess();
            onClose();

        } catch {
            toast.error("Move-out failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Move Out Tenant</DialogTitle>
                </DialogHeader>

                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <Button
                    onClick={handleMoveOut}
                    disabled={loading}
                    className="bg-destructive text-white"
                >
                    Confirm Move Out
                </Button>

            </DialogContent>
        </Dialog>
    );
}