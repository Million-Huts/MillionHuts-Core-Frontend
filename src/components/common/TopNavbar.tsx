import {
    Bell,
    Megaphone,
    Menu,
    ChevronRight,
    Circle,
    ArrowRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { matchPath, useLocation, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePG } from "@/context/PGContext";

/* =====================================================
    Page Metadata Configuration
===================================================== */

const pageMetaConfig = [
    { pattern: "/dashboard", title: "Dashboard", desc: "Overview of your PG system" },
    { pattern: "/profile", title: "User Profile", desc: "Manage your personal information" },
    { pattern: "/pgs", title: "Properties", desc: "Manage your PG portfolio" },
    // Nested PG Routes
    { pattern: "/pgs/:pgId/floors", title: "Floors", desc: "Level-wise management" },
    { pattern: "/pgs/:pgId/floors/:floorId", title: "Floor Details", desc: "Detailed floor view" },
    { pattern: "/pgs/:pgId/rooms", title: "Rooms", desc: "Inventory and occupancy" },
    { pattern: "/pgs/:pgId/rooms/:roomId", title: "Room Details", desc: "Maintenance and tenant allocation" },
    { pattern: "/pgs/:pgId/tenants", title: "Tenants", desc: "Active and past residents" },
    { pattern: "/pgs/:pgId/tenants/:tenantId", title: "Tenant Details", desc: "Rent history and documents" },
    // Property Settings Tabs (basic, details, etc)
    { pattern: "/pgs/:pgId/:tab", title: "Property Settings", desc: "Update property configurations" },
];

/* =====================================================
    Dummy Notification Data
===================================================== */

const DUMMY_NOTIFICATIONS = [
    {
        id: "1",
        title: "New Booking",
        message: "Rahul Sharma booked Room 204 in Sunrise PG",
        feature: "room",
        refId: "room-204",
        time: "2 mins ago",
        unread: true,
    },
    {
        id: "2",
        title: "Rent Overdue",
        message: "Amit Kumar's rent is overdue by 3 days.",
        feature: "tenant",
        refId: "tenant-001",
        time: "1 hour ago",
        unread: true,
    },
    {
        id: "3",
        title: "Maintenance",
        message: "AC repair requested for Floor 2.",
        feature: "floor",
        refId: "floor-2",
        time: "5 hours ago",
        unread: false,
    }
];

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const TopNavbar = ({ mobileOpen, setMobileOpen }: Props) => {
    const location = useLocation();
    const { currentPG } = usePG();

    /**
     * Resolve Metadata based on current path
     */
    const activeMeta = pageMetaConfig.find(route =>
        matchPath({ path: route.pattern, end: true }, location.pathname)
    ) || { title: "MillionHuts", desc: "Property Management" };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">

            {/* LEFT: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden flex-col md:flex">
                    {/* Dynamic Breadcrumb-style title */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-0.5">
                        <span className="hover:text-foreground cursor-default transition-colors">MillionHuts</span>
                        {currentPG && (
                            <>
                                <ChevronRight className="h-3 w-3" />
                                <span className="font-medium text-primary/80">{currentPG.name}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-lg font-bold leading-none tracking-tight">
                        {activeMeta.title}
                    </h1>
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* Announcement Button */}
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Megaphone className="h-5 w-5" />
                </Button>

                {/* Notifications Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            {DUMMY_NOTIFICATIONS.some(n => n.unread) && (
                                <span className="absolute right-2 top-2 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-sidebar-border">
                        <div className="flex items-center justify-between p-4 border-b">
                            <DropdownMenuLabel className="p-0 font-bold">Notifications</DropdownMenuLabel>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {DUMMY_NOTIFICATIONS.filter(n => n.unread).length} New
                            </span>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto">
                            {DUMMY_NOTIFICATIONS.map((notif) => (
                                <DropdownMenuItem
                                    key={notif.id}
                                    className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-accent border-b border-sidebar-border last:border-0"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {notif.unread && <Circle className="h-2 w-2 fill-primary text-primary" />}
                                            <span className={cn("text-sm font-semibold", notif.unread ? "text-foreground" : "text-muted-foreground")}>
                                                {notif.title}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {notif.message}
                                    </p>

                                    {/* Action Link for the specific feature */}
                                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-tight">
                                        View {notif.feature} <ArrowRight className="h-3 w-3" />
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <Link to="/notifications" className="block p-3 text-center text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-t">
                            View All Notifications
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Page Info (Condensed) */}
                <div className="md:hidden border-l pl-4 flex flex-col items-end">
                    <span className="text-sm font-bold truncate max-w-[100px]">{activeMeta.title}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{currentPG?.name || 'No PG'}</span>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;