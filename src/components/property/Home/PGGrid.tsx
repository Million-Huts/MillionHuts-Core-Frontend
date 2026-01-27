import PGCard from "@/components/property/Home/PGCard";
import type { PG } from "@/pages/Property/PropertyList";

export default function PGGrid({ pgs }: { pgs: PG[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pgs.map((pg) => (
                <PGCard key={pg.id} pg={pg} />
            ))}
        </div>
    );
}
