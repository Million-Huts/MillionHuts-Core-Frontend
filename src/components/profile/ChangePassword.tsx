import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const currentPass = fd.get("currentPassword") as string;
        const newPass = fd.get("newPassword") as string;
        const confirmPass = fd.get("confirmPassword") as string;

        if (newPass.length < 6) return toast.error("Password too short!");
        if (newPass !== confirmPass) return toast.error("Passwords do not match!");

        setLoading(true);
        try {
            await apiPrivate.patch('/users/change-password', { currentPass, newPass });
            toast.success("Password updated successfully!");
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error changing password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div className="space-y-1">
                    <label className="text-xs font-medium ml-1">Current Password</label>
                    <Input type="password" name="currentPassword" required />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium ml-1">New Password</label>
                    <Input type="password" name="newPassword" required />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium ml-1">Confirm New Password</label>
                    <Input type="password" name="confirmPassword" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </div>
    );
}