import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

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
    baseURL: BASE_URL,
    withCredentials: true,
});

export const apiPrivate = axios.create({
    baseURL: BASE_URL,
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