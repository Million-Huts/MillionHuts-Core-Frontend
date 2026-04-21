// components/tenant/details/RoomTransferModal.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import { Loader2, Home } from "lucide-react";

import type { Room } from "@/interfaces/room";

type Props = {
    open: boolean;
    onClose: () => void;
    stay: any;
    rooms: Room[];
    onSuccess: () => void;
};

export default function RoomTransferModal({
    open,
    onClose,
    stay,
    rooms,
    onSuccess
}: Props) {

    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!roomId) return toast.error("Select a room");

        if (roomId === stay.roomId) {
            return toast.error("Already assigned to this room");
        }

        setLoading(true);

        try {
            await apiPrivate.patch(`/pgs/${stay.pgId}/stays/${stay.id}`, {
                roomId
            });

            toast.success("Room transferred successfully");
            onSuccess();
            onClose();

        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Transfer failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Home size={16} /> Transfer Room
                    </DialogTitle>
                </DialogHeader>

                {/* Current Room Info */}
                <div className="p-3 rounded-sm bg-muted/30 border text-xs">
                    <span className="font-bold">Current Room:</span>{" "}
                    {stay.room?.name || "Unassigned"}
                </div>

                {/* Room Selection */}
                <div className="space-y-2">
                    <Select onValueChange={setRoomId}>
                        <SelectTrigger className="rounded-sm">
                            <SelectValue placeholder="Select new room" />
                        </SelectTrigger>

                        <SelectContent>
                            {rooms.map((room) => {
                                const isFull =
                                    room.occupiedCount >= room.capacity;

                                const isCurrent =
                                    room.id === stay.roomId;

                                return (
                                    <SelectItem
                                        key={room.id}
                                        value={room.id}
                                        disabled={isFull || isCurrent}
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="font-medium">
                                                {room.name} • {room.roomType}
                                            </span>

                                            <span className="text-[10px] text-muted-foreground">
                                                {room.occupiedCount}/{room.capacity} occupied
                                                {isFull && " • Full"}
                                                {isCurrent && " • Current"}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Action */}
                <Button
                    onClick={handleTransfer}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" />
                            Transferring...
                        </div>
                    ) : (
                        "Confirm Transfer"
                    )}
                </Button>

            </DialogContent>
        </Dialog>
    );
}