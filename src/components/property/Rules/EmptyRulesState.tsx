import { Button } from "@/components/ui/button";

export default function EmptyRulesState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
            <h2 className="text-lg font-semibold">No rules or policies found</h2>
            <p className="text-sm text-gray-500 mt-1">
                Create policies to define PG rules
            </p>
            <Button className="mt-4" onClick={onCreate}>
                Create Policy
            </Button>
        </div>
    );
}
