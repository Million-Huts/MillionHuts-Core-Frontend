import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import type { PG } from "@/interfaces/pg";

import PGInfoDisplay from "@/components/property/basics/PGInfoDisplay";
import PGEditForm from "@/components/property/basics/PGEditForm";

export default function PGBasic() {
    const { pgId } = useParams();
    const [pg, setPg] = useState<PG | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const fetchPG = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}`);
            setPg(res.data.data.pg);
        } catch {
            toast.error("Failed to load property details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPG(); }, [pgId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing Portfolio...</p>
        </div>
    );

    if (!pg) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <PGInfoDisplay
                        pg={pg}
                        onEdit={() => setEditing(true)}
                        onUpdated={(data) => setPg({ ...pg, ...data })}
                    />
                ) : (
                    <PGEditForm
                        pg={pg}
                        onCancel={() => setEditing(false)}
                        onUpdated={(updated) => {
                            setPg({ ...pg, ...updated });
                            setEditing(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}