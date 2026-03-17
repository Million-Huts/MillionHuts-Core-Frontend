import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import RoomGrid from "@/components/room/RoomGrid";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import { usePG } from "@/context/PGContext";
import { Plus, LayoutGrid, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import type { Room } from "@/interfaces/room";
import type { Floor } from "@/interfaces/floor";

export default function Rooms() {
    const [searchParams] = useSearchParams();
    const { currentPG } = usePG();
    const pgId = currentPG?.id;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [floorError, setFloorError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
    const [search, setSearch] = useState("");

    const fetchRooms = async () => {
        if (!pgId) return;
        setLoading(true);
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rooms`);
            setRooms(res.data.data.rooms || []);
        } catch {
            console.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };
    const fetchFloors = async () => {
        setLoading(true);
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/floors`);
            const floorList = res.data.data.floors || [];
            setFloors(floorList);
            if (floorList.length === 0) setFloorError(true);
        } catch {
            setFloorError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();

        fetchFloors();
    }, [pgId]);
    useEffect(() => {
        if (searchParams.get("create") === "true") setOpenCreate(true);
    }, [searchParams]);

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.sharing.toLowerCase().includes(search.toLowerCase())
    );

    const floorAvailability = floors.map((floor) => {
        const configuredRooms = rooms.filter(r => r.floorId === floor.id).length;

        return {
            floorId: floor.id!,
            isAvailable: configuredRooms < floor.totalRooms
        };
    });

    return (
        <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <LayoutGrid className="h-5 w-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Inventory Management</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Room Directory</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage unit types, pricing, and current occupancy.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search units..."
                            className="pl-11 h-12 rounded-sm bg-muted/30 border-none focus:bg-muted/50 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setOpenCreate(true)} className="h-12 rounded-sm px-8 font-black shadow-lg shadow-primary/20 gap-2">
                        <Plus className="h-4 w-4" /> Add Room
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-[240px] w-full rounded-sm" />
                        ))}
                    </div>
                ) : rooms.length === 0 ? (
                    <EmptyRoomsState onAdd={() => setOpenCreate(true)} />
                ) : (
                    <RoomGrid rooms={filteredRooms} />
                )}
            </div>

            <CreateRoomModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(newRoom) => setRooms((prev) => [...prev, newRoom])}
                pgId={pgId!}
                floors={floors}
                floorError={floorError}
                floorAvailability={floorAvailability}
            />
        </div>
    );
}