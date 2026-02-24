import { ShieldAlert, Info } from "lucide-react";

export default function AlertFeed({ alerts }: { alerts: any[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Attention Required</h3>
            {alerts.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center text-slate-400 text-sm">
                    No active alerts
                </div>
            ) : (
                alerts.map((alert, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-2xl border flex gap-3 shadow-sm transition-all hover:scale-[1.02] ${alert.severity === 'HIGH' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                                alert.severity === 'MEDIUM' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                                    'bg-blue-50 border-blue-200 text-blue-900'
                            }`}
                    >
                        {alert.severity === 'HIGH' ? <ShieldAlert className="h-5 w-5 shrink-0" /> : <Info className="h-5 w-5 shrink-0" />}
                        <p className="text-xs font-bold leading-tight uppercase tracking-tight">{alert.message}</p>
                    </div>
                ))
            )}
        </div>
    );
}