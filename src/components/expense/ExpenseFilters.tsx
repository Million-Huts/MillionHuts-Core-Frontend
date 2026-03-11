import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Dispatch, SetStateAction } from "react";

type Props = {
    filters: {
        search: string;
        category: string;
        paymentMethod: string;
        status: string;
        fromDate: string;
        toDate: string;
    };
    setFilters: Dispatch<SetStateAction<{
        search: string;
        category: string;
        paymentMethod: string;
        status: string;
        fromDate: string;
        toDate: string;
    }>>;
    onApply: () => Promise<void>
}

export default function ExpenseFilters({ filters, setFilters, onApply }: Props) {
    const categories = ["ALL", "MESS", "MAINTENANCE", "REPAIR", "ELECTRICITY", "SALARY", "WATER", "RENT", "OTHER", "INTERNET", "SUPPLIES"];
    const methods = ["ALL", "CASH", "UPI", "BANK_TRANSFER", "CARD", "OTHER"];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2 space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</Label>
                    <Input
                        placeholder="Search title..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className=" rounded-sm bg-muted/30 border-none"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                        <SelectTrigger className="h-12 rounded-sm bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-sm">
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</Label>
                    <Select value={filters.paymentMethod} onValueChange={(v) => setFilters({ ...filters, paymentMethod: v })}>
                        <SelectTrigger className="h-12 rounded-sm bg-muted/30 border-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-sm">
                            {methods.map(m => <SelectItem key={m} value={m}>{m.replace('_', ' ')}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">From</Label>
                    <Input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="rounded-sm bg-muted/30 border-none" />
                </div>

                <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">To</Label>
                    <Input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="rounded-sm bg-muted/30 border-none" />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" className="rounded-sm font-bold" onClick={() => setFilters({ search: "", category: "ALL", paymentMethod: "ALL", status: "ALL", fromDate: "", toDate: "" })}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button onClick={onApply} className="rounded-sm font-black shadow-lg shadow-primary/20 px-8">
                    <Search className="w-4 h-4 mr-2" /> Apply Filters
                </Button>
            </div>
        </div>
    );
}