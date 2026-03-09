import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import FloorGrid from "@/components/floor/FloorGrid";
import CreateFloorModal from "@/components/floor/CreateFloorModal";
import { usePG } from "@/context/PGContext";
import toast from "react-hot-toast";
import EmptyFloorsState from "@/components/floor/EmptyFloorsState";
import { Plus, AlertCircle, Building2 } from "lucide-react";
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
import type { Floor } from "@/interfaces/floor";

export default function Floors() {
    const { currentPG } = usePG();
    const [floors, setFloors] = useState<Floor[]>([]);
    const [totalFloors, setTotalFloors] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);
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
            toast.error("Failed to load floor data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFloors(); }, [currentPG?.id]);

    const handleAddClick = () => {
        if (floors.length >= totalFloors) {
            setShowLimitPrompt(true);
        } else {
            setShouldIncreaseLimit(false);
            setOpenCreate(true);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Floor Structure</h1>
                        <p className="text-muted-foreground font-medium">Manage floors and layouts for {currentPG?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Capacity</span>
                        <span className="text-lg font-bold">{floors.length} / {totalFloors} Active Floors</span>
                    </div>
                    <Button onClick={handleAddClick} className="rounded-full h-12 px-8 font-black shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" /> Add Floor
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-[2rem]" />)}
                </div>
            ) : floors.length === 0 ? (
                <EmptyFloorsState onAdd={handleAddClick} />
            ) : (
                <FloorGrid floors={floors} />
            )}

            {/* Modals & Dialogs */}
            <AlertDialog open={showLimitPrompt} onOpenChange={setShowLimitPrompt}>
                <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                        <div className="mx-auto p-4 rounded-full bg-amber-100 text-amber-600 mb-4">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-center text-xl">Capacity Reached</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            You've used all <strong>{totalFloors}</strong> allotted floor slots. Would you like to expand your limit to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { setShouldIncreaseLimit(true); setShowLimitPrompt(false); setOpenCreate(true); }}
                            className="rounded-full px-6"
                        >
                            Increase Limit & Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CreateFloorModal
                open={openCreate}
                onClose={() => { setOpenCreate(false); setShouldIncreaseLimit(false); }}
                onCreated={(newFloor: any) => {
                    setFloors(prev => [...prev, newFloor]);
                    if (shouldIncreaseLimit) setTotalFloors(prev => prev + 1);
                }}
                pgId={currentPG?.id!}
                autoIncreaseLimit={shouldIncreaseLimit}
                currentFloorCount={floors.length}
            />
        </div>
    );
}