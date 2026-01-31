import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Hook to fetch dashboard statistics
 */
export const useStats = () => {
    return useQuery({
        queryKey: ['stats', 'dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/api/stats/dashboard');
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refetch every minute
    });
};

/**
 * Hook to fetch document statistics
 */
export const useDocumentStats = () => {
    return useQuery({
        queryKey: ['stats', 'documents'],
        queryFn: async () => {
            const { data } = await api.get('/api/stats/documents');
            return data.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch user statistics
 */
export const useUserStats = () => {
    return useQuery({
        queryKey: ['stats', 'users'],
        queryFn: async () => {
            const { data } = await api.get('/api/stats/users');
            return data.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Hook to fetch storage statistics
 */
export const useStorageStats = () => {
    return useQuery({
        queryKey: ['stats', 'storage'],
        queryFn: async () => {
            const { data } = await api.get('/api/stats/storage');
            return data.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

export default api;
