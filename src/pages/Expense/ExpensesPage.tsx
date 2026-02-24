import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import type { Expense } from "@/interfaces/expense";

import ExpenseTable from "@/components/expense/ExpenseTable";
import ExpenseFilters from "@/components/expense/ExpenseFilters";
import AddExpenseModal from "@/components/expense/AddExpenseModal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import ConfirmDeleteModal from "@/components/shared/ConfirmDeleteModal";

export default function ExpensesPage() {
    const { pgId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        search: "",
        category: "ALL",
        paymentMethod: "ALL",
        status: "ALL",
        fromDate: "",
        toDate: "",
    });

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = { page, limit: 10 };

            // Only add filters if they aren't "ALL" or empty
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "ALL") params[key] = value;
            });

            const res = await apiPrivate.get(`/pgs/${pgId}/expense`, { params });
            setExpenses(res.data.data || []);
            setTotalPages(res.data.meta?.totalPages || 1);
        } catch (err) {
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, [pgId, page, filters]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    useEffect(() => {
        if (searchParams.get("create") === "true")
            setModalOpen(true);
    }, [searchParams]);

    // 1. Modified delete trigger: Instead of calling API, it opens the modal
    const handleDeleteClick = (id: string) => {
        setSelectedExpenseId(id);
        setDeleteModalOpen(true);
    };

    // 2. The actual API call when confirmed
    const handleConfirmDelete = async () => {
        if (!selectedExpenseId) return;

        try {
            setLoading(true); // Optional: show loading while deleting
            await apiPrivate.delete(`/pgs/${pgId}/expense/${selectedExpenseId}`);
            toast.success("Expense deleted successfully");
            fetchExpenses();
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleteModalOpen(false);
            setSelectedExpenseId(null);
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Expense Tracker</h1>
                    <p className="text-muted-foreground text-sm">Manage and track your PG operations costs.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => navigate(`/pgs/${pgId}/expense/report`)}>
                        <FileText className="w-4 h-4" /> View Report
                    </Button>
                    <Button className="gap-2 shadow-lg" onClick={() => setModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* FILTERS SECTION */}
            <ExpenseFilters filters={filters} setFilters={setFilters} onApply={fetchExpenses} />

            {/* DATA TABLE */}
            <div className={`bg-card border rounded-xl shadow-sm overflow-hidden relative ${loading ? "min-h-[50vh]" : ""}`}>
                <LoadingOverlay isLoading={loading} message="Loading Expenses..." />
                <ExpenseTable
                    expenses={expenses}
                    onDelete={handleDeleteClick}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />

            </div>

            {/* MODAL */}
            <AddExpenseModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                pgId={pgId!}
                onRefresh={fetchExpenses}
            />

            {/* CONFIRM DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                title="Permanently Delete Expense?"
                description="This action cannot be undone. This will permanently remove the record from your ledger."
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}