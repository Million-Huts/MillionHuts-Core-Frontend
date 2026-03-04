import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MessageSquare, History, ImageIcon, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { apiPrivate } from "@/lib/api";
import type { Complaint } from "@/interfaces/complaints";
import { Button } from "@/components/ui/button";

import ComplaintHeader from "@/components/complaint/details/ComplaintHeader";
import ComplaintSidebar from "@/components/complaint/details/ComplaintSidebar";
import ComplaintCommentSection from "@/components/complaint/details/ComplaintCommentSection";
import ComplaintActivityLog from "@/components/complaint/details/ComplaintActivityLog";
import ComplaintMediaGrid from "@/components/complaint/details/ComplaintMediaGrid";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import type { PGUser } from "@/interfaces/pgUsers";

export default function ComplaintDetailsPage() {
    const { pgId, complaintId } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [users, setUsers] = useState<PGUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [compRes, userRes] = await Promise.all([
                apiPrivate.get(`pgs/${pgId}/complaints/${complaintId}`),
                apiPrivate.get(`pgs/${pgId}/users`)
            ]);
            setComplaint(compRes.data);
            setUsers(userRes.data.data || []);
        } catch (err) {
            toast.error("Failed to load ticket details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [complaintId]);

    if (loading || !complaint) return (
        <div className="relative h-screen">
            <LoadingOverlay isLoading={loading} message="Loading Ticket..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-1 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Navigation */}
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>

                <ComplaintHeader complaint={complaint} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Initial Report</h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>

                            {complaint.media.length > 0 && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                                        <ImageIcon className="w-4 h-4" /> Attached Evidence
                                    </h4>
                                    <ComplaintMediaGrid media={complaint.media} />
                                </div>
                            )}
                        </div>



                        <div className="lg:col-span-2 space-y-6">
                            {/* Discussion Area - Now Primary */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b bg-slate-50/30 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                    <h3 className="text-sm font-bold text-slate-700">Ticket Discussion</h3>
                                </div>
                                <div className="p-6">
                                    <ComplaintCommentSection
                                        complaintId={complaintId!}
                                        pgId={pgId!}
                                        comments={complaint.comments || []}
                                        onRefresh={fetchData}
                                    />
                                </div>
                            </div>

                            {/* Audit Log - Collapsible and secondary */}
                            <Collapsible className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <History className="w-4 h-4" />
                                        <span className="text-sm font-semibold">View Audit Log / History</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-t">
                                    <ComplaintActivityLog activities={complaint.activities || []} />
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Controls */}
                    <div className="space-y-6">
                        <ComplaintSidebar
                            complaint={complaint}
                            users={users}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}