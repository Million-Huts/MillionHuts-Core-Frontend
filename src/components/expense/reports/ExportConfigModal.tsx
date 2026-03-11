import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { FileSpreadsheet, Loader2 } from "lucide-react";

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

type Props = {
    isOpen: boolean;
    onClose: () => void;
    pgId: string;
    filters: {
        fromDate: string;
        toDate: string;
    };
}

export default function ExportConfigModal({ isOpen, onClose, filters, pgId }: Props) {
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

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Expense_Report_${filters.fromDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            onClose();
        } catch {
            toast.error("Export failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-sm p-8 max-h-[90vh] overflow-y-scroll">
                <DialogHeader className="mb-6">
                    <div className="h-14 w-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <FileSpreadsheet className="h-7 w-7 text-green-600" />
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tighter">Export to Excel</DialogTitle>
                    <DialogDescription className="text-base font-medium">
                        Select columns to customize your data download.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {AVAILABLE_FIELDS.map(field => (
                        <div key={field.id}
                            className={`flex items-center space-x-3 p-4 rounded-sm border-2 transition-all cursor-pointer ${selectedFields.includes(field.id)
                                ? "border-primary bg-primary/5"
                                : "border-muted bg-muted/30 hover:border-muted-foreground/20"
                                }`}
                            onClick={() => toggleField(field.id)}>
                            <Checkbox checked={selectedFields.includes(field.id)} className="h-5 w-5" />
                            <label className="text-sm font-bold leading-none cursor-pointer">{field.label}</label>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1 rounded-sm font-bold" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleExport} className="flex-1 rounded-sm font-black shadow-lg bg-green-600 hover:bg-green-700" disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Download File"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}