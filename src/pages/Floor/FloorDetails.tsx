import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { Floor } from "@/interfaces/floor";
import { usePG } from "@/context/PGContext";
import type { Room } from "@/interfaces/room";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import RoomGrid from "@/components/room/RoomGrid";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Edit3, DoorOpen, MapPinned } from "lucide-react";
import EditFloorModal from "@/components/floor/EditFloorModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function FloorDetails() {
    const { floorId } = useParams();
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const navigate = useNavigate();

    const [floor, setFloor] = useState<Floor | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = async () => {
        if (!pgId || !floorId) return;
        setLoading(true);
        try {
            const [floorRes, roomRes] = await Promise.all([
                apiPrivate.get(`/pgs/${pgId}/floors/${floorId}`),
                apiPrivate.get(`/pgs/${pgId}/rooms/floor/${floorId}`)
            ]);
            setFloor(floorRes.data.data.floor);
            setRooms(roomRes.data.data.rooms || []);
        } catch {
            toast.error("Failed to load floor details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [pgId, floorId]);

    if (loading && !floor) return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48 rounded-sm" />
            <Skeleton className="h-40 w-full rounded-sm" />
        </div>
    );

    return (
        <div className="p-2 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back to Floors
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mt-2 flex items-center gap-4">
                        {floor?.label}
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4">Live</Badge>
                    </h1>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="rounded-sm h-12 px-6 gap-2">
                    <Edit3 className="h-4 w-4" /> Configure Floor
                </Button>
            </div>

            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-sm p-6 flex items-center gap-4 shadow-sm">
                    <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <DoorOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity</p>
                        <p className="text-xl font-black">{floor?.totalRooms} Rooms</p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-card border rounded-sm p-6 flex flex-col justify-center shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                        <MapPinned className="h-3 w-3" /> Shared Facilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {floor?.publicPlaces.length === 0 ? (
                            <span className="text-sm font-medium text-muted-foreground italic">No common areas defined</span>
                        ) : (
                            floor?.publicPlaces.map((place, idx) => (
                                <Badge key={idx} variant="secondary" className="rounded-full py-1.5 px-4 font-bold tracking-tight">
                                    {place}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-black tracking-tighter">Rooms Overview</h3>
                    <Badge variant="outline" className="rounded-full px-4">{rooms.length} Active Units</Badge>
                </div>

                <div className="bg-muted/20 rounded-sm p-6 md:p-10 border-2 border-dashed border-border">
                    {rooms.length === 0 ? (
                        <EmptyRoomsState onAdd={() => navigate(`/pgs/${pgId}/rooms?create=true&floor=${floorId}`)} />
                    ) : (
                        <RoomGrid rooms={rooms} />
                    )}
                </div>
            </div>

            {floor && (
                <EditFloorModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    floor={floor}
                    pgId={pgId!}
                    onUpdated={(updated) => setFloor(updated)}
                />
            )}
        </div>
    );
}