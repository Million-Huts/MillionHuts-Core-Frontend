import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";
import type { UserType } from "@/interfaces/UserType";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: Props) {
    const { user, setUser } = useAuth();
    const [name, setName] = useState<string>(user?.name ?? "")
    const [email, setEmail] = useState<string>(user?.email ?? "")
    const [phone, setPhone] = useState<string>(user?.phone ?? "")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload: Record<string, any> = {};
            if (name !== user?.name) payload.name = name;
            if (email !== user?.email) payload.email = email;
            if (phone !== user?.phone) payload.phone = phone;

            if (Object.keys(payload).length === 0) {
                return toast.error("Change any of the fields to update profile");
            }

            const res = await apiPrivate.patch('/users/profile', payload);
            const userData: UserType = res.data.user;
            setUser(userData);
            toast.success("Profile Updated Successfully!");
        } catch (error) {
            console.log(error);
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="ml-1 mb-2">Username</Label>
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="ml-1 mb-2">Email</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="ml-1 mb-2">Contact</Label>
                        <Input
                            name="phone"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
