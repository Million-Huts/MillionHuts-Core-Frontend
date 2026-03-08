import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Lock,
    LifeBuoy
} from "lucide-react";
import toast from "react-hot-toast";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";

type ForgotStep = "IDENTIFY" | "VERIFY" | "RESET";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<ForgotStep>("IDENTIFY");
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [userId, setUserId] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    // 1. Send Recovery OTP
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/password/forgot", { identifier });
            setUserId(res.data.userId);
            setStep("VERIFY");
            toast.success("Recovery code sent!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "User not found");
        } finally {
            setLoading(false);
        }
    };

    // 2. Verify OTP
    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", { userId, otp, process: "PASSWORD_RESET" });
            setStep("RESET");
        } catch (err: any) {
            toast.error("Invalid or expired code");
        } finally {
            setLoading(false);
        }
    };

    // 3. Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            await api.post("/auth/create-password", { userId, password });
            toast.success("Password reset successfully!");
            navigate("/login");
        } catch (err: any) {
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 bg-background">

            {/* Banner Section (2/3) - Themed for Recovery */}
            <div className="hidden lg:flex lg:col-span-2 relative bg-muted overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-primary/5" />
                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-6"
                    >
                        <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-600 shadow-inner">
                            <LifeBuoy size={32} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Don't worry, we've got you covered.</h1>
                            <p className="text-lg text-muted-foreground">
                                Follow the simple steps to regain access to your Million Huts dashboard. Security is our top priority.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Auth Section (1/3) */}
            <div className="flex flex-col justify-center px-8 lg:px-16 py-12 relative">
                <div className="max-w-sm mx-auto w-full space-y-8">

                    <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">Reset Password</h2>
                        <p className="text-sm text-muted-foreground">
                            {step === "IDENTIFY" && "Enter your details to receive a recovery code."}
                            {step === "VERIFY" && "Enter the 6-digit code sent to your inbox."}
                            {step === "RESET" && "Create a new strong password for your account."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* STEP 1: IDENTIFY */}
                        {step === "IDENTIFY" && (
                            <motion.form
                                key="id" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleIdentify} className="space-y-4"
                            >
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        placeholder="Email or Phone number"
                                        className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/10" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Send Recovery Code"}
                                </Button>
                            </motion.form>
                        )}

                        {/* STEP 2: VERIFY OTP */}
                        {step === "VERIFY" && (
                            <motion.div
                                key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex flex-col items-center"
                            >
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <InputOTPSlot key={i} index={i} className="h-12 w-11 border-2 rounded-xl text-lg font-bold" />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button className="w-full h-12 font-bold rounded-xl" onClick={handleVerifyOTP} disabled={otp.length < 6 || loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
                                </Button>
                                <button
                                    onClick={handleIdentify}
                                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                                >
                                    Didn't receive a code? Resend
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: NEW PASSWORD */}
                        {step === "RESET" && (
                            <motion.form
                                key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleResetPassword} className="space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            type="password" placeholder="New Password"
                                            className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            type="password" placeholder="Confirm Password"
                                            className="pl-10 h-12 bg-muted/50 border-none rounded-xl"
                                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Validation Visuals */}
                                <div className="p-4 rounded-xl bg-muted/30 border text-[11px] space-y-2">
                                    <div className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {password.length >= 6 ? <CheckCircle2 size={12} /> : <div className="h-1 w-1 rounded-full bg-current" />} Minimum 6 characters
                                    </div>
                                    <div className={`flex items-center gap-2 ${password === confirmPassword && password !== "" ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {password === confirmPassword && password !== "" ? <CheckCircle2 size={12} /> : <div className="h-1 w-1 rounded-full bg-current" />} Passwords match
                                    </div>
                                </div>

                                <Button className="w-full h-12 font-bold rounded-xl" disabled={loading || password !== confirmPassword || password.length < 6}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Reset & Continue"}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}