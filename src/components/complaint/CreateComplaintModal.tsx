import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import apiPrivate from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateComplaintModal({ isOpen, pgId, onClose, onCreated }: any) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", category: "OTHER", priority: "MEDIUM" });
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-scroll">
                <DialogHeader><DialogTitle>New Complaint Ticket</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Issue Title</Label>
                        <Input placeholder="e.g. Water leakage in Room 302" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="PLUMBING">Plumbing</option>
                                <option value="MAINTENANCE">General Maintenance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bold text-red-600" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Detailed Description</Label>
                        <Textarea placeholder="Please provide details..." className="min-h-[100px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles(Array.from(e.target.files || []))} />
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">Click to upload photos or videos</p>
                        {files.length > 0 && <p className="text-xs text-blue-600 font-bold mt-2">{files.length} files selected</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? "Processing..." : "Submit Ticket"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}