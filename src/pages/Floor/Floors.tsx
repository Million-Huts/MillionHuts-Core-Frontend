import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import FloorGrid from "@/components/floor/FloorGrid";
import CreateFloorModal from "@/components/floor/CreateFloorModal";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import EmptyFloorsState from "@/components/floor/EmptyFloorsState";
import { Plus, Layers, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [totalFloors, setTotalFloors] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    // NEW: State for the "Increase Limit" prompt
    const [showLimitPrompt, setShowLimitPrompt] = useState(false);
    const [shouldIncreaseLimit, setShouldIncreaseLimit] = useState(false);

    const fetchFloors = async () => {
        if (!currentPG?.id) return;
        setLoading(true);
        try {
            const res = await apiPrivate.get(`/pgs/${currentPG.id}/floors`);
            setFloors(res.data.data.floors || []);
            setTotalFloors(res.data.data.totalFloors);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load floors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFloors();
    }, [currentPG?.id]);

    const handleAddClick = () => {
        if (floors.length >= totalFloors) {
            setShowLimitPrompt(true);
        } else {
            setShouldIncreaseLimit(false);
            setOpenCreate(true);
        }
    };

    const confirmIncreaseAndOpen = () => {
        setShouldIncreaseLimit(true);
        setShowLimitPrompt(false);
        setOpenCreate(true);
    };

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
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Organizing <span className="text-foreground font-semibold">{currentPG?.name}</span> •
                        <span className="ml-1 px-2 py-0.5 bg-slate-100 rounded-md">
                            {floors.length} / {totalFloors} Floors Used
                        </span>
                    </p>
                </div>
                <Button
                    onClick={handleAddClick}
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
                <EmptyFloorsState onAdd={handleAddClick} />
            ) : (
                <FloorGrid floors={floors} />
            )}

            {/* LIMIT INCREASE ALERT DIALOG */}
            <AlertDialog open={showLimitPrompt} onOpenChange={setShowLimitPrompt}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <AlertDialogTitle className="text-center">Floor Limit Reached</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            You've reached your maximum of <strong>{totalFloors} floors</strong>.
                            Would you like to increase the total floor count and add a new one?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmIncreaseAndOpen}>
                            Yes, Increase & Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* CREATE MODAL */}
            <CreateFloorModal
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    setShouldIncreaseLimit(false); // Reset on close
                }}
                onCreated={(newFloor) => {
                    setFloors(prev => [...prev, newFloor]);
                    // Update the local count since backend increased it
                    if (shouldIncreaseLimit) setTotalFloors(prev => prev + 1);
                }}
                pgId={currentPG?.id!}
                autoIncreaseLimit={shouldIncreaseLimit}
                currentFloorCount={floors.length}
            />
        </div>
    );
}