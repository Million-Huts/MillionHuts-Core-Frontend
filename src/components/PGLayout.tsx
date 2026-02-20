// pages/Property/PGLayout.tsx
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PGSidebar from "@/components/property/PGSidebar";
import { Button } from "@/components/ui/button";

export default function PGLayout() {
    const { pgId } = useParams();
    const { pathname } = useLocation();

    // Check if we are at the root /pgs/:id to decide what to show on mobile
    const isMenuLevel = pathname === `/pgs/${pgId}` || pathname === `/pgs/${pgId}/`;

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-background">
            {/* SIDEBAR / MENU NAVIGATION
                On Mobile: Hidden if viewing a sub-page
                On Desktop: Always visible as a sidebar
            */}
            <aside
                className={`${isMenuLevel ? 'flex' : 'hidden'
                    } md:flex flex-col w-full md:w-72 border-r border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 h-auto md:h-screen`}
            >
                <PGSidebar pgId={pgId!} />
            </aside>

            {/* CONTENT AREA
                On Mobile: Hidden if at menu level (unless desktop)
            */}
            <main className={`flex-1 ${!isMenuLevel ? 'block' : 'hidden'} md:block relative`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full"
                    >
                        {/* Mobile Header: Only shows when inside a detail page */}
                        {!isMenuLevel && (
                            <div className="md:hidden flex items-center px-4 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
                                <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 text-primary">
                                    <Link to={`/pgs/${pgId}`}>
                                        <ChevronLeft className="h-4 w-4" />
                                        Back to Settings
                                    </Link>
                                </Button>
                            </div>
                        )}

                        <div className="p-4 md:p-8 max-w-5xl mx-auto">
                            <Outlet />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}