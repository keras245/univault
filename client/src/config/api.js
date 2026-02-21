import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer une instance Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Erreur de réponse du serveur
            const { status, data } = error.response;

            if (status === 401) {
                // Token expiré ou invalide
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            // Retourner le message d'erreur du serveur
            return Promise.reject(data);
        } else if (error.request) {
            // Pas de réponse du serveur
            return Promise.reject({
                success: false,
                message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
            });
        } else {
            // Erreur lors de la configuration de la requête
            return Promise.reject({
                success: false,
                message: 'Une erreur est survenue.',
            });
        }
    }
);

export default api;

// === API ENDPOINTS ===

// Authentification
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    changePassword: (passwords) => api.put('/auth/change-password', passwords),
    logout: () => api.post('/auth/logout'),
};

// Documents
export const documentsAPI = {
    upload: (formData) => api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params) => api.get('/documents', { params }),
    getById: (id) => api.get(`/documents/${id}`),
    update: (id, data) => api.put(`/documents/${id}`, data),
    delete: (id) => api.delete(`/documents/${id}`),
    addVersion: (id, formData) => api.post(`/documents/${id}/version`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


// Courriers RH
export const lettersAPI = {
    create: (data) => api.post('/letters', data),
    getAll: (params) => api.get('/letters', { params }),
    getByReference: (reference) => api.get(`/letters/${reference}`),
    process: (id, data) => api.put(`/letters/${id}/process`, data),
    getPending: () => api.get('/letters/pending'),
};

// Recherche
export const searchAPI = {
    search: (params) => api.get('/search', { params }),
    getSuggestions: (params) => api.get('/search/suggestions', { params }),
};

// Utilisateurs
export const usersAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getStats: () => api.get('/users/stats'),
};

// Stats
export const statsAPI = {
    getDashboard: () => api.get('/stats/dashboard'),
};

// Services
export const servicesAPI = {
    getAll: () => api.get('/services'),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
};

// Students (Étudiants)
export const studentsAPI = {
    getAll: (params) => api.get('/students', { params }),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    getStats: () => api.get('/students/stats'),
    importExcel: (formData) => api.post('/students/import/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    getAllDocuments: (params) => api.get('/students/all-documents', { params }),
};

// Student Documents
export const studentDocumentsAPI = {
    getByStudent: (studentId) => api.get(`/students/${studentId}/documents`),
    upload: (studentId, formData) => api.post(`/students/${studentId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (studentId, docId) => api.delete(`/students/${studentId}/documents/${docId}`),
};
