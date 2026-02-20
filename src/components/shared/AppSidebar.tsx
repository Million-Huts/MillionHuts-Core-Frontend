import {
    Building2,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    LayoutDashboard,
    BedDouble,
    User,
    X,
    Warehouse,
    Command,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePG } from "@/context/PGContext";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

export default function AppSidebar({ mobileOpen, setMobileOpen }: Props) {
    const location = useLocation();
    const { logout } = useAuth();
    const { pgs, currentPG, switchPG } = usePG();
    const [collapsed, setCollapsed] = useState(false);

    // Main functional navigation
    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, to: `/dashboard` },
        { label: "Properties", icon: Building2, to: `/pgs` },
        { label: "Floors", icon: Warehouse, to: `/pgs/${currentPG?.id}/floors` },
        { label: "Rooms", icon: BedDouble, to: `/pgs/${currentPG?.id}/rooms` },
        { label: "Tenants", icon: Users, to: `/pgs/${currentPG?.id}/tenants` },
    ];

    // System/User navigation
    const bottomNav = [
        { label: "Profile", icon: User, to: "/profile" },
        { label: "Settings", icon: Settings, to: "/settings" },
    ];

    // Automatically close mobile sidebar on window resize
    useEffect(() => {
        const update = () => setMobileOpen(false);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [setMobileOpen]);

    /**
     * Reusable Nav Link Component with Framer Motion logic
     */
    const NavLink = ({ item, isBottom = false }: { item: any, isBottom?: boolean }) => {
        const active = isBottom
            ? location.pathname.endsWith(item.to)
            : location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.endsWith(item.to));

        return (
            <Link
                to={item.to}
                className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                    active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2"
                )}
            >
                <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-white" : "group-hover:scale-110 transition-transform")} />

                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="truncate"
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                    <div className="absolute left-14 hidden group-hover:block z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap">
                        {item.label}
                    </div>
                )}
            </Link>
        );
    };

    const sidebarVariants = {
        expanded: { width: "260px" },
        collapsed: { width: "80px" }
    };

    const sidebarContent = (
        <motion.div
            initial={false}
            animate={collapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-colors"
        >
            {/* BRAND SECTION */}
            <div className="flex h-16 items-center px-4 mb-2">
                <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Command className="h-5 w-5" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-lg font-bold tracking-tight text-sidebar-foreground truncate"
                        >
                            MillionHuts
                        </motion.span>
                    )}
                </div>
            </div>

            {/* PG SELECTOR - Styled as a command box */}
            <div className="px-3 mb-6">
                {!collapsed ? (
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">Active Property</label>
                        <Select value={currentPG?.id} onValueChange={switchPG}>
                            <SelectTrigger className="h-10 w-full bg-sidebar-accent/50 border-sidebar-border hover:bg-sidebar-accent transition-colors">
                                <SelectValue placeholder="Select PG" />
                            </SelectTrigger>
                            <SelectContent>
                                {pgs.map((pg) => (
                                    <SelectItem key={pg.id} value={pg.id}>{pg.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="flex justify-center h-10 items-center text-primary">
                        <Building2 className="h-5 w-5 opacity-50" />
                    </div>
                )}
            </div>

            {/* MAIN NAVIGATION */}
            <nav className="flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {!collapsed && <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Management</p>}
                    {navItems.map((item) => (
                        <NavLink key={item.to} item={item} />
                    ))}
                </div>
            </nav>

            {/* BOTTOM SECTION */}
            <div className="mt-auto border-t border-sidebar-border p-3 space-y-1">
                {bottomNav.map((item) => (
                    <NavLink key={item.to} item={item} isBottom />
                ))}

                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </Button>

                {/* COLLAPSE TOGGLE - Desktop only */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-primary shadow-sm transition-transform active:scale-90"
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-screen sticky top-0">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar - Handled by the Mobile Overlay in ProtectedLayout.tsx */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r transform transition-transform duration-300 ease-in-out md:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-between px-6 border-b">
                    <span className="font-bold text-lg">MillionHuts</span>
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex flex-col h-[calc(100%-64px)] p-4">
                    {/* Simplified mobile nav rendering */}
                    <div className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                                <item.icon className="h-5 w-5" /> {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t pt-4 space-y-2">
                        {bottomNav.map((item) => (
                            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                                <item.icon className="h-5 w-5" /> {item.label}
                            </Link>
                        ))}
                        <Button variant="destructive" className="w-full justify-start gap-3" onClick={logout}>
                            <LogOut className="h-5 w-5" /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}