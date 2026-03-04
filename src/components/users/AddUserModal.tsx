import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

export const AddUserModal = ({ open, setOpen, form, setForm, onSubmit }: any) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    Add Staff Member
                </DialogTitle>
                <DialogDescription>
                    Create a profile for your PG staff. They will be able to manage tickets based on their role.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 ..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">System Role</Label>
                    <Select value={form.role} onValueChange={val => setForm({ ...form, role: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MANAGER">Manager (Full Access)</SelectItem>
                            <SelectItem value="STAFF">Staff (Ticket Management)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full font-bold h-11" onClick={onSubmit}>
                    Create Account
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);