import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/interfaces/user";
import { UserCheck, ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AssignModalProps {
    isOpen: boolean;
    users: UserType[];
    onClose: () => void;
    onAssign: (userId: string) => void;
}

export default function AssignModal({ isOpen, users, onClose, onAssign }: AssignModalProps) {
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(u =>
        u.name!.toLowerCase().includes(search.toLowerCase()) ||
        u.role!.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                        Assign Responsibility
                    </DialogTitle>
                    <DialogDescription>
                        Select a staff member to handle this complaint.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative my-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search staff by name..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => onAssign(user.id!)}
                                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                        {user.name!.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <ShieldCheck className="w-3 h-3" />
                                            {user.role}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 pr-2">
                                    Assign
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-8 text-center text-slate-400 text-sm">
                            No staff members found.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button variant="ghost" onClick={onClose} className="text-slate-500">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}