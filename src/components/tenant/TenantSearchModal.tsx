import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiPrivate } from "@/lib/api";
import TenantSearchResults from "./TenantSearchResults";
import CreateTempTenantForm from "./CreateTempTenantForm";
import CreateTenantStayForm from "./CreateTenantStayForm";
import type { Tenant } from "@/pages/Tenant/Tenants";

interface Props {
    open: boolean;
    onClose: () => void;
    onTenantAdded: (tenant: Tenant) => void;
}

export default function TenantSearchModal({
    open,
    onClose,
    onTenantAdded,
}: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Tenant[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [creatingTemp, setCreatingTemp] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchTenants = async () => {
            const res = await apiPrivate.get(`/tenants/search?q=${query}`);
            setResults(res.data.tenants || []);
        };

        fetchTenants();
    }, [query]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Tenant</DialogTitle>
                </DialogHeader>

                {!selectedTenant && !creatingTemp && (
                    <>
                        <Input
                            placeholder="Search by email or phone"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {results.length > 0 ? (
                            <TenantSearchResults
                                tenants={results}
                                onSelect={setSelectedTenant}
                            />
                        ) : (
                            query && (
                                <div className="text-sm text-gray-500">
                                    No tenant found
                                    <Button
                                        variant="link"
                                        onClick={() => setCreatingTemp(true)}
                                    >
                                        Create temporary profile
                                    </Button>
                                </div>
                            )
                        )}
                    </>
                )}

                {creatingTemp && (
                    <CreateTempTenantForm
                        onCreated={(tenant) => {
                            setSelectedTenant(tenant);
                            setCreatingTemp(false);
                        }}
                    />
                )}

                {selectedTenant && (
                    <CreateTenantStayForm
                        tenant={selectedTenant}
                        onCreated={() => {
                            onTenantAdded(selectedTenant);
                            onClose();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
