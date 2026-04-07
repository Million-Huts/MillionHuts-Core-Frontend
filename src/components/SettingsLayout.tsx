import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePG } from "@/context/PGContext";

export default function SettingsLayout() {
    const { pathname } = useLocation();
    const { currentPG } = usePG();

    // The root path of settings. Adjust this if your route is different (e.g., /account/settings)
    const isMenuLevel = pathname === `/pgs/${currentPG?.id}/settings` || pathname === `/pgs/${currentPG?.id}/settings`;

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-background">
            {/* NAVIGATION SIDEBAR */}
            <aside
                className={cn(
                    "md:flex flex-col w-full md:w-72 border-r border-border/60 bg-card/40 backdrop-blur-sm sticky top-0 h-auto md:h-screen",
                    isMenuLevel ? 'flex' : 'hidden'
                )}
            >
                <div className="p-6 md:p-8">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Settings</h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Manage your account & PGs</p>
                </div>
                <SettingsSidebar />
            </aside>

            {/* CONTENT AREA */}
            <main className={cn(
                "flex-1 md:block relative",
                !isMenuLevel ? 'block' : 'hidden'
            )}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {/* Mobile Header */}
                        {!isMenuLevel && (
                            <div className="md:hidden flex items-center px-4 py-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
                                <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2 font-bold text-primary">
                                    <Link to={`/pgs/${currentPG?.id}/settings`}>
                                        <ChevronLeft className="h-4 w-4" />
                                        Back to Menu
                                    </Link>
                                </Button>
                            </div>
                        )}

                        <div className="p-6 md:p-12 max-w-4xl">
                            <Outlet />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}