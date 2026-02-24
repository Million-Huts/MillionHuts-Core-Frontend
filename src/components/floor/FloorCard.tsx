import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Floor } from "@/pages/Floor/Floors";
import { usePG } from "@/context/PGContext";
import { ArrowRight, DoorOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FloorCard({ floor }: { floor: Floor }) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    return (
        <Card
            className="group relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl cursor-pointer rounded-3xl"
            onClick={() => navigate(`/pgs/${currentPG?.id}/floors/${floor.id}`)}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        {floor.label}
                    </div>
                    <Badge variant="secondary" className="rounded-md font-mono">
                        ID: {floor.id?.slice(-4).toUpperCase()}
                    </Badge>
                </div>

                <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-bold">{floor.label}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <DoorOpen className="h-4 w-4" />
                        <span>{floor.totalRooms} Rooms listed</span>
                    </div>
                </div>

                {floor.publicPlaces.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t pt-4">
                        {floor.publicPlaces.slice(0, 3).map((place, i) => (
                            <Badge key={i} variant="outline" className="bg-muted/30 text-[10px] uppercase font-bold">
                                <MapPin className="h-3 w-3 mr-1 opacity-50" /> {place}
                            </Badge>
                        ))}
                        {floor.publicPlaces.length > 3 && (
                            <span className="text-[10px] font-bold text-muted-foreground ml-1">
                                +{floor.publicPlaces.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                    <ArrowRight className="h-5 w-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    );
}