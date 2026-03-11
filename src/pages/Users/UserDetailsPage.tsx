import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trash2, Clock, ShieldCheck } from "lucide-react";
import ConfirmDeleteModal from "@/components/shared/ConfirmDeleteModal";
import { UserProfileHeader } from "@/components/users/details/UserProfileHeader";
import { PermissionControl } from "@/components/users/details/PermissionControl";
import type { PGUser } from "@/interfaces/pgUsers";

export default function UserDetailsPage() {
    const { pgId, userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [targetUser, setTargetUser] = useState<PGUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/users/${userId}`);
            setTargetUser(res.data.data);
        } catch {
            toast.error("Failed to sync profile");
            navigate(`/pgs/${pgId}/users`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, [userId]);

    const isSelf = currentUser?.id === userId;
    const isTargetOwner = targetUser?.role === "OWNER";
    const iAmManager = currentUser?.role === "ADMIN";
    const cannotModify = isSelf || (iAmManager && isTargetOwner);
    const lockReason = isSelf ? "Self-modification prohibited." : "Insufficient clearance.";

    const handleUpdate = async (payload: any) => {
        try {
            await apiPrivate.patch(`/pgs/${pgId}/users/${userId}`, payload);
            toast.success("Registry updated");
            fetchUser();
        } catch { toast.error("Update rejected"); }
    };

    const handleDelete = async () => {
        try {
            await apiPrivate.delete(`/pgs/${pgId}/users/${userId}`);
            toast.success("Staff profile purged");
            navigate(`/pgs/${pgId}/users`);
        } catch { toast.error("Action failed"); }
    };

    if (loading) return <div className="p-12 text-center text-muted-foreground font-black uppercase tracking-widest text-[10px]">Synchronizing...</div>;
    if (!targetUser) return null;

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground font-bold hover:text-foreground">
                <ArrowLeft size={14} /> Back to Registry
            </Button>

            <UserProfileHeader user={targetUser.user} pgRole={targetUser.role} />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Permissions & Logs */}
                <div className="lg:col-span-2 space-y-6">
                    <PermissionControl
                        currentRole={targetUser.role}
                        isActive={targetUser.isActive}
                        isDisabled={cannotModify}
                        reason={lockReason}
                        onRoleChange={(role: string) => handleUpdate({ role })}
                        onToggleStatus={() => handleUpdate({ isActive: !targetUser.isActive })}
                    />

                    <Card className="rounded-sm border-border overflow-hidden">
                        <CardContent className="p-6">
                            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-widest text-muted-foreground">
                                <Clock size={16} /> Audit Trail
                            </h3>
                            <div className="text-sm space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-muted-foreground font-medium">Added to Property</span>
                                    <span className="font-black">{new Date(targetUser.user.createdAt!).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground font-medium">Last Known Activity</span>
                                    <span className="font-black">{targetUser.user.lastLoginAt ? new Date(targetUser.user.lastLoginAt).toLocaleString() : "NEVER"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Danger Zone */}
                <div className="space-y-6">
                    <Card className="p-6 rounded-sm border-rose-200 bg-card">
                        <div className="flex items-center gap-2 text-rose-600 mb-4">
                            <ShieldCheck size={18} />
                            <h3 className="font-black uppercase tracking-widest text-xs">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-rose-500/80 mb-6 leading-relaxed font-medium">
                            Revoking this user's access is final. All active ticket assignments and permissions will be terminated immediately.
                        </p>
                        <Button
                            variant="destructive"
                            className="w-full rounded-sm font-black uppercase tracking-widest text-[10px]"
                            disabled={cannotModify}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 size={14} className="mr-2" /> Purge Access
                        </Button>
                    </Card>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                title="Purge Staff Access?"
                description={`Are you sure you want to revoke ${targetUser.user.name}'s access? This action cannot be reversed.`}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}