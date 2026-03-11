import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Floor } from "@/interfaces/floor";
import { usePG } from "@/context/PGContext";
import { ArrowRight, DoorOpen, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FloorCard({ floor }: { floor: Floor }) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    return (
        <Card
            className="group relative overflow-hidden rounded-sm border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/pgs/${currentPG?.id}/floors/${floor.id}`)}
        >
            <div className="flex flex-col h-full justify-between">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <LayoutGrid className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            {floor.id?.slice(-4).toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-4 mb-8">
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter">{floor.label}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium mt-1">
                            <DoorOpen className="h-4 w-4" />
                            <span className="text-sm">{floor.totalRooms} Rooms Available</span>
                        </div>
                    </div>

                    {/* Common Areas Tags */}
                    {floor.publicPlaces.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {floor.publicPlaces.slice(0, 2).map((place, i) => (
                                <Badge key={i} variant="secondary" className="rounded-full font-bold text-[10px] px-3">
                                    {place}
                                </Badge>
                            ))}
                            {floor.publicPlaces.length > 2 && (
                                <Badge variant="outline" className="rounded-full font-bold text-[10px] px-3">
                                    +{floor.publicPlaces.length - 2} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <span className="text-sm">Manage Floor</span>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </Card>
    );
}