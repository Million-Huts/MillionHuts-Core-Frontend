import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import FloorGrid from "@/components/floor/FloorGrid";
import CreateFloorModal from "@/components/floor/CreateFloorModal";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import EmptyFloorsState from "@/components/floor/EmptyFloorsState";
import { Plus, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface Floor {
    id?: string;
    pgId: string;
    label: string;
    order?: string;
    totalRooms: number;
    publicPlaces: string[];
}

export default function Floors() {
    const { currentPG } = usePG();
    const [floors, setFloors] = useState<Floor[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    const fetchFloors = async () => {
        if (!currentPG?.id) return;
        setLoading(true);
        try {
            const res = await apiPrivate.get(`/pgs/${currentPG.id}/floors`);
            // Consistent data access
            setFloors(res.data.data.floors || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load floors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFloors();
    }, [currentPG?.id]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Layers className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Structure</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Floor Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Organize {currentPG?.name || 'Property'} by levels and shared spaces.
                    </p>
                </div>
                <Button
                    onClick={() => setOpenCreate(true)}
                    className="rounded-full shadow-lg shadow-primary/20 gap-2 px-6"
                >
                    <Plus className="h-4 w-4" /> Add New Floor
                </Button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[180px] w-full rounded-3xl" />
                    ))}
                </div>
            ) : floors.length === 0 ? (
                <EmptyFloorsState onAdd={() => setOpenCreate(true)} />
            ) : (
                <FloorGrid floors={floors} />
            )}

            <CreateFloorModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(newFloor) => setFloors(prev => [...prev, newFloor])}
                pgId={currentPG?.id!}
            />
        </div>
    );
}