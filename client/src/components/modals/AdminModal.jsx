import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Building2, Shield, Eye, EyeOff, Lock, UserPlus } from 'lucide-react';
import { usersAPI } from '../../config/api';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './AdminModal.css';

const AdminModal = ({ isOpen, onClose, admin = null, onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const isEditMode = !!admin;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        service: 'Scolarité',
        role: 'admin',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (admin) {
            setFormData({
                firstName: admin.firstName || '',
                lastName: admin.lastName || '',
                email: admin.email || '',
                password: '',
                service: admin.service || 'Scolarité',
                role: admin.role || 'admin',
                isActive: admin.isActive !== undefined ? admin.isActive : true
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                service: 'Scolarité',
                role: 'admin',
                isActive: true
            });
        }
        setErrors({});
        setShowPassword(false);
    }, [admin, isOpen]);

    const services = [
        'Scolarité',
        'Comptabilité',
        'Ressources Humaines',
        'Génie Informatique',
        'Droit',
        'Administration',
        'Autre'
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!isEditMode && !formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        }

        if (formData.password && formData.password.length < 6) {
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

        setLoading(true);

        try {
            const dataToSend = { ...formData };
            
            if (isEditMode && !dataToSend.password) {
                delete dataToSend.password;
            }

            if (isEditMode) {
                await usersAPI.update(admin._id, dataToSend);
                toast.success('Administrateur modifié avec succès');
            } else {
                await usersAPI.create(dataToSend);
                toast.success('Administrateur créé avec succès');
            }

            onSuccess();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="modal-overlay"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-container"
                >
                    {/* Header */}
                    <div className="modal-header">
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <UserPlus size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">
                                    {isEditMode ? 'Modifier l\'administrateur' : 'Nouvel administrateur'}
                                </h2>
                                <p className="modal-subtitle">
                                    {isEditMode ? 'Modifier les informations du compte' : 'Ajouter un nouveau compte administrateur'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="modal-form">
                        {/* Section: Informations personnelles */}
                        <div className="modal-section">
                            <div className="modal-section-header">
                                <div className="modal-section-icon modal-section-icon--blue">
                                    <User size={20} />
                                </div>
                                <h3 className="modal-section-title">Informations personnelles</h3>
                            </div>

                            <div className="modal-form-grid">
                                <Input
                                    label="Prénom"
                                    type="text"
                                    name="firstName"
                                    placeholder="Prénom"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    leftIcon={<User size={18} />}
                                    required
                                />

                                <Input
                                    label="Nom"
                                    type="text"
                                    name="lastName"
                                    placeholder="Nom de famille"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    leftIcon={<User size={18} />}
                                    required
                                />
                            </div>

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="admin@universite.edu.gn"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                leftIcon={<Mail size={18} />}
                                required
                            />

                            <div className="modal-form-grid">
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        Service <span className="input-required">*</span>
                                    </label>
                                    <div className="input-container">
                                        <span className="input-icon input-icon--left">
                                            <Building2 size={18} />
                                        </span>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="input input--with-left-icon modal-select"
                                        >
                                            {services.map(service => (
                                                <option key={service} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-wrapper">
                                    <label className="input-label">
                                        Rôle <span className="input-required">*</span>
                                    </label>
                                    <div className="input-container">
                                        <span className="input-icon input-icon--left">
                                            <Shield size={18} />
                                        </span>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="input input--with-left-icon modal-select"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="super-admin">Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Sécurité */}
                        <div className="modal-section">
                            <div className="modal-section-header">
                                <div className="modal-section-icon modal-section-icon--red">
                                    <Lock size={20} />
                                </div>
                                <h3 className="modal-section-title">Sécurité</h3>
                            </div>

                            <Input
                                label={`Mot de passe ${isEditMode ? '(laisser vide pour ne pas modifier)' : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                leftIcon={<Lock size={18} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="modal-password-toggle"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />

                            <div className="modal-checkbox">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="modal-checkbox-input"
                                />
                                <label htmlFor="isActive" className="modal-checkbox-label">
                                    Compte actif
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="modal-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                size="large"
                                onClick={onClose}
                                fullWidth
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                isLoading={loading}
                                fullWidth
                            >
                                {isEditMode ? 'Modifier' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AdminModal;
