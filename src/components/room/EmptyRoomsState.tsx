import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid } from "lucide-react";

export default function EmptyRoomsState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <LayoutGrid className="h-10 w-10 text-primary/30" />
            </div>

            <h2 className="text-2xl font-black tracking-tighter">No Rooms Configured</h2>
            <p className="mt-2 text-muted-foreground font-medium max-w-sm">
                Your inventory is currently empty. Start by adding a room to begin managing your occupancy and pricing.
            </p>

            <Button
                onClick={onAdd}
                className="mt-8 h-12 px-8 rounded-full font-black shadow-xl shadow-primary/20 gap-2"
            >
                <Plus className="h-4 w-4" /> Add Your First Room
            </Button>
        </div>
    );
}