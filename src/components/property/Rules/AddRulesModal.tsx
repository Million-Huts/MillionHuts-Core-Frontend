import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddRulesModal({
    pgId,
    open,
    policyId,
    onClose,
    onAdded,
}: {
    pgId: string;
    open: boolean;
    policyId: string | null;
    onClose: () => void;
    onAdded: () => void;
}) {
    const [rules, setRules] = useState([{ name: "", description: "" }]);

    const addRule = () =>
        setRules((prev) => [...prev, { name: "", description: "" }]);

    const updateRule = (i: number, key: string, value: string) => {
        setRules((prev) =>
            prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r))
        );
    };

    const handleSubmit = async () => {
        try {
            await apiPrivate.post(`/pgs/${pgId}/rules/sections/${policyId}/items`, {
                items: rules,
            });
            toast.success("Rules added");
            onAdded();
            onClose();
        } catch {
            toast.error("Failed to add rules");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Rules</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {rules.map((rule, i) => (
                        <div key={i} className="space-y-2">
                            <Input
                                placeholder="Rule name"
                                value={rule.name}
                                onChange={(e) =>
                                    updateRule(i, "name", e.target.value)
                                }
                            />
                            <Input
                                placeholder="Description (optional)"
                                value={rule.description}
                                onChange={(e) =>
                                    updateRule(i, "description", e.target.value)
                                }
                            />
                        </div>
                    ))}

                    <Button variant="outline" onClick={addRule}>
                        + Add another rule
                    </Button>

                    <Button onClick={handleSubmit}>Save Rules</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
