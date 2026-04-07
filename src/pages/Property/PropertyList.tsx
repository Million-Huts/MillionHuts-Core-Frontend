import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2 } from "lucide-react";
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
            setLoading(true);
            try {
                const res = await apiPrivate.get("/pgs");
                const list: PG[] = res.data.data.pgs || []; // Fixed key from pgsk to pgs
                setLocalPGs(list);
                // Keep global context in sync
                setPGs(list.map((pg) => ({ id: pg.id, name: pg.name, role: pg.role, staffType: pg.staffType })));
            } catch (err) {
                console.error("Failed to fetch properties", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPGs();
    }, []);

    return (
        <div className="relative min-h-screen bg-background/50">
            {/* Subtle background glow for Midnight/Nord themes */}
            <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto p-2 md:p-8 space-y-10 relative z-10">
                {/* Header Section */}
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Building2 className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Management</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Properties
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-md leading-relaxed">
                            Centralized overview of your PG establishments. Manage rooms, floors, and tenant operations.
                        </p>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => setOpenCreate(true)}
                        className="rounded-sm px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                        Add New Property
                    </Button>
                </header>

                <Separator className="bg-border/40" />

                {/* Content Section */}
                <main className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-[400px] items-center justify-center"
                            >
                                <LoadingOverlay isLoading={true} message="Syncing establishments..." />
                            </motion.div>
                        ) : pgs.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex justify-center pt-12"
                            >
                                <EmptyState onCreate={() => setOpenCreate(true)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <PGGrid pgs={pgs} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <CreatePGModal
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onCreated={(pg) => setLocalPGs((prev) => [...prev, pg])}
                />
            </div>
        </div>
    );
}