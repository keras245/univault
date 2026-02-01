import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { authAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data.data;

            // Sauvegarder dans le store
            login(user, token);

            toast.success(`Bienvenue ${user.firstName} !`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Erreur de connexion:', error);
            toast.error(error.message || 'Email ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="login-gradient login-gradient-1"></div>
                <div className="login-gradient login-gradient-2"></div>
                <div className="login-gradient login-gradient-3"></div>
            </div>

            {/* Theme Toggle */}
            <div className="login-theme-toggle">
                <ThemeToggle />
            </div>

            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <div className="login-logo-icon">🏛️</div>
                        <h1 className="login-logo-text gradient-text">UniVault</h1>
                    </div>
                    <p className="login-subtitle">
                        Système d'Archivage Numérique
                        <br />
                        <span className="text-muted">Université Nongo Conakry</span>
                    </p>
                </div>

                <Card variant="glass" padding="large" className="login-card">
                    <h2 className="login-title">Connexion</h2>
                    <p className="login-description">
                        Connectez-vous pour accéder à vos documents
                    </p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="votre.email@unc.edu"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            leftIcon={<Mail size={18} />}
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            leftIcon={<Lock size={18} />}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            isLoading={isLoading}
                            rightIcon={<LogIn size={18} />}
                        >
                            Se connecter
                        </Button>
                    </form>

                    <div className="login-footer">
                        <p className="text-sm text-muted">
                            Mot de passe oublié ? Contactez l'administrateur
                        </p>
                    </div>
                </Card>

                <p className="login-copyright">
                    © 2026 Université Nongo Conakry. Tous droits réservés.
                </p>
            </div>
        </div>
    );
};

export default Login;
