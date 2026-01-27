import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "@/pages/Room/Rooms";

export default function RoomCard({ room }: { room: Room }) {
    const navigate = useNavigate();

    const availability =
        room.capacity - room.occupiedCount > 0 ? "Available" : "Full";

    return (
        <Card
            className="cursor-pointer transition hover:shadow-md"
            onClick={() => navigate(`/rooms/${room.id}`)}
        >
            <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">Room {room.name}</h3>

                <p className="text-sm text-gray-500">
                    {room.sharing} • {room.roomType}
                </p>

                <p className="text-sm">
                    Rent: ₹{room.rent}
                </p>

                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {availability}
                </span>
            </CardContent>
        </Card>
    );
}
