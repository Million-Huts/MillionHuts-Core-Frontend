import { api, apiPrivate } from '../lib/api';

export const loginUser = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

// Example of a protected call
export const getProfile = async () => {
    const response = await apiPrivate.get('/auth/profile');
    return response.data;
};