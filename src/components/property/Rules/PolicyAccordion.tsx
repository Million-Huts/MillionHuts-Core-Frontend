import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { Policy } from "@/pages/Property/Details/PGRules";
import RuleItemRow from "@/components/property/Rules/RuleItemRow";

interface Props {
    policy: Policy;
    onAddRule: () => void;
    onDeletePolicy: () => void;
    onDeleteRule: (ruleId: string) => void;
}

export default function PolicyAccordion({
    policy,
    onAddRule,
    onDeletePolicy,
    onDeleteRule,
}: Props) {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={policy.id} className="bg-white rounded-lg">
                <div className="flex items-center justify-between px-4 py-2">
                    <AccordionTrigger className="text-left">
                        {policy.title}
                    </AccordionTrigger>

                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" onClick={onAddRule}>
                            <Plus size={16} />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={onDeletePolicy}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>

                <AccordionContent className="px-4 pb-4 bg-white">
                    {!Array.isArray(policy.items) || policy.items.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No rules present. Add new rules.
                        </p>
                    ) : (
                        <div className="space-y-2 bg-white">
                            {policy.items.map((item) => (
                                <RuleItemRow
                                    key={item.id}
                                    item={item}
                                    onDelete={() => onDeleteRule(item.id)}
                                />
                            ))}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
