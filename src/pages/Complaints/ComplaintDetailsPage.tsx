import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MessageSquare, History, ImageIcon, ChevronDown, Terminal } from "lucide-react";
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
        <div className="relative h-screen bg-background">
            <LoadingOverlay isLoading={loading} message="Authenticating Ticket Data..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="gap-2 rounded-sm px-4 hover:bg-muted font-bold text-muted-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Terminal
                    </Button>
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        <Terminal className="w-3 h-3" />
                        Ticket ID: {complaintId?.substring(0, 8)}...
                    </div>
                </div>

                <ComplaintHeader complaint={complaint} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Content (8 Cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Description Card */}
                        <div className="bg-card rounded-sm border-none shadow-sm p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-sm bg-primary animate-pulse" />
                                Initial Report Statement
                            </h3>
                            <p className="text-foreground/80 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {complaint.description}
                            </p>

                            {complaint.media.length > 0 && (
                                <div className="mt-10 pt-10 border-t border-border/50">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
                                        <ImageIcon className="w-4 h-4" /> Attached Evidence ({complaint.media.length})
                                    </h4>
                                    <ComplaintMediaGrid media={complaint.media} />
                                </div>
                            )}
                        </div>

                        {/* Discussion Area */}
                        <div className="bg-card rounded-sm shadow-sm overflow-hidden border-none">
                            <div className="p-8 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Communication Thread</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Internal & Tenant Discussion</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <ComplaintCommentSection
                                    complaintId={complaintId!}
                                    pgId={pgId!}
                                    comments={complaint.comments || []}
                                    onRefresh={fetchData}
                                />
                            </div>
                        </div>

                        {/* Audit Log */}
                        <Collapsible className="bg-muted/20 rounded-sm overflow-hidden border border-border/40">
                            <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-all group">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <History className="w-5 h-5 group-hover:rotate-[-10deg] transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-[0.15em]">System Audit Log</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="p-2 pt-0">
                                    <div className="bg-background rounded-sm overflow-hidden border border-border/30">
                                        <ComplaintActivityLog activities={complaint.activities || []} />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* RIGHT COLUMN: Controls (4 Cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8">
                            <ComplaintSidebar
                                complaint={complaint}
                                users={users}
                                onRefresh={fetchData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}