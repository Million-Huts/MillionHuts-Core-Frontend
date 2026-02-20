import {
    Users,
    Home,
    IndianRupee,
    ArrowUpRight,
    Plus,
    LogOut,
    Bell,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    // Dummy Data
    const stats = [
        { label: "Total Tenants", value: "42", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Active Stays", value: "38", icon: Home, color: "text-green-600", bg: "bg-green-100" },
        { label: "Revenue (MTD)", value: "₹2,45,000", icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Pending Dues", value: "₹12,500", icon: ArrowUpRight, color: "text-red-600", bg: "bg-red-100" },
    ];

    const recentApplications = [
        { id: 1, name: "Rahul Sharma", pg: "Greenwood Residency", date: "2 mins ago", status: "Pending" },
        { id: 2, name: "Sneha Kapoor", pg: "Urban Living PG", date: "1 hour ago", status: "Reviewing" },
        { id: 3, name: "Amit Patel", pg: "Greenwood Residency", date: "Yesterday", status: "Approved" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 space-y-8">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manager Dashboard</h1>
                        <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Button className="gap-2 rounded-xl">
                            <Plus className="h-4 w-4" /> New Property
                        </Button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                        <h3 className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Table */}
                    <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Applications</CardTitle>
                            <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentApplications.map((app) => (
                                    <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{app.name}</p>
                                                <p className="text-xs text-slate-500">{app.pg} • {app.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions / Shortcuts */}
                    <Card className="border-none shadow-sm rounded-3xl bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="secondary" className="w-full justify-start gap-3 h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white">
                                <Search className="h-4 w-4" /> Search Tenants
                            </Button>
                            <Button variant="secondary" className="w-full justify-start gap-3 h-12 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white">
                                <IndianRupee className="h-4 w-4" /> Collect Rent
                            </Button>
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 rounded-xl text-white hover:bg-red-500/20 hover:text-red-200"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}