import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User, Mail, Phone, Lock, Eye, EyeOff,
    Loader2, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const isPasswordMatch = formData.password === formData.confirmPassword && formData.password !== "";
    const isFormValid = formData.name && formData.email && formData.phone && formData.password.length >= 6 && isPasswordMatch;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        try {
            await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 bg-background">

            {/* Promotion / Banner Section (2/3) */}
            <div className="hidden lg:flex lg:col-span-2 relative bg-muted overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-primary/10" />
                <div className="relative z-10 w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="p-10 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-8"
                    >
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <Sparkles size={32} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight leading-tight">
                                Start your journey with <span className="text-primary">Million Huts</span> today.
                            </h1>
                            <ul className="space-y-4 text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                    Manage multiple properties with global tenant entities.
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                    Automate onboarding with digital KYC integrations.
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                    Premium bento-style dashboard for modern management.
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Auth Form Section (1/3) */}
            <div className="flex flex-col justify-center px-8 lg:px-12 py-12 relative overflow-y-auto">
                <div className="max-w-sm mx-auto w-full space-y-8">

                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
                        <p className="text-sm text-muted-foreground">Enter your details to get started with your PG.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            {/* Name Input */}
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    name="name" placeholder="Full Name"
                                    className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                    value={formData.name} onChange={handleChange} required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    name="email" type="email" placeholder="Email Address"
                                    className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                    value={formData.email} onChange={handleChange} required
                                />
                            </div>

                            {/* Phone Input */}
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    name="phone" placeholder="Phone Number"
                                    className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                    value={formData.phone} onChange={handleChange} required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    name="password" type={showPassword ? "text" : "password"} placeholder="Password"
                                    className="pl-10 pr-10 h-12 bg-muted/40 border-none rounded-xl"
                                    value={formData.password} onChange={handleChange} required
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm Password"
                                    className="pl-10 h-12 bg-muted/40 border-none rounded-xl"
                                    value={formData.confirmPassword} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Live Password Validation UI */}
                        <div className="p-3 rounded-xl bg-muted/30 border text-[10px] space-y-1 transition-all">
                            <div className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                                {formData.password.length >= 6 ? <CheckCircle2 size={12} /> : <div className="h-1 w-1 rounded-full bg-muted-foreground" />}
                                Password (min 6 chars)
                            </div>
                            <div className={`flex items-center gap-2 ${isPasswordMatch ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                                {isPasswordMatch ? <CheckCircle2 size={12} /> : <div className="h-1 w-1 rounded-full bg-muted-foreground" />}
                                Passwords must match
                            </div>
                        </div>

                        <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/10" disabled={loading || !isFormValid}>
                            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </Button>
                    </form>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>

                    <div className="pt-8 text-center text-[10px] text-muted-foreground opacity-50 uppercase tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck size={12} /> Secure Cloud Encryption
                    </div>
                </div>
            </div>
        </div>
    );
}