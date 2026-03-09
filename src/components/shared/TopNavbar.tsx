import { useEffect, useState, useCallback } from "react";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import {
    Bell,
    Megaphone,
    Menu,
    ChevronRight,
    Circle,
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
import ThemeSwitcher from "../ui/ThemeSwitcher";
import { LoadingOverlay } from "../ui/LoadingOverlay";

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

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get("/notifications");
            setNotifications(res.data.data || res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewNotification = useCallback((newNotif: Notification) => {
        setNotifications((prev) => [newNotif, ...prev]);
        toast.success(newNotif.title, {
            icon: '🔔',
            style: { borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
        });
    }, []);

    useNotificationsSocket(handleNewNotification);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotifClick = async (n: Notification) => {
        if (!n.isRead) {
            try {
                await apiPrivate.patch(`notifications/${n.id}/read`);
                setNotifications(prev =>
                    prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
                );
            } catch (err) { console.error(err); }
        }

        if (n.entityType === "COMPLAINT" && n.entityId) {
            const url = n.pgId
                ? `/pgs/${n.pgId}/complaints/${n.entityId}`
                : `/complaints/${n.entityId}`;
            navigate(url);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const activeMeta = pageMetaConfig.find(route =>
        matchPath({ path: route.pattern, end: true }, location.pathname)
    ) || { title: "MillionHuts" };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6 transition-colors duration-500">
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
                    <h1 className="text-sm font-bold leading-none tracking-tight uppercase text-foreground">
                        {activeMeta.title}
                    </h1>
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Megaphone className="h-5 w-5" />
                </Button>

                <ThemeSwitcher />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border rounded-2xl overflow-hidden bg-popover">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                            <DropdownMenuLabel className="p-0 font-bold text-foreground">Notifications</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-primary-foreground bg-primary px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[380px] overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="relative">
                                    <LoadingOverlay isLoading={loading} message="Loading notifications..." />
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
                                            "flex flex-col items-start gap-1 p-4 cursor-pointer border-b border-border last:border-0 transition-colors",
                                            !notif.isRead ? "bg-accent/30 hover:bg-accent/60" : "hover:bg-accent/20"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {!notif.isRead && <Circle className="h-2 w-2 fill-primary text-primary" />}
                                                <span className="text-sm font-bold text-foreground">
                                                    {notif.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>

                        <Link
                            to={`/pgs/${currentPG?.id}/notifications`}
                            className="block p-4 text-center text-xs font-bold text-primary hover:bg-accent/50 transition-colors border-t border-border uppercase tracking-widest"
                        >
                            View All Activity
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="md:hidden border-l border-border pl-3 flex flex-col items-end">
                    <span className="text-xs font-black uppercase truncate max-w-[80px] text-foreground">{activeMeta.title}</span>
                    <span className="text-[9px] text-muted-foreground font-bold truncate max-w-[80px]">{currentPG?.name || 'MH'}</span>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;