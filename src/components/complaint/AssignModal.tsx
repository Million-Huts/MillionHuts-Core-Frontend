import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { PGUser } from "@/interfaces/pgUsers";

interface AssignModalProps {
    isOpen: boolean;
    users: PGUser[];
    onClose: () => void;
    onAssign: (userId: string) => void;
}

export default function AssignModal({ isOpen, users, onClose, onAssign }: AssignModalProps) {
    const [search, setSearch] = useState("");

    // Updated filtering to handle nested user object
    const filteredUsers = users.filter(member =>
        member.user.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-indigo-600" />
                            Assign Responsibility
                        </DialogTitle>
                        <DialogDescription>
                            Select a staff member to handle this complaint.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative my-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search staff by name..."
                            className="pl-9 bg-slate-50 border-slate-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 custom-scrollbar">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((member) => (
                            <button
                                key={member.user.id}
                                onClick={() => onAssign(member.user.id)}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                        {member.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                                            {member.user.name}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <ShieldCheck className="w-3 h-3" />
                                            {member.role}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Assign
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-slate-400 text-sm">No staff members found.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-end">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}