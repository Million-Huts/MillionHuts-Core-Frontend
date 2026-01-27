import { Button } from "@/components/ui/button";

export default function EmptyRoomsState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No rooms configured</h2>
            <p className="mt-1 text-sm text-gray-500">
                Add rooms to start assigning tenants
            </p>

            <Button className="mt-4" onClick={onAdd}>
                Add Room
            </Button>
        </div>
    );
}
