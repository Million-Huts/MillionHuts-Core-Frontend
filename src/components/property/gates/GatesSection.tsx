import { useEffect, useState } from "react";
import { DoorOpen, PlusCircle, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import GateFormModal from "./GateFormModal";
import GateEditModal from "./GateEditModal";
import { Pencil } from "lucide-react";

interface Gate {
    id: string;
    name: string;
    code?: string;
    isActive: boolean;
    type: "MAIN" | "SIDE" | "BACK" | "SERVICE";
}

export default function GatesSection({ pgId }: { pgId: string }) {
    const [gates, setGates] = useState<Gate[]>([]);
    const [showInactive, setShowInactive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedGate, setSelectedGate] = useState<Gate | null>(null);

    const fetchGates = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/gates`);
            setGates(res.data.data || []);
        } catch {
            toast.error("Failed to load gates");
            setGates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGates();
    }, [pgId]);

    if (loading) {
        return (
            <Card className="rounded-sm border-border/50 shadow-sm">
                <CardContent className="p-8 flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                        Loading gates...
                    </span>
                </CardContent>
            </Card>
        );
    }

    /*
    -----------------------------------------------------
    EMPTY STATE
    -----------------------------------------------------
    */

    if (!gates.length) {
        return (
            <Card className="rounded-sm border-border/50 shadow-sm">
                <CardContent className="p-10 flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-sm bg-primary/10 text-primary">
                        <DoorOpen className="h-6 w-6" />
                    </div>

                    <div>
                        <h3 className="font-black text-lg">
                            No Gates Configured
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Add entry points like Main Gate, Back Gate for
                            security tracking.
                        </p>
                    </div>

                    <Button className="rounded-sm gap-2" onClick={() => setOpen(true)}>
                        <PlusCircle className="h-4 w-4" />
                        Add Gate
                    </Button>
                </CardContent>
                <GateFormModal
                    open={open}
                    onClose={() => setOpen(false)}
                    pgId={pgId}
                    onSuccess={fetchGates}
                />
            </Card>
        );
    }

    /*
    -----------------------------------------------------
    LIST VIEW
    -----------------------------------------------------
    */

    const active = gates.filter((g) => g.isActive).length;
    const filteredGates = showInactive
        ? gates
        : gates.filter((g) => g.isActive);

    return (
        <>
            <Card className="rounded-sm border-border/50 shadow-sm">

                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <DoorOpen className="h-4 w-4 text-primary" />
                                Entry Points (Gates)
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                {active}/{gates.length} active gates
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowInactive((prev) => !prev)}
                                className="rounded-sm text-xs"
                            >
                                {showInactive ? "Hide Inactive" : "Show Inactive"}
                            </Button>

                            <Button
                                variant="outline"
                                className="rounded-sm gap-2"
                                onClick={() => setOpen(true)}
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Gate
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredGates.map((gate) => (
                            <div
                                className={`flex items-center justify-between p-4 rounded-sm border ${gate.isActive
                                    ? "bg-muted/30 border-border/50"
                                    : "bg-muted/10 border-dashed opacity-70"
                                    }`}
                            >
                                <div>
                                    <p className="font-semibold">{gate.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {gate.code || "—"} • {gate.type}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={gate.isActive ? "default" : "secondary"}
                                        className="rounded-full font-bold"
                                    >
                                        {gate.isActive ? "Active" : "Inactive"}
                                    </Badge>

                                    <button
                                        onClick={() => {
                                            setSelectedGate(gate);
                                            setEditOpen(true);
                                        }}
                                        className="p-2 rounded-sm hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <GateFormModal
                    open={open}
                    onClose={() => setOpen(false)}
                    pgId={pgId}
                    onSuccess={fetchGates}
                />
                <GateEditModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    pgId={pgId}
                    gate={selectedGate}
                    onSuccess={fetchGates}
                />
            </Card>

        </>
    );
}