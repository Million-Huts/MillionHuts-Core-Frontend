import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import RoomGrid from "@/components/room/RoomGrid";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import { usePG } from "@/context/PGContext";
import { Plus, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export interface Room {
    id: string;
    pgId: string;
    floorId: string;
    name: string;
    roomType: "AC" | "NORMAL";
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
    const [search, setSearch] = useState("");

    const fetchRooms = async () => {
        if (!pgId) return;
        setLoading(true);
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.data.rooms || []);
        } catch (error) {
            console.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [pgId]);

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.sharing.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Home className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Inventory</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Room Directory</h1>
                    <p className="text-muted-foreground mt-1">Manage unit types, pricing, and occupancy.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms..."
                            className="pl-9 rounded-full bg-muted/50 border-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setOpenCreate(true)} className="rounded-full shadow-lg gap-2 px-6">
                        <Plus className="h-4 w-4" /> Add Room
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[220px] w-full rounded-[2rem]" />
                    ))}
                </div>
            ) : rooms.length === 0 ? (
                <EmptyRoomsState onAdd={() => setOpenCreate(true)} />
            ) : (
                <RoomGrid rooms={filteredRooms} />
            )}

            <CreateRoomModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(newRoom) => setRooms((prev) => [...prev, newRoom])}
                pgId={pgId!}
            />
        </div>
    );
}