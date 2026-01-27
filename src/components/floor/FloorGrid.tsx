import FloorCard from "./FloorCard";
import type { Floor } from "@/pages/Floor/Floors";

export default function FloorGrid({ floors }: { floors: Floor[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {floors.map((floor) => (
                <FloorCard key={floor.id} floor={floor} />
            ))}
        </div>
    );
}
