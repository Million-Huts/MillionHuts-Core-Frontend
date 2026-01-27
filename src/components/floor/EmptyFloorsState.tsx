import { Button } from "@/components/ui/button";

export default function EmptyFloorsState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No floors configured</h2>
            <p className="mt-1 text-sm text-gray-500">
                Add floors to create new rooms.
            </p>

            <Button className="mt-4" onClick={onAdd}>
                Add Floor
            </Button>
        </div>
    );
}
