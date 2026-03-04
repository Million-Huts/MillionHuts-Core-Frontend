import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { UserCard } from "@/components/users/UserCard";
import { AddUserModal } from "@/components/users/AddUserModal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function UsersPage() {
    const { pgId } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "", role: "STAFF" });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/users?page=${page}&limit=9`);
            setUsers(res.data.data);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!form.name || !form.phone) return toast.error("Required fields missing");
        try {
            await apiPrivate.post(`/pgs/${pgId}/users`, form);
            toast.success("Staff profile created");
            setOpen(false);
            setForm({ name: "", phone: "", email: "", role: "STAFF" });
            fetchUsers();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Creation failed");
        }
    };

    useEffect(() => { fetchUsers(); }, [page]);

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Users className="w-8 h-8 text-indigo-600" />
                            Staff Management
                        </h1>
                        <p className="text-slate-500 mt-1">Manage permissions and team members for this property.</p>
                    </div>

                    <Button onClick={() => setOpen(true)} className="gap-2 font-bold shadow-lg shadow-indigo-200">
                        <UserPlus className="w-4 h-4" />
                        Add New Staff
                    </Button>
                </div>

                <hr className="border-slate-200" />

                {/* Main Content Area */}
                {loading ? (
                    <div className="h-64 flex items-center justify-center relative">
                        <LoadingOverlay isLoading={true} message="Syncing Team..." />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {users.length === 0 ? (
                            <div className="bg-white border-2 border-dashed rounded-2xl p-12 text-center">
                                <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">No staff found</h3>
                                <p className="text-slate-500">Get started by adding your first manager or staff member.</p>
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
                                    <div className="flex justify-center items-center gap-4 pt-8">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm font-bold text-slate-600">
                                            {page} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
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