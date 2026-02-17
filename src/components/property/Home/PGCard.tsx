// components/property/Home/PGCard.tsx

import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import type { PG } from "@/interfaces/pg";

export default function PGCard({ pg }: { pg: PG }) {
    const navigate = useNavigate();

    const image =
        pg.coverImage?.url ||
        "https://placehold.co/400x300?text=No+Image";

    return (
        <Card
            className="cursor-pointer transition hover:shadow-md h-fit"
            onClick={() => navigate(`/pgs/${pg.id}/basic`)}
        >
            <CardContent className="p-4 space-y-3">
                {/* Image */}
                <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={pg.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div>
                    <h3 className="text-lg font-semibold">
                        {pg.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {pg.city}, {pg.state}
                    </p>
                </div>

                {/* Status */}
                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {pg.status}
                </span>

                {/* Completion */}
                {pg.completionPercent !== undefined &&
                    pg.completionPercent < 100 && (
                        <div className="pt-2">
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Setup completion</span>
                                <span>
                                    {pg.completionPercent}%
                                </span>
                            </div>

                            <Progress value={pg.completionPercent} />
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
