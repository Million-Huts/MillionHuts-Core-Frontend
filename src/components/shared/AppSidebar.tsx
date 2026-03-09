import {
    Building2, Users, Settings, LogOut, ChevronLeft, LayoutDashboard,
    BedDouble, User, X, Warehouse, Command, MessageSquareWarning,
    Wallet, Bell, UserLock
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePG } from "@/context/PGContext";
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
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

    // activePattern: matches sub-routes (e.g., floors matches floors/123)
    const generalNav = [
        { label: "Dashboard", icon: LayoutDashboard, to: `/dashboard`, activePattern: "/dashboard" },
        { label: "Properties", icon: Building2, to: `/pgs`, activePattern: "/pgs", exact: true },
    ];

    const pgDependentNav = [
        { label: "Floors", icon: Warehouse, to: `/pgs/${currentPG?.id}/floors`, activePattern: `/pgs/${currentPG?.id}/floors` },
        { label: "Rooms", icon: BedDouble, to: `/pgs/${currentPG?.id}/rooms`, activePattern: `/pgs/${currentPG?.id}/rooms` },
        { label: "Tenants", icon: Users, to: `/pgs/${currentPG?.id}/tenants`, activePattern: `/pgs/${currentPG?.id}/tenants` },
        { label: "Expense", icon: Wallet, to: `/pgs/${currentPG?.id}/expense`, activePattern: `/pgs/${currentPG?.id}/expense` },
        { label: "Complaints", icon: MessageSquareWarning, to: `/pgs/${currentPG?.id}/complaints`, activePattern: `/pgs/${currentPG?.id}/complaints` },
        { label: "Notifications", icon: Bell, to: `/pgs/${currentPG?.id}/notifications`, activePattern: `/pgs/${currentPG?.id}/notifications` },
        { label: "User Management", icon: UserLock, to: `/pgs/${currentPG?.id}/users`, activePattern: `/pgs/${currentPG?.id}/users` },
    ];

    const bottomNav = [
        { label: "Profile", icon: User, to: "/profile" },
        { label: "Settings", icon: Settings, to: "/settings" },
    ];

    const NavLink = ({ item }: { item: any }) => {
        // Robust active checking: exact match or starts with pattern
        const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.activePattern);

        return (
            <Link to={item.to} className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
            )}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
        );
    };

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex h-screen sticky top-0 bg-sidebar border-r border-sidebar-border w-[260px] transition-all duration-300" style={{ width: collapsed ? '80px' : '260px' }}>
                <div className="flex h-full flex-col w-full overflow-hidden">
                    <div className="flex h-16 items-center px-4 shrink-0">
                        <div className="flex items-center gap-3 w-full justify-center md:justify-start">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Command className="h-5 w-5" /></div>
                            {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">MillionHuts</span>}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4">
                        <nav className="space-y-1">{generalNav.map((i) => <NavLink key={i.to} item={i} />)}</nav>
                        <div className="space-y-1">
                            {!collapsed && <p className="px-3 text-[10px] font-bold uppercase text-muted-foreground mb-2">Active Property</p>}
                            {!collapsed && (
                                <Select value={currentPG?.id} onValueChange={switchPG}>
                                    <SelectTrigger className="w-full h-10 bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border hover:bg-sidebar-accent/80">
                                        <SelectValue placeholder="Select Property" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        {pgs.map((pg) => <SelectItem key={pg.id} value={pg.id}>{pg.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <nav className="space-y-1">{pgDependentNav.map((i) => <NavLink key={i.to} item={i} />)}</nav>
                    </div>

                    <div className="border-t border-sidebar-border p-3 space-y-1 shrink-0">
                        {bottomNav.map((i) => <NavLink key={i.to} item={i} />)}
                        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="h-5 w-5" /> {!collapsed && "Sign Out"}
                        </Button>
                    </div>

                    <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm z-10">
                        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                    </button>
                </div>
            </aside>

            {/* MOBILE SIDEBAR */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 md:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
                    <span className="font-bold text-sidebar-foreground">MillionHuts</span>
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {/* General & Dependent Navs */}
                        <div className="space-y-1">
                            {generalNav.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Property Selector */}
                        <div className="space-y-2 pt-4 border-t border-sidebar-border">
                            <p className="px-3 text-[10px] font-bold uppercase text-foreground">Switch Property</p>
                            <Select value={currentPG?.id} onValueChange={(val) => { switchPG(val); setMobileOpen(false); }}>
                                <SelectTrigger className="w-full bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                                    <SelectValue placeholder="Select Property" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {pgs.map((pg) => (
                                        <SelectItem key={pg.id} value={pg.id}>{pg.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            {pgDependentNav.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
                        {bottomNav.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                {item.label}
                            </Link>
                        ))}
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="h-5 w-5" /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}