import { CheckCircle2, Circle, Hash } from "lucide-react";

interface Activity {
    id: string;
    action: string;
    createdAt: string;
}

export default function ComplaintActivityLog({ activities }: { activities: Activity[] }) {
    return (
        <div className="bg-card p-8 shadow-none">
            <div className="space-y-10 relative before:absolute before:inset-0 before:left-[15px] before:h-[calc(100%-20px)] before:w-[2px] before:bg-gradient-to-b before:from-primary/40 before:to-transparent">
                {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                        <div key={activity.id} className="relative pl-12 group">
                            {/* Marker */}
                            <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-all duration-300 shadow-sm
                                ${idx === 0
                                    ? 'bg-primary text-primary-foreground scale-110'
                                    : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}
                            >
                                {idx === 0 ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Hash className="w-3 h-3 opacity-50" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-1">
                                <p className={`text-[13px] font-black uppercase tracking-tight leading-none
                                    ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {activity.action}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                        Timestamp
                                    </span>
                                    <p className="text-[11px] font-bold text-muted-foreground/60">
                                        {new Date(activity.createdAt).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center space-y-3">
                        <Circle className="w-8 h-8 mx-auto text-muted animate-pulse" />
                        <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em]">
                            End of Log — No Activity
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}