import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, FilterX, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

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
import type { PGUser } from "@/interfaces/pgUsers";

export default function ComplaintsPage() {
    const { currentPG } = usePG();
    const pgId = currentPG?.id;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [stats, setStats] = useState<ComplaintStats | null>(null);
    const [users, setUsers] = useState<PGUser[]>([]);
    const [loading, setLoading] = useState(false);

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
        } catch {
            toast.error("Error refreshing dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [page, status, priority, pgId]);
    useEffect(() => {
        if (searchParams.get("create") === "true") setIsCreateOpen(true);
    }, [searchParams]);

    return (
        <div className="p-2 md:p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            <LoadingOverlay isLoading={loading} message="Fetching Tickets..." />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Complaints Desk</h1>
                    <p className="text-muted-foreground font-medium mt-1">Track and resolve tenant issues across your property.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="rounded-sm gap-2 px-6 font-black shadow-lg">
                    <Plus className="w-5 h-5" /> Log New Issue
                </Button>
            </div>

            {/* Dynamic Stats Cards */}
            {stats && <ComplaintStatCards stats={stats} />}

            {/* Filter Section */}
            <div className="bg-muted/30 p-2 rounded-sm flex flex-wrap items-center justify-between gap-4">
                <Tabs value={status} onValueChange={setStatus} className="w-full lg:w-auto">
                    <TabsList className="bg-transparent gap-1">
                        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((val) => (
                            <TabsTrigger key={val} value={val} className="rounded-sm px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm uppercase text-[10px] tracking-widest">
                                {val.replace('_', ' ')}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3 px-2 flex-1 lg:flex-none">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tickets..."
                            className="pl-11 rounded-sm bg-background border-none shadow-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={() => { setSearch(""); setStatus("ALL"); setPriority("ALL") }}>
                        <FilterX className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Complaints Table Container */}
            <div className="bg-card rounded-sm border shadow-sm overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30 border-b">
                            <tr>
                                <th className="p-6 text-left font-black tracking-widest text-[10px] uppercase">Ticket Details</th>
                                <th className="p-6 text-center font-black tracking-widest text-[10px] uppercase">Priority</th>
                                <th className="p-6 text-center font-black tracking-widest text-[10px] uppercase">Status</th>
                                <th className="p-6 text-left font-black tracking-widest text-[10px] uppercase">Assigned To</th>
                                <th className="p-6 text-right font-black tracking-widest text-[10px] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
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
                    <div className="py-24 text-center space-y-4">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tight">All Clear!</p>
                            <p className="text-muted-foreground font-medium">No complaints found matching your filters.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page {page}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-sm px-4 font-bold" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-sm px-4 font-bold" onClick={() => setPage(p => p + 1)}>
                        Next Page <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <AssignModal
                isOpen={!!assignTarget}
                users={users}
                onClose={() => setAssignTarget(null)}
                onAssign={async (userId) => {
                    try {
                        await apiPrivate.patch(`/pgs/${pgId}/complaints/${assignTarget?.id}/assign`, {
                            assignedToId: userId,
                            assignedToType: "STAFF"
                        });
                        setAssignTarget(null);
                        fetchData();
                    } catch { toast.error("Failed to assign ticket"); }
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