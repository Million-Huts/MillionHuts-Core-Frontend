import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    form: {
        name: string;
        phone: string;
        email: string;
        role: string;
        staffType: string;
    };
    setForm: Dispatch<SetStateAction<{
        name: string;
        phone: string;
        email: string;
        role: string;
        staffType: string;
    }>>;
    onSubmit: () => Promise<string | undefined>
}

export const AddUserModal = ({ open, setOpen, form, setForm, onSubmit }: Props) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-sm border border-border p-8 shadow-2xl max-h-[90vh] overflow-y-scroll">
            <DialogHeader className="mb-6">
                <DialogTitle className="flex items-center gap-3 text-xl font-black tracking-tighter">
                    <div className="p-2 bg-slate-950 rounded-full">
                        <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    Add Staff Member
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium text-xs mt-2 uppercase tracking-wide">
                    Create a secure profile for property staff.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                <div className="grid gap-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</Label>
                    <Input
                        placeholder="John Doe"
                        className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email</Label>
                    <Input
                        placeholder="example@mail.com"
                        className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                        value={form.email}
                        type="email"
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                </div>


                <div className="grid gap-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone Number</Label>
                    <Input
                        placeholder="+91 ..."
                        className="rounded-sm border-border bg-muted/30 font-bold focus:ring-primary/20"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Role</Label>
                    <Select value={form.role} onValueChange={val => setForm({ ...form, role: val })}>
                        <SelectTrigger className="h-12 rounded-sm border-border bg-muted/30 font-bold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-border">
                            <SelectItem value="MANAGER" className="font-bold">MANAGER (FULL ACCESS)</SelectItem>
                            <SelectItem value="STAFF" className="font-bold">STAFF (TICKET MANAGEMENT)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {form.role === "STAFF" && (
                    <div className="grid gap-2">
                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">StaffType</Label>
                        <Select value={form.staffType} onValueChange={val => setForm({ ...form, staffType: val })}>
                            <SelectTrigger className="h-12 rounded-sm border-border bg-muted/30 font-bold">
                                <SelectValue placeholder="Choose Staff Role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-sm border-border">
                                <SelectItem value="SECURITY" className="font-bold">SECURITY</SelectItem>
                                <SelectItem value="CLEANING" className="font-bold">CLEANING</SelectItem>
                                <SelectItem value="MESS" className="font-bold">MESS</SelectItem>
                                <SelectItem value="MAINTENANCE" className="font-bold">MAINTENANCE</SelectItem>
                                <SelectItem value="OTHERS" className="font-bold">OTHERS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}


                <Button
                    className="w-full h-12 rounded-sm font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 mt-4"
                    onClick={onSubmit}
                >
                    Create Account
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);