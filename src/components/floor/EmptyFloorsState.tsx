import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";

export default function EmptyFloorsState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-primary/20 bg-muted/10 py-24 px-8 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Icon container with soft shadow */}
            <div className="h-24 w-24 bg-background rounded-full flex items-center justify-center shadow-xl shadow-primary/5 mb-8 border border-border">
                <Layers className="h-10 w-10 text-primary/40" />
            </div>

            <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-black tracking-tighter">Define your structure</h2>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
                    Start by setting up your first floor. This will allow you to begin adding rooms and organizing your PG space.
                </p>
            </div>

            <Button
                onClick={onAdd}
                className="h-14 rounded-full px-10 font-black shadow-lg shadow-primary/20 gap-2 text-base"
            >
                <Plus className="h-5 w-5" /> Initialize First Floor
            </Button>
        </div>
    );
}