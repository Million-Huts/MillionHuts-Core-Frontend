import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1'; // Your Express URL

// Create the public instance (for login/register)
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Create the private instance (with interceptors)
export const apiPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Response interceptor to handle token expiration
apiPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;

        // 1. Only attempt refresh if it's a 401 AND it's not a retry
        // 2. IMPORTANT: Do not attempt refresh if the failed request WAS the refresh call itself!
        if (error?.response?.status === 401 && !prevRequest?._retry && !prevRequest?.url?.includes('/auth/refresh')) {
            prevRequest._retry = true;

            try {
                await api.post('/auth/refresh');
                return apiPrivate(prevRequest);
            } catch (refreshError) {
                // If refresh fails, we must clear local state and reject
                // Don't do window.location.href here, handle it in Context
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);