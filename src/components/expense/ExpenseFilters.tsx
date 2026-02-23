import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

export default function ExpenseFilters({ filters, setFilters, onApply }: any) {
    const categories = ["ALL", "MESS", "MAINTENANCE", "REPAIR", "UTILITIES", "SALARY", "PURCHASE", "RENT", "OTHER"];
    const methods = ["ALL", "CASH", "UPI", "BANK_TRANSFER", "CARD", "CHEQUE"];

    return (
        <div className="bg-muted/30 p-4 rounded-xl border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-2">
                    <Input
                        placeholder="Search by title..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={filters.paymentMethod} onValueChange={(v) => setFilters({ ...filters, paymentMethod: v })}>
                    <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
                    <SelectContent>
                        {methods.map(m => <SelectItem key={m} value={m}>{m.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                <Input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setFilters({ search: "", category: "ALL", paymentMethod: "ALL", status: "ALL", fromDate: "", toDate: "" })}>
                    <RotateCcw className="w-3 h-3 mr-2" /> Reset
                </Button>
                <Button size="sm" onClick={onApply} className="px-8">
                    <Search className="w-3 h-3 mr-2" /> Apply Filters
                </Button>
            </div>
        </div>
    );
}