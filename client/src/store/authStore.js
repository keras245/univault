import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // Connexion
            login: (user, token) => {
                localStorage.setItem('token', token);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },

            // Déconnexion
            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            // Mettre à jour l'utilisateur
            updateUser: (user) => {
                set({ user });
            },

            // 👇 Ajoute ici
            verifyToken: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ user: null, token: null, isAuthenticated: false });
                    return;
                }
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        localStorage.removeItem('token');
                        set({ user: null, token: null, isAuthenticated: false });
                    }
                } catch {
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partiallyPersist: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
