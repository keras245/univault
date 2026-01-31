import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // 'dark' ou 'light'

            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                    // Appliquer le thème au body
                    document.body.className = newTheme;
                    return { theme: newTheme };
                });
            },

            setTheme: (theme) => {
                document.body.className = theme;
                set({ theme });
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
