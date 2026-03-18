import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    User, Lock, Loader2, ShieldCheck,
    CheckCircle2, AlertCircle,
    MailQuestion,
} from "lucide-react";
import toast from "react-hot-toast";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type AuthStep = "IDENTIFY" | "PASSWORD" | "MFA" | "VERIFY_NOTICE" | "SET_PASSWORD_OTP" | "SET_PASSWORD_FORM";

interface UserData {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}


export default function LoginPage() {
    const { fetchMe } = useAuth();
    const navigator = useNavigate();

    const [step, setStep] = useState<AuthStep>("IDENTIFY");
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [otp, setOtp] = useState("");


    // 1. Identify User & Determine Logic Flow
    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login/identify", { identifier });
            const { nextStep, user } = res.data;
            setUserData(user);

            // Explicit backend match
            if (nextStep === "PASSWORD_SETUP_VERIFY") {
                setStep("SET_PASSWORD_OTP");
            } else if (nextStep === "VERIFY_EMAIL") {
                setStep("VERIFY_NOTICE");
            } else {
                setStep("PASSWORD");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "User not found");
        } finally {
            setLoading(false);
        }
    };

    // 2. Verification Step for New/Missing Passwords
    const handleVerifyForSetup = async () => {
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", {
                userId: userData?.id,
                otp,
                process: "PASSWORD_CREATION"
            });
            setOtp("");
            setStep("SET_PASSWORD_FORM");
            toast.success("Identity verified! Now set your password.");
        } catch (err) {
            toast.error("Invalid verification code");
        } finally {
            setLoading(false);
        }
    };

    // 3. Set the New Password
    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/create-password", { userId: userData?.id, password });
            toast.success("Account setup complete!");
            navigator('/dashboard');
        } catch (err) {
            toast.error("Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    // 4. Standard Password Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login/password", { userId: userData?.id, password });
            if (res.data.nextStep === "MFA_REQUIRED") setStep("MFA");
            else {
                toast.success("Welcome back!");
                await fetchMe();
                navigator('/dashboard');
            }
        } catch (err) {
            toast.error("Incorrect password");
        } finally {
            setLoading(false);
        }
    };

    //5. Login with mfa code
    const handleMFA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login/mfa", { userId: userData?.id, code: otp });
            if (res.status === 200) {
                toast.success("Welcome back!");
                await fetchMe();
                navigator('/dashboard')
            }
        } catch (err) {
            toast.error("Incorrect code!");
        } finally {
            setLoading(false);
        }
    }

    // 6. Request Verification Email
    const handleSendVerification = async () => {
        setLoading(true);
        try {
            await api.post("/auth/send-verification", { userId: userData?.id });
            toast.success("Verification code sent to your email");
        } catch (err) {
            toast.error("Failed to send code");
        } finally {
            setLoading(false);
        }
    };

    // 7. Request Verification Email
    const handleVerifyForEmail = async () => {
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", {
                userId: userData?.id,
                otp,
                process: "EMAIL_VERIFICATION"
            });
            setOtp('')
            setStep("PASSWORD");
            toast.success("Identity verified! Login Now.");
        } catch (err) {
            toast.error("Invalid verification code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 bg-background">
            {/* Promotion / Banner Section */}
            <div className="hidden lg:flex lg:col-span-2 relative bg-muted overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10" />
                <div className="relative z-10 w-full max-w-2xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                            <CheckCircle2 size={28} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Simplify your Property Management.</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Automate rent tracking, verify tenants instantly, and manage Million Huts properties from one premium dashboard.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Auth Section */}
            <div className="flex flex-col justify-center px-8 lg:px-12 py-12">
                <div className="max-w-sm mx-auto w-full space-y-8">

                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">Million Huts</h2>
                        <p className="text-sm text-muted-foreground">Manage your properties with ease.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "IDENTIFY" && (
                            <motion.div key="identify" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                <form onSubmit={handleIdentify} className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <Input
                                            placeholder="Email or Phone"
                                            className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/10" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                                    </Button>
                                </form>
                                <p className="text-center text-sm text-muted-foreground">
                                    New here? <Link to="/register" className="text-primary font-bold">Create Account</Link>
                                </p>
                            </motion.div>
                        )}

                        {step !== "IDENTIFY" && userData && (
                            <motion.div key="steps" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                {/* Profile Header Card */}
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="text-primary" size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm truncate">{userData.name}</h3>
                                        <p className="text-[11px] text-muted-foreground truncate">{userData.email || userData.phone}</p>
                                    </div>
                                    <button onClick={() => setStep("IDENTIFY")} className="text-xs font-medium text-primary hover:underline">Change</button>
                                </div>

                                {/* --- Step: Standard Password --- */}
                                {step === "PASSWORD" && (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                            <Input
                                                type="password" placeholder="Enter password"
                                                className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <Button className="w-full h-12 font-bold rounded-xl" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                                        </Button>
                                        <Link to="/forgot" className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
                                    </form>
                                )}

                                {/* --- Step: Email Verification Notice & OTP --- */}
                                {step === "VERIFY_NOTICE" && (
                                    <div className="space-y-6">
                                        <div className="bg-orange-500/10 text-orange-600 p-4 rounded-xl flex gap-3 text-left items-start">
                                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                            <p className="text-sm font-medium">Your email is not verified. Please verify to continue login.</p>
                                        </div>

                                        {/* If user hasn't requested the code yet, show the "Send" button */}
                                        {!otp.length && (
                                            <Button
                                                onClick={handleSendVerification}
                                                className="w-full h-12 gap-2 font-bold rounded-xl"
                                                variant="outline"
                                                disabled={loading}
                                            >
                                                <MailQuestion size={18} /> {loading ? "Sending..." : "Send Verification Code"}
                                            </Button>
                                        )}

                                        {/* Once they are ready to enter the code */}
                                        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="space-y-2 text-center">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Enter Verification Code</h4>
                                            </div>

                                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <InputOTPSlot key={i} index={i} className="h-12 w-10 border-2 rounded-lg" />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>

                                            <Button
                                                className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/10"
                                                onClick={handleVerifyForEmail}
                                                disabled={otp.length < 6 || loading}
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue to Login"}
                                            </Button>

                                            <button
                                                onClick={handleSendVerification}
                                                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                                            >
                                                Resend Code
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- Step: Password Setup Verification (OTP FIRST) --- */}
                                {step === "SET_PASSWORD_OTP" && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-500/10 text-blue-600 p-4 rounded-xl flex gap-3 items-start">
                                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                            <p className="text-xs leading-relaxed">Password not set. Please verify your identity with the code sent to your email to continue.</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-6">
                                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <InputOTPSlot key={i} index={i} className="h-12 w-10 border-2 rounded-lg" />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <Button className="w-full h-12 font-bold rounded-xl" onClick={handleVerifyForSetup} disabled={otp.length < 6 || loading}>
                                                Verify Identity
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* --- Step: Password Setup Form (AFTER OTP) --- */}
                                {step === "SET_PASSWORD_FORM" && (
                                    <form onSubmit={handleSetPassword} className="space-y-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm">Create your password</h4>
                                            <p className="text-xs text-muted-foreground">Your identity is verified. Now secure your account.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <Input
                                                type="password" placeholder="New Password"
                                                className="h-12 bg-muted/40 border-none rounded-xl"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Input
                                                type="password" placeholder="Confirm Password"
                                                className="h-12 bg-muted/40 border-none rounded-xl"
                                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/30 border text-[10px] space-y-1">
                                            <div className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                <CheckCircle2 size={12} /> Min 6 characters
                                            </div>
                                            <div className={`flex items-center gap-2 ${password === confirmPassword && password !== "" ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                <CheckCircle2 size={12} /> Passwords match
                                            </div>
                                        </div>
                                        <Button className="w-full h-12 font-bold rounded-xl" disabled={loading || password !== confirmPassword || password.length < 6}>
                                            Finish Setup
                                        </Button>
                                    </form>
                                )}

                                {/* --- Step: MFA --- */}
                                {step === "MFA" && (
                                    <form onSubmit={handleMFA} className="space-y-6 flex flex-col items-center">
                                        <ShieldCheck className="text-primary mb-2" size={32} />
                                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                                    <InputOTPSlot key={i} index={i} className="h-12 w-10 border-2 rounded-lg" />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <Button className="w-full h-12 font-bold rounded-xl" type="submit" disabled={otp.length < 6 || loading}>
                                            Verify & Login
                                        </Button>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}