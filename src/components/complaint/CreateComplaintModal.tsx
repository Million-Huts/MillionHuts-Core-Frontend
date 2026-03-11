import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, TicketPlus, Image as ImageIcon } from "lucide-react";
import apiPrivate from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateComplaintModal({ isOpen, pgId, onClose, onCreated }: any) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "ELECTRICAL",
        priority: "MEDIUM"
    });
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = async () => {
        if (!form.title || !form.description) return toast.error("Please fill all fields");
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(form).forEach(([key, val]) => formData.append(key, val));
            files.forEach(f => formData.append("media", f));

            await apiPrivate.post(`pgs/${pgId}/complaints`, formData);
            toast.success("Ticket raised successfully");
            onCreated();
            onClose();
        } catch (err) {
            toast.error("Submission failed");
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] rounded-sm border-none shadow-2xl p-0 overflow-y-scroll max-h-[90vh]">
                <div className="p-8">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <TicketPlus className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter">New Complaint Ticket</DialogTitle>
                        <p className="text-muted-foreground font-medium">Describe the issue in detail for faster resolution.</p>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Issue Title</Label>
                            <Input
                                placeholder="e.g. Water leakage in Room 302"
                                className=" rounded-sm bg-muted/50 border-none font-medium px-4 focus-visible:ring-primary/20"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        {/* Category & Priority Selects */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(val) => setForm({ ...form, category: val })}
                                >
                                    <SelectTrigger className="rounded-sm bg-muted/50 border-none font-bold px-4 focus:ring-2 focus:ring-primary/20 shadow-none capitalize">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm border-none shadow-xl">
                                        <SelectItem value="ELECTRICAL" className="font-bold">Electrical</SelectItem>
                                        <SelectItem value="PLUMBING" className="font-bold">Plumbing</SelectItem>
                                        <SelectItem value="MAINTENANCE" className="font-bold">General Maintenance</SelectItem>
                                        <SelectItem value="OTHER" className="font-bold">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</Label>
                                <Select
                                    value={form.priority}
                                    onValueChange={(val) => setForm({ ...form, priority: val })}
                                >
                                    <SelectTrigger className={`rounded-sm bg-muted/50 border-none font-black px-4 focus:ring-2 focus:ring-primary/20 shadow-none uppercase text-[11px] tracking-wider ${form.priority === 'URGENT' ? 'text-rose-600' : 'text-primary'
                                        }`}>
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm border-none shadow-xl">
                                        <SelectItem value="LOW" className="font-bold text-slate-500">Low</SelectItem>
                                        <SelectItem value="MEDIUM" className="font-bold text-blue-600">Medium</SelectItem>
                                        <SelectItem value="HIGH" className="font-bold text-orange-600">High</SelectItem>
                                        <SelectItem value="URGENT" className="font-black text-rose-600">URGENT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Detailed Description</Label>
                            <Textarea
                                placeholder="Tell us exactly what's wrong..."
                                className="min-h-[120px] rounded-sm bg-muted/50 border-none font-medium p-4 focus-visible:ring-primary/20 resize-none"
                                rows={5}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* File Upload Dropzone */}
                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                            />
                            <div className="border-2 border-dashed border-muted-foreground/20 rounded-sm p-8 text-center group-hover:bg-primary/5 group-hover:border-primary/40 transition-all flex flex-col items-center justify-center">
                                <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center shadow-sm mb-3">
                                    <Upload className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm font-bold text-foreground">Click or drag files to upload</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Images or Videos (Max 10MB)</p>
                            </div>
                        </div>

                        {/* File Pills */}
                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-sm text-xs font-bold border border-primary/20">
                                        <ImageIcon className="w-3 h-3" />
                                        <span className="truncate max-w-[100px]">{file.name}</span>
                                        <button onClick={() => removeFile(idx)} className="hover:text-rose-600 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end gap-3 px-8 pb-8">
                    <Button variant="ghost" className="rounded-sm px-6 font-bold" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-sm px-8 font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {loading ? "Processing..." : "Submit Ticket"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}