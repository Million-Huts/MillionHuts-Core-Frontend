import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import type { Room } from "./Rooms";
import { usePG } from "@/context/PGContext";

export default function RoomDetails() {
    const { roomId } = useParams();
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        apiPrivate.get(`/pgs/${pgId}/rooms/${roomId}`).then((res) => {
            setRoom(res.data.data.room);
        });
    }, [roomId]);

    if (!room) return <div className="p-6">Loading room...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">Room {room.name}</h2>
                    <Button variant="outline">Edit</Button>
                </div>

                <p className="text-sm text-gray-500">
                    {room.sharing} • {room.roomType}
                </p>

                <p>Rent: ₹{room.rent}</p>
                <p>
                    Occupancy: {room.occupiedCount}/{room.capacity}
                </p>
            </div>

            {/* Tenant placeholder */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold">Tenants</h3>
                <p className="text-sm text-gray-500">
                    Tenant management coming soon...
                </p>
            </div>
        </div>
    );
}
