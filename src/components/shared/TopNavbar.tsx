import { useEffect, useState, useCallback } from "react";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket"; // Adjust path as needed
import {
    Bell,
    Megaphone,
    Menu,
    ChevronRight,
    Circle,
    ArrowRight,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { matchPath, useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePG } from "@/context/PGContext";
import { apiPrivate } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

/* =====================================================
    Types & Metadata Configuration
===================================================== */
interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    entityType?: string;
    entityId?: string;
    pgId?: string;
    createdAt: string;
    isRead: boolean;
}

const pageMetaConfig = [
    { pattern: "/dashboard", title: "Dashboard" },
    { pattern: "/profile", title: "User Profile" },
    { pattern: "/pgs", title: "Properties" },
    { pattern: "/pgs/:pgId/floors", title: "Floors" },
    { pattern: "/pgs/:pgId/rooms", title: "Rooms" },
    { pattern: "/pgs/:pgId/tenants", title: "Tenants" },
    { pattern: "/complaints/:complaintId", title: "Complaint Details" },
    { pattern: "/notifications", title: "Notifications" },
];

interface Props {
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const TopNavbar = ({ mobileOpen, setMobileOpen }: Props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentPG } = usePG();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    /* =====================================================
        Notification Logic
    ===================================================== */
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get("/notifications");
            // API returns { data: [...] } based on your notifications page
            setNotifications(res.data.data || res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle New Incoming Socket Notifications
    const handleNewNotification = useCallback((newNotif: Notification) => {
        setNotifications((prev) => [newNotif, ...prev]);

        // Optional: Show a small popup toast when a notification arrives
        toast.success(newNotif.title, {
            icon: '🔔',
            style: { borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
        });
    }, []);

    // Initialize Socket Hook
    useNotificationsSocket(handleNewNotification);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotifClick = async (n: Notification) => {
        // 1. Mark as read in API
        if (!n.isRead) {
            try {
                await apiPrivate.patch(`notifications/${n.id}/read`);
                setNotifications(prev =>
                    prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
                );
            } catch (err) { console.error(err); }
        }

        // 2. Redirect based on type
        if (n.entityType === "COMPLAINT" && n.entityId) {
            const url = n.pgId
                ? `/pgs/${n.pgId}/complaints/${n.entityId}`
                : `/complaints/${n.entityId}`;
            navigate(url);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    /** Resolve Metadata based on current path */
    const activeMeta = pageMetaConfig.find(route =>
        matchPath({ path: route.pattern, end: true }, location.pathname)
    ) || { title: "MillionHuts" };

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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5 font-medium">
                        <span>MillionHuts</span>
                        {currentPG && (
                            <>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-primary/80">{currentPG.name}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-sm font-bold leading-none tracking-tight uppercase">
                        {activeMeta.title}
                    </h1>
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 md:gap-4">

                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Megaphone className="h-5 w-5" />
                </Button>

                {/* Notifications Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-slate-200 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
                            <DropdownMenuLabel className="p-0 font-bold">Notifications</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-rose-500 px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[380px] overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="p-10 flex flex-col items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-xs font-medium">Loading...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-10 text-center text-xs text-muted-foreground font-medium">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((notif) => (
                                    <DropdownMenuItem
                                        key={notif.id}
                                        onClick={() => handleNotifClick(notif)}
                                        className={cn(
                                            "flex flex-col items-start gap-1 p-4 cursor-pointer border-b last:border-0 transition-colors",
                                            !notif.isRead ? "bg-indigo-50/30 hover:bg-indigo-50/60" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {!notif.isRead && <Circle className="h-2 w-2 fill-indigo-600 text-indigo-600" />}
                                                <span className={cn("text-sm font-bold", !notif.isRead ? "text-slate-900" : "text-slate-600")}>
                                                    {notif.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>

                                        {notif.entityType && (
                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                                View {notif.entityType.toLowerCase()} <ArrowRight className="h-3 w-3" />
                                            </div>
                                        )}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>

                        <Link
                            to={`/pgs/${currentPG?.id}/notifications`}
                            className="block p-4 text-center text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors border-t uppercase tracking-widest"
                        >
                            View All Activity
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Page Info */}
                <div className="md:hidden border-l pl-3 flex flex-col items-end">
                    <span className="text-xs font-black uppercase truncate max-w-[80px]">{activeMeta.title}</span>
                    <span className="text-[9px] text-muted-foreground font-bold truncate max-w-[80px]">{currentPG?.name || 'MH'}</span>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;