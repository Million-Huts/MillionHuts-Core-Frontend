import axios, {
    AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

/* =====================================================
   PUBLIC INSTANCE
===================================================== */
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

/* =====================================================
   PRIVATE INSTANCE
===================================================== */
export const apiPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

/* =====================================================
   GLOBAL HANDLERS
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
   TYPES
===================================================== */

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/* =====================================================
   REQUEST INTERCEPTOR — PG ID INJECTION
===================================================== */

apiPrivate.interceptors.request.use((config) => {
    if (!config.url) return config;

    /**
     * Replace :pgId placeholder automatically
     *
     * Example:
     * /pg/:pgId/floors  ->  /pg/123/floors
     */
    if (currentPGId && config.url.includes(":pgId")) {
        config.url = config.url.replace(":pgId", currentPGId);
    }

    return config;
});

/* =====================================================
   RESPONSE INTERCEPTOR — TOKEN REFRESH
===================================================== */

apiPrivate.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const prevRequest = error.config as CustomAxiosRequestConfig;

        const status = error.response?.status;

        if (
            status === 401 &&
            !prevRequest?._retry &&
            !prevRequest?.url?.includes("/auth/refresh")
        ) {
            prevRequest._retry = true;

            try {
                await api.post("/auth/refresh");
                return apiPrivate(prevRequest);
            } catch (refreshError) {
                onUnauthorized?.();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiPrivate;
