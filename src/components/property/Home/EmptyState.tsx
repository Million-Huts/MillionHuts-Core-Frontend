import { Button } from "@/components/ui/button";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No PGs found</h2>
            <p className="mt-1 text-sm text-gray-500">
                Create your first PG to start managing rooms and tenants
            </p>

            <Button className="mt-4" onClick={onCreate}>
                Create PG
            </Button>
        </div>
    );
}
