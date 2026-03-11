import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, ShieldCheck, Search, ChevronRight } from "lucide-react";
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

    const filteredUsers = users.filter(member =>
        member.user.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] max-h-[85vh] flex flex-col p-0 overflow-y-scroll rounded-sm border-none shadow-2xl">
                <div className="p-8 pb-4">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <UserCheck className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter">
                            Assign Responsibility
                        </DialogTitle>
                        <DialogDescription className="text-base font-medium text-muted-foreground">
                            Select a staff member to resolve this ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative mt-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search staff by name or role..."
                            className="pl-11 bg-muted/50 border-none rounded-sm font-medium focus-visible:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3 custom-scrollbar min-h-[250px]">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((member) => (
                            <button
                                key={member.user.id}
                                onClick={() => onAssign(member.user.id)}
                                className="w-full flex items-center justify-between p-4 rounded-sm border-2 border-transparent bg-muted/30 hover:bg-primary/5 hover:border-primary/20 transition-all group text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-sm bg-background shadow-sm border border-border flex items-center justify-center font-black text-primary text-lg">
                                        {member.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-foreground leading-tight">
                                            {member.user.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                                            <ShieldCheck className="w-3 h-3 text-primary" />
                                            {member.role}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-sm">
                                    <ChevronRight className="w-5 h-5 text-primary" />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground font-bold tracking-tight uppercase text-xs tracking-widest">No matching staff found</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end">
                    <Button variant="ghost" className="rounded-sm px-6 font-bold" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}