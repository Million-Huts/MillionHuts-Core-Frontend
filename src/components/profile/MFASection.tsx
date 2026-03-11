import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Fingerprint, Info, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog";

export default function MFASection() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
    const [otp, setOtp] = useState("");
    const [showIntro, setShowIntro] = useState(false);

    const initiateMFA = async () => {
        setLoading(true);
        try {
            const res = await apiPrivate.post("/users/mfa/setup");
            setSetupData(res.data);
            setShowIntro(false);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary"><Fingerprint size={20} /></div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest">Two-Factor Authentication</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enhanced Identity Protection</p>
                    </div>
                </div>
                <Badge variant={user?.mfaEnabled ? "default" : "secondary"} className="rounded-full px-4">
                    {user?.mfaEnabled ? "ACTIVE" : "INACTIVE"}
                </Badge>
            </div>

            {/* Intro Dialog */}
            <Dialog open={showIntro} onOpenChange={setShowIntro}>
                <DialogContent className="rounded-sm border-border p-8 max-h-[90vh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-lg font-black tracking-tighter">
                            <Info className="text-primary" /> What is 2FA?
                        </DialogTitle>
                        <DialogDescription className="space-y-4 pt-4 text-xs font-medium leading-relaxed">
                            <p>2FA (Two-Factor Authentication) adds a second layer of security by requiring a code from your phone in addition to your password.</p>
                            <div className="grid grid-cols-2 gap-4 py-2">
                                {['Google Authenticator', 'Authy', 'Microsoft Auth', '2FAS'].map((app) => (
                                    <div key={app} className="flex items-center gap-2 p-3 bg-muted/50 rounded-sm font-bold text-[10px]">
                                        <Smartphone size={14} /> {app}
                                    </div>
                                ))}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setShowIntro(false)}>Close</Button>
                        <Button onClick={initiateMFA} disabled={loading} className="rounded-sm font-black uppercase tracking-widest text-[10px]">
                            {loading ? "Syncing..." : "Continue to Setup"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {!user?.mfaEnabled && !setupData && (
                <div className="p-6 rounded-sm bg-muted/30 border border-border flex items-center justify-between gap-6">
                    <p className="text-[11px] font-medium text-muted-foreground max-w-sm">
                        Secure your account identity with time-based one-time passwords (TOTP).
                    </p>
                    <Button onClick={() => setShowIntro(true)} className="rounded-sm font-black uppercase tracking-widest text-[10px]">Enable MFA</Button>
                </div>
            )}

            {setupData && (
                <div className="space-y-6 p-8 bg-card border rounded-sm animate-in zoom-in-95">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <img src={setupData.qrCode} alt="MFA QR" className="w-32 h-32 rounded-sm border-4 border-border" />
                        <div className="space-y-4 flex-1 w-full">
                            <h4 className="font-black text-[10px] uppercase tracking-widest">1. Scan & Verify</h4>
                            <div className="flex gap-3">
                                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="ENTER 6-DIGIT CODE" className="rounded-sm font-bold tracking-[0.5em] text-center" />
                                <Button onClick={verifyMFA} className="px-8 rounded-sm font-black uppercase tracking-widest text-[10px]">Activate</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {user?.mfaEnabled && (
                <div className="flex justify-between items-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-sm]">
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={16} /> Account Security Optimized
                    </div>
                    <Button variant="secondary" size="sm" onClick={disableMFA} className="rounded-sm text-destructive font-bold text-[10px] uppercase">Disable</Button>
                </div>
            )}
        </div>
    );
}