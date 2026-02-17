import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Floor } from "@/pages/Floor/Floors";
import { usePG } from "@/context/PGContext";

export default function FloorCard({ floor }: { floor: Floor }) {
    const navigate = useNavigate();
    const { currentPG } = usePG();
    return (
        <Card
            className="cursor-pointer transition hover:shadow-md"
            onClick={() => navigate(`/pgs/${currentPG?.id}/floors/${floor.id}`)}
        >
            <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{floor.label}</h3>

                <p className="text-sm text-gray-500">
                    Total Rooms: {floor.totalRooms}
                </p>

                {floor.publicPlaces.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                        {floor.publicPlaces.map((place, i) => (
                            <span
                                key={i}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                            >
                                {place}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
