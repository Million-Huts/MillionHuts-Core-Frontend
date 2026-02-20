import type { Application } from "@/interfaces/application";
import ApplicationCard from "./ApplicationCard";

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
    if (applications.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No applications found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => (
                <ApplicationCard
                    key={app.id}
                    application={app}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}
        </div>
    );
}
