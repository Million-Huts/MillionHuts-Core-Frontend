import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";

export default function EmptyFloorsState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-16 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-background rounded-3xl shadow-xl flex items-center justify-center mb-6">
                <Layers className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">No floors yet</h2>
            <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
                Every great PG starts with a solid structure. Add your first floor to begin adding rooms.
            </p>

            <Button onClick={onAdd} className="mt-8 rounded-full px-8 h-12 shadow-lg hover:shadow-primary/30 gap-2">
                <Plus className="h-5 w-5" /> Initialize First Floor
            </Button>
        </div>
    );
}