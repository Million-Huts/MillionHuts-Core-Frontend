import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function InfrastructureCard({ data }: any) {
    const isIncomplete = data.missingRooms > 0;

    return (
        <Card className={`border-none rounded-3xl shadow-sm ${isIncomplete ? 'bg-amber-50/50' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold uppercase text-slate-500">Infrastructure</CardTitle>
                <Building2 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-3xl font-black text-slate-900">{data.createdRooms}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Created Rooms</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-slate-600">{data.floors}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Floors</p>
                    </div>
                </div>

                <div className={`p-3 rounded-2xl flex items-center gap-3 ${isIncomplete ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isIncomplete ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    <div className="text-xs font-bold leading-tight">
                        {isIncomplete
                            ? `${data.missingRooms} rooms pending setup across ${data.floorsWithMissingRooms} floors`
                            : "All rooms configured correctly"}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}