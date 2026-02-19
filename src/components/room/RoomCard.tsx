import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "@/pages/Room/Rooms";
import { usePG } from "@/context/PGContext";
import { Badge } from "@/components/ui/badge";
import { Users, Wind, ZapOff, ArrowUpRight } from "lucide-react";

export default function RoomCard({ room }: { room: Room }) {
    const navigate = useNavigate();
    const { currentPG } = usePG();

    const isFull = room.occupiedCount >= room.capacity;
    const availability = room.capacity - room.occupiedCount;

    return (
        <Card
            className="group relative overflow-hidden border-2 transition-all hover:border-indigo-500 hover:shadow-2xl cursor-pointer rounded-[2rem]"
            onClick={() => navigate(`/pgs/${currentPG?.id}/rooms/${room.id}`)}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-foreground">Room {room.name}</h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">
                            {room.sharing} Sharing
                        </p>
                    </div>
                    <div className={`h-3 w-3 rounded-full animate-pulse ${isFull ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Rent</p>
                        <p className="text-lg font-bold text-indigo-600">₹{room.rent.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Occupancy</p>
                        <div className="flex items-center justify-end gap-1 text-foreground font-bold">
                            <Users className="h-4 w-4" />
                            {room.occupiedCount}/{room.capacity}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed">
                    <Badge variant={room.roomType === "AC" ? "default" : "secondary"} className="rounded-md">
                        {room.roomType === "AC" ? <Wind className="h-3 w-3 mr-1" /> : <ZapOff className="h-3 w-3 mr-1" />}
                        {room.roomType}
                    </Badge>
                    <Badge variant="outline" className={`rounded-md ${isFull ? 'text-red-500' : 'text-green-600 border-green-200 bg-green-50'}`}>
                        {isFull ? "Fully Occupied" : `${availability} Slots Left`}
                    </Badge>
                </div>

                <div className="absolute top-4 right-4 translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-all">
                    <div className="bg-indigo-600 p-2 rounded-bl-2xl text-white shadow-lg">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}