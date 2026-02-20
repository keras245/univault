import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileType, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../super-admin/Administrateur.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DocumentTypes = () => {
    const { user } = useAuthStore();
    const [documentTypes, setDocumentTypes] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        service: ''
    });
    const [stats, setStats] = useState({ total: 0 });

    useEffect(() => {
        fetchDocumentTypes();
        fetchServices();
    }, []);

    const fetchDocumentTypes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/document-types`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocumentTypes(response.data.data || []);
            setStats({ total: response.data.count || 0 });
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des types de documents');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.service) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (editingType) {
                await axios.put(
                    `${API_URL}/document-types/${editingType._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Type de document modifié avec succès');
            } else {
                await axios.post(
                    `${API_URL}/document-types`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Type de document créé avec succès');
            }

            setShowModal(false);
            setEditingType(null);
            setFormData({ name: '', service: '' });
            fetchDocumentTypes();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
        }
    };

    const handleEdit = (type) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            service: type.service._id
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce type de document ?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/document-types/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Type de document supprimé avec succès');
            fetchDocumentTypes();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingType(null);
        setFormData({ name: '', service: '' });
    };

    const filteredTypes = documentTypes.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-header"
                >
                    <div className="admin-header-top">
                        <div>
                            <h1 className="admin-header-title">
                                Types de Documents
                            </h1>
                            <p className="admin-header-subtitle">
                                Gérez les types de documents pour chaque service
                            </p>
                        </div>
                        <button className="btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={20} />
                            Ajouter un type
                        </button>
                    </div>

                    <div className="admin-search">
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un type de document..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </motion.div>

                <div className="admin-stats">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-stat-card"
                    >
                        <div className="admin-stat-content">
                            <div>
                                <p className="admin-stat-label">Total Types</p>
                                <p className="admin-stat-value">{stats.total}</p>
                            </div>
                            <div className="admin-stat-icon admin-stat-icon--blue">
                                <FileType size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="admin-content"
                >
                    {loading ? (
                        <div className="admin-loading">
                            <div className="admin-loading-spinner"></div>
                            <p className="admin-loading-text">Chargement...</p>
                        </div>
                    ) : filteredTypes.length === 0 ? (
                        <div className="admin-empty">
                            <FileType className="admin-empty-icon" size={64} />
                            <h3 className="admin-empty-title">Aucun type de document</h3>
                            <p className="admin-empty-text">Commencez par créer un type de document</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th>Nom</th>
                                        <th>Service</th>
                                        <th>Date de création</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-table-body">
                                    {filteredTypes.map((type) => (
                                        <tr key={type._id}>
                                            <td>
                                                <div className="admin-table-user">
                                                    <div className="admin-table-icon">
                                                        <FileType size={20} />
                                                    </div>
                                                    <div className="admin-table-user-info">
                                                        <p className="admin-table-user-name">{type.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="admin-badge admin-badge--admin">
                                                    {type.service?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(type.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        className="admin-action-btn admin-action-btn--edit"
                                                        onClick={() => handleEdit(type)}
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        className="admin-action-btn admin-action-btn--delete"
                                                        onClick={() => handleDelete(type._id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editingType ? 'Modifier le type' : 'Nouveau type de document'}
                                </h2>
                                <button className="modal-close" onClick={handleCloseModal}>×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label className="form-label">Nom du type</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Certificat de scolarité"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Service</label>
                                    <select
                                        className="form-input"
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un service</option>
                                        {services.map((service) => (
                                            <option key={service._id} value={service._id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingType ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default DocumentTypes;
