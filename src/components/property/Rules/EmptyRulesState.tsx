// components/property/Rules/EmptyRulesState.tsx
import { ShieldAlert, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyRulesState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-[2rem] bg-muted/20 text-center transition-all hover:bg-muted/30">
            <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-sm mb-6">
                <ShieldAlert className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Set the ground rules</h2>
            <p className="text-muted-foreground max-w-[320px] mt-2 mb-8 text-sm leading-relaxed">
                Clear policies help prevent disputes and ensure a peaceful stay for all your residents.
            </p>
            <Button onClick={onCreate} className="gap-2 rounded-full px-8">
                <Plus className="h-4 w-4" /> Create Your First Policy
            </Button>
        </div>
    );
}