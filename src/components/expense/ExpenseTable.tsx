import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ExpenseTable({ expenses, onDelete, page, setPage, totalPages }: any) {
    const statusColors: any = { PAID: "bg-green-100 text-green-700", PENDING: "bg-yellow-100 text-yellow-700", FAILED: "bg-red-100 text-red-700" };

    return (
        <div>
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Expense Details</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No records found matching your filters.</TableCell></TableRow>
                    ) : (
                        expenses.map((e: any) => (
                            <TableRow key={e.id}>
                                <TableCell>
                                    <p className="font-semibold text-sm">{e.title}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(e.paymentDate).toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-[10px]">{e.category}</Badge></TableCell>
                                <TableCell className="text-right font-bold text-slate-900">₹{e.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-xs">{e.paymentMethod.replace('_', ' ')}</TableCell>
                                <TableCell><Badge className={`text-[10px] border-none ${statusColors[e.status]}`}>{e.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        {e.billUrl && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={e.billUrl} target="_blank" rel="noreferrer"><Eye className="w-4 h-4 text-blue-600" /></a>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(e.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t flex items-center justify-between bg-muted/20">
                <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    );
}