import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiPrivate } from "@/lib/api";

export default function ChangePassword() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const confirmPass = formData.get("confirmPassword");
        const payload = {
            currentPass: formData.get("currentPassword"),
            newPass: formData.get("newPassword"),
        };

        const isMatch = payload.newPass === confirmPass;
        if (!isMatch) return toast.error("New Passwords do not match!");

        try {
            await apiPrivate.patch('/users/change-password', payload);
            toast.success("Password Changed Successfully!")
        } catch (error) {
            toast.error("Error while changing password!")
        }

    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <Input
                    type="password"
                    name="currentPassword"
                    placeholder="Current password"
                />
                <Input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                />
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                />

                <Button type="submit">Update Password</Button>
            </form>
        </div>
    );
}
