import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { apiPrivate, setCurrentPGId } from "@/lib/api";
import type { PGSummary } from "@/interfaces/pg";

interface PGContextType {
    pgs: PGSummary[];
    currentPG: PGSummary | null;
    loading: boolean;
    setPGs: (pgs: PGSummary[]) => void;
    setPGsFromAuth: (pgs: PGSummary[]) => void;
    refreshPGs: () => Promise<void>;
    switchPG: (pgId: string) => void;
}

const PGContext = createContext<PGContextType | undefined>(undefined);

const STORAGE_KEY = "selected_pg_id";

export function PGProvider({ children }: { children: ReactNode }) {
    const [pgs, setPGsState] = useState<PGSummary[]>([]);
    const [currentPG, setCurrentPG] = useState<PGSummary | null>(null);
    const [loading, setLoading] = useState(true);

    /* =====================================================
       APPLY CURRENT PG
    ===================================================== */

    const applyCurrentPG = (pgList: PGSummary[]) => {
        if (!pgList.length) {
            setCurrentPG(null);
            setCurrentPGId(null);
            return;
        }

        const storedId = localStorage.getItem(STORAGE_KEY);

        const selected =
            storedId && pgList.find((pg) => pg.id === storedId);

        const pgToUse = selected || pgList[0];

        setCurrentPG(pgToUse);
        setCurrentPGId(pgToUse.id);
    };

    /* =====================================================
       SET FROM AUTH (/auth/me)
    ===================================================== */

    const setPGsFromAuth = (pgList: PGSummary[]) => {
        setPGsState(pgList);
        applyCurrentPG(pgList);
        setLoading(false);
    };

    /* =====================================================
       REFRESH PGs FROM API
    ===================================================== */

    const refreshPGs = async () => {
        try {
            const res = await apiPrivate.get("/pg");

            const pgList = res.data.data.pgs as PGSummary[];

            setPGsState(pgList);
            applyCurrentPG(pgList);
        } catch (err) {
            console.error("Failed to refresh PGs", err);
        }
    };

    /* =====================================================
       SWITCH PG
    ===================================================== */

    const switchPG = (pgId: string) => {
        const pg = pgs.find((p) => p.id === pgId);
        if (!pg) return;

        setCurrentPG(pg);
        setCurrentPGId(pgId);

        localStorage.setItem(STORAGE_KEY, pgId);
    };

    /**
  * Set PG list and auto-select current PG
  */
    const setPGs = (list: PGSummary[]) => {
        setPGsState(list);

        if (list.length === 0) {
            setCurrentPG(null);
            return;
        }

        const storedId =
            localStorage.getItem(STORAGE_KEY);

        const matched =
            storedId &&
            list.find((pg) => pg.id === storedId);

        const selected = matched || list[0];

        setCurrentPG(selected || null);

        if (selected) {
            localStorage.setItem(
                STORAGE_KEY,
                selected.id
            );
        }
    };

    return (
        <PGContext.Provider
            value={{
                pgs,
                setPGs,
                currentPG,
                loading,
                setPGsFromAuth,
                refreshPGs,
                switchPG,
            }}
        >
            {children}
        </PGContext.Provider>
    );
}

export function usePG() {
    const ctx = useContext(PGContext);
    if (!ctx) throw new Error("usePG must be used within PGProvider");
    return ctx;
}
