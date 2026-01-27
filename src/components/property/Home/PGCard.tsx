import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PG } from "@/pages/Property/PropertyList";

export default function PGCard({ pg }: { pg: PG }) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer transition hover:shadow-md h-fit"
            onClick={() => navigate(`/pgs/${pg.id}`)}
        >
            <CardContent className="p-4 space-y-3">
                <div className="">
                    <img src={pg.coverImage?.url} alt="Cover Image" className="aspect-square object-contain" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{pg.name}</h3>
                    <p className="text-sm text-gray-500">
                        {pg.city}, {pg.state}
                    </p>
                </div>

                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {pg.status}
                </span>

                {/* Completion */}
                {pg.completionPercent !== undefined &&
                    pg.completionPercent < 100 && (
                        <div className="pt-2">
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Setup completion</span>
                                <span>{pg.completionPercent}%</span>
                            </div>
                            <Progress value={pg.completionPercent} />
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
