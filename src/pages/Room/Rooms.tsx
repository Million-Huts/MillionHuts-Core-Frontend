import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import RoomGrid from "@/components/room/RoomGrid";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import { usePG } from "@/context/PGContext";

export interface Room {
    id: string;
    pgId: string;
    floorId: string;
    name: string;
    roomType: string;
    sharing: string;
    status: string;
    capacity: number;
    occupiedCount: number;
    rent: number;
    sizeSqFt?: number;
    features: string[];
}

export default function Rooms() {
    const { currentPG } = usePG();

    const pgId = currentPG?.id;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.rooms);
            setLoading(false);
        };
        fetchRooms();
    }, [pgId]);

    if (loading) return <div className="p-6">Loading rooms...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Rooms</h1>
                <Button onClick={() => setOpenCreate(true)}>Add Room</Button>
            </div>

            {rooms.length === 0 ? (
                <EmptyRoomsState onAdd={() => setOpenCreate(true)} />
            ) : (
                <RoomGrid rooms={rooms} />
            )}

            <CreateRoomModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(room) => setRooms((prev) => [...prev, room])}
                pgId={pgId!}
            />
        </div>
    );
}
