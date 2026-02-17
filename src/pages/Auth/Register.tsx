import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    /* =====================================================
       Submit Handler
    ===================================================== */

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const phone = formData.get("phone")?.toString().trim();
        const password = formData.get("password")?.toString();
        const confirmPassword = formData
            .get("confirmPassword")
            ?.toString();

        /* ---------- Validation ---------- */

        if (!name || !email || !phone || !password || !confirmPassword) {
            toast.error("All fields are required");
            setSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setSubmitting(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            setSubmitting(false);
            return;
        }

        const payload = {
            name,
            email,
            phone,
            password,
        };

        /* ---------- API Call ---------- */

        try {
            const res = await api.post("/auth/register", payload);

            toast.success(res.data?.message || "Registration successful");

            // Redirect to login
            navigate("/login", { replace: true });
        } catch (err: any) {
            const message =
                err?.response?.data?.message || "Registration failed";

            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-semibold">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="Full Name" />

                    <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                    />

                    <Input name="phone" placeholder="Phone Number" />

                    {/* Password */}
                    <div className="relative">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((p) => !p)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                    >
                        {submitting ? "Creating..." : "Register"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
