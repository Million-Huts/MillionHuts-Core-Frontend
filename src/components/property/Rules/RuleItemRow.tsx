import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PGRuleItem } from "@/pages/Property/Details/PGRules";

export default function RuleItemRow({
    item,
    onDelete,
}: {
    item: PGRuleItem;
    onDelete: () => void;
}) {
    return (
        <div className="flex justify-between rounded-md border p-3">
            <div>
                <p className="font-medium">{item.name}</p>
                {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                )}
            </div>

            <Button size="icon" variant="ghost" onClick={onDelete}>
                <Trash2 size={16} />
            </Button>
        </div>
    );
}
