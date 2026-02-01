import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Building2,
    Users,
    CheckCircle,
    XCircle,
    Code
} from 'lucide-react';
import { servicesAPI } from '../../config/api';
import toast from 'react-hot-toast';
import ServiceModal from './ServiceModal';
import Button from '../ui/Button';
import './ServicesManagement.css';

const ServicesManagement = ({ searchTerm }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll();
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const filteredServices = services.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleDelete = async (service) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le service ${service.name} ?`)) {
            return;
        }

        try {
            await servicesAPI.delete(service._id);
            toast.success('Service supprimé avec succès');
            fetchServices();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setSelectedService(null);
        fetchServices();
    };

    return (
        <div className="services-management">
            {/* Stats + Button */}
            <div className="services-header">
                <div className="services-stats">
                    <div className="services-stat-card">
                        <div className="services-stat-content">
                            <div>
                                <p className="services-stat-label">Total</p>
                                <p className="services-stat-value">{services.length}</p>
                            </div>
                            <div className="services-stat-icon services-stat-icon--orange">
                                <Building2 size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="services-stat-card">
                        <div className="services-stat-content">
                            <div>
                                <p className="services-stat-label">Actifs</p>
                                <p className="services-stat-value" style={{ color: 'var(--color-success)' }}>
                                    {services.filter(s => s.isActive).length}
                                </p>
                            </div>
                            <div className="services-stat-icon services-stat-icon--green">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="services-stat-card">
                        <div className="services-stat-content">
                            <div>
                                <p className="services-stat-label">Inactifs</p>
                                <p className="services-stat-value" style={{ color: 'var(--color-error)' }}>
                                    {services.filter(s => !s.isActive).length}
                                </p>
                            </div>
                            <div className="services-stat-icon services-stat-icon--red">
                                <XCircle size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="medium"
                    onClick={handleCreate}
                    leftIcon={<Plus size={18} />}
                >
                    Nouveau Service
                </Button>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="services-table-container"
            >
                {loading ? (
                    <div className="services-loading">
                        <div className="services-loading-spinner"></div>
                        <p className="services-loading-text">Chargement...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="services-empty">
                        <Building2 className="services-empty-icon" size={48} />
                        <p className="services-empty-text">
                            {searchTerm ? 'Aucun service trouvé' : 'Aucun service'}
                        </p>
                    </div>
                ) : (
                    <table className="services-table">
                        <thead className="services-table-header">
                            <tr>
                                <th>Service</th>
                                <th>Code</th>
                                <th>Description</th>
                                <th>Statut</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="services-table-body">
                            <AnimatePresence>
                                {filteredServices.map((service, index) => (
                                    <motion.tr
                                        key={service._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td>
                                            <div className="services-table-service">
                                                <div className="services-table-icon">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="services-table-service-name">
                                                        {service.name}
                                                    </p>
                                                    {service.responsable && (
                                                        <p className="services-table-service-resp">
                                                            <Users size={12} />
                                                            {service.responsable.firstName} {service.responsable.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="services-code-badge">
                                                <Code size={14} />
                                                {service.code}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="services-description">
                                                {service.description || '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`services-badge ${
                                                service.isActive ? 'services-badge--active' : 'services-badge--inactive'
                                            }`}>
                                                {service.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {service.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="services-table-actions">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="services-action-btn services-action-btn--edit"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service)}
                                                    className="services-action-btn services-action-btn--delete"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </motion.div>

            <ServiceModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedService(null);
                }}
                service={selectedService}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default ServicesManagement;
