// pages/Property/PropertyList.tsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PGGrid from "@/components/property/Home/PGGrid";
import EmptyState from "@/components/property/Home/EmptyState";
import CreatePGModal from "@/components/property/Home/CreatePGModal";

import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";

import type { PG } from "@/interfaces/pg";

export default function Properties() {
    const { setPGs } = usePG(); // sync context

    const [pgs, setLocalPGs] = useState<PG[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    /* =====================================================
       Fetch PG List
    ===================================================== */

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await apiPrivate.get("/pgs");

                const list: PG[] = res.data.data.pgs || [];

                setLocalPGs(list);

                /**
                 * Sync PGContext minimal list
                 */
                setPGs(list.map((pg) => ({ id: pg.id, name: pg.name })));
            } finally {
                setLoading(false);
            }
        };

        fetchPGs();
    }, []);

    if (loading) return <div className="p-6">Loading properties...</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Properties</h1>

                <Button onClick={() => setOpenCreate(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New PG
                </Button>
            </div>

            <hr />

            {/* Content */}
            {pgs.length === 0 ? (
                <EmptyState onCreate={() => setOpenCreate(true)} />
            ) : (
                <PGGrid pgs={pgs} />
            )}

            {/* Create Modal */}
            <CreatePGModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(pg) =>
                    setLocalPGs((prev) => [...prev, pg])
                }
            />
        </div>
    );
}
