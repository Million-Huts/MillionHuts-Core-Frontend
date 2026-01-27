// components/Common/AppSidebar.tsx
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
    // BarChartBig,
    // CreditCard,
    // Bell,
    // Boxes,
    // Wallet,
    // UserCog,
    // Utensils,
    // FileBarChart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const navItems = [
    { label: "Home", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Properties", icon: Building2, to: "/pgs" },
    { label: "Floors", icon: Warehouse, to: "/floors" },
    { label: "Rooms", icon: BedDouble, to: "/rooms" },
    { label: "Tenants", icon: Users, to: "/tenants" },
    // { label: "Payments", icon: CreditCard, to: "/payments" },
    // { label: "Assets", icon: Boxes, to: "/assets" },
    // { label: "Expenses", icon: Wallet, to: "/expenses" },
    // { label: "Staff", icon: UserCog, to: "/staff" },
    // { label: "Mess", icon: Utensils, to: "/mess" },
    // { label: "Reports", icon: FileBarChart, to: "/reports" },
    // { label: "Notifications", icon: Bell, to: "/notifications" },
];

const bottomNav = [
    { label: "Settings", icon: Settings, to: "/settings" },
    { label: "Profile", icon: User, to: "/profile" },

]

export default function AppSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (val: boolean) => void; }) {
    const { logout } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { pgs, currentPG, switchPG } = usePG();
    // const [mobileOpen, setMobileOpen] = useState(false);

    // const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


    useEffect(() => {
        const update = () => {
            setMobileOpen(false);
        };

        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const renderNav = () => (
        <nav className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="flex flex-col h-full justify-between">
                <div>
                    {navItems.map(({ label, icon: Icon, to }) => (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "flex items-center mb-1 gap-3 rounded-md p-3 text-sm font-medium transition-colors",
                                location.pathname === to ? "bg-blue-700 text-white hover:bg-blue-800" : "hover:bg-muted hover:text-foreground",
                                collapsed && "justify-center px-2"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    ))}
                </div>
                <div>
                    {bottomNav.map(({ label, icon: Icon, to }) => (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "flex items-center gap-3 mb-1 rounded-md p-3 text-sm font-medium transition-colors",
                                location.pathname === to ? "bg-blue-700 text-white hover:bg-blue-800" : "hover:bg-muted hover:text-foreground",
                                collapsed && "justify-center px-2"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    ))}
                    <Button
                        className="w-full"
                        variant={"destructive"}
                        onClick={logout}
                    >
                        <LogOut />
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        </nav>
    );

    const topBar = (
        <>
            <div className={cn("flex items-center justify-between px-4 py-3 border-b", collapsed && "justify-center")}>
                <div className="w-full flex items-center justify-between">
                    <h2 className={`text-lg font-semibold ${collapsed ? 'hidden' : 'block'}`}>MillionHuts</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden md:flex items-center justify-center"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <ChevronLeft className={cn("w-4 h-4 transform transition-transform", collapsed && "rotate-180")} />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
            {
                !collapsed && (
                    <div className="w-full p-4">
                        <Select value={currentPG?.id} onValueChange={(val) => switchPG(val)}>
                            <SelectTrigger className="w-full h-8 cursor-pointer">
                                <SelectValue placeholder="Select PG" />
                            </SelectTrigger>
                            <SelectContent>
                                {pgs.length > 0 && pgs.map((pg) => (
                                    <SelectItem value={pg.id} key={pg.id}>{pg.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            }
        </>

    );

    const sidebarContent = (
        <div
            className={cn(
                "flex h-full flex-col bg-background border-r shrink-0 transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {topBar}
            {renderNav()}
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden md:flex h-screen">{sidebarContent}</div>

            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50 transition-all duration-200" onClick={() => setMobileOpen(false)}>
                    <div
                        className="w-64 h-full bg-background border-r shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {topBar}
                        {renderNav()}
                    </div>
                </div>
            )}
        </>
    );
}
