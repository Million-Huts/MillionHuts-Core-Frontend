import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const phone = formData.get("phone")?.toString().trim();
        const password = formData.get("password")?.toString();
        const confirmPassword = formData.get("confirmPassword")?.toString();

        if (!name || !email || !phone || !password) {
            setError("Please fill in all required fields.");
            setSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setSubmitting(false);
            return;
        }

        try {
            await api.post("/auth/register", { name, email, phone, password });
            navigate("/login", { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-xl"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Create account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Join us today and start managing your PG</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                        >
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input name="name" placeholder="Full Name" className="pl-10" />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input name="email" type="email" placeholder="Email Address" className="pl-10" />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input name="phone" placeholder="Phone Number" className="pl-10" />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base mt-2" disabled={submitting}>
                        {submitting ? "Creating account..." : "Get Started"}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}