import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
            {theme === 'dark' ? (
                <Sun size={20} className="theme-toggle-icon" />
            ) : (
                <Moon size={20} className="theme-toggle-icon" />
            )}
        </button>
    );
};

export default ThemeToggle;
