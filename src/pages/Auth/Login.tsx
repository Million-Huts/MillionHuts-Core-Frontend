import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { user, loading, login } = useAuth();

    /* =====================================================
       Redirect if already logged in
    ===================================================== */

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, loading, navigate]);

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

        const email = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            setError("Email and password are required");
            setSubmitting(false);
            return;
        }

        try {
            await login({ email, password });

            toast.success("Login successful");

            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Invalid credentials";

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
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        autoComplete="email"
                    />

                    <div className="relative">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                    >
                        {submitting ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
