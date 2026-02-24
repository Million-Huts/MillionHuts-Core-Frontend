import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import PGGrid from "@/components/property/Home/PGGrid";
import EmptyState from "@/components/property/Home/EmptyState";
import CreatePGModal from "@/components/property/Home/CreatePGModal";

import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import type { PG } from "@/interfaces/pg";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function Properties() {
    const { setPGs } = usePG();
    const [pgs, setLocalPGs] = useState<PG[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await apiPrivate.get("/pgs");
                const list: PG[] = res.data.data.pgs || [];
                setLocalPGs(list);
                setPGs(list.map((pg) => ({ id: pg.id, name: pg.name })));
            } finally {
                setLoading(false);
            }
        };
        fetchPGs();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header Section */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Properties</h1>
                    <p className="text-muted-foreground">Manage and monitor your PG establishments</p>
                </div>

                <Button
                    onClick={() => setOpenCreate(true)}
                    className="shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                </Button>
            </header>

            <Separator className="bg-border/60" />

            {/* Content Section */}
            <main className="min-h-[400px] relative">
                <LoadingOverlay isLoading={loading} message="Loading Properties..." />
                <AnimatePresence mode="wait">
                    {pgs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EmptyState onCreate={() => setOpenCreate(true)} />
                        </motion.div>
                    ) : (
                        <PGGrid pgs={pgs} />
                    )}
                </AnimatePresence>
            </main>

            <CreatePGModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(pg) => setLocalPGs((prev) => [...prev, pg])}
            />
        </div>
    );
}