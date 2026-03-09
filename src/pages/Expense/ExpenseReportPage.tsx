import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { Printer, Filter, TrendingDown, PieChart as PieIcon, FileSpreadsheet, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReportCharts from "@/components/expense/reports/ReportCharts";
import ExportConfigModal from "@/components/expense/reports/ExportConfigModal";
import ReportStatCard from "@/components/expense/reports/ReportStatCard";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Expense } from "@/interfaces/expense";

export default function ExpenseReportPage() {
    const { pgId } = useParams();
    const [searchParams] = useSearchParams();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        fromDate: searchParams.get("fromDate") || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        toDate: searchParams.get("toDate") || new Date().toISOString().split('T')[0],
    });

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/expense`, {
                params: { ...filters, noPagination: true },
            });
            setExpenses(res.data.data || []);
        } catch { toast.error("Failed to load report data"); } finally { setLoading(false); }
    };

    useEffect(() => { fetchReport(); }, []);

    const totalAmount = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
    const categoryData = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.forEach(e => map[e.category] = (map[e.category] || 0) + Number(e.amount));
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    return (
        <div className="relative p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            <LoadingOverlay isLoading={loading} message="Generating Report..." />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Financial Analytics</h1>
                    <p className="text-muted-foreground font-medium mt-1">Review operational performance and spending habits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full gap-2 font-bold" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print PDF
                    </Button>
                    <Button className="rounded-full gap-2 font-black shadow-lg" onClick={() => setIsExportModalOpen(true)}>
                        <FileSpreadsheet className="w-4 h-4" /> Export Excel
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none bg-muted/30 rounded-[2rem] p-6 print:hidden">
                <div className="flex flex-wrap items-end gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</Label>
                        <Input type="date" className="h-12 rounded-2xl bg-background border-none w-48" value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Date</Label>
                        <Input type="date" className="h-12 rounded-2xl bg-background border-none w-48" value={filters.toDate} onChange={e => setFilters({ ...filters, toDate: e.target.value })} />
                    </div>
                    <Button onClick={fetchReport} className="h-12 rounded-full px-8 font-black gap-2">
                        <Filter className="w-4 h-4" /> Update Report
                    </Button>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportStatCard title="Total Expenditure" value={`₹${totalAmount.toLocaleString()}`} icon={TrendingDown} color="text-red-600" />
                <ReportStatCard title="Avg. Expense/Day" value={`₹${(totalAmount / 30).toFixed(0)}`} icon={CalendarIcon} color="text-blue-600" />
                <ReportStatCard title="Total Transactions" value={expenses.length.toString()} icon={PieIcon} color="text-purple-600" />
            </div>

            {/* Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2rem] border-none shadow-sm p-6 h-[400px]"><ReportCharts data={categoryData} type="pie" /></Card>
                <Card className="rounded-[2rem] border-none shadow-sm p-6 h-[400px]"><ReportCharts data={expenses} type="bar" /></Card>
            </div>

            {/* Table */}
            <div className="rounded-[2rem] border overflow-hidden shadow-sm bg-card">
                <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="p-6 text-left font-black tracking-widest text-[10px] uppercase">Date</th>
                            <th className="p-6 text-left font-black tracking-widest text-[10px] uppercase">Details</th>
                            <th className="p-6 text-right font-black tracking-widest text-[10px] uppercase">Amount</th>
                            <th className="p-6 text-center font-black tracking-widest text-[10px] uppercase">Method</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {expenses.map((e) => (
                            <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                                <td className="p-6 font-bold">{new Date(e.paymentDate).toLocaleDateString()}</td>
                                <td className="p-6 font-bold">{e.title} <Badge variant="secondary" className="ml-2 rounded-full">{e.category}</Badge></td>
                                <td className="p-6 text-right font-black text-primary">₹{e.amount}</td>
                                <td className="p-6 text-center"><span className="text-xs font-black uppercase tracking-wider text-muted-foreground">{e.paymentMethod}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExportConfigModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} filters={filters} pgId={pgId!} />
        </div>
    );
}