import { usePG } from "@/context/PGContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EmptyPG() {
    const { currentPG, loading } = usePG();

    // While loading, we return null to avoid a flash of "Empty" before data arrives
    if (loading) return null;

    if (!currentPG) {
        return (
            <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                >
                    {/* Visual Icon with Theme-Aware Background */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
                        <Building2 className="h-10 w-10" />
                    </div>

                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                        No Property Selected
                    </h2>
                    <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                        You haven't selected or created a property yet. Select an existing property from the sidebar or create a new one to start managing your floors, rooms, and tenants.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild size="lg" className="group shadow-lg shadow-primary/20">
                            <Link to="/pgs">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Property
                                <ArrowRight className="ml-2 h-0 w-0 transition-all group-hover:ml-3 group-hover:w-4" />
                            </Link>
                        </Button>

                        <Button variant="outline" asChild size="lg" className="border-border">
                            <Link to="/dashboard">
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}