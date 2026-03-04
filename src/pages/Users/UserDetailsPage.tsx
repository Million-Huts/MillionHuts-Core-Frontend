import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Clock, AlertCircle } from "lucide-react";
import ConfirmDeleteModal from "@/components/shared/ConfirmDeleteModal";
import { UserProfileHeader } from "@/components/users/details/UserProfileHeader";
import { PermissionControl } from "@/components/users/details/PermissionControl";

export default function UserDetailsPage() {
    const { pgId, userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [targetUser, setTargetUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/users/${userId}`);
            setTargetUser(res.data.data);
        } catch {
            toast.error("Failed to fetch user");
            navigate(`/pgs/${pgId}/users`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, [userId]);

    // PREVENT SELF-MODIFICATION & HIERARCHY PROTECTION
    const isSelf = currentUser?.id === userId;
    const isTargetOwner = targetUser?.role === "OWNER";
    const iAmManager = currentUser?.role === "ADMIN"; // Assuming ADMIN maps to Manager in PG Context

    // Final check: You can't edit yourself, and managers can't edit owners
    const cannotModify = isSelf || (iAmManager && isTargetOwner);
    const lockReason = isSelf
        ? "You cannot modify your own permissions."
        : "You do not have seniority to modify an Owner.";

    const handleUpdate = async (payload: any) => {
        try {
            await apiPrivate.patch(`/pgs/${pgId}/users/${userId}`, payload);
            toast.success("Permissions updated");
            fetchUser();
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async () => {
        try {
            await apiPrivate.delete(`/pgs/${pgId}/users/${userId}`);
            toast.success("Staff removed successfully");
            navigate(`/pgs/${pgId}/users`);
        } catch {
            toast.error("Deletion failed");
        }
    };

    if (loading) return <div className="p-12 text-center">Loading Profile...</div>;
    if (!targetUser) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-500">
                <ArrowLeft size={16} /> Back
            </Button>

            <UserProfileHeader user={targetUser.user} pgRole={targetUser.role} />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <PermissionControl
                        currentRole={targetUser.role}
                        isActive={targetUser.isActive}
                        isDisabled={cannotModify}
                        reason={lockReason}
                        onRoleChange={(role: string) => handleUpdate({ role })}
                        onToggleStatus={() => handleUpdate({ isActive: !targetUser.isActive })}
                    />

                    <Card className="p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
                            <Clock size={18} className="text-slate-400" />
                            Activity Logs
                        </h3>
                        <div className="text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Added to Property</span>
                                <span className="font-medium text-slate-700">
                                    {new Date(targetUser.user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Last Login</span>
                                <span className="font-medium text-slate-700">
                                    {targetUser.user.lastLoginAt ? new Date(targetUser.user.lastLoginAt).toLocaleString() : "Never"}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 border-red-100 bg-red-50/30">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                            <AlertCircle size={18} />
                            <h3 className="font-bold">Danger Zone</h3>
                        </div>
                        <p className="text-xs text-red-600/80 mb-4 leading-relaxed">
                            Removing this user will immediately revoke their access to all property data and tickets.
                        </p>
                        <Button
                            variant="destructive"
                            className="w-full gap-2 shadow-lg shadow-red-200"
                            disabled={cannotModify}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 size={16} />
                            Remove from PG
                        </Button>
                    </Card>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                title="Remove Staff Member?"
                description={`This will revoke access for ${targetUser.user.name}. They will no longer be able to log into this PG.`}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}