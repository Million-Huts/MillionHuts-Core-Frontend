import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { Lock, MailCheck } from "lucide-react";

type Step = "IDLE" | "REQUESTING" | "VERIFYING" | "COMPLETING";

export default function ChangePasswordFlow() {
    const [step, setStep] = useState<Step>("IDLE");
    const [loading, setLoading] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [otp, setOtp] = useState("");

    // 1. Request OTP
    const handleRequest = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/request", { currentPassword: currentPass });
            toast.success("Verification code sent to email");
            setStep("VERIFYING");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Check your current password");
        } finally { setLoading(false); }
    };

    // 2. Verify OTP
    const handleVerify = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/verify", { otp });
            setStep("COMPLETING");
        } catch (err: any) {
            toast.error("Invalid verification code");
        } finally { setLoading(false); }
    };

    // 3. Complete Change
    const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newPassword = fd.get("newPassword") as string;
        const confirmPassword = fd.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) return toast.error("Passwords don't match");

        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/complete", { newPassword });
            toast.success("Password changed! Please login again.");
            // Logic to logout user
            window.location.href = "/login";
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally { setLoading(false); }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Lock size={20} /></div>
                <h3 className="text-xl font-bold">Security Settings</h3>
            </div>

            {step === "IDLE" && (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">To change your password, we'll need to verify your identity first.</p>
                    <div className="flex gap-2">
                        <Input
                            type="password"
                            placeholder="Current Password"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                        />
                        <Button onClick={handleRequest} disabled={!currentPass || loading}>
                            {loading ? "..." : "Next"}
                        </Button>
                    </div>
                </div>
            )}

            {step === "VERIFYING" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <MailCheck size={18} /> Enter the 6-digit code sent to your email
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Verification Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button onClick={handleVerify} disabled={loading}>Verify</Button>
                    </div>
                </div>
            )}

            {step === "COMPLETING" && (
                <form onSubmit={handleComplete} className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="password" name="newPassword" placeholder="New Password" required minLength={6} />
                        <Input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>Update & Relogin</Button>
                </form>
            )}
        </div>
    );
}