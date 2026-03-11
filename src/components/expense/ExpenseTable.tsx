import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Expense } from "@/interfaces/expense";
import type { Dispatch, SetStateAction } from "react";

type Props = {
    expenses: Expense[];
    onDelete: (id: string) => void
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
}

export default function ExpenseTable({ expenses, onDelete, page, setPage, totalPages }: Props) {
    const statusColors: any = {
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        FAILED: "bg-rose-50 text-rose-700 border-rose-200"
    };

    return (
        <div className="rounded-sm overflow-x-scroll border border-border/50">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black tracking-widest text-[10px] uppercase">Expense Details</TableHead>
                        <TableHead className="font-black tracking-widest text-[10px] uppercase">Category</TableHead>
                        <TableHead className="font-black tracking-widest text-[10px] uppercase text-right">Amount</TableHead>
                        <TableHead className="font-black tracking-widest text-[10px] uppercase">Payment</TableHead>
                        <TableHead className="font-black tracking-widest text-[10px] uppercase">Status</TableHead>
                        <TableHead className="text-right font-black tracking-widest text-[10px] uppercase">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-20 text-muted-foreground font-medium">
                                No records found matching your filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map((e: any) => (
                            <TableRow key={e.id} className="hover:bg-muted/20 transition-colors">
                                <TableCell>
                                    <p className="font-bold text-sm">{e.title}</p>
                                    <p className="text-xs font-medium text-muted-foreground">{new Date(e.paymentDate).toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell><Badge variant="secondary" className="rounded-full font-bold text-[10px]">{e.category}</Badge></TableCell>
                                <TableCell className="text-right font-black text-primary">₹{e.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-xs font-bold text-muted-foreground">{e.paymentMethod.replace('_', ' ')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`font-bold text-[10px] border ${statusColors[e.status]}`}>
                                        {e.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        {e.billUrl && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                                                <a href={e.billUrl} target="_blank" rel="noreferrer"><Eye className="w-4 h-4" /></a>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-destructive" onClick={() => onDelete(e.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t flex items-center justify-between bg-muted/10">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" className="rounded-full" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    );
}