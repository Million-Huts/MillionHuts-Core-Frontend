// components/property/Rules/AddRulesModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this shadcn component
import { Button } from "@/components/ui/button";
import { Plus, X, ListPlus, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddRulesModal({ pgId, open, policyId, onClose, onAdded }: any) {
    const [rules, setRules] = useState([{ name: "", description: "" }]);
    const [loading, setLoading] = useState(false);

    const addRuleRow = () => setRules((prev) => [...prev, { name: "", description: "" }]);

    const removeRuleRow = (index: number) => {
        if (rules.length > 1) {
            setRules(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateRule = (i: number, key: string, value: string) => {
        setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
    };

    const handleSubmit = async () => {
        if (rules.some(r => !r.name)) {
            return toast.error("Rule names are required");
        }

        setLoading(true);
        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections/${policyId}/items`, {
                items: rules,
            });
            toast.success(`${rules.length} rules added`);
            onAdded();
            onClose();
            setRules([{ name: "", description: "" }]); // Reset
        } catch {
            toast.error("Failed to add rules");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ListPlus size={20} />
                        </div>
                        <DialogHeader>
                            <DialogTitle>Add Specific Rules</DialogTitle>
                        </DialogHeader>
                    </div>
                    <DialogDescription>
                        Define the specific details for this policy. You can add multiple rules at once.
                    </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
                    {rules.map((rule, i) => (
                        <div key={i} className="relative group bg-background p-4 rounded-xl border shadow-sm transition-all hover:border-primary/20">
                            {rules.length > 1 && (
                                <button
                                    onClick={() => removeRuleRow(i)}
                                    className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <div className="grid gap-3">
                                <Input
                                    placeholder="Rule Name (e.g. No guests after 10 PM)"
                                    value={rule.name}
                                    onChange={(e) => updateRule(i, "name", e.target.value)}
                                    className="font-medium h-10 border-none px-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/50"
                                />
                                <div className="h-[1px] bg-border/50" />
                                <Textarea
                                    placeholder="Add more context or penalty details..."
                                    value={rule.description}
                                    onChange={(e) => updateRule(i, "description", e.target.value)}
                                    className="min-h-[60px] resize-none border-none p-0 focus-visible:ring-0 text-sm bg-transparent"
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        onClick={addRuleRow}
                        className="w-full border-dashed border-2 h-12 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Another Rule
                    </Button>
                </div>

                <div className="p-6 border-t bg-background rounded-b-lg flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="min-w-[140px]">
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save All Rules"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}