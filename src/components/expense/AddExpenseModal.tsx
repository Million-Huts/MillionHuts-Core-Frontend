import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2, Receipt } from "lucide-react";

type Props = {
    isOpen: boolean;
    pgId: string;
    onClose: () => void;
    onRefresh: () => Promise<void>;
}

export default function AddExpenseModal({ isOpen, onClose, pgId, onRefresh }: Props) {
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
            setForm({
                title: "", description: "", category: "OTHER",
                amount: "", paymentMethod: "CASH", paymentDate: new Date().toISOString().split('T')[0],
                file: null as File | null
            })
            onRefresh();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error saving expense");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8 max-h-[90vh] overflow-y-scroll">
                <DialogHeader className="mb-6">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Receipt className="h-7 w-7 text-primary" />
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tighter">New Expense</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                        Log a new operational cost to your ledger.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title *</Label>
                        <Input placeholder="e.g. Electricity Bill July" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-12 rounded-2xl bg-muted/30 border-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="MESS">Mess/Food</SelectItem>
                                    <SelectItem value="MAINTENANCE">Utilities</SelectItem>
                                    <SelectItem value="REPAIR">Repair</SelectItem>
                                    <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                    <SelectItem value="WATER">Water</SelectItem>
                                    <SelectItem value="SALARY">Salary</SelectItem>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                    <SelectItem value="INTERNET">Internet</SelectItem>
                                    <SelectItem value="SUPPLIES">Supplies</SelectItem>
                                    <SelectItem value="PURCHASE">Purchase</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount *</Label>
                            <Input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="h-12 rounded-2xl bg-muted/30 border-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</Label>
                            <Input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} className="h-12 rounded-2xl bg-muted/30 border-none" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</Label>
                            <Select value={form.paymentMethod} onValueChange={v => setForm({ ...form, paymentMethod: v })}>
                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    <SelectItem value="CARD">Card Payment</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bill Attachment</Label>
                        <Input type="file" onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} className="h-12 rounded-2xl bg-muted/30 border-none file:text-primary file:font-black" />
                    </div>
                </div>

                <div className="pt-6 flex gap-3">
                    <Button variant="ghost" className="flex-1 rounded-full font-bold" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="flex-1 rounded-full font-black shadow-lg" disabled={submitting}>
                        {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Expense"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}