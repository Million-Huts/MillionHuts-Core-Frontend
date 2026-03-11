import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, ListPlus, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    pgId: string;
    open: boolean;
    policyId: string | null;
    onClose: () => void;
    onAdded: () => void;
}

export default function AddRulesModal({ pgId, open, policyId, onClose, onAdded }: Props) {
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
        if (rules.some(r => !r.name.trim())) {
            return toast.error("Please provide a name for all rules");
        }

        setLoading(true);
        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections/${policyId}/items`, {
                items: rules,
            });
            toast.success("Rules added to policy");
            onAdded();
            onClose();
            setRules([{ name: "", description: "" }]);
        } catch {
            toast.error("Failed to save rules");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { setRules([{ name: "", description: "" }]); onClose() }}>
            <DialogContent className="max-w-xl p-0 overflow-hidden rounded-sm border-none shadow-2xl">
                <div className="p-8 pb-4 border-b bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <ListPlus size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black tracking-tighter">Add New Rules</DialogTitle>
                            <DialogDescription className="font-medium text-muted-foreground">
                                Define specific guidelines for this policy category.
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {rules.map((rule, i) => (
                        <div key={i} className="group relative bg-background p-5 rounded-sm border border-border shadow-sm transition-all">
                            {rules.length > 1 && (
                                <button
                                    onClick={() => removeRuleRow(i)}
                                    className="absolute -top-2 -right-2 h-7 w-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Rule Name (e.g. No noise after 10 PM)"
                                    value={rule.name}
                                    onChange={(e) => updateRule(i, "name", e.target.value)}
                                    className="font-bold  rounded-sm border-foreground/20 px-2 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
                                />
                                <Textarea
                                    placeholder="Add context or penalty details (optional)..."
                                    value={rule.description}
                                    onChange={(e) => updateRule(i, "description", e.target.value)}
                                    rows={5}
                                    className="min-h-[60px] rounded-sm border-foreground/20 px-2 focus-visible:ring-0 text-sm bg-transparent placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        onClick={addRuleRow}
                        className="w-full border-dashed border-2 h-14 rounded-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Another Rule
                    </Button>
                </div>

                <div className="p-6 bg-muted/20 border-t flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-sm h-12 px-6 font-bold">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="rounded-sm h-12 px-8 font-bold shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save Rules"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}