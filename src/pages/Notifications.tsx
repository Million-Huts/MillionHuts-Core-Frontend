import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, MailOpen, Inbox } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    entityType?: string | null;
    entityId?: string | null;
    pgId?: string | null;
    createdAt: string;
    isRead?: boolean;
}

export default function Notifications() {
    const router = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get("/notifications");
            setNotifications(res.data.data || []);
        } catch {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleRedirect = (n: Notification) => {
        if (!n.entityType || !n.entityId) return;
        if (!n.isRead) markAsRead(n.id);

        const path = n.pgId
            ? `/pgs/${n.pgId}/complaints/${n.entityId}`
            : `/complaints/${n.entityId}`;
        router(path);
    };

    const markAsRead = async (id: string) => {
        try {
            await apiPrivate.patch(`notifications/${id}/read`);
            setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
        } catch { toast.error("Update failed"); }
    };

    const markAll = async () => {
        try {
            await apiPrivate.patch(`notifications/read-all`);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            toast.success("Inbox cleared");
        } catch { toast.error("Action failed"); }
    };

    const deleteNotification = async (id: string) => {
        try {
            await apiPrivate.delete(`notifications/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch {
            toast.error("Failed");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter">System Inbox</h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {notifications.filter(n => !n.isRead).length} Unread Notifications
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={markAll} className="rounded-sm font-bold gap-2">
                    <MailOpen className="w-3.5 h-3.5" /> Mark All Read
                </Button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading && <div className="text-center py-20 text-muted-foreground font-bold">Syncing inbox...</div>}

                {!loading && notifications.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-sm flex flex-col items-center">
                        <Inbox className="w-10 h-10 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-bold">No new activity</p>
                    </div>
                )}

                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`group relative border rounded-sm p-5 transition-all duration-300 ${!n.isRead
                            ? "bg-primary/5 border-primary/20 shadow-sm"
                            : "bg-card border-border hover:border-primary/20"
                            }`}
                    >
                        <div className="flex gap-4">
                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-primary shadow-[0_0_8px] shadow-primary' : 'bg-border'}`} />

                            <div className="flex-1 cursor-pointer" onClick={() => handleRedirect(n)}>
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <h3 className="font-black text-sm tracking-tight">{n.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {/* Hover Actions */}
                            <div className="transition-opacity flex gap-1">
                                {!n.isRead && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => markAsRead(n.id)}>
                                        <Check className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteNotification(n.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
}