import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import EmptyRulesState from "@/components/property/Rules/EmptyRulesState";
import PolicyAccordion from "@/components/property/Rules/PolicyAccordion";
import CreatePolicyModal from "@/components/property/Rules/CreatePolicyModal";
import AddRulesModal from "@/components/property/Rules/AddRulesModal";
import ConfirmDeleteModal from "@/components/shared/ConfirmDeleteModal";

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
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreatePolicy, setOpenCreatePolicy] = useState(false);
    const [activePolicyId, setActivePolicyId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'policy' | 'rule', id: string } | null>(null);

    const fetchRules = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/rules`);
            setPolicies(res.data.data.sections);
        } catch {
            toast.error("Failed to load policies");
        } finally {
            setLoading(false);
        }
    }, [pgId]);

    useEffect(() => { fetchRules(); }, [fetchRules]);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const url = deleteTarget.type === 'policy'
                ? `/pgs/${pgId}/rules/sections/${deleteTarget.id}`
                : `/pgs/${pgId}/rules/items/${deleteTarget.id}`;

            await apiPrivate.delete(url);
            toast.success(`${deleteTarget.type === 'policy' ? 'Policy' : 'Rule'} deleted successfully`);
            fetchRules();
        } catch {
            toast.error("Deletion failed");
        } finally {
            setDeleteTarget(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Policies...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">Rules & Policies</h2>
                    <p className="text-muted-foreground font-medium">Define the code of conduct for your residents.</p>
                </div>
                <Button onClick={() => setOpenCreatePolicy(true)} className="rounded-full px-6 gap-2">
                    <Plus className="h-4 w-4" /> Create Category
                </Button>
            </div>

            {policies.length === 0 ? (
                <EmptyRulesState onCreate={() => setOpenCreatePolicy(true)} />
            ) : (
                <div className="space-y-4">
                    {policies.map((policy) => (
                        <PolicyAccordion
                            key={policy.id}
                            policy={policy}
                            onAddRule={() => setActivePolicyId(policy.id)}
                            onDeletePolicy={() => setDeleteTarget({ type: 'policy', id: policy.id })}
                            onDeleteRule={(ruleId: string) => setDeleteTarget({ type: 'rule', id: ruleId })}
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

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title={`Delete ${deleteTarget?.type === 'policy' ? 'Policy Category' : 'Rule'}?`}
                description="This action is irreversible and will update the tenant portal immediately."
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}