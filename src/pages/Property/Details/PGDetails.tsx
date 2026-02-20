import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";

import DetailsView from "@/components/property/details/DetailsView";
import DetailsForm from "@/components/property/details/DetailsForm";
import type { Details } from "@/interfaces/pg";

export default function PGDetails() {
    const { pgId } = useParams();
    const [details, setDetails] = useState<Details | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await apiPrivate.get(`/pgs/${pgId}/details`);
                setDetails(res.data.data.details);
            } catch {
                setDetails(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [pgId]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <AnimatePresence mode="wait">
                {!editing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        <DetailsView
                            details={details}
                            onEdit={() => setEditing(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                    >
                        <DetailsForm
                            details={details}
                            pgId={pgId!}
                            onCancel={() => setEditing(false)}
                            onUpdated={(data: Details) => {
                                setDetails((prev) => ({ ...prev, ...data } as Details));
                                setEditing(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}