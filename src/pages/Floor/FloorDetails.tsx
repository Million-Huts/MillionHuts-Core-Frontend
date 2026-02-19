import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { Floor } from "./Floors";
import { usePG } from "@/context/PGContext";
import type { Room } from "../Room/Rooms";
import EmptyRoomsState from "@/components/room/EmptyRoomsState";
import RoomGrid from "@/components/room/RoomGrid";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Edit3, CheckCircle2, DoorOpen, MapPinned } from "lucide-react";
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
            // Fetch Floor Info
            const floorRes = await apiPrivate.get(`/pgs/${pgId}/floors/${floorId}`);
            setFloor(floorRes.data.data.floor);

            // Fetch Rooms for this Floor
            const roomRes = await apiPrivate.get(`/pgs/${pgId}/rooms/floor/${floorId}`);
            setRooms(roomRes.data.data.rooms || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pgId, floorId]);

    if (loading && !floor) return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" /> Back to Floors
                    </button>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Floor {floor?.label}
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3">Live</Badge>
                    </h1>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="rounded-full gap-2 border-2">
                    <Edit3 className="h-4 w-4" /> Edit Floor Structure
                </Button>
            </div>

            {/* Quick Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DoorOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Capacity</p>
                        <p className="text-xl font-bold">{floor?.totalRooms} Rooms</p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                        <MapPinned className="h-3 w-3" /> Shared Facilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {floor?.publicPlaces.length === 0 ? (
                            <span className="text-sm text-muted-foreground italic">No common areas defined</span>
                        ) : (
                            floor?.publicPlaces.map((place, idx) => (
                                <Badge key={idx} variant="secondary" className="rounded-lg py-1 px-3 flex gap-2 items-center font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                    {place}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Rooms Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold tracking-tight">Rooms on this Level</h3>
                    <Badge variant="outline">{rooms.length} Active Units</Badge>
                </div>

                <div className="bg-muted/30 rounded-[2.5rem] p-2 md:p-6 border-2 border-dashed">
                    {rooms.length === 0 ? (
                        <EmptyRoomsState onAdd={() => navigate('/rooms/add')} />
                    ) : (
                        <RoomGrid rooms={rooms} />
                    )}
                </div>
            </div>

            {/* Edit Modal */}
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