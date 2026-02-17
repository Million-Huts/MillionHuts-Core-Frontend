import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { api, apiPrivate, setUnauthorizedHandler } from "@/lib/api";
import type { UserType } from "@/interfaces/UserType";
import { usePG } from "./PGContext";

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const { setPGsFromAuth } = usePG();

    /* =====================================================
       FETCH ME
    ===================================================== */

    const fetchMe = async () => {
        try {
            const res = await apiPrivate.get("/auth/me");

            const { user, pgs } = res.data.data;

            setUser(user);
            setPGsFromAuth(pgs || []);
        } catch {
            setUser(null);
            setPGsFromAuth([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    /* =====================================================
       UNAUTHORIZED HANDLER
    ===================================================== */

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setUser(null);
            setPGsFromAuth([]);
        });
    }, [setPGsFromAuth]);

    /* =====================================================
       LOGIN
    ===================================================== */

    const login = async (credentials: {
        email: string;
        password: string;
    }) => {
        const res = await api.post("/auth/login", credentials);

        const { user, pgs } = res.data.data;

        setUser(user);
        setPGsFromAuth(pgs || []);
    };

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = async () => {
        try {
            await apiPrivate.post("/auth/logout");
        } finally {
            setUser(null);
            setPGsFromAuth([]);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
