import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddExpenseModal({ isOpen, onClose, pgId, onRefresh }: any) {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "", description: "", category: "OTHER",
        amount: "", paymentMethod: "CASH", paymentDate: new Date().toISOString().split('T')[0],
        file: null as File | null
    });

    const handleSave = async () => {
        if (!form.title || !form.amount) return toast.error("Please fill required fields");

        try {
            setSubmitting(true);
            const fd = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'file' && value) fd.append("billImage", value);
                else fd.append(key, value as string);
            });

            await apiPrivate.post(`/pgs/${pgId}/expense`, fd);
            toast.success("Expense recorded");
            onRefresh();
            setForm({
                title: "", description: "", category: "OTHER",
                amount: "", paymentMethod: "CASH", paymentDate: new Date().toISOString().split('T')[0],
                file: null as File | null
            });
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error saving expense");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-scroll">
                <DialogHeader><DialogTitle>New Expense Entry</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label>Title *</Label>
                        <Input placeholder="e.g. Electricity Bill July" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Category</Label>
                            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MESS">Mess/Food</SelectItem>
                                    <SelectItem value="UTILITIES">Utilities</SelectItem>
                                    <SelectItem value="REPAIR">Repair</SelectItem>
                                    <SelectItem value="SALARY">Salary</SelectItem>
                                    <SelectItem value="PURCHASE">Purchase</SelectItem>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Amount *</Label>
                            <Input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Date</Label>
                            <Input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label>Method</Label>
                            <Select value={form.paymentMethod} onValueChange={v => setForm({ ...form, paymentMethod: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Bill Attachment</Label>
                        <Input type="file" onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Expense"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}