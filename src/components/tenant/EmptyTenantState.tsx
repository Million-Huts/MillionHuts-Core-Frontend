import { Button } from "@/components/ui/button";

export default function EmptyTenantState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No tenants added</h2>
            <p className="text-sm text-gray-500">
                Add tenants to start managing stays and payments
            </p>

            <Button className="mt-4" onClick={onAdd}>
                Add Tenant
            </Button>
        </div>
    );
}
