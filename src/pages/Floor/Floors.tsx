import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import FloorGrid from "@/components/floor/FloorGrid";
import CreateFloorModal from "@/components/floor/CreateFloorModal";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import EmptyFloorsState from "@/components/floor/EmptyFloorsState";

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

    useEffect(() => {
        if (!currentPG?.id) return;
        setFloors([]);
        const fetchFloors = async () => {
            try {
                const res = await apiPrivate.get(`/pgs/${currentPG?.id}/floors`);
                if (res.data.floors && res.data.floors.length > 0)
                    setFloors(res.data.floors);
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFloors();
    }, [currentPG]);

    if (loading) return <div className="p-6">Loading floors...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Floors</h1>
                <Button onClick={() => setOpenCreate(true)}>Add Floor</Button>
            </div>

            {floors.length === 0 ? (
                <EmptyFloorsState onAdd={() => setOpenCreate(true)} />
            ) : (
                <FloorGrid floors={floors} />
            )}

            <CreateFloorModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(floor) => setFloors((prev) => [...prev, floor])}
                pgId={currentPG?.id!}
            />
        </div>
    );
}
