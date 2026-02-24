import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CreditCard, UserCog, Ghost } from "lucide-react";

export default function ModuleGrid({ modules }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Floor/Room Module */}
            <ModuleCard
                title="Infrastructure"
                icon={Building}
                stats={[
                    { label: "Floors", value: modules.floor.floors },
                    { label: "Occupied Rooms", value: `${modules.floor.occupiedRooms}/${modules.floor.createdRooms}` }
                ]}
            />

            {/* Complaint Module */}
            <ModuleCard
                title="Maintenance"
                icon={Ghost}
                stats={[
                    { label: "Open Issues", value: modules.complaints.open, highlight: true },
                    { label: "In Progress", value: modules.complaints.inProgress }
                ]}
            />

            {/* Expense Module */}
            <ModuleCard
                title="Finances"
                icon={CreditCard}
                stats={[
                    { label: "Monthly Spend", value: `₹${modules.expenses.totalExpenses.toLocaleString()}` },
                    { label: "Pending Bills", value: modules.expenses.pendingExpenses }
                ]}
            />

            {/* Staff/User Module */}
            <ModuleCard
                title="Team"
                icon={UserCog}
                stats={[
                    { label: "Managers", value: modules.users.managers },
                    { label: "Staff", value: modules.users.staff }
                ]}
            />
        </div>
    );
}

function ModuleCard({ title, icon: Icon, stats }: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase text-slate-500 tracking-tighter">{title}</CardTitle>
                <Icon className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mt-2">
                    {stats.map((s: any, i: number) => (
                        <div key={i} className={i > 0 ? "text-right" : ""}>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}