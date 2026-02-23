import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, FilterX, CheckCircle2 } from "lucide-react";

import { apiPrivate } from "@/lib/api";
import { usePG } from "@/context/PGContext";
import type { Complaint, ComplaintStats } from "@/interfaces/complaints";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

import ComplaintStatCards from "@/components/complaint/ComplaintStatCards";
import ComplaintTableRow from "@/components/complaint/ComplaintTableRow";
import AssignModal from "@/components/complaint/AssignModal";
import CreateComplaintModal from "@/components/complaint/CreateComplaintModal";
import type { UserType } from "@/interfaces/user";

export default function ComplaintsPage() {
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [stats, setStats] = useState<ComplaintStats | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [priority, setPriority] = useState("ALL");

    const [assignTarget, setAssignTarget] = useState<Complaint | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchData = async () => {
        if (!pgId) return;
        try {
            setLoading(true);
            const [compRes, statsRes, userRes] = await Promise.all([
                apiPrivate.get(`/pgs/${pgId}/complaints`, {
                    params: {
                        page,
                        search,
                        status: status === "ALL" ? "" : status,
                        priority: priority === "ALL" ? "" : priority
                    },
                }),
                apiPrivate.get(`/pgs/${pgId}/complaints/stats`),
                apiPrivate.get(`/pgs/${pgId}/users`)
            ]);

            setComplaints(compRes.data.data || []);
            setStats(statsRes.data);
            setUsers(userRes.data.data || []);
        } catch (err) {
            toast.error("Error refreshing dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [page, status, priority, pgId]);

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Complaints Desk</h1>
                    <p className="text-slate-500">Track and resolve tenant issues across your property.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-md">
                    <Plus className="w-4 h-4" /> Log New Issue
                </Button>
            </div>

            {/* Dynamic Stats Cards */}
            {stats && <ComplaintStatCards stats={stats} />}

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Tabs value={status} onValueChange={setStatus} className="w-full lg:w-auto">
                        <TabsList className="bg-slate-100/80">
                            <TabsTrigger value="ALL">All Issues</TabsTrigger>
                            <TabsTrigger value="OPEN">Open</TabsTrigger>
                            <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
                            <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-3 flex-1 lg:flex-none">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by title..."
                                className="pl-9 bg-slate-50 border-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => { setSearch(""); setStatus("ALL"); setPriority("ALL") }}>
                            <FilterX className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Complaints Table */}
            <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative ${loading ? "min-h-[50vh]" : ""}`}>
                <LoadingOverlay isLoading={loading} message="Fetching Tickets..." />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b text-slate-500 font-medium uppercase text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4">Ticket Details</th>
                                <th className="p-4 text-center">Priority</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Assigned To</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {complaints.map((c) => (
                                <ComplaintTableRow
                                    key={c.id}
                                    complaint={c}
                                    onAssign={() => setAssignTarget(c)}
                                    onClick={() => navigate(`/pgs/${pgId}/complaints/${c.id}`)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {!complaints.length && !loading && (
                    <div className="p-20 text-center space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-slate-500 font-medium">All clear! No complaints found.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Showing page {page}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)}>Next Page</Button>
                </div>
            </div>

            {/* Modals */}
            <AssignModal
                isOpen={!!assignTarget}
                users={users}
                onClose={() => setAssignTarget(null)}
                onAssign={async (userId) => {
                    await apiPrivate.patch(`/pgs/${pgId}/complaints/${assignTarget?.id}/assign`, { assignedToId: userId, assignedToType: "STAFF" });
                    setAssignTarget(null);
                    fetchData();
                }}
            />

            <CreateComplaintModal
                isOpen={isCreateOpen}
                pgId={pgId!}
                onClose={() => setIsCreateOpen(false)}
                onCreated={fetchData}
            />
        </div>
    );
}