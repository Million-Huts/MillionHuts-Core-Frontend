import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, ImageIcon, Maximize2, User, ShieldCheck } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export default function ComplaintCommentSection({ complaintId, pgId, comments, onRefresh }: any) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
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
            toast.success("Internal thread updated");
        } catch {
            toast.error("Failed to post update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* MESSAGES LIST */}
            <div className="space-y-8">
                {comments.map((c: any) => {
                    const isStaff = c.authorType !== "TENANT";
                    return (
                        <div key={c.id} className={`flex gap-4 ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar System */}
                            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center shadow-sm border-2 border-background
                                ${isStaff ? 'bg-slate-950 text-white' : 'bg-primary/10 text-primary'}`}>
                                {isStaff ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            <div className={`flex-1 space-y-3 max-w-[85%] ${isStaff ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-5 rounded-sm shadow-sm border
                                    ${isStaff
                                        ? 'bg-slate-900 text-slate-100 border-slate-800 rounded-tr-none'
                                        : 'bg-background text-foreground border-border rounded-tl-none'}`}>

                                    <div className="flex justify-between items-center gap-8 mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] 
                                            ${isStaff ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {isStaff ? "Management / Staff" : "Tenant Update"}
                                        </span>
                                        <span className="text-[9px] opacity-40 font-bold">
                                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <p className="text-sm leading-relaxed font-medium">{c.message}</p>
                                </div>

                                {/* COMMENT MEDIA THUMBNAILS */}
                                {c.media && c.media.length > 0 && (
                                    <div className={`flex flex-wrap gap-2 ${isStaff ? 'justify-end' : 'justify-start'}`}>
                                        {c.media.map((m: any) => (
                                            <div
                                                key={m.id}
                                                onClick={() => setSelectedImg(m.fileUrl)}
                                                className="group relative h-24 w-24 rounded-sm overflow-hidden border-2 border-background shadow-md cursor-zoom-in bg-muted"
                                            >
                                                <img src={m.fileUrl} alt="attachment" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Maximize2 className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* INPUT SECTION - ARCHITECTURAL TERMINAL STYLE */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-sm blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>

                <div className="relative bg-card p-4 rounded-sm border border-border shadow-xl">
                    {/* Pending file previews */}
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4 bg-muted/30 p-3 rounded-sm border border-dashed border-border">
                            {files.map((_, idx) => (
                                <div key={idx} className="relative h-14 w-14 bg-background rounded-sm border-2 border-primary/10 flex items-center justify-center overflow-hidden group/file">
                                    <ImageIcon className="h-5 w-5 text-primary/40" />
                                    <button
                                        onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                        className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover/file:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Textarea
                        placeholder="Log a resolution or send a message to the tenant..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0 px-4 py-2 min-h-[100px] resize-none text-base font-medium bg-transparent"
                    />

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                        <label className="flex items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-all text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-primary/5">
                            <Paperclip className="w-4 h-4" />
                            Attach Media
                            <input
                                type="file"
                                multiple
                                hidden
                                onChange={e => setFiles([...files, ...Array.from(e.target.files || [])])}
                            />
                        </label>

                        <Button
                            onClick={postComment}
                            disabled={loading || (!text.trim() && files.length === 0)}
                            className="rounded-sm px-8 font-black uppercase tracking-widest text-[10px] h-11 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            {loading ? "Syncing..." : "Post Update"}
                            {!loading && <Send className="w-3 h-3 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
                <DialogContent className="max-w-5xl p-2 overflow-y-scroll max-h-[90vh] bg-black/90 border-none shadow-none rounded-sm">
                    <DialogTitle className="sr-only">Attachment Preview</DialogTitle>
                    <div className="relative flex items-center justify-center min-h-[50vh]">
                        <img
                            src={selectedImg || ""}
                            className="max-h-[85vh] w-auto rounded-sm object-contain"
                            alt="Full preview"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedImg(null)}
                            className="absolute top-4 right-4 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}