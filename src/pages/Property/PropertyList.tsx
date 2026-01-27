import { useEffect, useState } from "react";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PGGrid from "@/components/property/Home/PGGrid";
import EmptyState from "@/components/property/Home/EmptyState";
import CreatePGModal from "@/components/property/Home/CreatePGModal";
import { Plus } from "lucide-react";

export interface PG {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    status: string;
    completionPercent?: number;
    coverImage?: CoverImage;
}

interface CoverImage {
    id?: string;
    pgId?: string;
    url?: string;
}

export default function Properties() {
    const [pgs, setPgs] = useState<PG[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await apiPrivate.get("/pgs");
                setPgs(res.data.pgs);
            } finally {
                setLoading(false);
            }
        };

        fetchPGs();
    }, []);

    if (loading) return <div className="p-6">Loading properties...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Properties</h1>
                <Button onClick={() => setOpenCreate(true)}><Plus /> Add New PG</Button>
            </div>

            <hr />
            {pgs.length === 0 ? (
                <EmptyState onCreate={() => setOpenCreate(true)} />
            ) : (
                <PGGrid pgs={pgs} />
            )}

            <CreatePGModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(pg) => setPgs((prev) => [...prev, pg])}
            />
        </div>
    );
}
