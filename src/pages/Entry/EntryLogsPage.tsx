"use client";

import { useState, useEffect } from "react";
import {
    Plus, Filter, Search, ShieldCheck, ClipboardList,
    ChevronLeft, ChevronRight, Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { apiPrivate } from "@/lib/api";
import type { EntryLog } from "@/interfaces/entry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import toast from "react-hot-toast";
import { EntryCard } from "@/components/entry/EntryCard";
import { CreateEntryModal } from "@/components/entry/CreateEntryModal";
import { usePG } from "@/context/PGContext";
import { cn } from "@/lib/utils";

export default function EntriesPage() {
    const { currentPG } = usePG();
    const pgId = currentPG?.id;

    const [entries, setEntries] = useState<EntryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modals/Sheets
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);

    // Filters State
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    useEffect(() => {
        if (pgId) fetchEntries();
    }, [pgId, typeFilter, statusFilter, date, page]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const res = await apiPrivate.get(`/pgs/${pgId}/entries`, {
                params: {
                    type: typeFilter !== "ALL" ? typeFilter : undefined,
                    status: statusFilter !== "ALL" ? statusFilter : undefined,
                    date: date ? format(date, "yyyy-MM-dd") : undefined,
                    page,
                    limit
                }
            });
            setEntries(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch {
            toast.error("Failed to load logs");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (entryId: string, action: string) => {
        try {
            await apiPrivate.patch(`/pgs/${pgId}/entries/${entryId}/${action}`);
            toast.success(`Entry ${action}ed`);
            fetchEntries();
        } catch {
            toast.error("Action failed");
        }
    };

    // Shared Filter Controls Component to avoid repetition
    const FilterControls = () => (
        <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setPage(1); }}>
                    <SelectTrigger className="h-11 w-full lg:w-[160px] rounded-sm bg-muted/20 border-border">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Categories</SelectItem>
                        <SelectItem value="VISITOR">Visitors</SelectItem>
                        <SelectItem value="DELIVERY">Deliveries</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                    <SelectTrigger className="h-11 w-full lg:w-[160px] rounded-sm bg-muted/20 border-border">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                        <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "h-11 w-full lg:w-[200px] justify-start text-left font-normal rounded-sm bg-muted/20 border-border",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setPage(1); }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Button
                    variant="ghost"
                    className="text-xs font-bold uppercase tracking-tighter text-muted-foreground"
                    onClick={() => {
                        setTypeFilter("ALL");
                        setStatusFilter("ALL");
                        setDate(new Date());
                        setPage(1);
                    }}
                >
                    Reset
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen pb-24 lg:pb-20">
            {/* HEADER SECTION */}
            <div className="sticky top-0 z-30 bg-background/80 p-4 backdrop-blur-xl lg:px-8 lg:py-6 border-b border-border/40">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight lg:text-4xl">Gate Logs</h1>
                        <p className="text-sm font-bold text-muted-foreground">MillionHuts Security Console</p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="h-12 rounded-sm shadow-xl shadow-primary/20 px-6 font-black uppercase tracking-widest"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        <span>New Entry</span>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search bar always visible */}
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name or phone..."
                            className=" rounded-sm border-border bg-muted/30 pl-11 focus:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:block">
                        <FilterControls />
                    </div>

                    {/* Mobile Filter Trigger */}
                    <Button
                        variant="outline"
                        className="flex w-full items-center justify-between rounded-sm border-border bg-muted/30 lg:hidden h-11"
                        onClick={() => setFilterOpen(true)}
                    >
                        <div className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <span className="font-bold">Filters & Date</span>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>
                    </Button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="px-4 lg:px-8 mt-8">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : entries.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {entries.map((entry) => (
                                <EntryCard key={entry.id} entry={entry} onAction={handleAction} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <span className="text-sm font-bold">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-border py-20 px-6 text-center glass">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 ring-8 ring-muted/20">
                            <ShieldCheck className="h-12 w-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">No Entries Found</h3>
                        <p className="mx-auto mt-2 max-w-[280px] text-sm font-medium text-muted-foreground">
                            Try adjusting your filters or search terms for {date ? format(date, "PP") : "this period"}.
                        </p>
                        <Button
                            variant="secondary"
                            className="mt-8 rounded-sm font-bold uppercase tracking-widest px-8"
                            onClick={() => setCreateOpen(true)}
                        >
                            <ClipboardList className="mr-2 h-4 w-4" /> Create First Log
                        </Button>
                    </div>
                )}
            </div>

            {/* MOBILE FILTER DRAWER (Left Side) */}
            <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
                <SheetContent side="left" className="px-3 w-[300px] border-r border-border bg-background sm:w-[400px]">
                    <SheetHeader className="mb-8 border-b pb-4">
                        <SheetTitle className="text-2xl font-black">Filter Logs</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-8">
                        <FilterControls />
                        <Button className="w-full h-12 rounded-sm font-bold" onClick={() => setFilterOpen(false)}>
                            Show Results
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* CREATE MODAL */}
            <CreateEntryModal
                open={isCreateOpen}
                onClose={() => setCreateOpen(false)}
                pgId={pgId as string}
                onSuccess={fetchEntries}
            />
        </div>
    );
}

// Simple Badge component if not already in your UI folder
function Badge({ children, className }: any) {
    return (
        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", className)}>
            {children}
        </span>
    );
}