import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { Lock, MailCheck, ShieldCheck } from "lucide-react";

type Step = "IDLE" | "VERIFYING" | "COMPLETING";

export default function ChangePasswordFlow() {
    const [step, setStep] = useState<Step>("IDLE");
    const [loading, setLoading] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [otp, setOtp] = useState("");

    const handleRequest = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/request", { currentPassword: currentPass });
            toast.success("Security token dispatched");
            setStep("VERIFYING");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Authentication failed");
        } finally { setLoading(false); }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/verify", { otp });
            setStep("COMPLETING");
        } catch {
            toast.error("Invalid token");
        } finally { setLoading(false); }
    };

    const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const newPassword = fd.get("newPassword") as string;
        const confirmPassword = fd.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) return toast.error("Password mismatch");
        setLoading(true);
        try {
            await apiPrivate.post("/auth/password/change/complete", { newPassword });
            toast.success("Identity re-secured");
            window.location.href = "/login";
        } catch { toast.error("Update rejected"); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Lock size={20} />
                </div>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Security Protocol</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update Credentials</p>
                </div>
            </div>

            {/* Step IDLE */}
            {step === "IDLE" && (
                <div className="space-y-4">
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Identity verification is required before credential modification.</p>
                    <div className="flex gap-3">
                        <Input type="password" placeholder="ENTER CURRENT PASSWORD" className="rounded-sm font-bold bg-muted/30" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
                        <Button onClick={handleRequest} disabled={!currentPass || loading} className="px-6 rounded-sm font-black uppercase tracking-widest text-[10px]">
                            {loading ? "SYNCING..." : "Next"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Step VERIFYING */}
            {step === "VERIFYING" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                        <MailCheck size={14} /> OTP SENT TO REGISTERED EMAIL
                    </div>
                    <div className="flex gap-3">
                        <Input placeholder="ENTER 6-DIGIT OTP" className="rounded-sm font-bold bg-muted/30 tracking-[0.5em] text-center" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <Button onClick={handleVerify} disabled={loading} className="rounded-sm font-black uppercase tracking-widest text-[10px]">Verify OTP</Button>
                    </div>
                </div>
            )}

            {/* Step COMPLETING */}
            {step === "COMPLETING" && (
                <form onSubmit={handleComplete} className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="password" name="newPassword" placeholder="NEW PASSWORD" required className="rounded-sm font-bold bg-muted/30" />
                        <Input type="password" name="confirmPassword" placeholder="CONFIRM PASSWORD" required className="rounded-sm font-bold bg-muted/30" />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-sm font-black uppercase tracking-widest text-[10px]" disabled={loading}>
                        <ShieldCheck size={14} className="mr-2" /> Commit New Credentials
                    </Button>
                </form>
            )}
        </div>
    );
}