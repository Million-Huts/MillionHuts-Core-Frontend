import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { apiPrivate } from "@/lib/api";

export default function ComplaintCommentSection({ complaintId, pgId, comments, onRefresh }: any) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const postComment = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("message", text);
            await apiPrivate.post(`pgs/${pgId}/complaints/${complaintId}/comments`, formData);
            setText("");
            onRefresh();
        } catch { /* toast error */ } finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                            {c.authorType === "TENANT" ? "TN" : "ST"}
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-900">{c.authorType}</span>
                                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-slate-600">{c.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Textarea
                    placeholder="Type your update..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="border-none focus-visible:ring-0 px-0 min-h-[80px]"
                />
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="text-slate-400">
                        <Paperclip className="w-4 h-4 mr-2" /> Attach
                    </Button>
                    <Button size="sm" onClick={postComment} disabled={loading}>
                        <Send className="w-4 h-4 mr-2" /> {loading ? "Sending..." : "Post Update"}
                    </Button>
                </div>
            </div>
        </div>
    );
}