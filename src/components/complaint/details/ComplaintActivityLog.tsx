import { CheckCircle2, Circle } from "lucide-react";

interface Activity {
    id: string;
    action: string;
    createdAt: string;
}

export default function ComplaintActivityLog({ activities }: { activities: Activity[] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-0.5 before:bg-slate-100">
                {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                        <div key={activity.id} className="relative pl-8">
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                {idx === 0 ? (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                ) : (
                                    <Circle className="w-2 h-2 text-white fill-white" />
                                )}
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {activity.action}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {new Date(activity.createdAt).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-slate-400 text-sm py-4">No recent activity recorded.</p>
                )}
            </div>
        </div>
    );
}