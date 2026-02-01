import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Code, FileText, Save } from 'lucide-react';
import { servicesAPI } from '../../config/api';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './ServiceModal.css';

const ServiceModal = ({ isOpen, onClose, service = null, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!service;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || '',
                code: service.code || '',
                description: service.description || '',
                isActive: service.isActive !== undefined ? service.isActive : true
            });
        } else {
            setFormData({
                name: '',
                code: '',
                description: '',
                isActive: true
            });
        }
        setErrors({});
    }, [service, isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Le code est requis';
        } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
            newErrors.code = 'Le code doit contenir uniquement des lettres majuscules, chiffres et underscores';
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
            if (isEditMode) {
                await servicesAPI.update(service._id, formData);
                toast.success('Service modifié avec succès');
            } else {
                await servicesAPI.create(formData);
                toast.success('Service créé avec succès');
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
        let finalValue = value;

        // Auto-uppercase pour le code
        if (name === 'code') {
            finalValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="modal-overlay"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-container"
                >
                    <div className="modal-header modal-header--orange">
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <Building2 size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">
                                    {isEditMode ? 'Modifier le service' : 'Nouveau service'}
                                </h2>
                                <p className="modal-subtitle">
                                    {isEditMode ? 'Modifier les informations du service' : 'Ajouter un nouveau service'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="modal-section">
                            <div className="modal-section-header">
                                <div className="modal-section-icon modal-section-icon--orange">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="modal-section-title">Informations du service</h3>
                            </div>

                            <div className="modal-form-grid">
                                <Input
                                    label="Nom du service"
                                    type="text"
                                    name="name"
                                    placeholder="Scolarité"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    leftIcon={<Building2 size={18} />}
                                    required
                                />

                                <Input
                                    label="Code"
                                    type="text"
                                    name="code"
                                    placeholder="SCOL"
                                    value={formData.code}
                                    onChange={handleChange}
                                    error={errors.code}
                                    leftIcon={<Code size={18} />}
                                    required
                                />
                            </div>

                            <div className="input-wrapper">
                                <label className="input-label">Description</label>
                                <div className="input-container">
                                    <span className="input-icon input-icon--left">
                                        <FileText size={18} />
                                    </span>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="input input--with-left-icon service-textarea"
                                        placeholder="Description du service..."
                                        rows="3"
                                    />
                                </div>
                            </div>

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
                                    Service actif
                                </label>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                size="medium"
                                onClick={onClose}
                                fullWidth
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                isLoading={loading}
                                fullWidth
                                leftIcon={<Save size={16} />}
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

export default ServiceModal;
