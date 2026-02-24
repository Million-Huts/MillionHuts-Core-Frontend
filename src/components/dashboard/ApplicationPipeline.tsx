import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Clock } from "lucide-react";

export default function ApplicationPipeline({ data }: any) {
    return (
        <Card className="border-none rounded-3xl shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold uppercase text-slate-500">Applications</CardTitle>
                <UserPlus className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl">
                        <p className="text-2xl font-black text-indigo-700">{data.pending}</p>
                        <p className="text-[10px] font-bold uppercase text-indigo-400">Pending</p>
                    </div>
                    <div className={`${data.stalePending > 0 ? 'bg-rose-50' : 'bg-slate-50'} p-3 rounded-2xl`}>
                        <p className={`text-2xl font-black ${data.stalePending > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {data.stalePending}
                        </p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Stale (&gt;48h)</p>
                    </div>
                </div>

                {data.flags.hasStalePending && (
                    <div className="flex items-center gap-2 text-rose-600 animate-pulse">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase">Immediate Review Required</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}