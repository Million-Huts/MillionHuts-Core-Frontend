import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, ChevronLeft, ChevronRight, UserCircle2 } from "lucide-react";
import { UserCard } from "@/components/users/UserCard";
import { AddUserModal } from "@/components/users/AddUserModal";
import type { PGUser } from "@/interfaces/pgUsers";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function UsersPage() {
    const { pgId } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState<PGUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "", role: "STAFF", staffType: "" });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/users?page=${page}&limit=9`);
            setUsers(res.data.data);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch {
            toast.error("Failed to sync team data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!form.name || !form.phone) return toast.error("Required fields missing");
        try {
            await apiPrivate.post(`/pgs/${pgId}/users`, form);
            toast.success("Staff profile deployed");
            setOpen(false);
            setForm({ name: "", phone: "", email: "", role: "STAFF", staffType: "" });
            fetchUsers();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Deployment failed");
        }
    };

    useEffect(() => { fetchUsers(); }, [page]);

    return (
        // Changed to w-full to prevent layout conflicts with the parent shell
        <div className="w-full p-6 lg:p-10">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-4">
                            <div className="p-2.5 bg-foreground rounded-full">
                                <Users className="w-5 h-5 text-background" />
                            </div>
                            Team Registry
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium text-sm">
                            Configure property access and administrative privileges.
                        </p>
                    </div>

                    <Button onClick={() => setOpen(true)} className="h-11 px-6 gap-2 font-black uppercase tracking-widest text-[10px] rounded-sm shadow-lg">
                        <UserPlus className="w-4 h-4" /> Add New Staff
                    </Button>
                </div>

                {/* Main Content Area */}

                <div className={`space-y-8 relative ${loading ? 'min-h-[40vh]' : ''} `}>
                    <LoadingOverlay isLoading={loading} message="Synchronizing...." variant="block" />
                    {!loading && users.length === 0 ? (
                        <div className="border-2 border-dashed border-border rounded-sm p-16 text-center flex flex-col items-center bg-muted/20">
                            <UserCircle2 className="w-16 h-16 text-muted-foreground/30 mb-6" />
                            <h3 className="text-xl font-black">Registry Empty</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">No team members assigned to this property. Begin by adding your first staff member.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map((u) => (
                                    <UserCard
                                        key={u.user.id}
                                        user={u}
                                        onClick={() => navigate(`/pgs/${pgId}/users/${u.user.id}`)}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 pt-6">
                                    <Button variant="outline" size="sm" className="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="px-4 py-2 bg-muted rounded-sm text-[10px] font-black uppercase tracking-widest">
                                        Page {page} of {totalPages}
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <AddUserModal
                open={open}
                setOpen={setOpen}
                form={form}
                setForm={setForm}
                onSubmit={handleCreateUser}
            />
        </div>
    );
}