import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { usePG } from "@/context/PGContext";
import { Badge } from "@/components/ui/badge";
import { Users, Wind, Zap, ArrowUpRight } from "lucide-react";
import type { Room } from "@/interfaces/room";

export default function RoomCard({ room }: { room: Room }) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    const isFull = room.occupiedCount >= room.capacity;
    const availability = room.capacity - room.occupiedCount;

    return (
        <Card
            className="group relative overflow-hidden border-none bg-card hover:bg-card/80 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer rounded-[2rem] p-2"
            onClick={() => navigate(`/pgs/${currentPG?.id}/rooms/${room.id}`)}
        >
            <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter text-foreground">Room {room.name}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                            {room.sharing} Sharing
                        </p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${isFull ? 'bg-destructive' : 'bg-emerald-500'}`} />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Rent</p>
                        <p className="text-xl font-black text-primary">₹{room.rent.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Occupancy</p>
                        <div className="flex items-center justify-end gap-1.5 font-black text-lg">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {room.occupiedCount}/{room.capacity}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-muted/50">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold tracking-tight">
                        {room.roomType === "AC" ? <Wind className="h-3 w-3 mr-1.5" /> : <Zap className="h-3 w-3 mr-1.5" />}
                        {room.roomType}
                    </Badge>
                    <Badge variant={isFull ? "destructive" : "outline"} className="rounded-full px-3 py-1 font-bold tracking-tight">
                        {isFull ? "Fully Occupied" : `${availability} Slots Available`}
                    </Badge>
                </div>

                {/* Hover Action */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-primary text-primary-foreground rounded-full shadow-lg">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
}