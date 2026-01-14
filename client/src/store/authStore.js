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
