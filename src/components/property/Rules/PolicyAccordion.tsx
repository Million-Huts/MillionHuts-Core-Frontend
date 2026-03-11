import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical } from "lucide-react";
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
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem
                value={policy.id}
                className="border border-border rounded-sm bg-card overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
                {/* Header Area */}
                <div className="flex items-center justify-between px-6 py-2">
                    <AccordionTrigger className="hover:no-underline py-4 text-lg font-black tracking-tighter">
                        {policy.title}
                    </AccordionTrigger>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onAddRule}
                            className="rounded-sm gap-2 font-bold"
                        >
                            <Plus size={16} /> Add Rule
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDeletePolicy}
                            className="rounded-full text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="space-y-3">
                        {(!Array.isArray(policy.items) || policy.items.length === 0) ? (
                            <div className="py-8 text-center rounded-sm border-2 border-dashed border-muted bg-muted/20">
                                <p className="text-sm font-medium text-muted-foreground">
                                    No rules defined for this category yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {policy.items.map((item) => (
                                    <div key={item.id} className="group flex items-center gap-3">
                                        <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab" />
                                        <div className="flex-1">
                                            <RuleItemRow
                                                item={item}
                                                onDelete={() => onDeleteRule(item.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}