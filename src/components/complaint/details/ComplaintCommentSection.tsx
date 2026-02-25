import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, ImageIcon, Maximize2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export default function ComplaintCommentSection({ complaintId, pgId, comments, onRefresh }: any) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    // State for the Image Modal (Lightbox)
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const postComment = async () => {
        if (!text.trim() && files.length === 0) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("message", text);
            files.forEach(file => formData.append("media", file));

            await apiPrivate.post(`pgs/${pgId}/complaints/${complaintId}/comments`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setText("");
            setFiles([]);
            onRefresh();
            toast.success("Update posted");
        } catch {
            toast.error("Failed to post update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* MESSAGES LIST */}
            <div className="space-y-6">
                {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${c.authorType === "TENANT" ? "bg-indigo-100 text-indigo-700" : "bg-slate-800 text-white"
                            }`}>
                            {c.authorType === "TENANT" ? "TN" : "ST"}
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-black uppercase tracking-tight text-slate-400">
                                        {c.authorType === "TENANT" ? "Tenant" : "Staff / Management"}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{c.message}</p>
                            </div>

                            {/* COMMENT MEDIA THUMBNAILS */}
                            {c.media && c.media.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {c.media.map((m: any) => (
                                        <div
                                            key={m.id}
                                            onClick={() => setSelectedImg(m.fileUrl)}
                                            className="group relative h-20 w-20 rounded-xl overflow-hidden border cursor-zoom-in bg-slate-100"
                                        >
                                            <img src={m.fileUrl} alt="attachment" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Maximize2 className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* INPUT SECTION */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-indigo-500/10 transition-all">
                {/* Pending file previews */}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 border-b pb-3">
                        {files.map((_, idx) => (
                            <div key={idx} className="relative h-12 w-12 bg-slate-50 rounded-lg border flex items-center justify-center overflow-hidden">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                                <button
                                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Textarea
                    placeholder="Type an update or resolution note..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 px-0 min-h-[60px] resize-none text-sm"
                />

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                    <label className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors text-xs font-bold px-2 py-1.5 rounded-lg hover:bg-slate-50">
                        <Paperclip className="w-4 h-4" />
                        Attach
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={e => setFiles([...files, ...Array.from(e.target.files || [])])}
                        />
                    </label>

                    <Button
                        size="sm"
                        onClick={postComment}
                        disabled={loading || (!text.trim() && files.length === 0)}
                        className="rounded-xl px-4 font-bold shadow-indigo-100 shadow-md"
                    >
                        {loading ? "Sending..." : "Post Update"}
                        {!loading && <Send className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    <div className="relative h-full w-full flex items-center justify-center">
                        <img
                            src={selectedImg || ""}
                            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                            alt="Full preview"
                        />
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}