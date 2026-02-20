import { usePG } from "@/context/PGContext";
export default function EmptyPG() {
    const { currentPG, loading } = usePG();

    if (!loading && !currentPG) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold">No PG configured</h2>
                <p className="text-sm text-gray-500">
                    Please create a PG first to start managing floors, rooms, and tenants.
                </p>
            </div>
        );
    }
}
