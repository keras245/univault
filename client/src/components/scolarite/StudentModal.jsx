import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Hash, Save } from 'lucide-react';
import { studentsAPI } from '../../config/api';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import '../../components/super-admin/AdminModal.css';

const StudentModal = ({ isOpen, onClose, student = null, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!student;

    const [formData, setFormData] = useState({
        matricule: '',
        firstName: '',
        lastName: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (student) {
            setFormData({
                matricule: student.matricule || '',
                firstName: student.firstName || '',
                lastName: student.lastName || ''
            });
        } else {
            setFormData({
                matricule: '',
                firstName: '',
                lastName: ''
            });
        }
        setErrors({});
    }, [student, isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!formData.matricule.trim()) {
            newErrors.matricule = 'Le matricule est requis';
        } else if (!/^\d{5}$/.test(formData.matricule) && !/^\d{7}$/.test(formData.matricule)) {
            newErrors.matricule = 'Le matricule doit contenir 5 ou 7 chiffres';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
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
                await studentsAPI.update(student._id, formData);
                toast.success('Étudiant modifié avec succès');
            } else {
                await studentsAPI.create(formData);
                toast.success('Étudiant créé avec succès');
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <User size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">
                                    {isEditMode ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
                                </h2>
                                <p className="modal-subtitle">
                                    {isEditMode ? 'Modifier les informations' : 'Ajouter un nouvel étudiant'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="modal-section">
                            <Input
                                label="Matricule"
                                type="text"
                                name="matricule"
                                placeholder="ex: 2100245 ou 90323"
                                value={formData.matricule}
                                onChange={handleChange}
                                error={errors.matricule}
                                leftIcon={<Hash size={18} />}
                                required
                                disabled={isEditMode}
                            />

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

export default StudentModal;
