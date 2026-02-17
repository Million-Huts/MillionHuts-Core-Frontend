import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import EmptyRulesState from "@/components/property/Rules/EmptyRulesState";
import PolicyAccordion from "@/components/property/Rules/PolicyAccordion";
import CreatePolicyModal from "@/components/property/Rules/CreatePolicyModal";
import AddRulesModal from "@/components/property/Rules/AddRulesModal";

export interface PGRuleItem {
    id: string;
    name: string;
    description?: string;
}

export interface Policy {
    id: string;
    title: string;
    items: PGRuleItem[];
}

export default function PGRulesPage() {
    const { pgId } = useParams();
    const [policies, setPolicies] = useState<Policy[] | []>([]);
    const [loading, setLoading] = useState(true);

    const [openCreatePolicy, setOpenCreatePolicy] = useState(false);
    const [activePolicyId, setActivePolicyId] = useState<string | null>(null);

    const fetchRules = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/rules`);
            setPolicies(res.data.data.sections);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, [pgId]);

    if (loading) return <div className="p-6">Loading rules...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Rules & Policies</h1>
                <Button onClick={() => setOpenCreatePolicy(true)}>
                    Create Policy
                </Button>
            </div>

            {!Array.isArray(policies) || policies.length === 0 ? (
                <EmptyRulesState onCreate={() => setOpenCreatePolicy(true)} />
            ) : (
                <div className="space-y-4">
                    {policies.map((policy) => (
                        <PolicyAccordion
                            key={policy.id}
                            policy={policy}
                            onAddRule={() => setActivePolicyId(policy.id)}
                            onDeletePolicy={async () => {
                                await apiPrivate.delete(`/pgs/${pgId}/rules/sections/${policy.id}`);
                                toast.success("Policy deleted");
                                fetchRules();
                            }}
                            onDeleteRule={async (ruleId) => {
                                await apiPrivate.delete(`/pgs/${pgId}/rules/items/${ruleId}`);
                                toast.success("Rule deleted");
                                fetchRules();
                            }}
                        />
                    ))}
                </div>
            )}

            <CreatePolicyModal
                pgId={pgId!}
                open={openCreatePolicy}
                onClose={() => setOpenCreatePolicy(false)}
                onCreated={fetchRules}
            />

            <AddRulesModal
                pgId={pgId!}
                policyId={activePolicyId}
                open={!!activePolicyId}
                onClose={() => setActivePolicyId(null)}
                onAdded={fetchRules}
            />
        </div>
    );
}
