import { ShieldPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyRulesState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-muted-foreground/20 rounded-[2rem] bg-muted/20 text-center transition-all hover:bg-muted/30 hover:border-primary/20">
            {/* Visual Icon */}
            <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center shadow-xl shadow-primary/5 mb-8 border border-border">
                <ShieldPlus className="h-10 w-10 text-primary/40" />
            </div>

            {/* Content */}
            <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-black tracking-tighter">Set your ground rules</h2>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
                    Clear policies prevent disputes and help define the expectations for a great living experience.
                </p>
            </div>

            {/* Action */}
            <Button onClick={onCreate} className="h-12 rounded-full px-8 gap-2 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" /> Create Your First Policy
            </Button>
        </div>
    );
}