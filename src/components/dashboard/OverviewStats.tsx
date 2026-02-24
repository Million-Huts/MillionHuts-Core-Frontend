import { Users, Layout, ClipboardList, Wallet } from "lucide-react";

export default function OverviewStats({ stats }: any) {
    const cards = [
        { label: "Active Tenants", val: stats.activeTenants, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Complaints", val: stats.openComplaints, icon: ClipboardList, color: "text-rose-600", bg: "bg-rose-50" },
        { label: "Occupancy", val: `${stats.occupancyRate}%`, icon: Layout, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Expenses (Pending)", val: `₹${stats.pendingExpenses}`, icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${c.bg} ${c.color}`}>
                        <c.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-900 leading-none">{c.val}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-tight">{c.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}