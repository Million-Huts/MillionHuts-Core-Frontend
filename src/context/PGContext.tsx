import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { apiPrivate } from "@/lib/api";
import type { PGSummary } from "@/interfaces/pg";

interface PGContextType {
    pgs: PGSummary[];
    currentPG: PGSummary | null;
    loading: boolean;
    switchPG: (pgId: string) => void;
    setPGs: (pgs: PGSummary[]) => void;
}

const PGContext = createContext<PGContextType | undefined>(undefined);

const STORAGE_KEY = "selected_pg_id";

export function PGProvider({ children }: { children: ReactNode }) {
    const [pgs, setPGs] = useState<PGSummary[]>([]);
    const [currentPG, setCurrentPG] = useState<PGSummary | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch PGs (minimal endpoint)
    useEffect(() => {
        const fetchPGs = async () => {
            try {
                const res = await apiPrivate.get("/pgs/summary"); // minimal list endpoint
                const pgList: PGSummary[] = res.data.pgs;

                setPGs(pgList);

                if (pgList.length === 0) {
                    setCurrentPG(null);
                    return;
                }

                const storedPGId = localStorage.getItem(STORAGE_KEY);
                const matchedPG =
                    storedPGId &&
                    pgList.find((pg) => pg.id === storedPGId);

                setCurrentPG(matchedPG || pgList[0]);
            } catch (err) {
                console.error("Failed to load PGs", err);
                setPGs([]);
                setCurrentPG(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPGs();
    }, []);

    const switchPG = (pgId: string) => {
        const pg = pgs.find((p) => p.id === pgId);
        if (!pg) return;

        setCurrentPG(pg);
        localStorage.setItem(STORAGE_KEY, pgId);
    };

    return (
        <PGContext.Provider
            value={{
                pgs,
                currentPG,
                loading,
                switchPG,
                setPGs,
            }}
        >
            {children}
        </PGContext.Provider>
    );
}

export function usePG() {
    const context = useContext(PGContext);
    if (!context) {
        throw new Error("usePG must be used within PGProvider");
    }
    return context;
}
