import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import {
    Printer, Filter,
    TrendingDown, PieChart as PieIcon,
    FileSpreadsheet, Calendar as CalendarIcon,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ReportCharts from "@/components/expense/reports/ReportCharts";
import ExportConfigModal from "@/components/expense/reports/ExportConfigModal";
import ReportStatCard from "@/components/expense/reports/ReportStatCard";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function ExpenseReportPage() {
    const { pgId } = useParams();
    const [searchParams] = useSearchParams();

    const [expenses, setExpenses] = useState<any[]>([]);
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
        } catch (err) {
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReport(); }, []);

    // Derived Data for Visuals
    const totalAmount = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);

    const categoryData = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.forEach(e => map[e.category] = (map[e.category] || 0) + Number(e.amount));
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    return (
        <div className="relative p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-white min-h-screen print:p-0">
            <LoadingOverlay isLoading={loading} message="Generating Report..." />
            {/* Header: Hidden on Print */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Analytics</h1>
                    <p className="text-slate-500">Comprehensive expense breakdown for your property.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print PDF
                    </Button>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => setIsExportModalOpen(true)}>
                        <FileSpreadsheet className="w-4 h-4" /> Export Excel
                    </Button>
                </div>
            </div>

            {/* Quick Filters: Hidden on Print */}
            <Card className="border-none bg-slate-50 print:hidden">
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500">Start Date</label>
                        <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500">End Date</label>
                        <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.toDate} onChange={e => setFilters({ ...filters, toDate: e.target.value })} />
                    </div>
                    <Button onClick={fetchReport} className="gap-2"><Filter className="w-4 h-4" /> Update Report</Button>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportStatCard title="Total Expenditure" value={`₹${totalAmount.toLocaleString()}`} icon={TrendingDown} color="text-red-600" />
                <ReportStatCard title="Avg. Expense/Day" value={`₹${(totalAmount / 30).toFixed(0)}`} icon={CalendarIcon} color="text-blue-600" />
                <ReportStatCard title="Total Transactions" value={expenses.length.toString()} icon={PieIcon} color="text-purple-600" />
            </div>

            {/* Visual Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-slate-100">
                    <CardHeader><CardTitle className="text-lg">Category Distribution</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ReportCharts data={categoryData} type="pie" />
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-100">
                    <CardHeader><CardTitle className="text-lg">Spending Trend</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ReportCharts data={expenses} type="bar" />
                    </CardContent>
                </Card>
            </div>

            {/* Data Table for the Report */}
            <div className="rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 text-left font-semibold text-slate-700">Date</th>
                            <th className="p-4 text-left font-semibold text-slate-700">Title & Category</th>
                            <th className="p-4 text-right font-semibold text-slate-700">Amount</th>
                            <th className="p-4 text-center font-semibold text-slate-700">Method</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {expenses.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-slate-600">{new Date(e.paymentDate).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="font-medium text-slate-900">{e.title}</div>
                                    <Badge variant="secondary" className="text-[10px] mt-1">{e.category}</Badge>
                                </td>
                                <td className="p-4 text-right font-bold text-slate-900">₹{e.amount}</td>
                                <td className="p-4 text-center">
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">{e.paymentMethod}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExportConfigModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                filters={filters}
                pgId={pgId!}
            />
        </div>
    );
}