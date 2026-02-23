import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

const AVAILABLE_FIELDS = [
    { id: "paymentDate", label: "Date of Payment" },
    { id: "title", label: "Expense Title" },
    { id: "category", label: "Category" },
    { id: "amount", label: "Amount" },
    { id: "paymentMethod", label: "Payment Method" },
    { id: "status", label: "Status" },
    { id: "description", label: "Description/Notes" },
    { id: "createdBy", label: "Recorded By" },
    { id: "referenceId", label: "Ref ID / UPI ID" },
];

export default function ExportConfigModal({ isOpen, onClose, filters, pgId }: any) {
    const [selectedFields, setSelectedFields] = useState<string[]>(["paymentDate", "title", "amount"]);
    const [isDownloading, setIsDownloading] = useState(false);

    const toggleField = (id: string) => {
        setSelectedFields(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleExport = async () => {
        if (selectedFields.length === 0) return toast.error("Select at least one field");

        try {
            setIsDownloading(true);
            const response = await apiPrivate.post(`/pgs/${pgId}/expense/export`, {
                ...filters,
                fields: selectedFields
            }, { responseType: 'blob' });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Expense_Report_${filters.fromDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            onClose();
        } catch (err) {
            toast.error("Export failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Configure Excel Export</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p className="text-sm text-slate-500">Select the columns you want to include in your spreadsheet.</p>
                    <div className="grid grid-cols-2 gap-4">
                        {AVAILABLE_FIELDS.map(field => (
                            <div key={field.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                onClick={() => toggleField(field.id)}>
                                <Checkbox checked={selectedFields.includes(field.id)} />
                                <label className="text-sm font-medium leading-none cursor-pointer">{field.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleExport} disabled={isDownloading}>
                        {isDownloading ? "Generating..." : "Download Excel"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}