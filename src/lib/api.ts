import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const PRIMARY_API = import.meta.env.VITE_API_URL;
const BACKUP_API = import.meta.env.VITE_BACKUP_API_URL;

let ACTIVE_BASE_URL = PRIMARY_API;


const checkServer = async (url: string) => {
    try {
        let finalUrl = url;
        if (url.endsWith('/api/v1'))
            finalUrl = url.split('/api/v1')[0];
        await axios.get(finalUrl, { timeout: 3000 });
        return true;
    } catch {
        return false;
    }
};

export const initApiBase = async () => {
    const isPrimaryUp = await checkServer(PRIMARY_API);

    if (isPrimaryUp) {
        ACTIVE_BASE_URL = PRIMARY_API;
        console.log("✅ Using PRIMARY backend");
    } else {
        const isBackupUp = await checkServer(BACKUP_API);

        if (isBackupUp) {
            ACTIVE_BASE_URL = BACKUP_API;
            console.log("⚠️ Primary down, switched to BACKUP");
        } else {
            console.error("❌ Both backends are down");
        }
    }

    // Update axios instances dynamically
    api.defaults.baseURL = ACTIVE_BASE_URL;
    apiPrivate.defaults.baseURL = ACTIVE_BASE_URL;
};

/* =====================================================
    TYPES & CONFIG
===================================================== */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/* =====================================================
    STATE FOR QUEUEING
===================================================== */
let isRefreshing = false;
let failedQueue: {
    resolve: (token?: string) => void;
    reject: (error: any) => void;
}[] = [];

/**
 * Iterates through the queue to resolve or reject pending requests
 */
const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

/* =====================================================
    INSTANCES
===================================================== */
export const api = axios.create({
    baseURL: ACTIVE_BASE_URL,
    withCredentials: true,
});

export const apiPrivate = axios.create({
    baseURL: ACTIVE_BASE_URL,
    withCredentials: true,
});



/* =====================================================
    GLOBAL HANDLERS & HELPERS
===================================================== */
let onUnauthorized: (() => void) | null = null;
let currentPGId: string | null = null;

export const setUnauthorizedHandler = (cb: () => void) => {
    onUnauthorized = cb;
};

export const setCurrentPGId = (pgId: string | null) => {
    currentPGId = pgId;
};

/* =====================================================
    REQUEST INTERCEPTOR — PG ID INJECTION
===================================================== */
apiPrivate.interceptors.request.use((config) => {
    if (!config.url) return config;

    if (currentPGId && config.url.includes(":pgId")) {
        config.url = config.url.replace(":pgId", currentPGId);
    }

    return config;
});

/* =====================================================
    RESPONSE INTERCEPTOR — ATOMIC REFRESH
===================================================== */
apiPrivate.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const status = error.response?.status;

        // Trigger on 401 (Unauthorized) or 403 (Forbidden/Expired)
        // Ensure we aren't already retrying or hitting the refresh/login endpoints
        if (
            (status === 401 || status === 403) &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {

            // IF ALREADY REFRESHING: Add this request to the queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiPrivate(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            // START REFRESH PROCESS
            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                api.post("/auth/refresh")
                    .then(() => {
                        processQueue(null); // Resolve all pending requests in queue
                        resolve(apiPrivate(originalRequest));
                    })
                    .catch((refreshError) => {
                        processQueue(refreshError); // Reject all pending requests
                        onUnauthorized?.(); // Force logout in AuthContext
                        reject(refreshError);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default apiPrivate;