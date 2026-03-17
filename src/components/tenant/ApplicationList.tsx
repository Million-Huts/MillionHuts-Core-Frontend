// components/tenant/ApplicationList.tsx
import type { Application } from "@/interfaces/application";
import ApplicationCard from "./ApplicationCard";
import { Inbox } from "lucide-react";

interface Props {
    applications: Application[];
    onApprove: (app: Application) => void;
    onReject: (id: string) => void;
}

export default function ApplicationList({
    applications,
    onApprove,
    onReject,
}: Props) {
    // Empty State Refactor
    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 rounded-sm border border-dashed border-border bg-muted/5 animate-in fade-in duration-700">
                <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No applications found</h3>
                <p className="text-muted-foreground text-center max-w-xs mt-2">
                    When potential residents apply to your PG, their details will appear here for review.
                </p>
            </div>
        );
    }

    // Sort: Pending applications first, then by date
    const sortedApplications = [...applications].sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="grid gap-4 w-full">
            {sortedApplications.map((app, index) => (
                <div
                    key={app.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 50}ms` }} // Staggered entry
                >
                    <ApplicationCard
                        application={app}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                </div>
            ))}

            {/* Contextual Footer for long lists */}
            {applications.length > 3 && (
                <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/50 py-4">
                    End of Application List
                </p>
            )}
        </div>
    );
}