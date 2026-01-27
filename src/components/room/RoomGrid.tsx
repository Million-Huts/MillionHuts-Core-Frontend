import RoomCard from "./RoomCard";
import type { Room } from "@/pages/Room/Rooms";

export default function RoomGrid({ rooms }: { rooms: Room[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}
        </div>
    );
}
