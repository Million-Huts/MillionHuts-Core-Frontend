import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Fingerprint } from "lucide-react";
import toast from "react-hot-toast";

export default function MFASection() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
    const [otp, setOtp] = useState("");

    const initiateMFA = async () => {
        setLoading(true);
        try {
            const res = await apiPrivate.post("/users/mfa/setup");
            setSetupData(res.data);
        } catch (err) { toast.error("MFA initiation failed"); }
        finally { setLoading(false); }
    };

    const verifyMFA = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/users/mfa/verify", { token: otp });
            setUser({ ...user, mfaEnabled: true });
            setSetupData(null);
            toast.success("MFA Enabled!");
        } catch (err) { toast.error("Invalid OTP code"); }
        finally { setLoading(false); }
    };

    const disableMFA = async () => {
        setLoading(true);
        try {
            await apiPrivate.post("/users/mfa/disable");
            setUser({ ...user, mfaEnabled: false });
            toast.success("MFA Disabled");
        } catch (err) { toast.error("Failed to disable MFA"); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><Fingerprint size={20} /></div>
                    <h3 className="text-xl font-bold">2-Factor Authentication</h3>
                </div>
                <Badge variant={user?.mfaEnabled ? "default" : "secondary"}>
                    {user?.mfaEnabled ? "Enabled" : "Disabled"}
                </Badge>
            </div>

            {!user?.mfaEnabled && !setupData && (
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-accent/30 border border-dashed">
                    <p className="text-sm text-muted-foreground flex-1">
                        Add an extra layer of security to your account by using an authenticator app (like Google Authenticator or Authy).
                    </p>
                    <Button onClick={initiateMFA} disabled={loading} className="rounded-full px-8">Enable MFA</Button>
                </div>
            )}

            {setupData && (
                <div className="space-y-4 p-6 bg-accent/20 rounded-3xl border animate-in zoom-in-95">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <img src={setupData.qrCode} alt="MFA QR" className="w-40 h-40 rounded-xl border-4 border-white shadow-lg" />
                        <div className="space-y-2 flex-1">
                            <h4 className="font-semibold text-sm">1. Scan the QR code</h4>
                            <p className="text-xs text-muted-foreground">Scan this image in your authenticator app, or enter the secret manually: <code className="bg-background px-1 rounded">{setupData.secret}</code></p>
                            <h4 className="font-semibold text-sm mt-4">2. Enter verification code</h4>
                            <div className="flex gap-2">
                                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" />
                                <Button onClick={verifyMFA}>Activate</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {user?.mfaEnabled && (
                <div className="flex justify-between items-center p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
                    <div className="flex items-center gap-3 text-green-600">
                        <ShieldCheck size={20} />
                        <span className="text-sm font-medium">Your account is secured with 2FA</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={disableMFA} className="text-destructive hover:bg-destructive/10">Disable</Button>
                </div>
            )}
        </div>
    );
}